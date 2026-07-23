document.addEventListener("DOMContentLoaded", () => {

    const tabs = document.querySelectorAll(".settings-tabs .tab-btn");
    const panels = document.querySelectorAll(".settings-panel");

    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            tabs.forEach(btn => btn.classList.remove("active"));

            tab.classList.add("active");

            const targetId = tab.getAttribute("data-tab");
            panels.forEach(panel => {
                if (panel.id === targetId) {
                    panel.classList.add("active");
                } else {
                    panel.classList.remove("active");
                }
            });
        });
    });

    const form = document.querySelector("form");

    if (form) {
        form.addEventListener("submit", function(e) {
            e.preventDefault();
            alert("Settings saved successfully!");
        });
    }

});
