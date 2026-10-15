/* ==========================================================================
   PAKJOBS PORTAL - SEPARATED MAIN APPLICATION SCRIPT (WITH JS DATA FILE)
   ========================================================================== */

let siteConfig = null;
let allPostsData = [];

document.addEventListener('DOMContentLoaded', () => {
  initializeApp();
});

async function initializeApp() {
  try {
    const configRes = await fetch('config/site-config.json');
    siteConfig = await configRes.json();

    // Directly load the global array since pak-jobs-schemes.js is linked in HTML
    if (typeof allPostsData !== 'undefined' && allPostsData.length > 0) {
      // Already loaded via script tag
    } else if (typeof pakJobsData !== 'undefined') {
      allPostsData = pakJobsData;
    }

    renderHeader();
    renderFooter();

    const urlParams = new URLSearchParams(window.location.search);
    const jobId = urlParams.get('id');

    if (jobId) {
      router('detail', jobId);
    } else {
      router('home');
    }

  } catch (error) {
    console.error("Error initializing app:", error);
    useFallbackData();
  }
}
    renderHeader();
    renderFooter();

    const urlParams = new URLSearchParams(window.location.search);
    const jobId = urlParams.get('id');

    if (jobId) {
      router('detail', jobId);
    } else {
      router('home');
    }

  } catch (error) {
    console.error("Error initializing app:", error);
    useFallbackData();
  }
}

function useFallbackData() {
  siteConfig = {
    site_name: "PakJobs Portal",
    ticker_text: "Latest: PPSC Assistant Director Jobs 2026 & PM Youth Loan Scheme Open!",
    nav_links: [
      { label: "Home", action: "home" },
      { label: "Federal Jobs", category: "Federal" },
      { label: "Punjab Jobs", category: "Punjab" },
      { label: "Govt Schemes", category: "Schemes" }
    ],
    footer_links: [
      { label: "About Us", page: "about" },
      { label: "Contact Us", page: "contact" },
      { label: "Privacy Policy", page: "privacy" },
      { label: "Disclaimer", page: "disclaimer" }
    ]
  };

  renderHeader();
  renderFooter();
  router('home');
}

/* ==========================================================================
   2. HEADER & FOOTER RENDERERS
   ========================================================================== */
function renderHeader() {
  const headerEl = document.getElementById("main-header");
  if (!headerEl) return;

  headerEl.innerHTML = `
    <div class="bg-emerald-950 text-emerald-200 text-xs py-1.5 px-4 text-center font-medium truncate border-b border-emerald-800/50">
      🔔 <span class="tracking-wide">${siteConfig.ticker_text}</span>
    </div>

    <div class="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
      <a href="index.html" onclick="event.preventDefault(); router('home')" class="flex items-center gap-2 text-xl font-black tracking-tight text-white">
        <span class="bg-emerald-500 text-emerald-950 px-2 py-0.5 rounded text-sm font-extrabold">PK</span>
        <span>${siteConfig.site_name}</span>
      </a>

      <nav class="hidden md:flex items-center gap-5 text-sm font-semibold">
        ${siteConfig.nav_links.map(link => `
          <button onclick="${link.action ? `router('${link.action}')` : `filterCategory('${link.category}')`}" 
                  class="hover:text-emerald-300 transition-colors py-1">
            ${link.label}
          </button>
        `).join('')}
      </nav>

      <button onclick="openSearchModal()" class="hidden sm:flex bg-emerald-800 hover:bg-emerald-700 text-emerald-100 text-xs font-semibold py-1.5 px-3 rounded-lg items-center gap-2 border border-emerald-700">
        🔍 <span>Search Jobs...</span>
      </button>
    </div>
  `;
}

function renderFooter() {
  const footerEl = document.getElementById("main-footer");
  if (!footerEl) return;

  footerEl.innerHTML = `
    <div class="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
      <div>
        <h3 class="text-white font-bold text-lg mb-3 flex items-center gap-2">
          <span class="bg-emerald-600 text-white px-2 py-0.5 rounded text-xs">PK</span>
          ${siteConfig.site_name}
        </h3>
        <p class="text-gray-400 text-xs leading-relaxed">
          Pakistan's centralized job alerts portal for daily government advertisements, official test notifications, youth loan schemes, and scholarships.
        </p>
      </div>

      <div>
        <h4 class="text-white font-bold mb-3">Quick Navigation</h4>
        <ul class="space-y-2 text-xs text-gray-400">
          <li><button onclick="filterCategory('Federal')" class="hover:text-emerald-400">Federal Jobs (FPSC, NTS)</button></li>
          <li><button onclick="filterCategory('Punjab')" class="hover:text-emerald-400">Punjab Jobs (PPSC)</button></li>
          <li><button onclick="filterCategory('Schemes')" class="hover:text-emerald-400">Government Schemes & Loans</button></li>
        </ul>
      </div>

      <div>
        <h4 class="text-white font-bold mb-3">Legal & Compliance</h4>
        <ul class="space-y-2 text-xs text-gray-400">
          ${siteConfig.footer_links.map(link => `
            <li><button onclick="renderStaticPage('${link.page}')" class="hover:text-emerald-400">${link.label}</button></li>
          `).join('')}
        </ul>
      </div>
    </div>

    <div class="bg-gray-950 py-4 text-center text-xs text-gray-500 border-t border-gray-800">
      © 2026 ${siteConfig.site_name}. All rights reserved. Sourced from official government notifications in Pakistan.
    </div>
  `;
}

