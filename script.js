const siteContent = window.SITE_CONTENT || {};

function getSiteContent(path) {
  return path.split(".").reduce((value, key) => value?.[key], siteContent);
}

document.querySelectorAll("[data-content]").forEach((element) => {
  const value = getSiteContent(element.dataset.content);
  if (typeof value === "string") element.textContent = value;
});

document.querySelectorAll("[data-href]").forEach((element) => {
  const value = getSiteContent(element.dataset.href);
  if (typeof value === "string") element.setAttribute("href", value);
});

document.querySelectorAll("[data-src]").forEach((element) => {
  const value = getSiteContent(element.dataset.src);
  if (typeof value === "string") element.setAttribute("src", value);
});

document.querySelectorAll("[data-alt]").forEach((element) => {
  const value = getSiteContent(element.dataset.alt);
  if (typeof value === "string") element.setAttribute("alt", value);
});

document.querySelectorAll("[data-placeholder]").forEach((element) => {
  const value = getSiteContent(element.dataset.placeholder);
  if (typeof value === "string") element.setAttribute("placeholder", value);
});

const experienceList = document.querySelector("#experience-list");

if (experienceList) {
  const experiences = siteContent.aboutMe?.experience?.items || [];

  experiences.forEach((experience) => {
    const item = document.createElement("article");
    item.className = "experience-item";

    const period = document.createElement("p");
    period.className = "experience-period";
    period.textContent = experience.period;

    const body = document.createElement("div");
    body.className = "experience-body";

    const company = document.createElement("p");
    company.className = "experience-company";
    company.textContent = experience.company;

    const title = document.createElement("h3");
    title.textContent = experience.title;

    const description = document.createElement("p");
    description.className = "experience-description";
    description.textContent = experience.description;

    const tags = document.createElement("div");
    tags.className = "experience-tags";
    (experience.tags || []).forEach((tag) => {
      const tagElement = document.createElement("span");
      tagElement.textContent = tag;
      tags.append(tagElement);
    });

    body.append(company, title, description, tags);
    item.append(period, body);
    experienceList.append(item);
  });
}

const educationList = document.querySelector("#education-list");

if (educationList) {
  const educationItems = siteContent.aboutMe?.education?.items || [];

  educationItems.forEach((education) => {
    const item = document.createElement("article");
    item.className = "education-item";

    const period = document.createElement("span");
    period.className = "education-period";
    period.textContent = education.period;

    const school = document.createElement("strong");
    school.textContent = education.school;

    const description = document.createElement("span");
    description.className = "education-description";
    description.textContent = education.description;

    item.append(period, school, description);
    educationList.append(item);
  });
}

const aboutMeContact = document.querySelector("#about-me-contact");

if (aboutMeContact) {
  const contactItems = siteContent.aboutMe?.contact?.items || [];

  contactItems.forEach((contact) => {
    const item = document.createElement(contact.href ? "a" : "div");
    item.className = `about-me-contact-card${contact.href ? " clickable" : ""}`;

    if (contact.href) {
      item.href = contact.href;
      if (/^https?:/i.test(contact.href)) {
        item.target = "_blank";
        item.rel = "noreferrer";
      }
    }

    const label = document.createElement("span");
    label.textContent = contact.label;
    const value = document.createElement("strong");
    value.textContent = contact.value;
    item.append(label, value);
    aboutMeContact.append(item);
  });
}

const root = document.documentElement;
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const themeToggle = document.querySelector(".theme-toggle");
const themeMeta = document.querySelector('meta[name="theme-color"]');
const savedTheme = localStorage.getItem("sherry-theme");

function setTheme(theme) {
  const isDark = theme === "dark";
  const isTgtPage = document.body.classList.contains("tgt-page");
  root.classList.toggle("dark", isDark);
  themeToggle?.setAttribute("aria-label", isDark ? "切换浅色模式" : "切换深色模式");
  themeMeta?.setAttribute("content", isDark || isTgtPage ? "#101314" : "#f3f1ec");
}

setTheme(savedTheme || "light");

