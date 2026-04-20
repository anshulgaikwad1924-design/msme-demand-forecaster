/* ===================================================================
   MSME DEMAND FORECASTER — Interactive Dashboard Logic
   Chart.js · Forecasts · Toggles · Drag-Drop · Animations
=================================================================== */

'use strict';

// ─── STATE ──────────────────────────────────────────────────────
const state = {
  ciEnabled: false,
  festivalEnabled: false,
  currentTimeframe: '30d',
  currentProduct: 'smartwatch',
  forecastChart: null,
};

// ─── DATA ENGINE ─────────────────────────────────────────────────
const FORECAST_DATA = {
  smartwatch: {
    labels30: generateLabels(30),
    actual: generateActual(30, 28, 42, 0),
    forecast: generateForecast(30, 30, 45, 8),
    ciUpper: generateForecast(30, 40, 58, 8),
    ciLower: generateForecast(30, 22, 35, 8),
    festivalForecast: generateFestivalForecast(30, 30, 45, 8, 0.34),
    color: '0, 245, 255',
    stockout: 3,
  },
  powerbank: {
    labels30: generateLabels(30),
    actual: generateActual(30, 40, 60, 2),
    forecast: generateForecast(30, 45, 65, 10),
    ciUpper: generateForecast(30, 58, 80, 10),
    ciLower: generateForecast(30, 32, 50, 10),
    festivalForecast: generateFestivalForecast(30, 45, 65, 10, 0.2),
    color: '255, 215, 0',
    stockout: null,
  },
  earbuds: {
    labels30: generateLabels(30),
    actual: generateActual(30, 55, 75, 4),
    forecast: generateForecast(30, 58, 80, 12),
    ciUpper: generateForecast(30, 70, 95, 12),
    ciLower: generateForecast(30, 48, 65, 12),
    festivalForecast: generateFestivalForecast(30, 58, 80, 12, 0.22),
    color: '0, 255, 136',
    stockout: null,
  },
  cables: {
    labels30: generateLabels(30),
    actual: generateActual(30, 80, 120, 5),
    forecast: generateForecast(30, 85, 125, 15),
    ciUpper: generateForecast(30, 100, 145, 15),
    ciLower: generateForecast(30, 70, 105, 15),
    festivalForecast: generateFestivalForecast(30, 85, 125, 15, 0.15),
    color: '191, 95, 255',
    stockout: null,
  },
};

function generateLabels(n) {
  const labels = [];
  const today = new Date();
  for (let i = -7; i < n; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    labels.push(d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }));
  }
  return labels;
}

function generateActual(n, min, max, seed) {
  const arr = [];
  let val = min + (max - min) / 2;
  for (let i = 0; i < n + 7; i++) {
    if (i <= 6) { // past 7 days
      val += (Math.sin(i * 0.8 + seed) * 4) + (Math.random() - 0.5) * 6;
      val = Math.max(min, Math.min(max, val));
      arr.push(Math.round(val));
    } else {
      arr.push(null);
    }
  }
  return arr;
}

function generateForecast(n, min, max, seed) {
  const arr = [];
  let val = min + (max - min) / 2;
  for (let i = 0; i < n + 7; i++) {
    val += (Math.sin(i * 0.6 + seed) * 5) + (Math.random() - 0.5) * 4;
    val = Math.max(min - 5, Math.min(max + 10, val));
    // Trend upward toward end
    if (i > 20) val += 0.3;
    arr.push(Math.round(val));
  }
  return arr;
}

function generateFestivalForecast(n, min, max, seed, boost) {
  const base = generateForecast(n, min, max, seed);
  return base.map((v, i) => {
    if (i > 25) return Math.round(v * (1 + boost));
    if (i > 20) return Math.round(v * (1 + boost * 0.5));
    return v;
  });
}

