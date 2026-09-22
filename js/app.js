// ================================================================
// STUDENT FEEDBACK SYSTEM
// COMMON DASHBOARD JAVASCRIPT
// ================================================================

document.addEventListener("DOMContentLoaded", () => {

    initSidebar();
    initThemeToggle();
    initFilterButtons();
    initCounterAnimation();
    initProgressBars();
    initCharts();
    initSearch();
    initLogout();

});


// ================================================================
// SIDEBAR
// ================================================================

function initSidebar() {

    const sidebar =
        document.getElementById("sidebar");

    const sidebarToggle =
        document.getElementById("sidebarToggle");

    const menuBtn =
        document.getElementById("menuBtn");


    if (!sidebar) return;


    // ------------------------------------------------------------
    // Desktop sidebar collapse
    // ------------------------------------------------------------

    if (sidebarToggle) {

        sidebarToggle.addEventListener(
            "click",
            () => {

                sidebar.classList.toggle(
                    "collapsed"
                );

                localStorage.setItem(
                    "sidebarCollapsed",
                    sidebar.classList.contains("collapsed")
                );

            }
        );

    }


    // ------------------------------------------------------------
    // Restore sidebar state
    // ------------------------------------------------------------

    const sidebarCollapsed =
        localStorage.getItem(
            "sidebarCollapsed"
        );


    if (
        sidebarCollapsed === "true"
    ) {

        sidebar.classList.add(
            "collapsed"
        );

    }


    // ------------------------------------------------------------
    // Mobile sidebar
    // ------------------------------------------------------------

    let overlay =
        document.querySelector(
            ".sidebar-overlay"
        );


    if (!overlay) {

        overlay =
            document.createElement(
                "div"
            );

        overlay.className =
            "sidebar-overlay";

        document.body.appendChild(
            overlay
        );

    }


    if (menuBtn) {

        menuBtn.addEventListener(
            "click",
            () => {

                sidebar.classList.toggle(
                    "open"
                );

                overlay.classList.toggle(
                    "active",
                    sidebar.classList.contains("open")
                );

            }
        );

    }


    overlay.addEventListener(
        "click",
        () => {

            sidebar.classList.remove(
                "open"
            );

            overlay.classList.remove(
                "active"
            );

        }
    );


    // ------------------------------------------------------------
    // Sidebar navigation
    // ------------------------------------------------------------

    const navItems =
        document.querySelectorAll(
            ".nav-item"
        );


    navItems.forEach(
        item => {

            const link =
                item.querySelector(
                    "a"
                );


            if (!link) return;


            link.addEventListener(
                "click",
                event => {

                    const href =
                        link.getAttribute(
                            "href"
                        );


                    // Keep special buttons such as logout
                    // under their own event handlers.
                    if (
                        !href ||
                        href === "#" ||
                        link.id === "logoutBtn"
                    ) {

                        return;

                    }


                    navItems.forEach(
                        nav =>
                            nav.classList.remove(
                                "active"
                            )
                    );


                    item.classList.add(
                        "active"
                    );


                    sidebar.classList.remove(
                        "open"
                    );


                    overlay.classList.remove(
                        "active"
                    );

                }
            );

        }

    );

}


// ================================================================
// THEME TOGGLE
// ================================================================

function initThemeToggle() {

    const themeToggle =
        document.getElementById(
            "themeToggle"
        );


    if (!themeToggle) return;


    const icon =
        themeToggle.querySelector(
            "i"
        );


    if (!icon) return;


    // ------------------------------------------------------------
    // Apply saved theme
    // ------------------------------------------------------------

    const savedTheme =
        localStorage.getItem(
            "theme"
        ) || "light";


    applyTheme(
        savedTheme,
        icon
    );


    // ------------------------------------------------------------
    // Toggle theme
    // ------------------------------------------------------------

    themeToggle.addEventListener(
        "click",
        () => {

            const currentTheme =
                document.documentElement.getAttribute(
                    "data-theme"
                ) || "light";


            const newTheme =
                currentTheme === "dark"
                    ? "light"
                    : "dark";


            applyTheme(
                newTheme,
                icon
            );


            localStorage.setItem(
                "theme",
                newTheme
            );


            updateChartsTheme();

        }
    );

}


