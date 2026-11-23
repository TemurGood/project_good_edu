// ============================================================================
// Good Edu — Global Cloud RAG Engine (Google Docs .docx + Excel/Google Sheets .xlsx)
// Built according to the `google-ai-studio-rag` skill specification:
// - Embedding Model: gemini-embedding-001 (taskType: RETRIEVAL_DOCUMENT / RETRIEVAL_QUERY)
// - Chat Generation Model: gemini-3.5-flash-lite
// - Live Cloud Sync: Fetches fresh Price & FAQ from Google Docs (.docx) and
//   Teachers Schedule & Bookings from Excel / Google Sheets (.xlsx)
// - Smart Agent Booking: Finds free slots ("Свободно") and books students directly
//   into the schedule table!
// ============================================================================

const RAG_STORAGE_API_KEY = "good_edu_gemini_api_key";
const DEFAULT_GEMINI_API_KEY =
  (typeof window !== "undefined" && window.GOOD_EDU_LOCAL_ENV && window.GOOD_EDU_LOCAL_ENV.GEMINI_API_KEY) ||
  (typeof process !== "undefined" && process.env && process.env.GEMINI_API_KEY) ||
  "";
const DEFAULT_APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzOpUK9_sjIrKF6FlfXlzMaS_qKyTS9xlyLdQXHLSRruKnreSSuGW9WbVvxdrzQIiasMQ/exec";
const DEFAULT_PRICE_DOC_ID = "1gOBh6JhBnAn26QM-HpRMuh2nd21xf9eLNBsSNjVLy7I";
const DEFAULT_FAQ_DOC_ID = "11P2rxKx8aiu9HSRF4X7Yzhmtq-yuN5KiB71mUCsa95g";
const DEFAULT_SCHEDULE_SHEET_ID = "1YZ4AzLASgLNrD76sqowRyBe_2MxCnWXlrcrSm9w5ie8";
const CLOUD_CONFIG_STORAGE_KEY = "good_edu_google_cloud_config_v3";
const SCHEDULE_TABLE_STORAGE_KEY = "good_edu_excel_schedule_table_v1";

const EMBEDDING_MODEL = "gemini-embedding-001";
const PRIMARY_CHAT_MODEL = "gemini-3.5-flash-lite";
const FALLBACK_CHAT_MODELS = [
  "gemini-3.5-flash-lite",
  "gemini-3.5-flash-lite-preview",
  "gemini-2.5-flash-lite",
  "gemini-2.5-flash"
];

const vectorCache = new Map();

