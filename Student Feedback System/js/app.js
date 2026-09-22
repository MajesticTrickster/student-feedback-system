// ========================================
// STUDENT FEEDBACK SYSTEM - DASHBOARD JS
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    initSidebar();
    initThemeToggle();
    initFilterButtons();
    initCounterAnimation();
    initCharts();
    initProgressBars();
});

// ========================================
// SIDEBAR
// ========================================
function initSidebar() {
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const menuBtn = document.getElementById('menuBtn');

    // Toggle sidebar collapse (desktop)
    sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
    });

    // Toggle sidebar open (mobile)
    menuBtn.addEventListener('click', () => {
        sidebar.classList.toggle('open');
        toggleOverlay();
    });

    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    document.body.appendChild(overlay);

    overlay.addEventListener('click', () => {
        sidebar.classList.remove('open');
        overlay.classList.remove('active');
    });

    function toggleOverlay() {
        overlay.classList.toggle('active', sidebar.classList.contains('open'));
    }

    // Nav item click
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function () {
            document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

// ========================================
// THEME TOGGLE
// ========================================
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const icon = themeToggle.querySelector('i');

    // Check saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        icon.classList.replace('fa-moon', 'fa-sun');
    }

    themeToggle.addEventListener('click', () => {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
        icon.classList.toggle('fa-moon', isDark);
        icon.classList.toggle('fa-sun', !isDark);
        localStorage.setItem('theme', isDark ? 'light' : 'dark');

        // Update charts for theme
        updateChartsTheme();
    });
}

// ========================================
// FILTER BUTTONS
// ========================================
function initFilterButtons() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

// ========================================
// COUNTER ANIMATION
// ========================================
function initCounterAnimation() {
    const counters = document.querySelectorAll('.stat-number');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element) {
    const target = parseFloat(element.dataset.target);
    const isDecimal = target % 1 !== 0;
    const isPercentage = target < 100 && target > 1 && !isDecimal;
    const duration = 2000;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = target * easeOut;

        if (isDecimal) {
            element.textContent = current.toFixed(1);
        } else if (isPercentage) {
            element.textContent = Math.floor(current) + '%';
        } else {
            element.textContent = Math.floor(current).toLocaleString();
        }

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

// ========================================
// PROGRESS BAR ANIMATION
// ========================================
function initProgressBars() {
    const bars = document.querySelectorAll('.progress-bar');
    bars.forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0%';
        setTimeout(() => {
            bar.style.width = width;
        }, 500);
    });
}

// ========================================
// CHARTS
// ========================================
let charts = {};

function getChartColors() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    return {
        text: isDark ? '#94a3b8' : '#64748b',
        grid: isDark ? 'rgba(148, 163, 184, 0.1)' : 'rgba(0, 0, 0, 0.06)',
        tooltipBg: isDark ? '#1e293b' : '#ffffff',
        tooltipTitle: isDark ? '#f1f5f9' : '#1e293b',
        tooltipBody: isDark ? '#94a3b8' : '#64748b',
    };
}

function initCharts() {
    createFeedbackTrendsChart();
    createRatingDistChart();
    createDepartmentChart();
    createCategoriesChart();
    createSentimentChart();
}

function updateChartsTheme() {
    Object.values(charts).forEach(chart => chart.destroy());
    initCharts();
}