/* ==========================================================================
   3. ROUTING & VIEWS
   ========================================================================== */
function router(view, param = null) {
  window.scrollTo(0, 0);

  if (view === "home") {
    history.pushState(null, "", "index.html");
    renderHomePage(allPostsData);
  } else if (view === "detail") {
    history.pushState(null, "", `?id=${param}`);
    renderDetailPage(param);
  }
}

function filterCategory(catName) {
  window.scrollTo(0, 0);
  const filtered = allPostsData.filter(p => p.category.toLowerCase() === catName.toLowerCase() || (catName === 'jobs' && p.type === 'job'));
  renderHomePage(filtered.length ? filtered : allPostsData, catName);
}

function renderHomePage(dataList, activeCategory = "All Recent Listings") {
  const app = document.getElementById("app-content");
  if (!app) return;

  app.innerHTML = `
    <section class="bg-emerald-900 text-white rounded-2xl p-5 sm:p-8 shadow-md relative overflow-hidden">
      <div class="relative z-10 max-w-2xl">
        <span class="bg-emerald-800 text-emerald-200 text-xs font-semibold px-3 py-1 rounded-full uppercase">Official Pakistan Notifications</span>
        <h1 class="text-2xl sm:text-3xl font-extrabold mt-2 leading-tight">
          Find Your Future in Government Jobs & Youth Schemes
        </h1>
        <p class="text-emerald-100 text-xs sm:text-sm mt-2 opacity-90">
          Complete details of Federal, Provincial, Youth Loans & Scholarships across Pakistan.
        </p>
      </div>
    </section>

    <div class="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
      <button onclick="router('home')" class="bg-emerald-700 text-white font-semibold text-xs py-2 px-4 rounded-xl whitespace-nowrap shadow-sm">
        All Listings
      </button>
      <button onclick="filterCategory('Punjab')" class="bg-white hover:bg-emerald-50 text-gray-700 font-semibold text-xs py-2 px-4 rounded-xl border border-gray-200 whitespace-nowrap shadow-sm">
        Punjab Jobs
      </button>
      <button onclick="filterCategory('Federal')" class="bg-white hover:bg-emerald-50 text-gray-700 font-semibold text-xs py-2 px-4 rounded-xl border border-gray-200 whitespace-nowrap shadow-sm">
        Federal Jobs
      </button>
      <button onclick="filterCategory('Schemes')" class="bg-white hover:bg-emerald-50 text-gray-700 font-semibold text-xs py-2 px-4 rounded-xl border border-gray-200 whitespace-nowrap shadow-sm">
        Govt Schemes
      </button>
    </div>

    <section class="space-y-4">
      <div class="flex justify-between items-center">
        <h2 class="text-lg font-bold text-gray-900">📌 ${activeCategory}</h2>
        <span class="text-xs text-gray-500">${dataList.length} posts found</span>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        ${dataList.map(item => `
          <div onclick="router('detail', '${item.id}')" class="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 hover:border-emerald-500 transition cursor-pointer flex flex-col justify-between">
            <div>
              <div class="flex justify-between items-start gap-2 mb-2">
                <span class="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">${item.category}</span>
                <span class="text-[11px] text-gray-400">📅 ${item.date}</span>
              </div>
              <h3 class="font-bold text-gray-900 text-sm sm:text-base line-clamp-2 hover:text-emerald-700">${item.title_en}</h3>
              <p class="font-urdu text-xs text-emerald-800 mt-1 text-right line-clamp-1">${item.title_ur}</p>
              
              <div class="mt-3 bg-gray-50 p-2.5 rounded-xl space-y-1 text-xs">
                <div class="flex justify-between"><span class="text-gray-500">Dept:</span> <strong class="text-gray-800 truncate">${item.department}</strong></div>
                <div class="flex justify-between"><span class="text-gray-500">Last Date:</span> <strong class="text-red-600">${item.last_date}</strong></div>
              </div>
            </div>

            <div class="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
              <span class="text-[11px] text-gray-400">👁️ ${item.views} views</span>
              <span class="bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs px-3 py-1.5 rounded-lg transition">
                View Details →
              </span>
            </div>
          </div>
        `).join('')}
      </div>
    </section>
  `;
}

