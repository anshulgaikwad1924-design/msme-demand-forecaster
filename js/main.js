/* ============================================================
   QUEUEEASE — INTERACTIVE JAVASCRIPT ENGINE
   3D Effects | Live Queue | Charts | Animations
   ============================================================ */

'use strict';

// ---- DOM Ready ----
document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initParticles();
    initHeroCanvas();
    initScrollReveal();
    initCounters();
    initQueueSystem();
    initDoctorPanel();
    initCharts();
    initImpactBars();
    initPredictionChart();
    initClock();
    initMobileNav();
    initQRGrid();
});

/* ============================================================
   NAVBAR SCROLL BEHAVIOR
   ============================================================ */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Smooth scroll for nav links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

/* ============================================================
   MOBILE NAV
   ============================================================ */
function initMobileNav() {
    const hamburger = document.getElementById('hamburger');
    if (!hamburger) return;

    let mobileMenu = null;

    hamburger.addEventListener('click', () => {
        if (mobileMenu) {
            mobileMenu.remove();
            mobileMenu = null;
            return;
        }
        mobileMenu = document.createElement('div');
        mobileMenu.style.cssText = `
            position: fixed; top: 70px; left: 0; right: 0;
            background: rgba(2, 8, 23, 0.97);
            backdrop-filter: blur(20px);
            border-bottom: 1px solid rgba(255,255,255,0.08);
            padding: 1.5rem 2rem;
            z-index: 999;
            display: flex; flex-direction: column; gap: 1rem;
        `;
        ['Features', 'Live Queue', 'How It Works', 'Impact', 'AI Engine'].forEach((link, i) => {
            const anchors = ['#features', '#tracker', '#how-it-works', '#impact', '#predictive'];
            const a = document.createElement('a');
            a.href = anchors[i];
            a.textContent = link;
            a.style.cssText = 'color: rgba(240,246,255,0.8); font-size: 1rem; font-weight: 500; padding: 0.5rem 0; border-bottom: 1px solid rgba(255,255,255,0.05);';
            a.addEventListener('click', () => { mobileMenu.remove(); mobileMenu = null; });
            mobileMenu.appendChild(a);
        });
        document.body.appendChild(mobileMenu);
    });
}

/* ============================================================
   PARTICLE SYSTEM
   ============================================================ */
function initParticles() {
    const container = document.getElementById('particles');
    if (!container) return;

    const colors = ['rgba(0, 212, 170, 0.6)', 'rgba(102, 126, 234, 0.5)', 'rgba(0, 240, 192, 0.4)'];
    const count = 25;

    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        const size = Math.random() * 4 + 1;
        const color = colors[Math.floor(Math.random() * colors.length)];
        const duration = Math.random() * 15 + 10;
        const delay = Math.random() * 15;
        const left = Math.random() * 100;

        particle.style.cssText = `
            width: ${size}px; height: ${size}px;
            background: ${color};
            left: ${left}%;
            bottom: 0;
            animation-duration: ${duration}s;
            animation-delay: ${delay}s;
            box-shadow: 0 0 ${size * 2}px ${color};
        `;
        container.appendChild(particle);
    }
}

/* ============================================================
   HERO CANVAS — THREE.JS BACKGROUND
   ============================================================ */
