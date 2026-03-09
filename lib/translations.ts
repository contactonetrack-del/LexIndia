export type Language = 'en' | 'hi' | 'bn' | 'te' | 'mr' | 'ta' | 'gu' | 'ur' | 'kn' | 'or' | 'pa' | 'ml' | 'bho' | 'bh';

export const languageNames: Record<Language, string> = {
  en: 'English',
  hi: 'हिन्दी (Hindi)',
  bn: 'বাংলা (Bengali)',
  te: 'తెలుగు (Telugu)',
  mr: 'मराठी (Marathi)',
  ta: 'தமிழ் (Tamil)',
  gu: 'ગુજરાતી (Gujarati)',
  ur: 'اردو (Urdu)',
  kn: 'ಕನ್ನಡ (Kannada)',
  or: 'ଓଡ଼ିଆ (Odia)',
  pa: 'ਪੰਜਾਬੀ (Punjabi)',
  ml: 'മലയാളം (Malayalam)',
  bho: 'भोजपुरी (Bhojpuri)',
  bh: 'बिहारी (Bihari)'
};

type Translation = {
  nav: { lawyers: string; knowledge: string; templates: string; rights: string; login: string; signup: string };
  hero: { title: string; subtitle: string; searchLaw: string; searchCity: string; searchBtn: string; forCitizens: string; forLawyers: string };
  features: { title: string; subtitle: string; f1Title: string; f1Desc: string; f2Title: string; f2Desc: string; f3Title: string; f3Desc: string; f4Title: string; f4Desc: string };
  howItWorks: { title: string; subtitle: string; s1Title: string; s1Desc: string; s2Title: string; s2Desc: string; s3Title: string; s3Desc: string };
  categories: { title: string; subtitle: string; viewAll: string; c1: string; c2: string; c3: string; c4: string; c5: string; c6: string; lawyers: string };
  testimonials: { title: string; subtitle: string; startBtn: string; quote: string; role: string };
  footer: { desc: string; forCitizens: string; findLawyer: string; knowledge: string; templates: string; rights: string; forLawyers: string; joinDir: string; dashboard: string; pricing: string; company: string; about: string; contact: string; privacy: string; terms: string; rightsRes: string; disclaimer: string };
};

const en: Translation = {
  nav: { lawyers: 'Lawyers', knowledge: 'Knowledge Base', templates: 'Templates', rights: 'Know Your Rights', login: 'Login', signup: 'Sign Up' },
  hero: { title: 'Get Legal Help in Minutes', subtitle: 'मिनटों में कानूनी सहायता प्राप्त करें', searchLaw: 'Find lawyers by law (e.g., Family, Criminal)', searchCity: 'City or Pincode', searchBtn: 'Search', forCitizens: 'For Citizens', forLawyers: 'For Lawyers' },
  features: { title: 'Everything You Need for Legal Peace of Mind', subtitle: 'Access verified lawyers, free legal information, and essential document templates all in one place.', f1Title: 'Search Lawyers', f1Desc: 'Find verified, top-rated lawyers near you based on expertise and reviews.', f2Title: 'Book Consultations', f2Desc: 'Schedule appointments and chat securely with legal professionals.', f3Title: 'Free Legal Info', f3Desc: 'Understand your rights with our bilingual knowledge base.', f4Title: 'Templates', f4Desc: 'Download standard legal formats like FIRs, Affidavits, and Notices.' },
  howItWorks: { title: 'How LexIndia Works', subtitle: 'Get the legal help you need in three simple steps.', s1Title: 'Search & Filter', s1Desc: 'Enter your legal issue and location to find relevant lawyers.', s2Title: 'Review Profiles', s2Desc: 'Check experience, fees, and client reviews to choose the right fit.', s3Title: 'Book & Chat', s3Desc: 'Schedule a consultation and discuss your case securely.' },
  categories: { title: 'Find Lawyers by Specialization', subtitle: 'Browse top-rated advocates across various legal domains.', viewAll: 'View All', c1: 'Criminal Law', c2: 'Family Law', c3: 'Property Law', c4: 'Corporate Law', c5: 'Civil Law', c6: 'Cyber Law', lawyers: 'Lawyers' },
  testimonials: { title: 'Ready to resolve your legal issues?', subtitle: 'Join thousands of citizens who have successfully found the right legal representation through LexIndia.', startBtn: 'Start Now', quote: "I was struggling to find a reliable property lawyer in Delhi. LexIndia made it incredibly easy to compare profiles, read reviews, and book a consultation. Highly recommended!", role: 'Property Dispute Client' },
  footer: { desc: 'Making legal help accessible, transparent, and efficient for every Indian citizen.', forCitizens: 'For Citizens', findLawyer: 'Find a Lawyer', knowledge: 'Knowledge Base', templates: 'Legal Templates', rights: 'Know Your Rights', forLawyers: 'For Lawyers', joinDir: 'Join Directory', dashboard: 'Lawyer Dashboard', pricing: 'Pricing', company: 'Company', about: 'About Us', contact: 'Contact', privacy: 'Privacy Policy', terms: 'Terms of Service', rightsRes: 'All rights reserved.', disclaimer: 'Disclaimer: This platform is for informational purposes only and is not a substitute for professional legal advice.' }
};