function applyTheme(
    theme,
    icon
) {

    if (theme === "dark") {

        document.documentElement.setAttribute(
            "data-theme",
            "dark"
        );


        icon.classList.remove(
            "fa-moon"
        );

        icon.classList.add(
            "fa-sun"
        );

    } else {

        document.documentElement.setAttribute(
            "data-theme",
            "light"
        );


        icon.classList.remove(
            "fa-sun"
        );

        icon.classList.add(
            "fa-moon"
        );

    }

}


// ================================================================
// FILTER BUTTONS
// ================================================================

function initFilterButtons() {

    const buttons =
        document.querySelectorAll(
            ".filter-btn"
        );


    buttons.forEach(
        button => {

            button.addEventListener(
                "click",
                function () {

                    buttons.forEach(
                        item =>
                            item.classList.remove(
                                "active"
                            )
                    );


                    this.classList.add(
                        "active"
                    );


                    const period =
                        this.dataset.period;


                    if (period) {

                        updateDashboardPeriod(
                            period
                        );

                    }

                }
            );

        }
    );

}


function updateDashboardPeriod(
    period
) {

    const feedbackElement =
        document.querySelector(
            ".stat-card-1 .stat-number"
        );

    const ratingElement =
        document.querySelector(
            ".stat-card-2 .stat-number"
        );

    const responseElement =
        document.querySelector(
            ".stat-card-3 .stat-number"
        );


    const values = {

        week: {
            feedback: 2847,
            rating: 4.7,
            response: 89
        },

        month: {
            feedback: 12847,
            rating: 4.6,
            response: 87
        },

        semester: {
            feedback: 38592,
            rating: 4.5,
            response: 85
        },

        year: {
            feedback: 72418,
            rating: 4.4,
            response: 83
        }

    };


    const selected =
        values[period];


    if (!selected) return;


    if (feedbackElement) {

        animateValue(
            feedbackElement,
            Number(
                selected.feedback
            ),
            "",
            true
        );

    }


    if (ratingElement) {

        animateValue(
            ratingElement,
            Number(
                selected.rating
            ),
            "",
            false,
            1
        );

    }


    if (responseElement) {

        animateValue(
            responseElement,
            Number(
                selected.response
            ),
            "%",
            false
        );

    }

}


// ================================================================
// COUNTER ANIMATION
// ================================================================

function initCounterAnimation() {

    const counters =
        document.querySelectorAll(
            ".stat-number"
        );


    if (!counters.length) return;


    if (
        !("IntersectionObserver" in window)
    ) {

        counters.forEach(
            counter => {

                animateCounter(
                    counter
                );

            }
        );

        return;

    }


    const observer =
        new IntersectionObserver(
            entries => {

                entries.forEach(
                    entry => {

                        if (
                            entry.isIntersecting
                        ) {

                            animateCounter(
                                entry.target
                            );

                            observer.unobserve(
                                entry.target
                            );

                        }

                    }
                );

            },
            {
                threshold: 0.3
            }
        );


    counters.forEach(
        counter =>
            observer.observe(
                counter
            )
    );

}


function animateCounter(
    element
) {

    const target =
        parseFloat(
            element.dataset.target || "0"
        );


    if (
        Number.isNaN(
            target
        )
    ) {

        element.textContent =
            "0";

        return;

    }


    const decimal =
        target % 1 !== 0;


    const percentage =
        target < 100 &&
        target > 1 &&
        !decimal;


    animateValue(
        element,
        target,
        percentage
            ? "%"
            : "",
        !decimal &&
        !percentage,
        decimal
            ? 1
            : 0
    );

}


function animateValue(
    element,
    target,
    suffix = "",
    useThousands = false,
    decimals = 0
) {

    const duration =
        1200;


    const start =
        performance.now();


    function update(
        currentTime
    ) {

        const elapsed =
            currentTime -
            start;


        const progress =
            Math.min(
                elapsed /
                duration,
                1
            );


        const ease =
            1 -
            Math.pow(
                1 -
                progress,
                3
            );


        const value =
            target * ease;


        if (decimals > 0) {

            element.textContent =
                value.toFixed(
                    decimals
                ) +
                suffix;

        } else {

            const formatted =
                Math.floor(
                    value
                );


            element.textContent =
                useThousands
                    ? formatted.toLocaleString()
                    : formatted +
                      suffix;

        }


        if (progress < 1) {

            requestAnimationFrame(
                update
            );

        }

    }


    requestAnimationFrame(
        update
    );

}