function initHeroCanvas() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas || typeof THREE === 'undefined') return;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    // Grid of dots
    const geometry = new THREE.BufferGeometry();
    const count = 800;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 20;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 20;

        // Teal or purple
        const isTeal = Math.random() > 0.5;
        colors[i * 3] = isTeal ? 0 : 0.4;
        colors[i * 3 + 1] = isTeal ? 0.83 : 0.49;
        colors[i * 3 + 2] = isTeal ? 0.67 : 0.92;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
        size: 0.05,
        vertexColors: true,
        transparent: true,
        opacity: 0.6,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // Floating geometric shapes
    const shapes = [];
    const shapeGeo = [
        new THREE.OctahedronGeometry(0.3),
        new THREE.TetrahedronGeometry(0.25),
        new THREE.IcosahedronGeometry(0.2),
    ];

    for (let i = 0; i < 6; i++) {
        const geo = shapeGeo[i % 3];
        const mat = new THREE.MeshBasicMaterial({
            color: i % 2 === 0 ? 0x00d4aa : 0x667eea,
            wireframe: true,
            opacity: 0.15,
            transparent: true,
        });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 5
        );
        mesh.userData = {
            rotX: (Math.random() - 0.5) * 0.01,
            rotY: (Math.random() - 0.5) * 0.01,
            floatSpeed: Math.random() * 0.001 + 0.0005,
            floatOffset: Math.random() * Math.PI * 2,
        };
        scene.add(mesh);
        shapes.push(mesh);
    }

    // Mouse parallax
    let mouseX = 0, mouseY = 0;
    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 0.5;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 0.5;
    });

    // Animation loop
    let time = 0;
    function animate() {
        requestAnimationFrame(animate);
        time += 0.001;

        points.rotation.y += 0.0003;
        points.rotation.x += 0.0001;

        shapes.forEach(shape => {
            shape.rotation.x += shape.userData.rotX;
            shape.rotation.y += shape.userData.rotY;
            shape.position.y += Math.sin(time * 1000 * shape.userData.floatSpeed + shape.userData.floatOffset) * 0.003;
        });

        camera.position.x += (mouseX - camera.position.x) * 0.02;
        camera.position.y += (-mouseY - camera.position.y) * 0.02;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

/* ============================================================
   SCROLL REVEAL
   ============================================================ */
function initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

/* ============================================================
   COUNTER ANIMATIONS
   ============================================================ */
function initCounters() {
    // Hero stats
    const statNums = document.querySelectorAll('.stat-number[data-count]');
    const statObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target, parseInt(entry.target.dataset.count));
                statObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    statNums.forEach(el => statObserver.observe(el));

    // Impact section
    const countUps = document.querySelectorAll('.count-up[data-target]');
    const impactObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target, parseInt(entry.target.dataset.target));
                impactObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    countUps.forEach(el => impactObserver.observe(el));
}

function animateCounter(el, target) {
    const duration = 2000;
    const start = performance.now();
    const easeOut = t => 1 - Math.pow(1 - t, 3);

    function update(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        el.textContent = Math.round(easeOut(progress) * target);
        if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
}

/* ============================================================
   IMPACT BARS
   ============================================================ */
function initImpactBars() {
    const bars = document.querySelectorAll('.impact-bar-fill');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.width = entry.target.dataset.width + '%';
                }, 300);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    bars.forEach(bar => observer.observe(bar));
}

/* ============================================================
   LIVE CLOCK
   ============================================================ */
function initClock() {
    const timeEl = document.getElementById('current-time');
    const dateEl = document.getElementById('current-date');

    const now = new Date();
    if (dateEl) {
        dateEl.textContent = now.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    }

    function updateTime() {
        if (timeEl) {
            const d = new Date();
            timeEl.textContent = d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        }
    }
    updateTime();
    setInterval(updateTime, 1000);

    // Serving timer countdown
    const timerEl = document.getElementById('serving-timer');
    let servingSeconds = 272;
    setInterval(() => {
        if (timerEl) {
            servingSeconds++;
            const m = Math.floor(servingSeconds / 60);
            const s = servingSeconds % 60;
            timerEl.textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
        }
    }, 1000);
}

/* ============================================================
   QUEUE SYSTEM
   ============================================================ */