const hi: Translation = {
  nav: { lawyers: 'वकील', knowledge: 'ज्ञानकोष', templates: 'टेम्पलेट्स', rights: 'अपने अधिकार जानें', login: 'लॉग इन', signup: 'साइन अप' },
  hero: { title: 'मिनटों में कानूनी सहायता प्राप्त करें', subtitle: 'Get Legal Help in Minutes', searchLaw: 'कानून के अनुसार वकील खोजें (उदा., पारिवारिक, आपराधिक)', searchCity: 'शहर या पिनकोड', searchBtn: 'खोजें', forCitizens: 'नागरिकों के लिए', forLawyers: 'वकीलों के लिए' },
  features: { title: 'कानूनी शांति के लिए आपको जो कुछ भी चाहिए', subtitle: 'सत्यापित वकीलों, मुफ्त कानूनी जानकारी और आवश्यक दस्तावेज़ टेम्पलेट्स तक एक ही स्थान पर पहुंचें।', f1Title: 'वकील खोजें', f1Desc: 'विशेषज्ञता और समीक्षाओं के आधार पर अपने आस-पास सत्यापित, शीर्ष-रेटेड वकील खोजें।', f2Title: 'परामर्श बुक करें', f2Desc: 'नियुक्तियां निर्धारित करें और कानूनी पेशेवरों के साथ सुरक्षित रूप से चैट करें।', f3Title: 'मुफ्त कानूनी जानकारी', f3Desc: 'हमारे द्विभाषी ज्ञानकोष के साथ अपने अधिकारों को समझें।', f4Title: 'टेम्पलेट्स', f4Desc: 'प्राथमिकी, हलफनामा और नोटिस जैसे मानक कानूनी प्रारूप डाउनलोड करें।' },
  howItWorks: { title: 'LexIndia कैसे काम करता है', subtitle: 'तीन सरल चरणों में आवश्यक कानूनी सहायता प्राप्त करें।', s1Title: 'खोजें और फ़िल्टर करें', s1Desc: 'प्रासंगिक वकीलों को खोजने के लिए अपना कानूनी मुद्दा और स्थान दर्ज करें।', s2Title: 'प्रोफ़ाइल की समीक्षा करें', s2Desc: 'सही विकल्प चुनने के लिए अनुभव, फीस और ग्राहक समीक्षाओं की जांच करें।', s3Title: 'बुक करें और चैट करें', s3Desc: 'परामर्श निर्धारित करें और अपने मामले पर सुरक्षित रूप से चर्चा करें।' },
  categories: { title: 'विशेषज्ञता के अनुसार वकील खोजें', subtitle: 'विभिन्न कानूनी डोमेन में शीर्ष-रेटेड अधिवक्ताओं को ब्राउज़ करें।', viewAll: 'सभी देखें', c1: 'आपराधिक कानून', c2: 'पारिवारिक कानून', c3: 'संपत्ति कानून', c4: 'कॉर्पोरेट कानून', c5: 'नागरिक कानून', c6: 'साइबर कानून', lawyers: 'वकील' },
  testimonials: { title: 'क्या आप अपने कानूनी मुद्दों को सुलझाने के लिए तैयार हैं?', subtitle: 'उन हजारों नागरिकों से जुड़ें जिन्होंने LexIndia के माध्यम से सफलतापूर्वक सही कानूनी प्रतिनिधित्व पाया है।', startBtn: 'अभी शुरू करें', quote: "मैं दिल्ली में एक विश्वसनीय संपत्ति वकील खोजने के लिए संघर्ष कर रहा था। LexIndia ने प्रोफाइल की तुलना करना, समीक्षा पढ़ना और परामर्श बुक करना अविश्वसनीय रूप से आसान बना दिया। अत्यधिक अनुशंसित!", role: 'संपत्ति विवाद ग्राहक' },
  footer: { desc: 'प्रत्येक भारतीय नागरिक के लिए कानूनी सहायता को सुलभ, पारदर्शी और कुशल बनाना।', forCitizens: 'नागरिकों के लिए', findLawyer: 'वकील खोजें', knowledge: 'ज्ञानकोष', templates: 'कानूनी टेम्पलेट्स', rights: 'अपने अधिकार जानें', forLawyers: 'वकीलों के लिए', joinDir: 'निर्देशिका से जुड़ें', dashboard: 'वकील डैशबोर्ड', pricing: 'मूल्य निर्धारण', company: 'कंपनी', about: 'हमारे बारे में', contact: 'संपर्क करें', privacy: 'गोपनीयता नीति', terms: 'सेवा की शर्तें', rightsRes: 'सर्वाधिकार सुरक्षित।', disclaimer: 'अस्वीकरण: यह मंच केवल सूचनात्मक उद्देश्यों के लिए है और पेशेवर कानूनी सलाह का विकल्प नहीं है।' }
};

