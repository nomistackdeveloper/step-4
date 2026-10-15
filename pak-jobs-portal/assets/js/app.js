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
    globalData = [...jobs, ...schemes];

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