const queueData = {
    general: [
        { token: 'A45', name: 'Priya M.', wait: '~3 min', initials: 'PM', color: '#667eea' },
        { token: 'A46', name: 'Rohan S.', wait: '~8 min', initials: 'RS', color: '#00d4aa' },
        { token: 'A47', name: 'Anita K.', wait: '~13 min', initials: 'AK', color: '#9c59d1' },
        { token: 'A48', name: 'Vikram J.', wait: '~18 min', initials: 'VJ', color: '#f093fb' },
        { token: 'A49', name: 'Sunita R.', wait: '~23 min', initials: 'SR', color: '#4facfe' },
        { token: 'A50', name: 'Deepak P.', wait: '~28 min', initials: 'DP', color: '#43e97b' },
        { token: 'A51', name: 'Meena T.', wait: '~33 min', initials: 'MT', color: '#fa709a' },
        { token: 'A52', name: 'Arjun N.', wait: '~38 min', initials: 'AN', color: '#00d4aa' },
    ],
    cardio: [
        { token: 'B12', name: 'Ravi K.', wait: '~5 min', initials: 'RK', color: '#f093fb' },
        { token: 'B13', name: 'Geeta S.', wait: '~15 min', initials: 'GS', color: '#4facfe' },
        { token: 'B14', name: 'Mohan V.', wait: '~25 min', initials: 'MV', color: '#43e97b' },
        { token: 'B15', name: 'Lakshmi R.', wait: '~35 min', initials: 'LR', color: '#667eea' },
        { token: 'B16', name: 'Sanjay K.', wait: '~45 min', initials: 'SK', color: '#fa709a' },
    ],
    ortho: [
        { token: 'C08', name: 'Amit B.', wait: '~7 min', initials: 'AB', color: '#43e97b' },
        { token: 'C09', name: 'Neha J.', wait: '~20 min', initials: 'NJ', color: '#fa709a' },
        { token: 'C10', name: 'Rahul G.', wait: '~33 min', initials: 'RG', color: '#00d4aa' },
    ],
};

let currentDept = 'general';
let emergencyActive = false;

function initQueueSystem() {
    renderQueue(currentDept);
    // Simulate live updates every 15 seconds
    setInterval(() => simulateQueueUpdate(), 15000);
}

function renderQueue(dept) {
    const grid = document.getElementById('queue-grid');
    if (!grid) return;
    const data = queueData[dept];
    grid.innerHTML = '';

    data.forEach((patient, idx) => {
        const item = document.createElement('div');
        item.className = 'queue-item';
        if (patient.emergency) item.classList.add('emergency-item');
        item.innerHTML = `
            ${patient.emergency ? '<div class="emergency-badge">EMRG</div>' : ''}
            <div class="qi-avatar" style="border-color: ${patient.color}; color: ${patient.color};">${patient.initials}</div>
            <div class="qi-token">${patient.token}</div>
            <div class="qi-name">${patient.name}</div>
            <div class="qi-wait"><i class="fas fa-clock"></i> ${patient.wait}</div>
        `;
        item.style.animationDelay = `${idx * 0.05}s`;
        grid.appendChild(item);
    });

    document.getElementById('total-waiting').textContent = data.filter(p => !p.served).length;
}

