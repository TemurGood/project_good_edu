/**
 * ============================================================================
 * GOOD EDU — GOOGLE APPS SCRIPT BRIDGE (Для Google Docs .docx + Google Sheets .xlsx)
 * ============================================================================
 * Этот скрипт позволяет вашему сайту и AI RAG-агенту (gemini-3.5-flash-lite):
 * 1. Мгновенно читать свежий текст из ваших Google Docs (Прайс .docx и FAQ .docx) при любом изменении.
 * 2. Мгновенно читать таблицу расписания преподавателей из Google Sheets / Excel.
 * 3. Записывать новых студентов в свободные окна (слоты) прямо из чата с AI-агентом или с сайта!
 *
 * КАК УСТАНОВИТЬ ЗА 1 МИНУТУ:
 * 1. Загрузите `good_edu_price.docx`, `good_edu_faq.docx` и `good_edu_schedule.xlsx` на ваш Google Диск
 *    и откройте их в Google Docs / Google Таблицах.
 * 2. В открытой таблице `good_edu_schedule` нажмите в верхнем меню:
 *    Расширения (Extensions) -> Apps Script.
 * 3. Вставьте этот код, укажите ID ваших документов ниже (PRICE_DOC_ID и FAQ_DOC_ID)
 *    и нажмите «Начать развертывание» (Deploy) -> «Новое развертывание» (New deployment):
 *    - Тип: Веб-приложение (Web App)
 *    - Запуск от имени: Меня (Me)
 *    - У кого есть доступ: Все (Anyone)
 * 4. Скопируйте полученный Web App URL и вставьте его в Админ-панели сайта Good Edu!
 */

const PRICE_DOC_ID = "1gOBh6JhBnAn26QM-HpRMuh2nd21xf9eLNBsSNjVLy7I";
const FAQ_DOC_ID = "11P2rxKx8aiu9HSRF4X7Yzhmtq-yuN5KiB71mUCsa95g";
const SCHEDULE_SHEET_ID = "1YZ4AzLASgLNrD76sqowRyBe_2MxCnWXlrcrSm9w5ie8";
const SHEET_NAME = "Schedule_Bookings";

function doGet(e) {
  const action = (e && e.parameter && e.parameter.action) || "syncAll";
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAME) || ss.getSheets()[0];

  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const rows = data.slice(1).map((r, idx) => ({
    rowIndex: idx + 2,
    slotId: String(r[0] || ""),
    teacher: String(r[1] || ""),
    roleCompany: String(r[2] || ""),
    experience: String(r[3] || ""),
    stack: String(r[4] || ""),
    course: String(r[5] || ""),
    day: String(r[6] || ""),
    time: String(r[7] || ""),
    room: String(r[8] || ""),
    status: String(r[9] || "Свободно"),
    studentName: String(r[10] || ""),
    studentPhone: String(r[11] || ""),
    comment: String(r[12] || "")
  }));

  let priceText = "";
  let faqText = "";

  try {
    if (PRICE_DOC_ID && !PRICE_DOC_ID.includes("ВСТАВЬТЕ")) {
      priceText = DocumentApp.openById(PRICE_DOC_ID).getBody().getText();
    }
  } catch (err) {
    priceText = "Error reading PRICE_DOC_ID: " + err.message;
  }

  try {
    if (FAQ_DOC_ID && !FAQ_DOC_ID.includes("ВСТАВЬТЕ")) {
      faqText = DocumentApp.openById(FAQ_DOC_ID).getBody().getText();
    }
  } catch (err) {
    faqText = "Error reading FAQ_DOC_ID: " + err.message;
  }

  return ContentService.createTextOutput(
    JSON.stringify({
      ok: true,
      updatedAt: new Date().toISOString(),
      schedule: rows,
      priceText: priceText,
      faqText: faqText
    })
  ).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(SHEET_NAME) || ss.getSheets()[0];
    const data = sheet.getDataRange().getValues();

    // 1. Запись студента в выбранное свободное окно (Slot_ID)
    if (payload.action === "bookSlot") {
      const targetSlotId = payload.slotId;
      for (let i = 1; i < data.length; i++) {
        if (String(data[i][0]) === String(targetSlotId)) {
          const rowNum = i + 1;
          sheet.getRange(rowNum, 10).setValue("Занято");
          sheet.getRange(rowNum, 11).setValue(payload.studentName || "");
          sheet.getRange(rowNum, 12).setValue(payload.studentPhone || "");
          sheet.getRange(rowNum, 13).setValue(payload.comment || "Записан через AI RAG Агента");
          return ContentService.createTextOutput(
            JSON.stringify({ ok: true, bookedSlotId: targetSlotId })
          ).setMimeType(ContentService.MimeType.JSON);
        }
      }
      return ContentService.createTextOutput(
        JSON.stringify({ ok: false, error: "Слот не найден: " + targetSlotId })
      ).setMimeType(ContentService.MimeType.JSON);
    }

    // 2. Освобождение окна (отмена записи)
    if (payload.action === "freeSlot") {
      const targetSlotId = payload.slotId;
      for (let i = 1; i < data.length; i++) {
        if (String(data[i][0]) === String(targetSlotId)) {
          const rowNum = i + 1;
          sheet.getRange(rowNum, 10).setValue("Свободно");
          sheet.getRange(rowNum, 11).setValue("");
          sheet.getRange(rowNum, 12).setValue("");
          sheet.getRange(rowNum, 13).setValue("Доступно для записи");
          return ContentService.createTextOutput(
            JSON.stringify({ ok: true, freedSlotId: targetSlotId })
          ).setMimeType(ContentService.MimeType.JSON);
        }
      }
    }

    // 3. Добавление нового окна преподавателя
    if (payload.action === "addSlot" && payload.slot) {
      const s = payload.slot;
      sheet.appendRow([
        s.slotId,
        s.teacher,
        s.roleCompany,
        s.experience,
        s.stack,
        s.course,
        s.day,
        s.time,
        s.room,
        s.status || "Свободно",
        s.studentName || "",
        s.studentPhone || "",
        s.comment || "Доступно для записи"
      ]);
      return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(
        ContentService.MimeType.JSON
      );
    }

    return ContentService.createTextOutput(
      JSON.stringify({ ok: false, error: "Unknown action" })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ ok: false, error: err.message })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