// ─── CHART INITIALIZATION ─────────────────────────────────────────
function initChart() {
  const ctx = document.getElementById('forecastChart').getContext('2d');
  const data = FORECAST_DATA[state.currentProduct];

  // Gradient fills
  const gradientForecast = ctx.createLinearGradient(0, 0, 0, 380);
  gradientForecast.addColorStop(0, `rgba(${data.color}, 0.25)`);
  gradientForecast.addColorStop(1, `rgba(${data.color}, 0.01)`);

  const gradientCI = ctx.createLinearGradient(0, 0, 0, 380);
  gradientCI.addColorStop(0, `rgba(0, 245, 255, 0.12)`);
  gradientCI.addColorStop(1, `rgba(0, 245, 255, 0.01)`);

  const datasets = buildDatasets(data, ctx);

  state.forecastChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.labels30,
      datasets: datasets,
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      animation: {
        duration: 800,
        easing: 'easeInOutCubic',
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(4, 10, 18, 0.95)',
          borderColor: `rgba(${data.color}, 0.4)`,
          borderWidth: 1,
          titleColor: '#e8f4ff',
          bodyColor: '#6b8aab',
          padding: 12,
          cornerRadius: 10,
          titleFont: { family: 'Inter', size: 13, weight: '600' },
          bodyFont: { family: 'Inter', size: 12 },
          callbacks: {
            label: function(context) {
              const label = context.dataset.label || '';
              const value = context.parsed.y;
              if (value === null) return null;
              return `  ${label}: ${value} units`;
            }
          }
        },
      },
      scales: {
        x: {
          grid: { color: 'rgba(255,255,255,0.04)', drawBorder: false },
          ticks: {
            color: '#3d5a77',
            font: { size: 11 },
            maxTicksLimit: 10,
          },
          border: { display: false },
        },
        y: {
          grid: { color: 'rgba(255,255,255,0.04)', drawBorder: false },
          ticks: {
            color: '#3d5a77',
            font: { size: 11 },
            callback: (v) => v + ' u',
          },
          border: { display: false },
        },
      },
    },
  });
}

function buildDatasets(data, ctx) {
  const color = data.color;
  const datasets = [];

  // CI Band (filled area between upper and lower) — only if enabled
  if (state.ciEnabled) {
    datasets.push({
      label: '95% CI Upper',
      data: data.ciUpper,
      borderColor: 'transparent',
      backgroundColor: `rgba(0, 245, 255, 0.07)`,
      fill: '+1',
      tension: 0.4,
      pointRadius: 0,
      pointHoverRadius: 0,
    });
    datasets.push({
      label: '95% CI Lower',
      data: data.ciLower,
      borderColor: `rgba(0, 245, 255, 0.25)`,
      borderDash: [4, 4],
      borderWidth: 1,
      backgroundColor: 'transparent',
      fill: false,
      tension: 0.4,
      pointRadius: 0,
      pointHoverRadius: 0,
    });
  }

  // Festival Adjusted (if enabled)
  if (state.festivalEnabled) {
    datasets.push({
      label: 'Festival Adjusted',
      data: data.festivalForecast,
      borderColor: 'rgba(255, 140, 0, 0.8)',
      borderWidth: 2,
      borderDash: [6, 3],
      backgroundColor: 'transparent',
      fill: false,
      tension: 0.4,
      pointRadius: 0,
      pointHoverRadius: 5,
    });
  }

  // AI Forecast (main line)
  const gradForecast = ctx.createLinearGradient(0, 0, 0, 380);
  gradForecast.addColorStop(0, `rgba(${color}, 0.2)`);
  gradForecast.addColorStop(1, `rgba(${color}, 0.0)`);

  datasets.push({
    label: 'AI Forecast',
    data: data.forecast,
    borderColor: `rgba(${color}, 1)`,
    borderWidth: 2.5,
    backgroundColor: gradForecast,
    fill: true,
    tension: 0.4,
    pointRadius: 0,
    pointHoverRadius: 6,
    pointHoverBackgroundColor: `rgba(${color}, 1)`,
    pointHoverBorderColor: '#fff',
    pointHoverBorderWidth: 2,
  });

  // Actual Sales (past data)
  datasets.push({
    label: 'Actual Sales',
    data: data.actual,
    borderColor: 'rgba(255,255,255,0.5)',
    borderWidth: 2,
    backgroundColor: 'transparent',
    fill: false,
    tension: 0.4,
    pointRadius: 3,
    pointBackgroundColor: 'rgba(255,255,255,0.7)',
    pointHoverRadius: 6,
    borderDash: [],
    spanGaps: false,
  });

  return datasets;
}

function updateChart() {
  if (!state.forecastChart) return;
  const data = FORECAST_DATA[state.currentProduct];
  const ctx = state.forecastChart.ctx;
  state.forecastChart.data.datasets = buildDatasets(data, ctx);
  state.forecastChart.data.labels = data.labels30;
  state.forecastChart.update('active');
  updateChartColor(data.color);
}

