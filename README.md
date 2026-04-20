# MSME Demand Forecaster — Interactive AI Dashboard

## 🚀 Project Overview

A high-fidelity, cinematic dark-mode B2B SaaS dashboard prototype for small and medium business inventory forecasting. Built with a futuristic **night-flash lighting** aesthetic, **glassmorphism UI cards**, and **neon accent glow effects**.

---

## ✅ Completed Features

### Navigation Bar
- Logo with hex-badge and glowing neon accent
- Active Engine status with pulsing green dot
- Centered navigation links (Dashboard, Forecast, Inventory, Reports)
- Multi-branch dropdown selector: "Main Street Store" + 4 branches
- Notification bell with badge counter
- User avatar chip

### Upload Zone
- Drag-and-drop area with animated 3D floating folder icon
- File input (CSV / XLSX / XLS) support
- Simulated AI processing progress overlay (LSTM engine animation)
- Success modal with processing stats after upload

### KPI Metric Cards (Glassmorphism + Status Glow)
- 🔴 **Critical Alert Card** — Smartwatches: Stockout in 3 Days, Stock: 20, Demand: 85
  - Red lightning/flicker effect, pulse ring badge, demand coverage bar
  - Inline WhatsApp alert button
- 🟡 **Warning Card** — Power Banks: Reorder Next Week
  - 7-day velocity mini bar chart
- 🟣 **Revenue Risk Card** — ₹32,500 at risk with loss breakdown
  - Animated counter, sparkline, recovery suggestion

### Interactive Forecast Chart
- Chart.js LSTM line chart (30-day default)
- Real/forecast data with gradient fills
- 7D / 30D / 90D timeframe tabs
- Product selector: Smartwatches, Power Banks, Earbuds, Cables
- 95% Confidence Interval toggle (shows CI band)
- Festival/Weather Impact toggle (applies +34% Diwali boost)
- Custom tooltip design, stockout risk zone marker
- Bottom stats row: Accuracy, Peak Day, Reorder, Quantity

### AI Insights & Quick Actions Sidebar
- 4 contextual AI insights (critical, warning, info, success)
- Quick Action buttons: WhatsApp Supplier, Export PDF, Email Team

### Inventory Table
- Full inventory status for 8 products
- Live search/filter
- Status pills (Critical / Reorder Soon / Adequate / Well Stocked)
- Color-coded days remaining

### WhatsApp Integration Button
- Floating action button (FAB) bottom-right with pulsing animation
- Sends pre-formatted purchase alert message via WhatsApp Web

---

## 🗂 File Structure

```
index.html          — Main dashboard page
css/style.css       — All styles (dark mode, glassmorphism, neon effects, responsive)
js/main.js          — Chart.js setup, all interactivity, data engine
README.md           — This file
```

---

## 🎨 Design System

| Token | Value |
|---|---|
| Background | `#020509` (void black) |
| Cyan neon | `#00f5ff` |
| Green accent | `#00ff88` |
| Critical red | `#ff2244` |
| Warning yellow | `#ffd700` |
| Revenue purple | `#bf5fff` |
| Display font | Orbitron |
| Body font | Inter |

---

## 🌐 Entry Point

- `index.html` — Full dashboard (no routing required)

---

## ⚡ Keyboard Shortcuts

- `Ctrl + W` — Open WhatsApp alert

---

## 🔮 Recommended Next Steps

1. Connect real CSV parsing with PapaParse.js
2. Integrate actual LSTM API endpoint for real forecasting
3. Add user authentication (login/logout)
4. Implement multi-branch data aggregation via API
5. Build PDF export functionality using jsPDF
6. Add real-time WebSocket updates for live stock monitoring
7. Integrate with WhatsApp Business API (Twilio / Meta)
