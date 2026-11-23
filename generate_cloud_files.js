/**
 * Generator for Good Edu Cloud RAG files:
 * 1. good_edu_price.docx (Valid OpenXML .docx for Google Docs)
 * 2. good_edu_faq.docx (Valid OpenXML .docx for Google Docs)
 * 3. good_edu_schedule.xlsx (Valid OpenXML .xlsx for Google Sheets + CSV copy)
 * Zero external npm packages required — uses Node's built-in zlib/CRC32 ZIP builder.
 */
const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

// Minimal ZIP writer (Store method = 0, universally supported by MS Office & Google Drive)
function crc32(buf) {
  let c = -1;
  for (let i = 0; i < buf.length; i++) {
    c = (c >>> 8) ^ CRC_TABLE[(c ^ buf[i]) & 0xff];
  }
  return (c ^ -1) >>> 0;
}

const CRC_TABLE = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  CRC_TABLE[n] = c >>> 0;
}

function createZipBuffer(files) {
  const localParts = [];
  const centralParts = [];
  let offset = 0;

  for (const file of files) {
    const nameBuf = Buffer.from(file.name, "utf8");
    const dataBuf = Buffer.isBuffer(file.data) ? file.data : Buffer.from(file.data, "utf8");
    const crc = crc32(dataBuf);
    const compressed = zlib.deflateRawSync(dataBuf);

    // Local file header
    const localHeader = Buffer.alloc(30);
    localHeader.writeUInt32LE(0x04034b50, 0);
    localHeader.writeUInt16LE(20, 4);
    localHeader.writeUInt16LE(0, 6);
    localHeader.writeUInt16LE(8, 8); // Deflate
    localHeader.writeUInt16LE(0, 10);
    localHeader.writeUInt16LE(0, 12);
    localHeader.writeUInt32LE(crc, 14);
    localHeader.writeUInt32LE(compressed.length, 18);
    localHeader.writeUInt32LE(dataBuf.length, 22);
    localHeader.writeUInt16LE(nameBuf.length, 26);
    localHeader.writeUInt16LE(0, 28);

    localParts.push(localHeader, nameBuf, compressed);

    // Central directory header
    const centralHeader = Buffer.alloc(46);
    centralHeader.writeUInt32LE(0x02014b50, 0);
    centralHeader.writeUInt16LE(20, 4);
    centralHeader.writeUInt16LE(20, 6);
    centralHeader.writeUInt16LE(0, 8);
    centralHeader.writeUInt16LE(8, 10); // Deflate
    centralHeader.writeUInt16LE(0, 12);
    centralHeader.writeUInt16LE(0, 14);
    centralHeader.writeUInt32LE(crc, 16);
    centralHeader.writeUInt32LE(compressed.length, 20);
    centralHeader.writeUInt32LE(dataBuf.length, 24);
    centralHeader.writeUInt16LE(nameBuf.length, 28);
    centralHeader.writeUInt16LE(0, 30);
    centralHeader.writeUInt16LE(0, 32);
    centralHeader.writeUInt16LE(0, 34);
    centralHeader.writeUInt16LE(0, 36);
    centralHeader.writeUInt32LE(0, 38);
    centralHeader.writeUInt32LE(offset, 42);

    centralParts.push(centralHeader, nameBuf);
    offset += localHeader.length + nameBuf.length + compressed.length;
  }

  const centralBuf = Buffer.concat(centralParts);
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0);
  eocd.writeUInt16LE(0, 4);
  eocd.writeUInt16LE(0, 6);
  eocd.writeUInt16LE(files.length, 8);
  eocd.writeUInt16LE(files.length, 10);
  eocd.writeUInt32LE(centralBuf.length, 12);
  eocd.writeUInt32LE(offset, 16);
  eocd.writeUInt16LE(0, 20);

  return Buffer.concat([...localParts, centralBuf, eocd]);
}

function escapeXml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

