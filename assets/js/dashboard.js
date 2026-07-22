// dashboard.js

document.addEventListener('DOMContentLoaded', function () {
    'use strict';

    const logoutBtn = document.getElementById('logoutBtn');

    function logout() {
        localStorage.removeItem('hotelUser');
        sessionStorage.removeItem('hotelUser');
        window.location.replace('../index.html');
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', function (e) {
            e.preventDefault();
            logout();
        });
    }
});
