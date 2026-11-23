// Good Edu — Initial Data & Trilingual Dictionary (RU / UZ / EN)

const TRANSLATIONS = {
  ru: {
    nav_about: "О школе",
    nav_stats: "Результаты",
    nav_courses: "Направления",
    nav_teachers: "Преподаватели",
    nav_events: "События и новости",
    nav_contact: "Контакты",
    nav_admin: "Админ-панель",
    hero_badge: "Ведущая IT-академия нового поколения",
    hero_title_1: "Создай свою карьеру в IT вместе с",
    hero_title_highlight: "Good Edu",
    hero_subtitle: "Практическое обучение востребованным IT-профессиям под руководством действующих Senior-разработчиков, дизайнеров и AI-инженеров. Реальные проекты в портфолио и помощь в трудоустройстве.",
    hero_cta_primary: "Выбрать направление",
    hero_cta_secondary: "Смотреть учебный процесс",
    hero_live_tag: "LIVE • Идёт занятие по Full-Stack & AI",
    hero_video_caption: "Интерактивный кампус Good Edu: код-ревью, командные хакатоны и воркшопы",
    hero_floating_1_title: "94% трудоустройство",
    hero_floating_1_sub: "в первые 3 месяца после выпуска",
    hero_floating_2_title: "Менторская поддержка 24/7",
    hero_floating_2_sub: "разбор кода и карьерный коучинг",

    stats_badge: "Результаты обучения",
    stats_title: "Цифры, которыми мы гордимся",
    stats_subtitle: "Мы измеряем успех реальными офферами наших выпускников, ростом их зарплат и запущенными проектами.",

    courses_badge: "Программы обучения",
    courses_title: "Выберите своё IT-направление",
    courses_subtitle: "От фундаментальной разработки до искусственного интеллекта и кибербезопасности — программы обновлены под требования рынка 2026 года.",
    filter_all: "Все направления",
    filter_dev: "Разработка",
    filter_data: "AI & Data",
    filter_design: "Дизайн",
    filter_security: "Инфраструктура & Security",
    course_duration: "Длительность",
    course_level: "Уровень",
    course_price: "Стоимость",
    course_currency: "сум/мес",
    course_enroll_btn: "Записаться на курс",
    course_details_btn: "Подробнее",

    teachers_badge: "Команда экспертов",
    teachers_title: "Учитесь у практикующих IT-специалистов",
    teachers_subtitle: "Наши наставники — Senior и Lead специалисты из международных технологических компаний с опытом коммерческой разработки от 5 до 12 лет.",
    teacher_exp_label: "Опыт:",
    teacher_students_label: "Выпускников:",

    events_badge: "Жизнь академии",
    events_title: "Мероприятия и новости учебного центра",
    events_subtitle: "Открытые воркшопы, хакатоны, митапы с лидерами индустрии и главные новости кампуса Good Edu.",
    events_filter_all: "Все",
    events_filter_event: "Мероприятия",
    events_filter_news: "Новости",
    event_register_btn: "Участвовать",
    event_read_btn: "Читать подробнее",

    contact_badge: "Свяжитесь с нами",
    contact_title: "Запишитесь на бесплатную консультацию",
    contact_subtitle: "Оставьте заявку — наш карьерный консультант поможет выбрать подходящее IT-направление, расскажет о программе и пригласит на пробный урок.",
    contact_address_label: "Адрес кампуса",
    contact_address_val: "г. Ташкент, Мирзо-Улугбекский р-н, IT-Парк, ул. Муминова, 7А",
    contact_phone_label: "Телефон приёмной комиссии",
    contact_email_label: "Электронная почта",
    contact_hours_label: "Режим работы",
    contact_hours_val: "Пн–Сб: 09:00 – 21:00, Вс: 10:00 – 18:00",
    form_name: "Ваше имя",
    form_name_placeholder: "Например, Тимур Каримов",
    form_phone: "Номер телефона",
    form_phone_placeholder: "+998 (90) 123-45-67",
    form_email: "Email (необязательно)",
    form_email_placeholder: "name@example.com",
    form_course: "Интересующее направление",
    form_course_placeholder: "Выберите направление",
    form_message: "Ваш вопрос или комментарий",
    form_message_placeholder: "Расскажите о вашем опыте или удобном времени для звонка...",
    form_submit: "Отправить заявку",
    form_success: "Спасибо! Ваша заявка принята. Она уже отображается в Админ-панели!",

    footer_desc: "Современная IT-школа полного цикла. Готовим востребованных инженеров, дизайнеров и аналитиков с гарантированной практикой на реальных проектах.",
    footer_rights: "© 2026 IT-школа «Good Edu». Все права защищены.",

    // Admin Panel
    admin_title: "Панель управления Good Edu CMS",
    admin_subtitle: "Управляйте направлениями, преподавателями, новостями, статистикой и заявками студентов в реальном времени",
    admin_tab_dashboard: "Дашборд & Заявки",
    admin_tab_courses: "Направления",
    admin_tab_teachers: "Преподаватели",
    admin_tab_events: "Мероприятия и новости",
    admin_tab_stats: "Статистика",
    admin_reset_btn: "Сбросить демо-данные",
    admin_close_btn: "Закрыть",
    admin_leads_title: "Заявки с сайта (Обратная связь)",
    admin_add_course: "+ Добавить направление",
    admin_add_teacher: "+ Добавить специалиста",
    admin_add_event: "+ Добавить событие / новость",
    admin_save: "Сохранить",
    admin_delete: "Удалить",
    admin_edit: "Редактировать",
    admin_status_new: "Новая",
    admin_status_done: "Обработана",
    admin_no_leads: "Заявок пока нет. Отправьте форму обратной связи на сайте, чтобы протестировать!",
    admin_tab_rag: "RAG База знаний",
    rag_assistant_title: "Good Edu AI Консультант",
    rag_assistant_sub: "RAG • gemini-3.5-flash-lite • gemini-embedding-001",
    rag_welcome: "Здравствуйте! Я ИИ-консультант IT-школы «Good Edu» (работаю на базе Vector RAG и модели gemini-3.5-flash-lite). Спросите меня о ценах в сумах, рассрочке 0%, расписании преподавателей, правилах записи или требованиях к ноутбуку!",
    rag_input_placeholder: "Задайте вопрос по прайсу, FAQ или графику...",
    rag_send_btn: "Отправить",
    rag_key_btn: "API Ключ",
    rag_sources_label: "Найденные RAG-фрагменты (Cosine Similarity):",
    rag_chip_1: "Сколько стоят курсы и есть ли рассрочка?",
    rag_chip_2: "График работы преподавателей по дням",
    rag_chip_3: "Нужен ли свой ноутбук и что взять с собой?",
    rag_chip_4: "Как записаться на пробный урок и адрес?"
  },

  uz: {
    nav_about: "Maktab haqida",
    nav_stats: "Natijalar",
    nav_courses: "Yo'nalishlar",
    nav_teachers: "Ustozlar",
    nav_events: "Tadbirlar va yangiliklar",
    nav_contact: "Aloqa",
    nav_admin: "Admin-panel",
    hero_badge: "Yangi avlod yetakchi IT-akademiyasi",
    hero_title_1: "IT sohasidagi kelajagingizni",
    hero_title_highlight: "Good Edu",
    hero_subtitle: "Amaliyotchi Senior-dasturchilar, dizaynerlar va AI-muhandislar rahbarligida talabgir IT-kasblarni o'rganing. Portfolio uchun real loyihalar va ishga joylashishda ko'mak.",
    hero_cta_primary: "Yo'nalishni tanlash",
    hero_cta_secondary: "O'quv jarayonini ko'rish",
    hero_live_tag: "LIVE • Full-Stack & AI darsi bo'lib o'tmoqda",
    hero_video_caption: "Good Edu interaktiv kampusi: kod-revyu, jamoaviy xakatonlar va vorkshoplar",
    hero_floating_1_title: "94% ishga joylashish",
    hero_floating_1_sub: "bitirgandan so'ng dastlabki 3 oyda",
    hero_floating_2_title: "24/7 mentorlik yordami",
    hero_floating_2_sub: "kod tahlili va karyera kouchingi",

    stats_badge: "O'quv natijalari",
    stats_title: "Biz faxrlanadigan ko'rsatkichlar",
    stats_subtitle: "Biz muvaffaqiyatni bitiruvchilarimizning real ish takliflari, daromad o'sishi va ishga tushirilgan loyihalari bilan o'lchaymiz.",

    courses_badge: "O'quv dasturlari",
    courses_title: "O'z IT-yo'nalishingizni tanlang",
    courses_subtitle: "Fundamental dasturlashdan tortib sun'iy intellekt va kiberxavfsizlikkacha — barcha dasturlar 2026-yil bozor talablariga moslashtirilgan.",
    filter_all: "Barcha yo'nalishlar",
    filter_dev: "Dasturlash",
    filter_data: "AI & Data",
    filter_design: "Dizayn",
    filter_security: "Infratuzilma & Security",
    course_duration: "Davomiyligi",
    course_level: "Daraja",
    course_price: "Narxi",
    course_currency: "so'm/oy",
    course_enroll_btn: "Kursga yozilish",
    course_details_btn: "Batafsil",

    teachers_badge: "Ekspertlar jamoasi",
    teachers_title: "Amaliyotchi IT-mutaxassislardan o'rganing",
    teachers_subtitle: "Bizning ustozlarimiz — 5 yildan 12 yilgacha tijorat tajribasiga ega xalqaro texnologik kompaniyalarning Senior va Lead mutaxassislari.",
    teacher_exp_label: "Tajriba:",
    teacher_students_label: "Bitiruvchilar:",

    events_badge: "Akademiya hayoti",
    events_title: "O'quv markazi tadbirlari va yangiliklari",
    events_subtitle: "Ochiq vorkshoplar, xakatonlar, soha yetakchilari bilan uchrashuvlar va Good Edu kampusining asosiy yangiliklari.",
    events_filter_all: "Barchasi",
    events_filter_event: "Tadbirlar",
    events_filter_news: "Yangiliklar",
    event_register_btn: "Ishtirok etish",
    event_read_btn: "Batafsil o'qish",

    contact_badge: "Biz bilan bog'laning",
    contact_title: "Bepul konsultatsiyaga yoziling",
    contact_subtitle: "Ariza qoldiring — karyera maslahatchimiz sizga mos IT-yo'nalishni tanlashda yordam beradi, dastur haqida so'zlab beradi va sinov darsiga taklif qiladi.",
    contact_address_label: "Kampus manzili",
    contact_address_val: "Toshkent sh., Mirzo Ulug'bek tumani, IT-Park, Mo'minov ko'chasi, 7A",
    contact_phone_label: "Qabul komissiyasi telefoni",
    contact_email_label: "Elektron pochta",
    contact_hours_label: "Ish vaqti",
    contact_hours_val: "Du–Sha: 09:00 – 21:00, Yak: 10:00 – 18:00",
    form_name: "Ismingiz",
    form_name_placeholder: "Masalan, Temur Karimov",
    form_phone: "Telefon raqamingiz",
    form_phone_placeholder: "+998 (90) 123-45-67",
    form_email: "Email (ixtiyoriy)",
    form_email_placeholder: "name@example.com",
    form_course: "Qiziqtirgan yo'nalish",
    form_course_placeholder: "Yo'nalishni tanlang",
    form_message: "Savolingiz yoki izoh",
    form_message_placeholder: "Tajribangiz yoki qo'ng'iroq uchun qulay vaqt haqida yozing...",
    form_submit: "Arizani yuborish",
    form_success: "Rahmat! Arizangiz qabul qilindi va Admin-panelda aks etdi!",

    footer_desc: "Zamonaviy to'liq siklli IT-maktab. Real loyihalarda kafolatlangan amaliyot bilan talabgir muhandislar, dizaynerlar va tahlilchilarni tayyorlaymiz.",
    footer_rights: "© 2026 «Good Edu» IT-maktabi. Barcha huquqlar himoyalangan.",

    admin_title: "Good Edu CMS Boshqaruv Paneli",
    admin_subtitle: "Yo'nalishlar, o'qituvchilar, tadbirlar, statistika va talabalar arizalarini real vaqtda boshqaring",
    admin_tab_dashboard: "Dashboard & Arizalar",
    admin_tab_courses: "Yo'nalishlar",
    admin_tab_teachers: "Ustozlar",
    admin_tab_events: "Tadbirlar va yangiliklar",
    admin_tab_stats: "Statistika",
    admin_reset_btn: "Demo-ma'lumotlarni tiklash",
    admin_close_btn: "Yopish",
    admin_leads_title: "Saytdan kelgan arizalar (Qayta aloqa)",
    admin_add_course: "+ Yo'nalish qo'shish",
    admin_add_teacher: "+ Mutaxassis qo'shish",
    admin_add_event: "+ Tadbir / yangilik qo'shish",
    admin_save: "Saqlash",
    admin_delete: "O'chirish",
    admin_edit: "Tahrirlash",
    admin_status_new: "Yangi",
    admin_status_done: "Ko'rib chiqildi",
    admin_no_leads: "Hozircha arizalar yo'q. Sinab ko'rish uchun saytdagi aloqa shaklini yuboring!",
    admin_tab_rag: "RAG Bilimlar bazasi",
    rag_assistant_title: "Good Edu AI Maslahatchi",
    rag_assistant_sub: "RAG • gemini-3.5-flash-lite • gemini-embedding-001",
    rag_welcome: "Assalomu alaykum! Men «Good Edu» IT-maktabining AI-maslahatchisiman (Vector RAG va gemini-3.5-flash-lite modeli asosida ishlayman). Kurs narxlari (so'mda), 0% muddatli to'lov, o'qituvchilar jadvali yoki o'qish shartlari haqida so'rang!",
    rag_input_placeholder: "Narxlar, FAQ yoki ish jadvali bo'yicha savol bering...",
    rag_send_btn: "Yuborish",
    rag_key_btn: "API Kalit",
    rag_sources_label: "Topilgan RAG-manbalar (Cosine Similarity):",
    rag_chip_1: "Kurslar narxi qancha va rassrochka bormi?",
    rag_chip_2: "O'qituvchilarning ish jadvali qanday?",
    rag_chip_3: "O'z noutbukim kerakmi va nima olib kelish kerak?",
    rag_chip_4: "Sinov darsiga qanday yozilsa bo'ladi va manzil?"
  },

  en: {
    nav_about: "About",
    nav_stats: "Outcomes",
    nav_courses: "Programs",
    nav_teachers: "Instructors",
    nav_events: "Events & News",
    nav_contact: "Contact",
    nav_admin: "Admin Panel",
    hero_badge: "Next-Generation Tech Academy",
    hero_title_1: "Launch your tech career with",
    hero_title_highlight: "Good Edu",
    hero_subtitle: "Hands-on training in high-demand IT professions led by practicing Senior Software Engineers, Product Designers, and AI Architects. Build real portfolio projects and land your dream tech role.",
    hero_cta_primary: "Explore Programs",
    hero_cta_secondary: "Watch Classroom Tour",
    hero_live_tag: "LIVE • Full-Stack & AI Workshop in Progress",
    hero_video_caption: "Good Edu Interactive Campus: live code reviews, team hackathons & studio labs",
    hero_floating_1_title: "94% Job Placement",
    hero_floating_1_sub: "within 3 months of graduation",
    hero_floating_2_title: "24/7 Mentor Support",
    hero_floating_2_sub: "code reviews & career coaching",

    stats_badge: "Academic Outcomes",
    stats_title: "Numbers That Speak for Themselves",
    stats_subtitle: "We measure our success by our graduates' job offers, salary growth, and real-world software products shipped.",

    courses_badge: "Learning Tracks",
    courses_title: "Choose Your IT Career Track",
    courses_subtitle: "From Full-Stack Engineering to Artificial Intelligence and Cybersecurity — curricula engineered for the 2026 tech market.",
    filter_all: "All Tracks",
    filter_dev: "Development",
    filter_data: "AI & Data",
    filter_design: "Design",
    filter_security: "Cloud & Security",
    course_duration: "Duration",
    course_level: "Level",
    course_price: "Tuition",
    course_currency: "UZS/mo",
    course_enroll_btn: "Enroll Now",
    course_details_btn: "Curriculum",

    teachers_badge: "Expert Faculty",
    teachers_title: "Learn from Practicing IT Specialists",
    teachers_subtitle: "Our instructors are Senior and Staff specialists from leading global tech companies with 5 to 12+ years of production experience.",
    teacher_exp_label: "Experience:",
    teacher_students_label: "Graduates:",

    events_badge: "Campus Life",
    events_title: "Events & News at Good Edu",
    events_subtitle: "Open workshops, 48-hour hackathons, industry tech talks, and the latest milestones from the Good Edu community.",
    events_filter_all: "All",
    events_filter_event: "Events",
    events_filter_news: "News",
    event_register_btn: "Register Now",
    event_read_btn: "Read Story",

    contact_badge: "Get in Touch",
    contact_title: "Book a Free Career Consultation",
    contact_subtitle: "Leave a request — our career advisor will help you pick the right IT track, walk you through the syllabus, and invite you to a free trial class.",
    contact_address_label: "Campus Location",
    contact_address_val: "7A Muminov St, IT Park, Mirzo-Ulugbek District, Tashkent",
    contact_phone_label: "Admissions Hotline",
    contact_email_label: "Email Address",
    contact_hours_label: "Campus Hours",
    contact_hours_val: "Mon–Sat: 09:00 – 21:00, Sun: 10:00 – 18:00",
    form_name: "Your Full Name",
    form_name_placeholder: "e.g. Timur Karimov",
    form_phone: "Phone Number",
    form_phone_placeholder: "+998 (90) 123-45-67",
    form_email: "Email (optional)",
    form_email_placeholder: "name@example.com",
    form_course: "Preferred IT Track",
    form_course_placeholder: "Select a learning track",
    form_message: "Your Question or Goal",
    form_message_placeholder: "Tell us about your background or preferred time for a callback...",
    form_submit: "Submit Application",
    form_success: "Thank you! Your application has been received and is now visible in the Admin Panel!",

    footer_desc: "Full-cycle modern IT school. Training high-impact software engineers, product designers, and AI specialists through real industry projects.",
    footer_rights: "© 2026 Good Edu IT School. All rights reserved.",

    admin_title: "Good Edu CMS Admin Panel",
    admin_subtitle: "Manage courses, IT specialists, events, learning statistics, and student applications in real time",
    admin_tab_dashboard: "Dashboard & Leads",
    admin_tab_courses: "Courses",
    admin_tab_teachers: "Instructors",
    admin_tab_events: "Events & News",
    admin_tab_stats: "Statistics",
    admin_reset_btn: "Reset Demo Data",
    admin_close_btn: "Close",
    admin_leads_title: "Student Applications (Contact Leads)",
    admin_add_course: "+ Add New Track",
    admin_add_teacher: "+ Add IT Specialist",
    admin_add_event: "+ Add Event / News",
    admin_save: "Save Changes",
    admin_delete: "Delete",
    admin_edit: "Edit",
    admin_status_new: "New",
    admin_status_done: "Processed",
    admin_no_leads: "No applications yet. Submit the contact form on the page to test!",
    admin_tab_rag: "RAG Knowledge Base",
    rag_assistant_title: "Good Edu AI Advisor",
    rag_assistant_sub: "RAG • gemini-3.5-flash-lite • gemini-embedding-001",
    rag_welcome: "Hello! I am the Good Edu AI Admissions Advisor powered by Google AI Studio Vector RAG and gemini-3.5-flash-lite. Ask me about course tuition in UZS, 0% installment plans, instructors' weekly schedules, or enrollment FAQ!",
    rag_input_placeholder: "Ask about pricing, FAQ, or teacher schedules...",
    rag_send_btn: "Send",
    rag_key_btn: "API Key",
    rag_sources_label: "Retrieved RAG Chunks (Cosine Similarity):",
    rag_chip_1: "What are the course prices and 0% installment rules?",
    rag_chip_2: "What is each instructor's weekly schedule?",
    rag_chip_3: "Do I need my own laptop & what should I bring?",
    rag_chip_4: "How do I book a trial lesson & campus address?"
  }
};

