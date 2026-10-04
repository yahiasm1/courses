import type { Dict } from "./en";

/** Arabic plural for "course": 1 دورة واحدة, 2 دورتان, 3–10 دورات, else دورة. */
const courses = (n: number) => {
  if (n === 1) return "دورة واحدة";
  if (n === 2) return "دورتان";
  if (n >= 3 && n <= 10) return `${n} دورات`;
  return `${n} دورة`;
};
const items = (n: number) => (n === 1 ? "عنصر واحد" : n === 2 ? "عنصران" : n >= 3 && n <= 10 ? `${n} عناصر` : `${n} عنصر`);

export const ar: Dict = {
  dir: "rtl",
  langName: "العربية",
  switchTo: "English",
  switchShort: "EN",
  switchLabel: "عرض الموقع بالإنجليزية",
  currency: "دج",
  wait: "يرجى الانتظار…",
  courses,

  meta: {
    title: "دورات أونلاين",
    description: "تصفّح كل الدورات، ادفع بأمان بـ CIB أو الذهبية، وحمّل فورًا.",
    shopDescription: "تصفّح كل الدورات على Courses DZ. ادفع بالدينار بـ CIB أو الذهبية وحمّل فورًا.",
  },

  nav: {
    allCourses: "كل الدورات",
    categories: "الأقسام",
    noCategories: "لا توجد أقسام بعد",
    browseAll: "تصفّح الكل",
    search: "بحث",
    searchPlaceholder: "ابحث عن دورة أو موضوع…",
    searchCourses: "ابحث في الدورات…",
    cart: "السلة",
    cartItems: (n: number) => `السلة، ${items(n)}`,
    myCourses: "دوراتي",
    signIn: "تسجيل الدخول",
    signUp: "إنشاء حساب",
    signOut: "تسجيل الخروج",
    home: "الرئيسية",
    coursesTab: "الدورات",
    primary: "التنقل الرئيسي",
    shop: "المتجر",
    lightMode: "الوضع الفاتح",
    darkMode: "الوضع الداكن",
  },

  footer: {
    rights: "جميع الحقوق محفوظة.",
  },

  banner: {
    title: "انضم إلى قناتنا على تيليجرام",
    text: "آخر الأخبار، العروض والتحديثات ❤️",
    cta: "انضم الآن",
  },

  home: {
    popularNiches: "المجالات الأكثر طلبًا",
    pickTopic: "اختر موضوعًا وابدأ التعلّم.",
    allCourses: "كل الدورات",
    tagline: "ادفع بالدينار بـ CIB أو الذهبية، وحمّل فورًا.",
    searchFilter: "بحث وتصفية",
    showAll: (n: number) => `عرض كل الأقسام (${n})`,
    showFewer: "عرض أقسام أقل",
  },

  hero: {
    label: "المجالات الأكثر طلبًا",
    slide: (i: number, n: number, name: string) => `${i} من ${n}: ${name}`,
    master: "أتقن",
    nicheEyebrow: (name: string, n: number) => `${name} · ${courses(n)}`,
    nicheShort: (n: number, price: string) => `${courses(n)} ابتداءً من ${price}. ادفع مرة واحدة وحمّل فورًا.`,
    nicheLong: (n: number, name: string, price: string) =>
      `${courses(n)} في ${name}، ابتداءً من ${price}. ادفع بـ CIB أو الذهبية ويصلك رابط التحميل مباشرة بعد الدفع.`,
    browse: (name: string) => `تصفّح ${name}`,
    instant: "تحميل فوري",
    allEyebrow: "كل الدورات",
    allTop: "تعلّم شيئًا",
    allBottom: "جديدًا اليوم.",
    allShort: (n: number) => `${courses(n)} جاهزة للتحميل بعد الدفع.`,
    allLong: (n: number) => `${courses(n)} جاهزة للتحميل فور تأكيد الدفع. ادفع بـ CIB أو الذهبية.`,
    browseAll: "تصفّح كل الدورات",
  },

  trust: [
    { title: "وصول فوري", text: "يظهر رابط التحميل مباشرة بعد الدفع." },
    { title: "دفع آمن", text: "ادفع بـ CIB أو الذهبية عبر SlickPay." },
    { title: "وصول مدى الحياة", text: "كل مشترياتك تبقى في «دوراتي»." },
    { title: "الدعم", text: "لديك سؤال؟ تواصل معنا في أي وقت." },
  ],

  card: {
    featured: "مميّزة",
    instant: "وصول فوري",
    empty: "لا توجد دورات هنا بعد.",
  },

  pagination: {
    label: "ترقيم الصفحات",
    prev: "السابق",
    next: "التالي",
    prevPage: "الصفحة السابقة",
    nextPage: "الصفحة التالية",
  },

  shop: {
    title: "كل الدورات",
    count: (n: number, q?: string) => `${courses(n)}${q ? ` تطابق «${q}»` : ""}`,
    pageOf: (p: number, t: number) => ` · الصفحة ${p} من ${t}`,
    clearFilters: "مسح التصفية",
    min: "من",
    max: "إلى",
    any: "أي",
    minPrice: "أقل سعر",
    maxPrice: "أعلى سعر",
    sortBy: "ترتيب حسب",
    newest: "الأحدث أولًا",
    priceAsc: "السعر: من الأقل إلى الأعلى",
    priceDesc: "السعر: من الأعلى إلى الأقل",
    apply: "تطبيق",
    niche: "المجال",
    all: "الكل",
    noMatch: "لا توجد دورات تطابق هذه التصفية",
    noMatchHint: "جرّب مجالًا آخر أو نطاق سعر أوسع أو بحثًا أقصر.",
  },

  course: {
    breadcrumb: "الدورات",
    owned: "تملكها",
    featured: "مميّزة",
    oneTime: "دفعة واحدة",
    notAvailable: "هذه الدورة غير متاحة للشراء حاليًا.",
    checkoutError: "تعذّر بدء عملية الدفع. يرجى المحاولة بعد قليل.",
    testMode: "وضع الاختبار",
    download: "تحميل الدورة",
    notYet: "غير متاحة بعد",
    buyNow: (price: string) => `اشترِ الآن — ${price}`,
    signInToBuy: "سجّل الدخول للشراء",
    redirecting: "جارٍ التحويل إلى الدفع…",
    adding: "جارٍ الإضافة…",
    addToCart: "أضف إلى السلة",
    inCart: "في سلتك · عرض السلة",
    salesPage: "عرض صفحة البيع الكاملة",
    secure: "دفع آمن بـ CIB / الذهبية عبر SlickPay",
    instant: "وصول فوري",
    about: "عن هذه الدورة",
  },

  cart: {
    title: "السلة",
    count: courses,
    nothingToBuy: "لا يوجد في سلتك ما يمكن شراؤه حاليًا.",
    checkoutError: "تعذّر بدء عملية الدفع. يرجى المحاولة بعد قليل.",
    emptyTitle: "سلتك فارغة",
    emptyText: "أضف الدورات من صفحاتها، ثم ادفع ثمنها كلها مرة واحدة.",
    browse: "تصفّح الدورات",
    alreadyYours: "تملكها مسبقًا",
    notAvailable: "غير متاحة بعد",
    remove: "إزالة",
    removeItem: (name: string) => `إزالة ${name}`,
    summary: "الملخّص",
    promoCode: "كود الخصم",
    promoPlaceholder: "مثال: WELCOME10",
    apply: "تطبيق",
    promoInvalid: "كود الخصم هذا غير موجود.",
    promoUsed: "هذا الكود صالح لطلبك الأول فقط.",
    promoCantUse: (code: string) => `لا يمكن استخدام ${code} في هذا الطلب.`,
    promoLabel: (percent: number) => `خصم ${percent}% على طلبك الأول`,
    subtotal: "المجموع الفرعي",
    discount: (percent: number) => `الخصم (${percent}%)`,
    total: "المجموع",
    checkout: (price: string) => `إتمام الشراء — ${price}`,
    signInToCheckout: "سجّل الدخول لإتمام الشراء",
    nothingToPay: "لا يوجد ما يُدفع",
    secure: "دفعة آمنة واحدة لكل الدورات، بـ CIB / الذهبية عبر SlickPay.",
  },

  library: {
    title: "دوراتي",
    count: courses,
    browse: "تصفّح الدورات",
    emptyTitle: "لا شيء هنا بعد",
    emptyText: "الدورات التي تشتريها ستظهر هنا مع رابط التحميل.",
    purchased: "المشتريات",
    lifetime: "وصول مدى الحياة",
    purchasedOn: (date: string) => `اشتريتها في ${date}`,
    download: "تحميل",
  },

  payment: {
    title: "الدفع",
    success: "تم الدفع بنجاح",
    pending: "لم يتم تأكيد الدفع بعد",
    successText: "دورتك جاهزة في «دوراتي».",
    pendingText: "إذا أتممت الدفع، فقد يستغرق التأكيد دقيقة. حدّث هذه الصفحة أو افتح «دوراتي».",
    pendingNote: "يتم تأكيد كل دفعة مع SlickPay قبل إظهار رابط التحميل.",
    goLibrary: "الذهاب إلى دوراتي",
    back: "العودة إلى الدورات",
  },

  auth: {
    createTitle: "أنشئ حسابك",
    welcomeBack: "مرحبًا بعودتك",
    createText: "أنشئ حسابًا لشراء الدورات وتحميلها.",
    signInText: "سجّل الدخول للوصول إلى دوراتك.",
    firstName: "الاسم",
    lastName: "اللقب",
    phone: "رقم الهاتف",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    passwordHint: "6 أحرف على الأقل",
    createAccount: "إنشاء الحساب",
    signIn: "تسجيل الدخول",
    haveAccount: "لديك حساب بالفعل؟ ",
    newHere: "جديد هنا؟ ",
    createLink: "أنشئ حسابًا",
    secure: "دفع آمن · CIB · الذهبية",
    courses: "الدورات",
    checkInbox: "تفقّد بريدك الإلكتروني لتأكيد حسابك، ثم سجّل الدخول.",
    errors: {
      invalidCredentials: "البريد الإلكتروني أو كلمة المرور غير صحيحة.",
      emailNotConfirmed: "يرجى تأكيد بريدك الإلكتروني أولًا (تفقّد صندوق الوارد).",
      alreadyRegistered: "يوجد حساب بهذا البريد الإلكتروني بالفعل.",
      weakPassword: "يجب أن تتكون كلمة المرور من 6 أحرف على الأقل.",
      rateLimit: "محاولات كثيرة. يرجى الانتظار دقيقة ثم إعادة المحاولة.",
      generic: "حدث خطأ ما. يرجى المحاولة مرة أخرى.",
    },
  },

  notFound: {
    title: "الصفحة غير موجودة",
    text: "الصفحة التي تبحث عنها غير موجودة أو تم نقلها.",
    back: "العودة إلى الدورات",
    courses: "الدورات",
  },

  error: {
    title: "حدث خطأ ما",
    text: "تعذّر تحميل هذه الصفحة. يرجى المحاولة بعد قليل.",
    retry: "إعادة المحاولة",
    back: "العودة إلى الدورات",
  },
};
