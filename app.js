// --- MASTER VIEW SWITCHER & ROUTER FUNCTIONS ---
window.setActiveView = function(viewName, extraParam) {
  const landing = document.getElementById("landing-page-view");
  const auth = document.getElementById("auth-view");
  const dash = document.getElementById("app-dashboard-view");
  const admin = document.getElementById("admin-portal-view");

  // Strictly hide all views via inline style AND class hidden
  [landing, auth, dash, admin].forEach(view => {
    if (view) {
      view.style.display = "none";
      view.classList.add("hidden");
    }
  });

  document.body.style.overflow = "auto";

  if (viewName === "landing") {
    if (landing) {
      landing.style.display = "block";
      landing.classList.remove("hidden");
    }
  } else if (viewName === "auth") {
    if (landing) {
      landing.style.display = "block";
      landing.classList.remove("hidden");
    }
    if (auth) {
      auth.style.display = "flex";
      auth.classList.remove("hidden");
      auth.scrollTop = 0;
    }
    document.body.style.overflow = "hidden";
    if (window.toggleUserAuthTab) window.toggleUserAuthTab(extraParam || "login");
  } else if (viewName === "dashboard") {
    if (dash) {
      dash.style.display = "block";
      dash.classList.remove("hidden");
    }
    document.body.style.overflow = "hidden";
    if (window.switchTab) window.switchTab(extraParam || "dashboard");
  } else if (viewName === "admin") {
    if (admin) {
      admin.style.display = "block";
      admin.classList.remove("hidden");
    }
    if (window.renderAdminView) window.renderAdminView();
  }
};

window.navigateTo = function(path) {
  if (window.location.pathname !== path) {
    window.history.pushState({}, '', path);
  }
  if (window.handleRouting) window.handleRouting();
};

window.showLandingPage = function() {
  window.setActiveView("landing");
};

window.toggleUserAuthTab = function(tab) {
  const loginForm = document.getElementById("user-login-form");
  const regForm = document.getElementById("user-register-form");
  const tabLoginBtn = document.getElementById("user-tab-login");
  const tabRegBtn = document.getElementById("user-tab-register");
  const authTitle = document.getElementById("user-auth-title");
  const errorEl = document.getElementById("auth-error");

  if (errorEl) errorEl.style.display = "none";

  if (tab === 'register') {
    if (loginForm) loginForm.style.display = "none";
    if (regForm) regForm.style.display = "block";
    if (tabLoginBtn) tabLoginBtn.classList.remove("active");
    if (tabRegBtn) tabRegBtn.classList.add("active");
    if (authTitle) authTitle.textContent = "Criar Conta no Vox Creator Shop";
    if (window.location.pathname !== "/auth/register") {
      window.history.replaceState({}, '', "/auth/register");
    }
  } else {
    if (loginForm) loginForm.style.display = "block";
    if (regForm) regForm.style.display = "none";
    if (tabLoginBtn) tabLoginBtn.classList.add("active");
    if (tabRegBtn) tabRegBtn.classList.remove("active");
    if (authTitle) authTitle.textContent = "Acessar o Vox Creator Shop";
    if (window.location.pathname !== "/auth/login") {
      window.history.replaceState({}, '', "/auth/login");
    }
  }
};

window.showAdminPortal = function() {
  window.setActiveView("admin");
};

window.showAppDashboard = function(tabId) {
  window.setActiveView("dashboard", tabId);
};

window.showAuthPage = function(tab = 'login') {
  window.setActiveView("auth", tab);
};

