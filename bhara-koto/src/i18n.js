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
  reportOnWhatsapp:
    lang === LANGS.BN ? "WhatsApp-এ জানান" : "Report on WhatsApp",
  tabHome: lang === LANGS.BN ? "হোম" : "Home",
  tabFare: lang === LANGS.BN ? "ভাড়া তালিকা" : "Fare Table",
  tabNotices: lang === LANGS.BN ? "নোটিশ" : "Notices",

  fareTableTitle: lang === LANGS.BN ? "সম্পূর্ণ ভাড়া তালিকা" : "All Fares",
  colFrom: lang === LANGS.BN ? "কোথা থেকে" : "From",
  colTo: lang === LANGS.BN ? "কোথায়" : "To",
  colDistance: lang === LANGS.BN ? "দূরত্ব (কিমি)" : "Distance (km)",
  colFare: lang === LANGS.BN ? "ভাড়া (৳)" : "Fare (BDT)",
  searchPlaceholder:
    lang === LANGS.BN ? "অনুসন্ধান করুন..." : "Search from/to…",
  noRoutes: lang === LANGS.BN ? "কোনো রুট পাওয়া যায়নি" : "No routes found",

  noticesTitle: lang === LANGS.BN ? "প্রকল্পের নোটিশ" : "Project Notices",
  footerDesignBy: lang === LANGS.BN ? "ডিজাইন" : "Design",
  footerDevelopedBy: lang === LANGS.BN ? "ডেভেলপমেন্ট" : "Developed",

  //payment info
  paymentTitle: lang === LANGS.BN ? "ভালোবাসা প্রকাশ করুন" : "Express Love",
  paymentInfoText:
    lang === LANGS.BN
      ? "আপনার ভালোবাসা প্রকাশ করে, নিচের নম্বরে কফি কিনে দিতে পারেন:"
      : "Expressing your love, you can buy me a coffee on the number below:",

  // New translations for notices
  notice1Text:
    lang === LANGS.BN
      ? "সকল তথ্য অনলাইন থেকে সংগ্রহ করা হয়েছে। ঢাকা মেট্রো এলাকার বাস ভাড়ার তালিকা সরকারি ওয়েবসাইট থেকে নেওয়া হয়েছে। আপনি উৎসটি এখানে পেতে পারেন:"
      : "All information is collected from online sources. The bus fare list for the Dhaka Metro area is based on the official government website. You can find the source here:",
  notice1Link:
    lang === LANGS.BN
      ? "ঢাকা মেট্রো এলাকার বাস ভাড়া"
      : "Public Bus Fare of Dhaka Metro",
  notice2Text:
    lang === LANGS.BN
      ? "প্রকৃত ভাড়া এবং এই ওয়েবসাইটে দেওয়া ভাড়ার তালিকার মধ্যে কিছু পার্থক্য থাকতে পারে। যদি কোনো ভিন্নতা থাকে, দয়া করে আমাদের হোয়াটসঅ্যাপে জানান: "
      : "There may be some differences between the actual fares and the fare list given on this website. If there is any discrepancy, please inform us on ",
  notice2Link: lang === LANGS.BN ? "হোয়াটসঅ্যাপ" : "WhatsApp",
  notice3Text:
    lang === LANGS.BN
      ? "টোল প্রদানকারী বাসের জন্য, ভাড়া ৫ টাকা পর্যন্ত ভিন্ন হতে পারে।"
      : "For buses that pay toll, the fare may vary by up to 5 BDT.",
  notice4Text:
    lang === LANGS.BN
      ? "ভালোবাসা প্রকাশ করে, চাইলে আমাকে কফি কিনে দিতে পারেন: "
      : "Expressing love, you can buy me a coffee if you want: ",
  notice4Link: lang === LANGS.BN ? "কফি কিনে দিন" : "Buy me a coffee",
  notice5Text:
    lang === LANGS.BN
      ? "এই প্রকল্পটি স্বেচ্ছাসেবী উদ্যোগে তৈরি করা হয়েছে এবং এটি সরকার বা কোনো বাস সংস্থার সাথে সম্পর্কিত নয়।"
      : "This project is created on a volunteer basis and is not affiliated with the government or any bus company.",
  notice6Text:
    lang === LANGS.BN
      ? "আপনার যদি কোনো প্রশ্ন বা পরামর্শ থাকে, দয়া করে আমাদের হোয়াটসঅ্যাপে জানান: "
      : "If you have any questions or suggestions, please inform us on ",
  notice7Text:
    lang === LANGS.BN
      ? "ভবিষ্যতে আরও ফিচার যুক্ত করার পরিকল্পনা রয়েছে, আপনারা চাইলে আমাকে পরামর্শ দিতে পারেন"
      : "There are plans to add more features in the future, you can suggest me if you want",
  notice8Text:
    lang === LANGS.BN
      ? "এই প্রকল্পটি ভালোবাসা এবং উন্মুক্ত তথ্যের প্রতি বিশ্বাস নিয়ে তৈরি করা হয়েছে।"
      : "This project is made with love and a belief in open information.",
  notice9Text:
    lang === LANGS.BN
      ? "আপনারা কেউ যদি এই ওয়েবসাইটে কোনো এড দিতে চান, তাহলে আমাকে হোয়াটসঅ্যাপে জানান:"
      : "If any of you want to place an ad on this website, please let me know on WhatsApp:",
});
