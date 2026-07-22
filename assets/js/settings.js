document.addEventListener("DOMContentLoaded", () => {

    const form = document.querySelector("form");

    if (!form) return;

    form.addEventListener("submit", function(e) {
        e.preventDefault();

        alert("Settings saved successfully!");

    });

});