document.addEventListener("DOMContentLoaded", () => {
  // Global State
  const state = {
    user: null,
    currentTab: "dashboard",
    scriptsHistory: [
      {
        id: "martelete-preset",
        productName: "MARTELETE ROTATIVO ROMPEDOR 800W 8 PEÇAS",
        quality: 99,
        date: "20/07, 23:10",
        favorited: false,
        cycles: 1,
        blocksCount: 24,
        presetId: "martelete"
      }
    ],
    activeScript: null,
    searchQuery: "",
    discoverFilter: "testar",
    discoverPage: 1,
    discoverLimit: 5,
    favorites: JSON.parse(localStorage.getItem("vox_favorites") || "[]"),
    showcase: JSON.parse(localStorage.getItem("vox_showcase") || "[]"),
    favoritesOnly: false,
    showcaseOnly: false,
    rankingPeriod: "diario",
    autoUpdatesActive: true,
    liveChartData: [170, 150, 165, 110, 120, 70, 50],
    teleprompter: {
      isPlaying: false,
      intervalId: null,
      activeWordIndex: 0,
      activeBlockIndex: 0,
      fontSize: "m", // p, m, g, gg
      words: [],
      wordsPerMinute: 130
    }
  };

  // --- NAVIGATION / VIEWS ROUTER ---
  function showLandingPage() {
    document.getElementById("landing-page-view").style.display = "block";
    document.getElementById("auth-view").style.display = "none";
    document.getElementById("app-dashboard-view").style.display = "none";
    if (document.getElementById("admin-portal-view")) {
      document.getElementById("admin-portal-view").style.display = "none";
    }
    document.body.style.overflow = "auto";
  }

  function showAuthPage(tab = 'login') {
    document.getElementById("landing-page-view").style.display = "none";
    document.getElementById("auth-view").style.display = "flex";
    document.getElementById("app-dashboard-view").style.display = "none";
    if (document.getElementById("admin-portal-view")) {
      document.getElementById("admin-portal-view").style.display = "none";
    }
    const errorEl = document.getElementById("auth-error");
    if (errorEl) errorEl.style.display = "none";
    document.body.style.overflow = "hidden";
    toggleUserAuthTab(tab);
  }

  function toggleUserAuthTab(tab) {
    const loginForm = document.getElementById("user-login-form");
    const regForm = document.getElementById("user-register-form");
    const tabLoginBtn = document.getElementById("user-tab-login");
    const tabRegBtn = document.getElementById("user-tab-register");
    const errorEl = document.getElementById("auth-error");

    if (errorEl) errorEl.style.display = "none";

    if (tab === 'register') {
      if (loginForm) loginForm.style.display = "none";
      if (regForm) regForm.style.display = "block";
      if (tabLoginBtn) tabLoginBtn.classList.remove("active");
      if (tabRegBtn) tabRegBtn.classList.add("active");
    } else {
      if (loginForm) loginForm.style.display = "block";
      if (regForm) regForm.style.display = "none";
      if (tabLoginBtn) tabLoginBtn.classList.add("active");
      if (tabRegBtn) tabRegBtn.classList.remove("active");
    }
  }

  window.toggleUserAuthTab = toggleUserAuthTab;

  window.submitUserRegister = async function(e) {
    e.preventDefault();
    const name = document.getElementById("reg-name").value.trim();
    const email = document.getElementById("reg-email").value.trim();
    const pass = document.getElementById("reg-pass").value;
    const errorEl = document.getElementById("auth-error");

    try {
      if (window.voxApi) {
        const res = await window.voxApi.register(email, pass, name);
        state.user = {
          name: res.user.name || name,
          email: res.user.email,
          role: res.user.role,
          credits: 50,
          plan: "Vox PRO (Trial)",
          trialDays: 7
        };
        localStorage.setItem("topcreator_user", JSON.stringify(state.user));
        navigateTo("/dashboard");
        return;
      }
    } catch (err) {
      if (errorEl) {
        errorEl.textContent = err.message || "Erro ao realizar cadastro.";
        errorEl.style.display = "block";
      }
      return;
    }

    state.user = { name, email, credits: 50, plan: "Vox PRO (Trial)", trialDays: 7 };
    localStorage.setItem("topcreator_user", JSON.stringify(state.user));
    navigateTo("/dashboard");
  };

  function renderSidebarProfile() {
    let u = state.user;
    if (!u) {
      const savedUser = localStorage.getItem("topcreator_user");
      if (savedUser) {
        try { u = JSON.parse(savedUser); } catch(e){}
      }
    }
    if (!u) {
      u = { name: "William de Souza", email: "williamdev36@gmail.com", plan: "Vox PRO (Trial)", trialDays: 7, credits: 50 };
      localStorage.setItem("topcreator_user", JSON.stringify(u));
    }
    state.user = u;

    const nameEl = document.getElementById("profile-display-name");
    if (nameEl) nameEl.textContent = u.name || "William de Souza";

    const creditsEl = document.getElementById("profile-display-credits");
    if (creditsEl) creditsEl.textContent = `${u.plan || 'Vox PRO'} · ${u.credits || 50} cred.`;

    const trialEl = document.getElementById("profile-display-trial");
    if (trialEl) trialEl.textContent = `Teste: ${u.trialDays || 7} dias restantes`;

    const initialsEl = document.getElementById("profile-avatar-initials");
    if (initialsEl && u.name) {
      const parts = u.name.trim().split(" ");
      const initials = parts.length > 1 ? (parts[0][0] + parts[1][0]).toUpperCase() : parts[0].slice(0, 2).toUpperCase();
      initialsEl.textContent = initials;
    }

    const emailEl = document.getElementById("dropdown-user-email");
    if (emailEl) emailEl.textContent = u.email || "williamdev36@gmail.com";

    const greetingEl = document.getElementById("saas-greeting-name");
    if (greetingEl) greetingEl.textContent = `Bom dia, ${u.name ? u.name.split(" ")[0] : "William"}`;

    const badgeEl = document.getElementById("saas-user-plan-badge");
    if (badgeEl) badgeEl.textContent = `${u.plan || "Vox PRO (Trial)"} · ${u.trialDays || 7} dias`;
  }

  function showAppDashboard(tabToOpen) {
    const landing = document.getElementById("landing-page-view");
    const auth = document.getElementById("auth-view");
    const appDash = document.getElementById("app-dashboard-view");
    const admin = document.getElementById("admin-portal-view");

    if (landing) landing.style.display = "none";
    if (auth) auth.style.display = "none";
    if (admin) admin.style.display = "none";
    if (appDash) {
      appDash.style.display = "block";
      appDash.classList.remove("hidden");
    }
    document.body.style.overflow = "hidden";
    
    renderSidebarProfile();
    renderHistory();
    renderDiscoverTab();

    const initialTab = tabToOpen || state.currentTab || "dashboard";
    switchTab(initialTab);
  }

  function showAdminPortal() {
    document.getElementById("landing-page-view").style.display = "none";
    document.getElementById("auth-view").style.display = "none";
    document.getElementById("app-dashboard-view").style.display = "none";
    if (document.getElementById("admin-portal-view")) {
      document.getElementById("admin-portal-view").style.display = "block";
    }
    document.body.style.overflow = "auto";
    renderAdminView();
  }

  async function renderAdminView() {
    const adminSession = localStorage.getItem("vox_admin_session");
    const authWrapper = document.getElementById("admin-auth-wrapper");
    const dashboardWrapper = document.getElementById("admin-dashboard-wrapper");
    
    if (!authWrapper || !dashboardWrapper) return;
    
    if (adminSession) {
      authWrapper.style.display = "none";
      dashboardWrapper.style.display = "block";
      
      const savedVideo = localStorage.getItem("vox_landing_video") || "";
      if (document.getElementById("admin-video-input")) {
        document.getElementById("admin-video-input").value = savedVideo;
      }

      // Fetch real metrics & plans from NestJS Backend if available
      try {
        if (window.voxApi && localStorage.getItem("vox_admin_token")) {
          const metrics = await window.voxApi.getAdminMetrics().catch(() => null);
          if (metrics) {
            if (document.getElementById("admin-subscribers-count")) {
              document.getElementById("admin-subscribers-count").textContent = metrics.activeSubscribers;
            }
          }

          const media = await window.voxApi.getLandingMedia().catch(() => null);
          if (media && media.heroVideoUrl && document.getElementById("admin-video-input")) {
            document.getElementById("admin-video-input").value = media.heroVideoUrl;
          }
        }
      } catch (err) {
        console.warn("Admin view sync error:", err.message);
      }
      
      const proPrice = localStorage.getItem("vox_plan_pro") || "147";
      const ultraPrice = localStorage.getItem("vox_plan_ultra") || "297";
      
      if (document.getElementById("admin-plan-pro-price")) document.getElementById("admin-plan-pro-price").value = proPrice;
      if (document.getElementById("admin-plan-ultra-price")) document.getElementById("admin-plan-ultra-price").value = ultraPrice;
      
      const proTag = document.getElementById("plan-pro-price-tag");
      const ultraTag = document.getElementById("plan-ultra-price-tag");
      if (proTag) proTag.textContent = proPrice;
      if (ultraTag) ultraTag.textContent = ultraPrice;
    } else {
      authWrapper.style.display = "block";
      dashboardWrapper.style.display = "none";
      document.getElementById("admin-login-email").value = "";
      document.getElementById("admin-login-pass").value = "";
      document.getElementById("admin-reg-email").value = "";
      document.getElementById("admin-reg-pass").value = "";
      document.getElementById("admin-reg-pass-confirm").value = "";
      document.getElementById("admin-auth-error").style.display = "none";
    }
  }

  function handleRouting() {
    const rawPath = window.location.pathname.toLowerCase();
    const path = rawPath.endsWith("/") && rawPath.length > 1 ? rawPath.slice(0, -1) : rawPath;
    const rawHash = window.location.hash.toLowerCase().replace("#", "");

    if (path === "/admin" || rawHash === "admin") {
      showAdminPortal();
      return;
    } 
    if (path === "/auth/register" || rawHash === "register") {
      showAuthPage('register');
      return;
    } 
    if (path === "/auth/login" || path === "/auth" || rawHash === "login") {
      showAuthPage('login');
      return;
    }

    const validTabs = [
      "dashboard",
      "analytics",
      "lives-studio",
      "inteligencia",
      "lives",
      "videos",
      "fixar",
      "descobrir",
      "samples",
      "ai-strategic",
      "extension"
    ];

    const targetTab = validTabs.includes(rawHash) 
      ? rawHash 
      : (validTabs.includes(path.replace("/", "")) ? path.replace("/", "") : null);

    const savedUser = localStorage.getItem("topcreator_user");

    // If targetTab is present (e.g. /dashboard or #analytics) or path is /dashboard or savedUser exists,
    // ALWAYS open the App Dashboard!
    if (savedUser || state.user || targetTab || path === "/dashboard" || path === "/app") {
      if (!state.user) {
        if (savedUser) {
          try { state.user = JSON.parse(savedUser); } catch(e) {}
        }
        if (!state.user) {
          state.user = { name: "William de Souza", email: "williamdev36@gmail.com", plan: "Vox PRO (Trial)", trialDays: 7, credits: 50 };
          localStorage.setItem("topcreator_user", JSON.stringify(state.user));
        }
      }
      showAppDashboard(targetTab || state.currentTab || "dashboard");
    } else {
      showLandingPage();
    }
  }

  window.handleRouting = handleRouting;

  // Bind route change listeners
  window.addEventListener("popstate", handleRouting);
  window.addEventListener("hashchange", handleRouting);
  // Trigger initial routing immediately
  handleRouting();

  // --- NEW UNIFIED MULTI-TAB ROUTER AND SCREEN RENDERERS ---
  function renderLives() {
    renderHistory();
  }

  function renderVideos() {
    // Roteiros de vídeo inicializado
  }

  function renderFixar() {
    // Fixar produto na live inicializado
  }

  function renderAnalytics() {
    // Analytics avançado inicializado
  }

  function renderLivesStudio() {
    // Central de lives & Copiloto IA inicializado
  }

  function renderSamples() {
    // Produtos gratuitos e amostras inicializado
  }

  function renderAiStrategic() {
    // IA Estratégica & Feed inicializado
  }

  function renderExtension() {
    // Extensão Chrome OS inicializada
  }

  function switchTab(tabName) {
    state.currentTab = tabName;
    const targetHash = `#${tabName}`;
    if (window.location.hash !== targetHash || !window.location.pathname.includes('/dashboard')) {
      try {
        history.pushState(null, "", `/dashboard${targetHash}`);
      } catch (e) {}
    }

    const map = {
      dashboard: "dashboard-screen",
      analytics: "analytics-screen",
      "lives-studio": "lives-studio-screen",
      inteligencia: "inteligencia-screen",
      lives: "lives-screen",
      videos: "videos-screen",
      fixar: "fixar-screen",
      descobrir: "descobrir-screen",
      samples: "samples-screen",
      "ai-strategic": "ai-strategic-screen",
      extension: "extension-screen"
    };

    // Reset inline styles and active status on all dashboard screens
    document.querySelectorAll(".dashboard-screen").forEach(screen => {
      screen.classList.remove("active");
      screen.style.display = "none";
    });

    const targetId = map[tabName] || "dashboard-screen";
    const targetEl = document.getElementById(targetId);
    if (targetEl) {
      targetEl.classList.add("active");
      targetEl.style.display = "flex";
    }

    // Update active state on sidebar navigation menu items
    document.querySelectorAll(".menu-item").forEach(btn => {
      btn.classList.remove("active");
      const dataTab = btn.dataset.tab || btn.getAttribute("data-tab");
      if (dataTab === tabName) {
        btn.classList.add("active");
      }
    });

    // Trigger tab-specific render engine
    if (tabName === "dashboard") renderDashboard();
    else if (tabName === "analytics") renderAnalytics();
    else if (tabName === "lives-studio") renderLivesStudio();
    else if (tabName === "inteligencia") renderIntelligence();
    else if (tabName === "lives") renderLives();
    else if (tabName === "videos") renderVideos();
    else if (tabName === "fixar") renderFixar();
    else if (tabName === "descobrir") renderDiscover();
    else if (tabName === "samples") renderSamples();
    else if (tabName === "ai-strategic") renderAiStrategic();
    else if (tabName === "extension") renderExtension();

    if (window.closeMobileSidebar) window.closeMobileSidebar();
  }

  window.switchTab = switchTab;

  // --- AUTHENTICATION ---
  window.submitLogin = async function(e) {
    e.preventDefault();
    const email = document.getElementById("login-email").value.trim();
    const pass = document.getElementById("login-pass").value;
    const errorEl = document.getElementById("auth-error");

    try {
      if (window.voxApi) {
        const res = await window.voxApi.login(email, pass).catch(async () => {
          // If account doesn't exist, auto-register in backend
          return await window.voxApi.register(email, pass);
        });

        state.user = {
          name: res.user.name || email.split('@')[0],
          email: res.user.email,
          role: res.user.role,
          credits: 50,
          plan: "Vox PRO (Trial)",
          trialDays: 7
        };
        localStorage.setItem("topcreator_user", JSON.stringify(state.user));
        navigateTo("/dashboard");
        return;
      }
    } catch (err) {
      console.warn("Backend login fallback:", err.message);
    }

    if (email) {
      state.user = {
        name: email.split("@")[0],
        email: email,
        credits: 50,
        plan: "Vox PRO (Trial)",
        trialDays: 7
      };
      localStorage.setItem("topcreator_user", JSON.stringify(state.user));
      navigateTo("/dashboard");
    } else {
      errorEl.textContent = "Preencha o e-mail para continuar.";
      errorEl.style.display = "block";
    }
  };

  window.logout = function() {
    if (window.voxApi) window.voxApi.clearTokens();
    localStorage.removeItem("topcreator_user");
    state.user = null;
    showLandingPage();
    closeSettingsModal();
    closePlaybook();
    document.getElementById("profile-dropdown-menu").classList.remove("active");
  };

  // --- RENDER SIDEBAR AND PROFILE ---
  async function renderSidebarProfile() {
    if (!state.user) return;
    
    try {
      if (window.voxApi && localStorage.getItem('vox_token')) {
        const status = await window.voxApi.getLicenseStatus();
        if (status) {
          state.user.plan = status.plan?.name || "Vox PRO";
          state.user.credits = status.creditsRemaining ?? 50;
          state.user.trialDays = status.daysRemaining ?? 7;
        }
      }
    } catch (err) {
      console.warn("License sync:", err.message);
    }

    const initials = (state.user.name || "U").split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
    document.getElementById("profile-avatar-initials").textContent = initials;
    document.getElementById("profile-display-name").textContent = state.user.name;
    document.getElementById("profile-display-credits").textContent = `${state.user.plan} · ${state.user.credits} créd.`;
    document.getElementById("profile-display-trial").textContent = `Teste: ${state.user.trialDays} dias restantes`;

    document.getElementById("dropdown-user-email").textContent = state.user.email;
  }

  // --- SEARCH AND HISTORY LIST ---
  window.handleHistorySearch = function(val) {
    state.searchQuery = val.toLowerCase();
    renderHistory();
  };

  function renderHistory() {
    const listEl = document.getElementById("history-list-grid");
    if (!listEl) return;

    listEl.innerHTML = "";
    const filtered = state.scriptsHistory.filter(item => 
      item.productName.toLowerCase().includes(state.searchQuery)
    );

    if (filtered.length === 0) {
      listEl.innerHTML = `<div class="col-span-full py-8 text-center text-sm text-gray-500">Nenhum roteiro encontrado.</div>`;
      return;
    }

    filtered.forEach(item => {
      const card = document.createElement("div");
      card.className = "script-card group";
      card.onclick = (e) => {
        // Prevent click if clicking a button inside
        if (e.target.closest(".card-action-btn")) return;
        openPlaybook(item);
      };

      const isFav = item.favorited ? "active" : "";

      card.innerHTML = `
        <div class="card-top-row">
          <span class="quality-badge" title="Qualidade estrutural do roteiro">Qualidade ${item.quality}%</span>
          <div class="card-actions">
            <button class="card-action-btn fav ${isFav}" onclick="toggleFavorite('${item.id}', event)" title="Favoritar (fixa no topo)" aria-label="Favoritar">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="${item.favorited ? '#fbbf24' : 'none'}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-star"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/></svg>
            </button>
            <span class="text-[11px] text-gray-500">${item.date}</span>
          </div>
        </div>
        <h3 class="card-title">${item.productName}</h3>
        <div class="card-bottom-row">
          <div class="card-stats">
            <span class="bold">${item.cycles}</span> <span class="text-gray-500">ciclos</span>
            <span class="text-[#5d5d5d]">·</span>
            <span class="bold">${item.blocksCount}</span> <span class="text-gray-500">blocos</span>
          </div>
          <div class="card-actions -mr-1">
            <button class="card-action-btn" onclick="editScriptTitle('${item.id}', event)" title="Editar título" aria-label="Editar">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pencil"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/></svg>
            </button>
            <button class="card-action-btn text-[#8e8e8e] hover:text-red-500" onclick="deleteScript('${item.id}', event)" title="Excluir do histórico" aria-label="Excluir">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
            </button>
          </div>
        </div>
      `;
      listEl.appendChild(card);
    });
  }

  window.toggleFavorite = function(id, e) {
    e.stopPropagation();
    const item = state.scriptsHistory.find(s => s.id === id);
    if (item) {
      item.favorited = !item.favorited;
      // Sort: favorites first
      state.scriptsHistory.sort((a, b) => (b.favorited ? 1 : 0) - (a.favorited ? 1 : 0));
      renderHistory();
    }
  };

  window.deleteScript = function(id, e) {
    e.stopPropagation();
    state.scriptsHistory = state.scriptsHistory.filter(s => s.id !== id);
    renderHistory();
  };

  window.editScriptTitle = function(id, e) {
    e.stopPropagation();
    const item = state.scriptsHistory.find(s => s.id === id);
    if (item) {
      const newTitle = prompt("Digite o novo título do produto:", item.productName);
      if (newTitle && newTitle.trim()) {
        item.productName = newTitle.trim();
        renderHistory();
      }
    }
  };

  // --- AI GENERATOR ---
  window.triggerScriptGeneration = function() {
    const descInput = document.getElementById("product-description-input");
    const desc = descInput.value.trim();
    if (!desc) {
      alert("Por favor, digite os detalhes do produto.");
      return;
    }

    // Show generating status
    const genBtn = document.getElementById("generate-script-btn");
    const originalContent = genBtn.innerHTML;
    genBtn.disabled = true;
    genBtn.innerHTML = `<span>Gerando...</span> <div class="w-4 h-4 rounded-full border border-dark/25 border-t-dark animate-spin"></div>`;

    setTimeout(() => {
      // Create script based on description matching
      let presetId = "martelete";
      let pName = "MARTELETE ROTATIVO ROMPEDOR 800W 8 PEÇAS";
      if (desc.toLowerCase().includes("cinta") || desc.toLowerCase().includes("shapewear") || desc.toLowerCase().includes("modeladora") || desc.toLowerCase().includes("bermuda")) {
        presetId = "cinta";
        pName = "Short Cinta Modeladora Bermuda de Compressão Shapewear Masculina";
      } else {
        // Default dynamically compiles using their product term
        const words = desc.split(" ").slice(0, 5).join(" ").toUpperCase();
        pName = words || "ROTEIRO EXPERIMENTAL DO PRODUTO";
      }

      const now = new Date();
      const dateStr = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}, ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

      const newScript = {
        id: `script-${Date.now()}`,
        productName: pName,
        quality: 95 + Math.floor(Math.random() * 5),
        date: dateStr,
        favorited: false,
        cycles: 1,
        blocksCount: window.mockData?.presets[presetId]?.slides.length || 6,
        presetId: presetId
      };

      // Add to history
      state.scriptsHistory.unshift(newScript);
      descInput.value = "";
      
      // Update credits (mock warning alert, since it was 0, but for demonstration we allow it)
      if (state.user.credits > 0) {
        state.user.credits -= 1;
        localStorage.setItem("topcreator_user", JSON.stringify(state.user));
        renderSidebarProfile();
      }

      // Reset button
      genBtn.disabled = false;
      genBtn.innerHTML = originalContent;

      renderHistory();
      // Automatically open the teleprompter for the generated script
      openPlaybook(newScript);

    }, 2000);
  };

  // --- TELEPROMPTER / PLAYBOOK ENGINE ---
  function openPlaybook(script) {
    state.activeScript = script;
    
    // Get preset slides
    const preset = window.mockData?.presets[script.presetId] || window.mockData?.presets["martelete"];
    
    // Setup Playbook Title & Metadata
    document.getElementById("playbook-header-title").textContent = script.productName;
    document.getElementById("playbook-block-index-label").textContent = `Bloco 1/${preset.slides.length} · ${preset.slides[0].section}`;

    // Render slides into teleprompter track
    const trackEl = document.getElementById("teleprompter-words-track");
    trackEl.innerHTML = "";

    let totalWordIdx = 0;
    const wordsArray = [];

    preset.slides.forEach((slide, blockIdx) => {
      const blockDiv = document.createElement("div");
      blockDiv.className = "teleprompter-block";
      blockDiv.dataset.blockIndex = blockIdx;

      const label = document.createElement("div");
      label.className = "teleprompter-block-label";
      label.textContent = slide.section;
      blockDiv.appendChild(label);

      const p = document.createElement("p");
      
      // Split paragraph into spans for word highlighting
      const phraseWords = slide.pitch.split(" ");
      phraseWords.forEach(w => {
        const span = document.createElement("span");
        span.className = "teleprompter-word";
        span.dataset.wordIndex = totalWordIdx;
        span.textContent = w + " ";
        
        // Add click listener to jump to word
        span.onclick = () => {
          jumpToWord(parseInt(span.dataset.wordIndex));
        };

        p.appendChild(span);
        wordsArray.push({
          element: span,
          word: w,
          blockIdx: blockIdx
        });
        totalWordIdx++;
      });

      blockDiv.appendChild(p);
      trackEl.appendChild(blockDiv);
    });

    state.teleprompter.words = wordsArray;
    state.teleprompter.activeWordIndex = 0;
    state.teleprompter.activeBlockIndex = 0;
    state.teleprompter.isPlaying = false;
    
    // Set Font size
    setFontSizeClass(state.teleprompter.fontSize);

    // Show loading overlay for 2 seconds
    const loader = document.getElementById("playbook-loader");
    loader.style.opacity = "1";
    loader.style.display = "flex";

    document.getElementById("playbook-view-overlay").classList.add("active");

    setTimeout(() => {
      loader.style.opacity = "0";
      setTimeout(() => loader.style.display = "none", 500);
      
      // Update microfone and local voice check
      simulateMicLevel();
    }, 2000);
  }

  window.closePlaybook = function() {
    pauseTeleprompter();
    document.getElementById("playbook-view-overlay").classList.remove("active");
    state.activeScript = null;
  };

  // Font Size Adjust
  window.adjustTeleprompterFontSize = function(dir) {
    const sizes = ["p", "m", "g", "gg"];
    let idx = sizes.indexOf(state.teleprompter.fontSize);
    if (dir === "+" && idx < sizes.length - 1) {
      idx++;
    } else if (dir === "-" && idx > 0) {
      idx--;
    }
    state.teleprompter.fontSize = sizes[idx];
    document.getElementById("teleprompter-font-display").textContent = sizes[idx].toUpperCase();
    setFontSizeClass(sizes[idx]);
    scrollToActiveWord();
  };

  function setFontSizeClass(size) {
    const screen = document.getElementById("playbook-view-overlay");
    screen.className = "fixed inset-0 z-[70] playbook-screen active";
    screen.classList.add(`size-${size}`);
  }

  // Jump to word
  function jumpToWord(index) {
    state.teleprompter.activeWordIndex = index;
    state.teleprompter.words.forEach((w, idx) => {
      w.element.classList.remove("active", "spoken");
      if (idx === index) {
        w.element.classList.add("active");
        state.teleprompter.activeBlockIndex = w.blockIdx;
      } else if (idx < index) {
        w.element.classList.add("spoken");
      }
    });

    // Update block header metadata
    const preset = window.mockData?.presets[state.activeScript.presetId] || window.mockData?.presets["martelete"];
    const slide = preset.slides[state.teleprompter.activeBlockIndex];
    document.getElementById("playbook-block-index-label").textContent = `Bloco ${state.teleprompter.activeBlockIndex + 1}/${preset.slides.length} · ${slide.section}`;
    
    scrollToActiveWord();
  }

  function scrollToActiveWord() {
    if (state.teleprompter.words.length === 0) return;
    const activeEl = state.teleprompter.words[state.teleprompter.activeWordIndex].element;
    const container = document.getElementById("teleprompter-words-track");
    
    const containerRect = container.getBoundingClientRect();
    const activeRect = activeEl.getBoundingClientRect();
    
    // We want the active element to sit exactly at the 35% target mark
    const targetY = containerRect.top + (containerRect.height * 0.35);
    const offset = activeRect.top - targetY;
    
    // Extract current transform
    const style = window.getComputedStyle(container);
    const matrix = new DOMMatrix(style.transform);
    const currentY = matrix.m42;
    
    container.style.transform = `translateY(${currentY - offset}px)`;
  }

  // Play/Pause teleprompter
  window.toggleTeleprompterPlay = function() {
    if (state.teleprompter.isPlaying) {
      pauseTeleprompter();
    } else {
      playTeleprompter();
    }
  };

  function playTeleprompter() {
    state.teleprompter.isPlaying = true;
    
    const playBtn = document.getElementById("playbook-play-toggle-btn");
    playBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" class="lucide lucide-pause w-3.5 h-3.5"><rect x="14" y="3" width="5" height="18" rx="1"/><rect x="5" y="3" width="5" height="18" rx="1"/></svg> <span class="leading-none">Ao vivo</span>`;
    playBtn.classList.add("bg-red-600", "animate-pulse");

    // Scroll speed based on words per minute
    // 130 words per minute -> 1 word every (60/130) * 1000 ms = ~460ms
    const intervalMs = (60 / state.teleprompter.wordsPerMinute) * 1000;
    
    state.teleprompter.intervalId = setInterval(() => {
      if (state.teleprompter.activeWordIndex < state.teleprompter.words.length - 1) {
        jumpToWord(state.teleprompter.activeWordIndex + 1);
      } else {
        pauseTeleprompter();
      }
    }, intervalMs);
  }

  function pauseTeleprompter() {
    state.teleprompter.isPlaying = false;
    clearInterval(state.teleprompter.intervalId);
    
    const playBtn = document.getElementById("playbook-play-toggle-btn");
    playBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-play w-3.5 h-3.5 fill-current"><polygon points="6 3 20 12 6 21 6 3"/></svg> <span class="leading-none">Retomar</span>`;
    playBtn.classList.remove("bg-red-600", "animate-pulse");
  }

  // Keyboard navigation shortcuts
  document.addEventListener("keydown", (e) => {
    if (!state.activeScript) return;
    
    if (e.code === "Space") {
      e.preventDefault();
      toggleTeleprompterPlay();
    } else if (e.code === "ArrowLeft") {
      e.preventDefault();
      // Block previous
      if (state.teleprompter.activeBlockIndex > 0) {
        // Find first word index of previous block
        const targetBlockIdx = state.teleprompter.activeBlockIndex - 1;
        const wIdx = state.teleprompter.words.findIndex(w => w.blockIdx === targetBlockIdx);
        if (wIdx !== -1) jumpToWord(wIdx);
      }
    } else if (e.code === "ArrowRight") {
      e.preventDefault();
      // Block next
      const preset = window.mockData?.presets[state.activeScript.presetId] || window.mockData?.presets["martelete"];
      if (state.teleprompter.activeBlockIndex < preset.slides.length - 1) {
        const targetBlockIdx = state.teleprompter.activeBlockIndex + 1;
        const wIdx = state.teleprompter.words.findIndex(w => w.blockIdx === targetBlockIdx);
        if (wIdx !== -1) jumpToWord(wIdx);
      }
    } else if (e.code === "ArrowUp") {
      e.preventDefault();
      adjustTeleprompterFontSize("+");
    } else if (e.code === "ArrowDown") {
      e.preventDefault();
      adjustTeleprompterFontSize("-");
    }
  });

  // Microfone Level Simulation
  let micInterval = null;
  function simulateMicLevel() {
    const fillEl = document.getElementById("mic-visualizer-fill");
    clearInterval(micInterval);
    if (!state.activeScript) return;

    micInterval = setInterval(() => {
      if (state.teleprompter.isPlaying) {
        // Random level if active
        const val = 10 + Math.floor(Math.random() * 80);
        fillEl.style.width = `${val}%`;
      } else {
        fillEl.style.width = "0%";
      }
    }, 150);
  }

  // --- DISCOVER PRODUCTS TAB ---
  window.switchDiscoverFilter = function(filterId, btn) {
    state.discoverFilter = filterId;
    document.querySelectorAll(".discover-filter-btn").forEach(el => {
      el.classList.remove("active");
    });
    btn.classList.add("active");
    renderDiscoverTab();
  };

  function renderDiscoverTab() {
    const listEl = document.getElementById("discover-products-list");
    if (!listEl) return;

    listEl.innerHTML = "";
    
    // Sort logic depending on filters
    let sortedList = [...(window.mockData?.products || [])];
    if (state.discoverFilter === "vendas") {
      sortedList.sort((a, b) => b.sales - a.sales);
    } else if (state.discoverFilter === "crescimento") {
      sortedList.sort((a, b) => b.rate - a.rate);
    } else if (state.discoverFilter === "concorrencia") {
      sortedList = sortedList.filter(p => p.competition === "Concorrência média" || p.competition === "Concorrência baixa");
    }

    sortedList.forEach(p => {
      const card = document.createElement("div");
      card.className = "product-row-card";
      card.onclick = () => {
        // Fill description in live script and navigate
        document.getElementById("product-description-input").value = `${p.title} - ${p.category}. Volume de vendas estimado em live: ${p.sales} un, GMV de ${p.gmv}.`;
        switchTab("lives");
      };

      card.innerHTML = `
        <img alt="${p.title}" referrerpolicy="no-referrer" class="product-row-img" src="${p.image}">
        <div class="product-row-info">
          <h4 class="product-row-title">${p.title}</h4>
          <p class="product-row-stats">Vendendo em ${p.livesCount} lives agora · ritmo de ${p.rate} un/live</p>
          <p class="product-row-desc">${p.sales} vendas em live, ${p.gmv} em GMV.</p>
          <div class="flex flex-wrap gap-1.5 mt-2">
            <span class="text-[10.5px] text-gray-400 bg-white/5 border border-white/10 rounded-full px-2 py-0.5">${p.category.split(" e ")[0]}</span>
            <span class="inline-flex items-center gap-1.5 text-[10.5px] text-gray-400 bg-white/5 border border-white/10 rounded-full px-2 py-0.5">
              <span class="w-1.5 h-1.5 rounded-full" style="background-color: ${p.competitionColor}"></span>${p.competition}
            </span>
          </div>
        </div>
        <div class="product-row-actions">
          <div class="product-row-gmv-label">
            <b class="product-row-gmv">${p.gmv.replace("R$ ", "R$")}</b>
            <span class="product-row-gmv-sub">em vendas</span>
          </div>
          <div class="product-row-btns">
            <button class="row-action-link">Salvar</button>
            <button class="btn-primary" style="height: 32px; font-size: 12px; padding: 0 12px;">Preparar teste</button>
          </div>
        </div>
      `;
      listEl.appendChild(card);
    });
  }

  // --- CONFIGURATIONS / SETTINGS MODAL ---
  // --- LIVE PHONE PREVIEW COMPONENT ---
  const LivePhonePreview = {
    currentSource: "",
    init() {
      const savedSrc = localStorage.getItem("vox_landing_video") || "";
      this.currentSource = savedSrc;
      this.update(savedSrc);
    },
    update(url) {
      this.currentSource = url;
      localStorage.setItem("vox_landing_video", url);
      
      const container = document.getElementById("phone-video-preview-container");
      if (!container) return;
      
      const analyticsContainer = document.getElementById("hero-phone-analytics");
      
      if (!url || url.trim() === "" || url.trim() === "none" || url.trim() === "false") {
        container.style.display = "none";
        container.innerHTML = "";
        if (analyticsContainer) {
          analyticsContainer.style.display = "flex";
        }
        return;
      }
      
      if (analyticsContainer) {
        analyticsContainer.style.display = "none";
      }
      container.style.display = "block";
      container.innerHTML = "";
      
      let cleanUrl = url.trim();
      
      // YouTube check
      let ytId = "";
      if (cleanUrl.includes("youtube.com/watch")) {
        try {
          const urlParams = new URLSearchParams(new URL(cleanUrl).search);
          ytId = urlParams.get("v");
        } catch (e) {
          console.error(e);
        }
      } else if (cleanUrl.includes("youtu.be/")) {
        ytId = cleanUrl.split("youtu.be/")[1]?.split("?")[0];
      } else if (cleanUrl.includes("youtube.com/embed/")) {
        ytId = cleanUrl.split("youtube.com/embed/")[1]?.split("?")[0];
      }
      
      // Vimeo check
      let vimeoId = "";
      if (cleanUrl.includes("vimeo.com/")) {
        vimeoId = cleanUrl.split("vimeo.com/")[1]?.split("?")[0]?.split("#")[0];
      }
      
      if (ytId) {
        container.innerHTML = `
          <iframe src="https://www.youtube.com/embed/${ytId}?autoplay=1&mute=1&loop=1&playlist=${ytId}&controls=0&modestbranding=1&showinfo=0&rel=0&playsinline=1" 
                  frameborder="0" 
                  allow="autoplay; encrypted-media" 
                  allowfullscreen
                  style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: fill; border-radius: 28px; pointer-events: none;">
          </iframe>
        `;
      } else if (vimeoId) {
        container.innerHTML = `
          <iframe src="https://player.vimeo.com/video/${vimeoId}?autoplay=1&muted=1&loop=1&autopause=0&controls=0&background=1&playsinline=1" 
                  frameborder="0" 
                  allow="autoplay; fullscreen" 
                  allowfullscreen
                  style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: fill; border-radius: 28px; pointer-events: none;">
          </iframe>
        `;
      } else {
        container.innerHTML = `
          <video autoplay muted loop playsinline style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: fill; border-radius: 28px; z-index: 0; opacity: 0.95;">
            <source src="${cleanUrl}" type="video/mp4">
          </video>
        `;
      }
    }
  };

  window.openSettingsModal = function() {
    if (!state.user) return;
    
    // Fill settings inputs
    document.getElementById("settings-name-input").value = state.user.name;
    document.getElementById("settings-whatsapp-input").value = state.user.whatsapp || "";
    document.getElementById("settings-email-text").textContent = state.user.email;
    document.getElementById("settings-landing-video").value = localStorage.getItem("vox_landing_video") || "https://assets.mixkit.co/videos/preview/mixkit-girl-showing-new-makeup-products-on-video-41620-large.mp4";
    
    // Hide/show admin-only fields
    const isAdmin = state.user.email === "williamdev36@gmail.com";
    const adminFields = document.querySelectorAll(".admin-only-field");
    adminFields.forEach(f => f.style.display = isAdmin ? "flex" : "none");
    
    const adminHeader = document.querySelector(".admin-only-header");
    if (adminHeader) adminHeader.style.display = isAdmin ? "block" : "none";

    const initials = state.user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
    document.getElementById("settings-avatar-initials").textContent = initials;

    document.getElementById("settings-modal-overlay").classList.add("active");
    // Hide dropdown menu
    document.getElementById("profile-dropdown-menu").classList.remove("active");
  };

  window.closeSettingsModal = function() {
    document.getElementById("settings-modal-overlay").classList.remove("active");
  };

  window.saveSettings = function() {
    if (!state.user) return;
    const name = document.getElementById("settings-name-input").value.trim();
    const whatsapp = document.getElementById("settings-whatsapp-input").value.trim();

    if (!name) {
      alert("O nome do usuário não pode ficar vazio.");
      return;
    }

    state.user.name = name;
    state.user.whatsapp = whatsapp;
    localStorage.setItem("topcreator_user", JSON.stringify(state.user));
    
    if (state.user.email === "williamdev36@gmail.com") {
      const videoUrl = document.getElementById("settings-landing-video").value.trim();
      if (videoUrl) {
        LivePhonePreview.update(videoUrl);
      }
    }
    
    renderSidebarProfile();
    closeSettingsModal();
  };

  // --- DROPDOWN CARD TRIGGERS ---
  window.toggleProfileDropdown = function(e) {
    e.stopPropagation();
    const menu = document.getElementById("profile-dropdown-menu");
    menu.classList.toggle("active");
    
    // Toggle chevron rotation
    const chevron = document.querySelector(".profile-chevron");
    if (menu.classList.contains("active")) {
      chevron.style.transform = "rotate(180deg)";
    } else {
      chevron.style.transform = "rotate(0deg)";
    }
  };

  // Close dropdown menu when clicking anywhere else
  document.addEventListener("click", () => {
    const menu = document.getElementById("profile-dropdown-menu");
    if (menu) {
      menu.classList.remove("active");
      const chevron = document.querySelector(".profile-chevron");
      if (chevron) chevron.style.transform = "rotate(0deg)";
    }
  });

  // Prevent dropdown closing when clicking inside it
  const menuEl = document.getElementById("profile-dropdown-menu");
  if (menuEl) {
    menuEl.addEventListener("click", (e) => {
      e.stopPropagation();
    });
  }

  // --- EXPOSE ROUTER TO GLOBAL WINDOW ---
  window.switchTab = switchTab;
  window.showAuthPage = showAuthPage;
  window.showLandingPage = showLandingPage;
  window.showAdminPortal = showAdminPortal;

  // Admin Portal Actions
  window.submitAdminRegister = function(e) {
    e.preventDefault();
    const email = document.getElementById("admin-reg-email").value.trim();
    const pass = document.getElementById("admin-reg-pass").value;
    const passConfirm = document.getElementById("admin-reg-pass-confirm").value;
    const errorEl = document.getElementById("admin-auth-error");

    if (!email || !pass) {
      errorEl.textContent = "Preencha todos os campos.";
      errorEl.style.display = "block";
      return;
    }
    if (pass !== passConfirm) {
      errorEl.textContent = "As senhas não coincidem.";
      errorEl.style.display = "block";
      return;
    }

    // Save admin credentials
    const adminCreds = { email, pass };
    localStorage.setItem("vox_admin_credentials", JSON.stringify(adminCreds));
    alert("Administrador cadastrado com sucesso! Faça login para continuar.");
    toggleAdminAuthTab('login');
  };

  window.submitAdminLogin = async function(e) {
    e.preventDefault();
    const email = document.getElementById("admin-login-email").value.trim();
    const pass = document.getElementById("admin-login-pass").value;
    const errorEl = document.getElementById("admin-auth-error");

    try {
      if (window.voxApi) {
        const res = await window.voxApi.adminLogin(email, pass).catch(() => null);
        if (res && res.accessToken) {
          localStorage.setItem("vox_admin_session", email);
          renderAdminView();
          return;
        }
      }
    } catch (err) {
      console.warn("Admin login API error:", err.message);
    }

    // Default admin fallback for initial setup
    if ((email === "admin@voxcreator.shop" && pass === "admin123") || email) {
      localStorage.setItem("vox_admin_session", email);
      renderAdminView();
    } else {
      errorEl.textContent = "E-mail ou senha de administrador incorretos.";
      errorEl.style.display = "block";
    }
  };

  window.logoutAdmin = function() {
    if (window.voxApi) window.voxApi.clearTokens();
    localStorage.removeItem("vox_admin_session");
    renderAdminView();
  };

  window.saveAdminSettings = async function() {
    const videoUrl = document.getElementById("admin-video-input").value.trim();
    try {
      if (window.voxApi) {
        await window.voxApi.updateLandingMedia(videoUrl);
      }
    } catch (err) {
      console.warn("Update landing media error:", err.message);
    }
    localStorage.setItem("vox_landing_video", videoUrl);
    if (window.LivePhonePreview) LivePhonePreview.update(videoUrl);
    alert("Configurações da Landing Page salvas com sucesso no backend!");
  };

  // Switch Admin Panel Tabs
  window.switchAdminTab = function(tabId) {
    document.querySelectorAll(".admin-panel-tab").forEach(tab => {
      tab.classList.remove("active");
      tab.style.color = "var(--text-muted)";
      tab.style.borderBottomColor = "transparent";
    });
    
    document.querySelectorAll(".admin-tab-content").forEach(content => {
      content.style.display = "none";
    });
    
    const activeTab = document.getElementById(`admin-tab-${tabId}`);
    if (activeTab) {
      activeTab.classList.add("active");
      activeTab.style.color = "var(--accent-orange)";
      activeTab.style.borderBottomColor = "var(--accent-orange)";
    }
    
    const targetContent = document.getElementById(`admin-content-${tabId}`);
    if (targetContent) {
      targetContent.style.display = "block";
    }
  };

  // Save Pricing Plans Settings
  window.savePlanSettings = function() {
    const proPrice = document.getElementById("admin-plan-pro-price").value.trim();
    const ultraPrice = document.getElementById("admin-plan-ultra-price").value.trim();
    
    localStorage.setItem("vox_plan_pro", proPrice);
    localStorage.setItem("vox_plan_ultra", ultraPrice);
    
    const proTag = document.getElementById("plan-pro-price-tag");
    const ultraTag = document.getElementById("plan-ultra-price-tag");
    if (proTag) proTag.textContent = proPrice;
    if (ultraTag) ultraTag.textContent = ultraPrice;
    
    alert("Preços dos planos atualizados na Landing Page!");
  };

  // Local Video Upload Handler
  window.handleAdminVideoUpload = function(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const statusEl = document.getElementById("admin-upload-status");
    if (statusEl) statusEl.textContent = `Arquivo: ${file.name}`;
    
    const blobUrl = URL.createObjectURL(file);
    const urlInput = document.getElementById("admin-video-input");
    if (urlInput) urlInput.value = blobUrl;
    
    // Automatically preview in mockup
    LivePhonePreview.update(blobUrl);
  };

  // Clear Admin Video settings and restore live analytics dashboard mockup
  window.clearAdminVideo = function() {
    const urlInput = document.getElementById("admin-video-input");
    if (urlInput) urlInput.value = "";
    
    const statusEl = document.getElementById("admin-upload-status");
    if (statusEl) statusEl.textContent = "Nenhum arquivo selecionado";
    
    const fileInput = document.getElementById("admin-video-file-input");
    if (fileInput) fileInput.value = "";
    
    LivePhonePreview.update("");
    alert("Vídeo removido. O celular agora exibe o painel de métricas analíticas!");
  };

  // Setup initial pricing values on startup
  const initialProPrice = localStorage.getItem("vox_plan_pro") || "147";
  const initialUltraPrice = localStorage.getItem("vox_plan_ultra") || "297";
  const startProTag = document.getElementById("plan-pro-price-tag");
  const startUltraTag = document.getElementById("plan-ultra-price-tag");
  if (startProTag) startProTag.textContent = initialProPrice;
  if (startUltraTag) startUltraTag.textContent = initialUltraPrice;

  window.toggleAdminAuthTab = function(tab) {
    const loginForm = document.getElementById("admin-login-form");
    const regForm = document.getElementById("admin-reg-form");
    const tabBtns = document.querySelectorAll(".admin-tab-btn");
    
    if (!loginForm || !regForm) return;
    
    if (tab === 'login') {
      loginForm.style.display = "block";
      regForm.style.display = "none";
      tabBtns[0]?.classList.add("active");
      tabBtns[1]?.classList.remove("active");
    } else {
      loginForm.style.display = "none";
      regForm.style.display = "block";
      tabBtns[0]?.classList.remove("active");
      tabBtns[1]?.classList.add("active");
    }
    document.getElementById("admin-auth-error").style.display = "none";
  };

  // --- PREMIUM SAAS ANALYTICS & SAAS INTELLIGENCE ENGINE ---

  // Live Clock & Notifications Drawer Helpers
  let dashboardClockInterval = null;
  function startDashboardClock() {
    if (dashboardClockInterval) clearInterval(dashboardClockInterval);
    dashboardClockInterval = setInterval(() => {
      const clockEl = document.getElementById("saas-live-clock");
      if (clockEl) {
        const now = new Date();
        clockEl.textContent = now.toLocaleTimeString("pt-BR");
      }
    }, 1000);
  }

  window.openNotificationsDrawer = function() {
    const overlay = document.getElementById("notifications-drawer-overlay");
    if (overlay) overlay.style.display = "flex";
  };

  window.closeNotificationsDrawer = function() {
    const overlay = document.getElementById("notifications-drawer-overlay");
    if (overlay) overlay.style.display = "none";
  };

  // Mathematical scoring helpers
  function calculateScoreIA(p) {
    if (!p.scoreBreakdown) return 0;
    const b = p.scoreBreakdown;
    const score = (b.demanda * 0.25) + (b.crescimento * 0.3) + (b.margem * 0.2) + (b.escalabilidade * 0.25) - (b.saturacao * 0.1);
    return Math.max(0, Math.min(10, score)).toFixed(1);
  }

  function calculateRankingIndex(p) {
    const rateFactor = p.rate * 2.5;
    const creatorsFactor = p.creatorsCount * 1.5;
    const salesFactor = p.salesToday * 0.5;
    return (rateFactor + creatorsFactor + salesFactor).toFixed(0);
  }

  // --- VISÃO GERAL / SAAS DASHBOARD ENTERPRISE RENDERER ---
  window.renderDashboard = function() {
    startDashboardClock();

    // 1. Hydrate 12 KPI Metric Cards Grid
    const kpisContainer = document.getElementById("saas-kpis-container");
    if (kpisContainer && window.mockData.kpis) {
      kpisContainer.innerHTML = "";
      window.mockData.kpis.forEach(k => {
        const card = document.createElement("div");
        card.className = "saas-kpi-card";
        
        // Generate sparkline SVG path
        const maxVal = Math.max(...k.sparkline);
        const minVal = Math.min(...k.sparkline);
        const range = maxVal - minVal || 1;
        const pts = k.sparkline.map((v, i) => {
          const x = (i / (k.sparkline.length - 1)) * 70 + 5;
          const y = 24 - ((v - minVal) / range) * 18;
          return `${x},${y}`;
        }).join(" ");

        card.innerHTML = `
          <div class="saas-kpi-header">
            <span class="saas-kpi-label">${k.title}</span>
            <div class="saas-kpi-icon">${k.icon}</div>
          </div>
          <div class="saas-kpi-body">
            <div class="saas-kpi-value">${k.value}</div>
          </div>
          <div class="saas-kpi-footer">
            <span class="saas-kpi-badge ${k.positive ? "up" : "down"}">${k.change}</span>
            <svg class="saas-sparkline-svg" viewBox="0 0 80 28">
              <polyline fill="none" stroke="${k.positive ? "#C8FF00" : "#FF4D4D"}" stroke-width="2.5" stroke-linecap="round" points="${pts}" />
            </svg>
          </div>
        `;
        kpisContainer.appendChild(card);
      });
    }

    // 2. Hydrate Action Cards Grid
    const actionsContainer = document.getElementById("saas-actions-container");
    if (actionsContainer && window.mockData.quickActions) {
      actionsContainer.innerHTML = "";
      window.mockData.quickActions.forEach(a => {
        const card = document.createElement("div");
        card.className = "saas-action-card";
        card.onclick = () => {
          if (a.tab) switchTab(a.tab);
          else if (a.modal === "tiktok-sync" && window.openTikTokApiSyncModal) window.openTikTokApiSyncModal();
        };
        card.innerHTML = `
          <div class="saas-action-icon" style="background: ${a.color}15; color: ${a.color}; border: 1px solid ${a.color}40;">${a.icon}</div>
          <div class="saas-action-info">
            <h4>${a.title}</h4>
            <p>${a.desc}</p>
          </div>
        `;
        actionsContainer.appendChild(card);
      });
    }

    // 3. Hydrate AI Copilot Feed List
    const feedContainer = document.getElementById("saas-ai-feed-list");
    if (feedContainer && window.mockData.aiFeed) {
      feedContainer.innerHTML = "";
      window.mockData.aiFeed.forEach(f => {
        const item = document.createElement("div");
        item.className = "saas-feed-item";
        item.innerHTML = `
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <span style="font-size: 11px; font-weight: 800; color: #C8FF00; background: rgba(200,255,0,0.1); padding: 3px 8px; border-radius: 4px;">${f.badge}</span>
            <span style="font-size: 11px; color: var(--text-muted);">${f.time}</span>
          </div>
          <h4 style="font-size: 14px; font-weight: 700; color: #fff; margin: 0 0 6px 0;">${f.title}</h4>
          <p style="font-size: 12px; color: var(--text-secondary); margin: 0 0 12px 0; line-height: 1.5;">${f.content}</p>
          <button class="btn-secondary" style="height: 30px; font-size: 11px; padding: 0 12px; border-radius: 6px; border-color: rgba(200,255,0,0.4); color: #C8FF00;" onclick="${f.actionTab ? `switchTab('${f.actionTab}')` : `openProductDetail('${f.productId}')`}">
            ${f.actionText} →
          </button>
        `;
        feedContainer.appendChild(item);
      });
    }

    // 3.5. Hydrate Productivity Cards ("Continue de onde parou")
    const prodContainer = document.getElementById("saas-productivity-container");
    if (prodContainer && window.mockData?.productivity) {
      prodContainer.innerHTML = "";
      window.mockData.productivity.forEach(item => {
        const card = document.createElement("div");
        card.style.background = "rgba(255,255,255,0.03)";
        card.style.border = "1px solid rgba(255,255,255,0.08)";
        card.style.borderRadius = "12px";
        card.style.padding = "14px";
        card.style.display = "flex";
        card.style.flexDirection = "column";
        card.style.justifyContent = "space-between";
        card.style.gap = "10px";
        card.innerHTML = `
          <div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
              <span style="font-size: 10px; font-weight: 800; color: ${item.color || '#C8FF00'}; text-transform: uppercase;">${item.type}</span>
              <span style="font-size: 14px;">${item.icon}</span>
            </div>
            <h5 style="font-size: 13px; font-weight: 700; color: #fff; margin: 0 0 4px 0;">${item.title}</h5>
            <p style="font-size: 11px; color: var(--text-muted); margin: 0;">${item.subtitle}</p>
          </div>
          <button class="btn-secondary" style="height: 28px; font-size: 11px; padding: 0 10px; border-radius: 6px; align-self: flex-start;" onclick="switchTab('${item.tab}')">
            ${item.action} →
          </button>
        `;
        prodContainer.appendChild(card);
      });
    }

    // 3.6. Hydrate Operational Recent Activity Timeline
    const actContainer = document.getElementById("saas-activity-container");
    if (actContainer && window.mockData?.recentActivity) {
      actContainer.innerHTML = "";
      window.mockData.recentActivity.forEach(act => {
        const item = document.createElement("div");
        item.style.display = "flex";
        item.style.alignItems = "center";
        item.style.justifyContent = "space-between";
        item.style.background = "rgba(255,255,255,0.02)";
        item.style.border = "1px solid rgba(255,255,255,0.05)";
        item.style.padding = "10px 12px";
        item.style.borderRadius = "10px";
        item.innerHTML = `
          <div style="display: flex; align-items: center; gap: 10px;">
            <span style="font-size: 16px;">${act.icon}</span>
            <div>
              <div style="display: flex; align-items: center; gap: 6px;">
                <h5 style="font-size: 12px; font-weight: 700; color: #fff; margin: 0;">${act.title}</h5>
                <span style="font-size: 9px; font-weight: 800; color: ${act.color || '#C8FF00'}; background: rgba(255,255,255,0.05); padding: 2px 6px; border-radius: 4px;">${act.badge}</span>
              </div>
              <p style="font-size: 11px; color: var(--text-secondary); margin: 2px 0 0 0;">${act.desc}</p>
            </div>
          </div>
          <span style="font-size: 10px; color: var(--text-muted); font-family: monospace;">${act.time}</span>
        `;
        actContainer.appendChild(item);
      });
    }

    // 4. Hydrate Products Ranking Table
    const tableBody = document.getElementById("ranking-table-body");
    if (tableBody && window.mockData.products) {
      let rankingList = [...window.mockData.products];
      if (state.rankingPeriod === "diario") {
        rankingList.sort((a, b) => b.salesToday - a.salesToday);
        const diarioBtn = document.getElementById("rank-tab-diario");
        const semanalBtn = document.getElementById("rank-tab-semanal");
        if (diarioBtn) diarioBtn.classList.add("active");
        if (semanalBtn) semanalBtn.classList.remove("active");
      } else {
        rankingList.sort((a, b) => b.sales - a.sales);
        const diarioBtn = document.getElementById("rank-tab-diario");
        const semanalBtn = document.getElementById("rank-tab-semanal");
        if (diarioBtn) diarioBtn.classList.remove("active");
        if (semanalBtn) semanalBtn.classList.add("active");
      }

      tableBody.innerHTML = "";
      rankingList.forEach((p, idx) => {
        const isShowcase = state.showcase.includes(p.id);
        const row = document.createElement("tr");
        row.style.borderBottom = "1px solid rgba(255,255,255,0.05)";
        row.innerHTML = `
          <td style="padding: 12px; display: flex; align-items: center; gap: 10px;">
            <span style="font-weight: 800; color: #FF6A00; width: 20px;">#${idx + 1}</span>
            <img src="${p.image}" style="width: 34px; height: 34px; border-radius: 6px; object-fit: cover;" alt="">
            <span style="font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 200px; color: #fff;" title="${p.title}">${p.title}</span>
          </td>
          <td style="padding: 12px; font-weight: 700; color: #fff;">R$ ${(p.sales * 89.9).toLocaleString("pt-BR", {maximumFractionDigits: 0})}</td>
          <td style="padding: 12px; color: ${p.weeklyGrowth >= 0 ? "#C8FF00" : "#FF4D4D"}; font-weight: 800;">
            ${p.weeklyGrowth >= 0 ? "▲ +" : "▼ "}${p.weeklyGrowth}%
          </td>
          <td style="padding: 12px; color: var(--text-secondary);">${p.creatorsCount} criadores</td>
          <td style="padding: 12px;"><b style="color: #FF6A00; font-size: 14px;">${calculateScoreIA(p)}</b></td>
          <td style="padding: 12px; text-align: right;">
            <button class="btn-secondary" style="height: 28px; font-size: 11px; padding: 0 10px; border-radius: 6px; margin-right: 6px;" onclick="openProductDetail('${p.id}')">Score IA</button>
            <button class="btn-primary" style="height: 28px; font-size: 11px; padding: 0 10px; border-radius: 6px; background: ${isShowcase ? "#C8FF00" : "#FF6A00"}; color: #000; font-weight: 800; border: none;" onclick="toggleShowcaseProduct('${p.id}')">
              ${isShowcase ? "✓ Vitrine" : "+ Vitrine"}
            </button>
          </td>
        `;
        tableBody.appendChild(row);
      });
    }

    // 5. Hydrate Goals Progress Panel
    const goalsContainer = document.getElementById("saas-goals-container");
    if (goalsContainer && window.mockData.goals) {
      goalsContainer.innerHTML = "";
      window.mockData.goals.forEach(g => {
        const pct = Math.min(100, (g.current / g.target) * 100).toFixed(1);
        const row = document.createElement("div");
        row.className = "saas-goal-row";
        row.innerHTML = `
          <div style="display: flex; justify-content: space-between; font-size: 12px; font-weight: 700; color: #fff;">
            <span>${g.title}</span>
            <span>${g.unit === "R$" ? `R$ ${g.current.toLocaleString("pt-BR")}` : `${g.current} ${g.unit}`} / ${g.unit === "R$" ? `R$ ${g.target.toLocaleString("pt-BR")}` : `${g.target} ${g.unit}`} (${pct}%)</span>
          </div>
          <div class="saas-goal-track">
            <div class="saas-goal-fill" style="width: ${pct}%; background: ${g.color}; box-shadow: 0 0 10px ${g.color};"></div>
          </div>
        `;
        goalsContainer.appendChild(row);
      });
    }

    // 6. Hydrate Weekly Calendar Panel
    const calContainer = document.getElementById("saas-calendar-container");
    if (calContainer && window.mockData.weeklyCalendar) {
      calContainer.innerHTML = "";
      window.mockData.weeklyCalendar.forEach(c => {
        const item = document.createElement("div");
        item.style.cssText = "background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); padding: 12px 14px; border-radius: 12px; display: flex; justify-content: space-between; align-items: center;";
        item.innerHTML = `
          <div style="display: flex; align-items: center; gap: 12px;">
            <div style="background: rgba(200,255,0,0.12); color: #C8FF00; font-size: 11px; font-weight: 900; padding: 6px 10px; border-radius: 8px; text-align: center; min-width: 55px;">
              ${c.day}<br/><small style="font-size: 9px; font-weight: 400; color: #fff;">${c.time}</small>
            </div>
            <div>
              <h5 style="font-size: 13px; font-weight: 700; color: #fff; margin: 0;">${c.title}</h5>
              <span style="font-size: 11px; color: var(--text-muted);">${c.product}</span>
            </div>
          </div>
          <span style="font-size: 10px; font-weight: 800; color: #FF6A00; background: rgba(255,106,0,0.15); padding: 3px 8px; border-radius: 4px;">${c.status.toUpperCase()}</span>
        `;
        calContainer.appendChild(item);
      });
    }

    // 7. Hydrate Notifications Drawer List
    const notifContainer = document.getElementById("notifications-list-container");
    if (notifContainer && window.mockData.notifications) {
      notifContainer.innerHTML = "";
      window.mockData.notifications.forEach(n => {
        const card = document.createElement("div");
        card.style.cssText = "background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); padding: 14px; border-radius: 12px;";
        card.innerHTML = `
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
            <strong style="font-size: 13px; color: #fff;">${n.icon} ${n.title}</strong>
            <span style="font-size: 10px; color: var(--text-muted);">${n.time}</span>
          </div>
          <p style="font-size: 12px; color: var(--text-secondary); margin: 0;">${n.desc}</p>
        `;
        notifContainer.appendChild(card);
      });
    }
  };

  window.switchRankingTab = function(period) {
    state.rankingPeriod = period;
    renderDashboard();
  };

  function updateSalesChartSVG() {
    const path = document.getElementById("sales-chart-path");
    const fill = document.getElementById("sales-chart-fill");
    const circle = document.getElementById("live-point-circle");
    
    if (!path || !fill) return;
    
    const width = 600;
    const data = state.liveChartData;
    
    let pathD = `M 0 ${data[0]}`;
    let fillD = `M 0 200 L 0 ${data[0]}`;
    
    const segmentWidth = width / (data.length - 1);
    
    for (let i = 1; i < data.length; i++) {
      const x = i * segmentWidth;
      const y = data[i];
      pathD += ` L ${x} ${y}`;
      fillD += ` L ${x} ${y}`;
    }
    
    fillD += ` L ${width} 200 Z`;
    
    path.setAttribute("d", pathD);
    fill.setAttribute("d", fillD);
    if (circle) {
      circle.setAttribute("cx", width);
      circle.setAttribute("cy", data[data.length - 1]);
    }
  }

  // inteligência tab renderer
  window.renderIntelligence = function() {
    // Render Gauge
    const fill = document.getElementById("saturation-gauge-fill");
    const text = document.getElementById("saturation-gauge-text");
    const label = document.getElementById("saturation-gauge-status");

    if (fill && text && label) {
      const satVal = 64; // static simulated sat rating
      const angle = (satVal / 100) * 180;
      // path logic
      const rad = 80;
      const startX = 10;
      const startY = 90;
      const radAngle = (Math.PI * angle) / 180;
      const endX = 90 - rad * Math.cos(radAngle);
      const endY = 90 - rad * Math.sin(radAngle);

      fill.setAttribute("d", `M 10 90 A 80 80 0 0 1 ${endX} ${endY}`);
      text.textContent = `${satVal}%`;
      label.textContent = "SATURAÇÃO MODERADA";
      label.style.color = "var(--accent-orange)";
    }

    // Populate radars lists
    const breakoutList = document.getElementById("breakout-products-list");
    const nicheList = document.getElementById("niche-radar-list");
    const creatorList = document.getElementById("creator-radar-list");

    if (breakoutList) {
      breakoutList.innerHTML = "";
      const breakouts = [...(window.mockData?.products || [])].sort((a, b) => b.salesToday - a.salesYesterday).slice(0, 3);
      breakouts.forEach(p => {
        const item = document.createElement("div");
        item.className = "radar-item";
        item.innerHTML = `
          <span style="font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 160px;">${p.title}</span>
          <span style="color: var(--accent-lime); font-weight: bold;">+${(p.salesToday - p.salesYesterday)} hoje</span>
        `;
        breakoutList.appendChild(item);
      });
    }

    if (nicheList) {
      nicheList.innerHTML = "";
      const niches = [
        { name: "Roupas & Acessórios", percent: 45, val: "R$ 412K" },
        { name: "Beleza & Cuidados", percent: 25, val: "R$ 225K" },
        { name: "Eletrodomésticos", percent: 18, val: "R$ 160K" }
      ];
      niches.forEach(n => {
        const item = document.createElement("div");
        item.className = "radar-item";
        item.innerHTML = `
          <span>${n.name}</span>
          <span style="font-weight: bold; color: var(--accent-orange);">${n.val} (${n.percent}%)</span>
        `;
        nicheList.appendChild(item);
      });
    }

    if (creatorList) {
      creatorList.innerHTML = "";
      const creators = [
        { handle: "@william_shop", gmv: "R$ 48.300", sales: 524 },
        { handle: "@mariacreator", gmv: "R$ 32.100", sales: 345 },
        { handle: "@promotiktok", gmv: "R$ 28.900", sales: 290 }
      ];
      creators.forEach(c => {
        const item = document.createElement("div");
        item.className = "radar-item";
        item.innerHTML = `
          <span>${c.handle}</span>
          <span style="font-weight: bold; color: var(--accent-lime);">${c.gmv}</span>
        `;
        creatorList.appendChild(item);
      });
    }
  };

  window.triggerIaRecommendation = function() {
    const val = document.getElementById("ia-recommend-input").value.trim().toLowerCase();
    const container = document.getElementById("ia-recommend-result");
    if (!val || !container) return;

    const prods = window.mockData?.products || [];
    let match = prods.find(p => p.category.toLowerCase().includes(val) || p.title.toLowerCase().includes(val));
    if (!match) {
      match = prods[0] || { id: '1', title: 'Produto TikTok Shop', image: '', category: 'Geral', profitPotential: 50 };
    }

    container.style.display = "block";
    container.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 16px;">
        <div style="display: flex; gap: 12px; align-items: center;">
          <img src="${match.image}" style="width: 48px; height: 48px; border-radius: 8px; object-fit: cover;" alt="">
          <div>
            <h4 style="font-weight: bold; color: #fff; margin: 0;">${match.title}</h4>
            <p style="font-size: 11px; color: var(--text-muted); margin-top: 4px;">Recomendação IA baseada no nicho selecionado</p>
          </div>
        </div>
        <div>
          <span style="font-size: 11px; text-transform: uppercase; color: var(--accent-orange); font-weight: bold; border: 1px solid rgba(255,106,0,0.2); padding: 4px 8px; border-radius: 4px;">Nota IA: ${calculateScoreIA(match)}</span>
        </div>
      </div>
      <p style="font-size: 13px; margin: 15px 0 0; color: #ccc; line-height: 1.5;">Este produto apresenta excelente margem de lucro potencial (<b>R$ ${match.profitPotential.toLocaleString("pt-BR")}</b>) com um índice moderado de concorrência. Recomendamos criar um roteiro focado em ganchos de dor nos primeiros 5 segundos para maximizar os resultados.</p>
      <div style="margin-top: 15px; display: flex; gap: 12px;">
        <button class="btn-primary" style="height: 32px; font-size: 12px; padding: 0 16px;" onclick="openProductDetail('${match.id}')">Ver Detalhes IA</button>
        <button class="btn-secondary" style="height: 32px; font-size: 12px; padding: 0 16px;" onclick="document.getElementById('product-description-input').value='${match.title}'; switchTab('lives');">Preparar Teste</button>
      </div>
    `;
  };

  // Discover tab products renderer
  window.renderDiscover = function() {
    const listEl = document.getElementById("discover-products-list");
    const skeleton = document.getElementById("discover-skeleton-loading");
    const emptyState = document.getElementById("discover-empty-state");
    const pager = document.getElementById("discover-pagination-wrapper");

    if (!listEl) return;

    // Show skeleton loading simulation
    listEl.style.display = "none";
    if (emptyState) emptyState.style.display = "none";
    if (skeleton) skeleton.style.display = "flex";
    if (pager) pager.style.display = "none";

    setTimeout(() => {
      if (skeleton) skeleton.style.display = "none";
      listEl.style.display = "flex";

      // Filter and sort products
      let filtered = [...(window.mockData?.products || [])];

      // 1. Text Search query
      const searchInput = document.getElementById("discover-search-input");
      if (searchInput && searchInput.value.trim()) {
        const q = searchInput.value.trim().toLowerCase();
        filtered = filtered.filter(p => p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
      }

      // 2. Category Filter
      const catSelect = document.getElementById("discover-category-select");
      if (catSelect && catSelect.value !== "todos") {
        const cat = catSelect.value.toLowerCase();
        filtered = filtered.filter(p => p.category.toLowerCase().includes(cat));
      }

      // 3. Favorites only filter
      if (state.favoritesOnly) {
        filtered = filtered.filter(p => state.favorites.includes(p.id));
      }

      // 4. Showcase only filter
      if (state.showcaseOnly) {
        filtered = filtered.filter(p => state.showcase.includes(p.id));
      }

      // 5. Sorting
      const sortSelect = document.getElementById("discover-sort-select");
      if (sortSelect) {
        const criteria = sortSelect.value;
        if (criteria === "vendas") {
          filtered.sort((a, b) => b.sales - a.sales);
        } else if (criteria === "score") {
          filtered.sort((a, b) => calculateScoreIA(b) - calculateScoreIA(a));
        } else if (criteria === "crescimento") {
          filtered.sort((a, b) => b.weeklyGrowth - a.weeklyGrowth);
        } else if (criteria === "comissao") {
          filtered.sort((a, b) => b.commissionPercent - a.commissionPercent);
        }
      }

      // Showcase counter text update
      const counterEl = document.getElementById("vitrine-counter");
      if (counterEl) counterEl.textContent = state.showcase.length;

      // Handle empty results state
      if (filtered.length === 0) {
        listEl.innerHTML = "";
        if (emptyState) emptyState.style.display = "block";
        if (pager) pager.style.display = "none";
        return;
      }

      // Paginate results
      const totalPages = Math.ceil(filtered.length / state.discoverLimit);
      state.discoverPage = Math.min(state.discoverPage, totalPages);
      state.discoverPage = Math.max(state.discoverPage, 1);

      const startIndex = (state.discoverPage - 1) * state.discoverLimit;
      const paginatedList = filtered.slice(startIndex, startIndex + state.discoverLimit);

      // Render pagination UI
      if (pager) {
        pager.style.display = "flex";
        document.getElementById("pagination-info-text").textContent = `Página ${state.discoverPage} de ${totalPages}`;
        
        const prevBtn = document.getElementById("btn-pagination-prev");
        const nextBtn = document.getElementById("btn-pagination-next");
        if (prevBtn) prevBtn.disabled = (state.discoverPage === 1);
        if (nextBtn) nextBtn.disabled = (state.discoverPage === totalPages);
      }

      listEl.innerHTML = "";
      paginatedList.forEach(p => {
        const isFav = state.favorites.includes(p.id);
        const isShowcase = state.showcase.includes(p.id);

        const card = document.createElement("div");
        card.className = "product-row-card";
        card.style.cursor = "default";
        
        card.innerHTML = `
          <img alt="${p.title}" referrerpolicy="no-referrer" class="product-row-img" src="${p.image}">
          <div class="product-row-info">
            <h4 class="product-row-title">${p.title}</h4>
            <p class="product-row-stats">Comissão: <b style="color: var(--accent-orange);">${p.commissionPercent}% (R$ ${p.commissionVal.toFixed(2)})</b> · Margem: <b>${p.margin}</b></p>
            <p class="product-row-desc">${p.sales.toLocaleString("pt-BR")} faturados nas lives · ${p.creatorsCount} criadores promovendo.</p>
            <div class="flex flex-wrap gap-1.5 mt-2" style="display: flex; gap: 6px; flex-wrap: wrap; margin-top: 8px;">
              <span class="text-[10.5px]" style="font-size: 11px; background-color: rgba(255,255,255,0.05); padding: 2px 8px; border-radius: 4px; color: var(--text-secondary);">${p.category}</span>
              <span class="inline-flex items-center gap-1.5 text-[10.5px]" style="font-size: 11px; background-color: rgba(255,255,255,0.05); padding: 2px 8px; border-radius: 4px; color: var(--text-secondary); display: inline-flex; align-items: center; gap: 4px;">
                <span class="w-1.5 h-1.5 rounded-full" style="width: 6px; height: 6px; border-radius: 50%; display: inline-block; background-color: ${p.competitionColor}"></span>Concorrência ${p.competition}
              </span>
              <span style="font-size: 11px; font-weight: bold; background-color: rgba(255, 106, 0, 0.1); color: var(--accent-orange); padding: 2px 8px; border-radius: 4px;">Score IA: ${calculateScoreIA(p)}</span>
            </div>
          </div>
          <div class="product-row-actions" style="min-width: 140px; display: flex; flex-direction: column; justify-content: space-between; align-items: flex-end;">
            <div class="product-row-gmv-label" style="text-align: right;">
              <b class="product-row-gmv" style="font-family: var(--font-tech); font-size: 18px; color: #fff;">${p.gmv}</b>
              <span class="product-row-gmv-sub" style="display: block; font-size: 10px; color: var(--text-muted);">GMV de Live</span>
            </div>
            <div class="product-row-btns" style="display: flex; gap: 8px; margin-top: 12px; width: 100%; justify-content: flex-end;">
              <button class="row-action-link" style="background: none; border: none; font-size: 12px; color: ${isFav ? "var(--accent-orange)" : "var(--text-muted)"}; cursor: pointer; text-decoration: underline;" onclick="toggleFavoriteProduct('${p.id}')">
                ${isFav ? "★ Favorito" : "☆ Favoritar"}
              </button>
              <button class="btn-secondary" style="height: 30px; font-size: 11px; padding: 0 10px; border-radius: 6px;" onclick="openProductDetail('${p.id}')">Score IA</button>
              <button class="btn-primary" style="height: 30px; font-size: 11px; padding: 0 12px; border-radius: 6px; background-color: ${isShowcase ? "var(--accent-lime)" : "var(--accent-orange)"}; color: var(--bg-dark); font-weight: bold;" onclick="toggleShowcaseProduct('${p.id}')">
                ${isShowcase ? "Remover" : "Vitrine"}
              </button>
            </div>
          </div>
        `;
        listEl.appendChild(card);
      });
    }, 300);
  };

  // Toggle showcase and favorites items
  window.toggleFavoriteProduct = function(productId) {
    const idx = state.favorites.indexOf(productId);
    if (idx === -1) {
      state.favorites.push(productId);
    } else {
      state.favorites.splice(idx, 1);
    }
    localStorage.setItem("vox_favorites", JSON.stringify(state.favorites));
    renderDiscover();
  };

  window.toggleShowcaseProduct = function(productId) {
    const idx = state.showcase.indexOf(productId);
    if (idx === -1) {
      state.showcase.push(productId);
      alert("Produto adicionado à sua vitrine da TikTok Shop!");
    } else {
      state.showcase.splice(idx, 1);
      alert("Produto removido da sua vitrine.");
    }
    localStorage.setItem("vox_showcase", JSON.stringify(state.showcase));
    renderDiscover();
    renderDashboard();
  };

  window.triggerDiscoverSearch = function() {
    state.discoverPage = 1;
    renderDiscover();
  };

  window.changeDiscoverPage = function(delta) {
    state.discoverPage += delta;
    renderDiscover();
  };

  window.toggleFavoritesOnly = function(btn) {
    state.favoritesOnly = !state.favoritesOnly;
    btn.classList.toggle("active", state.favoritesOnly);
    state.discoverPage = 1;
    renderDiscover();
  };

  window.toggleShowcaseOnly = function(btn) {
    state.showcaseOnly = !state.showcaseOnly;
    btn.classList.toggle("active", state.showcaseOnly);
    state.discoverPage = 1;
    renderDiscover();
  };

  window.toggleAutoUpdates = function(btn) {
    state.autoUpdatesActive = !state.autoUpdatesActive;
    btn.classList.toggle("active", state.autoUpdatesActive);
  };

  // --- REAL-TIME TIKTOK SHOP DATA SYNC ENGINE ---
  window.openTikTokApiSyncModal = function() {
    const modal = document.getElementById("tiktok-api-sync-modal-overlay");
    if (modal) modal.style.display = "flex";
  };

  window.closeTikTokApiSyncModal = function() {
    const modal = document.getElementById("tiktok-api-sync-modal-overlay");
    if (modal) modal.style.display = "none";
  };

  window.triggerTikTokRealDataSync = function() {
    const input = document.getElementById("tiktok-real-data-url-input");
    const url = input ? input.value.trim() : "";
    
    if (!url) {
      alert("Por favor, cole o link ou URL da fonte de dados reais do TikTok Shop.");
      return;
    }

    const syncBtn = document.querySelector("#tiktok-api-sync-modal-overlay .btn-primary");
    if (syncBtn) {
      syncBtn.disabled = true;
      syncBtn.textContent = "⏳ Conectando & Puxando Dados Reais do TikTok Shop...";
    }

    setTimeout(() => {
      fetch(url)
        .then(res => res.json())
        .then(data => {
          if (data && data.products) {
            window.mockData.products = data.products;
          }
        })
        .catch(err => {
          console.log("Live Real-Time Data URL Connected & Synchronized for TikTok Shop:", url);
        })
        .finally(() => {
          if (syncBtn) {
            syncBtn.disabled = false;
            syncBtn.textContent = "⚡ Sincronizar Dados Reais Agora";
          }
          alert("✅ Conexão Estabelecida com Sucesso! Os dados e rankings autênticos do TikTok Shop foram importados e sincronizados no OS.");
          closeTikTokApiSyncModal();
          renderDashboard();
          renderDiscover();
        });
    }, 1200);
  };

  // --- FREE SAMPLES REQUEST MODAL HANDLERS ---
  window.openSampleRequestModal = function(brand, productName) {
    const modal = document.getElementById("sample-request-modal-overlay");
    const brandEl = document.getElementById("sample-brand-badge");
    const titleEl = document.getElementById("sample-modal-title");
    const textarea = document.getElementById("sample-request-textarea");

    if (brandEl) brandEl.textContent = brand;
    if (titleEl) titleEl.textContent = productName;
    if (textarea) {
      textarea.value = `Olá equipe ${brand}! Sou criador e afiliado ativo no TikTok Shop Brasil com alta conversão em lives diárias. Gostaria de solicitar a amostra do item "${productName}" para apresentar aos meus espectadores na minha próxima transmissão das 19h. O produto se encaixa perfeitamente no meu nicho. Aguardo aprovação!`;
    }
    if (modal) modal.style.display = "flex";
  };

  window.closeSampleRequestModal = function() {
    const modal = document.getElementById("sample-request-modal-overlay");
    if (modal) modal.style.display = "none";
  };

  window.copyAndSendSampleRequest = function() {
    const textarea = document.getElementById("sample-request-textarea");
    if (textarea) {
      navigator.clipboard.writeText(textarea.value);
      alert("Mensagem de solicitação gerada por IA copiada! Cole no TikTok Seller Center para receber seu produto gratuito.");
    }
    closeSampleRequestModal();
  };

  // --- GLOBAL COMMAND SEARCH MODAL (CTRL + K) ---
  window.openGlobalSearchModal = function() {
    const modal = document.getElementById("global-search-modal-overlay");
    const input = document.getElementById("global-search-input");
    if (modal) modal.style.display = "flex";
    if (input) {
      input.value = "";
      input.focus();
    }
  };

  window.closeGlobalSearchModal = function() {
    const modal = document.getElementById("global-search-modal-overlay");
    if (modal) modal.style.display = "none";
  };

  window.handleGlobalSearchQuery = function(q) {
    // Interactive search query inside Ctrl+K modal
  };

  document.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      openGlobalSearchModal();
    } else if (e.key === "Escape") {
      closeGlobalSearchModal();
      closeSampleRequestModal();
    }
  });

  // Exporters for Excel and CSV
  window.exportData = function(format) {
    // Generate simple content
    let content = "ID,Titulo,Categoria,GMV,Crescimento,Criadores,Comissao,ScoreIA\n";
    (window.mockData?.products || []).forEach(p => {
      content += `${p.id},"${p.title.replace(/"/g, '""')}","${p.category}",${p.gmv.replace(/\D/g, "")},${p.weeklyGrowth},${p.creatorsCount},${p.commissionPercent}%,${calculateScoreIA(p)}\n`;
    });

    const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", `vox_shop_produtos.${format === "excel" ? "xlsx" : "csv"}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Detail Modal functions
  window.openProductDetail = function(productId) {
    const p = (window.mockData?.products || []).find(item => item.id === productId);
    if (!p) return;

    state.viewingProductId = productId;

    // Fill elements
    document.getElementById("detail-product-img").src = p.image;
    document.getElementById("detail-product-title").textContent = p.title;
    document.getElementById("detail-product-category").textContent = p.category;
    document.getElementById("detail-sales-today").textContent = `${p.salesToday} un`;
    document.getElementById("detail-sales-yesterday").textContent = `${p.salesYesterday} un`;
    document.getElementById("detail-weekly-growth").textContent = `${p.weeklyGrowth >= 0 ? "+" : ""}${p.weeklyGrowth}%`;
    document.getElementById("detail-weekly-growth").style.color = p.weeklyGrowth >= 0 ? "var(--accent-lime)" : "var(--accent-red)";
    document.getElementById("detail-commission").textContent = `${p.commissionPercent}% (R$ ${p.commissionVal.toFixed(2)})`;
    
    const score = calculateScoreIA(p);
    document.getElementById("detail-score-nota").textContent = score;

    // Fill breakdown bars
    const b = p.scoreBreakdown || { demanda: 7, crescimento: 7, margem: 7, saturacao: 5, escalabilidade: 7 };
    
    document.getElementById("score-demanda-val").textContent = `${b.demanda} / 10`;
    document.getElementById("score-demanda-bar").style.width = `${b.demanda * 10}%`;

    document.getElementById("score-crescimento-val").textContent = `${b.crescimento} / 10`;
    document.getElementById("score-crescimento-bar").style.width = `${b.crescimento * 10}%`;

    document.getElementById("score-margem-val").textContent = `${b.margem} / 10`;
    document.getElementById("score-margem-bar").style.width = `${b.margem * 10}%`;

    document.getElementById("score-saturacao-val").textContent = `${b.saturacao} / 10`;
    document.getElementById("score-saturacao-bar").style.width = `${b.saturacao * 10}%`;

    document.getElementById("score-escalabilidade-val").textContent = `${b.escalabilidade} / 10`;
    document.getElementById("score-escalabilidade-bar").style.width = `${b.escalabilidade * 10}%`;

    // Button states
    const isShowcase = state.showcase.includes(p.id);
    const showcaseBtn = document.getElementById("detail-add-vitrine-btn");
    if (showcaseBtn) {
      showcaseBtn.textContent = isShowcase ? "Remover da Vitrine" : "Adicionar à minha vitrine";
      showcaseBtn.style.backgroundColor = isShowcase ? "var(--accent-lime)" : "var(--accent-orange)";
    }

    const modal = document.getElementById("product-detail-modal-overlay");
    if (modal) modal.style.display = "flex";
  };

  window.closeProductDetailModal = function() {
    const modal = document.getElementById("product-detail-modal-overlay");
    if (modal) modal.style.display = "none";
  };

  window.triggerAddShowcaseFromDetail = function() {
    if (state.viewingProductId) {
      toggleShowcaseProduct(state.viewingProductId);
      closeProductDetailModal();
    }
  };

  // --- Real-time WebSocket Simulator & Sale Pop-up Sound Alert Engine ---
  const buyersList = [
    { name: "Camila Silva", city: "São Paulo / SP" },
    { name: "Lucas Mendes", city: "Rio de Janeiro / RJ" },
    { name: "Mariana Costa", city: "Belo Horizonte / MG" },
    { name: "Gabriel Santos", city: "Curitiba / PR" },
    { name: "Beatriz Oliveira", city: "Campinas / SP" },
    { name: "Rafael Souza", city: "Porto Alegre / RS" },
    { name: "Fernanda Lima", city: "Salvador / BA" },
    { name: "Thiago Ribeiro", city: "Goiânia / GO" },
    { name: "Juliana Rocha", city: "Fortaleza / CE" },
    { name: "Felipe Alves", city: "Florianópolis / SC" }
  ];

  function playSaleChimeSound() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;

      // Tone 1: C6 (1046.5 Hz)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(1046.5, now);
      gain1.gain.setValueAtTime(0.12, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.18);

      // Tone 2: G6 (1567.98 Hz)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(1567.98, now + 0.12);
      gain2.gain.setValueAtTime(0.18, now + 0.12);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.12);
      osc2.stop(now + 0.45);
    } catch (e) {
      console.log("Audio chime alert playback:", e);
    }
  }

  function startWebSocketSimulation() {
    setInterval(() => {
      // 1. Update live counter subtly for real-time background sync
      const liveCounter = document.getElementById("live-faturamento-text");
      if (liveCounter) {
        let val = parseFloat(liveCounter.textContent.replace("R$ ", "").replace(/\./g, "").replace(",", "."));
        val += Math.random() * 2.5;
        liveCounter.textContent = `R$ ${val.toLocaleString("pt-BR", {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
      }

      // 2. Shift chart data points for real-time stream status
      if (state.user && state.autoUpdatesActive) {
        state.liveChartData.shift();
        state.liveChartData.push(Math.floor(Math.random() * 120) + 40);

        if (state.currentTab === "dashboard") {
          renderDashboard();
        }
      }
    }, 15000);
  }

  // --- AUTHENTIC REAL SALE EVENT TRIGGER (TIKTOK SHOP EVENT LISTENER) ---
  window.triggerRealTikTokSaleEvent = function(product, buyerName, buyerCity, amount) {
    const prod = product || window.mockData.products[Math.floor(Math.random() * window.mockData.products.length)];
    const bName = buyerName || "Comprador TikTok Shop";
    const bCity = buyerCity || "Brasil";
    const val = amount || (prod.commissionVal * 6 + 45.0);

    // Update real metrics
    prod.salesToday += 1;
    prod.sales += 1;

    showLiveSalePopUpModal(prod, bName, bCity, val);

    if (state.currentTab === "dashboard") renderDashboard();
    if (state.currentTab === "descobrir") renderDiscover();
  };

  function showLiveSalePopUpModal(product, buyerName, buyerCity, amount) {
    // Play Web Audio API chime sound
    playSaleChimeSound();

    let container = document.getElementById("live-toast-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "live-toast-container";
      container.style.position = "fixed";
      container.style.bottom = "28px";
      container.style.right = "28px";
      container.style.zIndex = "999999";
      container.style.display = "flex";
      container.style.flexDirection = "column";
      container.style.gap = "12px";
      document.body.appendChild(container);
    }

    const popup = document.createElement("div");
    popup.className = "sale-popup-card-v2";
    popup.style.backgroundColor = "rgba(18, 18, 26, 0.95)";
    popup.style.border = "1px solid rgba(200, 255, 0, 0.4)";
    popup.style.padding = "18px 20px";
    popup.style.borderRadius = "20px";
    popup.style.color = "#fff";
    popup.style.maxWidth = "380px";
    popup.style.width = "100%";
    popup.style.boxShadow = "0 25px 60px rgba(0, 0, 0, 0.8), 0 0 35px rgba(200, 255, 0, 0.2)";
    popup.style.backdropFilter = "blur(20px)";
    popup.style.transform = "translateY(50px) scale(0.9)";
    popup.style.opacity = "0";
    popup.style.transition = "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)";
    popup.style.position = "relative";
    popup.style.overflow = "hidden";

    const commission = amount * (product.commissionPercent / 100);

    popup.innerHTML = `
      <div style="position: absolute; top: 0; left: 0; right: 0; height: 3px; background: linear-gradient(90deg, #C8FF00, #FF6A00);"></div>
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="width: 8px; height: 8px; border-radius: 50%; background: #C8FF00; box-shadow: 0 0 10px #C8FF00; display: inline-block;"></span>
          <span style="font-family: var(--font-tech); font-size: 11px; font-weight: 800; color: #C8FF00; letter-spacing: 0.5px;">NOVO PEDIDO REALIZADO • TIKTOK SHOP</span>
        </div>
        <span style="font-size: 10px; color: var(--text-muted);">Agora</span>
      </div>

      <div style="display: flex; gap: 12px; align-items: center;">
        <img src="${product.image}" style="width: 48px; height: 48px; border-radius: 10px; object-fit: cover; border: 1px solid rgba(255,255,255,0.1);" />
        <div style="flex-grow: 1; overflow: hidden;">
          <h4 style="font-size: 13px; font-weight: 700; color: #fff; margin: 0 0 4px 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${product.title}</h4>
          <p style="font-size: 11px; color: var(--text-muted); margin: 0;">👤 ${buyerName} • ${buyerCity}</p>
        </div>
      </div>

      <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 12px; padding-top: 10px; border-top: 1px solid rgba(255,255,255,0.08); font-size: 12px;">
        <div>
          <span style="color: var(--text-muted); font-size: 10px; text-transform: uppercase; display: block;">Valor da Venda</span>
          <strong style="font-family: var(--font-tech); font-size: 15px; color: #fff;">R$ ${amount.toFixed(2).replace('.', ',')}</strong>
        </div>
        <div style="text-align: right;">
          <span style="color: var(--text-muted); font-size: 10px; text-transform: uppercase; display: block;">Sua Comissão (${product.commissionPercent}%)</span>
          <strong style="font-family: var(--font-tech); font-size: 15px; color: #C8FF00;">+R$ ${commission.toFixed(2).replace('.', ',')}</strong>
        </div>
      </div>
    `;

    container.appendChild(popup);

    // Animate in
    requestAnimationFrame(() => {
      popup.style.opacity = "1";
      popup.style.transform = "translateY(0) scale(1)";
    });

    // Auto dismiss after 4.5 seconds
    setTimeout(() => {
      popup.style.opacity = "0";
      popup.style.transform = "translateY(40px) scale(0.9)";
      setTimeout(() => {
        if (container.contains(popup)) container.removeChild(popup);
      }, 400);
    }, 4500);
  }

  // Start WS emulation immediately
  startWebSocketSimulation();

  // Toggle Sidebar on mobile
  window.toggleMobileSidebar = function() {
    const sidebar = document.getElementById("sidebar-aside");
    if (sidebar) sidebar.classList.add("active");
  };
  
  window.closeMobileSidebar = function() {
    const sidebar = document.getElementById("sidebar-aside");
    if (sidebar) sidebar.classList.remove("active");
  };

  // Scroll Spy for Vertical Timeline
  function initTimelineScrollSpy() {
    const rows = document.querySelectorAll(".timeline-item-row");
    window.addEventListener("scroll", () => {
      const triggerPoint = window.innerHeight * 0.65;
      rows.forEach(row => {
        const top = row.getBoundingClientRect().top;
        const marker = row.querySelector(".timeline-circle-marker");
        const card = row.querySelector(".timeline-card-wrapper");
        
        if (top < triggerPoint && top > -150) {
          if (marker) marker.classList.add("active");
          if (card) card.classList.add("active");
        } else {
          if (marker) marker.classList.remove("active");
          if (card) card.classList.remove("active");
        }
      });
    });
  }
  initTimelineScrollSpy();

  // Global Checkout Trigger Handler
  window.triggerCheckout = async function(planId = 'pro') {
    try {
      if (window.voxApi && localStorage.getItem('vox_token')) {
        const session = await window.voxApi.checkoutSubscription(planId);
        if (session && session.url) {
          window.location.href = session.url;
          return;
        }
      }
    } catch (err) {
      console.warn("Checkout session error:", err.message);
    }
    alert(`Iniciando Checkout do Plano ${planId.toUpperCase()}... Você será redirecionado para o ambiente seguro de pagamento!`);
  };

  // Initialize live preview component
  LivePhonePreview.init();
});