window.switchDept = function(dept) {
    currentDept = dept;
    document.querySelectorAll('.dash-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    const headers = { general: 'General Medicine', cardio: 'Cardiology', ortho: 'Orthopedics' };
    document.querySelector('.dash-title h3').textContent = `OPD Queue — ${headers[dept]}`;
    renderQueue(dept);
};

function simulateQueueUpdate() {
    const data = queueData[currentDept];
    if (data.length === 0) return;
    // Slightly randomize wait times
    data.forEach((p, i) => {
        const baseWait = (i + 1) * 5 + Math.floor(Math.random() * 3);
        p.wait = `~${baseWait} min`;
    });
    renderQueue(currentDept);
}

// Emergency override simulation
window.triggerEmergency = function() {
    if (emergencyActive) return;
    emergencyActive = true;

    const btn = document.getElementById('emergency-btn');
    btn.classList.add('triggered');
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing Emergency...';
    btn.disabled = true;

    const emergencyPatient = {
        token: '🚨 E01', name: 'CRITICAL — TRAUMA', wait: 'PRIORITY',
        initials: '!', color: '#ff6b6b', emergency: true
    };

    setTimeout(() => {
        // Insert emergency patient at front
        const data = queueData[currentDept];
        data.unshift(emergencyPatient);
        // Recalculate wait times
        data.forEach((p, i) => {
            if (!p.emergency) p.wait = `~${(i + 1) * 5 + 12} min`;
        });
        renderQueue(currentDept);

        // Update total count
        document.getElementById('total-waiting').textContent = data.length;

        // Show notification
        showNotification('⚠️ Emergency Override Active', 'Queue reordered. All patients notified of ~12min delay.');

        btn.innerHTML = '<i class="fas fa-check-circle"></i> Emergency Override Active';
        btn.style.borderColor = 'rgba(255,107,107,0.8)';

        // Reset after 8 seconds
        setTimeout(() => {
            const idx = queueData[currentDept].findIndex(p => p.emergency);
            if (idx > -1) queueData[currentDept].splice(idx, 1);
            queueData[currentDept].forEach((p, i) => {
                p.wait = `~${(i + 1) * 5} min`;
            });
            renderQueue(currentDept);
            btn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Simulate Emergency Override';
            btn.disabled = false;
            btn.classList.remove('triggered');
            btn.style.borderColor = '';
            emergencyActive = false;
            showNotification('✅ Emergency Resolved', 'Queue normalized. Regular schedule resumed.');
        }, 8000);
    }, 1500);
};

function showNotification(title, message) {
    const notif = document.createElement('div');
    notif.style.cssText = `
        position: fixed; bottom: 2rem; right: 2rem; z-index: 10000;
        background: rgba(10, 22, 40, 0.95);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(0, 212, 170, 0.3);
        border-radius: 12px; padding: 1rem 1.5rem;
        max-width: 320px;
        box-shadow: 0 0 30px rgba(0, 212, 170, 0.15), 0 8px 32px rgba(0,0,0,0.4);
        animation: slide-in-notif 0.5s ease;
        font-family: 'Inter', sans-serif;
    `;
    notif.innerHTML = `
        <div style="font-weight: 700; font-size: 0.9rem; color: #f0f6ff; margin-bottom: 0.3rem;">${title}</div>
        <div style="font-size: 0.8rem; color: rgba(240,246,255,0.7);">${message}</div>
    `;
    document.body.appendChild(notif);

    const style = document.createElement('style');
    style.textContent = `@keyframes slide-in-notif { from { transform: translateX(120%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }`;
    document.head.appendChild(style);

    setTimeout(() => {
        notif.style.transition = 'all 0.5s ease';
        notif.style.opacity = '0';
        notif.style.transform = 'translateX(120%)';
        setTimeout(() => notif.remove(), 500);
    }, 4000);
}

/* ============================================================
   DOCTOR PANEL
   ============================================================ */
const doctors = [
    { name: 'Dr. Priya Sharma', dept: 'General Medicine', initials: 'PS', status: 'available', patients: 12 },
    { name: 'Dr. Arjun Mehta', dept: 'General Medicine', initials: 'AM', status: 'busy', patients: 8 },
    { name: 'Dr. Kavya Reddy', dept: 'Cardiology', initials: 'KR', status: 'available', patients: 15 },
    { name: 'Dr. Suresh Babu', dept: 'Cardiology', initials: 'SB', status: 'break', patients: 6 },
    { name: 'Dr. Roshni Patel', dept: 'Orthopedics', initials: 'RP', status: 'available', patients: 9 },
    { name: 'Dr. Vikram Nair', dept: 'Orthopedics', initials: 'VN', status: 'busy', patients: 11 },
    { name: 'Dr. Lakshmi Devi', dept: 'Pediatrics', initials: 'LD', status: 'available', patients: 14 },
    { name: 'Dr. Anil Kumar', dept: 'ENT', initials: 'AK', status: 'busy', patients: 7 },
];

function initDoctorPanel() {
    const grid = document.getElementById('doctors-grid');
    if (!grid) return;

    doctors.forEach((doc, i) => {
        const card = document.createElement('div');
        card.className = 'doctor-card';
        const statusLabels = { available: 'Available', busy: 'In Consultation', break: 'On Break' };
        card.innerHTML = `
            <div class="doc-avatar">${doc.initials}</div>
            <div class="doc-info">
                <div class="doc-name">${doc.name}</div>
                <div class="doc-dept">${doc.dept}</div>
            </div>
            <div class="doc-status ${doc.status}" id="doc-status-${i}">${statusLabels[doc.status]}</div>
        `;
        // Click to toggle status
        card.style.cursor = 'pointer';
        card.addEventListener('click', () => {
            const statuses = ['available', 'busy', 'break'];
            const statusEl = document.getElementById(`doc-status-${i}`);
            const current = statuses.indexOf(doc.status);
            doc.status = statuses[(current + 1) % statuses.length];
            statusEl.className = `doc-status ${doc.status}`;
            statusEl.textContent = statusLabels[doc.status];
        });
        grid.appendChild(card);
    });

    // Simulate availability changes
    setInterval(() => {
        const randomDoc = doctors[Math.floor(Math.random() * doctors.length)];
        const statuses = ['available', 'busy'];
        const statusLabels = { available: 'Available', busy: 'In Consultation', break: 'On Break' };
        const i = doctors.indexOf(randomDoc);
        randomDoc.status = statuses[Math.floor(Math.random() * statuses.length)];
        const statusEl = document.getElementById(`doc-status-${i}`);
        if (statusEl) {
            statusEl.className = `doc-status ${randomDoc.status}`;
            statusEl.textContent = statusLabels[randomDoc.status];
        }
    }, 8000);
}

/* ============================================================
   CHARTS
   ============================================================ */
function initCharts() {
    initWeeklyChart();
    initDeptChart();
}

function initWeeklyChart() {
    const canvas = document.getElementById('weeklyChart');
    if (!canvas) return;

    const labels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const waitTimes = [34, 28, 26, 20, 25, 30, 18];
    const queueVol = [145, 118, 112, 88, 105, 130, 72];

    new Chart(canvas, {
        type: 'bar',
        data: {
            labels,
            datasets: [
                {
                    label: 'Avg Wait (min)',
                    data: waitTimes,
                    backgroundColor: 'rgba(0, 212, 170, 0.2)',
                    borderColor: 'rgba(0, 212, 170, 0.8)',
                    borderWidth: 2,
                    borderRadius: 6,
                    yAxisID: 'y1',
                },
                {
                    label: 'Queue Volume',
                    data: queueVol,
                    type: 'line',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    borderColor: 'rgba(102, 126, 234, 0.8)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: 'rgba(102, 126, 234, 1)',
                    pointRadius: 4,
                    yAxisID: 'y2',
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { mode: 'index', intersect: false },
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: 'rgba(10, 22, 40, 0.9)',
                    borderColor: 'rgba(0, 212, 170, 0.3)',
                    borderWidth: 1,
                    titleColor: '#f0f6ff',
                    bodyColor: 'rgba(240, 246, 255, 0.7)',
                    padding: 12,
                    cornerRadius: 8,
                },
            },
            scales: {
                x: {
                    grid: { color: 'rgba(255,255,255,0.04)' },
                    ticks: { color: 'rgba(240,246,255,0.5)', font: { size: 11 } },
                },
                y1: {
                    type: 'linear', position: 'left',
                    grid: { color: 'rgba(255,255,255,0.04)' },
                    ticks: { color: 'rgba(240,246,255,0.5)', font: { size: 11 } },
                },
                y2: {
                    type: 'linear', position: 'right',
                    grid: { display: false },
                    ticks: { color: 'rgba(240,246,255,0.5)', font: { size: 11 } },
                },
            },
        },
    });
}

function initDeptChart() {
    const canvas = document.getElementById('deptChart');
    if (!canvas) return;

    new Chart(canvas, {
        type: 'radar',
        data: {
            labels: ['General Med', 'Cardiology', 'Orthopedics', 'Pediatrics', 'ENT', 'Dermatology'],
            datasets: [{
                label: 'Efficiency Score',
                data: [92, 78, 85, 94, 80, 88],
                backgroundColor: 'rgba(0, 212, 170, 0.1)',
                borderColor: 'rgba(0, 212, 170, 0.6)',
                borderWidth: 2,
                pointBackgroundColor: 'rgba(0, 212, 170, 1)',
                pointRadius: 4,
            }, {
                label: 'Last Month',
                data: [78, 65, 72, 80, 68, 74],
                backgroundColor: 'rgba(102, 126, 234, 0.08)',
                borderColor: 'rgba(102, 126, 234, 0.4)',
                borderWidth: 1.5,
                pointBackgroundColor: 'rgba(102, 126, 234, 0.8)',
                pointRadius: 3,
                borderDash: [4, 4],
            }],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: { color: 'rgba(240,246,255,0.6)', font: { size: 11 }, boxWidth: 12 }
                },
                tooltip: {
                    backgroundColor: 'rgba(10, 22, 40, 0.9)',
                    borderColor: 'rgba(0, 212, 170, 0.3)',
                    borderWidth: 1,
                    titleColor: '#f0f6ff',
                    bodyColor: 'rgba(240, 246, 255, 0.7)',
                    padding: 10,
                    cornerRadius: 8,
                },
            },
            scales: {
                r: {
                    grid: { color: 'rgba(255,255,255,0.06)' },
                    angleLines: { color: 'rgba(255,255,255,0.06)' },
                    ticks: { display: false },
                    pointLabels: { color: 'rgba(240,246,255,0.6)', font: { size: 11 } },
                    min: 0, max: 100,
                },
            },
        },
    });
}

