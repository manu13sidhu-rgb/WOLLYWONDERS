(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function qs(selector, root = document) {
    return root.querySelector(selector);
  }

  function qsa(selector, root = document) {
    return Array.from(root.querySelectorAll(selector));
  }

  function showToast(message, timeout = 2300) {
    const el = qs("#toast");
    if (!el) {
      return;
    }
    el.textContent = message;
    el.classList.add("is-open");
    clearTimeout(showToast._timer);
    showToast._timer = setTimeout(() => {
      el.classList.remove("is-open");
    }, timeout);
  }

  function initTopbar() {
    const topbar = qs(".topbar");
    if (!topbar) {
      return;
    }
    const onScroll = () => {
      topbar.classList.toggle("is-scrolled", window.scrollY > 12);
      document.body.style.setProperty("--scroll-y", `${window.scrollY}px`);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  function initReveal() {
    const nodes = qsa(".reveal");
    if (!nodes.length) {
      return;
    }

    if (reduceMotion || !("IntersectionObserver" in window)) {
      nodes.forEach((n) => n.classList.add("is-in"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.15 }
    );

    nodes.forEach((n, i) => {
      if (!n.style.transitionDelay) {
        n.style.transitionDelay = `${Math.min(i * 40, 260)}ms`;
      }
      io.observe(n);
    });
  }

  function initMagneticButtons() {
    if (reduceMotion) {
      return;
    }

    qsa(".magnetic").forEach((button) => {
      let raf;

      const reset = () => {
        button.style.transform = "";
      };

      button.addEventListener("mousemove", (event) => {
        const rect = button.getBoundingClientRect();
        const dx = event.clientX - (rect.left + rect.width / 2);
        const dy = event.clientY - (rect.top + rect.height / 2);
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          button.style.transform = `translate(${dx * 0.12}px, ${dy * 0.12}px)`;
        });
      });

      button.addEventListener("mouseleave", reset);
      button.addEventListener("blur", reset);
    });
  }

  function initTiltCards() {
    if (reduceMotion) {
      return;
    }

    qsa(".tilt-card").forEach((card) => {
      let raf;

      const reset = () => {
        card.style.transform = "rotateX(0deg) rotateY(0deg)";
      };

      card.addEventListener("mousemove", (event) => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;
        const rotY = (x - 0.5) * 8;
        const rotX = (0.5 - y) * 8;
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          card.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
        });
      });

      card.addEventListener("mouseleave", reset);
      card.addEventListener("blur", reset);
    });
  }

  function initParallaxNodes() {
    if (reduceMotion) {
      return;
    }

    const nodes = qsa("[data-parallax]");
    if (!nodes.length) {
      return;
    }

    const onScroll = () => {
      const y = window.scrollY;
      nodes.forEach((node) => {
        const speed = Number(node.dataset.parallax || 0.06);
        node.style.transform = `translate3d(0, ${Math.round(y * speed)}px, 0)`;
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  function initHeroMesh() {
    if (reduceMotion) {
      return;
    }

    const hero = qs(".store-hero");
    const mesh = qs(".hero-mesh", hero || document);
    if (!hero || !mesh) {
      return;
    }

    hero.addEventListener("pointermove", (event) => {
      const rect = hero.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
      mesh.style.setProperty("--mesh-x", x.toFixed(3));
      mesh.style.setProperty("--mesh-y", y.toFixed(3));
    });

    hero.addEventListener("pointerleave", () => {
      mesh.style.setProperty("--mesh-x", "0");
      mesh.style.setProperty("--mesh-y", "0");
    });
  }

  function initCounters() {
    const counters = qsa("[data-count]");
    if (!counters.length) {
      return;
    }

    const animate = (el) => {
      const target = Number(el.dataset.count || 0);
      const duration = Number(el.dataset.duration || 1200);
      const start = performance.now();

      const frame = (now) => {
        const progress = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = Math.round(target * eased);
        el.textContent = value.toLocaleString();
        if (progress < 1) {
          requestAnimationFrame(frame);
        }
      };

      requestAnimationFrame(frame);
    };

    if (reduceMotion || !("IntersectionObserver" in window)) {
      counters.forEach((counter) => {
        counter.textContent = Number(counter.dataset.count || 0).toLocaleString();
      });
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }
          animate(entry.target);
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach((counter) => io.observe(counter));
  }

  function initials(name = "") {
    return name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0].toUpperCase())
      .join("") || "WW";
  }

  function currency(value) {
    return `$${Number(value).toFixed(2)}`;
  }

  function formatDate(iso) {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) {
      return "-";
    }
    return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
  }

  function guardSession(roles = []) {
    const session = window.WWData.getSession();
    if (!session) {
      window.location.href = "auth.html";
      return null;
    }

    if (roles.length && !roles.includes(session.role)) {
      window.location.href = session.role === "admin" ? "admin.html" : "customer.html";
      return null;
    }

    return session;
  }

  function signOut() {
    window.WWData.clearSession();
    window.location.href = "auth.html";
  }

  function initBase() {
    initTopbar();
    initReveal();
    initMagneticButtons();
    initTiltCards();
    initParallaxNodes();
    initHeroMesh();
    initCounters();
    initHamburger();

    qsa("[data-signout]").forEach((btn) => {
      btn.addEventListener("click", signOut);
    });
  }

  function initHamburger() {
    const btn = qs("#hamburgerBtn");
    const nav = qs("#navMenu");
    if (!btn || !nav) return;

    btn.addEventListener("click", () => {
      btn.classList.toggle("is-active");
      nav.classList.toggle("is-open");
    });

    qsa("a", nav).forEach((link) => {
      link.addEventListener("click", () => {
        btn.classList.remove("is-active");
        nav.classList.remove("is-open");
      });
    });

    // Show mobile-only buttons when nav is open on small screens
    const mobileItems = qsa(".nav-link-mobile", nav);
    if (window.innerWidth <= 768) {
      mobileItems.forEach((el) => { el.style.display = ""; });
    }
    window.addEventListener("resize", () => {
      if (window.innerWidth <= 768) {
        mobileItems.forEach((el) => { el.style.display = ""; });
      } else {
        mobileItems.forEach((el) => { el.style.display = "none"; });
        btn.classList.remove("is-active");
        nav.classList.remove("is-open");
      }
    });
  }

  window.WWUI = {
    qs,
    qsa,
    showToast,
    initBase,
    guardSession,
    signOut,
    initials,
    currency,
    formatDate
  };
})();