// ============================================================================
// 1. INITIAL EXCEL SCHEDULE TABLE (All Teachers, All Tracks, Slots & Bookings)
// Mirrors `good_edu_schedule.xlsx` so it works immediately and syncs with Google Sheets
// ============================================================================
const INITIAL_EXCEL_SCHEDULE_ROWS = [
  // 1. Азизбек Рахимов
  {
    slotId: "SLOT-101",
    teacher: "Азизбек Рахимов",
    roleCompany: "Principal Full-Stack Архитектор (Ex-EPAM)",
    experience: "11 лет",
    stack: "TypeScript, React, Next.js, Node.js",
    course: "Full-Stack Web Разработчик (React & Node.js)",
    day: "Понедельник",
    time: "18:00 - 19:30",
    room: "Каб. 201",
    status: "Занято",
    studentName: "Жавохир Тошматов",
    studentPhone: "+998 (90) 945-12-34",
    comment: "Вводный урок + код-ревью"
  },
  {
    slotId: "SLOT-102",
    teacher: "Азизбек Рахимов",
    roleCompany: "Principal Full-Stack Архитектор (Ex-EPAM)",
    experience: "11 лет",
    stack: "TypeScript, React, Next.js, Node.js",
    course: "Full-Stack Web Разработчик (React & Node.js)",
    day: "Понедельник",
    time: "19:30 - 21:00",
    room: "Каб. 201",
    status: "Свободно",
    studentName: "",
    studentPhone: "",
    comment: "Доступно для записи"
  },
  {
    slotId: "SLOT-103",
    teacher: "Азизбек Рахимов",
    roleCompany: "Principal Full-Stack Архитектор (Ex-EPAM)",
    experience: "11 лет",
    stack: "TypeScript, React, Next.js, Node.js",
    course: "Frontend Разработчик (JS, TS, React)",
    day: "Среда",
    time: "18:00 - 19:30",
    room: "Каб. 201",
    status: "Свободно",
    studentName: "",
    studentPhone: "",
    comment: "Доступно для записи"
  },
  {
    slotId: "SLOT-104",
    teacher: "Азизбек Рахимов",
    roleCompany: "Principal Full-Stack Архитектор (Ex-EPAM)",
    experience: "11 лет",
    stack: "TypeScript, React, Next.js, Node.js",
    course: "Full-Stack Web Разработчик (React & Node.js)",
    day: "Пятница",
    time: "18:00 - 20:00",
    room: "Каб. 201",
    status: "Свободно",
    studentName: "",
    studentPhone: "",
    comment: "Архитектура и практика"
  },
  {
    slotId: "SLOT-105",
    teacher: "Азизбек Рахимов",
    roleCompany: "Principal Full-Stack Архитектор (Ex-EPAM)",
    experience: "11 лет",
    stack: "TypeScript, React, Next.js, Node.js",
    course: "Full-Stack Web Разработчик (React & Node.js)",
    day: "Суббота",
    time: "14:00 - 16:00",
    room: "Каб. 201",
    status: "Свободно",
    studentName: "",
    studentPhone: "",
    comment: "Субботний пробный урок"
  },

  // 2. Елена Соколова
  {
    slotId: "SLOT-201",
    teacher: "Елена Соколова",
    roleCompany: "Head of AI & Machine Learning (PhD CS)",
    experience: "9 лет",
    stack: "Python, PyTorch, LLM, RAG, SQL",
    course: "AI Engineer & Data Science (Python & LLM)",
    day: "Вторник",
    time: "17:30 - 19:00",
    room: "AI-Lab 305",
    status: "Занято",
    studentName: "Шохрух Мирзаев",
    studentPhone: "+998 (93) 321-55-44",
    comment: "Консультация по LLM"
  },
  {
    slotId: "SLOT-202",
    teacher: "Елена Соколова",
    roleCompany: "Head of AI & Machine Learning (PhD CS)",
    experience: "9 лет",
    stack: "Python, PyTorch, LLM, RAG, SQL",
    course: "AI Engineer & Data Science (Python & LLM)",
    day: "Вторник",
    time: "19:00 - 21:00",
    room: "AI-Lab 305",
    status: "Свободно",
    studentName: "",
    studentPhone: "",
    comment: "Доступно для записи"
  },
  {
    slotId: "SLOT-203",
    teacher: "Елена Соколова",
    roleCompany: "Head of AI & Machine Learning (PhD CS)",
    experience: "9 лет",
    stack: "Python, PyTorch, LLM, RAG, SQL",
    course: "Data Analyst & BI-аналитика",
    day: "Среда",
    time: "15:00 - 17:00",
    room: "AI-Lab 305",
    status: "Свободно",
    studentName: "",
    studentPhone: "",
    comment: "Доступно для записи"
  },
  {
    slotId: "SLOT-204",
    teacher: "Елена Соколова",
    roleCompany: "Head of AI & Machine Learning (PhD CS)",
    experience: "9 лет",
    stack: "Python, PyTorch, LLM, RAG, SQL",
    course: "AI Engineer & Data Science (Python & LLM)",
    day: "Четверг",
    time: "18:00 - 20:30",
    room: "AI-Lab 305",
    status: "Свободно",
    studentName: "",
    studentPhone: "",
    comment: "Доступно для записи"
  },
  {
    slotId: "SLOT-205",
    teacher: "Елена Соколова",
    roleCompany: "Head of AI & Machine Learning (PhD CS)",
    experience: "9 лет",
    stack: "Python, PyTorch, LLM, RAG, SQL",
    course: "AI Engineer & Data Science (Python & LLM)",
    day: "Суббота",
    time: "15:00 - 17:00",
    room: "AI-Lab 305",
    status: "Свободно",
    studentName: "",
    studentPhone: "",
    comment: "Практикум на GPU-серверах"
  },

  // 3. Сардор Алимов
  {
    slotId: "SLOT-301",
    teacher: "Сардор Алимов",
    roleCompany: "Lead Product & UI/UX Дизайнер (Red Dot Winner)",
    experience: "8 лет",
    stack: "Figma, Design Systems, UX Research, Framer",
    course: "UI/UX & Product Design",
    day: "Понедельник",
    time: "15:30 - 17:30",
    room: "Design Studio 104",
    status: "Занято",
    studentName: "Малика Абдуллаева",
    studentPhone: "+998 (93) 511-88-90",
    comment: "Разбор портфолио"
  },
  {
    slotId: "SLOT-302",
    teacher: "Сардор Алимов",
    roleCompany: "Lead Product & UI/UX Дизайнер (Red Dot Winner)",
    experience: "8 лет",
    stack: "Figma, Design Systems, UX Research, Framer",
    course: "UI/UX & Product Design",
    day: "Понедельник",
    time: "18:30 - 20:30",
    room: "Design Studio 104",
    status: "Свободно",
    studentName: "",
    studentPhone: "",
    comment: "Доступно для записи"
  },
  {
    slotId: "SLOT-303",
    teacher: "Сардор Алимов",
    roleCompany: "Lead Product & UI/UX Дизайнер (Red Dot Winner)",
    experience: "8 лет",
    stack: "Figma, Design Systems, UX Research, Framer",
    course: "UI/UX & Product Design",
    day: "Среда",
    time: "18:30 - 20:30",
    room: "Design Studio 104",
    status: "Свободно",
    studentName: "",
    studentPhone: "",
    comment: "Доступно для записи"
  },
  {
    slotId: "SLOT-304",
    teacher: "Сардор Алимов",
    roleCompany: "Lead Product & UI/UX Дизайнер (Red Dot Winner)",
    experience: "8 лет",
    stack: "Figma, Design Systems, UX Research, Framer",
    course: "UI/UX & Product Design",
    day: "Пятница",
    time: "16:00 - 18:00",
    room: "Design Studio 104",
    status: "Свободно",
    studentName: "",
    studentPhone: "",
    comment: "Воркшоп по Figma"
  },
  {
    slotId: "SLOT-305",
    teacher: "Сардор Алимов",
    roleCompany: "Lead Product & UI/UX Дизайнер (Red Dot Winner)",
    experience: "8 лет",
    stack: "Figma, Design Systems, UX Research, Framer",
    course: "UI/UX & Product Design",
    day: "Воскресенье",
    time: "11:00 - 14:00",
    room: "Design Studio 104",
    status: "Свободно",
    studentName: "",
    studentPhone: "",
    comment: "Открытый дизайн-линч"
  },

  // 4. Дмитрий Громов
  {
    slotId: "SLOT-401",
    teacher: "Дмитрий Громов",
    roleCompany: "Senior DevSecOps & Cloud Инженер (OSCP & AWS)",
    experience: "10 лет",
    stack: "Kubernetes, Linux, AWS, Terraform, OWASP",
    course: "Кибербезопасность & Ethical Hacking (DevSecOps)",
    day: "Вторник",
    time: "18:30 - 21:00",
    room: "Cyber Polygon 402",
    status: "Свободно",
    studentName: "",
    studentPhone: "",
    comment: "Доступно для записи"
  },
  {
    slotId: "SLOT-402",
    teacher: "Дмитрий Громов",
    roleCompany: "Senior DevSecOps & Cloud Инженер (OSCP & AWS)",
    experience: "10 лет",
    stack: "Kubernetes, Linux, AWS, Terraform, OWASP",
    course: "Cloud & DevOps Инженер (Kubernetes & AWS)",
    day: "Четверг",
    time: "18:30 - 21:00",
    room: "Cyber Polygon 402",
    status: "Свободно",
    studentName: "",
    studentPhone: "",
    comment: "Доступно для записи"
  },
  {
    slotId: "SLOT-403",
    teacher: "Дмитрий Громов",
    roleCompany: "Senior DevSecOps & Cloud Инженер (OSCP & AWS)",
    experience: "10 лет",
    stack: "Kubernetes, Linux, AWS, Terraform, OWASP",
    course: "Cloud & DevOps Инженер (Kubernetes & AWS)",
    day: "Пятница",
    time: "17:00 - 19:30",
    room: "Cyber Polygon 402",
    status: "Занято",
    studentName: "Рустам Касымов",
    studentPhone: "+998 (97) 700-11-22",
    comment: "Лабораторная по Kubernetes"
  },
  {
    slotId: "SLOT-404",
    teacher: "Дмитрий Громов",
    roleCompany: "Senior DevSecOps & Cloud Инженер (OSCP & AWS)",
    experience: "10 лет",
    stack: "Kubernetes, Linux, AWS, Terraform, OWASP",
    course: "Кибербезопасность & Ethical Hacking (DevSecOps)",
    day: "Суббота",
    time: "16:00 - 18:00",
    room: "Cyber Polygon 402",
    status: "Свободно",
    studentName: "",
    studentPhone: "",
    comment: "Киберучения Red/Blue Team"
  },

  // 5. Мадина Каримова
  {
    slotId: "SLOT-501",
    teacher: "Мадина Каримова",
    roleCompany: "Senior Mobile Engineer (15+ Apps in App Store)",
    experience: "7 лет",
    stack: "Flutter, Dart, Swift, SwiftUI, Clean Arch",
    course: "Мобильная разработка (Flutter & iOS/Android)",
    day: "Понедельник",
    time: "10:00 - 12:00",
    room: "Mobile Hub 208",
    status: "Свободно",
    studentName: "",
    studentPhone: "",
    comment: "Утренний поток Flutter"
  },
  {
    slotId: "SLOT-502",
    teacher: "Мадина Каримова",
    roleCompany: "Senior Mobile Engineer (15+ Apps in App Store)",
    experience: "7 лет",
    stack: "Flutter, Dart, Swift, SwiftUI, Clean Arch",
    course: "iOS Разработчик (Swift & SwiftUI)",
    day: "Вторник",
    time: "18:00 - 20:30",
    room: "Mobile Hub 208",
    status: "Свободно",
    studentName: "",
    studentPhone: "",
    comment: "Вечерний поток iOS/Flutter"
  },
  {
    slotId: "SLOT-503",
    teacher: "Мадина Каримова",
    roleCompany: "Senior Mobile Engineer (15+ Apps in App Store)",
    experience: "7 лет",
    stack: "Flutter, Dart, Swift, SwiftUI, Clean Arch",
    course: "Мобильная разработка (Flutter & iOS/Android)",
    day: "Четверг",
    time: "18:00 - 20:30",
    room: "Mobile Hub 208",
    status: "Свободно",
    studentName: "",
    studentPhone: "",
    comment: "Доступно для записи"
  },
  {
    slotId: "SLOT-504",
    teacher: "Мадина Каримова",
    roleCompany: "Senior Mobile Engineer (15+ Apps in App Store)",
    experience: "7 лет",
    stack: "Flutter, Dart, Swift, SwiftUI, Clean Arch",
    course: "Мобильная разработка (Flutter & iOS/Android)",
    day: "Суббота",
    time: "13:00 - 16:00",
    room: "Mobile Hub 208",
    status: "Свободно",
    studentName: "",
    studentPhone: "",
    comment: "Субботний мобильный воркшоп"
  },

  // 6. Тимур Садыков
  {
    slotId: "SLOT-601",
    teacher: "Тимур Садыков",
    roleCompany: "Senior Python & QA Automation Lead",
    experience: "8 лет",
    stack: "Python, Django, FastAPI, Playwright, PyTest",
    course: "Python Backend Разработчик (Django & FastAPI)",
    day: "Понедельник",
    time: "14:00 - 16:00",
    room: "Каб. 109",
    status: "Свободно",
    studentName: "",
    studentPhone: "",
    comment: "Дневной поток Python"
  },
  {
    slotId: "SLOT-602",
    teacher: "Тимур Садыков",
    roleCompany: "Senior Python & QA Automation Lead",
    experience: "8 лет",
    stack: "Python, Django, FastAPI, Playwright, PyTest",
    course: "QA Engineer (Ручное + Автотесты Python)",
    day: "Вторник",
    time: "18:30 - 20:30",
    room: "Каб. 109",
    status: "Свободно",
    studentName: "",
    studentPhone: "",
    comment: "Вечерний поток QA"
  },
  {
    slotId: "SLOT-603",
    teacher: "Тимур Садыков",
    roleCompany: "Senior Python & QA Automation Lead",
    experience: "8 лет",
    stack: "Python, Django, FastAPI, Playwright, PyTest",
    course: "Python Backend Разработчик (Django & FastAPI)",
    day: "Среда",
    time: "14:00 - 16:00",
    room: "Каб. 109",
    status: "Свободно",
    studentName: "",
    studentPhone: "",
    comment: "Доступно для записи"
  },
  {
    slotId: "SLOT-604",
    teacher: "Тимур Садыков",
    roleCompany: "Senior Python & QA Automation Lead",
    experience: "8 лет",
    stack: "Python, Django, FastAPI, Playwright, PyTest",
    course: "Основы программирования (IT-Start)",
    day: "Воскресенье",
    time: "10:00 - 13:00",
    room: "Каб. 109",
    status: "Свободно",
    studentName: "",
    studentPhone: "",
    comment: "Воскресная группа IT-Start"
  }
];