themeToggle?.addEventListener("click", () => {
  const nextTheme = root.classList.contains("dark") ? "light" : "dark";
  localStorage.setItem("sherry-theme", nextTheme);
  setTheme(nextTheme);
});

document.querySelectorAll("[data-year]").forEach((element) => {
  element.textContent = new Date().getFullYear();
});

const menuToggle = document.querySelector(".menu-toggle");
const mobileNav = document.querySelector(".mobile-nav");

function closeMenu() {
  document.body.classList.remove("menu-open");
  menuToggle?.setAttribute("aria-expanded", "false");
  menuToggle?.setAttribute("aria-label", "打开导航");
}

menuToggle?.addEventListener("click", () => {
  const isOpen = document.body.classList.toggle("menu-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "关闭导航" : "打开导航");
});

mobileNav?.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));

const revealElements = document.querySelectorAll(".reveal");

if (reduceMotion || !("IntersectionObserver" in window)) {
  revealElements.forEach((element) => element.classList.add("visible"));
} else {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 },
  );

  revealElements.forEach((element, index) => {
    element.style.transitionDelay = `${Math.min(index % 4, 3) * 70}ms`;
    revealObserver.observe(element);
  });
}

const cursorLight = document.querySelector(".cursor-light");

if (cursorLight && window.matchMedia("(pointer: fine)").matches) {
  window.addEventListener("pointermove", (event) => {
    cursorLight.style.left = `${event.clientX}px`;
    cursorLight.style.top = `${event.clientY}px`;
  });
}

const tiltStage = document.querySelector("[data-tilt]");
const tiltFrame = tiltStage?.querySelector(".portrait-frame");

if (tiltStage && tiltFrame && !reduceMotion && window.matchMedia("(pointer: fine)").matches) {
  tiltStage.addEventListener("pointermove", (event) => {
    const bounds = tiltStage.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    tiltFrame.style.transform = `rotate(2.2deg) rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`;
  });

  tiltStage.addEventListener("pointerleave", () => {
    tiltFrame.style.transform = "rotate(2.2deg) rotateY(0) rotateX(0)";
  });
}

document.querySelectorAll(".magnetic").forEach((button) => {
  if (reduceMotion || !window.matchMedia("(pointer: fine)").matches) return;

  button.addEventListener("pointermove", (event) => {
    const bounds = button.getBoundingClientRect();
    const x = event.clientX - bounds.left - bounds.width / 2;
    const y = event.clientY - bounds.top - bounds.height / 2;
    button.style.transform = `translate(${x * 0.08}px, ${y * 0.12}px)`;
  });

  button.addEventListener("pointerleave", () => {
    button.style.transform = "translate(0, 0)";
  });
});

const dragRail = document.querySelector("[data-drag-scroll]");

if (dragRail) {
  let isDragging = false;
  let suppressClick = false;
  let startX = 0;
  let startScroll = 0;

  dragRail.addEventListener("pointerdown", (event) => {
    isDragging = true;
    suppressClick = false;
    startX = event.clientX;
    startScroll = dragRail.scrollLeft;
    dragRail.classList.add("dragging");
    dragRail.setPointerCapture(event.pointerId);
  });

  dragRail.addEventListener("pointermove", (event) => {
    if (!isDragging) return;
    const distance = event.clientX - startX;
    suppressClick = Math.abs(distance) > 6;
    dragRail.scrollLeft = startScroll - distance;
  });

  function stopDragging() {
    isDragging = false;
    dragRail.classList.remove("dragging");
    window.setTimeout(() => {
      suppressClick = false;
    }, 0);
  }

  dragRail.addEventListener("pointerup", stopDragging);
  dragRail.addEventListener("pointercancel", stopDragging);
  dragRail.addEventListener(
    "click",
    (event) => {
      if (suppressClick) event.preventDefault();
    },
    true,
  );
}

const modelVideos = document.querySelectorAll(".model-media video");

if (modelVideos.length) {
  const videoObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.play().catch(() => {});
        } else {
          entry.target.pause();
        }
      });
    },
    { threshold: 0.35 },
  );

  modelVideos.forEach((video) => videoObserver.observe(video));
}