// Partial translations for other languages (falling back to English for missing parts)
const bn: Partial<Translation> = {
  nav: { lawyers: 'আইনজীবী', knowledge: 'জ্ঞানের ভাণ্ডার', templates: 'টেমপ্লেট', rights: 'আপনার অধিকার জানুন', login: 'লগইন', signup: 'সাইন আপ' },
  hero: { title: 'মিনিটের মধ্যে আইনি সহায়তা পান', subtitle: 'Get Legal Help in Minutes', searchLaw: 'আইন অনুযায়ী আইনজীবী খুঁজুন', searchCity: 'শহর বা পিনকোড', searchBtn: 'অনুসন্ধান', forCitizens: 'নাগরিকদের জন্য', forLawyers: 'আইনজীবীদের জন্য' },
  categories: { title: 'বিশেষজ্ঞতা অনুযায়ী আইনজীবী খুঁজুন', subtitle: 'বিভিন্ন আইনি ডোমেন জুড়ে শীর্ষ-রেটযুক্ত অ্যাডভোকেট ব্রাউজ করুন।', viewAll: 'সব দেখুন', c1: 'ফৌজদারি আইন', c2: 'পারিবারিক আইন', c3: 'সম্পত্তি আইন', c4: 'কর্পোরেট আইন', c5: 'দেওয়ানি আইন', c6: 'সাইবার আইন', lawyers: 'আইনজীবী' }
};

