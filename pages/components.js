document.addEventListener("DOMContentLoaded", async () => {

    await loadComponent(
        "../../components/sidebar.html",
        "sidebar-container"
    );

    await loadComponent(
        "../../components/header.html",
        "header-container"
    );

    await loadComponent(
        "../../components/footer.html",
        "footer-container"
    );

    highlightCurrentPage();

    setupSidebar();

});

async function loadComponent(path, id) {

    const container = document.getElementById(id);

    if (!container) return;

    const response = await fetch(path);

    const html = await response.text();

    container.innerHTML = html;

}

function highlightCurrentPage() {

    const currentPage =
        location.pathname.split("/").pop();

    document
        .querySelectorAll(".sidebar-nav a")
        .forEach(link => {

            if (link.dataset.page === currentPage) {

                link.classList.add("active");

            }

        });

}

function setupSidebar() {

    const sidebar = document.getElementById("sidebar");
    const menu = document.getElementById("menuToggle");

    if (!sidebar || !menu) return;

    menu.addEventListener("click", () => {

        sidebar.classList.toggle("show");

    });

    document
        .getElementById("logoutBtn")
        ?.addEventListener("click", e => {

            e.preventDefault();

            if (confirm("Logout?")) {

                location.href = "../index.html";

            }

        });

}