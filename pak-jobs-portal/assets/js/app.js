/* ==========================================================================
   PAKJOBS PORTAL - MAIN APPLICATION SCRIPT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initPortal();
});

let globalData = [];

async function initPortal() {
  try {
    // 1. Fetch Configuration & Data Files in Parallel
    const [configRes, jobsRes, schemesRes] = await Promise.all([
      fetch('config/site-config.json'),
      fetch('data/jobs.json'),
      fetch('data/schemes.json')
    ]);

    const config = await configRes.json();
    const jobs = await jobsRes.json();
    const schemes = await schemesRes.json();

    // Combine jobs and schemes into one master array
    globalData = [pak-jobs-schemes.json];

    // 2. Initialize UI Components
    renderTicker(config.ticker_text);
    renderJobCards(globalData);
    setupEventListeners(globalData);

  } catch (error) {
    console.error('Error loading portal data:', error);
    const container = document.getElementById('job-container');
    if (container) {
      container.innerHTML = `
        <div class="col-span-full bg-red-50 border border-red-200 text-red-700 p-6 rounded-2xl text-center text-xs font-medium">
          ⚠️ Failed to load portal data. Please ensure JSON files are properly placed in the /data/ folder.
        </div>
      `;
    }
  }
}

/* ==========================================================================
   RENDER TICKER TEXT
   ========================================================================== */
function renderTicker(text) {
  const tickerEl = document.getElementById('ticker-text');
  if (tickerEl) {
    tickerEl.textContent = text;
  }
}

/* ==========================================================================
   RENDER JOB CARDS DYNAMICALLY
   ========================================================================== */