const te: Partial<Translation> = {
  nav: { lawyers: 'న్యాయవాదులు', knowledge: 'నాలెడ్జ్ బేస్', templates: 'టెంప్లేట్లు', rights: 'మీ హక్కులను తెలుసుకోండి', login: 'లాగిన్', signup: 'సైన్ అప్' },
  hero: { title: 'నిమిషాల్లో చట్టపరమైన సహాయం పొందండి', subtitle: 'Get Legal Help in Minutes', searchLaw: 'చట్టం ద్వారా న్యాయవాదులను కనుగొనండి', searchCity: 'నగరం లేదా పిన్‌కోడ్', searchBtn: 'శోధించండి', forCitizens: 'పౌరుల కోసం', forLawyers: 'న్యాయవాదుల కోసం' },
  categories: { title: 'స్పెషలైజేషన్ ద్వారా న్యాయవాదులను కనుగొనండి', subtitle: 'వివిధ చట్టపరమైన డొమైన్‌లలో అగ్రశ్రేణి న్యాయవాదులను బ్రౌజ్ చేయండి.', viewAll: 'అన్నీ చూడండి', c1: 'క్రిమినల్ లా', c2: 'ఫ్యామిలీ లా', c3: 'ప్రాపర్టీ లా', c4: 'కార్పొరేట్ లా', c5: 'సివిల్ లా', c6: 'సైబర్ లా', lawyers: 'న్యాయవాదులు' }
};

const mr: Partial<Translation> = {
  nav: { lawyers: 'वकील', knowledge: 'ज्ञानकोष', templates: 'टेम्पलेट्स', rights: 'तुमचे अधिकार जाणून घ्या', login: 'लॉगिन', signup: 'साइन अप' },
  hero: { title: 'काही मिनिटांत कायदेशीर मदत मिळवा', subtitle: 'Get Legal Help in Minutes', searchLaw: 'कायद्यानुसार वकील शोधा', searchCity: 'शहर किंवा पिनकोड', searchBtn: 'शोधा', forCitizens: 'नागरिकांसाठी', forLawyers: 'वकिलांसाठी' },
  categories: { title: 'विशेषज्ञतेनुसार वकील शोधा', subtitle: 'विविध कायदेशीर डोमेनमध्ये शीर्ष-रेट केलेले वकील ब्राउझ करा.', viewAll: 'सर्व पहा', c1: 'फौजदारी कायदा', c2: 'कौटुंबिक कायदा', c3: 'मालमत्ता कायदा', c4: 'कॉर्पोरेट कायदा', c5: 'दिवाणी कायदा', c6: 'सायबर कायदा', lawyers: 'वकील' }
};

const ta: Partial<Translation> = {
  nav: { lawyers: 'வழக்கறிஞர்கள்', knowledge: 'அறிவு தளம்', templates: 'வார்ப்புருக்கள்', rights: 'உங்கள் உரிமைகளை அறியுங்கள்', login: 'உள்நுழைக', signup: 'பதிவு செய்க' },
  hero: { title: 'நிமிடங்களில் சட்ட உதவி பெறுங்கள்', subtitle: 'Get Legal Help in Minutes', searchLaw: 'சட்டத்தின்படி வழக்கறிஞர்களைத் தேடுங்கள்', searchCity: 'நகரம் அல்லது பின்கோடு', searchBtn: 'தேடு', forCitizens: 'குடிமக்களுக்கு', forLawyers: 'வழக்கறிஞர்களுக்கு' }
};

const ur: Partial<Translation> = {
  nav: { lawyers: 'وکیل', knowledge: 'معلومات', templates: 'ٹیمپلیٹس', rights: 'اپنے حقوق جانیں', login: 'لاگ ان', signup: 'سائن اپ' },
  hero: { title: 'منٹوں میں قانونی مدد حاصل کریں', subtitle: 'Get Legal Help in Minutes', searchLaw: 'قانون کے مطابق وکیل تلاش کریں', searchCity: 'شہر یا پن کوڈ', searchBtn: 'تلاش کریں', forCitizens: 'شہریوں کے لیے', forLawyers: 'وکیلوں کے لیے' }
};