// ============================================================================
// 2. STATIC / DEFAULT RAG CHUNKS FOR PRICE & FAQ (.docx documents)
// ============================================================================
const STATIC_DOCX_CHUNKS = [
  {
    id: "price-conditions",
    docType: "price",
    category: "Google Docs (.docx): Прайс и рассрочка",
    title: "Условия оплаты, скидка 15% и рассрочка 0% на обучение",
    text: `Условия оплаты в IT-школе «Good Edu» (валюта — узбекский сум, UZS):
1. Помесячная оплата: базовая стоимость всех курсов указана за 1 месяц обучения (8–12 практических занятий в месяц).
2. Беспроцентная рассрочка 0% на дорогие и длительные курсы: на все комплексные программы общей стоимостью от 10 000 000 сум (или от 1 750 000 сум/мес) доступна рассрочка 0% без переплат на 6, 9 или 12 месяцев (через внутренний договор школы, а также сервисы Uzum Nasiya, Alif Nasiya и TBC).
3. Скидка 15%: при единовременной полной оплате всего курса сразу предоставляется скидка 15% от общей стоимости программы.`
  },
  {
    id: "price-courses-web",
    docType: "price",
    category: "Google Docs (.docx): Прайс Веб-разработка",
    title: "Стоимость курсов: Full-Stack Web (React & Node.js) и Frontend (JS, TS, React)",
    text: `Прайс на курсы веб-разработки в Good Edu:
1. Курс «Full-Stack Web Разработчик (React & Node.js)»: длительность 9 месяцев. Цена: 1 850 000 сум/мес. Полная стоимость: 16 650 000 сум (со скидкой 15% при полной оплате — 14 152 500 сум). Доступна рассрочка 0% на 9 или 12 месяцев (от 1 387 500 сум/мес). Стек: HTML5/CSS3, JavaScript, TypeScript, React 19, Next.js, Node.js, PostgreSQL, Docker.
2. Курс «Frontend Разработчик (JavaScript, TypeScript, React)»: длительность 6 месяцев. Цена: 1 550 000 сум/мес. Полная стоимость: 9 300 000 сум (со скидкой 15% — 7 905 000 сум). Доступна помесячная оплата или рассрочка на 6 месяцев.`
  },
  {
    id: "price-courses-ai-data",
    docType: "price",
    category: "Google Docs (.docx): Прайс AI & Data",
    title: "Стоимость курсов: AI Engineer & Data Science (Python & LLM) и Data Analyst & BI",
    text: `Прайс на курсы искусственного интеллекта и аналитики данных в Good Edu:
1. Курс «AI Engineer & Data Science (Python & LLM)»: длительность 10 месяцев. Цена: 2 100 000 сум/мес. Полная стоимость: 21 000 000 сум (со скидкой 15% при полной оплате — 17 850 000 сум). Доступна беспроцентная рассрочка 0% на 10 или 12 месяцев (от 1 750 000 сум/мес). Стек: Python, SQL, Machine Learning, Deep Learning (PyTorch), Computer Vision, LLM, RAG, LangChain, MLOps.
2. Курс «Data Analyst & BI-аналитика (SQL, Python, Power BI)»: длительность 5 месяцев. Цена: 1 550 000 сум/мес. Полная стоимость: 7 750 000 сум (со скидкой 15% — 6 587 500 сум).`
  },
  {
    id: "price-courses-backend",
    docType: "price",
    category: "Google Docs (.docx): Прайс Backend",
    title: "Стоимость курсов: Python Backend (Django & FastAPI) и Java Enterprise (Spring Boot)",
    text: `Прайс на курсы серверной (Backend) разработки в Good Edu:
1. Курс «Python Backend Разработчик (Django & FastAPI)»: длительность 7 месяцев. Цена: 1 650 000 сум/мес. Полная стоимость: 11 550 000 сум (со скидкой 15% — 9 817 500 сум). Доступна рассрочка 0% на 9 месяцев (от 1 283 000 сум/мес).
2. Курс «Java Enterprise Backend Разработчик (Spring Boot)»: длительность 8 месяцев. Цена: 1 850 000 сум/мес. Полная стоимость: 14 800 000 сум (со скидкой 15% — 12 580 000 сум). Доступна рассрочка 0% на 9 или 12 месяцев (от 1 233 000 сум/мес).`
  },
  {
    id: "price-courses-mobile",
    docType: "price",
    category: "Google Docs (.docx): Прайс Mobile",
    title: "Стоимость курсов: Мобильная разработка (Flutter) и iOS Разработчик (Swift & SwiftUI)",
    text: `Прайс на курсы мобильной разработки в Good Edu:
1. Курс «Мобильная разработка (Flutter & iOS/Android)»: длительность 7 месяцев. Цена: 1 750 000 сум/мес. Полная стоимость: 12 250 000 сум (со скидкой 15% — 10 412 500 сум). Доступна рассрочка 0% на 9 или 12 месяцев (от 1 020 000 сум/мес).
2. Курс «iOS Разработчик (Swift & SwiftUI)»: длительность 7 месяцев. Цена: 1 800 000 сум/мес. Полная стоимость: 12 600 000 сум (со скидкой 15% — 10 710 000 сум). Доступна рассрочка 0% на 9 или 12 месяцев (от 1 050 000 сум/мес).`
  },
  {
    id: "price-courses-sec-devops",
    docType: "price",
    category: "Google Docs (.docx): Прайс Security & DevOps",
    title: "Стоимость курсов: Кибербезопасность (Ethical Hacking) и Cloud & DevOps (Kubernetes & AWS)",
    text: `Прайс на курсы кибербезопасности и облачной инфраструктуры в Good Edu:
1. Курс «Кибербезопасность & Ethical Hacking (DevSecOps)»: длительность 8 месяцев. Цена: 1 950 000 сум/мес. Полная стоимость: 15 600 000 сум (со скидкой 15% — 13 260 000 сум). Доступна рассрочка 0% на 9 или 12 месяцев (от 1 300 000 сум/мес).
2. Курс «Cloud & DevOps Инженер (Kubernetes & AWS)»: длительность 7 месяцев. Цена: 2 000 000 сум/мес. Полная стоимость: 14 000 000 сум (со скидкой 15% — 11 900 000 сум). Доступна рассрочка 0% на 9 или 12 месяцев (от 1 166 000 сум/мес).`
  },
  {
    id: "price-courses-design-qa-pm-start",
    docType: "price",
    category: "Google Docs (.docx): Прайс Design, QA, PM, Start",
    title: "Стоимость курсов: UI/UX Design, QA Engineer, IT Project Management и IT-Start",
    text: `Прайс на курсы дизайна, тестирования, менеджмента и базового программирования в Good Edu:
1. Курс «UI/UX & Product Design»: 6 месяцев, 1 600 000 сум/мес, полная стоимость 9 600 000 сум (со скидкой 15% — 8 160 000 сум).
2. Курс «QA Engineer (Python + Playwright)»: 5 месяцев, 1 450 000 сум/мес, полная стоимость 7 250 000 сум (со скидкой 15% — 6 162 500 сум).
3. Курс «IT Project & Product Management»: 4 месяца, 1 500 000 сум/мес, полная стоимость 6 000 000 сум.
4. Курс «Основы программирования (IT-Start)»: 3 месяца, 1 100 000 сум/мес, полная стоимость 3 300 000 сум.`
  },
  {
    id: "faq-enrollment-booking",
    docType: "faq",
    category: "Google Docs (.docx): FAQ Запись и бронь",
    title: "Как записаться на курс, забронировать место в группе и прийти на пробный урок",
    text: `Запись и бронирование места в IT-школе «Good Edu»:
Записаться на курс или бесплатный пробный урок можно прямо через AI-ассистента в чате (назовите преподавателя/курс, день недели, ваше имя и телефон), через форму на сайте, по телефонам +998 (71) 200-77-88 и +998 (90) 123-45-67 или в Telegram @goodedu_uz.
Размер офлайн-групп ограничен (14–16 студентов), место закрепляется после договора и оплаты 1-го месяца или рассрочки.`
  },
  {
    id: "faq-payment-methods",
    docType: "faq",
    category: "Google Docs (.docx): FAQ Оплата",
    title: "Способы оплаты обучения и оформление рассрочки",
    text: `Способы оплаты в IT-школе «Good Edu»:
Принимаются платежи в узбекских сумах (UZS) через Payme, Click, Uzum Bank, картами Uzcard и Humo через терминал, наличными в кассе и безналичным переводом для юрлиц.
Доступна помесячная оплата, скидка 15% при оплате всего курса или рассрочка 0% на 6, 9, 12 месяцев на курсы от 10 000 000 сум.`
  },
  {
    id: "faq-cancellation-reschedule",
    docType: "faq",
    category: "Google Docs (.docx): FAQ Пропуск и возврат",
    title: "Пропуск занятия, заморозка/перенос на другой поток и возврат денег",
    text: `Правила пропуска занятий, переноса и отмены обучения в Good Edu:
- Разовый пропуск: все уроки записываются, видеозапись и ДЗ доступны в личном кабинете в тот же день.
- Перенос и заморозка: при болезни, командировке или сессии можно бесплатно перевестись на следующий поток.
- Отмена и возврат: до старта курса возвращается 100% суммы. В процессе обучения возвращается остаток за все непройденные занятия текущего месяца за 5–7 рабочих дней.`
  },
  {
    id: "faq-guarantee-quality-career",
    docType: "faq",
    category: "Google Docs (.docx): FAQ Гарантии и Карьера",
    title: "Гарантии качества обучения, сертификат и помощь в трудоустройстве",
    text: `Гарантии качества и Центр карьеры в Good Edu:
Преподаватели уровня Senior/Lead (опыт 5–11 лет), ручное код-ревью, 3–5 проектов в портфолио. Центр карьеры готовит резюме, GitHub/LinkedIn, проводит Mock-интервью и направляет выпускников в 65+ компаний-партнёров. 94.2% выпускников находят работу за 90 дней. Выдаётся официальный сертификат с QR-кодом.`
  },
  {
    id: "faq-what-to-bring-laptop",
    docType: "faq",
    category: "Google Docs (.docx): FAQ Ноутбук и подготовка",
    title: "Что взять с собой на занятия, требования к ноутбуку и подготовка с нуля",
    text: `Что взять с собой и нужен ли свой ноутбук в Good Edu:
- В кампусе все аудитории оборудованы мощными ПК и Mac-станциями (включая GPU NVIDIA для AI). Если своего ноутбука нет — можно бесплатно работать на компьютерах школы.
- Для своего ноутбука достаточно Core i5 / Ryzen 5 / Apple M1, 8–16 ГБ RAM и 50 ГБ SSD.
- На первое занятие возьмите паспорт или ID-карту для пропуска и договора. Для обучения с нуля опыт программирования не требуется.`
  },
  {
    id: "schedule-contacts-campus",
    docType: "schedule",
    category: "Контакты и режим работы кампуса",
    title: "Адрес кампуса, телефоны для записи, мессенджеры и часы работы Good Edu",
    text: `Контактные данные и режим работы кампуса IT-школы «Good Edu»:
- Адрес: г. Ташкент, Мирзо-Улугбекский район, IT-Парк, ул. Муминова, 7А.
- Телефоны для записи: +998 (71) 200-77-88 и +998 (90) 123-45-67.
- Мессенджеры и соцсети: Telegram https://t.me/goodedu_uz (@goodedu_uz) и Instagram https://instagram.com/goodedu.uz (@goodedu.uz).
- Режим работы кампуса: Пн–Сб с 09:00 до 21:00, Вс с 10:00 до 18:00.`
  }
];

