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

const positions = [
  { cohort: "graduate", org: "institute", field: "数据", title: "大模型预训练数据算法研究", id: 8726 },
  { cohort: "graduate", org: "institute", field: "具身智能", title: "具身智能基础模型研究", id: 6073 },
  { cohort: "graduate", org: "institute", field: "具身智能", title: "具身智能导航模型研究", id: 8730 },
  { cohort: "graduate", org: "institute", field: "具身智能", title: "具身移动操作基础模型研究", id: 8752 },
  { cohort: "graduate", org: "institute", field: "具身智能", title: "具身仿真与世界模型研究", id: 8720 },
  { cohort: "graduate", org: "institute", field: "多模态", title: "多模态理解与生成模型设计与优化", id: 6037 },
  { cohort: "graduate", org: "institute", field: "语音/数字人", title: "多模态语音交互基础大模型算法研究", id: 8764 },
  { cohort: "graduate", org: "institute", field: "大模型", title: "基础大语言模型", id: 6039 },
  { cohort: "graduate", org: "technology", field: "智能体", title: "代码智能化算法与应用", id: 6027 },
  { cohort: "graduate", org: "technology", field: "语音/数字人", title: "语音驱动下的数字人唇形、表情和肢体动作一体化视频生成研究与应用", id: 8780 },
  { cohort: "graduate", org: "technology", field: "多模态", title: "OmniDialogue：全模态理解和语音对话大模型探索研究", id: 8742 },
  { cohort: "graduate", org: "technology", field: "智能体", title: "角色扮演、代理行为及对抗博弈在 LLM 中的应用探索", id: 8738 },
  { cohort: "graduate", org: "technology", field: "具身智能", title: "复杂几何空间与动态交互场景的移动避障导航算法研究", id: 8776 },
  { cohort: "graduate", org: "technology", field: "具身智能", title: "家庭场景下通用操作能力的具身算法研究", id: 8671 },
  { cohort: "graduate", org: "technology", field: "具身智能", title: "机器人移动操作全身协同控制算法研究", id: 8624 },
  { cohort: "graduate", org: "technology", field: "具身智能", title: "具身机器人全模态 Agentic 系统设计与后训练研究", id: 8645 },
  { cohort: "graduate", org: "technology", field: "AI Infra", title: "大模型云服务推理优化算法研究", id: 8755 },
  { cohort: "graduate", org: "technology", field: "AI Infra", title: "大模型云端 AI Infra 技术创新与探索", id: 8772 },
  { cohort: "graduate", org: "technology", field: "AI Infra", title: "高性能大模型密态训推算法研究", id: 8732 },
  { cohort: "intern", org: "institute", field: "多模态", title: "多模态理解大模型全流程架构探索", id: 8974 },
  { cohort: "intern", org: "institute", field: "具身智能", title: "世界模型与视频生成时空建模研究", id: 8968 },
  { cohort: "intern", org: "institute", field: "语音/数字人", title: "音频大模型全链路交互架构前沿研究", id: 8868 },
  { cohort: "intern", org: "institute", field: "大模型", title: "千亿级大语言模型架构与分布式研究", id: 8881 },
  { cohort: "intern", org: "institute", field: "具身智能", title: "具身智能训练数据评估与配方探索", id: 8942 },
  { cohort: "intern", org: "institute", field: "具身智能", title: "具身移动操作基础模型与泛化控制探索", id: 8940 },
  { cohort: "intern", org: "institute", field: "具身智能", title: "具身仿真数据合成与世界模型探索", id: 8946 },
  { cohort: "intern", org: "institute", field: "具身智能", title: "VLA 模型与通用具身导航架构研究", id: 8932 },
  { cohort: "intern", org: "institute", field: "具身智能", title: "具身世界模型与通用 VLA 大脑架构探索", id: 8795 },
  { cohort: "intern", org: "institute", field: "数据", title: "多模态大模型高质量数据体系研究", id: 8991 },
  { cohort: "intern", org: "institute", field: "数据", title: "多源异构数据的大模型持续预训练算法研究", id: 8996 },
  { cohort: "intern", org: "technology", field: "AI Infra", title: "大模型高吞吐低延迟推理引擎研发", id: 8841 },
  { cohort: "intern", org: "technology", field: "AI Infra", title: "大模型训练与 RL Infra 创新探索研究", id: 8851 },
  { cohort: "intern", org: "technology", field: "智能体", title: "角色扮演、代理行为及对抗博弈在 LLM 中的应用探索", id: 8847 },
  { cohort: "intern", org: "technology", field: "语音/数字人", title: "语音驱动下的数字人唇形、表情和肢体动作一体化视频生成研究与应用", id: 8858 },
  { cohort: "intern", org: "technology", field: "多模态", title: "OmniDialogue：全模态理解和语音对话大模型探索研究", id: 8855 },
  { cohort: "intern", org: "technology", field: "智能体", title: "CodeAI 代码大模型全链路与推理优化", id: 8883 },
  { cohort: "intern", org: "technology", field: "具身智能", title: "空间智能增强的具身端到端操作大模型探索研究", id: 8798 },
  { cohort: "intern", org: "technology", field: "具身智能", title: "机器人移动操作全身协同控制算法研究", id: 8805 },
  { cohort: "intern", org: "technology", field: "具身智能", title: "复杂几何空间与动态交互场景的移动避障导航算法研究", id: 8811 },
];

const positionList = document.querySelector("#position-list");

if (positionList) {
  const positionCount = document.querySelector("#position-count");
  const pageLabel = document.querySelector("#position-page");
  const previousButton = document.querySelector("#position-prev");
  const nextButton = document.querySelector("#position-next");
  const searchInput = document.querySelector("#position-search");
  const state = { cohort: "graduate", org: "all", field: "all", query: "", page: 1 };
  const pageSize = 8;
  const orgLabels = { institute: "探索研究院", technology: "京东科技" };

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
            <span class="position-org">${orgLabels[position.org]}</span>
            <div class="position-copy">
              <h3>${position.title}</h3>
              <span class="position-field">${position.field}</span>
            </div>
            <a
              class="apply-link"
              href="https://campus.jd.com/#/details?id=${position.id}"
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
      renderPositions();
    });
  });

  document.querySelectorAll("[data-org]").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll("[data-org]").forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      state.org = button.dataset.org;
      state.page = 1;
      renderPositions();
    });
  });

  document.querySelectorAll("[data-field]").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll("[data-field]").forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      state.field = button.dataset.field;
      state.page = 1;
      renderPositions();
    });
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

  renderPositions();
}