/* ============================================================
   PREDICTION CHART
   ============================================================ */
function initPredictionChart() {
    const canvas = document.getElementById('predictionChart');
    if (!canvas) return;

    const hours = ['8AM', '9AM', '10AM', '11AM', '12PM', '1PM', '2PM', '3PM', '4PM', '5PM'];
    const predicted = [18, 32, 48, 52, 38, 28, 35, 42, 30, 20];
    const actual = [20, 35, null, null, null, null, null, null, null, null]; // only known hours

    new Chart(canvas, {
        type: 'line',
        data: {
            labels: hours,
            datasets: [
                {
                    label: 'Predicted Load',
                    data: predicted,
                    borderColor: 'rgba(0, 212, 170, 0.8)',
                    backgroundColor: 'rgba(0, 212, 170, 0.08)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 3,
                    pointBackgroundColor: 'rgba(0, 212, 170, 1)',
                    borderDash: [6, 3],
                },
                {
                    label: 'Actual Load',
                    data: actual,
                    borderColor: 'rgba(102, 126, 234, 1)',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    borderWidth: 2.5,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 5,
                    pointBackgroundColor: 'rgba(102, 126, 234, 1)',
                    spanGaps: false,
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: { color: 'rgba(240,246,255,0.6)', font: { size: 10 }, boxWidth: 10 }
                },
                tooltip: {
                    backgroundColor: 'rgba(10, 22, 40, 0.9)',
                    borderColor: 'rgba(0, 212, 170, 0.3)',
                    borderWidth: 1,
                    titleColor: '#f0f6ff',
                    bodyColor: 'rgba(240, 246, 255, 0.7)',
                    padding: 8,
                    cornerRadius: 6,
                },
            },
            scales: {
                x: {
                    grid: { color: 'rgba(255,255,255,0.04)' },
                    ticks: { color: 'rgba(240,246,255,0.5)', font: { size: 10 } },
                },
                y: {
                    grid: { color: 'rgba(255,255,255,0.04)' },
                    ticks: { color: 'rgba(240,246,255,0.5)', font: { size: 10 } },
                    beginAtZero: true,
                },
            },
        },
    });
}