const gu: Partial<Translation> = {
  nav: { lawyers: 'વકીલો', knowledge: 'જ્ઞાન આધાર', templates: 'ટેમ્પ્લેટ્સ', rights: 'તમારા અધિકારો જાણો', login: 'લૉગિન', signup: 'સાઇન અપ' },
  hero: { title: 'મિનિટોમાં કાનૂની મદદ મેળવો', subtitle: 'Get Legal Help in Minutes', searchLaw: 'કાયદા દ્વારા વકીલો શોધો', searchCity: 'શહેર અથવા પિનકોડ', searchBtn: 'શોધો', forCitizens: 'નાગરિકો માટે', forLawyers: 'વકીલો માટે' }
};

const kn: Partial<Translation> = {
  nav: { lawyers: 'ವಕೀಲರು', knowledge: 'ಜ್ಞಾನದ ಮೂಲ', templates: 'ಟೆಂಪ್ಲೇಟ್‌ಗಳು', rights: 'ನಿಮ್ಮ ಹಕ್ಕುಗಳನ್ನು ತಿಳಿಯಿರಿ', login: 'ಲಾಗಿನ್', signup: 'ಸೈನ್ ಅಪ್' },
  hero: { title: 'ನಿಮಿಷಗಳಲ್ಲಿ ಕಾನೂನು ಸಹಾಯ ಪಡೆಯಿರಿ', subtitle: 'Get Legal Help in Minutes', searchLaw: 'ಕಾನೂನಿನ ಮೂಲಕ ವಕೀಲರನ್ನು ಹುಡುಕಿ', searchCity: 'ನಗರ ಅಥವಾ ಪಿನ್‌ಕೋಡ್', searchBtn: 'ಹುಡುಕಿ', forCitizens: 'ನಾಗರಿಕರಿಗಾಗಿ', forLawyers: 'ವಕೀಲರಿಗಾಗಿ' }
};

const or: Partial<Translation> = {
  nav: { lawyers: 'ଓକିଲ', knowledge: 'ଜ୍ଞାନ ଆଧାର', templates: 'ଟେମ୍ପଲେଟ୍', rights: 'ଆପଣଙ୍କ ଅଧିକାର ଜାଣନ୍ତୁ', login: 'ଲଗଇନ୍', signup: 'ସାଇନ୍ ଅପ୍' },
  hero: { title: 'ମିନିଟରେ ଆଇନଗତ ସାହାଯ୍ୟ ପାଆନ୍ତୁ', subtitle: 'Get Legal Help in Minutes', searchLaw: 'ଆଇନ ଅନୁଯାୟୀ ଓକିଲ ଖୋଜନ୍ତୁ', searchCity: 'ସହର କିମ୍ବା ପିନକୋଡ୍', searchBtn: 'ସନ୍ଧାନ କରନ୍ତୁ', forCitizens: 'ନାଗରିକମାନଙ୍କ ପାଇଁ', forLawyers: 'ଓକିଲମାନଙ୍କ ପାଇଁ' }
};

const pa: Partial<Translation> = {
  nav: { lawyers: 'ਵਕੀਲ', knowledge: 'ਗਿਆਨ ਅਧਾਰ', templates: 'ਟੈਂਪਲੇਟ', rights: 'ਆਪਣੇ ਅਧਿਕਾਰ ਜਾਣੋ', login: 'ਲਾਗਿਨ', signup: 'ਸਾਈਨ ਅੱਪ' },
  hero: { title: 'ਮਿੰਟਾਂ ਵਿੱਚ ਕਾਨੂੰਨੀ ਮਦਦ ਪ੍ਰਾਪਤ ਕਰੋ', subtitle: 'Get Legal Help in Minutes', searchLaw: 'ਕਾਨੂੰਨ ਦੁਆਰਾ ਵਕੀਲ ਲੱਭੋ', searchCity: 'ਸ਼ਹਿਰ ਜਾਂ ਪਿਨਕੋਡ', searchBtn: 'ਖੋਜ', forCitizens: 'ਨਾਗਰਿਕਾਂ ਲਈ', forLawyers: 'ਵਕੀਲਾਂ ਲਈ' }
};

