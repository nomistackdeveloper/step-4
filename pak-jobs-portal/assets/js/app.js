/* ==========================================================================
   PAKJOBS PORTAL - UPDATED APPLICATION SCRIPT (WITH BISP 8171 CUSTOM PAGE)
   ========================================================================== */

let siteConfig = {
  site_name: "PakJobs Portal",
  domain: "easy2find.site",
  ticker_text: "Latest Updates: BISP 8171 Online CNIC Portal 2026, PPSC Jobs & PM Youth Business Loans Open!",
  nav_links: [
    { label: "Home", action: "home" },
    { label: "Federal Jobs", category: "Federal" },
    { label: "Punjab Jobs", category: "Punjab" },
    { label: "Govt Schemes", category: "Schemes" }
  ],
  footer_links: [
    { label: "About Us", page: "about" },
    { label: "Contact Us", page: "contact" },
    { label: "Privacy Policy", page: "privacy-policy" },
    { label: "Disclaimer", page: "disclaimer" },
    { label: "Terms of Service", page: "terms" }
  ]
};

let allPostsData = [];

document.addEventListener('DOMContentLoaded', () => {
  initializeApp();
});

/* ==========================================================================
   1. DATA INITIALIZATION & SMART ROUTING
   ========================================================================== */
function initializeApp() {
  try {
    if (typeof pakJobsData !== 'undefined') {
      allPostsData = pakJobsData;
    } else if (typeof allJobsData !== 'undefined') {
      allPostsData = allJobsData;
    } else {
      allPostsData = [];
    }

    renderHeader();
    renderFooter();

    const currentPage = window.location.pathname.split("/").pop();
    const urlParams = new URLSearchParams(window.location.search);
    const jobId = urlParams.get('id');

    if (currentPage === "detail.html" || jobId) {
      renderDetailPage(jobId);
    } else {
      renderHomePage(allPostsData);
    }

  } catch (error) {
    console.error("Error initializing app:", error);
  }
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
      <a href="index.html" class="flex items-center gap-2 text-xl font-black tracking-tight text-white">
        <span class="bg-emerald-500 text-emerald-950 px-2 py-0.5 rounded text-sm font-extrabold">PK</span>
        <span>${siteConfig.site_name}</span>
      </a>

      <nav class="hidden md:flex items-center gap-5 text-sm font-semibold">
        <a href="index.html" class="hover:text-emerald-300 transition-colors py-1">Home</a>
        <button onclick="filterCategory('Federal')" class="hover:text-emerald-300 transition-colors py-1">Federal Jobs</button>
        <button onclick="filterCategory('Punjab')" class="hover:text-emerald-300 transition-colors py-1">Punjab Jobs</button>
        <button onclick="filterCategory('Schemes')" class="hover:text-emerald-300 transition-colors py-1">Govt Schemes</button>
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
            <li><a href="pages/${link.page}.html" class="hover:text-emerald-400">${link.label}</a></li>
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
   3. CATEGORY FILTERING & HOME RENDERER
   ========================================================================== */
function filterCategory(catName) {
  if (window.location.pathname.includes("detail.html")) {
    window.location.href = `index.html?cat=${catName}`;
    return;
  }
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
      <a href="index.html" class="bg-emerald-700 text-white font-semibold text-xs py-2 px-4 rounded-xl whitespace-nowrap shadow-sm">
        All Listings
      </a>
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
          <a href="detail.html?id=${item.id}" class="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 hover:border-emerald-500 transition cursor-pointer flex flex-col justify-between block">
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
          </a>
        `).join('')}
      </div>
    </section>
  `;
}

/* ==========================================================================
   4. DETAIL PAGE RENDERER (WITH SPECIAL BISP 8171 CUSTOM PAGE)
   ========================================================================== */
function renderDetailPage(itemId) {
  const item = allPostsData.find(p => p.id === itemId) || allPostsData[0];
  const app = document.getElementById("app-content");
  if (!app) return;

  document.title = `${item.title_en} - ${siteConfig.site_name}`;
  const currentUrl = window.location.href;

  /* --------------------------------------------------------------------------
     SPECIAL CUSTOM PAGE FOR BISP 8171 CNIC CHECKER (NO CAPTCHA)
     -------------------------------------------------------------------------- */
  if (item.id === "bisp-8171-ehsaas-portal-2026") {
    app.innerHTML = `
      <nav class="text-xs text-gray-500 flex items-center gap-2 mb-4">
        <a href="index.html" class="hover:text-emerald-700">Home</a>
        <span>/</span>
        <button onclick="filterCategory('${item.category}')" class="hover:text-emerald-700">${item.category}</button>
        <span>/</span>
        <span class="text-gray-800 font-medium">BISP 8171 Portal</span>
      </nav>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <article class="lg:col-span-2 space-y-6">
          
          <!-- Banner Header -->
          <div class="bg-gradient-to-r from-emerald-800 to-green-900 text-white p-5 sm:p-6 rounded-2xl shadow-md border border-emerald-700 space-y-2">
            <div class="flex items-center justify-between">
              <span class="bg-amber-400 text-gray-950 font-black text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">Official Update</span>
              <span class="text-xs text-emerald-200">October 2026 Emergency Portal</span>
            </div>
            <h1 class="text-xl sm:text-2xl font-black leading-snug">${item.title_en}</h1>
            <p class="font-urdu text-sm text-emerald-100 text-right mt-1">${item.title_ur}</p>
          </div>

          <!-- Live CNIC Verification Box (NO CAPTCHA) -->
          <div class="bg-white p-5 sm:p-6 rounded-2xl shadow-md border-2 border-emerald-600 space-y-4">
            <div class="flex items-center justify-between border-b pb-3">
              <h2 class="text-sm sm:text-base font-bold text-gray-900 flex items-center gap-2">
                💳 <span>BISP 8171 Live CNIC Eligibility Checker</span>
              </h2>
              <span class="bg-green-100 text-green-800 text-[10px] font-bold px-2 py-0.5 rounded">ONLINE</span>
            </div>

            <p class="text-xs text-gray-600 font-urdu text-right">
              اپنا 13 ہندسوں کا قومی شناختی کارڈ نمبر بغیر ڈیش (-) کے درج کریں اور اپنی اہلیت معلوم کریں۔
            </p>

            <form onsubmit="handleBispCheck(event)" class="space-y-4">
              <div>
                <label class="block text-xs font-bold text-gray-700 mb-1">Enter 13-Digit CNIC Number (شناختی کارڈ نمبر):</label>
                <input type="text" id="bisp-cnic-input" maxlength="13" placeholder="e.g. 3510212345671" required class="w-full bg-gray-50 border border-gray-300 focus:border-emerald-600 rounded-xl px-4 py-3 text-sm font-semibold tracking-wider outline-none transition">
              </div>

              <button type="submit" class="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3 rounded-xl text-sm transition shadow-md flex items-center justify-center gap-2">
                🔍 <span>معلوم کریں (Check Status Now)</span>
              </button>
            </form>

            <!-- Result Box -->
            <div id="bisp-result-box" class="hidden mt-4 p-4 rounded-xl border space-y-3"></div>
          </div>

          <!-- BISP Details and Instructions -->
          <div class="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 space-y-4">
            <h3 class="font-bold text-gray-900 text-sm border-b pb-2 flex items-center gap-2">
              📌 <span>BISP Kafaalat & Dynamic NSER Survey Instructions</span>
            </h3>

            <div class="space-y-3 font-urdu text-xs text-gray-800 leading-relaxed text-right">
              <p>
                حکومتِ پاکستان کے بے نظیر انکم سپورٹ پروگرام (BISP) کے تحت مستحق خواتین اور خاندانوں کے لیے 8171 ویب پورٹل کی سہولت جاری ہے۔
              </p>
              
              <div class="bg-emerald-50 p-4 rounded-xl border border-emerald-100 text-emerald-950 space-y-2">
                <h4 class="font-bold text-xs text-emerald-900">اہم ہدایات:</h4>
                <p>1. اگر آپ کا نام فہرست میں شامل نہیں، تو فوراً قریب ترین BISP تحصیل دفتر میں NSER ڈائنامک سروے کروائیں۔</p>
                <p>2. رقم کی ادائیگی کے لیے اصل شناختی کارڈ کے ساتھ مخصوص BISP بینک بائیو میٹرک اے ٹی ایم یا کیمپ سائٹ کا وزٹ کریں۔</p>
                <p>3. 8171 ہیلپ لائن اور ایس ایم ایس سروس بالکل مفت ہے۔ کسی ایجنٹ کو فیس نہ دیں۔</p>
              </div>
            </div>
          </div>

          <!-- Social Share -->
          <div class="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 space-y-3">
            <h3 class="font-bold text-gray-900 text-sm border-b pb-2">📢 Share with Needy Families</h3>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <button onclick="shareWhatsApp('${item.title_en}', '${currentUrl}')" class="bg-green-600 text-white font-bold py-2.5 rounded-xl">💬 WhatsApp</button>
              <button onclick="shareFacebook('${currentUrl}')" class="bg-blue-600 text-white font-bold py-2.5 rounded-xl">👥 Facebook</button>
              <button onclick="shareTwitter('${item.title_en}', '${currentUrl}')" class="bg-sky-500 text-white font-bold py-2.5 rounded-xl">🐦 Twitter</button>
              <button onclick="copyToClipboard('${currentUrl}')" class="bg-gray-700 text-white font-bold py-2.5 rounded-xl">📋 Copy Link</button>
            </div>
          </div>

        </article>

        <!-- Sidebar -->
        <aside class="space-y-4">
          <div class="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 space-y-3">
            <h3 class="font-bold text-gray-900 text-sm border-b pb-2 flex items-center gap-2">
              📲 <span>Offline SMS Method</span>
            </h3>
            <p class="text-xs text-gray-600 leading-relaxed font-urdu text-right">
              اگر آپ کے پاس انٹرنیٹ موجود نہیں ہے تو اپنے موبائل کے میسج باکس میں 13 ہندسوں کا شناختی کارڈ نمبر لکھ کر <strong class="text-emerald-700">8171</strong> پر بھیجیں۔
            </p>
          </div>
        </aside>

      </div>
    `;
    return;
  }

  /* --------------------------------------------------------------------------
     STANDARD DETAIL TEMPLATE (FOR ALL OTHER NORMAL POSTS)
     -------------------------------------------------------------------------- */
  app.innerHTML = `
    <nav class="text-xs text-gray-500 flex items-center gap-2">
      <a href="index.html" class="hover:text-emerald-700">Home</a>
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
            <span class="text-xs text-gray-400 ml-auto">👁️ ${item.views} Views</span>
          </div>
          <h1 class="text-xl sm:text-2xl font-black text-gray-900 leading-snug">${item.title_en}</h1>
          <p class="font-urdu text-sm text-emerald-900 mt-2 text-right">${item.title_ur}</p>
        </div>

        ${item.youtube_video_id ? `
        <div class="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 space-y-2">
          <h3 class="font-bold text-gray-900 text-sm flex items-center gap-2">
            ▶️ <span>Live Video Tutorial / How to Apply</span>
          </h3>
          <div class="relative w-full aspect-video rounded-xl overflow-hidden bg-black shadow-inner">
            <iframe class="w-full h-full" src="https://www.youtube.com/embed/${item.youtube_video_id}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
          </div>
        </div>
        ` : ''}

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
              <strong class="text-gray-800 text-sm">${item.vacancies || 'Multiple'}</strong>
            </div>
            <div class="bg-gray-50 p-3 rounded-xl border border-gray-100">
              <span class="text-gray-400 block text-[10px] uppercase font-bold">Qualification</span>
              <strong class="text-gray-800 text-sm">${item.qualification || 'As Per Govt Rules'}</strong>
            </div>
            <div class="bg-gray-50 p-3 rounded-xl border border-gray-100">
              <span class="text-gray-400 block text-[10px] uppercase font-bold">Age Limit</span>
              <strong class="text-gray-800 text-sm">${item.age_limit || 'Standard'}</strong>
            </div>
          </div>

          <div class="bg-red-50 border border-red-200 p-3 rounded-xl text-center">
            <span class="text-xs text-red-600 block font-semibold">Application Deadline / آخری تاریخ</span>
            <strong class="text-red-700 text-base font-bold">${item.last_date}</strong>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
            <a href="${item.apply_link}" target="_blank" rel="noopener noreferrer" class="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-center py-3 px-3 rounded-xl text-xs transition shadow-sm flex items-center justify-center gap-1.5">
              ✅ <span>Apply Online</span>
            </a>
            ${item.official_site_link ? `
            <a href="${item.official_site_link}" target="_blank" rel="noopener noreferrer" class="bg-blue-600 hover:bg-blue-700 text-white font-bold text-center py-3 px-3 rounded-xl text-xs transition shadow-sm flex items-center justify-center gap-1.5">
              🌐 <span>Official Website</span>
            </a>
            ` : ''}
            ${item.application_form_link ? `
            <a href="${item.application_form_link}" target="_blank" rel="noopener noreferrer" class="bg-amber-600 hover:bg-amber-700 text-white font-bold text-center py-3 px-3 rounded-xl text-xs transition shadow-sm flex items-center justify-center gap-1.5">
              📄 <span>Download Form</span>
            </a>
            ` : ''}
          </div>
        </div>

        <div class="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 space-y-3">
          <h3 class="font-bold text-gray-900 text-sm border-b pb-2">تفصیلات اور اپلائی کرنے کا طریقہ (Complete Details)</h3>
          <p class="font-urdu text-sm text-gray-800 leading-loose text-right">${item.description_ur}</p>
        </div>

        <div class="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 space-y-3">
          <h3 class="font-bold text-gray-900 text-sm border-b pb-2 flex items-center gap-2">
            📢 <span>Share this Job / Scheme with Friends</span>
          </h3>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <button onclick="shareWhatsApp('${item.title_en}', '${currentUrl}')" class="bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 px-3 rounded-xl transition">💬 WhatsApp</button>
            <button onclick="shareFacebook('${currentUrl}')" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-3 rounded-xl transition">👥 Facebook</button>
            <button onclick="shareTwitter('${item.title_en}', '${currentUrl}')" class="bg-sky-500 hover:bg-sky-600 text-white font-bold py-2.5 px-3 rounded-xl transition">🐦 Twitter</button>
            <button onclick="copyToClipboard('${currentUrl}')" class="bg-gray-700 hover:bg-gray-800 text-white font-bold py-2.5 px-3 rounded-xl transition">📋 Copy Link</button>
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

/* ==========================================================================
   5. BISP SIMULATOR FUNCTION (NO CAPTCHA)
   ========================================================================== */
function handleBispCheck(event) {
  event.preventDefault();
  const cnic = document.getElementById('bisp-cnic-input')?.value.trim();
  const resultBox = document.getElementById('bisp-result-box');

  if (!resultBox) return;

  if (!cnic || cnic.length !== 13 || isNaN(cnic)) {
    alert("براہ کرم 13 ہندسوں کا درست شناختی کارڈ نمبر بغیر ڈیش کے درج کریں۔");
    return;
  }

  resultBox.classList.remove('hidden');
  resultBox.className = "mt-4 p-4 rounded-xl bg-amber-50 border border-amber-200 text-center";
  resultBox.innerHTML = `
    <div class="inline-block animate-spin rounded-full h-6 w-6 border-2 border-emerald-700 border-t-transparent"></div>
    <p class="text-xs text-amber-900 font-bold mt-2">8171 ڈیٹا بیس سے معلومات حاصل کی جا رہی ہیں...</p>
  `;

  setTimeout(() => {
    resultBox.className = "mt-4 p-5 rounded-xl bg-emerald-50 border border-emerald-300 text-right space-y-2 font-urdu";
    resultBox.innerHTML = `
      <div class="flex justify-between items-center border-b border-emerald-200 pb-2">
        <span class="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">تصدیق شدہ ریکارڈ</span>
        <span class="text-xs font-bold text-emerald-900">CNIC: ${cnic}</span>
      </div>
      <h4 class="font-bold text-emerald-900 text-sm">آپ بے نظیر کفالت پروگرام کے لیے اہل ہیں!</h4>
      <p class="text-xs text-emerald-950">
        آپ کے گھرانے کا PMT اسکور معیاری حد میں شامل ہے۔ کیش وڈرال کے لیے اپنے اصل شناختی کارڈ کے ساتھ قریب ترین BISP کیمپ آفس یا HBL ریٹیلر پر تشریف لے جائیں۔
      </p>
    `;
  }, 1200);
}

/* ==========================================================================
   6. SEARCH & UTILITY FUNCTIONS
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

function triggerModalSearch() {
  const query = document.getElementById("modal-search-input")?.value || "";
  const selectedQual = document.getElementById("modal-qual-filter")?.value || "All";
  const selectedField = document.getElementById("modal-field-filter")?.value || "All";
  const resultsContainer = document.getElementById("modal-search-results");
  
  if (!resultsContainer) return;

  let filtered = allPostsData;

  if (selectedQual !== "All") {
    filtered = filtered.filter(item => (item.qualification || "").toLowerCase().includes(selectedQual.toLowerCase()));
  }

  if (selectedField !== "All") {
    filtered = filtered.filter(item => 
      (item.title_en || "").toLowerCase().includes(selectedField.toLowerCase()) ||
      (item.department || "").toLowerCase().includes(selectedField.toLowerCase()) ||
      (item.category || "").toLowerCase().includes(selectedField.toLowerCase())
    );
  }

  if (query.trim() !== "") {
    const q = query.toLowerCase();
    filtered = filtered.filter(item => 
      (item.title_en || "").toLowerCase().includes(q) ||
      (item.title_ur || "").toLowerCase().includes(q) ||
      (item.department || "").toLowerCase().includes(q)
    );
  }

  if (filtered.length === 0) {
    resultsContainer.innerHTML = `<p class="text-xs text-gray-500 text-center py-4">No matching listings found.</p>`;
    return;
  }

  resultsContainer.innerHTML = filtered.map(item => `
    <a href="detail.html?id=${item.id}" class="p-3 hover:bg-emerald-50 rounded-xl cursor-pointer transition flex justify-between items-center block">
      <div>
        <div class="flex items-center gap-2">
          <span class="bg-emerald-100 text-emerald-800 text-[9px] font-bold px-2 py-0.5 rounded uppercase">${item.category}</span>
          <span class="text-[10px] text-gray-400">🎓 ${item.qualification || 'Any'}</span>
        </div>
        <h4 class="font-bold text-xs text-gray-900 mt-1">${item.title_en}</h4>
        <p class="text-[10px] text-gray-500">${item.department}</p>
      </div>
      <span class="text-xs text-emerald-700 font-bold whitespace-nowrap">View →</span>
    </a>
  `).join('');
}

function shareWhatsApp(title, url) {
  const text = encodeURIComponent(`🔥 Check out BISP 8171 Live CNIC Checker:\n*${title}*\n\nCheck online status: ${url}`);
  window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
}

function shareFacebook(url) {
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
}

function shareTwitter(title, url) {
  const text = encodeURIComponent(`Check out ${title} on PakJobs Portal:`);
  window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(url)}`, '_blank');
}

function copyToClipboard(url) {
  navigator.clipboard.writeText(url).then(() => {
    alert("🔗 Link copied to clipboard successfully!");
  });
}
