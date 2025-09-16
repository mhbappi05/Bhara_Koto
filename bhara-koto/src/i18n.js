export const LANGS = { BN: "bn", EN: "en" };

export const t = (lang) => ({
  title: lang === LANGS.BN ? "ভাড়া কত?" : "How much is the fare?",
  tagline:
    lang === LANGS.BN
      ? "আর নয় ভাড়া নিয়ে মারামারি"
      : "No more fighting over fares",
  from: lang === LANGS.BN ? "গন্তব্য থেকে" : "From",
  to: lang === LANGS.BN ? "গন্তব্য পর্যন্ত" : "To",
  choose: lang === LANGS.BN ? "নির্বাচন করুন" : "Choose",
  student: lang === LANGS.BN ? "ছাত্র" : "Student",
  go: lang === LANGS.BN ? "ভাড়া জানুন!" : "Check Fare",
  directRoutes: lang === LANGS.BN ? "সরাসরি বাস" : "Direct Buses",
  transfers: lang === LANGS.BN ? "দুই বাসে যাত্রা" : "Two-bus Options",
  language: lang === LANGS.BN ? "EN" : "বাংলা",
  standardFare: lang === LANGS.BN ? "সাধারণ ভাড়া" : "Standard Fare",
  studentFare: lang === LANGS.BN ? "ছাত্র ভাড়া" : "Student Fare",
  banglaBus: lang === LANGS.BN ? "বাস (বাংলা)" : "Bus (Bangla)",
  englishBus: lang === LANGS.BN ? "Bus (English)" : "Bus (English)",
  transferAt: lang === LANGS.BN ? "ট্রান্সফার পয়েন্ট" : "Transfer at",
  noRoutes: lang === LANGS.BN ? "কোনো রুট পাওয়া যায়নি" : "No routes found",
  footerAbout: lang === LANGS.BN ? "প্রকল্প সম্পর্কে" : "About Project",
  footerDisclaimer: lang === LANGS.BN ? "ডিসক্লেইমার" : "Disclaimer",
  footerData: lang === LANGS.BN ? "ডেটা সোর্স" : "Data Sources",
  footerMade: lang === LANGS.BN ? "ভালোবাসা দিয়ে তৈরি" : "Made with love",
  footerFollow: lang === LANGS.BN ? "অনুসরণ করুন" : "Follow",
  footerContact: lang === LANGS.BN ? "যোগাযোগ করুন" : "Contact",
  missingTitle: lang === LANGS.BN ? "ভাড়া পাওয়া যায়নি" : "Fare not found",
  missingBody:
    lang === LANGS.BN
      ? "এই জোড়ার জন্য চার্টে ভাড়া/দূরত্ব নেই। WhatsApp-এ জানিয়ে দিন—আমরা যুক্ত করব।"
      : "No fare/distance in the chart for this pair. Tell us on WhatsApp and we’ll add it.",
  reportOnWhatsapp: lang === LANGS.BN ? "WhatsApp-এ জানান" : "Report on WhatsApp",
  tabHome: lang === LANGS.BN ? "হোম" : "Home",
  tabFare: lang === LANGS.BN ? "ভাড়া তালিকা" : "Fare Table",
  tabNotices: lang === LANGS.BN ? "নোটিশ" : "Notices",

  fareTableTitle: lang === LANGS.BN ? "সম্পূর্ণ ভাড়া তালিকা" : "All Fares",
  colFrom: lang === LANGS.BN ? "কোথা থেকে" : "From",
  colTo: lang === LANGS.BN ? "কোথায়" : "To",
  colDistance: lang === LANGS.BN ? "দূরত্ব (কিমি)" : "Distance (km)",
  colFare: lang === LANGS.BN ? "ভাড়া (৳)" : "Fare (BDT)",

  noticesTitle: lang === LANGS.BN ? "প্রকল্পের নোটিশ" : "Project Notices",
  footerDesignBy: lang === LANGS.BN ? "ডিজাইন" : "Design",
  footerDevelopedBy: lang === LANGS.BN ? "ডেভেলপমেন্ট" : "Developed",
});
