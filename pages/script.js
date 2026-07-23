document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    
    console.log('Login page loaded');
    
    const loginForm = document.getElementById('loginForm');
    const username = document.getElementById('username');
    const password = document.getElementById('password');
    const errorMessage = document.getElementById('errorMessage');
    const togglePassword = document.getElementById('togglePassword');

    // Show/Hide Password
    if (togglePassword && password) {
        togglePassword.addEventListener('click', function() {
            const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
            password.setAttribute('type', type);
            this.textContent = type === 'password' ? 'Show' : 'Hide';
            this.classList.toggle('showing');
        });
    }

    // Check if already logged in
    if (localStorage.getItem('hotelUser')) {
        window.location.href = 'dashboard.html';
        return;
    }

    // Login Form Submit
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            errorMessage.textContent = '';
            errorMessage.style.color = '#ff4757';
            
            const usernameValue = username.value.trim();
            const passwordValue = password.value.trim();
            
            if (!usernameValue || !passwordValue) {
                errorMessage.textContent = '⚠️ Please fill in all fields';
                return;
            }
            
            if (passwordValue.length < 4) {
                errorMessage.textContent = '⚠️ Password must be at least 4 characters';
                return;
            }
            
            // Store user data
            const userData = {
                username: usernameValue,
                loginTime: new Date().toLocaleString()
            };
            
            localStorage.setItem('hotelUser', JSON.stringify(userData));
            
            errorMessage.style.color = '#2ecc71';
            errorMessage.textContent = '✅ Login successful! Redirecting...';
            
            setTimeout(function() {
                window.location.href = 'dashboard.html';
            }, 500);
        });
    }

    // Terms and Privacy Modals (same as before)
    const termsModal = document.getElementById('termsModal');
    const privacyModal = document.getElementById('privacyModal');
    const termsLink = document.getElementById('termsLink');
    const privacyLink = document.getElementById('privacyLink');
    const closeTerms = document.getElementById('closeTerms');
    const closePrivacy = document.getElementById('closePrivacy');

    if (termsLink) {
        termsLink.addEventListener('click', function(e) {
            e.preventDefault();
            termsModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    }

    if (privacyLink) {
        privacyLink.addEventListener('click', function(e) {
            e.preventDefault();
            privacyModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    }

    if (closeTerms) {
        closeTerms.addEventListener('click', function() {
            termsModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }

    if (closePrivacy) {
        closePrivacy.addEventListener('click', function() {
            privacyModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }

    window.addEventListener('click', function(e) {
        if (e.target === termsModal) {
            termsModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
        if (e.target === privacyModal) {
            privacyModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (termsModal && termsModal.style.display === 'block') {
                termsModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
            if (privacyModal && privacyModal.style.display === 'block') {
                privacyModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        }
    });
});