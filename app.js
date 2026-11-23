// ==========================================================
// Good Edu — Application Controller
// Multilingual (RU/UZ/EN), Theme Switcher, Dynamic Content & Admin CMS
// ==========================================================

(function () {
  const STORAGE_KEY = "good_edu_cms_state_v1";
  const LANG_KEY = "good_edu_lang";
  const THEME_KEY = "good_edu_theme";

  let currentLang = localStorage.getItem(LANG_KEY) || "ru";
  let currentTheme = localStorage.getItem(THEME_KEY) || "dark";
  let activeCourseFilter = "all";
  let activeEventFilter = "all";

  // Load state from localStorage or fall back to deep-cloned INITIAL_DATA
  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.courses && parsed.teachers && parsed.stats && parsed.events) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn("Could not read saved state, using initial data.", e);
    }
    return JSON.parse(JSON.stringify(INITIAL_DATA));
  }

  let state = loadState();

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn("Could not save state", e);
    }
  }

  // Helper to get localized value from object {ru, uz, en} or plain string
  function localize(field) {
    if (!field) return "";
    if (typeof field === "string") return field;
    return field[currentLang] || field.ru || field.en || "";
  }

  // Helper to get dictionary translation string
  function t(key) {
    const dict = TRANSLATIONS[currentLang] || TRANSLATIONS.ru;
    return dict[key] || TRANSLATIONS.ru[key] || key;
  }

  // Toast Notification
  let toastTimer = null;
  function showToast(message) {
    const toast = document.getElementById("toastNotification");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove("show");
    }, 3200);
  }

  // ==========================================================
  // THEME MANAGEMENT (DARK / LIGHT)
  // ==========================================================
  function applyTheme(theme) {
    currentTheme = theme;
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(THEME_KEY, theme);
  }

  // ==========================================================
  // LANGUAGE MANAGEMENT (RU / UZ / EN)
  // ==========================================================
  function applyLanguage(lang) {
    currentLang = lang;
    document.documentElement.setAttribute("lang", lang);
    localStorage.setItem(LANG_KEY, lang);

    // Update language buttons active state
    document.querySelectorAll(".lang-btn").forEach((btn) => {
      btn.classList.toggle("active", btn.getAttribute("data-lang") === lang);
    });

    // Update static elements with data-i18n
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      el.textContent = t(key);
    });

    // Update input placeholders
    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      const key = el.getAttribute("data-i18n-placeholder");
      el.setAttribute("placeholder", t(key));
    });

    // Re-render all dynamic sections
    renderAll();
  }

  // ==========================================================
  // DYNAMIC SECTION RENDERERS
  // ==========================================================

  function renderStats() {
    const grid = document.getElementById("statsGrid");
    if (!grid) return;

    grid.innerHTML = state.stats
      .map(
        (item) => `
      <article class="stat-card">
        <div class="stat-icon">${item.icon || "📊"}</div>
        <div class="stat-value">${item.value}</div>
        <h3 class="stat-label">${localize(item.label)}</h3>
        <p class="stat-desc">${localize(item.desc)}</p>
      </article>
    `
      )
      .join("");
  }

  function renderCourses() {
    const grid = document.getElementById("coursesGrid");
    if (!grid) return;

    const filtered =
      activeCourseFilter === "all"
        ? state.courses
        : state.courses.filter((c) => c.category === activeCourseFilter);

    grid.innerHTML = filtered
      .map(
        (course) => `
      <article class="course-card">
        <div>
          <div class="course-top">
            <div class="course-icon">${course.icon || "💻"}</div>
            <span class="course-level-badge">${localize(course.level)}</span>
          </div>
          <h3 class="course-title">${localize(course.title)}</h3>
          <p class="course-desc">${localize(course.desc)}</p>
          <div class="course-skills">
            ${(course.skills || []).map((s) => `<span class="skill-tag">${s}</span>`).join("")}
          </div>
        </div>

        <div>
          <div class="course-meta">
            <div>
              <span>${t("course_duration")}</span>
              <strong>${localize(course.duration)}</strong>
            </div>
            <div style="text-align: right;">
              <span>${t("course_price")}</span>
              <strong>${course.price} ${t("course_currency")}</strong>
            </div>
          </div>
          <button type="button" class="course-btn" data-enroll-course="${localize(course.title)}">
            ${t("course_enroll_btn")} →
          </button>
        </div>
      </article>
    `
      )
      .join("");

    // Bind "Enroll" buttons to scroll to contact form & pre-select course
    grid.querySelectorAll("[data-enroll-course]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const courseName = btn.getAttribute("data-enroll-course");
        const select = document.getElementById("leadCourse");
        if (select) {
          select.value = courseName;
        }
        document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
        document.getElementById("leadName")?.focus();
      });
    });

    populateCourseSelect();
  }

  function populateCourseSelect() {
    const select = document.getElementById("leadCourse");
    if (!select) return;
    const currentVal = select.value;

    select.innerHTML = state.courses
      .map((c) => {
        const title = localize(c.title);
        return `<option value="${title}">${title}</option>`;
      })
      .join("");

    if (currentVal && Array.from(select.options).some((o) => o.value === currentVal)) {
      select.value = currentVal;
    }
  }

  function renderTeachers() {
    const grid = document.getElementById("teachersGrid");
    if (!grid) return;

    grid.innerHTML = state.teachers
      .map(
        (teacher) => `
      <article class="teacher-card">
        <div>
          <div class="teacher-header">
            <img
              class="teacher-avatar"
              src="${teacher.avatarAlt || teacher.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"}"
              alt="${localize(teacher.name)}"
              loading="lazy"
            />
            <div>
              <div class="teacher-role">${localize(teacher.role)}</div>
              <h3 class="teacher-name">${localize(teacher.name)}</h3>
              <div class="teacher-company">${teacher.company || "Good Edu Mentor"}</div>
            </div>
          </div>
          <p class="teacher-bio">${localize(teacher.bio)}</p>
        </div>

        <div>
          <div class="teacher-stack">
            ${(teacher.stack || []).map((st) => `<span class="stack-pill">${st}</span>`).join("")}
          </div>
          <div class="teacher-stats">
            <span>${t("teacher_exp_label")} <strong>${localize(teacher.experience)}</strong></span>
            <span>${t("teacher_students_label")} <strong>${teacher.students || "500+"}</strong></span>
          </div>
        </div>
      </article>
    `
      )
      .join("");
  }

  function renderEvents() {
    const grid = document.getElementById("eventsGrid");
    if (!grid) return;

    const filtered =
      activeEventFilter === "all"
        ? state.events
        : state.events.filter((ev) => ev.type === activeEventFilter);

    grid.innerHTML = filtered
      .map(
        (ev) => `
      <article class="event-card">
        <div class="event-image-wrap">
          <img
            src="${ev.image || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80"}"
            alt="${localize(ev.title)}"
            loading="lazy"
          />
          <span class="event-badge">${localize(ev.tag)}</span>
        </div>
        <div class="event-body">
          <div class="event-date">📅 ${ev.date}</div>
          <h3 class="event-title">${localize(ev.title)}</h3>
          <p class="event-desc">${localize(ev.desc)}</p>
          <button type="button" class="event-action" data-event-cta="${localize(ev.title)}">
            <span>${ev.type === "event" ? t("event_register_btn") : t("event_read_btn")}</span>
            <span>→</span>
          </button>
        </div>
      </article>
    `
      )
      .join("");

    grid.querySelectorAll("[data-event-cta]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const title = btn.getAttribute("data-event-cta");
        const msgInput = document.getElementById("leadMessage");
        if (msgInput) {
          msgInput.value = `${title}`;
        }
        document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
      });
    });
  }

  // ==========================================================
  // ADMIN PANEL (CMS) RENDERER & ACTIONS
  // ==========================================================
  function renderAdminPanel() {
    // Update Header & Sidebar Badges
    const newLeadsCount = state.leads.filter((l) => l.status === "new").length;
    const badgeEl = document.getElementById("adminLeadCount");
    if (badgeEl) badgeEl.textContent = state.leads.length;

    const sbLeads = document.getElementById("sidebarLeadsBadge");
    const sbCourses = document.getElementById("sidebarCoursesBadge");
    const sbTeachers = document.getElementById("sidebarTeachersBadge");
    const sbEvents = document.getElementById("sidebarEventsBadge");

    if (sbLeads) sbLeads.textContent = state.leads.length;
    if (sbCourses) sbCourses.textContent = state.courses.length;
    if (sbTeachers) sbTeachers.textContent = state.teachers.length;
    if (sbEvents) sbEvents.textContent = state.events.length;

    // 1. KPI Grid
    const kpiGrid = document.getElementById("adminKpiGrid");
    if (kpiGrid) {
      kpiGrid.innerHTML = `
        <div class="admin-kpi-card">
          <span>${t("admin_tab_courses")}</span>
          <strong>${state.courses.length}</strong>
        </div>
        <div class="admin-kpi-card">
          <span>${t("admin_tab_teachers")}</span>
          <strong>${state.teachers.length}</strong>
        </div>
        <div class="admin-kpi-card">
          <span>${t("admin_tab_events")}</span>
          <strong>${state.events.length}</strong>
        </div>
        <div class="admin-kpi-card">
          <span>${t("admin_status_new")} / Total Leads</span>
          <strong>${newLeadsCount} / ${state.leads.length}</strong>
        </div>
      `;
    }

    // 2. Leads List
    const leadsList = document.getElementById("adminLeadsList");
    if (leadsList) {
      if (state.leads.length === 0) {
        leadsList.innerHTML = `<p style="color: var(--text-secondary); font-size: 0.9rem;">${t("admin_no_leads")}</p>`;
      } else {
        leadsList.innerHTML = state.leads
          .map(
            (lead) => `
          <div class="admin-item-row">
            <div class="admin-item-info">
              <strong>${lead.name} — <span style="color: var(--accent-secondary);">${lead.phone}</span></strong>
              <span>🎯 ${lead.course} ${lead.email ? `• ✉️ ${lead.email}` : ""} • 🕒 ${lead.date}</span>
              ${lead.message ? `<p style="font-size: 0.83rem; margin-top: 4px; color: var(--text-primary);">“${lead.message}”</p>` : ""}
            </div>
            <div class="admin-item-actions">
              <button type="button" class="btn-status ${lead.status}" data-toggle-lead="${lead.id}">
                ${lead.status === "new" ? t("admin_status_new") : t("admin_status_done")}
              </button>
              <button type="button" class="btn-delete" data-delete-lead="${lead.id}">
                ${t("admin_delete")}
              </button>
            </div>
          </div>
        `
          )
          .join("");
      }
    }

    // 3. Courses List in Admin
    const coursesList = document.getElementById("adminCoursesList");
    if (coursesList) {
      coursesList.innerHTML = state.courses
        .map(
          (course) => `
        <div class="admin-item-row">
          <div class="admin-item-info">
            <strong>${course.icon || "💻"} ${localize(course.title)}</strong>
            <span>${localize(course.duration)} • ${course.price} ${t("course_currency")} • [${(course.skills || []).join(", ")}]</span>
          </div>
          <div class="admin-item-actions">
            <button type="button" class="btn-delete" data-delete-course="${course.id}">${t("admin_delete")}</button>
          </div>
        </div>
      `
        )
        .join("");
    }

    // 4. Teachers List in Admin
    const teachersList = document.getElementById("adminTeachersList");
    if (teachersList) {
      teachersList.innerHTML = state.teachers
        .map(
          (teacher) => `
        <div class="admin-item-row">
          <div class="admin-item-info">
            <strong>${localize(teacher.name)} — ${localize(teacher.role)}</strong>
            <span>${teacher.company} • ${localize(teacher.experience)} • [${(teacher.stack || []).join(", ")}]</span>
          </div>
          <div class="admin-item-actions">
            <button type="button" class="btn-delete" data-delete-teacher="${teacher.id}">${t("admin_delete")}</button>
          </div>
        </div>
      `
        )
        .join("");
    }

    // 5. Events List in Admin
    const eventsList = document.getElementById("adminEventsList");
    if (eventsList) {
      eventsList.innerHTML = state.events
        .map(
          (ev) => `
        <div class="admin-item-row">
          <div class="admin-item-info">
            <strong>[${localize(ev.tag)}] ${localize(ev.title)}</strong>
            <span>📅 ${ev.date}</span>
          </div>
          <div class="admin-item-actions">
            <button type="button" class="btn-delete" data-delete-event="${ev.id}">${t("admin_delete")}</button>
          </div>
        </div>
      `
        )
        .join("");
    }

    // 6. Stats Editor in Admin
    const statsEditor = document.getElementById("adminStatsEditor");
    if (statsEditor) {
      statsEditor.innerHTML = state.stats
        .map(
          (st, idx) => `
        <div class="stat-edit-card">
          <label>${st.icon} ${localize(st.label)}</label>
          <input type="text" data-stat-index="${idx}" value="${st.value}" />
        </div>
      `
        )
        .join("");

      statsEditor.querySelectorAll("[data-stat-index]").forEach((inp) => {
        inp.addEventListener("input", () => {
          const idx = Number(inp.getAttribute("data-stat-index"));
          if (state.stats[idx]) {
            state.stats[idx].value = inp.value;
            saveState();
            renderStats();
          }
        });
      });
    }

    // 7. RAG Knowledge Base Chunks & Excel Schedule Table in Admin
    const ragList = document.getElementById("adminRagChunksList");
    const sbRagBadge = document.getElementById("sidebarRagBadge");
    const chunks = window.GoodEduRAG?.GOOD_EDU_RAG_CHUNKS || [];
    if (sbRagBadge) sbRagBadge.textContent = chunks.length;

    if (window.GoodEduRAG) {
      const cfg = window.GoodEduRAG.getCloudConfig();
      const adminKeyInp = document.getElementById("adminGeminiKeyInput");
      const appsScriptInp = document.getElementById("cloudAppsScriptUrlInput");
      const priceDocInp = document.getElementById("cloudPriceDocIdInput");
      const faqDocInp = document.getElementById("cloudFaqDocIdInput");
      const sheetIdInp = document.getElementById("cloudScheduleSheetIdInput");
      const googleApiInp = document.getElementById("cloudGoogleApiKeyInput");

      if (adminKeyInp) adminKeyInp.value = window.GoodEduRAG.getStoredApiKey();
      if (appsScriptInp) appsScriptInp.value = cfg.appsScriptUrl || "";
      if (priceDocInp) priceDocInp.value = cfg.priceDocId || "";
      if (faqDocInp) faqDocInp.value = cfg.faqDocId || "";
      if (sheetIdInp) sheetIdInp.value = cfg.scheduleSheetId || "";
      if (googleApiInp) googleApiInp.value = cfg.googleCloudApiKey || "";

      // Populate Admin Schedule Table & Quick Booking Select
      const rows = window.GoodEduRAG.getScheduleTable();
      const freeRows = rows.filter((r) => r.status.toLowerCase().includes("свобод"));
      const summaryBadge = document.getElementById("adminScheduleSummaryBadge");
      if (summaryBadge) {
        summaryBadge.textContent = `Свободно окон: ${freeRows.length} / ${rows.length}`;
      }

      const bookSelect = document.getElementById("adminBookSlotSelect");
      if (bookSelect) {
        bookSelect.innerHTML =
          freeRows.length === 0
            ? `<option value="">Нет свободных окон</option>`
            : freeRows
                .map(
                  (r) =>
                    `<option value="${r.slotId}">[${r.slotId}] ${r.teacher} — ${r.day}, ${r.time} (${r.course})</option>`
                )
                .join("");
      }

      const adminTbody = document.getElementById("adminScheduleTbody");
      if (adminTbody) {
        adminTbody.innerHTML = rows
          .map((r) => {
            const isFree = r.status.toLowerCase().includes("свобод");
            return `
              <tr>
                <td><span class="slot-code-pill">${r.slotId}</span></td>
                <td>
                  <strong>${r.teacher}</strong>
                  <div style="font-size: 0.74rem; color: var(--text-secondary);">${r.roleCompany}</div>
                </td>
                <td>${r.course}</td>
                <td><strong>${r.day}</strong><br/><span style="font-size: 0.78rem; color: var(--text-secondary);">${r.time} • ${r.room}</span></td>
                <td>
                  <span class="slot-status-badge ${isFree ? "free" : "busy"}">
                    ${isFree ? "🟢 Свободно" : "🔴 Занято"}
                  </span>
                </td>
                <td>
                  ${
                    isFree
                      ? `<span style="color: var(--text-secondary); font-size: 0.8rem;">Окно свободно для записи</span>`
                      : `<strong>${r.studentName}</strong><br/><span style="font-size: 0.78rem; color: var(--accent-secondary);">${r.studentPhone}</span>`
                  }
                </td>
                <td>
                  ${
                    isFree
                      ? `<button type="button" class="btn-book-slot" data-admin-book-slot="${r.slotId}">Записать</button>`
                      : `<button type="button" class="btn-delete" data-admin-free-slot="${r.slotId}">Освободить</button>`
                  }
                </td>
              </tr>
            `;
          })
          .join("");
      }
    }

    if (ragList) {
      ragList.innerHTML = chunks
        .map(
          (ch) => `
        <div class="admin-item-row">
          <div class="admin-item-info">
            <strong>[${ch.category}] ${ch.title}</strong>
            <span>ID: <code>${ch.id}</code> • Вектор (3072d): ${
              ch.vector ? `<strong style="color: var(--accent-success);">✅ Проиндексирован (${ch.vector.length} floats)</strong>` : "⏳ По запросу / Гибридный индекс"
            }</span>
            <p style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 6px; white-space: pre-line;">${ch.text}</p>
          </div>
        </div>
      `
        )
        .join("");
    }
  }

  function renderPublicScheduleTable() {
    if (!window.GoodEduRAG) return;
    const rows = window.GoodEduRAG.getScheduleTable();
    const teacherSelect = document.getElementById("publicScheduleTeacherFilter");
    const statusSelect = document.getElementById("publicScheduleStatusFilter");
    const tbody = document.getElementById("publicScheduleTbody");
    if (!tbody) return;

    // Populate unique teachers dropdown once
    if (teacherSelect && teacherSelect.options.length <= 1) {
      const teachers = Array.from(new Set(rows.map((r) => r.teacher)));
      teacherSelect.innerHTML =
        `<option value="all">Все преподаватели (${teachers.length})</option>` +
        teachers.map((tName) => `<option value="${tName}">${tName}</option>`).join("");
    }

    const selectedTeacher = teacherSelect?.value || "all";
    const selectedStatus = statusSelect?.value || "all";

    const filtered = rows.filter((r) => {
      const isFree = r.status.toLowerCase().includes("свобод");
      if (selectedTeacher !== "all" && r.teacher !== selectedTeacher) return false;
      if (selectedStatus === "free" && !isFree) return false;
      if (selectedStatus === "busy" && isFree) return false;
      return true;
    });

    tbody.innerHTML = filtered
      .map((r) => {
        const isFree = r.status.toLowerCase().includes("свобод");
        return `
          <tr>
            <td><span class="slot-code-pill">${r.slotId}</span></td>
            <td>
              <strong>${r.teacher}</strong>
              <div style="font-size: 0.75rem; color: var(--text-secondary);">${r.roleCompany} • Опыт: ${r.experience}</div>
              <div style="font-size: 0.73rem; color: var(--accent-secondary);">${r.stack}</div>
            </td>
            <td><strong>${r.course}</strong></td>
            <td><strong>${r.day}</strong><br/><span style="color: var(--text-secondary);">${r.time}</span></td>
            <td>${r.room}</td>
            <td>
              <span class="slot-status-badge ${isFree ? "free" : "busy"}">
                ${isFree ? "🟢 Свободно" : "🔴 Занято"}
              </span>
            </td>
            <td>
              ${
                isFree
                  ? `<button type="button" class="btn-book-slot" data-public-book-slot="${r.slotId}">Записаться в окно →</button>`
                  : `<span style="font-size: 0.8rem; color: var(--text-secondary);">Записан: <strong>${r.studentName}</strong></span>`
              }
            </td>
          </tr>
        `;
      })
      .join("");
  }

  function renderAll() {
    renderStats();
    renderCourses();
    renderTeachers();
    renderPublicScheduleTable();
    renderEvents();
    renderAdminPanel();
  }

  // ==========================================================
  // EVENT LISTENERS & INTERACTIONS
  // ==========================================================
  function initInteractions() {
    // Theme toggle button
    const themeToggle = document.getElementById("themeToggle");
    themeToggle?.addEventListener("click", () => {
      const next = currentTheme === "dark" ? "light" : "dark";
      applyTheme(next);
    });

    // Language switcher buttons
    document.querySelectorAll(".lang-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const lang = btn.getAttribute("data-lang");
        if (lang) applyLanguage(lang);
      });
    });

    // Mobile Menu Hamburger
    const mobileMenuBtn = document.getElementById("mobileMenuBtn");
    const mainNav = document.getElementById("mainNav");
    mobileMenuBtn?.addEventListener("click", () => {
      const isOpen = mainNav.classList.toggle("open");
      mobileMenuBtn.setAttribute("aria-expanded", String(isOpen));
    });
    mainNav?.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => mainNav.classList.remove("open"));
    });

    // Hero Media Switcher (Photo Gallery <-> Live Classroom Video)
    const tabPhoto = document.getElementById("tabPhotoMode");
    const tabVideo = document.getElementById("tabVideoMode");
    const photoView = document.getElementById("heroPhotoView");
    const videoView = document.getElementById("heroVideoView");
    const heroVideo = document.getElementById("heroClassroomVideo");
    const heroMediaToggleBtn = document.getElementById("heroMediaToggleBtn");

    function setHeroMediaMode(mode) {
      if (mode === "video") {
        tabPhoto?.classList.remove("active");
        tabVideo?.classList.add("active");
        photoView?.classList.remove("active");
        videoView?.classList.add("active");
        heroVideo?.play().catch(() => {});
      } else {
        tabVideo?.classList.remove("active");
        tabPhoto?.classList.add("active");
        videoView?.classList.remove("active");
        photoView?.classList.add("active");
        heroVideo?.pause();
      }
    }

    tabPhoto?.addEventListener("click", () => setHeroMediaMode("photo"));
    tabVideo?.addEventListener("click", () => setHeroMediaMode("video"));
    heroMediaToggleBtn?.addEventListener("click", () => {
      setHeroMediaMode("video");
      document.querySelector(".hero-media-card")?.scrollIntoView({ behavior: "smooth", block: "center" });
    });

    // Photo thumbnail switching in Hero
    const heroImg = document.getElementById("heroShowcaseImg");
    document.querySelectorAll(".thumb-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".thumb-btn").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        const src = btn.getAttribute("data-img");
        if (heroImg && src) heroImg.src = src;
      });
    });

    // Courses Filter Tabs
    document.querySelectorAll("#courseFilters .filter-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        document.querySelectorAll("#courseFilters .filter-btn").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        activeCourseFilter = btn.getAttribute("data-category") || "all";
        renderCourses();
      });
    });

    // Events Filter Tabs
    document.querySelectorAll("#eventFilters .filter-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        document.querySelectorAll("#eventFilters .filter-btn").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        activeEventFilter = btn.getAttribute("data-type") || "all";
        renderEvents();
      });
    });

    // Contact / Feedback Form Submission
    const feedbackForm = document.getElementById("feedbackForm");
    const formAlert = document.getElementById("formSuccessAlert");
    feedbackForm?.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("leadName").value.trim();
      const phone = document.getElementById("leadPhone").value.trim();
      const email = document.getElementById("leadEmail").value.trim();
      const course = document.getElementById("leadCourse").value;
      const message = document.getElementById("leadMessage").value.trim();

      if (!name || !phone) return;

      const now = new Date();
      const formattedDate = now.toLocaleDateString("ru-RU") + ", " + now.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });

      state.leads.unshift({
        id: "lead-" + Date.now(),
        name,
        phone,
        email,
        course,
        message,
        date: formattedDate,
        status: "new"
      });

      saveState();
      renderAdminPanel();
      feedbackForm.reset();

      if (formAlert) {
        formAlert.hidden = false;
        setTimeout(() => {
          formAlert.hidden = true;
        }, 6000);
      }
      showToast(t("form_success"));
    });

    // Admin Modal Open / Close
    const adminModal = document.getElementById("adminModal");
    const openAdminBtn = document.getElementById("openAdminBtn");
    const closeAdminBtn = document.getElementById("closeAdminBtn");

    function openAdmin() {
      adminModal?.classList.add("open");
      adminModal?.setAttribute("aria-hidden", "false");
      renderAdminPanel();
    }

    function closeAdmin() {
      adminModal?.classList.remove("open");
      adminModal?.setAttribute("aria-hidden", "true");
    }

    openAdminBtn?.addEventListener("click", openAdmin);
    closeAdminBtn?.addEventListener("click", closeAdmin);
    adminModal?.addEventListener("click", (e) => {
      if (e.target === adminModal) closeAdmin();
    });

    // Admin Sidebar Tabs
    document.querySelectorAll("[data-admin-tab]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const target = btn.getAttribute("data-admin-tab");
        document.querySelectorAll("[data-admin-tab]").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");

        document.querySelectorAll(".admin-pane").forEach((pane) => {
          pane.classList.toggle("active", pane.id === `pane-${target}`);
        });
      });
    });

    // Admin Event Delegation for Delete / Status toggle buttons
    adminModal?.addEventListener("click", (e) => {
      const target = e.target.closest("button");
      if (!target) return;

      // Toggle Lead Status
      const toggleLeadId = target.getAttribute("data-toggle-lead");
      if (toggleLeadId) {
        const lead = state.leads.find((l) => l.id === toggleLeadId);
        if (lead) {
          lead.status = lead.status === "new" ? "done" : "new";
          saveState();
          renderAdminPanel();
        }
        return;
      }

      // Delete Lead
      const delLeadId = target.getAttribute("data-delete-lead");
      if (delLeadId) {
        state.leads = state.leads.filter((l) => l.id !== delLeadId);
        saveState();
        renderAdminPanel();
        return;
      }

      // Delete Course
      const delCourseId = target.getAttribute("data-delete-course");
      if (delCourseId) {
        state.courses = state.courses.filter((c) => c.id !== delCourseId);
        saveState();
        renderAll();
        return;
      }

      // Delete Teacher
      const delTeacherId = target.getAttribute("data-delete-teacher");
      if (delTeacherId) {
        state.teachers = state.teachers.filter((tItem) => tItem.id !== delTeacherId);
        saveState();
        renderAll();
        return;
      }

      // Delete Event
      const delEventId = target.getAttribute("data-delete-event");
      if (delEventId) {
        state.events = state.events.filter((ev) => ev.id !== delEventId);
        saveState();
        renderAll();
        return;
      }
    });

    // Admin Add Course Form
    const adminCourseForm = document.getElementById("adminCourseForm");
    adminCourseForm?.addEventListener("submit", (e) => {
      e.preventDefault();
      const title = document.getElementById("newCourseTitle").value.trim();
      const category = document.getElementById("newCourseCategory").value;
      const duration = document.getElementById("newCourseDuration").value.trim();
      const price = document.getElementById("newCoursePrice").value.trim();
      const skills = document
        .getElementById("newCourseSkills")
        .value.split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      const desc = document.getElementById("newCourseDesc").value.trim();

      const icons = { dev: "💻", data: "🧠", design: "🎨", security: "🛡️" };

      state.courses.unshift({
        id: "course-" + Date.now(),
        category,
        icon: icons[category] || "🚀",
        title: { ru: title, uz: title, en: title },
        desc: { ru: desc, uz: desc, en: desc },
        duration: { ru: duration, uz: duration, en: duration },
        level: { ru: "Практический", uz: "Amaliy", en: "Practical" },
        price,
        skills
      });

      saveState();
      renderAll();
      adminCourseForm.reset();
      showToast("✅ Направление добавлено!");
    });

    // Admin Add Teacher Form
    const adminTeacherForm = document.getElementById("adminTeacherForm");
    adminTeacherForm?.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("newTeacherName").value.trim();
      const role = document.getElementById("newTeacherRole").value.trim();
      const company = document.getElementById("newTeacherCompany").value.trim();
      const exp = document.getElementById("newTeacherExp").value.trim();
      const stack = document
        .getElementById("newTeacherStack")
        .value.split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      const avatar =
        document.getElementById("newTeacherAvatar").value.trim() ||
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80";
      const bio = document.getElementById("newTeacherBio").value.trim();

      state.teachers.unshift({
        id: "teacher-" + Date.now(),
        name: { ru: name, uz: name, en: name },
        role: { ru: role, uz: role, en: role },
        company,
        experience: { ru: exp, uz: exp, en: exp },
        students: "350+",
        avatar,
        bio: { ru: bio, uz: bio, en: bio },
        stack
      });

      saveState();
      renderAll();
      adminTeacherForm.reset();
      showToast("✅ Преподаватель добавлен!");
    });

    // Admin Add Event Form
    const adminEventForm = document.getElementById("adminEventForm");
    adminEventForm?.addEventListener("submit", (e) => {
      e.preventDefault();
      const title = document.getElementById("newEventTitle").value.trim();
      const type = document.getElementById("newEventType").value;
      const tag = document.getElementById("newEventTag").value.trim();
      const date = document.getElementById("newEventDate").value.trim();
      const desc = document.getElementById("newEventDesc").value.trim();

      state.events.unshift({
        id: "event-" + Date.now(),
        type,
        date,
        image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=800&q=80",
        tag: { ru: tag, uz: tag, en: tag },
        title: { ru: title, uz: title, en: title },
        desc: { ru: desc, uz: desc, en: desc }
      });

      saveState();
      renderAll();
      adminEventForm.reset();
      showToast("✅ Событие опубликовано!");
    });

    // Reset Demo Data Button
    const resetDataBtn = document.getElementById("resetDataBtn");
    resetDataBtn?.addEventListener("click", () => {
      state = JSON.parse(JSON.stringify(INITIAL_DATA));
      saveState();
      renderAll();
      showToast("🔄 Демо-данные восстановлены!");
    });

    // ==========================================================
    // AI RAG ASSISTANT WIDGET & ADMIN RAG CONTROLS
    // ==========================================================
    const ragChatWindow = document.getElementById("ragChatWindow");
    const openRagChatBtn = document.getElementById("openRagChatBtn");
    const closeRagChatBtn = document.getElementById("closeRagChatBtn");
    const ragMessagesList = document.getElementById("ragMessagesList");
    const ragChatForm = document.getElementById("ragChatForm");
    const ragUserInput = document.getElementById("ragUserInput");
    const ragSendBtn = document.getElementById("ragSendBtn");
    const ragKeyToggleBtn = document.getElementById("ragKeyToggleBtn");
    const ragKeyDrawer = document.getElementById("ragKeyDrawer");
    const chatGeminiKeyInput = document.getElementById("chatGeminiKeyInput");
    const saveChatGeminiKeyBtn = document.getElementById("saveChatGeminiKeyBtn");
    const saveAdminGeminiKeyBtn = document.getElementById("saveAdminGeminiKeyBtn");
    const indexVectorsNowBtn = document.getElementById("indexVectorsNowBtn");

    let ragConversationHistory = [];

    function formatAssistantMarkdown(text) {
      return (text || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
        .replace(/\*(.+?)\*/g, "<em>$1</em>")
        .replace(/\n/g, "<br/>");
    }

    function appendRagMessage(role, text, meta = null) {
      if (!ragMessagesList) return;
      const msgDiv = document.createElement("div");
      msgDiv.className = `rag-msg ${role}`;

      let html = `<div>${role === "assistant" ? formatAssistantMarkdown(text) : text}</div>`;

      if (role === "assistant" && meta && Array.isArray(meta.retrievedChunks) && meta.retrievedChunks.length > 0) {
        const pills = meta.retrievedChunks
          .map((c) => `<span class="rag-source-pill">📄 ${c.title} (${c.similarityPercent}%)</span>`)
          .join("");
        html += `
          <div class="rag-msg-sources">
            <div><strong>${t("rag_sources_label")}</strong> • <code>${meta.model || "gemini-3.5-flash-lite"}</code></div>
            <div>${pills}</div>
          </div>
        `;
      }

      msgDiv.innerHTML = html;
      ragMessagesList.appendChild(msgDiv);
      ragMessagesList.scrollTop = ragMessagesList.scrollHeight;
    }

    function ensureWelcomeMessage() {
      if (!ragMessagesList || ragMessagesList.children.length > 0) return;
      appendRagMessage("assistant", t("rag_welcome"));
    }

    function syncApiKeyUI() {
      if (!window.GoodEduRAG) return;
      const key = window.GoodEduRAG.getStoredApiKey();
      if (chatGeminiKeyInput) chatGeminiKeyInput.value = key;
      const adminInput = document.getElementById("adminGeminiKeyInput");
      if (adminInput) adminInput.value = key;
      ragKeyToggleBtn?.classList.toggle("has-key", Boolean(key));
    }

    openRagChatBtn?.addEventListener("click", () => {
      const isOpen = ragChatWindow?.classList.toggle("open");
      ragChatWindow?.setAttribute("aria-hidden", String(!isOpen));
      ensureWelcomeMessage();
      syncApiKeyUI();
      if (isOpen) ragUserInput?.focus();
    });

    closeRagChatBtn?.addEventListener("click", () => {
      ragChatWindow?.classList.remove("open");
      ragChatWindow?.setAttribute("aria-hidden", "true");
    });

    ragKeyToggleBtn?.addEventListener("click", () => {
      if (!ragKeyDrawer) return;
      ragKeyDrawer.hidden = !ragKeyDrawer.hidden;
      syncApiKeyUI();
    });

    saveChatGeminiKeyBtn?.addEventListener("click", () => {
      if (!window.GoodEduRAG || !chatGeminiKeyInput) return;
      window.GoodEduRAG.setStoredApiKey(chatGeminiKeyInput.value);
      syncApiKeyUI();
      if (ragKeyDrawer) ragKeyDrawer.hidden = true;
      showToast("🔑 GEMINI_API_KEY сохранён для gemini-3.5-flash-lite!");
    });

    saveAdminGeminiKeyBtn?.addEventListener("click", () => {
      if (!window.GoodEduRAG) return;
      const adminInp = document.getElementById("adminGeminiKeyInput");
      const appsScriptInp = document.getElementById("cloudAppsScriptUrlInput");
      const priceDocInp = document.getElementById("cloudPriceDocIdInput");
      const faqDocInp = document.getElementById("cloudFaqDocIdInput");
      const sheetIdInp = document.getElementById("cloudScheduleSheetIdInput");
      const googleApiInp = document.getElementById("cloudGoogleApiKeyInput");

      if (adminInp) window.GoodEduRAG.setStoredApiKey(adminInp.value);
      window.GoodEduRAG.saveCloudConfig({
        appsScriptUrl: (appsScriptInp?.value || "").trim(),
        priceDocId: (priceDocInp?.value || "").trim(),
        faqDocId: (faqDocInp?.value || "").trim(),
        scheduleSheetId: (sheetIdInp?.value || "").trim(),
        googleCloudApiKey: (googleApiInp?.value || "").trim()
      });

      syncApiKeyUI();
      showToast("💾 Настройки Google Cloud (Docs .docx / Sheets .xlsx) и API ключ сохранены!");
    });

    // Sync Now with Google Cloud (Docs + Sheets)
    const syncGoogleCloudNowBtn = document.getElementById("syncGoogleCloudNowBtn");
    syncGoogleCloudNowBtn?.addEventListener("click", async () => {
      if (!window.GoodEduRAG) return;
      const statusText = document.getElementById("ragIndexStatusText");
      if (statusText) statusText.textContent = "⏳ Синхронизация с Google Docs (.docx) и Google Sheets (.xlsx)...";
      try {
        const res = await window.GoodEduRAG.syncWithGoogleCloud();
        renderAll();
        if (statusText) {
          statusText.textContent = `✅ Синхронизировано в ${res.lastSyncTime}: ${res.chunksCount} RAG-чанков, ${res.freeSlotsCount} свободных окон из ${res.slotsCount}.`;
        }
        showToast("🔄 Свежие данные из Google Docs / Sheets загружены!");
      } catch (err) {
        if (statusText) statusText.textContent = "⚠️ Ошибка синхронизации: " + err.message;
      }
    });

    // Export Live Schedule CSV
    document.getElementById("exportLiveScheduleCsvBtn")?.addEventListener("click", () => {
      window.GoodEduRAG?.downloadLiveScheduleCsv();
      showToast("📥 Актуальная таблица расписания со всеми записями студентов выгружена!");
    });

    // Reset Schedule Slots
    document.getElementById("resetScheduleTableBtn")?.addEventListener("click", () => {
      window.GoodEduRAG?.resetScheduleTable();
      renderAll();
      showToast("🔄 Таблица расписания преподавателей сброшена к исходным слотам!");
    });

    // Admin Quick Book Student Form
    const adminQuickBookForm = document.getElementById("adminQuickBookForm");
    adminQuickBookForm?.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!window.GoodEduRAG) return;
      const slotId = document.getElementById("adminBookSlotSelect")?.value;
      const studentName = document.getElementById("adminBookStudentName")?.value.trim();
      const studentPhone = document.getElementById("adminBookStudentPhone")?.value.trim();
      if (!slotId || !studentName || !studentPhone) return;

      const res = await window.GoodEduRAG.bookStudentIntoSlot({
        slotId,
        studentName,
        studentPhone,
        comment: "Записан через Админ-панель"
      });

      if (res.ok) {
        adminQuickBookForm.reset();
        renderAll();
        showToast(`✅ Студент ${studentName} записан в окно ${slotId}!`);
      } else {
        showToast("⚠️ " + res.error);
      }
    });

    // Admin Table Free / Book button delegation
    document.getElementById("adminScheduleTbody")?.addEventListener("click", async (e) => {
      const freeBtn = e.target.closest("[data-admin-free-slot]");
      if (freeBtn && window.GoodEduRAG) {
        const slotId = freeBtn.getAttribute("data-admin-free-slot");
        await window.GoodEduRAG.freeBookedSlot(slotId);
        renderAll();
        showToast(`🟢 Окно ${slotId} снова свободно для записи!`);
        return;
      }

      const bookBtn = e.target.closest("[data-admin-book-slot]");
      if (bookBtn) {
        const slotId = bookBtn.getAttribute("data-admin-book-slot");
        const sel = document.getElementById("adminBookSlotSelect");
        if (sel) sel.value = slotId;
        document.getElementById("adminBookStudentName")?.focus();
      }
    });

    // Public Schedule Table Filters & "Записаться в окно" button (opens AI Agent with pre-filled booking command)
    document.getElementById("publicScheduleTeacherFilter")?.addEventListener("change", renderPublicScheduleTable);
    document.getElementById("publicScheduleStatusFilter")?.addEventListener("change", renderPublicScheduleTable);

    document.getElementById("publicScheduleTbody")?.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-public-book-slot]");
      if (!btn || !window.GoodEduRAG) return;
      const slotId = btn.getAttribute("data-public-book-slot");
      const slot = window.GoodEduRAG.getScheduleTable().find((s) => s.slotId === slotId);
      if (!slot) return;

      // Open AI RAG Assistant and prefill booking request so user can either send or enter their name
      ragChatWindow?.classList.add("open");
      ragChatWindow?.setAttribute("aria-hidden", "false");
      ensureWelcomeMessage();
      if (ragUserInput) {
        ragUserInput.value = `Запиши меня в ${slot.slotId} (${slot.teacher}, ${slot.day} ${slot.time}), меня зовут Тимур Каримов, телефон +998 90 123-45-67`;
        ragUserInput.focus();
      }
    });

    // Listen for live booking events from the AI Agent so Leads & Tables update automatically
    window.addEventListener("goodedu:slot-booked", (ev) => {
      const slot = ev.detail?.slot;
      if (slot) {
        const now = new Date();
        const formattedDate =
          now.toLocaleDateString("ru-RU") +
          ", " +
          now.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });

        state.leads.unshift({
          id: "lead-" + Date.now(),
          name: slot.studentName,
          phone: slot.studentPhone,
          email: "",
          course: `${slot.course} (${slot.teacher})`,
          message: `[AI Запись в Excel: ${slot.slotId}] ${slot.day}, ${slot.time} (${slot.room})`,
          date: formattedDate,
          status: "new"
        });
        saveState();
      }
      renderAll();
    });

    window.addEventListener("goodedu:schedule-updated", () => {
      renderAll();
    });

    // Background polling every 30s if Google Cloud URL/IDs are configured
    setInterval(async () => {
      if (!window.GoodEduRAG) return;
      const cfg = window.GoodEduRAG.getCloudConfig();
      if (cfg.appsScriptUrl || cfg.priceDocId || cfg.faqDocId || cfg.scheduleSheetId) {
        try {
          const res = await window.GoodEduRAG.syncWithGoogleCloud();
          if (res.updated) renderAll();
        } catch (e) {}
      }
    }, 30000);

    indexVectorsNowBtn?.addEventListener("click", async () => {
      if (!window.GoodEduRAG) return;
      const key = window.GoodEduRAG.getStoredApiKey();
      if (!key) {
        showToast("⚠️ Сначала укажите GEMINI_API_KEY из Google AI Studio!");
        return;
      }
      const statusText = document.getElementById("ragIndexStatusText");
      if (statusText) statusText.textContent = "⏳ Векторизация 17 чанков через gemini-embedding-001...";
      try {
        await window.GoodEduRAG.indexKnowledgeChunks(window.GoodEduRAG.GOOD_EDU_RAG_CHUNKS);
        renderAdminPanel();
        if (statusText) {
          statusText.textContent = "✅ Все чанки успешно векторизованы (gemini-embedding-001, 3072 измерений)!";
        }
        showToast("✅ База знаний векторизована через Google AI Studio!");
      } catch (err) {
        if (statusText) statusText.textContent = "❌ Ошибка векторизации: " + err.message;
      }
    });

    async function handleUserRagQuery(queryText) {
      const trimmed = (queryText || "").trim();
      if (!trimmed || !window.GoodEduRAG) return;

      ensureWelcomeMessage();
      appendRagMessage("user", trimmed);
      ragConversationHistory.push({ role: "user", text: trimmed });

      if (ragUserInput) ragUserInput.value = "";
      if (ragSendBtn) ragSendBtn.disabled = true;

      // Temporary loading indicator
      const loadingDiv = document.createElement("div");
      loadingDiv.className = "rag-msg assistant";
      loadingDiv.textContent = "🔎 Поиск в векторной базе RAG (gemini-embedding-001) и генерация ответа (gemini-3.5-flash-lite)...";
      ragMessagesList?.appendChild(loadingDiv);
      if (ragMessagesList) ragMessagesList.scrollTop = ragMessagesList.scrollHeight;

      try {
        const result = await window.GoodEduRAG.askGeminiWithRAG({
          userMessage: trimmed,
          knowledgeBase: window.GoodEduRAG.GOOD_EDU_RAG_CHUNKS,
          chatHistory: ragConversationHistory
        });

        loadingDiv.remove();
        appendRagMessage("assistant", result.answer, result);
        ragConversationHistory.push({ role: "assistant", text: result.answer });
        renderAdminPanel();
      } catch (err) {
        loadingDiv.remove();
        appendRagMessage("assistant", "Произошла ошибка при обращении к RAG-движку: " + err.message);
      } finally {
        if (ragSendBtn) ragSendBtn.disabled = false;
      }
    }

    ragChatForm?.addEventListener("submit", (e) => {
      e.preventDefault();
      handleUserRagQuery(ragUserInput?.value);
    });

    document.querySelectorAll("[data-rag-prompt]").forEach((chip) => {
      chip.addEventListener("click", () => {
        const promptText = chip.getAttribute("data-rag-prompt") || chip.textContent;
        handleUserRagQuery(promptText);
      });
    });

    ensureWelcomeMessage();
    syncApiKeyUI();
  }

  // Initialize on DOMContentLoaded
  document.addEventListener("DOMContentLoaded", async () => {
    applyTheme(currentTheme);
    initInteractions();
    applyLanguage(currentLang);

    // Immediately pull live data from the connected Google Docs & Google Sheet
    if (window.GoodEduRAG) {
      try {
        const res = await window.GoodEduRAG.syncWithGoogleCloud();
        if (res.updated) {
          renderAll();
          const statusText = document.getElementById("ragIndexStatusText");
          if (statusText) {
            statusText.textContent = `✅ Подключено к Google Docs & Sheets (${res.lastSyncTime}): ${res.chunksCount} чанков, ${res.freeSlotsCount} свободных окон.`;
          }
        }
      } catch (e) {
        console.warn("Initial Google Cloud sync notice:", e);
      }
    }
  });
})();