// ============================================================================
// 3. STATE MANAGEMENT FOR EXCEL SCHEDULE TABLE & CLOUD SYNC CONFIG
// ============================================================================

function loadScheduleTable() {
  try {
    const raw = localStorage.getItem(SCHEDULE_TABLE_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.warn("Could not load schedule table from storage:", e);
  }
  return JSON.parse(JSON.stringify(INITIAL_EXCEL_SCHEDULE_ROWS));
}

let excelScheduleTable = loadScheduleTable();
let dynamicDocxChunks = [];
let GOOD_EDU_RAG_CHUNKS = [];
let lastCloudHash = "";

function saveScheduleTable() {
  try {
    localStorage.setItem(SCHEDULE_TABLE_STORAGE_KEY, JSON.stringify(excelScheduleTable));
  } catch (e) {
    console.warn("Could not save schedule table:", e);
  }
}

function getCloudConfig() {
  try {
    const raw = localStorage.getItem(CLOUD_CONFIG_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        ...parsed,
        appsScriptUrl: parsed.appsScriptUrl || DEFAULT_APPS_SCRIPT_URL,
        priceDocId: parsed.priceDocId || DEFAULT_PRICE_DOC_ID,
        faqDocId: parsed.faqDocId || DEFAULT_FAQ_DOC_ID,
        scheduleSheetId: parsed.scheduleSheetId || DEFAULT_SCHEDULE_SHEET_ID,
        googleCloudApiKey: parsed.googleCloudApiKey || DEFAULT_GEMINI_API_KEY
      };
    }
  } catch (e) {}
  return {
    appsScriptUrl: DEFAULT_APPS_SCRIPT_URL,
    priceDocId: DEFAULT_PRICE_DOC_ID,
    faqDocId: DEFAULT_FAQ_DOC_ID,
    scheduleSheetId: DEFAULT_SCHEDULE_SHEET_ID,
    googleCloudApiKey: DEFAULT_GEMINI_API_KEY,
    autoSyncEnabled: true,
    lastSyncTime: null
  };
}

function saveCloudConfig(cfg) {
  const merged = { ...getCloudConfig(), ...cfg };
  localStorage.setItem(CLOUD_CONFIG_STORAGE_KEY, JSON.stringify(merged));
  return merged;
}

/**
 * Dynamically converts the current Excel Schedule Table (`excelScheduleTable`)
 * into live RAG chunks per teacher + an overall Free Slots chunk.
 * Whenever a student books a slot or the Google Sheet updates, RAG chunks regenerate immediately!
 */
function buildScheduleChunksFromTable(rows) {
  const byTeacher = new Map();
  for (const r of rows) {
    if (!byTeacher.has(r.teacher)) {
      byTeacher.set(r.teacher, []);
    }
    byTeacher.get(r.teacher).push(r);
  }

  const teacherChunks = [];
  for (const [teacherName, slots] of byTeacher.entries()) {
    const first = slots[0];
    const freeSlots = slots.filter((s) => s.status.toLowerCase().includes("свобод"));
    const busySlots = slots.filter((s) => !s.status.toLowerCase().includes("свобод"));

    const slotsLines = slots
      .map(
        (s) =>
          `• [${s.slotId}] ${s.day}, ${s.time} | Курс: ${s.course} | Кабинет: ${s.room} | Статус: ${s.status.toUpperCase()}${
            s.studentName ? ` (Записан студент: ${s.studentName})` : " (ОКНО СВОБОДНО ДЛЯ ЗАПИСИ)"
          }`
      )
      .join("\n");

    teacherChunks.push({
      id: `excel-schedule-${teacherName.toLowerCase().replace(/\s+/g, "-")}`,
      docType: "schedule",
      category: "Excel Таблица: Расписание и свободные окна",
      title: `Расписание и свободные окна преподавателя: ${teacherName} (${first.roleCompany})`,
      text: `Преподаватель: ${teacherName} — ${first.roleCompany}, опыт: ${first.experience}. Стек технологий: ${first.stack}.
Всего окон в расписании: ${slots.length} (Свободных окон: ${freeSlots.length}, Занятых: ${busySlots.length}).
Почасовой график и статус окон по дням недели из Excel-таблицы:
${slotsLines}`
    });
  }

  // Dedicated summary chunk of ALL currently FREE slots across the school
  const allFree = rows.filter((s) => s.status.toLowerCase().includes("свобод"));
  teacherChunks.push({
    id: "excel-all-free-slots",
    docType: "schedule",
    category: "Excel Таблица: Все свободные окна",
    title: `Сводка всех свободных окон для записи студентов (${allFree.length} свободных слотов)`,
    text: `Актуальный список СВОБОДНЫХ ОКОН (статус «Свободно») в Excel-таблице расписания Good Edu для записи новых студентов:
${
  allFree.length === 0
    ? "На данный момент все окна заняты."
    : allFree
        .map(
          (s) =>
            `- [${s.slotId}] Преподаватель: ${s.teacher} | Направление: ${s.course} | День: ${s.day} | Время: ${s.time} | ${s.room} — СВОБОДНО`
        )
        .join("\n")
}`
  });

  return teacherChunks;
}

/**
 * Rebuild the master `GOOD_EDU_RAG_CHUNKS` array and invalidate stale vectors
 */
function rebuildMasterRagChunks() {
  const baseChunks = dynamicDocxChunks.length > 0 ? dynamicDocxChunks : STATIC_DOCX_CHUNKS;
  const scheduleChunks = buildScheduleChunksFromTable(excelScheduleTable);

  GOOD_EDU_RAG_CHUNKS.length = 0;
  GOOD_EDU_RAG_CHUNKS.push(...baseChunks, ...scheduleChunks);
  return GOOD_EDU_RAG_CHUNKS;
}

// Initialize master chunks immediately
rebuildMasterRagChunks();

// ============================================================================
// 4. LIVE GOOGLE DOCS (.docx) & GOOGLE SHEETS (.xlsx) SYNC
// Supports:
// A) Google Apps Script Web App Bridge URL (Read + Write to Sheet & Docs)
// B) Direct Google Cloud Console API (Sheets API v4 + Drive Export / Public Docs export)
// ============================================================================