// ================================================================
// PROGRESS BARS
// ================================================================

function initProgressBars() {

    const bars =
        document.querySelectorAll(
            ".progress-bar"
        );


    bars.forEach(
        bar => {

            const width =
                bar.style.width;


            if (!width) return;


            bar.style.width =
                "0%";


            requestAnimationFrame(
                () => {

                    setTimeout(
                        () => {

                            bar.style.width =
                                width;

                        },
                        250
                    );

                }
            );

        }
    );

}


// ================================================================
// CHARTS
// ================================================================

let charts = {};


function getChartColors() {

    const isDark =
        document.documentElement.getAttribute(
            "data-theme"
        ) === "dark";


    return {

        text:
            isDark
                ? "#94a3b8"
                : "#64748b",

        grid:
            isDark
                ? "rgba(148,163,184,0.1)"
                : "rgba(0,0,0,0.06)",

        tooltipBg:
            isDark
                ? "#1e293b"
                : "#ffffff",

        tooltipTitle:
            isDark
                ? "#f1f5f9"
                : "#1e293b",

        tooltipBody:
            isDark
                ? "#94a3b8"
                : "#64748b"

    };

}


// ================================================================
// INIT CHARTS
// ================================================================

function initCharts() {

    if (
        typeof Chart ===
        "undefined"
    ) {

        return;

    }


    createFeedbackTrendsChart();
    createRatingDistChart();
    createDepartmentChart();
    createCategoriesChart();
    createSentimentChart();

}


// ================================================================
// DESTROY CHARTS SAFELY
// ================================================================

function destroyCharts() {

    Object.keys(
        charts
    ).forEach(
        key => {

            const chart =
                charts[key];


            if (
                chart &&
                typeof chart.destroy ===
                "function"
            ) {

                chart.destroy();

            }

        }
    );


    charts = {};

}


// ================================================================
// UPDATE CHART THEME
// ================================================================

function updateChartsTheme() {

    if (
        typeof Chart ===
        "undefined"
    ) {

        return;

    }


    const dashboardCharts =
        document.querySelectorAll(
            "canvas[id]"
        );


    if (!dashboardCharts.length) {

        return;

    }


    destroyCharts();

    initCharts();

}


// ================================================================
// FEEDBACK TREND CHART
// ================================================================