const INITIAL_DATA = {
  stats: [
    {
      id: "stat-1",
      value: "4,850+",
      icon: "🎓",
      label: {
        ru: "Выпускников работают в IT",
        uz: "IT sohasida ishlayotgan bitiruvchilar",
        en: "Alumni Working in Tech"
      },
      desc: {
        ru: "Успешно завершили обучение и защитили дипломные проекты",
        uz: "O'qishni muvaffaqiyatli yakunlab, diplom loyihalarini himoya qilgan",
        en: "Graduated with production-grade capstone projects"
      }
    },
    {
      id: "stat-2",
      value: "94.2%",
      icon: "🚀",
      label: {
        ru: "Трудоустройство за 90 дней",
        uz: "90 kun ichida ishga joylashish",
        en: "Job Placement Within 90 Days"
      },
      desc: {
        ru: "В локальные и зарубежные компании-партнёры Good Edu",
        uz: "Good Edu hamkor mahalliy va xalqaro kompaniyalarida",
        en: "Hired by local and international partner tech companies"
      }
    },
    {
      id: "stat-3",
      value: "$1,450",
      icon: "💼",
      label: {
        ru: "Средний доход через 1 год",
        uz: "1 yildan keyingi o'rtacha daromad",
        en: "Average Monthly Salary After 1 Year"
      },
      desc: {
        ru: "Медианная зарплата выпускников уровня Strong Junior / Middle",
        uz: "Strong Junior / Middle darajasidagi bitiruvchilarning o'rtacha maoshi",
        en: "Median compensation for alumni reaching Strong Junior / Middle"
      }
    },
    {
      id: "stat-4",
      value: "65+",
      icon: "🤝",
      label: {
        ru: "IT-компаний партнёров",
        uz: "Hamkor IT-kompaniyalar",
        en: "Hiring Partner Companies"
      },
      desc: {
        ru: "Принимают наших студентов на оплачиваемую стажировку и в штат",
        uz: "Talabalarimizni pullik amaliyot va doimiy ishga qabul qiladi",
        en: "Recruit our students directly from Demo Day presentations"
      }
    }
  ],

  courses: [
    {
      id: "course-1",
      category: "dev",
      icon: "💻",
      color: "#6366f1",
      title: {
        ru: "Full-Stack Web Разработчик (React & Node.js)",
        uz: "Full-Stack Web Dasturchi (React & Node.js)",
        en: "Full-Stack Web Engineering (React & Node.js)"
      },
      desc: {
        ru: "Комплексное освоение современной веб-разработки: TypeScript, React 19, Next.js, Node.js, PostgreSQL и архитектура высоконагруженных приложений.",
        uz: "Zamonaviy veb-dasturlashni to'liq o'rganish: TypeScript, React 19, Next.js, Node.js, PostgreSQL va yuqori yuklamali ilovalar arxitekturasi.",
        en: "Master modern web engineering end-to-end: TypeScript, React 19, Next.js, Node.js, PostgreSQL, Docker, and scalable cloud architecture."
      },
      duration: { ru: "9 месяцев", uz: "9 oy", en: "9 months" },
      level: { ru: "С нуля до PRO", uz: "Noldan PRO gacha", en: "Beginner to PRO" },
      price: "1 850 000",
      skills: ["TypeScript", "React / Next.js", "Node.js", "PostgreSQL", "Docker"]
    },
    {
      id: "course-2",
      category: "data",
      icon: "🧠",
      color: "#8b5cf6",
      title: {
        ru: "AI Engineer & Data Science (Python & LLM)",
        uz: "AI Muhandisi & Data Science (Python & LLM)",
        en: "AI Engineering & Data Science (Python & LLMs)"
      },
      desc: {
        ru: "Машинное обучение, нейросети, дообучение LLM-моделей, создание AI-агентов (RAG, LangChain) и развертывание ML-сервисов в продакшн.",
        uz: "Mashinali o'qitish, neyrotarmoqlar, LLM modellarini sozlash, AI-agentlar yaratish (RAG, LangChain) va ML-servislarni ishga tushirish.",
        en: "Deep learning, computer vision, fine-tuning LLMs, building autonomous AI agents (RAG, LangChain), and deploying production ML pipelines."
      },
      duration: { ru: "10 месяцев", uz: "10 oy", en: "10 months" },
      level: { ru: "Базовый / Продвинутый", uz: "Bazaviy / Yuqori", en: "Foundation to Advanced" },
      price: "2 100 000",
      skills: ["Python", "PyTorch", "LLM & RAG", "SQL", "MLOps"]
    },
    {
      id: "course-3",
      category: "design",
      icon: "🎨",
      color: "#ec4899",
      title: {
        ru: "UI/UX & Product Design",
        uz: "UI/UX & Mahsulot Dizayni",
        en: "UI/UX & Digital Product Design"
      },
      desc: {
        ru: "Проектирование удобных пользовательских интерфейсов мобильных и веб-продуктов, дизайн-системы в Figma, UX-исследования и AI-инструменты дизайнера.",
        uz: "Mobil va veb-mahsulotlar uchun qulay interfeyslarni loyihalash, Figma'da dizayn-tizimlar, UX-tadqiqotlar va AI dizayn vositalari.",
        en: "Design user-centric mobile and web products, build scalable design systems in Figma, conduct UX research, and prototype interactive flows."
      },
      duration: { ru: "6 месяцев", uz: "6 oy", en: "6 months" },
      level: { ru: "С нуля", uz: "Noldan", en: "Zero to Junior+" },
      price: "1 600 000",
      skills: ["Figma", "Design Systems", "UX Research", "Prototyping", "Framer"]
    },
    {
      id: "course-4",
      category: "dev",
      icon: "📱",
      color: "#06b6d4",
      title: {
        ru: "Мобильная разработка (Flutter & iOS/Android)",
        uz: "Mobil Dasturlash (Flutter & iOS/Android)",
        en: "Mobile App Development (Flutter & Native)"
      },
      desc: {
        ru: "Создание нативных и кроссплатформенных приложений для iOS и Android на Dart/Flutter с публикацией в App Store и Google Play.",
        uz: "Dart/Flutter yordamida iOS va Android uchun kross-platformali ilovalar yaratish hamda App Store va Google Play'ga joylashtirish.",
        en: "Build high-performance cross-platform mobile apps for iOS and Android using Dart & Flutter, clean architecture, and store publishing."
      },
      duration: { ru: "7 месяцев", uz: "7 oy", en: "7 months" },
      level: { ru: "С нуля до Middle", uz: "Noldan Middle gacha", en: "Beginner to Middle" },
      price: "1 750 000",
      skills: ["Dart", "Flutter", "Firebase", "REST & GraphQL", "BLoC"]
    },
    {
      id: "course-5",
      category: "security",
      icon: "🛡️",
      color: "#10b981",
      title: {
        ru: "Кибербезопасность & Ethical Hacking (DevSecOps)",
        uz: "Kiberxavfsizlik & Ethical Hacking (DevSecOps)",
        en: "Cybersecurity & Ethical Hacking (DevSecOps)"
      },
      desc: {
        ru: "Анализ защищённости систем, пентестинг веб-приложений, защита облачной инфраструктуры, SOC-мониторинг и стандарты OWASP.",
        uz: "Tizimlar xavfsizligini tahlil qilish, veb-ilovalarni pentest qilish, bulutli infratuzilmani himoyalash, SOC-monitoring va OWASP.",
        en: "Network security, web application penetration testing, cloud infrastructure defense, incident response, and OWASP security auditing."
      },
      duration: { ru: "8 месяцев", uz: "8 oy", en: "8 months" },
      level: { ru: "С базовыми знаниями", uz: "Bazaviy bilim bilan", en: "Intermediate" },
      price: "1 950 000",
      skills: ["Linux", "Pentesting", "OWASP", "Network Security", "SIEM"]
    },
    {
      id: "course-6",
      category: "security",
      icon: "☁️",
      color: "#f59e0b",
      title: {
        ru: "Cloud & DevOps Инженер (Kubernetes & AWS)",
        uz: "Cloud & DevOps Muhandisi (Kubernetes & AWS)",
        en: "Cloud & DevOps Engineering (Kubernetes & AWS)"
      },
      desc: {
        ru: "Автоматизация CI/CD пайплайнов, контейнеризация Docker и Kubernetes, Infrastructure as Code (Terraform) и мониторинг Prometheus/Grafana.",
        uz: "CI/CD jarayonlarini avtomatlashtirish, Docker va Kubernetes konteynerizatsiyasi, Terraform va Prometheus/Grafana monitoringi.",
        en: "Automate CI/CD pipelines, orchestrate containers with Docker & Kubernetes, manage cloud infrastructure with Terraform, and scale microservices."
      },
      duration: { ru: "7 месяцев", uz: "7 oy", en: "7 months" },
      level: { ru: "Практический", uz: "Amaliy", en: "Practical Track" },
      price: "2 000 000",
      skills: ["Docker", "Kubernetes", "AWS", "Terraform", "CI/CD"]
    }
  ],

  teachers: [
    {
      id: "teacher-1",
      name: {
        ru: "Азизбек Рахимов",
        uz: "Azizbek Rahimov",
        en: "Azizbek Rakhimov"
      },
      role: {
        ru: "Principal Full-Stack Архитектор",
        uz: "Principal Full-Stack Arxitektor",
        en: "Principal Full-Stack Architect"
      },
      company: "Ex-EPAM Systems • FinTech Tech Lead",
      experience: { ru: "11 лет в IT", uz: "11 yil ITda", en: "11 yrs in Tech" },
      students: "1,200+",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
      avatarAlt: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80",
      bio: {
        ru: "Руководил разработкой банковских платформ с нагрузкой 2M+ пользователей в сутки. Автор курса по микросервисной архитектуре на Node.js и Next.js.",
        uz: "Kuniga 2M+ foydalanuvchiga ega bank platformalari ishlab chiqilishiga rahbarlik qilgan. Node.js va Next.js bo'yicha mikroservislar kursi muallifi.",
        en: "Led engineering teams building banking platforms serving 2M+ daily active users. Specializes in distributed systems, TypeScript, and React architecture."
      },
      stack: ["TypeScript", "Next.js", "Node.js", "System Design"]
    },
    {
      id: "teacher-2",
      name: {
        ru: "Елена Соколова",
        uz: "Yelena Sokolova",
        en: "Elena Sokolova"
      },
      role: {
        ru: "Head of AI & Machine Learning",
        uz: "AI va Machine Learning Rahbari",
        en: "Head of AI & Machine Learning"
      },
      company: "AI Research Lab • PhD in Computer Science",
      experience: { ru: "9 лет в Data & AI", uz: "9 yil Data & AIda", en: "9 yrs in Data & AI" },
      students: "840+",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80",
      bio: {
        ru: "Эксперт по внедрению генеративного ИИ и компьютерного зрения. Помогла более 30 стартапам интегрировать LLM-агентов в бизнес-процессы.",
        uz: "Generativ sun'iy intellekt va kompyuter ko'rish tizimlari bo'yicha ekspert. 30 dan ortiq startaplarga LLM-agentlarni joriy etishda yordam bergan.",
        en: "Specialist in Generative AI and Computer Vision. Advises enterprise teams on fine-tuning large language models and deploying multi-agent workflows."
      },
      stack: ["Python", "PyTorch", "LLM / RAG", "NLP"]
    },
    {
      id: "teacher-3",
      name: {
        ru: "Сардор Алимов",
        uz: "Sardor Alimov",
        en: "Sardor Alimov"
      },
      role: {
        ru: "Lead Product & UI/UX Дизайнер",
        uz: "Lead Product & UI/UX Dizayner",
        en: "Lead Product & UI/UX Designer"
      },
      company: "Design Director • Red Dot Winner",
      experience: { ru: "8 лет в Product Design", uz: "8 yil Product Designda", en: "8 yrs in Product Design" },
      students: "950+",
      avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80",
      bio: {
        ru: "Создавал дизайн-системы для крупнейших супер-аппов и e-commerce сервисов Центральной Азии и Европы. Обучает продуктовому мышлению.",
        uz: "Markaziy Osiyo va Yevropaning eng yirik super-app va e-commerce xizmatlari uchun dizayn-tizimlar yaratgan. Mahsulot dizaynidan dars beradi.",
        en: "Architected design systems for top fintech super-apps and e-commerce marketplaces across Central Asia and Europe. Passionate about UX psychology."
      },
      stack: ["Figma", "Design Systems", "UX Strategy", "Motion UI"]
    },
    {
      id: "teacher-4",
      name: {
        ru: "Дмитрий Громов",
        uz: "Dmitriy Gromov",
        en: "Dmitry Gromov"
      },
      role: {
        ru: "Senior DevSecOps & Cloud Инженер",
        uz: "Senior DevSecOps & Cloud Muhandisi",
        en: "Senior DevSecOps & Cloud Architect"
      },
      company: "Cloud Security Architect • OSCP & AWS Certified",
      experience: { ru: "10 лет в Security", uz: "10 yil Securityda", en: "10 yrs in Cloud & Sec" },
      students: "620+",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
      bio: {
        ru: "Сертифицированный этичный хакер (OSCP) и архитектор облачной инфраструктуры. Проводит практические киберучения на реальных стендах.",
        uz: "Sertifikatlangan axloqiy xaker (OSCP) va bulutli infratuzilma arxitektori. Real poligonlarda amaliy kiber-mashg'ulotlar o'tkazadi.",
        en: "OSCP-certified ethical hacker and AWS cloud architect. Runs hands-on Red/Blue Team cyber ranges and production Kubernetes labs at Good Edu."
      },
      stack: ["Kubernetes", "Cybersecurity", "AWS", "Terraform"]
    },
    {
      id: "teacher-5",
      name: {
        ru: "Мадина Каримова",
        uz: "Madina Karimova",
        en: "Madina Karimova"
      },
      role: {
        ru: "Senior Mobile Engineer (Flutter / iOS)",
        uz: "Senior Mobile Engineer (Flutter / iOS)",
        en: "Senior Mobile Engineer (Flutter & iOS)"
      },
      company: "Tech Lead Mobile • 15+ Apps in App Store",
      experience: { ru: "7 лет в Mobile", uz: "7 yil Mobileda", en: "7 yrs in Mobile" },
      students: "710+",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80",
      bio: {
        ru: "Разработала более 15 коммерческих мобильных приложений с суммарной аудиторией 5 млн скачиваний. Ментор женского IT-сообщества.",
        uz: "Umumiy yuklab olishlar soni 5 milliondan oshgan 15+ tijorat mobil ilovalarini ishlab chiqqan. Xotin-qizlar IT-hamjamiyati mentori.",
        en: "Shipped 15+ commercial iOS and Android apps reaching over 5 million downloads. Mentors students on clean mobile architecture and animations."
      },
      stack: ["Flutter", "Swift", "Clean Architecture", "CI/CD Mobile"]
    }
  ],

  events: [
    {
      id: "event-1",
      type: "event",
      date: "28.11.2026 • 15:00",
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80",
      tag: { ru: "Хакатон", uz: "Xakaton", en: "Hackathon" },
      title: {
        ru: "Good Edu AI Hackathon 2026: призовой фонд 50 000 000 сум",
        uz: "Good Edu AI Hackathon 2026: mukofot jamg'armasi 50 000 000 so'm",
        en: "Good Edu AI Hackathon 2026: 50,000,000 UZS Prize Pool"
      },
      desc: {
        ru: "48 часов кодинга, менторские сессии от экспертов индустрии и презентация AI-стартапов перед венчурными фондами и работодателями.",
        uz: "48 soatlik koding, soha ekspertlaridan mentorlik sessiyalari va venchur fondlar hamda ish beruvchilar oldida AI-startaplar taqdimoti.",
        en: "48 hours of non-stop building, mentorship from industry leads, and live startup pitches in front of VCs and hiring executives."
      }
    },
    {
      id: "event-2",
      type: "news",
      date: "20.11.2026",
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
      tag: { ru: "Новость кампуса", uz: "Kampus yangiligi", en: "Campus News" },
      title: {
        ru: "Открытие новой AI & Robotics лаборатории в кампусе Good Edu",
        uz: "Good Edu kampusida yangi AI & Robotics laboratoriyasining ochilishi",
        en: "Good Edu Opens Next-Gen AI & Robotics Compute Lab"
      },
      desc: {
        ru: "Мы запустили круглосуточную лабораторию с серверами NVIDIA H100 для обучения студентов курсов Data Science и AI Engineering.",
        uz: "Data Science va AI Engineering talabalari uchun NVIDIA H100 serverlariga ega 24/7 ishlaydigan yangi laboratoriyani ishga tushirdik.",
        en: "Students now have 24/7 access to our on-campus GPU cluster powered by NVIDIA accelerators for training custom LLMs and vision models."
      }
    },
    {
      id: "event-3",
      type: "event",
      date: "05.12.2026 • 18:30",
      image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=800&q=80",
      tag: { ru: "Открытый воркшоп", uz: "Ochiq vorkshop", en: "Open Workshop" },
      title: {
        ru: "Карьера в IT в 2027 году: как пройти техническое интервью на $2000+",
        uz: "2027-yilda IT karyerasi: $2000+ maoshli texnik intervyudan qanday o'tish mumkin",
        en: "Tech Careers 2027: Cracking the $2,000+ System Design Interview"
      },
      desc: {
        ru: "Бесплатный мастер-класс с разбором реальных резюме, live-собеседованием по System Design и сессией вопросов-ответов с тимлидами.",
        uz: "Real rezyumelar tahlili, System Design bo'yicha jonli suhbat va timlidlar bilan savol-javob sessiyasini o'z ichiga olgan bepul master-klass.",
        en: "Free open workshop featuring live resume reviews, a mock System Design interview, and Q&A with hiring managers from partner companies."
      }
    }
  ],

  leads: [
    {
      id: "lead-1",
      name: "Жавохир Тошматов",
      phone: "+998 (90) 945-12-34",
      email: "javohir.dev@gmail.com",
      course: "Full-Stack Web Engineering",
      message: "Хочу записаться на вечернюю группу, интересует пробный урок.",
      date: "23.11.2026, 18:20",
      status: "new"
    },
    {
      id: "lead-2",
      name: "Малика Абдуллаева",
      phone: "+998 (93) 511-88-90",
      email: "malika.design@mail.uz",
      course: "UI/UX & Product Design",
      message: "Есть ли рассрочка на обучение и нужен ли свой ноутбук?",
      date: "23.11.2026, 14:05",
      status: "done"
    }
  ]
};

