(function () {

    const currentPage = window.location.pathname.split("/").pop();

    const links = [
        {
            title: "Dashboard",
            icon: "fa-th-large",
            page: "dashboard.html"
        },
        {
            title: "Rooms",
            icon: "fa-bed",
            page: "rooms.html"
        },
        {
            title: "Bookings",
            icon: "fa-calendar-check",
            page: "bookings.html"
        },
        {
            title: "Guests",
            icon: "fa-users",
            page: "guests.html"
        },
        {
            title: "Calendar",
            icon: "fa-calendar-alt",
            page: "calendar.html"
        },
        {
            title: "Reports",
            icon: "fa-chart-bar",
            page: "reports.html"
        },
        {
            title: "Settings",
            icon: "fa-cog",
            page: "settings.html"
        }
    ];

    const sidebarContainer = document.getElementById("sidebar-container");

    if (!sidebarContainer) return;

    let navLinks = "";

    links.forEach(link => {

        navLinks += `
            <a href="${link.page}"
               class="${currentPage === link.page ? "active" : ""}">
                <i class="fas ${link.icon}"></i>
                <span>${link.title}</span>
            </a>
        `;

    });

    sidebarContainer.innerHTML = `
        <aside class="sidebar" id="sidebar">

            <div class="sidebar-brand">

                <i class="fas fa-hotel"></i>

                <span>HotelManager</span>

            </div>

            <nav class="sidebar-nav">

                ${navLinks}

            </nav>

            <div class="sidebar-footer">

                <a href="#" id="logoutBtn">

                    <i class="fas fa-sign-out-alt"></i>

                    <span>Logout</span>

                </a>

            </div>

        </aside>
    `;
        /* ==========================
       SIDEBAR FUNCTIONALITY
    ========================== */

    const sidebar = document.getElementById("sidebar");
    const menuToggle = document.getElementById("menuToggle");

    function closeSidebar() {

        if (window.innerWidth <= 992) {

            sidebar.classList.remove("show");

            document.body.classList.remove("sidebar-open");

        }

    }

    function openSidebar() {

        if (window.innerWidth <= 992) {

            sidebar.classList.add("show");

            document.body.classList.add("sidebar-open");

        }

    }

    if (menuToggle) {

        menuToggle.addEventListener("click", function () {

            if (sidebar.classList.contains("show")) {

                closeSidebar();

            } else {

                openSidebar();

            }

        });

    }

    document.addEventListener("click", function (event) {

        if (window.innerWidth > 992) return;

        if (!sidebar.contains(event.target) &&
            !event.target.closest("#menuToggle")) {

            closeSidebar();

        }

    });

    window.addEventListener("resize", function () {

        if (window.innerWidth > 992) {

            sidebar.classList.remove("show");
            document.body.classList.remove("sidebar-open");

        }

    });

    document
        .querySelectorAll(".sidebar-nav a")
        .forEach(link => {

            link.addEventListener("click", closeSidebar);

        });

    /* ==========================
       LOGOUT
    ========================== */

    const logoutBtn = document.getElementById("logoutBtn");

    if (logoutBtn) {

        logoutBtn.addEventListener("click", function (event) {

            event.preventDefault();

            const confirmLogout = confirm(
                "Are you sure you want to logout?"
            );

            if (!confirmLogout) return;

            HotelUtils.showToast("Logged out successfully.");

            setTimeout(() => {

                window.location.href = "../index.html";

            }, 800);

        });

    }

    /* ==========================
       KEYBOARD SHORTCUT
    ========================== */

    document.addEventListener("keydown", function (event) {

        if (event.key === "Escape") {

            closeSidebar();

        }

    });

})();