// 1. Feedback Trends (Line/Area)
function createFeedbackTrendsChart() {
    const ctx = document.getElementById('feedbackTrendsChart').getContext('2d');
    const colors = getChartColors();

    const gradient1 = ctx.createLinearGradient(0, 0, 0, 300);
    gradient1.addColorStop(0, 'rgba(99, 102, 241, 0.3)');
    gradient1.addColorStop(1, 'rgba(99, 102, 241, 0)');

    const gradient2 = ctx.createLinearGradient(0, 0, 0, 300);
    gradient2.addColorStop(0, 'rgba(16, 185, 129, 0.3)');
    gradient2.addColorStop(1, 'rgba(16, 185, 129, 0)');

    charts.trends = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [
                {
                    label: 'Total Feedbacks',
                    data: [820, 932, 1101, 1234, 1390, 1230, 1450, 1680, 1890, 2100, 2350, 2590],
                    borderColor: '#6366f1',
                    backgroundColor: gradient1,
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#6366f1',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 0,
                    pointHoverRadius: 7,
                    pointHoverBorderWidth: 3,
                },
                {
                    label: 'Positive Feedbacks',
                    data: [580, 720, 850, 920, 1050, 960, 1120, 1340, 1530, 1680, 1870, 2050],
                    borderColor: '#10b981',
                    backgroundColor: gradient2,
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#10b981',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 0,
                    pointHoverRadius: 7,
                    pointHoverBorderWidth: 3,
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    align: 'end',
                    labels: {
                        color: colors.text,
                        usePointStyle: true,
                        pointStyle: 'circle',
                        padding: 20,
                        font: { family: 'Poppins', size: 12, weight: '500' }
                    }
                },
                tooltip: {
                    backgroundColor: colors.tooltipBg,
                    titleColor: colors.tooltipTitle,
                    bodyColor: colors.tooltipBody,
                    borderColor: 'rgba(0,0,0,0.1)',
                    borderWidth: 1,
                    padding: 14,
                    cornerRadius: 12,
                    titleFont: { family: 'Poppins', size: 13, weight: '600' },
                    bodyFont: { family: 'Poppins', size: 12 },
                    usePointStyle: true,
                    boxPadding: 6,
                }
            },
            scales: {
                x: {
                    grid: { color: colors.grid, drawBorder: false },
                    ticks: { color: colors.text, font: { family: 'Poppins', size: 12 } },
                    border: { display: false }
                },
                y: {
                    grid: { color: colors.grid, drawBorder: false },
                    ticks: { color: colors.text, font: { family: 'Poppins', size: 12 } },
                    border: { display: false },
                    beginAtZero: true,
                }
            }
        }
    });
}

// 2. Rating Distribution (Doughnut)
function createRatingDistChart() {
    const ctx = document.getElementById('ratingDistChart').getContext('2d');
    const colors = getChartColors();

    charts.rating = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Excellent (5★)', 'Good (4★)', 'Average (3★)', 'Poor (1-2★)'],
            datasets: [{
                data: [42, 28, 18, 12],
                backgroundColor: ['#10b981', '#6366f1', '#f59e0b', '#ef4444'],
                borderWidth: 0,
                hoverOffset: 10,
                borderRadius: 5,
                spacing: 3,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '72%',
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: colors.tooltipBg,
                    titleColor: colors.tooltipTitle,
                    bodyColor: colors.tooltipBody,
                    borderColor: 'rgba(0,0,0,0.1)',
                    borderWidth: 1,
                    padding: 12,
                    cornerRadius: 10,
                    titleFont: { family: 'Poppins', size: 13, weight: '600' },
                    bodyFont: { family: 'Poppins', size: 12 },
                    callbacks: {
                        label: (ctx) => ` ${ctx.label}: ${ctx.raw}%`
                    }
                }
            }
        },
        plugins: [{
            id: 'centerText',
            beforeDraw: function (chart) {
                const { width, height, ctx } = chart;
                ctx.restore();
                const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
                ctx.fillStyle = isDark ? '#f1f5f9' : '#1e293b';
                ctx.font = "800 28px 'Poppins'";
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('4.6', width / 2, height / 2 - 8);

                ctx.fillStyle = isDark ? '#94a3b8' : '#64748b';
                ctx.font = "400 11px 'Poppins'";
                ctx.fillText('Avg Rating', width / 2, height / 2 + 16);
                ctx.save();
            }
        }]
    });
}

// 3. Department Performance (Horizontal Bar)
function createDepartmentChart() {
    const ctx = document.getElementById('departmentChart').getContext('2d');
    const colors = getChartColors();

    charts.department = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Computer Science', 'Mathematics', 'Physics', 'English', 'Chemistry', 'Biology', 'Economics'],
            datasets: [{
                label: 'Average Rating',
                data: [4.8, 4.6, 4.5, 4.3, 4.2, 4.4, 4.1],
                backgroundColor: [
                    'rgba(99, 102, 241, 0.8)',
                    'rgba(236, 72, 153, 0.8)',
                    'rgba(245, 158, 11, 0.8)',
                    'rgba(16, 185, 129, 0.8)',
                    'rgba(139, 92, 246, 0.8)',
                    'rgba(6, 182, 212, 0.8)',
                    'rgba(239, 68, 68, 0.8)',
                ],
                borderRadius: 8,
                barThickness: 30,
                borderSkipped: false,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y',
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: colors.tooltipBg,
                    titleColor: colors.tooltipTitle,
                    bodyColor: colors.tooltipBody,
                    borderColor: 'rgba(0,0,0,0.1)',
                    borderWidth: 1,
                    padding: 12,
                    cornerRadius: 10,
                    titleFont: { family: 'Poppins', size: 13, weight: '600' },
                    bodyFont: { family: 'Poppins', size: 12 },
                    callbacks: {
                        label: (ctx) => ` Rating: ${ctx.raw} / 5.0`
                    }
                }
            },
            scales: {
                x: {
                    grid: { color: colors.grid, drawBorder: false },
                    ticks: { color: colors.text, font: { family: 'Poppins', size: 11 } },
                    border: { display: false },
                    min: 0,
                    max: 5,
                },
                y: {
                    grid: { display: false },
                    ticks: { color: colors.text, font: { family: 'Poppins', size: 11, weight: '500' } },
                    border: { display: false },
                }
            }
        }
    });
}