function createFeedbackTrendsChart() {

    const canvas =
        document.getElementById(
            "feedbackTrendsChart"
        );


    if (
        !canvas ||
        typeof Chart ===
        "undefined"
    ) {

        return;

    }


    const ctx =
        canvas.getContext(
            "2d"
        );


    const colors =
        getChartColors();


    const gradient1 =
        ctx.createLinearGradient(
            0,
            0,
            0,
            300
        );


    gradient1.addColorStop(
        0,
        "rgba(99,102,241,0.30)"
    );


    gradient1.addColorStop(
        1,
        "rgba(99,102,241,0)"
    );


    const gradient2 =
        ctx.createLinearGradient(
            0,
            0,
            0,
            300
        );


    gradient2.addColorStop(
        0,
        "rgba(16,185,129,0.28)"
    );


    gradient2.addColorStop(
        1,
        "rgba(16,185,129,0)"
    );


    charts.trends =
        new Chart(
            ctx,
            {

                type: "line",

                data: {

                    labels: [
                        "Jan",
                        "Feb",
                        "Mar",
                        "Apr",
                        "May",
                        "Jun",
                        "Jul",
                        "Aug",
                        "Sep",
                        "Oct",
                        "Nov",
                        "Dec"
                    ],

                    datasets: [

                        {
                            label:
                                "Total Feedbacks",

                            data: [
                                820,
                                932,
                                1101,
                                1234,
                                1390,
                                1230,
                                1450,
                                1680,
                                1890,
                                2100,
                                2350,
                                2590
                            ],

                            borderColor:
                                "#6366f1",

                            backgroundColor:
                                gradient1,

                            borderWidth:
                                3,

                            fill:
                                true,

                            tension:
                                0.4,

                            pointBackgroundColor:
                                "#6366f1",

                            pointBorderColor:
                                "#ffffff",

                            pointBorderWidth:
                                2,

                            pointRadius:
                                0,

                            pointHoverRadius:
                                7,

                            pointHoverBorderWidth:
                                3

                        },


                        {
                            label:
                                "Positive Feedbacks",

                            data: [
                                580,
                                720,
                                850,
                                920,
                                1050,
                                960,
                                1120,
                                1340,
                                1530,
                                1680,
                                1870,
                                2050
                            ],

                            borderColor:
                                "#10b981",

                            backgroundColor:
                                gradient2,

                            borderWidth:
                                3,

                            fill:
                                true,

                            tension:
                                0.4,

                            pointBackgroundColor:
                                "#10b981",

                            pointBorderColor:
                                "#ffffff",

                            pointBorderWidth:
                                2,

                            pointRadius:
                                0,

                            pointHoverRadius:
                                7,

                            pointHoverBorderWidth:
                                3

                        }

                    ]

                },


                options: {

                    responsive:
                        true,

                    maintainAspectRatio:
                        false,

                    interaction: {

                        mode:
                            "index",

                        intersect:
                            false

                    },


                    plugins: {

                        legend: {

                            display:
                                true,

                            position:
                                "top",

                            align:
                                "end",

                            labels: {

                                color:
                                    colors.text,

                                usePointStyle:
                                    true,

                                pointStyle:
                                    "circle",

                                padding:
                                    20,

                                font: {

                                    family:
                                        "Poppins",

                                    size:
                                        12,

                                    weight:
                                        "500"

                                }

                            }

                        },


                        tooltip: {

                            backgroundColor:
                                colors.tooltipBg,

                            titleColor:
                                colors.tooltipTitle,

                            bodyColor:
                                colors.tooltipBody,

                            borderColor:
                                "rgba(0,0,0,0.1)",

                            borderWidth:
                                1,

                            padding:
                                14,

                            cornerRadius:
                                12,

                            usePointStyle:
                                true

                        }

                    },


                    scales: {

                        x: {

                            grid: {

                                color:
                                    colors.grid,

                                drawBorder:
                                    false

                            },

                            ticks: {

                                color:
                                    colors.text,

                                font: {

                                    family:
                                        "Poppins",

                                    size:
                                        12

                                }

                            },

                            border: {

                                display:
                                    false

                            }

                        },


                        y: {

                            beginAtZero:
                                true,

                            grid: {

                                color:
                                    colors.grid,

                                drawBorder:
                                    false

                            },

                            ticks: {

                                color:
                                    colors.text,

                                font: {

                                    family:
                                        "Poppins",

                                    size:
                                        12

                                }

                            },

                            border: {

                                display:
                                    false

                            }

                        }

                    }

                }

            }
        );

}


// ================================================================
// RATING DISTRIBUTION
// ================================================================

function createRatingDistChart() {

    const canvas =
        document.getElementById(
            "ratingDistChart"
        );


    if (
        !canvas ||
        typeof Chart ===
        "undefined"
    ) {

        return;

    }


    const colors =
        getChartColors();


    charts.rating =
        new Chart(
            canvas.getContext(
                "2d"
            ),
            {

                type:
                    "doughnut",

                data: {

                    labels: [
                        "Excellent (5★)",
                        "Good (4★)",
                        "Average (3★)",
                        "Poor (1-2★)"
                    ],

                    datasets: [

                        {

                            data: [
                                42,
                                28,
                                18,
                                12
                            ],

                            backgroundColor: [
                                "#10b981",
                                "#6366f1",
                                "#f59e0b",
                                "#ef4444"
                            ],

                            borderWidth:
                                0,

                            hoverOffset:
                                10,

                            borderRadius:
                                5,

                            spacing:
                                3

                        }

                    ]

                },


                options: {

                    responsive:
                        true,

                    maintainAspectRatio:
                        false,

                    cutout:
                        "72%",

                    plugins: {

                        legend: {
                            display:
                                false
                        },

                        tooltip: {

                            backgroundColor:
                                colors.tooltipBg,

                            titleColor:
                                colors.tooltipTitle,

                            bodyColor:
                                colors.tooltipBody,

                            callbacks: {

                                label:
                                    context =>
                                        ` ${context.label}: ${context.raw}%`

                            }

                        }

                    }

                },


                plugins: [

                    {

                        id:
                            "centerText",

                        beforeDraw:
                            chart => {

                                const {
                                    width,
                                    height,
                                    ctx
                                } = chart;


                                const isDark =
                                    document.documentElement.getAttribute(
                                        "data-theme"
                                    ) ===
                                    "dark";


                                ctx.save();


                                ctx.fillStyle =
                                    isDark
                                        ? "#f1f5f9"
                                        : "#1e293b";


                                ctx.font =
                                    "800 28px Poppins";


                                ctx.textAlign =
                                    "center";


                                ctx.textBaseline =
                                    "middle";


                                ctx.fillText(
                                    "4.6",
                                    width / 2,
                                    height / 2 - 8
                                );


                                ctx.fillStyle =
                                    isDark
                                        ? "#94a3b8"
                                        : "#64748b";


                                ctx.font =
                                    "400 11px Poppins";


                                ctx.fillText(
                                    "Avg Rating",
                                    width / 2,
                                    height / 2 + 16
                                );


                                ctx.restore();

                            }

                    }

                ]

            }
        );

}


