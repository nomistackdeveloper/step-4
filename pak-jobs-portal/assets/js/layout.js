/* ==========================================================================
   PAKJOBS PORTAL - SHARED LAYOUT & COMPONENTS SCRIPT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  injectSharedLayout();
});

function injectSharedLayout() {
  // Automatically detect if we are inside the /pages/ subfolder or root
  const isInPagesFolder = window.location.pathname.includes('/pages/');
  const rootPath = isInPagesFolder ? '../' : './';

  // 1. Inject Header if placeholder exists
  const headerContainer = document.getElementById('site-header');
  if (headerContainer) {
    headerContainer.innerHTML = `
      <header class="bg-emerald-900 text-white shadow-md sticky top-0 z-50">
        <div class="max-w-5xl mx-auto px-4 py-3 flex justify-between items-center">
          <a href="${rootPath}index.html" class="text-lg sm:text-xl font-black tracking-tight flex items-center gap-2">
            <span class="bg-emerald-500 text-emerald-950 px-2 py-0.5 rounded text-sm">PK</span>
            <span>PakJobs Portal</span>
          </a>
          <nav class="flex items-center gap-3">
            <a href="${rootPath}index.html" class="text-xs bg-emerald-800 hover:bg-emerald-700 py-2 px-4 rounded-xl font-semibold transition shadow-sm">
              🏠 Home
            </a>
          </nav>
        </div>
      </header>
    `;
  }

  // 2. Inject Footer if placeholder exists
  const footerContainer = document.getElementById('site-footer');
  if (footerContainer) {
    footerContainer.innerHTML = `
      <footer class="bg-gray-900 text-gray-400 py-8 px-4 text-center text-xs border-t border-gray-800 space-y-4 mt-auto">
        <div class="max-w-4xl mx-auto flex flex-wrap justify-center gap-4 text-gray-300 font-medium">
          <a href="${rootPath}pages/about.html" class="hover:text-emerald-400 transition">About Us</a>
          <a href="${rootPath}pages/contact.html" class="hover:text-emerald-400 transition">Contact Us</a>
          <a href="${rootPath}pages/privacy-policy.html" class="hover:text-emerald-400 transition">Privacy Policy</a>
          <a href="${rootPath}pages/disclaimer.html" class="hover:text-emerald-400 transition">Disclaimer</a>
          <a href="${rootPath}pages/terms.html" class="hover:text-emerald-400 transition">Terms of Service</a>
        </div>
        <p class="text-gray-500">© 2026 PakJobs Portal. All rights reserved. Built for Pakistani Job Seekers & Students.</p>
      </footer>
    `;
  }
}