function renderJobCards(dataArray) {
  const container = document.getElementById('job-container');
  const countEl = document.getElementById('result-count');
  
  if (!container) return;

  if (countEl) {
    countEl.textContent = `Showing ${dataArray.length} available opportunities`;
  }

  if (dataArray.length === 0) {
    container.innerHTML = `
      <div class="col-span-full bg-white border border-gray-200 rounded-3xl p-10 text-center space-y-2 shadow-sm">
        <p class="text-2xl">🔍</p>
        <h3 class="font-bold text-gray-800 text-sm">No matching listings found</h3>
        <p class="text-xs text-gray-500">Try searching with a different keyword or category filter.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = dataArray.map(item => `
    <div class="job-card bg-white border border-gray-200 rounded-3xl p-5 sm:p-6 flex flex-col justify-between shadow-sm relative overflow-hidden group">
      
      <!-- Top Badge & Date -->
      <div>
        <div class="flex justify-between items-center mb-3">
          <span class="bg-emerald-50 text-emerald-800 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-emerald-100">
            ${item.category}
          </span>
          <span class="text-[11px] text-gray-400 font-medium">📅 Last Date: <strong class="text-gray-700">${item.last_date}</strong></span>
        </div>

        <!-- Department & Titles -->
        <p class="text-[11px] font-bold text-emerald-900 uppercase tracking-tight">${item.department}</p>
        <h3 class="font-extrabold text-gray-900 text-sm sm:text-base mt-1 group-hover:text-emerald-700 transition">
          ${item.title_en}
        </h3>
        <p class="font-urdu text-xs text-gray-600 mt-1 line-clamp-1">${item.title_ur || ''}</p>

        <!-- Key Meta Info -->
        <div class="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-gray-100 text-xs">
          <div class="bg-gray-50 p-2 rounded-xl">
            <span class="text-[10px] text-gray-400 block font-semibold">Vacancies / Slots</span>
            <strong class="text-gray-800 text-[11px]">${item.vacancies}</strong>
          </div>
          <div class="bg-gray-50 p-2 rounded-xl">
            <span class="text-[10px] text-gray-400 block font-semibold">Qualification</span>
            <strong class="text-gray-800 text-[11px] truncate block">${item.qualification}</strong>
          </div>
        </div>
      </div>

      <!-- Action Button & Views -->
      <div class="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between">
        <span class="text-[10px] text-gray-400 font-medium">👁️ ${item.views || 0} views</span>
        <button onclick="openJobDetail('${item.id}')" class="bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs py-2 px-4 rounded-xl transition shadow-sm">
          View Details & Apply →
        </button>
      </div>

    </div>
  `).join('');
}

/* ==========================================================================
   ADVANCED FILTERING & SEARCH SYSTEM
   ========================================================================== */
function setupEventListeners(dataArray) {
  const searchInput = document.getElementById('search-input');
  const qualSelect = document.getElementById('qualification-filter');
  const filterBtns = document.querySelectorAll('.filter-btn');

  let currentCategory = 'All';
  let searchQuery = '';
  let selectedQual = 'All';

  function applyFilters() {
    let filtered = dataArray;

    // 1. Filter by Category Tab (All, Federal, Punjab, Schemes)
    if (currentCategory !== 'All') {
      filtered = filtered.filter(item => item.category.toLowerCase() === currentCategory.toLowerCase());
    }

    // 2. Filter by Qualification Dropdown
    if (selectedQual !== 'All') {
      filtered = filtered.filter(item => item.qualification.toLowerCase().includes(selectedQual.toLowerCase()));
    }

    // 3. Advanced Multi-Keyword Search (Tokenized across English & Urdu)
    if (searchQuery.trim() !== '') {
      const tokens = searchQuery.toLowerCase().trim().split(/\s+/);
      
      filtered = filtered.filter(item => {
        const searchableText = `
          ${item.title_en || ''} 
          ${item.title_ur || ''} 
          ${item.department || ''} 
          ${item.category || ''} 
          ${item.qualification || ''} 
          ${item.description_ur || ''}
        `.toLowerCase();

        return tokens.every(token => searchableText.includes(token));
      });
    }

    renderJobCards(filtered);
  }

  // Search Input Event
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      applyFilters();
    });
  }

  // Qualification Dropdown Event
  if (qualSelect) {
    qualSelect.addEventListener('change', (e) => {
      selectedQual = e.target.value;
      applyFilters();
    });
  }

  // Category Tab Buttons Event
  filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      filterBtns.forEach(b => b.classList.remove('bg-emerald-900', 'text-white'));
      filterBtns.forEach(b => b.classList.add('bg-white', 'text-gray-700'));
      
      e.target.classList.remove('bg-white', 'text-gray-700');
      e.target.classList.add('bg-emerald-900', 'text-white');

      currentCategory = e.target.getAttribute('data-category');
      applyFilters();
    });
  });

  // Global helper function for 1-Tap Suggestion Pills
  window.applySuggestion = function(keyword) {
    if (searchInput) {
      searchInput.value = keyword;
      searchQuery = keyword;
      applyFilters();
    }
  };
}

/* ==========================================================================
   JOB DETAIL MODAL / VIEW HANDLER
   ========================================================================== */
function openJobDetail(jobId) {
  const item = globalData.find(d => d.id === jobId);
  if (!item) return;

  alert(`Opening details for: ${item.title_en}\nLast Date: ${item.last_date}\nApply Link: ${item.apply_link}`);
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

  // Fallback data containing all listings so nothing ever disappears
  allPostsData = [
    {
      id: "ppsc-assistant-director-2026",
      type: "job",
      category: "Punjab",
      department: "Punjab Public Service Commission (PPSC)",
      title_en: "PPSC Assistant Director Recruitment 2026",
      title_ur: "پنجاب پبلک سروس کمیشن اسسٹنٹ ڈائریکٹر بھرتی 2026",
      vacancies: "45 Seats",
      qualification: "Master Degree / Graduation",
      age_limit: "21 - 30 Years (+ Age Relaxation)",
      last_date: "November 15, 2026",
      apply_link: "https://ppsc.gop.pk",
      views: "1,420",
      date: "Oct 14, 2026",
      description_ur: "پنجاب پبلک سروس کمیشن نے محکمہ زراعت اور اینٹی کرپشن میں اسسٹنٹ ڈائریکٹر کی خالی اسامیوں کے لیے آن لائن درخواستیں طلب کر لی ہیں۔",
      instructions_ur: ["1. PPSC کی آفیشل ویب سائٹ سے چالان فارم ڈاؤن لوڈ کریں۔"]
    },
    {
      id: "pm-youth-business-loan-2026",
      type: "scheme",
      category: "Schemes",
      department: "Prime Minister Youth Program",
      title_en: "PM Youth Business & Agriculture Loan Scheme 2026",
      title_ur: "وزیراعظم یوتھ بزنس اور ایگریکلچر لون اسکیم 2026",
      vacancies: "Tier 1, Tier 2 & Tier 3 Loans",
      qualification: "CNIC Holder (Age 21-45)",
      age_limit: "21 - 45 Years",
      last_date: "December 31, 2026",
      apply_link: "https://pmyp.gov.pk",
      views: "3,890",
      date: "Oct 12, 2026",
      description_ur: "حکومتِ پاکستان کی جانب سے باہمت نوجوانوں کو اپنا کاروبار شروع کرنے کے لیے آسان اقساط پر قرضے فراہم کیے جا رہے ہیں۔",
      instructions_ur: ["1. آفیشل پورٹل pmyp.gov.pk پر جائیں۔"]
    },
    {
      id: "fpsc-lecturer-recruitment-2026",
      type: "job",
      category: "Federal",
      department: "Federal Public Service Commission (FPSC)",
      title_en: "FPSC Male & Female Lecturer Jobs 2026",
      title_ur: "ایف پی ایس سی لیکچرار بھرتی 2026",
      vacancies: "120 Seats",
      qualification: "Master Degree (2nd Division)",
      age_limit: "22 - 33 Years",
      last_date: "November 20, 2026",
      apply_link: "https://fpsc.gov.pk",
      views: "2,150",
      date: "Oct 10, 2026",
      description_ur: "وفاقی سرکاری ڈگری کالجوں میں مرد اور خواتین لیکچرارز کی آسامیوں کا اعلان کر دیا گیا ہے۔",
      instructions_ur: ["1. FPSC ویب سائٹ سے چالان فارم ڈاؤن لوڈ کریں۔"]
    },
    {
      id: "cm-punjab-solar-scheme-2026",
      type: "scheme",
      category: "Schemes",
      department: "Energy Department Government of Punjab",
      title_en: "CM Punjab Free Solar Panel Scheme 2026",
      title_ur: "وزیراعلیٰ پنجاب مفت سولر پینل اسکیم 2026",
      vacancies: "50,000 Solar Systems",
      qualification: "Electricity Bill Consumer (Up to 500 Units)",
      age_limit: "18+ Years",
      last_date: "November 30, 2026",
      apply_link: "https://cmsolar.punjab.gov.pk",
      views: "5,410",
      date: "Oct 08, 2026",
      description_ur: "گھریلو صارفین کو آسان اقساط پر سولر سسٹمز فراہم کیے جا رہے ہیں۔",
      instructions_ur: ["1. پورٹل پر اپنا بل ریفرنس نمبر درج کریں۔"]
    },
    {
      id: "punjab-police-constable-2026",
      type: "job",
      category: "Punjab",
      department: "Punjab Police",
      title_en: "Punjab Police Constable & Lady Constable Jobs 2026",
      title_ur: "پنجاب پولیس کانسٹیبل اور لیڈی کانسٹیبل بھرتی 2026",
      vacancies: "3,500+ Seats",
      qualification: "Intermediate (FA / FSc / IT)",
      age_limit: "18 - 25 Years",
      last_date: "November 25, 2026",
      apply_link: "https://punjabpolice.gov.pk",
      views: "4,120",
      date: "Oct 15, 2026",
      description_ur: "پنجاب پولیس نے صوبے کے تمام اضلاع کے لیے کانسٹیبل کی خالی اسامیوں کا اعلان کر دیا ہے۔",
      instructions_ur: ["1. درخواست فارم پولیس کی ویب سائٹ سے ڈاؤن لوڈ کریں۔"]
    },
    {
      id: "cm-punjab-ebike-scheme-2026",
      type: "scheme",
      category: "Schemes",
      department: "Transport Department Punjab",
      title_en: "CM Punjab Student E-Bike Scheme 2026",
      title_ur: "وزیراعلیٰ پنجاب اسٹوڈنٹس ای بائیک اسکیم 2026",
      vacancies: "20,000 Bikes",
      qualification: "College / University Students (Intermediate / Graduation)",
      age_limit: "18 - 30 Years",
      last_date: "December 15, 2026",
      apply_link: "https://bikes.punjab.gov.pk",
      views: "6,750",
      date: "Oct 11, 2026",
      description_ur: "طلباء و طالبات کے لیے آسان ماہانہ اقساط پر بغیر سود کے موٹر سائیکل فراہم کرنے کی اسکیم۔",
      instructions_ur: ["1. آن لائن پورٹل پر جا کر فارم پُر کریں۔"]
    },
    {
      id: "bisp-kafaalat-program-2026",
      type: "scheme",
      category: "Schemes",
      department: "Benazir Income Support Programme (BISP)",
      title_en: "BISP Kafaalat 10,500 Quarterly Installment 2026",
      title_ur: "بینظیر انکم سپورٹ پروگرام کفالت قسط 2026",
      vacancies: "Nationwide Beneficiaries",
      qualification: "CNIC Holder / PMT Score Verified",
      age_limit: "18 - 60 Years",
      last_date: "Open Ongoing",
      apply_link: "https://8171.bisp.gov.pk",
      views: "8,920",
      date: "Oct 05, 2026",
      description_ur: "مستحق خاندانوں کے لیے نئی سہ ماہی قسط 10,500 روپے جاری کر دی گئی ہے۔",
      instructions_ur: ["1. اپنا شناختی کارڈ نمبر 8171 پر ایس ایم ایس کریں۔"]
    },
    {
      id: "pakistan-railways-jobs-2026",
      type: "job",
      category: "Federal",
      department: "Pakistan Railways Headquarters",
      title_en: "Pakistan Railways Junior Clerk & Technician Jobs 2026",
      title_ur: "پاکستان ریلویز جونیئر کلرک اور ٹیکنیشین جابز 2026",
      vacancies: "280 Seats",
      qualification: "Matric / Intermediate / DAE",
      age_limit: "18 - 28 Years",
      last_date: "November 18, 2026",
      apply_link: "https://pakrail.gov.pk",
      views: "1,940",
      date: "Oct 09, 2026",
      description_ur: "پاکستان ریلویز نے جونیئر کلرکس اور فنی عملے کی خالی اسامیوں پر درخواستیں طلب کی ہیں۔",
      instructions_ur: ["1. ریلویز کی ویب سائٹ سے فارم ڈاؤن لوڈ کریں۔"]
    },
    {
      id: "pak-army-soldier-2026",
      type: "job",
      category: "Federal",
      department: "Pakistan Army",
      title_en: "Join Pakistan Army as Soldier (Sipahi) 2026",
      title_ur: "پاک فوج بطور سپاہی شمولیت 2026",
      vacancies: "Multiple Openings",
      qualification: "Matric or Above",
      age_limit: "17.5 - 23 Years",
      last_date: "November 22, 2026",
      apply_link: "https://joinpakarmy.gov.pk",
      views: "4,830",
      date: "Oct 13, 2026",
      description_ur: "پاک فوج میں بطور سپاہی اور کلرک شمولیت کے لیے رجسٹریشن کا آغاز کر دیا گیا ہے۔",
      instructions_ur: ["1. آفیشل ویب سائٹ joinpakarmy.gov.pk پر جائیں۔"]
    },
    {
      id: "hec-indigenous-scholarship-2026",
      type: "scheme",
      category: "Schemes",
      department: "Higher Education Commission (HEC)",
      title_en: "HEC Indigenous MS & PhD Scholarship 2026",
      title_ur: "ایچ ای سی انڈیجینس ایم ایس اور پی ایچ ڈی اسکالرشپ 2026",
      vacancies: "1,000 Scholarships",
      qualification: "BS / Master Degree (16 Years Education)",
      age_limit: "Up to 35 Years",
      last_date: "December 10, 2026",
      apply_link: "https://hec.gov.pk",
      views: "3,120",
      date: "Oct 07, 2026",
      description_ur: "ایچ ای سی نے پاکستان کی یونیورسٹیوں میں ایم ایس اور پی ایچ ڈی کے لیے وظیفہ اسکالرشپ کا اعلان کیا ہے۔",
      instructions_ur: ["1. HEC پورٹل پر آن لائن درخواست جمع کروائیں۔"]
    }
  ];

  renderHeader();
  renderFooter();
  router('home');
}