// ================================================================
// DEPARTMENT PERFORMANCE
// ================================================================

function createDepartmentChart() {

    const canvas =
        document.getElementById(
            "departmentChart"
        );


    if (
        !canvas ||
        typeof Chart ===
        "undefined"
    ) {

        return;

    }


    const colors =
        getChartColors();


    charts.department =
        new Chart(
            canvas.getContext(
                "2d"
            ),
            {

                type:
                    "bar",

                data: {

                    labels: [
                        "Computer Science",
                        "Mathematics",
                        "Physics",
                        "English",
                        "Chemistry",
                        "Biology",
                        "Economics"
                    ],

                    datasets: [

                        {

                            label:
                                "Average Rating",

                            data: [
                                4.8,
                                4.6,
                                4.5,
                                4.3,
                                4.2,
                                4.4,
                                4.1
                            ],

                            backgroundColor: [

                                "rgba(99,102,241,0.8)",
                                "rgba(236,72,153,0.8)",
                                "rgba(245,158,11,0.8)",
                                "rgba(16,185,129,0.8)",
                                "rgba(139,92,246,0.8)",
                                "rgba(6,182,212,0.8)",
                                "rgba(239,68,68,0.8)"

                            ],

                            borderRadius:
                                8,

                            barThickness:
                                30,

                            borderSkipped:
                                false

                        }

                    ]

                },


                options: {

                    responsive:
                        true,

                    maintainAspectRatio:
                        false,

                    indexAxis:
                        "y",

                    plugins: {

                        legend: {
                            display:
                                false
                        },

                        tooltip: {

                            backgroundColor:
                                colors.tooltipBg,

                            titleColor:
                                colors.tooltipTitle,

                            bodyColor:
                                colors.tooltipBody,

                            callbacks: {

                                label:
                                    context =>
                                        ` Rating: ${context.raw} / 5.0`

                            }

                        }

                    },


                    scales: {

                        x: {

                            min:
                                0,

                            max:
                                5,

                            grid: {

                                color:
                                    colors.grid

                            },

                            ticks: {

                                color:
                                    colors.text,

                                font: {
                                    family:
                                        "Poppins",

                                    size:
                                        11
                                }

                            }

                        },


                        y: {

                            grid: {
                                display:
                                    false
                            },

                            ticks: {

                                color:
                                    colors.text,

                                font: {

                                    family:
                                        "Poppins",

                                    size:
                                        11,

                                    weight:
                                        "500"

                                }

                            }

                        }

                    }

                }

            }
        );

}


// ================================================================
// FEEDBACK CATEGORIES
// ================================================================

