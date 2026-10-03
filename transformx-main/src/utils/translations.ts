export type SupportedLanguage = 'EN' | 'TA';

export interface TranslationDictionary {
  appName: string;
  appSubtitle: string;
  tagline: string;
  home: string;
  getStarted: string;
  upload: string;
  understand: string;
  facts: string;
  transform: string;
  verify: string;
  export: string;
  dashboard: string;
  documents: string;
  auditTrail: string;
  settings: string;
  
  // Dashboard & Header
  heroBadge: string;
  heroHeading: string;
  heroSubheading: string;
  chooseYourPath: string;
  chooseYourPathDesc: string;
  
  // Stats
  docsProcessed: string;
  factsExtracted: string;
  outputsGenerated: string;
  groundingRate: string;
  pendingReviews: string;
  
  // Pipeline Steps
  step1Title: string;
  step1Desc: string;
  step2Title: string;
  step2Desc: string;
  step3Title: string;
  step3Desc: string;
  step4Title: string;
  step4Desc: string;
  step5Title: string;
  step5Desc: string;
  step6Title: string;
  step6Desc: string;
  
  // Actions
  uploadDocument: string;
  loadSample: string;
  approveFact: string;
  rejectFact: string;
  editFact: string;
  addCustomFact: string;
  generateOutput: string;
  generatePack: string;
  approveAndExport: string;
  copyMarkdown: string;
  downloadJSON: string;
  downloadDOCX: string;
  printPDF: string;
  resetSession: string;
  
  // Formats
  executiveBrief: string;
  pressRelease: string;
  citizenFaq: string;
  officialEmail: string;
  publicNotice: string;
  socialPost: string;
  briefingNote: string;
  
  // Verification statuses
  statusVerified: string;
  statusReviewRequired: string;
  statusUnsupported: string;
  statusBlocked: string;
  
  // Accessibility
  accessibilityMenu: string;
  textSize: string;
  highContrast: string;
  screenReader: string;
  shortcuts: string;
}