/* ============================================================
   QR GRID GENERATOR
   ============================================================ */
function initQRGrid() {
    const grid = document.querySelector('.qr-grid');
    if (!grid) return;

    grid.innerHTML = '';
    // Generate a fake QR pattern
    const pattern = [
        1,1,1,0,1,1,1,
        1,0,1,0,1,0,1,
        1,0,1,1,0,1,1,
        0,1,0,0,0,1,0,
        1,1,0,1,1,0,1,
        1,0,0,0,1,1,1,
        1,1,1,0,0,0,1,
    ];

    pattern.forEach(cell => {
        const div = document.createElement('div');
        div.style.cssText = `
            border-radius: 1px;
            background: ${cell ? '#020817' : 'transparent'};
        `;
        grid.appendChild(div);
    });
}

/* ============================================================
   PARALLAX ON SCROLL
   ============================================================ */
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const heroContent = document.querySelector('.hero-content');
    const heroVisual = document.querySelector('.hero-visual');

    if (heroContent && scrollY < window.innerHeight) {
        heroContent.style.transform = `translateY(${scrollY * 0.15}px)`;
        heroContent.style.opacity = 1 - scrollY / (window.innerHeight * 0.8);
    }
    if (heroVisual && scrollY < window.innerHeight) {
        heroVisual.style.transform = `translateY(${scrollY * 0.08}px)`;
    }
});