function createCategoriesChart() {

    const canvas =
        document.getElementById(
            "categoriesChart"
        );


    if (
        !canvas ||
        typeof Chart ===
        "undefined"
    ) {

        return;

    }


    const colors =
        getChartColors();


    charts.categories =
        new Chart(
            canvas.getContext(
                "2d"
            ),
            {

                type:
                    "radar",

                data: {

                    labels: [

                        "Teaching Quality",
                        "Course Content",
                        "Communication",
                        "Punctuality",
                        "Assessment",
                        "Support"

                    ],

                    datasets: [

                        {

                            label:
                                "This Semester",

                            data: [
                                4.5,
                                4.3,
                                4.7,
                                4.2,
                                3.9,
                                4.6
                            ],

                            borderColor:
                                "#6366f1",

                            backgroundColor:
                                "rgba(99,102,241,0.15)",

                            borderWidth:
                                2,

                            pointBackgroundColor:
                                "#6366f1",

                            pointBorderColor:
                                "#ffffff",

                            pointBorderWidth:
                                2,

                            pointRadius:
                                5

                        },


                        {

                            label:
                                "Last Semester",

                            data: [
                                4.0,
                                4.1,
                                4.3,
                                4.0,
                                3.7,
                                4.2
                            ],

                            borderColor:
                                "#ec4899",

                            backgroundColor:
                                "rgba(236,72,153,0.10)",

                            borderWidth:
                                2,

                            pointBackgroundColor:
                                "#ec4899",

                            pointBorderColor:
                                "#ffffff",

                            pointBorderWidth:
                                2,

                            pointRadius:
                                5

                        }

                    ]

                },


                options: {

                    responsive:
                        true,

                    maintainAspectRatio:
                        false,

                    plugins: {

                        legend: {

                            position:
                                "bottom",

                            labels: {

                                color:
                                    colors.text,

                                usePointStyle:
                                    true,

                                pointStyle:
                                    "circle",

                                padding:
                                    15,

                                font: {

                                    family:
                                        "Poppins",

                                    size:
                                        11

                                }

                            }

                        }

                    },


                    scales: {

                        r: {

                            beginAtZero:
                                true,

                            max:
                                5,

                            ticks: {

                                stepSize:
                                    1,

                                color:
                                    colors.text,

                                backdropColor:
                                    "transparent"

                            },

                            grid: {

                                color:
                                    colors.grid

                            },

                            angleLines: {

                                color:
                                    colors.grid

                            },

                            pointLabels: {

                                color:
                                    colors.text,

                                font: {

                                    family:
                                        "Poppins",

                                    size:
                                        10,

                                    weight:
                                        "500"

                                }

                            }

                        }

                    }

                }

            }
        );

}


// ================================================================
// SENTIMENT
// ================================================================

function createSentimentChart() {

    const canvas =
        document.getElementById(
            "sentimentChart"
        );


    if (
        !canvas ||
        typeof Chart ===
        "undefined"
    ) {

        return;

    }


    const colors =
        getChartColors();


    charts.sentiment =
        new Chart(
            canvas.getContext(
                "2d"
            ),
            {

                type:
                    "polarArea",

                data: {

                    labels: [
                        "Positive",
                        "Neutral",
                        "Negative"
                    ],

                    datasets: [

                        {

                            data: [
                                68,
                                22,
                                10
                            ],

                            backgroundColor: [

                                "rgba(16,185,129,0.70)",
                                "rgba(245,158,11,0.70)",
                                "rgba(239,68,68,0.70)"

                            ],

                            borderWidth:
                                0,

                            borderRadius:
                                5

                        }

                    ]

                },


                options: {

                    responsive:
                        true,

                    maintainAspectRatio:
                        false,

                    plugins: {

                        legend:
                            {
                                display:
                                    false
                            },

                        tooltip: {

                            backgroundColor:
                                colors.tooltipBg,

                            titleColor:
                                colors.tooltipTitle,

                            bodyColor:
                                colors.tooltipBody,

                            callbacks: {

                                label:
                                    context =>
                                        ` ${context.label}: ${context.raw}%`

                            }

                        }

                    },


                    scales: {

                        r: {

                            ticks: {
                                display:
                                    false
                            },

                            grid: {

                                color:
                                    colors.grid

                            }

                        }

                    }

                }

            }
        );

}


// ================================================================
// SEARCH
// ================================================================

function initSearch() {

    const searchInputs =
        document.querySelectorAll(
            ".search-box input"
        );


    searchInputs.forEach(
        input => {

            input.addEventListener(
                "keydown",
                event => {

                    if (
                        event.key ===
                        "Enter"
                    ) {

                        performGlobalSearch(
                            input.value.trim()
                        );

                    }

                }
            );

        }
    );

}