// Build valid .docx from markdown text
function createDocxBuffer(markdownText) {
  const lines = markdownText.split(/\r?\n/);
  const paragraphs = lines
    .map((line) => {
      const clean = line.replace(/^#+\s*/, "").trim();
      if (!clean) return "<w:p/>";
      const isHeading = /^#+/.test(line);
      return `<w:p><w:r>${isHeading ? "<w:rPr><w:b/></w:rPr>" : ""}<w:t xml:space="preserve">${escapeXml(
        clean
      )}</w:t></w:r></w:p>`;
    })
    .join("");

  const documentXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    ${paragraphs}
  </w:body>
</w:document>`;

  const contentTypesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>`;

  const relsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`;

  return createZipBuffer([
    { name: "[Content_Types].xml", data: contentTypesXml },
    { name: "_rels/.rels", data: relsXml },
    { name: "word/document.xml", data: documentXml }
  ]);
}

// Build valid .xlsx from rows array
function createXlsxBuffer(rows) {
  const sheetRowsXml = rows
    .map((row, rIdx) => {
      const cellsXml = row
        .map((cellVal, cIdx) => {
          const colLetter = String.fromCharCode(65 + cIdx);
          const ref = `${colLetter}${rIdx + 1}`;
          return `<c r="${ref}" t="inlineStr"><is><t>${escapeXml(cellVal ?? "")}</t></is></c>`;
        })
        .join("");
      return `<row r="${rIdx + 1}">${cellsXml}</row>`;
    })
    .join("");

  const sheetXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <sheetData>${sheetRowsXml}</sheetData>
</worksheet>`;

  const workbookXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <sheets>
    <sheet name="Schedule_Bookings" sheetId="1" r:id="rId1"/>
  </sheets>
</workbook>`;

  const workbookRelsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>
</Relationships>`;

  const rootRelsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
</Relationships>`;

  const contentTypesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
  <Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
</Types>`;

  return createZipBuffer([
    { name: "[Content_Types].xml", data: contentTypesXml },
    { name: "_rels/.rels", data: rootRelsXml },
    { name: "xl/workbook.xml", data: workbookXml },
    { name: "xl/_rels/workbook.xml.rels", data: workbookRelsXml },
    { name: "xl/worksheets/sheet1.xml", data: sheetXml }
  ]);
}

// 1. Generate good_edu_price.docx and good_edu_faq.docx
const priceMd = fs.readFileSync(path.join(__dirname, "rag_price.md"), "utf8");
const faqMd = fs.readFileSync(path.join(__dirname, "rag_faq.md"), "utf8");

fs.writeFileSync(path.join(__dirname, "good_edu_price.docx"), createDocxBuffer(priceMd));
fs.writeFileSync(path.join(__dirname, "good_edu_faq.docx"), createDocxBuffer(faqMd));

// 2. Generate Excel Table: Teachers Schedule, All Teacher Details & Student Bookings
const scheduleRows = [
  [
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
  ],
  // 1. Азизбек Рахимов
  ["SLOT-101", "Азизбек Рахимов", "Principal Full-Stack Архитектор (Ex-EPAM)", "11 лет", "TypeScript, React, Next.js, Node.js", "Full-Stack Web Разработчик (React & Node.js)", "Понедельник", "18:00 - 19:30", "Каб. 201", "Занято", "Жавохир Тошматов", "+998 (90) 945-12-34", "Вводный урок + код-ревью"],
  ["SLOT-102", "Азизбек Рахимов", "Principal Full-Stack Архитектор (Ex-EPAM)", "11 лет", "TypeScript, React, Next.js, Node.js", "Full-Stack Web Разработчик (React & Node.js)", "Понедельник", "19:30 - 21:00", "Каб. 201", "Свободно", "", "", "Доступно для записи"],
  ["SLOT-103", "Азизбек Рахимов", "Principal Full-Stack Архитектор (Ex-EPAM)", "11 лет", "TypeScript, React, Next.js, Node.js", "Frontend Разработчик (JS, TS, React)", "Среда", "18:00 - 19:30", "Каб. 201", "Свободно", "", "", "Доступно для записи"],
  ["SLOT-104", "Азизбек Рахимов", "Principal Full-Stack Архитектор (Ex-EPAM)", "11 лет", "TypeScript, React, Next.js, Node.js", "Full-Stack Web Разработчик (React & Node.js)", "Пятница", "18:00 - 20:00", "Каб. 201", "Свободно", "", "", "Архитектура и практика"],
  ["SLOT-105", "Азизбек Рахимов", "Principal Full-Stack Архитектор (Ex-EPAM)", "11 лет", "TypeScript, React, Next.js, Node.js", "Full-Stack Web Разработчик (React & Node.js)", "Суббота", "14:00 - 16:00", "Каб. 201", "Свободно", "", "", "Субботний пробный урок"],

  // 2. Елена Соколова
  ["SLOT-201", "Елена Соколова", "Head of AI & Machine Learning (PhD CS)", "9 лет", "Python, PyTorch, LLM, RAG, SQL", "AI Engineer & Data Science (Python & LLM)", "Вторник", "17:30 - 19:00", "AI-Lab 305", "Занято", "Шохрух Мирзаев", "+998 (93) 321-55-44", "Консультация по LLM"],
  ["SLOT-202", "Елена Соколова", "Head of AI & Machine Learning (PhD CS)", "9 лет", "Python, PyTorch, LLM, RAG, SQL", "AI Engineer & Data Science (Python & LLM)", "Вторник", "19:00 - 21:00", "AI-Lab 305", "Свободно", "", "", "Доступно для записи"],
  ["SLOT-203", "Елена Соколова", "Head of AI & Machine Learning (PhD CS)", "9 лет", "Python, PyTorch, LLM, RAG, SQL", "Data Analyst & BI-аналитика", "Среда", "15:00 - 17:00", "AI-Lab 305", "Свободно", "", "", "Доступно для записи"],
  ["SLOT-204", "Елена Соколова", "Head of AI & Machine Learning (PhD CS)", "9 лет", "Python, PyTorch, LLM, RAG, SQL", "AI Engineer & Data Science (Python & LLM)", "Четверг", "18:00 - 20:30", "AI-Lab 305", "Свободно", "", "", "Доступно для записи"],
  ["SLOT-205", "Елена Соколова", "Head of AI & Machine Learning (PhD CS)", "9 лет", "Python, PyTorch, LLM, RAG, SQL", "AI Engineer & Data Science (Python & LLM)", "Суббота", "15:00 - 17:00", "AI-Lab 305", "Свободно", "", "", "Практикум на GPU-серверах"],

  // 3. Сардор Алимов
  ["SLOT-301", "Сардор Алимов", "Lead Product & UI/UX Дизайнер (Red Dot Winner)", "8 лет", "Figma, Design Systems, UX Research, Framer", "UI/UX & Product Design", "Понедельник", "15:30 - 17:30", "Design Studio 104", "Занято", "Малика Абдуллаева", "+998 (93) 511-88-90", "Разбор портфолио"],
  ["SLOT-302", "Сардор Алимов", "Lead Product & UI/UX Дизайнер (Red Dot Winner)", "8 лет", "Figma, Design Systems, UX Research, Framer", "UI/UX & Product Design", "Понедельник", "18:30 - 20:30", "Design Studio 104", "Свободно", "", "", "Доступно для записи"],
  ["SLOT-303", "Сардор Алимов", "Lead Product & UI/UX Дизайнер (Red Dot Winner)", "8 лет", "Figma, Design Systems, UX Research, Framer", "UI/UX & Product Design", "Среда", "18:30 - 20:30", "Design Studio 104", "Свободно", "", "", "Доступно для записи"],
  ["SLOT-304", "Сардор Алимов", "Lead Product & UI/UX Дизайнер (Red Dot Winner)", "8 лет", "Figma, Design Systems, UX Research, Framer", "UI/UX & Product Design", "Пятница", "16:00 - 18:00", "Design Studio 104", "Свободно", "", "", "Воркшоп по Figma"],
  ["SLOT-305", "Сардор Алимов", "Lead Product & UI/UX Дизайнер (Red Dot Winner)", "8 лет", "Figma, Design Systems, UX Research, Framer", "UI/UX & Product Design", "Воскресенье", "11:00 - 14:00", "Design Studio 104", "Свободно", "", "", "Открытый дизайн-линч"],

  // 4. Дмитрий Громов
  ["SLOT-401", "Дмитрий Громов", "Senior DevSecOps & Cloud Инженер (OSCP & AWS)", "10 лет", "Kubernetes, Linux, AWS, Terraform, OWASP", "Кибербезопасность & Ethical Hacking (DevSecOps)", "Вторник", "18:30 - 21:00", "Cyber Polygon 402", "Свободно", "", "", "Доступно для записи"],
  ["SLOT-402", "Дмитрий Громов", "Senior DevSecOps & Cloud Инженер (OSCP & AWS)", "10 лет", "Kubernetes, Linux, AWS, Terraform, OWASP", "Cloud & DevOps Инженер (Kubernetes & AWS)", "Четверг", "18:30 - 21:00", "Cyber Polygon 402", "Свободно", "", "", "Доступно для записи"],
  ["SLOT-403", "Дмитрий Громов", "Senior DevSecOps & Cloud Инженер (OSCP & AWS)", "10 лет", "Kubernetes, Linux, AWS, Terraform, OWASP", "Cloud & DevOps Инженер (Kubernetes & AWS)", "Пятница", "17:00 - 19:30", "Cyber Polygon 402", "Занято", "Рустам Касымов", "+998 (97) 700-11-22", "Лабораторная по Kubernetes"],
  ["SLOT-404", "Дмитрий Громов", "Senior DevSecOps & Cloud Инженер (OSCP & AWS)", "10 лет", "Kubernetes, Linux, AWS, Terraform, OWASP", "Кибербезопасность & Ethical Hacking (DevSecOps)", "Суббота", "16:00 - 18:00", "Cyber Polygon 402", "Свободно", "", "", "Киберучения Red/Blue Team"],

  // 5. Мадина Каримова
  ["SLOT-501", "Мадина Каримова", "Senior Mobile Engineer (15+ Apps in App Store)", "7 лет", "Flutter, Dart, Swift, SwiftUI, Clean Arch", "Мобильная разработка (Flutter & iOS/Android)", "Понедельник", "10:00 - 12:00", "Mobile Hub 208", "Свободно", "", "", "Утренний поток Flutter"],
  ["SLOT-502", "Мадина Каримова", "Senior Mobile Engineer (15+ Apps in App Store)", "7 лет", "Flutter, Dart, Swift, SwiftUI, Clean Arch", "iOS Разработчик (Swift & SwiftUI)", "Вторник", "18:00 - 20:30", "Mobile Hub 208", "Свободно", "", "", "Вечерний поток iOS/Flutter"],
  ["SLOT-503", "Мадина Каримова", "Senior Mobile Engineer (15+ Apps in App Store)", "7 лет", "Flutter, Dart, Swift, SwiftUI, Clean Arch", "Мобильная разработка (Flutter & iOS/Android)", "Четверг", "18:00 - 20:30", "Mobile Hub 208", "Свободно", "", "", "Доступно для записи"],
  ["SLOT-504", "Мадина Каримова", "Senior Mobile Engineer (15+ Apps in App Store)", "7 лет", "Flutter, Dart, Swift, SwiftUI, Clean Arch", "Мобильная разработка (Flutter & iOS/Android)", "Суббота", "13:00 - 16:00", "Mobile Hub 208", "Свободно", "", "", "Субботний мобильный воркшоп"],

  // 6. Тимур Садыков
  ["SLOT-601", "Тимур Садыков", "Senior Python & QA Automation Lead", "8 лет", "Python, Django, FastAPI, Playwright, PyTest", "Python Backend Разработчик (Django & FastAPI)", "Понедельник", "14:00 - 16:00", "Каб. 109", "Свободно", "", "", "Дневной поток Python"],
  ["SLOT-602", "Тимур Садыков", "Senior Python & QA Automation Lead", "8 лет", "Python, Django, FastAPI, Playwright, PyTest", "QA Engineer (Ручное + Автотесты Python)", "Вторник", "18:30 - 20:30", "Каб. 109", "Свободно", "", "", "Вечерний поток QA"],
  ["SLOT-603", "Тимур Садыков", "Senior Python & QA Automation Lead", "8 лет", "Python, Django, FastAPI, Playwright, PyTest", "Python Backend Разработчик (Django & FastAPI)", "Среда", "14:00 - 16:00", "Каб. 109", "Свободно", "", "", "Доступно для записи"],
  ["SLOT-604", "Тимур Садыков", "Senior Python & QA Automation Lead", "8 лет", "Python, Django, FastAPI, Playwright, PyTest", "Основы программирования (IT-Start)", "Воскресенье", "10:00 - 13:00", "Каб. 109", "Свободно", "", "", "Воскресная группа IT-Start"]
];

fs.writeFileSync(path.join(__dirname, "good_edu_schedule.xlsx"), createXlsxBuffer(scheduleRows));

// Also write CSV with UTF-8 BOM so Excel opens Cyrillic cleanly too
const csvContent =
  "\uFEFF" +
  scheduleRows
    .map((r) => r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    .join("\r\n");
fs.writeFileSync(path.join(__dirname, "good_edu_schedule.csv"), csvContent, "utf8");

console.log("Generated: good_edu_price.docx, good_edu_faq.docx, good_edu_schedule.xlsx, good_edu_schedule.csv");