export const translations: Record<SupportedLanguage, TranslationDictionary> = {
  EN: {
    appName: 'TRANSFORM-X',
    appSubtitle: 'Gen AI Content Transformation Platform (SIH26154)',
    tagline: 'Transform the communication, not the facts.',
    home: 'Home',
    getStarted: 'Get Started',
    upload: '01. Upload',
    understand: '02. Understand',
    facts: '03. Master Facts',
    transform: '04. Transform',
    verify: '05. Verification',
    export: '06. Export',
    dashboard: 'Dashboard',
    documents: 'Documents',
    auditTrail: 'Audit Trail',
    settings: 'Settings',
    
    heroBadge: 'SIH26154 | Gen AI Platform for Automated Content Transformation',
    heroHeading: 'Getting started with TransformX',
    heroSubheading: 'Transform one trusted document into multiple audience-specific communication formats while preserving source-grounded facts, evidence and human approval.',
    chooseYourPath: 'Choose your workflow',
    chooseYourPathDesc: 'Select an action to begin transforming trusted policy and administrative documents.',
    
    docsProcessed: 'Documents Processed',
    factsExtracted: 'Facts Extracted',
    outputsGenerated: 'Outputs Generated',
    groundingRate: 'Grounding Integrity',
    pendingReviews: 'Pending Reviews',
    
    step1Title: 'Document Ingestion',
    step1Desc: 'Upload PDF, DOCX or TXT files with OCR fallback',
    step2Title: 'Source Clauses & OCR',
    step2Desc: 'Inspect extracted document sections & page indices',
    step3Title: 'Master Facts Ledger',
    step3Desc: 'Review, edit and approve source-grounded evidence',
    step4Title: 'Audience Studio',
    step4Desc: 'Generate Executive Briefs, Press Releases & FAQs',
    step5Title: 'Grounding & Audit',
    step5Desc: 'Interactive Source ↔ Output link & anti-hallucination check',
    step6Title: 'Approval & Export',
    step6Desc: 'Human sign-off, dispatch audit package & certified exports',
    
    uploadDocument: 'Upload Document',
    loadSample: 'Load Sample Document',
    approveFact: 'Approve Fact',
    rejectFact: 'Reject Fact',
    editFact: 'Edit Fact',
    addCustomFact: 'Add Custom Fact',
    generateOutput: 'Generate Communication',
    generatePack: 'Generate Incident Response Pack',
    approveAndExport: 'Approve & Export',
    copyMarkdown: 'Copy Markdown',
    downloadJSON: 'Export Audit JSON',
    downloadDOCX: 'Export DOCX',
    printPDF: 'Print Document',
    resetSession: 'New Session',
    
    executiveBrief: 'Executive Brief',
    pressRelease: 'Press Release',
    citizenFaq: 'Citizen FAQ',
    officialEmail: 'Official Email',
    publicNotice: 'Public Notice',
    socialPost: 'Social Post',
    briefingNote: 'Briefing Note',
    
    statusVerified: 'VERIFIED',
    statusReviewRequired: 'REVIEW REQUIRED',
    statusUnsupported: 'UNSUPPORTED',
    statusBlocked: 'BLOCKED',
    
    accessibilityMenu: 'Accessibility Options',
    textSize: 'Text Size',
    highContrast: 'High Contrast Mode',
    screenReader: 'Read Screen (Audio)',
    shortcuts: 'Keyboard Shortcuts',
  },
  TA: {
    appName: 'டிரான்ஸ்பார்ம்-எக்ஸ்',
    appSubtitle: 'உருவாக்க ஏஐ உள்ளடக்க உருமாற்ற தளம் (SIH26154)',
    tagline: 'தொடர்பாடலை மாற்றுங்கள், உண்மைகளை அல்ல.',
    home: 'முகப்பு',
    getStarted: 'தொடங்குங்கள்',
    upload: '01. ஆவணம் பதிவேற்றம்',
    understand: '02. மூல ஆவணம் அறிதல்',
    facts: '03. முதன்மை உண்மைகள்',
    transform: '04. உருமாற்றம்',
    verify: '05. சரிபார்ப்பு',
    export: '06. ஏற்றுமதி',
    dashboard: 'டாஷ்போர்டு',
    documents: 'ஆவணங்கள்',
    auditTrail: 'தணிக்கை பதிவு',
    settings: 'அமைப்புகள்',
    
    heroBadge: 'SIH26154 | தானியங்கி உள்ளடக்க உருமாற்றத்திற்கான ஏஐ தளம்',
    heroHeading: 'டிரான்ஸ்பார்ம்-எக்ஸ் உடன் தொடங்குதல்',
    heroSubheading: 'மூல ஆதார உண்மைகள் மற்றும் மனித ஒப்புதலைப் பாதுகாத்து, ஒரு நம்பகமான ஆவணத்தைப் பல பார்வையாளர்களுக்கான வடிவங்களாக மாற்றவும்.',
    chooseYourPath: 'உங்கள் பணியோட்டத்தைத் தேர்ந்தெடுக்கவும்',
    chooseYourPathDesc: 'நம்பகமான ஆவணங்களை மாற்ற கீழேயுள்ள படிகளில் ஒன்றைத் தேர்ந்தெடுக்கவும்.',
    
    docsProcessed: 'செயலாக்கப்பட்ட ஆவணங்கள்',
    factsExtracted: 'பிரித்தெடுக்கப்பட்ட உண்மைகள்',
    outputsGenerated: 'உருவாக்கப்பட்ட வெளியீடுகள்',
    groundingRate: 'ஆதார ஒருமைப்பாடு',
    pendingReviews: 'நிலுவையில் உள்ள மதிப்பாய்வுகள்',
    
    step1Title: 'ஆவணப் பதிவேற்றம்',
    step1Desc: 'PDF, DOCX அல்லது TXT கோப்புகளைப் பதிவேற்றவும்',
    step2Title: 'மூலப் பிரிவுகள் & உரை',
    step2Desc: 'பிரித்தெடுக்கப்பட்ட ஆவண பக்கங்கள் மற்றும் பிரிவுகளை ஆராயுங்கள்',
    step3Title: 'முதன்மை உண்மைகள் ஏடு',
    step3Desc: 'ஆதார அடிப்படையிலான சான்றுகளை சரிபார்த்து அங்கீகரிக்கவும்',
    step4Title: 'பார்வையாளர் அரங்கம்',
    step4Desc: 'செயல் சுருக்கம், செய்தி வெளியீடு, பொது மக்கள் கேள்விகளை உருவாக்கவும்',
    step5Title: 'சரிபார்ப்பு மற்றும் தணிக்கை',
    step5Desc: 'மூல ஆவணம் ↔ வெளியீட்டு இணைப்பு & பிழை சரிபார்ப்பு',
    step6Title: 'ஒப்புதல் மற்றும் ஏற்றுமதி',
    step6Desc: 'மனித ஒப்புதல், சான்றளிக்கப்பட்ட தணிக்கை ஏற்றுமதி',
    
    uploadDocument: 'ஆவணத்தைப் பதிவேற்றவும்',
    loadSample: 'மாதிரி ஆவணத்தை ஏற்றவும்',
    approveFact: 'உண்மையை அங்கீகரி',
    rejectFact: 'நிராகரி',
    editFact: 'திருத்து',
    addCustomFact: 'புதிய உண்மையைச் சேர்',
    generateOutput: 'உள்ளடக்கத்தை உருவாக்கு',
    generatePack: 'அவசர கால தொகுப்பை உருவாக்கு',
    approveAndExport: 'ஒப்புதல் அளித்து ஏற்றுமதி செய்',
    copyMarkdown: 'மார்க் டவுன் நகலெடு',
    downloadJSON: 'JSON தணிக்கை ஏற்றுமதி',
    downloadDOCX: 'DOCX பதிவிறக்கு',
    printPDF: 'ஆவணத்தை அச்சிடு',
    resetSession: 'புதிய அமர்வு',
    
    executiveBrief: 'நிர்வாக சுருக்கம்',
    pressRelease: 'செய்தி வெளியீடு',
    citizenFaq: 'பொது மக்கள் கேள்விகள் (FAQ)',
    officialEmail: 'அதிகாரப்பூர்வ மின்னஞ்சல்',
    publicNotice: 'பொது அறிவிப்பு',
    socialPost: 'சமூக ஊடக இடுகை',
    briefingNote: 'விளக்கக் குறிப்பு',
    
    statusVerified: 'சரிபார்க்கப்பட்டது',
    statusReviewRequired: 'மதிப்பாய்வு தேவை',
    statusUnsupported: 'ஆதாரமற்றது',
    statusBlocked: 'தடுக்கப்பட்டது',
    
    accessibilityMenu: 'அணுகல்தன்மை விருப்பங்கள்',
    textSize: 'எழுத்து அளவு',
    highContrast: 'உயர் மாறுபட்ட பயன்முறை',
    screenReader: 'குரல் வாசிப்பாளர் (ஆடியோ)',
    shortcuts: 'விசைப்பலகை குறுக்குவழிகள்',
  },
};