function performGlobalSearch(
    query
) {

    if (!query) return;


    const normalized =
        query.toLowerCase();


    const currentPath =
        window.location.pathname.toLowerCase();


    if (
        normalized.includes(
            "feedback"
        )
    ) {

        navigateTo(
            "feedbacks.html"
        );

        return;

    }


    if (
        normalized.includes(
            "faculty"
        )
    ) {

        navigateTo(
            "faculty.html"
        );

        return;

    }


    if (
        normalized.includes(
            "course"
        )
    ) {

        navigateTo(
            "courses.html"
        );

        return;

    }


    if (
        normalized.includes(
            "analytic"
        ) ||
        normalized.includes(
            "chart"
        )
    ) {

        navigateTo(
            "analytics.html"
        );

        return;

    }


    if (
        normalized.includes(
            "report"
        )
    ) {

        navigateTo(
            "reports.html"
        );

        return;

    }


    if (
        normalized.includes(
            "notification"
        )
    ) {

        navigateTo(
            "notifications.html"
        );

        return;

    }


    if (
        normalized.includes(
            "profile"
        )
    ) {

        navigateTo(
            "profile.html"
        );

        return;

    }


    if (
        normalized.includes(
            "setting"
        )
    ) {

        navigateTo(
            "settings.html"
        );

        return;

    }


    // Search current page content.
    const bodyText =
        document.body.innerText
            .toLowerCase();


    if (
        bodyText.includes(
            normalized
        )
    ) {

        highlightSearchText(
            query
        );

    }

}


function navigateTo(
    page
) {

    const isPagesDirectory =
        window.location.pathname
            .toLowerCase()
            .includes(
                "/pages/"
            );


    if (
        isPagesDirectory
    ) {

        window.location.href =
            page;

    } else {

        window.location.href =
            `pages/${page}`;

    }

}


// ================================================================
// BASIC TEXT HIGHLIGHT
// ================================================================

function highlightSearchText(
    query
) {

    if (!query) return;


    const walker =
        document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT
        );


    const nodes = [];


    let node;


    while (
        node =
            walker.nextNode()
    ) {

        if (
            node.parentElement &&
            node.parentElement.closest(
                "script,style"
            )
        ) {

            continue;

        }


        if (
            node.nodeValue
                .toLowerCase()
                .includes(
                    query.toLowerCase()
                )
        ) {

            nodes.push(
                node
            );

        }

    }


    if (!nodes.length) return;


    const first =
        nodes[0];


    first.parentElement.scrollIntoView(
        {
            behavior:
                "smooth",

            block:
                "center"
        }
    );

}


// ================================================================
// LOGOUT
// ================================================================

function initLogout() {

    const logoutButtons =
        document.querySelectorAll(
            "#logoutBtn"
        );


    logoutButtons.forEach(
        button => {

            button.addEventListener(
                "click",
                event => {

                    event.preventDefault();


                    const confirmed =
                        confirm(
                            "Are you sure you want to logout?"
                        );


                    if (!confirmed) {
                        return;
                    }


                    localStorage.removeItem(
                        "sidebarCollapsed"
                    );


                    // Return to dashboard.
                    const isPagesDirectory =
                        window.location.pathname
                            .toLowerCase()
                            .includes(
                                "/pages/"
                            );


                    if (
                        isPagesDirectory
                    ) {

                        window.location.href =
                            "../index.html";

                    } else {

                        window.location.href =
                            "index.html";

                    }

                }
            );

        }
    );

}


// ================================================================
// UTILITY: DOWNLOAD FILE
// ================================================================

function downloadTextFile(
    filename,
    content
) {

    const blob =
        new Blob(
            [
                content
            ],
            {
                type:
                    "text/plain;charset=utf-8"
            }
        );


    const url =
        URL.createObjectURL(
            blob
        );


    const link =
        document.createElement(
            "a"
        );


    link.href =
        url;

    link.download =
        filename;


    document.body.appendChild(
        link
    );


    link.click();


    link.remove();


    URL.revokeObjectURL(
        url
    );

}


// ================================================================
// UTILITY: CSV DOWNLOAD
// ================================================================

function downloadCSV(
    filename,
    rows
) {

    const csv =
        rows
            .map(
                row =>
                    row
                        .map(
                            value =>
                                `"${String(value)
                                    .replace(/"/g, '""')}"`
                        )
                        .join(",")
            )
            .join("\n");


    const blob =
        new Blob(
            [csv],
            {
                type:
                    "text/csv;charset=utf-8"
            }
        );


    const url =
        URL.createObjectURL(
            blob
        );


    const link =
        document.createElement(
            "a"
        );


    link.href =
        url;

    link.download =
        filename;


    document.body.appendChild(
        link
    );


    link.click();


    link.remove();


    URL.revokeObjectURL(
        url
    );

}


// ================================================================
// GLOBAL EXPORTS
// ================================================================

window.FeedbackHub = {

    downloadTextFile,

    downloadCSV,

    navigateTo,

    updateDashboardPeriod,

    updateChartsTheme,

    getChartColors

};