function updateChartColor(color) {
  // Update CI legend visibility
  const legendCI = document.getElementById('legendCI');
  const legendFestival = document.getElementById('legendFestival');
  if (legendCI) legendCI.style.display = state.ciEnabled ? 'flex' : 'none';
  if (legendFestival) legendFestival.style.display = state.festivalEnabled ? 'flex' : 'none';
}

// ─── TOGGLE HANDLERS ──────────────────────────────────────────────
function toggleConfidenceInterval(enabled) {
  state.ciEnabled = enabled;
  updateChart();
  showToast(enabled ? '95% Confidence Interval enabled' : 'Confidence Interval hidden');
}

function toggleFestivalImpact(enabled) {
  state.festivalEnabled = enabled;
  updateChart();
  showToast(enabled ? 'Festival & Weather impact applied ✨' : 'Festival impact removed');
}

// ─── TIMEFRAME ────────────────────────────────────────────────────
function setTimeframe(tf, btn) {
  state.currentTimeframe = tf;
  document.querySelectorAll('.tf-tab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  updateChart();
}

// ─── PRODUCT SWITCH ────────────────────────────────────────────────
function switchProduct(product) {
  state.currentProduct = product;
  updateChart();
  // Update stockout marker
  const marker = document.getElementById('stockoutMarker');
  if (marker) {
    marker.style.display = FORECAST_DATA[product].stockout ? 'flex' : 'none';
  }
}

// ─── DRAG & DROP UPLOAD ────────────────────────────────────────────
function handleDragOver(e) {
  e.preventDefault();
  e.stopPropagation();
  document.getElementById('uploadZone').classList.add('drag-over');
}

function handleDragLeave(e) {
  e.preventDefault();
  document.getElementById('uploadZone').classList.remove('drag-over');
}

function handleDrop(e) {
  e.preventDefault();
  e.stopPropagation();
  document.getElementById('uploadZone').classList.remove('drag-over');
  const files = e.dataTransfer.files;
  if (files.length > 0) {
    processFile(files[0]);
  }
}

function triggerFileUpload() {
  document.getElementById('fileInput').click();
}

function handleFileSelect(e) {
  const file = e.target.files[0];
  if (file) processFile(file);
}

function processFile(file) {
  const validTypes = ['.csv', '.xlsx', '.xls'];
  const ext = '.' + file.name.split('.').pop().toLowerCase();
  if (!validTypes.includes(ext)) {
    showToast('Please upload a CSV or Excel file', 'error');
    return;
  }

  // Show progress overlay
  const progressEl = document.getElementById('uploadProgress');
  const fillEl = document.getElementById('progressBarFill');
  const pctEl = document.getElementById('progressPct');

  progressEl.classList.add('visible');

  let pct = 0;
  const msgs = ['Reading file structure...', 'Cleaning data...', 'Training LSTM model...', 'Generating forecast...', 'Finalizing predictions...'];
  let msgIdx = 0;

  const interval = setInterval(() => {
    pct += Math.random() * 18;
    if (pct >= 100) {
      pct = 100;
      clearInterval(interval);
      setTimeout(() => {
        progressEl.classList.remove('visible');
        openModal();
      }, 400);
    }
    fillEl.style.width = pct + '%';
    pctEl.textContent = Math.floor(pct) + '%';

    if (pct > (msgIdx + 1) * 20 && msgIdx < msgs.length - 1) {
      msgIdx++;
      const textEl = progressEl.querySelector('.progress-text');
      if (textEl) textEl.textContent = msgs[msgIdx];
    }
  }, 200);
}

// ─── BRANCH DROPDOWN ──────────────────────────────────────────────
function toggleDropdown() {
  const menu = document.getElementById('dropdownMenu');
  const chevron = document.getElementById('chevronIcon');
  const isOpen = menu.classList.contains('open');

  if (isOpen) {
    menu.classList.remove('open');
    chevron.classList.remove('rotated');
  } else {
    menu.classList.add('open');
    chevron.classList.add('rotated');
  }
}

function selectBranch(name, el) {
  document.querySelectorAll('.dropdown-item').forEach(item => item.classList.remove('active'));
  el.classList.add('active');
  document.querySelector('.branch-main').textContent = name;
  toggleDropdown();
  showToast(`Switched to: ${name}`);
}

// Close dropdown on outside click
document.addEventListener('click', function(e) {
  const dropdown = document.getElementById('branchDropdown');
  if (dropdown && !dropdown.contains(e.target)) {
    const menu = document.getElementById('dropdownMenu');
    const chevron = document.getElementById('chevronIcon');
    if (menu) menu.classList.remove('open');
    if (chevron) chevron.classList.remove('rotated');
  }
});

// ─── WHATSAPP ─────────────────────────────────────────────────────
function sendWhatsApp() {
  const msg = encodeURIComponent(
    `🚨 *CRITICAL STOCK ALERT - MSME Demand Forecaster*\n\n` +
    `📦 *Product:* Smartwatches\n` +
    `⚠️ *Status:* Stockout in 3 Days!\n` +
    `📉 Current Stock: 20 units\n` +
    `📈 Predicted Demand: 85 units\n` +
    `💸 Revenue at Risk: ₹18,200\n\n` +
    `Please arrange immediate reorder of minimum 150 units.\n\n` +
    `_Sent via MSME Demand Forecaster AI_`
  );
  window.open(`https://wa.me/?text=${msg}`, '_blank');
  showToast('WhatsApp alert prepared! ✓');
}

// ─── TOAST ────────────────────────────────────────────────────────
let toastTimeout;
function showToast(msg, type = 'success') {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toastMsg');
  if (!toast) return;

  toastMsg.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// ─── MODAL ────────────────────────────────────────────────────────
function openModal() {
  const overlay = document.getElementById('modalOverlay');
  if (overlay) overlay.classList.add('open');
}
function closeModal() {
  const overlay = document.getElementById('modalOverlay');
  if (overlay) overlay.classList.remove('open');
}

// ─── MINI BARS (Power Banks) ──────────────────────────────────────
function initMiniBars() {
  const container = document.getElementById('miniBarsPB');
  if (!container) return;
  const vals = [45, 60, 52, 72, 68, 85, 78];
  const max = Math.max(...vals);
  container.innerHTML = vals.map(v => {
    const pct = (v / max) * 100;
    return `<div class="mini-bar" style="height:${pct}%" title="${v} units"></div>`;
  }).join('');
}

// ─── REVENUE SPARKLINE ────────────────────────────────────────────
function initRevenueSparkline() {
  const container = document.getElementById('revenueSparkline');
  if (!container) return;
  const vals = [22000, 28000, 25000, 31000, 29000, 35000, 32500];
  const max = Math.max(...vals);
  container.style.display = 'flex';
  container.style.gap = '3px';
  container.style.alignItems = 'flex-end';
  container.innerHTML = vals.map((v, i) => {
    const pct = (v / max) * 100;
    const isLast = i === vals.length - 1;
    return `<div style="
      flex:1;
      height:${pct}%;
      background: ${isLast ? 'var(--red)' : 'rgba(191,95,255,0.4)'};
      border-radius: 2px 2px 0 0;
      min-height: 4px;
      ${isLast ? 'box-shadow: 0 0 8px rgba(255,34,68,0.5);' : ''}
    "></div>`;
  }).join('');
}

// ─── INVENTORY TABLE ─────────────────────────────────────────────
const INVENTORY = [
  { product: 'Smartwatches', icon: '⌚', category: 'Wearables', stock: 20, demand7: 28, forecast30: 85, daysLeft: 3, status: 'critical' },
  { product: 'Power Banks', icon: '🔋', category: 'Accessories', stock: 145, demand7: 32, forecast30: 200, daysLeft: 10, status: 'warning' },
  { product: 'Earbuds', icon: '🎧', category: 'Audio', stock: 310, demand7: 48, forecast30: 290, daysLeft: 22, status: 'good' },
  { product: 'USB Cables', icon: '🔌', category: 'Accessories', stock: 520, demand7: 85, forecast30: 480, daysLeft: 18, status: 'ok' },
  { product: 'Phone Cases', icon: '📱', category: 'Protection', stock: 880, demand7: 62, forecast30: 550, daysLeft: 40, status: 'good' },
  { product: 'Screen Guards', icon: '🛡️', category: 'Protection', stock: 1200, demand7: 90, forecast30: 680, daysLeft: 38, status: 'good' },
  { product: 'Laptop Bags', icon: '💼', category: 'Bags', stock: 85, demand7: 22, forecast30: 140, daysLeft: 11, status: 'warning' },
  { product: 'Smart Speakers', icon: '🔊', category: 'Audio', stock: 44, demand7: 18, forecast30: 65, daysLeft: 7, status: 'warning' },
];

const STATUS_CONFIG = {
  critical: { label: 'Critical', cls: 'pill-critical', icon: '🔴' },
  warning: { label: 'Reorder Soon', cls: 'pill-warning', icon: '🟡' },
  ok: { label: 'Adequate', cls: 'pill-ok', icon: '🟢' },
  good: { label: 'Well Stocked', cls: 'pill-good', icon: '🔵' },
};

function renderTable(data) {
  const tbody = document.getElementById('tableBody');
  if (!tbody) return;

  tbody.innerHTML = data.map(row => {
    const cfg = STATUS_CONFIG[row.status];
    return `
      <tr>
        <td>
          <div class="product-cell">
            <div class="product-icon">${row.icon}</div>
            <span style="font-weight:600;color:var(--text-primary)">${row.product}</span>
          </div>
        </td>
        <td>${row.category}</td>
        <td style="color:${row.stock < 50 ? 'var(--red)' : 'var(--text-secondary)'};font-weight:${row.stock < 50 ? '700' : '400'}">${row.stock}</td>
        <td>${row.demand7}</td>
        <td>${row.forecast30}</td>
        <td style="color:${row.daysLeft <= 7 ? 'var(--red)' : row.daysLeft <= 14 ? 'var(--yellow)' : 'var(--green)'};font-weight:600">${row.daysLeft}d</td>
        <td><span class="status-pill ${cfg.cls}">${cfg.icon} ${cfg.label}</span></td>
        <td><a class="action-link" onclick="handleAction('${row.product}')">Reorder ↗</a></td>
      </tr>
    `;
  }).join('');
}

function filterTable(query) {
  const lower = query.toLowerCase();
  const filtered = INVENTORY.filter(row =>
    row.product.toLowerCase().includes(lower) ||
    row.category.toLowerCase().includes(lower)
  );
  renderTable(filtered);
}

function handleAction(product) {
  showToast(`Reorder initiated for ${product}!`);
}

// ─── DATE ─────────────────────────────────────────────────────────
function updateDate() {
  const el = document.getElementById('currentDate');
  if (!el) return;
  const now = new Date();
  el.textContent = now.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

// ─── COUNTER ANIMATION ────────────────────────────────────────────
function animateCounter(el, target, duration = 1500, prefix = '') {
  if (!el) return;
  const start = 0;
  const startTime = performance.now();
  function update(time) {
    const elapsed = time - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(eased * target);
    el.textContent = current.toLocaleString('en-IN');
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

// ─── NAVBAR SCROLL EFFECT ─────────────────────────────────────────
window.addEventListener('scroll', () => {
  const navbar = document.getElementById('navbar');
  if (navbar) {
    if (window.scrollY > 20) {
      navbar.style.boxShadow = '0 4px 40px rgba(0, 0, 0, 0.6)';
    } else {
      navbar.style.boxShadow = '0 4px 40px rgba(0, 245, 255, 0.06)';
    }
  }
});

// ─── INTERSECTION OBSERVER (animate on scroll) ────────────────────
function initObserver() {
  const cards = document.querySelectorAll('.kpi-card, .glass-panel');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });

  cards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    obs.observe(card);
  });
}

// ─── KPI CARD HOVER 3D TILT ───────────────────────────────────────
function initCardTilt() {
  document.querySelectorAll('.kpi-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rotX = ((y - cy) / cy) * -6;
      const rotY = ((x - cx) / cx) * 6;
      card.style.transform = `translateY(-6px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.02)`;
      card.style.transformStyle = 'preserve-3d';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

// ─── BOOT ─────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  updateDate();
  initMiniBars();
  initRevenueSparkline();
  renderTable(INVENTORY);

  // Init chart after a small delay to ensure canvas is ready
  setTimeout(() => {
    initChart();
    updateChartColor(FORECAST_DATA[state.currentProduct].color);
  }, 100);

  // Animate KPI counters
  setTimeout(() => {
    animateCounter(document.getElementById('revenueCounter'), 32500, 1800);
  }, 600);

  // Animate demand bars
  setTimeout(() => {
    document.querySelectorAll('.demand-bar-fill').forEach(bar => {
      const target = bar.style.width;
      bar.style.width = '0%';
      setTimeout(() => { bar.style.width = target; }, 100);
    });
  }, 400);

  // Init scroll animations
  setTimeout(initObserver, 200);

  // Init 3D tilt
  setTimeout(initCardTilt, 800);

  // Keyboard shortcut: W for WhatsApp
  document.addEventListener('keydown', (e) => {
    if (e.key === 'w' && e.ctrlKey) {
      e.preventDefault();
      sendWhatsApp();
    }
  });
});
