import { ExtractedPage, DocumentChunk } from '../src/types';
import * as pdfParseModule from 'pdf-parse';
import mammoth from 'mammoth';
import { getGeminiClient } from './gemini';

const pdfParse: any = (pdfParseModule as any).default || pdfParseModule;

export interface ExtractionResult {
  pages: ExtractedPage[];
  chunks: DocumentChunk[];
  totalCharacters: number;
  isScannedDetected: boolean;
  ocrApplied: boolean;
  pageCount: number;
  fileType: string;
}

export async function extractDocumentContent(
  buffer: Buffer,
  filename: string,
  mimeType: string
): Promise<ExtractionResult> {
  const lowerName = filename.toLowerCase();
  const isPdf = mimeType.includes('pdf') || lowerName.endsWith('.pdf');
  const isDocx =
    mimeType.includes('word') ||
    mimeType.includes('officedocument') ||
    lowerName.endsWith('.docx') ||
    lowerName.endsWith('.doc');
  const isImage =
    mimeType.startsWith('image/') ||
    lowerName.endsWith('.png') ||
    lowerName.endsWith('.jpg') ||
    lowerName.endsWith('.jpeg') ||
    lowerName.endsWith('.webp');
  const isText =
    mimeType.includes('text') ||
    lowerName.endsWith('.txt') ||
    lowerName.endsWith('.md') ||
    lowerName.endsWith('.json') ||
    lowerName.endsWith('.csv');

  if (!isPdf && !isDocx && !isImage && !isText) {
    throw new Error(
      `Unable to extract content from this document: Unsupported file format "${mimeType || filename}". Please upload a PDF, DOCX, TXT, MD, or scanned image file.`
    );
  }

  let pages: ExtractedPage[] = [];
  let isScannedDetected = false;
  let ocrApplied = false;
  let detectedType = isPdf ? 'PDF Document' : isDocx ? 'Word Document (.docx)' : isImage ? 'Image / Scanned File' : 'Plain Text Document';

  // 1. DOCX Handling
  if (isDocx) {
    try {
      const result = await mammoth.extractRawText({ buffer });
      const rawText = result.value.trim();
      if (!rawText) {
        throw new Error('Word document contains no readable body text.');
      }
      pages = splitTextIntoLogicalPages(rawText, 'Section');
    } catch (docxErr: any) {
      throw new Error(
        `Unable to extract content from this document: Could not parse Word document structure (${docxErr.message}). Recovery: Try saving as an unencrypted .docx or .pdf and re-upload.`
      );
    }
  }

  // 2. Image / Scanned File Direct OCR
  else if (isImage) {
    ocrApplied = true;
    isScannedDetected = true;
    try {
      const ocrResult = await extractWithGeminiMultimodal(buffer, mimeType, filename);
      pages = ocrResult.pages;
    } catch (ocrErr: any) {
      throw new Error(
        `Unable to extract content from this document: Optical character recognition failed (${ocrErr.message}). Recovery: Ensure the image is high contrast and legible, or upload as a text PDF.`
      );
    }
  }

  // 3. PDF Handling (Native text extraction + Scanned OCR Fallback)
  else if (isPdf) {
    let pdfTextExtracted = '';
    let numPages = 1;
    let parseSucceeded = false;

    try {
      const data = await pdfParse(buffer);
      numPages = data.numpages || 1;
      pdfTextExtracted = (data.text || '').trim();
      parseSucceeded = true;
    } catch (pdfErr) {
      console.warn('[PDF-Parse Warning]', pdfErr);
      parseSucceeded = false;
    }

    // Check if PDF has real usable text or is a scanned image container
    const isVirtuallyEmpty = !parseSucceeded || pdfTextExtracted.length < 50 || /^[\s\n\r\t\f\0]*$/.test(pdfTextExtracted);

    if (isVirtuallyEmpty) {
      isScannedDetected = true;
      console.log(`[Extractor] PDF "${filename}" contains minimal native text (${pdfTextExtracted.length} chars). Triggering Gemini OCR...`);
      
      try {
        const ocrResult = await extractWithGeminiMultimodal(buffer, 'application/pdf', filename);
        pages = ocrResult.pages;
        ocrApplied = true;
      } catch (ocrErr: any) {
        // If OCR also fails, raise clear error
        throw new Error(
          `Unable to extract content from this document: Scanned PDF contains no computer-readable text and optical character recognition was unable to resolve clauses (${ocrErr.message}). Recovery: Upload a clear, high-resolution scan or searchable text PDF.`
        );
      }
    } else {
      // Normal native text PDF
      // Try to split on form-feeds or page headers
      const rawPageSplits = pdfTextExtracted.split(/\f|\n---\s*Page\s*\d+\s*---\n/);

      if (rawPageSplits.length >= numPages && numPages > 1) {
        pages = rawPageSplits
          .map((pageText, idx) => {
            const pageNum = idx + 1;
            const cleanedText = pageText.trim();
            return {
              pageNumber: pageNum,
              sourceLocation: `Page ${pageNum}`,
              text: cleanedText || `[Page ${pageNum} - Content parsed]`,
              charCount: cleanedText.length,
              isScannedDetected: cleanedText.length < 40,
            };
          })
          .filter((p) => p.text.length > 0);
      } else {
        // Divide by line clusters
        const lines = pdfTextExtracted.split('\n');
        const linesPerPage = Math.max(15, Math.ceil(lines.length / numPages));

        for (let p = 0; p < numPages; p++) {
          const pageLines = lines.slice(p * linesPerPage, (p + 1) * linesPerPage);
          const pageText = pageLines.join('\n').trim();
          const pageNum = p + 1;
          if (pageText.length > 0) {
            pages.push({
              pageNumber: pageNum,
              sourceLocation: `Page ${pageNum}`,
              text: pageText,
              charCount: pageText.length,
              isScannedDetected: pageText.length < 40,
            });
          }
        }
      }
    }
  }

  // 4. Plain Text / Markdown Handling
  else {
    const textContent = buffer.toString('utf-8').trim();
    if (!textContent || textContent.length < 5) {
      throw new Error(
        'Unable to extract content from this document: The uploaded file is empty (0 characters). Recovery: Check that your file has text before uploading.'
      );
    }
    pages = splitTextIntoLogicalPages(textContent, 'Page');
  }

  // Final check on extracted pages
  if (pages.length === 0 || pages.every((p) => p.text.trim().length === 0)) {
    throw new Error(
      'Unable to extract content from this document: No legible text or clauses could be identified. Recovery: Please provide a valid, uncorrupted document.'
    );
  }

  const totalCharacters = pages.reduce((sum, p) => sum + p.charCount, 0);
  const chunks = chunkPagesIntelligently(pages);

  return {
    pages,
    chunks,
    totalCharacters,
    isScannedDetected,
    ocrApplied,
    pageCount: pages.length,
    fileType: detectedType,
  };
}