const workTabs = document.querySelectorAll("[data-work-tab]");
const workPanels = document.querySelectorAll("[data-work-panel]");

workTabs.forEach((button) => {
  button.addEventListener("click", () => {
    const target = button.dataset.workTab;
    workTabs.forEach((tab) => tab.classList.toggle("active", tab === button));
    workPanels.forEach((panel) => {
      const isActive = panel.dataset.workPanel === target;
      panel.hidden = !isActive;
      if (isActive) {
        panel.querySelectorAll(".reveal").forEach((element) => element.classList.add("visible"));
      }
    });
  });
});

const canvas = document.querySelector("#tgt-network");

if (canvas) {
  const context = canvas.getContext("2d");
  let width = 0;
  let height = 0;
  let particles = [];
  let animationFrame = 0;
  const pointer = { x: -1000, y: -1000 };

  function resizeCanvas() {
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    canvas.width = width * pixelRatio;
    canvas.height = height * pixelRatio;
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    const particleCount = width < 720 ? 30 : 58;
    particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.28,
      vy: (Math.random() - 0.5) * 0.28,
      radius: Math.random() * 1.5 + 0.5,
    }));
  }

  function drawNetwork() {
    context.clearRect(0, 0, width, height);

    particles.forEach((particle, index) => {
      if (!reduceMotion) {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0 || particle.x > width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > height) particle.vy *= -1;

        const pointerDistance = Math.hypot(particle.x - pointer.x, particle.y - pointer.y);
        if (pointerDistance < 130) {
          particle.x += (particle.x - pointer.x) * 0.008;
          particle.y += (particle.y - pointer.y) * 0.008;
        }
      }

      context.beginPath();
      context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      context.fillStyle = index % 9 === 0 ? "rgba(255,74,63,.78)" : "rgba(255,255,255,.38)";
      context.fill();

      for (let nextIndex = index + 1; nextIndex < particles.length; nextIndex += 1) {
        const next = particles[nextIndex];
        const distance = Math.hypot(particle.x - next.x, particle.y - next.y);
        if (distance < 130) {
          context.beginPath();
          context.moveTo(particle.x, particle.y);
          context.lineTo(next.x, next.y);
          context.strokeStyle = `rgba(255,255,255,${0.12 * (1 - distance / 130)})`;
          context.stroke();
        }
      }
    });

    if (!reduceMotion) animationFrame = requestAnimationFrame(drawNetwork);
  }

  canvas.addEventListener("pointermove", (event) => {
    const bounds = canvas.getBoundingClientRect();
    pointer.x = event.clientX - bounds.left;
    pointer.y = event.clientY - bounds.top;
  });

  canvas.addEventListener("pointerleave", () => {
    pointer.x = -1000;
    pointer.y = -1000;
  });

  window.addEventListener("resize", () => {
    cancelAnimationFrame(animationFrame);
    resizeCanvas();
    drawNetwork();
  });

  resizeCanvas();
  drawNetwork();
}

const positions = window.TGT_POSITIONS || [];

const openPositionTotal = document.querySelector("#open-position-total");
const departmentTotal = document.querySelector("#department-total");
const directionTotal = document.querySelector("#direction-total");

if (openPositionTotal) openPositionTotal.textContent = String(positions.length).padStart(2, "0");
if (departmentTotal) departmentTotal.textContent = String(new Set(positions.map(({ org }) => org)).size).padStart(2, "0");
if (directionTotal) directionTotal.textContent = String(new Set(positions.map(({ field }) => field)).size).padStart(2, "0");

const positionList = document.querySelector("#position-list");