const ml: Partial<Translation> = {
  nav: { lawyers: 'അഭിഭാഷകർ', knowledge: 'വിവരങ്ങൾ', templates: 'ടെംപ്ലേറ്റുകൾ', rights: 'നിങ്ങളുടെ അവകാശങ്ങൾ അറിയുക', login: 'ലോഗിൻ', signup: 'സൈൻ അപ്പ്' },
  hero: { title: 'മിനിറ്റുകൾക്കുള്ളിൽ നിയമസഹായം നേടുക', subtitle: 'Get Legal Help in Minutes', searchLaw: 'നിയമപ്രകാരം അഭിഭാഷകരെ കണ്ടെത്തുക', searchCity: 'നഗരം അല്ലെങ്കിൽ പിൻകോഡ്', searchBtn: 'തിരയുക', forCitizens: 'പൗരന്മാർക്ക്', forLawyers: 'അഭിഭാഷകർക്ക്' }
};

const bho: Partial<Translation> = {
  nav: { lawyers: 'वकील', knowledge: 'ज्ञानकोष', templates: 'टेम्पलेट', rights: 'आपन अधिकार जानीं', login: 'लॉग इन', signup: 'साइन अप' },
  hero: { title: 'मिनटों में कानूनी मदद पाईं', subtitle: 'Get Legal Help in Minutes', searchLaw: 'कानून के हिसाब से वकील खोजीं', searchCity: 'शहर या पिनकोड', searchBtn: 'खोजीं', forCitizens: 'नागरिक लोगन खातिर', forLawyers: 'वकील लोगन खातिर' },
  categories: { title: 'विशेषज्ञता के अनुसार वकील खोजीं', subtitle: 'विभिन्न कानूनी डोमेन में शीर्ष-रेटेड अधिवक्ताओं के ब्राउज़ करीं।', viewAll: 'सब देखीं', c1: 'आपराधिक कानून', c2: 'पारिवारिक कानून', c3: 'संपत्ति कानून', c4: 'कॉर्पोरेट कानून', c5: 'नागरिक कानून', c6: 'साइबर कानून', lawyers: 'वकील' }
};

const bh: Partial<Translation> = {
  nav: { lawyers: 'वकील', knowledge: 'ज्ञान आधार', templates: 'खाका', rights: 'अपन अधिकार जानू', login: 'लाग इन', signup: 'साइन अप' },
  hero: { title: 'किछुए मिनट में कानूनी मदद पाऊ', subtitle: 'Get Legal Help in Minutes', searchLaw: 'कानून सँ वकील खोजू', searchCity: 'शहर वा पिनकोड', searchBtn: 'खोजू', forCitizens: 'नागरिक लेल', forLawyers: 'वकील लेल' },
  categories: { title: 'विशेषज्ञता सँ वकील खोजू', subtitle: 'विभिन्न कानूनी डोमेन में शीर्ष-रेटेड अधिवक्ताओं के ब्राउज़ करू।', viewAll: 'सब देखू', c1: 'आपराधिक कानून', c2: 'पारिवारिक कानून', c3: 'संपत्ति कानून', c4: 'कॉर्पोरेट कानून', c5: 'नागरिक कानून', c6: 'साइबर कानून', lawyers: 'वकील' }
};

const partialTranslations: Record<string, Partial<Translation>> = { bn, te, mr, ta, ur, gu, kn, or, pa, ml, bho, bh };

export function getTranslation(lang: Language): Translation {
  if (lang === 'en') return en;
  if (lang === 'hi') return hi;
  
  const partial = partialTranslations[lang] || {};
  
  // Deep merge with English as fallback
  return {
    nav: { ...en.nav, ...partial.nav },
    hero: { ...en.hero, ...partial.hero },
    features: { ...en.features, ...partial.features },
    howItWorks: { ...en.howItWorks, ...partial.howItWorks },
    categories: { ...en.categories, ...partial.categories },
    testimonials: { ...en.testimonials, ...partial.testimonials },
    footer: { ...en.footer, ...partial.footer }
  };
}
