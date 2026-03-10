document.addEventListener("DOMContentLoaded", () => {
  WWUI.initBase();

  const yearEl = WWUI.qs("#yearNow");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  const hero = WWData.getHero();
  const heroBadge = WWUI.qs("#heroBadge");
  const heroLine1 = WWUI.qs("#heroLine1");
  const heroLine2 = WWUI.qs("#heroLine2");
  const heroSub = WWUI.qs("#heroSub");
  const heroCta = WWUI.qs("#heroCta");

  if (heroBadge) heroBadge.textContent = hero.badge;
  if (heroLine1) heroLine1.textContent = hero.line1;
  if (heroLine2) heroLine2.textContent = hero.line2;
  if (heroSub) heroSub.textContent = hero.sub;
  if (heroCta) heroCta.textContent = hero.cta;

  WWUI.qsa("[data-jump]").forEach((button) => {
    button.addEventListener("click", () => {
      const target = document.getElementById(button.dataset.jump || "");
      if (!target) return;
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  const newsletter = WWUI.qs("#newsletterForm");
  newsletter?.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = WWUI.qs("#newsletterEmail")?.value.trim();
    if (!email || !email.includes("@")) {
      WWUI.showToast("Please enter a valid email to join the launch list.");
      return;
    }
    newsletter.reset();
    WWUI.showToast("You are in. Next release preview is on the way.");
  });

  initLookbook();
  initConcierge();
  initHeroParticles();
});

function initLookbook() {
  const mainImg = WWUI.qs("#lookbookMain");
  const captionEl = WWUI.qs("#lookbookCaption");
  const thumbWrap = WWUI.qs("#lookbookThumbs");
  if (!mainImg || !captionEl || !thumbWrap) {
    return;
  }

  const thumbs = WWUI.qsa(".lookbook-thumb", thumbWrap);
  if (!thumbs.length) {
    return;
  }

  let index = thumbs.findIndex((thumb) => thumb.classList.contains("is-active"));
  if (index < 0) index = 0;
  let timer = null;

  function activate(next) {
    index = (next + thumbs.length) % thumbs.length;
    const active = thumbs[index];
    if (!active) return;

    thumbs.forEach((thumb, idx) => {
      thumb.classList.toggle("is-active", idx === index);
    });

    const src = active.dataset.lookbookSrc || "";
    const caption = active.dataset.lookbookCaption || "";

    if (src) {
      mainImg.classList.add("is-switching");
      setTimeout(() => {
        mainImg.src = src;
        mainImg.classList.remove("is-switching");
      }, 140);
    }

    if (caption) {
      captionEl.textContent = caption;
    }
  }

  thumbs.forEach((thumb, idx) => {
    thumb.addEventListener("click", () => {
      activate(idx);
      restartAuto();
    });
  });

  function restartAuto() {
    clearInterval(timer);
    timer = setInterval(() => {
      if (document.hidden) return;
      activate(index + 1);
    }, 4200);
  }

  thumbWrap.addEventListener("mouseenter", () => clearInterval(timer));
  thumbWrap.addEventListener("mouseleave", restartAuto);

  activate(index);
  restartAuto();
}

function initConcierge() {
  const form = WWUI.qs("#conciergeForm");
  const result = WWUI.qs("#conciergeResult");
  if (!form || !result) {
    return;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const age = WWUI.qs("#ccAge")?.value || "";
    const mood = WWUI.qs("#ccMood")?.value || "";
    const budget = WWUI.qs("#ccBudget")?.value || "";

    if (!age || !mood || !budget) {
      WWUI.showToast("Please select all options to get a recommendation.");
      return;
    }

    const rec = buildRecommendation(age, mood, budget);

    localStorage.setItem("ww_pref", JSON.stringify({
      category: rec.category,
      search: rec.search,
      age,
      mood,
      budget,
      createdAt: new Date().toISOString()
    }));

    const url = `woolywonders.html#catalog`;

    result.hidden = false;
    result.classList.add("is-in");
    result.innerHTML = `
      <div class="concierge-result-head">Top Match: ${rec.title}</div>
      <p>${rec.copy}</p>
      <div class="concierge-tags">
        <span class="chip is-active">${rec.category}</span>
        <span class="chip">${rec.search}</span>
        <span class="chip">${rec.priceHint}</span>
      </div>
      <a class="btn btn-primary magnetic" href="${url}">Open Recommended Products</a>
    `;

    result.scrollIntoView({ behavior: "smooth", block: "nearest" });
    WWUI.showToast("Recommendation is ready.");
  });
}

function buildRecommendation(age, mood, budget) {
  let category = "Knit Caps";
  let search = "soft";
  let title = "Everyday Comfort Edit";
  let copy = "A balanced mix for daily wear with breathable texture and easy styling.";

  if (mood === "gift" || budget === "premium") {
    category = "Gift Sets";
    search = "gift";
    title = "Luxury Gift Story";
    copy = "Premium bundles with elevated packaging and ready-to-gift presentation.";
  } else if (mood === "playful") {
    category = "Knit Caps";
    search = "color";
    title = "Playful Color Pack";
    copy = "Bright, joyful pieces that still keep softness and comfort front and center.";
  } else if (mood === "minimal") {
    category = "Booties";
    search = "neutral";
    title = "Minimal Nursery Capsule";
    copy = "Calm tones and clean silhouettes for a refined, timeless look.";
  }

  if (age === "newborn") {
    category = budget === "premium" ? "Gift Sets" : "Mittens";
    search = budget === "premium" ? "newborn gift" : "newborn soft";
    title = budget === "premium" ? "Newborn Welcome Box" : "Newborn Comfort Kit";
    copy = "Extra-gentle picks designed for first months and sensitive skin.";
  }

  let priceHint = "Under $40";
  if (budget === "40to70") {
    priceHint = "$40-$70";
  }
  if (budget === "premium") {
    priceHint = "$70+ premium";
  }

  return { category, search, title, copy, priceHint };
}

function initHeroParticles() {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const canvas = WWUI.qs("#heroParticles");
  const hero = WWUI.qs(".cinematic-hero");
  if (!canvas || !hero || reduceMotion) {
    return;
  }

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return;
  }

  let w = 0;
  let h = 0;
  let particles = [];
  const mouse = { x: -9999, y: -9999 };

  function resize() {
    w = hero.clientWidth;
    h = hero.clientHeight;
    canvas.width = w;
    canvas.height = h;

    const count = w < 700 ? 38 : 72;
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.38,
      vy: (Math.random() - 0.5) * 0.38,
      r: Math.random() * 1.8 + 0.8
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);

    for (let i = 0; i < particles.length; i += 1) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;

      const dxm = p.x - mouse.x;
      const dym = p.y - mouse.y;
      const dm = Math.hypot(dxm, dym);
      if (dm < 120 && dm > 0) {
        p.vx += (dxm / dm) * 0.015;
        p.vy += (dym / dm) * 0.015;
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(52, 129, 237, 0.45)";
      ctx.fill();

      for (let j = i + 1; j < particles.length; j += 1) {
        const q = particles[j];
        const dx = p.x - q.x;
        const dy = p.y - q.y;
        const d = Math.hypot(dx, dy);
        if (d > 130) continue;
        const a = (1 - d / 130) * 0.18;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(q.x, q.y);
        ctx.strokeStyle = `rgba(0, 166, 166, ${a.toFixed(3)})`;
        ctx.lineWidth = 0.7;
        ctx.stroke();
      }
    }

    requestAnimationFrame(draw);
  }

  hero.addEventListener("pointermove", (event) => {
    const rect = hero.getBoundingClientRect();
    mouse.x = event.clientX - rect.left;
    mouse.y = event.clientY - rect.top;
  });

  hero.addEventListener("pointerleave", () => {
    mouse.x = -9999;
    mouse.y = -9999;
  });

  window.addEventListener("resize", resize);
  resize();
  draw();
}
