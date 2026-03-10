document.addEventListener("DOMContentLoaded", () => {
  WWUI.initBase();

  const tabs = WWUI.qsa("[data-tab]");
  const panels = {
    login: WWUI.qs("#loginPanel"),
    register: WWUI.qs("#registerPanel")
  };

  function setTab(tab) {
    tabs.forEach((button) => button.classList.toggle("is-active", button.dataset.tab === tab));
    Object.entries(panels).forEach(([name, panel]) => {
      if (!panel) return;
      panel.hidden = name !== tab;
    });
  }

  tabs.forEach((button) => {
    button.addEventListener("click", () => setTab(button.dataset.tab));
  });

  setTab("login");

  const loginForm = WWUI.qs("#loginForm");
  loginForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = WWUI.qs("#loginEmail")?.value || "";
    const password = WWUI.qs("#loginPassword")?.value || "";

    const result = WWData.login(email, password);
    if (!result.ok) {
      WWUI.showToast(result.message);
      return;
    }

    WWUI.showToast("Signed in successfully.");
    setTimeout(() => {
      window.location.href = result.user.role === "admin" ? "admin.html" : "customer.html";
    }, 400);
  });

  const registerForm = WWUI.qs("#registerForm");
  registerForm?.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = WWUI.qs("#registerName")?.value.trim() || "";
    const email = WWUI.qs("#registerEmail")?.value.trim() || "";
    const password = WWUI.qs("#registerPassword")?.value || "";
    const confirm = WWUI.qs("#registerConfirm")?.value || "";
    const terms = WWUI.qs("#registerTerms")?.checked;

    if (!name || name.length < 2) {
      WWUI.showToast("Please enter your full name.");
      return;
    }

    if (!email.includes("@")) {
      WWUI.showToast("Please enter a valid email.");
      return;
    }

    if (password.length < 6) {
      WWUI.showToast("Password should be at least 6 characters.");
      return;
    }

    if (password !== confirm) {
      WWUI.showToast("Passwords do not match.");
      return;
    }

    if (!terms) {
      WWUI.showToast("Please accept terms to continue.");
      return;
    }

    const result = WWData.register({ name, email, password });
    if (!result.ok) {
      WWUI.showToast(result.message);
      return;
    }

    WWUI.showToast("Account created. Welcome to Wooly Wonders.");
    setTimeout(() => {
      window.location.href = "customer.html";
    }, 500);
  });

  WWUI.qsa("[data-fill-demo]").forEach((button) => {
    button.addEventListener("click", () => {
      const emailInput = WWUI.qs("#loginEmail");
      const passInput = WWUI.qs("#loginPassword");
      if (emailInput) emailInput.value = button.dataset.email || "";
      if (passInput) passInput.value = button.dataset.password || "";
      setTab("login");
    });
  });
});