function renderDetailPage(itemId) {
  const item = allPostsData.find(p => p.id === itemId) || allPostsData[0];
  const app = document.getElementById("app-content");
  if (!app) return;

  app.innerHTML = `
    <nav class="text-xs text-gray-500 flex items-center gap-2">
      <button onclick="router('home')" class="hover:text-emerald-700">Home</button>
      <span>/</span>
      <button onclick="filterCategory('${item.category}')" class="hover:text-emerald-700">${item.category}</button>
      <span>/</span>
      <span class="text-gray-800 truncate font-medium">${item.title_en}</span>
    </nav>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <article class="lg:col-span-2 space-y-5">
        
        <div class="bg-white p-5 rounded-2xl shadow-sm border border-gray-200">
          <div class="flex flex-wrap gap-2 items-center mb-2">
            <span class="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full uppercase">${item.category}</span>
            <span class="text-xs text-gray-400">Posted on: ${item.date}</span>
          </div>
          <h1 class="text-xl sm:text-2xl font-black text-gray-900 leading-snug">${item.title_en}</h1>
          <p class="font-urdu text-sm text-emerald-900 mt-2 text-right">${item.title_ur}</p>
        </div>

        <div class="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 space-y-4">
          <h2 class="text-sm font-bold text-gray-900 border-b pb-2 flex items-center gap-2">
            📌 <span>Quick Summary & Eligibility</span>
          </h2>

          <div class="grid grid-cols-2 gap-3 text-xs">
            <div class="bg-gray-50 p-3 rounded-xl border border-gray-100">
              <span class="text-gray-400 block text-[10px] uppercase font-bold">Department</span>
              <strong class="text-gray-800 text-sm">${item.department}</strong>
            </div>
            <div class="bg-gray-50 p-3 rounded-xl border border-gray-100">
              <span class="text-gray-400 block text-[10px] uppercase font-bold">Vacancies / Posts</span>
              <strong class="text-gray-800 text-sm">${item.vacancies}</strong>
            </div>
            <div class="bg-gray-50 p-3 rounded-xl border border-gray-100">
              <span class="text-gray-400 block text-[10px] uppercase font-bold">Qualification</span>
              <strong class="text-gray-800 text-sm">${item.qualification}</strong>
            </div>
            <div class="bg-gray-50 p-3 rounded-xl border border-gray-100">
              <span class="text-gray-400 block text-[10px] uppercase font-bold">Age Limit</span>
              <strong class="text-gray-800 text-sm">${item.age_limit}</strong>
            </div>
          </div>

          <div class="bg-red-50 border border-red-200 p-3 rounded-xl text-center">
            <span class="text-xs text-red-600 block font-semibold">Application Deadline / آخری تاریخ</span>
            <strong class="text-red-700 text-base font-bold">${item.last_date}</strong>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <a href="${item.apply_link}" target="_blank" rel="noopener noreferrer" class="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-center py-3 px-4 rounded-xl text-sm transition shadow-sm flex items-center justify-center gap-2">
              ✅ <span>Apply Online Now</span>
            </a>
            <button onclick="shareWhatsApp('${item.title_en}')" class="bg-green-600 hover:bg-green-700 text-white font-bold text-center py-3 px-4 rounded-xl text-sm transition shadow-sm flex items-center justify-center gap-2">
              📲 <span>Share on WhatsApp</span>
            </button>
          </div>
        </div>

        <div class="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 space-y-3">
          <h3 class="font-bold text-gray-900 text-sm border-b pb-2">تفصیلات اور اپلائی کرنے کا طریقہ (Urdu Details)</h3>
          <p class="font-urdu text-sm text-gray-800 leading-loose text-right">${item.description_ur}</p>
          
          <div class="bg-emerald-50 p-4 rounded-xl border border-emerald-100 mt-3 space-y-2">
            <h4 class="font-bold text-emerald-900 text-xs">درخواست جمع کروانے کی ہدایات:</h4>
            ${item.instructions_ur ? item.instructions_ur.map(inst => `
              <p class="font-urdu text-xs text-emerald-950 text-right">${inst}</p>
            `).join('') : ''}
          </div>
        </div>

      </article>

      <aside class="space-y-4">
        <div class="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 space-y-3">
          <h3 class="font-bold text-gray-900 text-sm flex items-center gap-2 border-b pb-2">
            🔥 <span>Popular Schemes</span>
          </h3>
          <ul class="space-y-2.5 text-xs text-gray-700">
            <li class="hover:text-emerald-700 cursor-pointer" onclick="filterCategory('Schemes')">
              • <strong>PM Youth Business Loan</strong> <span class="block text-[10px] text-gray-400">Up to 75 Lacs Interest-Free</span>
            </li>
            <li class="hover:text-emerald-700 cursor-pointer" onclick="filterCategory('Schemes')">
              • <strong>CM Punjab Solar Panel Scheme</strong> <span class="block text-[10px] text-gray-400">Free Solar for 500 Unit Users</span>
            </li>
          </ul>
        </div>
      </aside>
    </div>
  `;
}