if (positionList) {
  const positionCount = document.querySelector("#position-count");
  const pageLabel = document.querySelector("#position-page");
  const previousButton = document.querySelector("#position-prev");
  const nextButton = document.querySelector("#position-next");
  const searchInput = document.querySelector("#position-search");
  const fieldFilters = document.querySelector(".field-filters");
  const state = { cohort: "graduate", org: "all", field: "all", query: "", page: 1 };
  const pageSize = 8;
  const fieldOrder = ["大模型", "具身智能", "多模态", "AI Infra", "智能体", "语音/数字人", "数据"];
  const orgLabels = {
    institute: getSiteContent("about.positions.institute") || "探索研究院",
    technology: getSiteContent("about.positions.technology") || "京东科技",
  };
  const positionBaseUrl = getSiteContent("links.campusPositionBase") || "https://campus.jd.com/#/details?id=";

  function renderFieldFilters() {
    if (!fieldFilters) return;

    const matchingPositions = positions.filter(
      (position) => position.cohort === state.cohort && (state.org === "all" || position.org === state.org),
    );
    const availableFields = [...new Set(matchingPositions.map((position) => position.field).filter(Boolean))].sort((first, second) => {
      const firstIndex = fieldOrder.indexOf(first);
      const secondIndex = fieldOrder.indexOf(second);
      const firstRank = firstIndex === -1 ? fieldOrder.length : firstIndex;
      const secondRank = secondIndex === -1 ? fieldOrder.length : secondIndex;
      return firstRank - secondRank || first.localeCompare(second, "zh-CN");
    });

    if (state.field !== "all" && !availableFields.includes(state.field)) state.field = "all";

    const buttons = ["all", ...availableFields].map((field) => {
      const button = document.createElement("button");
      button.type = "button";
      button.dataset.field = field;
      button.textContent = field === "all" ? getSiteContent("about.positions.allDirections") || "全部方向" : field;
      button.classList.toggle("active", state.field === field);
      return button;
    });

    fieldFilters.replaceChildren(...buttons);
  }

  function renderPositions() {
    const filtered = positions.filter((position) => {
      const matchesCohort = position.cohort === state.cohort;
      const matchesOrg = state.org === "all" || position.org === state.org;
      const matchesField = state.field === "all" || position.field === state.field;
      const matchesQuery = position.title.toLowerCase().includes(state.query);
      return matchesCohort && matchesOrg && matchesField && matchesQuery;
    });

    const pageTotal = Math.max(1, Math.ceil(filtered.length / pageSize));
    state.page = Math.min(state.page, pageTotal);
    const visiblePositions = filtered.slice((state.page - 1) * pageSize, state.page * pageSize);

    positionCount.textContent = String(filtered.length).padStart(2, "0");
    pageLabel.textContent = `${state.page} / ${pageTotal}`;
    previousButton.disabled = state.page === 1;
    nextButton.disabled = state.page === pageTotal;

    if (!filtered.length) {
      positionList.innerHTML = '<p class="no-results">暂时没有匹配的课题，试试其他关键词或筛选条件。</p>';
      return;
    }

    positionList.innerHTML = visiblePositions
      .map(
        (position) => `
          <article class="position-item">
            <span class="position-org org-${position.org}">${orgLabels[position.org]}</span>
            <div class="position-copy">
              <h3>${position.title}</h3>
              <span class="position-field" data-position-field="${position.field}">${position.field}</span>
            </div>
            <a
              class="apply-link"
              href="${positionBaseUrl}${position.id}"
              target="_blank"
              rel="noreferrer"
              aria-label="申请：${position.title}"
            >↗</a>
          </article>
        `,
      )
      .join("");
  }

  document.querySelectorAll("[data-cohort]").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll("[data-cohort]").forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      state.cohort = button.dataset.cohort;
      state.page = 1;
      renderFieldFilters();
      renderPositions();
    });
  });

  document.querySelectorAll("[data-org]").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll("[data-org]").forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      state.org = button.dataset.org;
      state.page = 1;
      renderFieldFilters();
      renderPositions();
    });
  });

  fieldFilters?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-field]");
    if (!button || !fieldFilters.contains(button)) return;
    state.field = button.dataset.field;
    state.page = 1;
    renderFieldFilters();
    renderPositions();
  });

  searchInput.addEventListener("input", () => {
    state.query = searchInput.value.trim().toLowerCase();
    state.page = 1;
    renderPositions();
  });

  previousButton.addEventListener("click", () => {
    state.page -= 1;
    renderPositions();
  });

  nextButton.addEventListener("click", () => {
    state.page += 1;
    renderPositions();
  });

  renderFieldFilters();
  renderPositions();
}