// 4. Feedback Categories (Radar)
function createCategoriesChart() {
    const ctx = document.getElementById('categoriesChart').getContext('2d');
    const colors = getChartColors();

    charts.categories = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['Teaching Quality', 'Course Content', 'Communication', 'Punctuality', 'Assessment', 'Support'],
            datasets: [
                {
                    label: 'This Semester',
                    data: [4.5, 4.3, 4.7, 4.2, 3.9, 4.6],
                    borderColor: '#6366f1',
                    backgroundColor: 'rgba(99, 102, 241, 0.15)',
                    borderWidth: 2,
                    pointBackgroundColor: '#6366f1',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 5,
                },
                {
                    label: 'Last Semester',
                    data: [4.0, 4.1, 4.3, 4.0, 3.7, 4.2],
                    borderColor: '#ec4899',
                    backgroundColor: 'rgba(236, 72, 153, 0.1)',
                    borderWidth: 2,
                    pointBackgroundColor: '#ec4899',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 5,
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: colors.text,
                        usePointStyle: true,
                        pointStyle: 'circle',
                        padding: 15,
                        font: { family: 'Poppins', size: 11, weight: '500' }
                    }
                },
                tooltip: {
                    backgroundColor: colors.tooltipBg,
                    titleColor: colors.tooltipTitle,
                    bodyColor: colors.tooltipBody,
                    borderColor: 'rgba(0,0,0,0.1)',
                    borderWidth: 1,
                    padding: 12,
                    cornerRadius: 10,
                    titleFont: { family: 'Poppins', size: 13, weight: '600' },
                    bodyFont: { family: 'Poppins', size: 12 },
                }
            },
            scales: {
                r: {
                    beginAtZero: true,
                    max: 5,
                    ticks: {
                        stepSize: 1,
                        color: colors.text,
                        font: { size: 10 },
                        backdropColor: 'transparent',
                    },
                    grid: { color: colors.grid },
                    angleLines: { color: colors.grid },
                    pointLabels: {
                        color: colors.text,
                        font: { family: 'Poppins', size: 11, weight: '500' }
                    }
                }
            }
        }
    });
}

// 5. Sentiment Analysis (Polar Area)
function createSentimentChart() {
    const ctx = document.getElementById('sentimentChart').getContext('2d');
    const colors = getChartColors();

    charts.sentiment = new Chart(ctx, {
        type: 'polarArea',
        data: {
            labels: ['Positive', 'Neutral', 'Negative'],
            datasets: [{
                data: [68, 22, 10],
                backgroundColor: [
                    'rgba(16, 185, 129, 0.7)',
                    'rgba(245, 158, 11, 0.7)',
                    'rgba(239, 68, 68, 0.7)',
                ],
                borderWidth: 0,
                borderRadius: 5,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: colors.tooltipBg,
                    titleColor: colors.tooltipTitle,
                    bodyColor: colors.tooltipBody,
                    borderColor: 'rgba(0,0,0,0.1)',
                    borderWidth: 1,
                    padding: 12,
                    cornerRadius: 10,
                    titleFont: { family: 'Poppins', size: 13, weight: '600' },
                    bodyFont: { family: 'Poppins', size: 12 },
                    callbacks: {
                        label: (ctx) => ` ${ctx.label}: ${ctx.raw}%`
                    }
                }
            },
            scales: {
                r: {
                    ticks: { display: false },
                    grid: { color: colors.grid },
                }
            }
        }
    });
}