function renderStaticPage(pageKey) {
  window.scrollTo(0, 0);
  const app = document.getElementById("app-content");
  if (!app) return;

  app.innerHTML = `
    <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 space-y-4 max-w-3xl mx-auto">
      <h1 class="text-2xl font-bold text-gray-900 border-b pb-2 capitalize">${pageKey.replace('-', ' ')}</h1>
      <p class="text-xs text-gray-600 leading-relaxed">
        Welcome to ${siteConfig.site_name}. All job notices published on this portal are collected directly from verified official government notifications in Pakistan.
      </p>
      <button onclick="router('home')" class="bg-emerald-700 text-white font-semibold text-xs py-2 px-4 rounded-xl">
        ← Back to Home
      </button>
    </div>
  `;
}

/* ==========================================================================
   4. ADVANCED SEARCH & FILTER MODAL SYSTEM (Education + Field)
   ========================================================================== */
function openSearchModal() {
  const modal = document.getElementById("search-modal");
  if (modal) {
    modal.classList.remove("hidden");
    document.getElementById("modal-search-input")?.focus();
    triggerModalSearch();
  }
}

function closeSearchModal() {
  const modal = document.getElementById("search-modal");
  if (modal) {
    modal.classList.add("hidden");
  }
}

function applyModalSuggestion(keyword) {
  const input = document.getElementById("modal-search-input");
  if (input) {
    input.value = keyword;
    triggerModalSearch();
  }
}

function triggerModalSearch() {
  const query = document.getElementById("modal-search-input")?.value || "";
  const selectedQual = document.getElementById("modal-qual-filter")?.value || "All";
  const selectedField = document.getElementById("modal-field-filter")?.value || "All";
  const resultsContainer = document.getElementById("modal-search-results");
  
  if (!resultsContainer) return;

  let filtered = allPostsData;

  // 1. Filter by Qualification Dropdown
  if (selectedQual !== "All") {
    filtered = filtered.filter(item => 
      (item.qualification || "").toLowerCase().includes(selectedQual.toLowerCase())
    );
  }

  // 2. Filter by Field / Sector Dropdown
  if (selectedField !== "All") {
    filtered = filtered.filter(item => 
      (item.title_en || "").toLowerCase().includes(selectedField.toLowerCase()) ||
      (item.department || "").toLowerCase().includes(selectedField.toLowerCase()) ||
      (item.category || "").toLowerCase().includes(selectedField.toLowerCase())
    );
  }

  // 3. Filter by Search Query
  if (query.trim() !== "") {
    const q = query.toLowerCase();
    filtered = filtered.filter(item => 
      (item.title_en || "").toLowerCase().includes(q) ||
      (item.title_ur || "").toLowerCase().includes(q) ||
      (item.department || "").toLowerCase().includes(q) ||
      (item.category || "").toLowerCase().includes(q)
    );
  }

  if (filtered.length === 0) {
    resultsContainer.innerHTML = `<p class="text-xs text-gray-500 text-center py-4">No matching listings found for your selected filters.</p>`;
    return;
  }

  resultsContainer.innerHTML = filtered.map(item => `
    <div onclick="closeSearchModal(); router('detail', '${item.id}')" class="p-3 hover:bg-emerald-50 rounded-xl cursor-pointer transition flex justify-between items-center">
      <div>
        <div class="flex items-center gap-2">
          <span class="bg-emerald-100 text-emerald-800 text-[9px] font-bold px-2 py-0.5 rounded uppercase">${item.category}</span>
          <span class="text-[10px] text-gray-400">🎓 ${item.qualification || 'Any'}</span>
        </div>
        <h4 class="font-bold text-xs text-gray-900 mt-1">${item.title_en}</h4>
        <p class="text-[10px] text-gray-500">${item.department}</p>
      </div>
      <span class="text-xs text-emerald-700 font-bold whitespace-nowrap">View →</span>
    </div>
  `).join('');
}

/* ==========================================================================
   5. UTILITY FUNCTIONS
   ========================================================================== */
function shareWhatsApp(title) {
  const text = encodeURIComponent(`Check out this job update: ${title} on ${window.location.href}`);
  window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
}