/* ============================================================
   HOVER TILT EFFECT ON CARDS
   ============================================================ */
document.addEventListener('mousemove', (e) => {
    const cards = document.querySelectorAll('.feature-card, .step-card, .impact-card, .testimonial-card');
    cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
            const rotX = ((y / rect.height) - 0.5) * 6;
            const rotY = ((x / rect.width) - 0.5) * -6;
            card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-4px)`;
        } else {
            card.style.transform = '';
        }
    });
});

/* ============================================================
   QUEUE TICKER — Live Served Count
   ============================================================ */
let totalServed = 23;
setInterval(() => {
    const el = document.getElementById('total-served');
    if (el && Math.random() > 0.6) {
        totalServed++;
        el.textContent = totalServed;
        el.style.color = '#00d4aa';
        setTimeout(() => { el.style.color = ''; }, 500);
    }
}, 12000);

/* ============================================================
   SMOOTH SECTION TRANSITIONS
   ============================================================ */
const sections = document.querySelectorAll('section');
const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Update active nav link
            const id = entry.target.id;
            document.querySelectorAll('.nav-links a').forEach(a => {
                a.style.color = a.getAttribute('href') === `#${id}`
                    ? '#00d4aa'
                    : '';
            });
        }
    });
}, { threshold: 0.3 });

sections.forEach(s => sectionObserver.observe(s));

/* ============================================================
   HOLOGRAM INTERACTION
   ============================================================ */
const hologram = document.querySelector('.hologram-container');
if (hologram) {
    hologram.addEventListener('mousemove', (e) => {
        const rect = hologram.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
        const y = ((e.clientY - rect.top) / rect.height - 0.5) * 20;
        hologram.style.transform = `perspective(600px) rotateY(${x}deg) rotateX(${-y}deg)`;
    });
    hologram.addEventListener('mouseleave', () => {
        hologram.style.transform = '';
        hologram.style.transition = 'transform 0.5s ease';
        setTimeout(() => { hologram.style.transition = ''; }, 500);
    });
}

console.log(`
╔══════════════════════════════════════╗
║   QueueEase — Smart Queue Optimizer  ║
║   Version 2.0 | ML-Powered Engine    ║
║   © 2025 QueueEase Technologies      ║
╚══════════════════════════════════════╝
`);