function splitDocTextIntoChunks(rawText, docType, docLabel) {
  const sections = rawText
    .split(/\n(?=#{1,3}\s|\d+\.\s)/g)
    .map((s) => s.trim())
    .filter((s) => s.length > 80);

  return sections.slice(0, 18).map((sec, idx) => {
    const firstLine = sec.split(/\r?\n/)[0].replace(/^#+\s*/, "").slice(0, 110);
    return {
      id: `cloud-${docType}-${idx + 1}`,
      docType,
      category: `Google Docs Cloud (.docx): ${docLabel}`,
      title: firstLine || `${docLabel} — Фрагмент #${idx + 1}`,
      text: sec.slice(0, 1300)
    };
  });
}

function parseCsvRows(csvText) {
  const lines = csvText
    .replace(/^\uFEFF/, "")
    .split(/\r?\n/)
    .filter((l) => l.trim().length > 0);
  if (lines.length < 2) return [];

  const parseLine = (line) => {
    const out = [];
    let cur = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (inQuotes && line[i + 1] === '"') {
          cur += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (ch === "," && !inQuotes) {
        out.push(cur.trim());
        cur = "";
      } else {
        cur += ch;
      }
    }
    out.push(cur.trim());
    return out;
  };

  return lines.slice(1).map((line, idx) => {
    const cols = parseLine(line);
    return {
      slotId: cols[0] || `SLOT-${idx + 1}`,
      teacher: cols[1] || "",
      roleCompany: cols[2] || "",
      experience: cols[3] || "",
      stack: cols[4] || "",
      course: cols[5] || "",
      day: cols[6] || "",
      time: cols[7] || "",
      room: cols[8] || "",
      status: cols[9] || "Свободно",
      studentName: cols[10] || "",
      studentPhone: cols[11] || "",
      comment: cols[12] || ""
    };
  });
}

/**
 * Helper to extract a clean Google Drive File ID even if the user pasted a full URL
 */
function extractGoogleFileId(inputStr) {
  const s = (inputStr || "").trim();
  const match = s.match(/\/d\/([a-zA-Z0-9_-]{15,})/);
  return match ? match[1] : s;
}

/**
 * Browser-native ZIP entry extractor using DecompressionStream("deflate-raw")
 * Used when a Google Drive file is a raw uploaded Office .docx or .xlsx (`rtpof=true`)
 */
async function extractXmlFromZipBuffer(arrayBuffer, targetEntryName) {
  const bytes = new Uint8Array(arrayBuffer);
  const view = new DataView(arrayBuffer);
  let offset = 0;

  while (offset + 30 <= bytes.length) {
    const sig = view.getUint32(offset, true);
    if (sig !== 0x04034b50) break; // Local file header signature

    const compression = view.getUint16(offset + 8, true);
    const compSize = view.getUint32(offset + 18, true);
    const nameLen = view.getUint16(offset + 26, true);
    const extraLen = view.getUint16(offset + 28, true);

    const nameBytes = bytes.slice(offset + 30, offset + 30 + nameLen);
    const fileName = new TextDecoder("utf-8").decode(nameBytes);
    const dataStart = offset + 30 + nameLen + extraLen;
    const fileData = bytes.slice(dataStart, dataStart + compSize);

    if (fileName === targetEntryName) {
      if (compression === 0) {
        return new TextDecoder("utf-8").decode(fileData);
      } else if (compression === 8 && typeof DecompressionStream !== "undefined") {
        const ds = new DecompressionStream("deflate-raw");
        const writer = ds.writable.getWriter();
        writer.write(fileData);
        writer.close();
        const decompressedBuf = await new Response(ds.readable).arrayBuffer();
        return new TextDecoder("utf-8").decode(decompressedBuf);
      }
    }
    offset = dataStart + compSize;
  }
  return null;
}

async function parseDocxArrayBufferToText(arrayBuffer) {
  const xml = await extractXmlFromZipBuffer(arrayBuffer, "word/document.xml");
  if (!xml) return "";
  const doc = new DOMParser().parseFromString(xml, "application/xml");
  const paragraphs = Array.from(doc.getElementsByTagName("w:p"));
  return paragraphs
    .map((p) =>
      Array.from(p.getElementsByTagName("w:t"))
        .map((t) => t.textContent)
        .join("")
    )
    .filter((line) => line.trim().length > 0)
    .join("\n");
}

async function parseXlsxArrayBufferToScheduleRows(arrayBuffer) {
  const xml = await extractXmlFromZipBuffer(arrayBuffer, "xl/worksheets/sheet1.xml");
  if (!xml) return [];
  const doc = new DOMParser().parseFromString(xml, "application/xml");
  const rowNodes = Array.from(doc.getElementsByTagName("row"));
  if (rowNodes.length < 2) return [];

  return rowNodes.slice(1).map((rNode, idx) => {
    const cells = Array.from(rNode.getElementsByTagName("c")).map((cNode) => cNode.textContent || "");
    return {
      slotId: cells[0] || `SLOT-${idx + 1}`,
      teacher: cells[1] || "",
      roleCompany: cells[2] || "",
      experience: cells[3] || "",
      stack: cells[4] || "",
      course: cells[5] || "",
      day: cells[6] || "",
      time: cells[7] || "",
      room: cells[8] || "",
      status: cells[9] || "Свободно",
      studentName: cells[10] || "",
      studentPhone: cells[11] || "",
      comment: cells[12] || ""
    };
  });
}

async function fetchGoogleDocText(rawDocId, apiKey) {
  const docId = extractGoogleFileId(rawDocId);
  if (!docId) return "";

  // 1. Try native Google Docs plain text export
  const exportUrls = [
    `https://docs.google.com/document/d/${docId}/export?format=txt`,
    apiKey ? `https://www.googleapis.com/drive/v3/files/${docId}/export?mimeType=text/plain&key=${apiKey}` : null
  ].filter(Boolean);

  for (const url of exportUrls) {
    try {
      const r = await fetch(url);
      if (r.ok) {
        const ct = r.headers.get("content-type") || "";
        const txt = await r.text();
        if (!ct.includes("text/html") && !txt.trim().startsWith("<!DOCTYPE") && txt.length > 100) {
          return txt;
        }
      }
    } catch (e) {}
  }

  // 2. If file is a raw Office .docx uploaded to Drive (rtpof=true), fetch binary & parse word/document.xml
  const mediaUrls = [
    apiKey ? `https://www.googleapis.com/drive/v3/files/${docId}?alt=media&key=${apiKey}` : null,
    `https://docs.google.com/document/d/${docId}/export?format=docx`
  ].filter(Boolean);

  for (const url of mediaUrls) {
    try {
      const r = await fetch(url);
      if (r.ok) {
        const buf = await r.arrayBuffer();
        const extracted = await parseDocxArrayBufferToText(buf);
        if (extracted && extracted.length > 100) return extracted;
      }
    } catch (e) {}
  }

  return "";
}

/**
 * Syncs fresh Price (.docx), FAQ (.docx), and Schedule (.xlsx) from Google Cloud
 */
async function syncWithGoogleCloud() {
  const cfg = getCloudConfig();
  const priceId = extractGoogleFileId(cfg.priceDocId);
  const faqId = extractGoogleFileId(cfg.faqDocId);
  const sheetId = extractGoogleFileId(cfg.scheduleSheetId);
  let updatedSomething = false;
  const freshDocChunks = [];

  // 1. If Apps Script Web App URL is configured, fetch all 3 in one call
  if (cfg.appsScriptUrl && cfg.appsScriptUrl.startsWith("https://")) {
    try {
      const resp = await fetch(`${cfg.appsScriptUrl}?action=syncAll&t=${Date.now()}`);
      if (resp.ok) {
        const data = await resp.json();
        if (Array.isArray(data.schedule) && data.schedule.length > 0) {
          excelScheduleTable = data.schedule;
          saveScheduleTable();
          updatedSomething = true;
        }
        if (data.priceText && data.priceText.length > 100) {
          freshDocChunks.push(...splitDocTextIntoChunks(data.priceText, "price", "Прайс-лист"));
        }
        if (data.faqText && data.faqText.length > 100) {
          freshDocChunks.push(...splitDocTextIntoChunks(data.faqText, "faq", "FAQ"));
        }
      }
    } catch (e) {
      console.warn("[Cloud Sync] Apps Script fetch error:", e.message);
    }
  }

  // 2. Direct Google Docs / Drive .docx fetch (Price & FAQ)
  if (priceId && freshDocChunks.filter((c) => c.docType === "price").length === 0) {
    const txt = await fetchGoogleDocText(priceId, cfg.googleCloudApiKey);
    if (txt.length > 100) {
      freshDocChunks.push(...splitDocTextIntoChunks(txt, "price", "Прайс-лист"));
      updatedSomething = true;
    }
  }

  if (faqId && freshDocChunks.filter((c) => c.docType === "faq").length === 0) {
    const txt = await fetchGoogleDocText(faqId, cfg.googleCloudApiKey);
    if (txt.length > 100) {
      freshDocChunks.push(...splitDocTextIntoChunks(txt, "faq", "FAQ"));
      updatedSomething = true;
    }
  }

  // 3. Direct Google Sheets / Drive .xlsx fetch
  if (sheetId && !cfg.appsScriptUrl) {
    try {
      let loadedRows = [];

      // 3a. Try Google Sheets REST API v4
      if (cfg.googleCloudApiKey) {
        const sheetApiUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/A1:M100?key=${cfg.googleCloudApiKey}`;
        const r = await fetch(sheetApiUrl);
        if (r.ok) {
          const json = await r.json();
          if (Array.isArray(json.values) && json.values.length > 1) {
            loadedRows = json.values.slice(1).map((cols, idx) => ({
              slotId: cols[0] || `SLOT-${idx + 1}`,
              teacher: cols[1] || "",
              roleCompany: cols[2] || "",
              experience: cols[3] || "",
              stack: cols[4] || "",
              course: cols[5] || "",
              day: cols[6] || "",
              time: cols[7] || "",
              room: cols[8] || "",
              status: cols[9] || "Свободно",
              studentName: cols[10] || "",
              studentPhone: cols[11] || "",
              comment: cols[12] || ""
            }));
          }
        }
      }

      // 3b. Try raw Drive .xlsx binary download (for rtpof=true uploaded .xlsx files)
      if (loadedRows.length === 0 && cfg.googleCloudApiKey) {
        const driveMediaUrl = `https://www.googleapis.com/drive/v3/files/${sheetId}?alt=media&key=${cfg.googleCloudApiKey}`;
        const r = await fetch(driveMediaUrl);
        if (r.ok) {
          const buf = await r.arrayBuffer();
          loadedRows = await parseXlsxArrayBufferToScheduleRows(buf);
        }
      }

      // 3c. Try public CSV export
      if (loadedRows.length === 0) {
        const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`;
        const r = await fetch(csvUrl);
        if (r.ok) {
          const ct = r.headers.get("content-type") || "";
          const csvText = await r.text();
          if (!ct.includes("text/html") && !csvText.trim().startsWith("<!DOCTYPE")) {
            loadedRows = parseCsvRows(csvText);
          }
        }
      }

      if (loadedRows.length > 0) {
        excelScheduleTable = loadedRows;
        saveScheduleTable();
        updatedSomething = true;
      }
    } catch (e) {
      console.warn("[Cloud Sync] Schedule Sheet fetch warning:", e.message);
    }
  }

  if (freshDocChunks.length > 0) {
    dynamicDocxChunks = [
      ...freshDocChunks,
      STATIC_DOCX_CHUNKS.find((c) => c.id === "schedule-contacts-campus")
    ].filter(Boolean);
  }

  // Also try reading local rag_price.md & rag_faq.md if served over HTTP and no cloud override was found
  if (freshDocChunks.length === 0 && typeof window !== "undefined" && window.location.protocol.startsWith("http")) {
    try {
      const [localPriceResp, localFaqResp] = await Promise.all([
        fetch(`rag_price.md?t=${Date.now()}`),
        fetch(`rag_faq.md?t=${Date.now()}`)
      ]);
      const localChunks = [];
      if (localPriceResp.ok) {
        const pTxt = await localPriceResp.text();
        if (pTxt.length > 100) localChunks.push(...splitDocTextIntoChunks(pTxt, "price", "Прайс-лист (Local MD)"));
      }
      if (localFaqResp.ok) {
        const fTxt = await localFaqResp.text();
        if (fTxt.length > 100) localChunks.push(...splitDocTextIntoChunks(fTxt, "faq", "FAQ (Local MD)"));
      }
      if (localChunks.length > 0) {
        dynamicDocxChunks = [
          ...localChunks,
          STATIC_DOCX_CHUNKS.find((c) => c.id === "schedule-contacts-campus")
        ].filter(Boolean);
        updatedSomething = true;
      }
    } catch (e) {}
  }

  // Check if combined content hash changed — if so, clear vectorCache so updated text is re-embedded immediately!
  const currentHash = JSON.stringify({
    docs: dynamicDocxChunks.map((c) => c.text),
    sched: excelScheduleTable.map((s) => `${s.slotId}:${s.status}:${s.studentName}:${s.time}`)
  });
  if (currentHash !== lastCloudHash) {
    lastCloudHash = currentHash;
    vectorCache.clear();
    updatedSomething = true;
  }

  rebuildMasterRagChunks();

  const nowStr = new Date().toLocaleTimeString("ru-RU");
  saveCloudConfig({ lastSyncTime: nowStr });

  return {
    updated: updatedSomething,
    chunksCount: GOOD_EDU_RAG_CHUNKS.length,
    slotsCount: excelScheduleTable.length,
    freeSlotsCount: excelScheduleTable.filter((s) => s.status.toLowerCase().includes("свобод")).length,
    lastSyncTime: nowStr
  };
}

// ============================================================================
// 5. STUDENT BOOKING & FREE SLOT FINDER (Excel Schedule Table + Cloud Push)
// ============================================================================

/**
 * Find free slots ("Свободно") optionally filtered by teacher, course, or day of week
 */
function findFreeSlots({ teacherQuery = "", courseQuery = "", dayQuery = "" } = {}) {
  const tq = teacherQuery.toLowerCase().trim();
  const cq = courseQuery.toLowerCase().trim();
  const dq = dayQuery.toLowerCase().trim();

  return excelScheduleTable.filter((slot) => {
    const isFree = slot.status.toLowerCase().includes("свобод");
    if (!isFree) return false;
    if (tq && !slot.teacher.toLowerCase().includes(tq)) return false;
    if (cq && !slot.course.toLowerCase().includes(cq) && !slot.stack.toLowerCase().includes(cq)) return false;
    if (dq && !slot.day.toLowerCase().includes(dq)) return false;
    return true;
  });
}

/**
 * Book a student into a specific slotId (or best matching free slot)
 * Immediately updates the Excel schedule table, syncs to Google Sheets if connected,
 * rebuilds RAG chunks so subsequent queries see the slot as "Занято",
 * and fires a custom event so the UI & Admin Panel update live!
 */
async function bookStudentIntoSlot({ slotId, studentName, studentPhone, comment = "Записан через AI RAG Агента" }) {
  const slot = excelScheduleTable.find((s) => s.slotId.toLowerCase() === String(slotId).toLowerCase());
  if (!slot) {
    return { ok: false, error: `Слот ${slotId} не найден в таблице расписания.` };
  }
  if (!slot.status.toLowerCase().includes("свобод")) {
    return {
      ok: false,
      error: `Окно ${slot.slotId} (${slot.teacher}, ${slot.day} ${slot.time}) уже занято студентом ${slot.studentName}.`
    };
  }

  slot.status = "Занято";
  slot.studentName = studentName || "Студент (Онлайн)";
  slot.studentPhone = studentPhone || "Не указан";
  slot.comment = comment;

  saveScheduleTable();
  vectorCache.clear();
  rebuildMasterRagChunks();

  // Push booking to Google Sheets Apps Script bridge if configured
  const cfg = getCloudConfig();
  let cloudSynced = false;
  if (cfg.appsScriptUrl && cfg.appsScriptUrl.startsWith("https://")) {
    try {
      await fetch(cfg.appsScriptUrl, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({
          action: "bookSlot",
          slotId: slot.slotId,
          studentName: slot.studentName,
          studentPhone: slot.studentPhone,
          comment: slot.comment
        })
      });
      cloudSynced = true;
    } catch (e) {
      console.warn("[Cloud Booking Push] Could not reach Apps Script URL:", e.message);
    }
  }

  // Notify app.js to refresh Admin Panel & Schedule Table UI
  window.dispatchEvent(
    new CustomEvent("goodedu:slot-booked", {
      detail: { slot, cloudSynced }
    })
  );

  return { ok: true, slot, cloudSynced };
}

/**
 * Free a booked slot (Admin action)
 */
async function freeBookedSlot(slotId) {
  const slot = excelScheduleTable.find((s) => s.slotId.toLowerCase() === String(slotId).toLowerCase());
  if (!slot) return { ok: false };

  slot.status = "Свободно";
  slot.studentName = "";
  slot.studentPhone = "";
  slot.comment = "Доступно для записи";

  saveScheduleTable();
  vectorCache.clear();
  rebuildMasterRagChunks();

  const cfg = getCloudConfig();
  if (cfg.appsScriptUrl && cfg.appsScriptUrl.startsWith("https://")) {
    try {
      await fetch(cfg.appsScriptUrl, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({ action: "freeSlot", slotId: slot.slotId })
      });
    } catch (e) {}
  }

  window.dispatchEvent(new CustomEvent("goodedu:schedule-updated"));
  return { ok: true, slot };
}

/**
 * Export the current live schedule table (including all new bookings made by the agent!)
 * as an Excel-compatible CSV file with UTF-8 BOM.
 */
function downloadLiveScheduleCsv() {
  const headers = [
    "Slot_ID",
    "Преподаватель",
    "Должность_и_Компания",
    "Опыт",
    "Стек",
    "Направление_Курс",
    "День_Недели",
    "Время_Окна",
    "Кабинет",
    "Статус",
    "Имя_Студента",
    "Телефон_Студента",
    "Комментарий"
  ];

  const rows = excelScheduleTable.map((s) => [
    s.slotId,
    s.teacher,
    s.roleCompany,
    s.experience,
    s.stack,
    s.course,
    s.day,
    s.time,
    s.room,
    s.status,
    s.studentName,
    s.studentPhone,
    s.comment
  ]);

  const csv =
    "\uFEFF" +
    [headers, ...rows]
      .map((r) => r.map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`).join(","))
      .join("\r\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `good_edu_schedule_live_${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

// ============================================================================
// 6. VECTOR EMBEDDINGS & COSINE SIMILARITY (google-ai-studio-rag skill)
// ============================================================================

function getStoredApiKey() {
  return localStorage.getItem(RAG_STORAGE_API_KEY) || DEFAULT_GEMINI_API_KEY;
}

function setStoredApiKey(key) {
  localStorage.setItem(RAG_STORAGE_API_KEY, (key || DEFAULT_GEMINI_API_KEY).trim());
}

function cosineSimilarity(vecA, vecB) {
  if (!vecA || !vecB || vecA.length !== vecB.length) return 0;
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

async function getEmbedding(text, taskType = "RETRIEVAL_DOCUMENT") {
  const apiKey = getStoredApiKey();
  if (!apiKey) throw new Error("GEMINI_API_KEY is not defined.");

  const cacheKey = `${taskType}:${text}`;
  if (vectorCache.has(cacheKey)) return vectorCache.get(cacheKey);

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${EMBEDDING_MODEL}:embedContent?key=${apiKey}`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: `models/${EMBEDDING_MODEL}`,
      content: { parts: [{ text }] },
      taskType: taskType
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Google AI Studio Embedding Error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const vector = data?.embedding?.values;
  if (!vector || !Array.isArray(vector)) {
    throw new Error("Invalid embedding vector structure received from Google AI Studio.");
  }

  vectorCache.set(cacheKey, vector);
  return vector;
}

async function indexKnowledgeChunks(chunks = GOOD_EDU_RAG_CHUNKS) {
  const missing = chunks.filter((c) => !c.vector);
  if (missing.length === 0) return chunks;

  const BATCH_SIZE = 10;
  for (let i = 0; i < missing.length; i += BATCH_SIZE) {
    const batch = missing.slice(i, i + BATCH_SIZE);
    await Promise.all(
      batch.map(async (chunk) => {
        try {
          chunk.vector = await getEmbedding(`${chunk.title}\n${chunk.text}`, "RETRIEVAL_DOCUMENT");
        } catch (err) {
          console.warn(`[Google RAG] Failed to embed chunk ${chunk.id}:`, err.message);
        }
      })
    );
  }
  return chunks;
}

function computeLexicalSimilarity(query, chunk) {
  const normalize = (str) =>
    str
      .toLowerCase()
      .replace(/[^a-zа-яё0-9\s-]/gi, " ")
      .split(/\s+/)
      .filter((w) => w.length >= 2);

  const qTokens = normalize(query);
  if (qTokens.length === 0) return 0.15;

  const targetText = `${chunk.title} ${chunk.category} ${chunk.text}`.toLowerCase();
  let score = 0;

  const synonyms = {
    свободн: ["окна", "окно", "слот", "записаться", "запиши", "время", "когда", "место"],
    окн: ["свободно", "слот", "расписание", "график", "запись", "запиши"],
    запиш: ["свободно", "окно", "слот", "расписание", "бронь"],
    цена: ["стоимость", "прайс", "сум", "оплата", "сколько", "рассрочка"],
    рассрочка: ["кредит", "помесячно", "nasiya", "оплата", "0%"],
    график: ["расписание", "часы", "дни", "преподаватель", "окна", "свободно"],
    ноутбук: ["компьютер", "собой", "взять", "требования", "паспорт"]
  };

  for (const token of qTokens) {
    if (targetText.includes(token)) {
      score += 1.3;
      if (chunk.title.toLowerCase().includes(token)) score += 1.0;
    }
    const stem = token.slice(0, Math.max(3, token.length - 2));
    if (stem.length >= 3 && targetText.includes(stem)) {
      score += 0.7;
    }
    for (const [key, list] of Object.entries(synonyms)) {
      if (token.includes(key) || list.some((s) => token.includes(s))) {
        if (targetText.includes(key) || list.some((s) => targetText.includes(s))) {
          score += 0.5;
        }
      }
    }
  }

  return Math.max(0.12, Math.min(0.98, score / (qTokens.length * 1.85 + 1)));
}

async function retrieveRelevantChunks(userQuery, chunks = GOOD_EDU_RAG_CHUNKS, topK = 4) {
  rebuildMasterRagChunks();
  const apiKey = getStoredApiKey();

  if (apiKey) {
    try {
      await indexKnowledgeChunks(chunks);
      const queryVector = await getEmbedding(userQuery, "RETRIEVAL_QUERY");

      const validVectorChunks = chunks.filter((c) => c.vector && Array.isArray(c.vector));
      if (validVectorChunks.length > 0) {
        const scored = validVectorChunks.map((chunk) => {
          const cosSim = cosineSimilarity(queryVector, chunk.vector);
          const lexBoost = computeLexicalSimilarity(userQuery, chunk) * 0.15;
          const similarity = Math.min(0.99, cosSim + lexBoost);
          return {
            ...chunk,
            similarity,
            similarityPercent: Math.round(similarity * 100),
            retrievalMode: EMBEDDING_MODEL
          };
        });

        scored.sort((a, b) => b.similarity - a.similarity);
        return scored.slice(0, topK);
      }
    } catch (err) {
      console.warn("[Google RAG] Vector API retrieval error, using local semantic fallback:", err.message);
    }
  }

  const scored = chunks.map((chunk) => {
    const similarity = computeLexicalSimilarity(userQuery, chunk);
    return {
      ...chunk,
      similarity,
      similarityPercent: Math.round(similarity * 100),
      retrievalMode: "local-hybrid-index"
    };
  });

  scored.sort((a, b) => b.similarity - a.similarity);
  return scored.slice(0, topK);
}

// ============================================================================
// 7. NATURAL LANGUAGE BOOKING DETECTOR & AGENT TOOL EXECUTION
// Allows the user to say:
// "Запиши меня к Азизбеку на понедельник 19:30, меня зовут Алишер, тел +998901112233"
// or "Запиши в SLOT-202, имя Дилноза, +998 93 444-55-66"
// ============================================================================

function detectAndExecuteNaturalBooking(userMessage) {
  const msgLower = userMessage.toLowerCase();
  const hasBookingVerb = /(запиш|забронир|бронь|book|yozdir|yozil)/i.test(msgLower);
  const explicitSlotMatch = userMessage.match(/SLOT-\d{3}/i);

  if (!hasBookingVerb && !explicitSlotMatch) return null;

  // Check if user provided a phone number or explicit SLOT-ID
  const phoneMatch = userMessage.match(/(\+?998[\s\-()0-9]{7,14}|\b\d{2}[\s\-]?\d{3}[\s\-]?\d{2}[\s\-]?\d{2}\b)/);

  // Find candidate slot
  let targetSlot = null;
  if (explicitSlotMatch) {
    targetSlot = excelScheduleTable.find(
      (s) => s.slotId.toLowerCase() === explicitSlotMatch[0].toLowerCase()
    );
  } else {
    // Match by teacher name or course + optional day/time among FREE slots
    const freeSlots = excelScheduleTable.filter((s) => s.status.toLowerCase().includes("свобод"));
    const teacherCandidates = freeSlots.filter((s) => {
      const firstName = s.teacher.split(" ")[0].toLowerCase().slice(0, 5);
      const lastName = (s.teacher.split(" ")[1] || "").toLowerCase().slice(0, 5);
      return (
        msgLower.includes(firstName) ||
        (lastName && msgLower.includes(lastName)) ||
        msgLower.includes(s.course.toLowerCase().slice(0, 8))
      );
    });

    if (teacherCandidates.length > 0) {
      const dayRefined = teacherCandidates.filter((s) =>
        msgLower.includes(s.day.toLowerCase().slice(0, 4))
      );
      const timeRefined = (dayRefined.length > 0 ? dayRefined : teacherCandidates).filter((s) => {
        const startHour = s.time.split(":")[0].trim();
        return msgLower.includes(startHour);
      });
      targetSlot = timeRefined[0] || dayRefined[0] || teacherCandidates[0];
    }
  }

  // Extract student name
  let studentName = "";
  const namePatterns = [
    /(?:меня зовут|имя|студент|зовут|name is|mening ismim)\s+([А-ЯЁA-Z][а-яёa-z]+(?:\s+[А-ЯЁA-Z][а-яёa-z]+)?)/i,
    /([А-ЯЁA-Z][а-яёa-z]+(?:\s+[А-ЯЁA-Z][а-яёa-z]+)?)\s*,\s*\+?998/i
  ];
  for (const pat of namePatterns) {
    const m = userMessage.match(pat);
    if (m && m[1]) {
      studentName = m[1].trim();
      break;
    }
  }

  // If user wants to book a teacher/slot, and gave at least phone or explicit slot + name
  if (targetSlot && (phoneMatch || studentName || explicitSlotMatch)) {
    return {
      slot: targetSlot,
      studentName: studentName || "Абитуриент (из AI-чата)",
      studentPhone: phoneMatch ? phoneMatch[0].trim() : "+998 (--) --- -- --"
    };
  }

  // If user asked "запиши меня к Азизбеку" without phone/name, return prompt guidance with free slots
  if (hasBookingVerb && targetSlot) {
    return {
      needsContactInfo: true,
      suggestedSlot: targetSlot
    };
  }

  return null;
}

// ============================================================================
// 8. END-TO-END RAG + BOOKING AGENT CALL (`gemini-3.5-flash-lite`)
// ============================================================================

async function askGeminiWithRAG({
  userMessage,
  knowledgeBase = GOOD_EDU_RAG_CHUNKS,
  chatHistory = []
}) {
  // Auto-sync with Google Cloud if configured
  const cfg = getCloudConfig();
  if (cfg.appsScriptUrl || cfg.priceDocId || cfg.faqDocId || cfg.scheduleSheetId) {
    try {
      await syncWithGoogleCloud();
    } catch (e) {}
  }

  // Step 1: Check if user is asking to book a slot in the Excel Schedule Table
  const bookingIntent = detectAndExecuteNaturalBooking(userMessage);
  let bookingConfirmationBanner = "";
  let bookedSlotObj = null;

  if (bookingIntent && !bookingIntent.needsContactInfo) {
    const bookRes = await bookStudentIntoSlot({
      slotId: bookingIntent.slot.slotId,
      studentName: bookingIntent.studentName,
      studentPhone: bookingIntent.studentPhone,
      comment: `Записан ИИ-агентом (${PRIMARY_CHAT_MODEL})`
    });

    if (bookRes.ok) {
      bookedSlotObj = bookRes.slot;
      bookingConfirmationBanner = `✅ **ЗАПИСЬ В EXCEL-ТАБЛИЦУ ВЫПОЛНЕНА!**
- **Код окна:** \`${bookRes.slot.slotId}\` (Статус изменён на **«Занято»**)
- **Преподаватель:** ${bookRes.slot.teacher} (${bookRes.slot.roleCompany})
- **Направление:** ${bookRes.slot.course}
- **День и время:** ${bookRes.slot.day}, ${bookRes.slot.time} (${bookRes.slot.room})
- **Студент:** ${bookRes.slot.studentName} (${bookRes.slot.studentPhone})`;
    } else {
      bookingConfirmationBanner = `⚠️ **Не удалось записать в слот:** ${bookRes.error}`;
    }
  } else if (bookingIntent && bookingIntent.needsContactInfo) {
    const s = bookingIntent.suggestedSlot;
    bookingConfirmationBanner = `📌 Найдено подходящее свободное окно в таблице: **[${s.slotId}] ${s.teacher} — ${s.day}, ${s.time} (${s.course}, ${s.room})**.
Чтобы я сразу записал вас в таблицу расписания, напишите в одном сообщении ваше **Имя и телефон** (например: *«Запиши в ${s.slotId}, меня зовут Тимур, +998 90 123-45-67»*) или нажмите кнопку **«Записаться в это окно»** ниже!`;
  }

  // Step 2: Retrieve Top-4 Semantic Chunks (including live Excel schedule chunks)
  const retrievedChunks = await retrieveRelevantChunks(userMessage, GOOD_EDU_RAG_CHUNKS, 4);

  const contextText = retrievedChunks
    .map(
      (c, i) =>
        `[Source ${i + 1}: ${c.title || c.id} | ${c.category} (Relevance: ${c.similarityPercent}%)]\n${c.text}`
    )
    .join("\n\n---\n\n");

  const apiKey = getStoredApiKey();

  // If no API key yet, return deterministic RAG response + any booking confirmation
  if (!apiKey) {
    const top = retrievedChunks[0];
    const second = retrievedChunks[1];
    let localAnswer = bookingConfirmationBanner
      ? `${bookingConfirmationBanner}\n\n---\n\n`
      : "";

    localAnswer += `По актуальным данным **Google Docs (.docx) и Excel-таблицы расписания Good Edu** (*${top.title}*):\n\n${top.text}`;
    if (second && second.similarityPercent >= 35) {
      localAnswer += `\n\n**Дополнительно (*${second.title}*):**\n${second.text}`;
    }

    return {
      answer: localAnswer,
      retrievedChunks,
      bookedSlot: bookedSlotObj,
      suggestedFreeSlots: findFreeSlots().slice(0, 4),
      model: `${PRIMARY_CHAT_MODEL} (Live RAG Mode)`,
      embeddingModel: EMBEDDING_MODEL
    };
  }

  // Step 3: Cloud LLM generation via `gemini-3.5-flash-lite`
  // Also allow the LLM to emit `[BOOK_SLOT: SLOT-XXX | Name | Phone]` if it detects a booking that regex missed
  const systemPrompt = `Ты — официальный ИИ-агент приёмной комиссии IT-школы «Good Edu», работающий на модели ${PRIMARY_CHAT_MODEL} и векторном поиске Google AI Studio (${EMBEDDING_MODEL}).
Твои источники знаний синхронизированы в реальном времени с:
1. Google Docs (.docx): Прайс-лист (14 курсов в сумах, рассрочка 0%) и FAQ.
2. Excel / Google Sheets таблицей расписания всех преподавателей (со статусами слотов «Свободно» и «Занято»).

ПРАВИЛА РАБОТЫ:
1. Отвечай строго по предоставленному контексту. Называй точные цены в сумах (UZS), коды слотов (например, SLOT-102), дни недели, время и кабинеты.
2. Если студент ищет свободные окна — перечисли только те слоты, у которых статус «СВОБОДНО», с указанием кода слота [SLOT-XXX], преподавателя, дня и времени.
3. Если запись уже выполнена (в контексте есть подтверждение ЗАПИСЬ ВЫПОЛНЕНА) — поздравь студента с записью и напомни адрес кампуса (ул. Муминова, 7А, IT-Парк) и что с собой нужно взять паспорт/ID.
4. Если студент просит записать его, но ещё не указал имя или телефон — предложи ему свободные слоты [SLOT-XXX] и попроси написать имя и номер телефона для мгновенной записи в Excel-таблицу.`;

  const prompt = `${systemPrompt}

${bookingConfirmationBanner ? `--- РЕЗУЛЬТАТ ДЕЙСТВИЯ ЗАПИСИ В ТАБЛИЦУ ---\n${bookingConfirmationBanner}\n-------------------------------------------\n` : ""}
--- RELEVANT KNOWLEDGE CONTEXT (GOOGLE DOCS .DOCX & EXCEL SCHEDULE .XLSX) ---
${contextText}
-----------------------------------------------------------------------------

История диалога:
${chatHistory
  .slice(-4)
  .map((m) => `${m.role === "user" ? "Студент" : "Агент"}: ${m.text}`)
  .join("\n")}

Сообщение студента: ${userMessage}`;

  for (const candidateModel of FALLBACK_CHAT_MODELS) {
    try {
      const genUrl = `https://generativelanguage.googleapis.com/v1beta/models/${candidateModel}:generateContent?key=${apiKey}`;
      const genResponse = await fetch(genUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 1200
          }
        })
      });

      if (!genResponse.ok) continue;

      const genData = await genResponse.json();
      const answerText = genData?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (answerText) {
        const finalAnswer = bookingConfirmationBanner
          ? `${bookingConfirmationBanner}\n\n${answerText}`
          : answerText;

        return {
          answer: finalAnswer,
          retrievedChunks,
          bookedSlot: bookedSlotObj,
          suggestedFreeSlots: findFreeSlots().slice(0, 4),
          model: PRIMARY_CHAT_MODEL,
          resolvedModel: candidateModel,
          embeddingModel: EMBEDDING_MODEL,
          usedCloudApi: true
        };
      }
    } catch (e) {}
  }

  // Fallback if API call fails
  const top = retrievedChunks[0];
  return {
    answer: `${bookingConfirmationBanner ? bookingConfirmationBanner + "\n\n" : ""}${top ? top.text : ""}`,
    retrievedChunks,
    bookedSlot: bookedSlotObj,
    suggestedFreeSlots: findFreeSlots().slice(0, 4),
    model: PRIMARY_CHAT_MODEL,
    embeddingModel: EMBEDDING_MODEL
  };
}

// Expose API globally
window.GoodEduRAG = {
  GOOD_EDU_RAG_CHUNKS,
  EMBEDDING_MODEL,
  PRIMARY_CHAT_MODEL,
  getScheduleTable: () => excelScheduleTable,
  resetScheduleTable: () => {
    excelScheduleTable = JSON.parse(JSON.stringify(INITIAL_EXCEL_SCHEDULE_ROWS));
    saveScheduleTable();
    vectorCache.clear();
    rebuildMasterRagChunks();
    window.dispatchEvent(new CustomEvent("goodedu:schedule-updated"));
  },
  findFreeSlots,
  bookStudentIntoSlot,
  freeBookedSlot,
  downloadLiveScheduleCsv,
  getCloudConfig,
  saveCloudConfig,
  syncWithGoogleCloud,
  cosineSimilarity,
  getEmbedding,
  indexKnowledgeChunks,
  retrieveRelevantChunks,
  askGeminiWithRAG,
  getStoredApiKey,
  setStoredApiKey
};