async function extractWithGeminiMultimodal(
  buffer: Buffer,
  mimeType: string,
  filename: string
): Promise<{ pages: ExtractedPage[]; totalCharacters: number }> {
  const ai = getGeminiClient();
  if (!ai) {
    throw new Error('Gemini API key is not configured for scanned OCR extraction.');
  }

  const prompt = `You are a high-fidelity document optical character recognition (OCR) and clause segmentation engine for TransformX.
Your task is to transcribe and extract ALL text, tables, clause numbers, headings, dates, and figures verbatim from this uploaded document: "${filename}".

CRITICAL OCR RULES:
1. Extract ALL text verbatim. DO NOT summarize, hallucinate, or alter any numbers, dates, or penalties.
2. Structure the output into distinct pages using this exact delimiter format on its own line:
--- PAGE 1 ---
[verbatim text of page 1]
--- PAGE 2 ---
[verbatim text of page 2]
3. If there are tables, transcribe them cleanly with rows, column headers, and numbers preserved.
4. Output ONLY the delimited page text. Do not add conversational remarks or markdown codeblocks.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3.7-flash',
    contents: [
      {
        inlineData: {
          mimeType: mimeType.startsWith('image/') ? mimeType : 'application/pdf',
          data: buffer.toString('base64'),
        },
      },
      prompt,
    ],
  });

  const fullOcrText = response.text?.trim() || '';
  if (!fullOcrText || fullOcrText.length < 15) {
    throw new Error('OCR returned no legible text.');
  }

  // Split into pages by delimiter
  const pageSections = fullOcrText.split(/---\s*PAGE\s*(\d+)\s*---/i);
  const pages: ExtractedPage[] = [];

  if (pageSections.length >= 3) {
    for (let i = 1; i < pageSections.length; i += 2) {
      const pageNum = parseInt(pageSections[i], 10) || Math.floor(i / 2) + 1;
      const pageText = (pageSections[i + 1] || '').trim();
      if (pageText) {
        pages.push({
          pageNumber: pageNum,
          sourceLocation: `Page ${pageNum} (OCR Verified)`,
          text: pageText,
          charCount: pageText.length,
          isScannedDetected: true,
        });
      }
    }
  } else {
    // Single page output
    pages.push({
      pageNumber: 1,
      sourceLocation: 'Page 1 (OCR Transcribed)',
      text: fullOcrText,
      charCount: fullOcrText.length,
      isScannedDetected: true,
    });
  }

  const totalCharacters = pages.reduce((sum, p) => sum + p.charCount, 0);
  return { pages, totalCharacters };
}

function splitTextIntoLogicalPages(textContent: string, labelPrefix: string): ExtractedPage[] {
  const chunkSize = 2000;
  const estimatedPages = Math.max(1, Math.ceil(textContent.length / chunkSize));
  const pages: ExtractedPage[] = [];

  for (let p = 0; p < estimatedPages; p++) {
    const start = p * chunkSize;
    const pageText = textContent.slice(start, start + chunkSize).trim();
    const pageNum = p + 1;
    if (pageText) {
      pages.push({
        pageNumber: pageNum,
        sourceLocation: `${labelPrefix} ${pageNum}`,
        text: pageText,
        charCount: pageText.length,
        isScannedDetected: false,
      });
    }
  }

  return pages;
}

export function chunkPagesIntelligently(pages: ExtractedPage[], maxChunkChars: number = 1400): DocumentChunk[] {
  const chunks: DocumentChunk[] = [];
  let globalChunkIndex = 1;

  for (const page of pages) {
    const pageText = page.text;
    if (pageText.length <= maxChunkChars) {
      chunks.push({
        chunkId: `CHK-${String(globalChunkIndex).padStart(3, '0')}`,
        pageNumber: page.pageNumber,
        chunkIndex: globalChunkIndex,
        text: pageText,
        charStart: 0,
        charEnd: pageText.length,
        sectionTitle: extractSectionHeading(pageText) || `Page ${page.pageNumber}`,
      });
      globalChunkIndex++;
    } else {
      // Split by paragraphs or double newlines
      const paragraphs = pageText.split(/\n\s*\n/);
      let currentChunkText = '';
      let chunkStartOffset = 0;

      for (const paragraph of paragraphs) {
        if ((currentChunkText + '\n\n' + paragraph).length > maxChunkChars && currentChunkText.trim().length > 0) {
          chunks.push({
            chunkId: `CHK-${String(globalChunkIndex).padStart(3, '0')}`,
            pageNumber: page.pageNumber,
            chunkIndex: globalChunkIndex,
            text: currentChunkText.trim(),
            charStart: chunkStartOffset,
            charEnd: chunkStartOffset + currentChunkText.length,
            sectionTitle: extractSectionHeading(currentChunkText) || `Page ${page.pageNumber}`,
          });
          globalChunkIndex++;
          chunkStartOffset += currentChunkText.length;
          currentChunkText = paragraph;
        } else {
          currentChunkText = currentChunkText ? currentChunkText + '\n\n' + paragraph : paragraph;
        }
      }

      if (currentChunkText.trim()) {
        chunks.push({
          chunkId: `CHK-${String(globalChunkIndex).padStart(3, '0')}`,
          pageNumber: page.pageNumber,
          chunkIndex: globalChunkIndex,
          text: currentChunkText.trim(),
          charStart: chunkStartOffset,
          charEnd: chunkStartOffset + currentChunkText.length,
          sectionTitle: extractSectionHeading(currentChunkText) || `Page ${page.pageNumber}`,
        });
        globalChunkIndex++;
      }
    }
  }

  return chunks;
}

function extractSectionHeading(text: string): string | undefined {
  const match = text.match(/^(?:[0-9]+\.|\bSection\b|\bClause\b|\bArticle\b|#)\s*([^\n]{3,60})/i);
  if (match && match[1]) {
    return match[1].trim();
  }
  return undefined;
}
