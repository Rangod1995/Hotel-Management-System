// main.js
/**
 * Hotel Management System - Main JavaScript
 * Handles login form functionality, validation, and interactions
 */

document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // ============================
    // DOM ELEMENTS
    // ============================
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const togglePasswordBtn = document.getElementById('togglePassword');
    const loginBtn = document.getElementById('loginBtn');
    const rememberMe = document.getElementById('rememberMe');
    const toast = document.getElementById('toast');
    const toastMessage = document.querySelector('.toast-message');
    const toastClose = document.querySelector('.toast-close');

    // ============================
    // TOGGLE PASSWORD VISIBILITY - FIXED
    // ============================
    if (togglePasswordBtn) {
        togglePasswordBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const icon = this.querySelector('i');
            
            // Toggle password visibility
            if (passwordInput && passwordInput.type === 'password') {
                passwordInput.type = 'text';
                if (icon) icon.className = 'fas fa-eye-slash';
                this.setAttribute('aria-label', 'Hide password');
            } else if (passwordInput) {
                passwordInput.type = 'password';
                if (icon) icon.className = 'fas fa-eye';
                this.setAttribute('aria-label', 'Show password');
            }
        });
    }

    // ============================
    // REAL-TIME VALIDATION
    // ============================
    // Email validation
    if (emailInput) {
        emailInput.addEventListener('blur', function() {
            validateEmail(this);
        });

        emailInput.addEventListener('input', function() {
            if (this.value.length > 0) {
                validateEmail(this);
            }
        });
    }

    // Password validation
    if (passwordInput) {
        passwordInput.addEventListener('blur', function() {
            validatePassword(this);
        });

        passwordInput.addEventListener('input', function() {
            if (this.value.length > 0) {
                validatePassword(this);
            }
        });
    }

    // ============================
    // VALIDATION FUNCTIONS
    // ============================
    function validateEmail(input) {
        if (!input) return false;

        const email = input.value.trim();
        const errorElement = document.getElementById('emailError');
        const successIcon = input.parentElement?.querySelector('.success-icon');
        const errorIcon = input.parentElement?.querySelector('.error-icon');

        if (email === '') {
            input.classList.remove('success', 'error');
            if (successIcon) successIcon.classList.remove('show');
            if (errorIcon) errorIcon.classList.remove('show');
            if (errorElement) errorElement.classList.remove('show');
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            input.classList.remove('success');
            input.classList.add('error');
            if (successIcon) successIcon.classList.remove('show');
            if (errorIcon) errorIcon.classList.add('show');
            if (errorElement) errorElement.classList.add('show');
            return false;
        } else {
            input.classList.remove('error');
            input.classList.add('success');
            if (successIcon) successIcon.classList.add('show');
            if (errorIcon) errorIcon.classList.remove('show');
            if (errorElement) errorElement.classList.remove('show');
            return true;
        }
    }

    function validatePassword(input) {
        if (!input) return false;

        const password = input.value;
        const errorElement = document.getElementById('passwordError');
        const successIcon = input.parentElement?.querySelector('.success-icon');
        const errorIcon = input.parentElement?.querySelector('.error-icon');

        if (password === '') {
            input.classList.remove('success', 'error');
            if (successIcon) successIcon.classList.remove('show');
            if (errorIcon) errorIcon.classList.remove('show');
            if (errorElement) errorElement.classList.remove('show');
            return false;
        }

        if (password.length < 6) {
            input.classList.remove('success');
            input.classList.add('error');
            if (successIcon) successIcon.classList.remove('show');
            if (errorIcon) errorIcon.classList.add('show');
            if (errorElement) errorElement.classList.add('show');
            return false;
        } else {
            input.classList.remove('error');
            input.classList.add('success');
            if (successIcon) successIcon.classList.add('show');
            if (errorIcon) errorIcon.classList.remove('show');
            if (errorElement) errorElement.classList.remove('show');
            return true;
        }
    }

    function validateForm() {
        const isEmailValid = validateEmail(emailInput);
        const isPasswordValid = validatePassword(passwordInput);
        return isEmailValid && isPasswordValid;
    }

    function isLoginPage() {
        const path = window.location.pathname.replace(/\\/g, '/');
        return path.endsWith('/index.html') || path === '/' || path === '';
    }

    function isDashboardPage() {
        const path = window.location.pathname.replace(/\\/g, '/');
        return path.endsWith('/dashboard.html') || path.endsWith('/pages/dashboard.html');
    }

    function redirectToDashboard() {
        const target = window.location.pathname.includes('/pages/') ? './dashboard.html' : './pages/dashboard.html';
        window.location.replace(target);
    }

    function redirectToLogin() {
        const target = window.location.pathname.includes('/pages/') ? '../index.html' : './index.html';
        window.location.replace(target);
    }

    // ============================
    // FORM SUBMISSION - FIXED
    // ============================
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();

            if (loginBtn) {
                loginBtn.classList.add('loading');
                loginBtn.disabled = true;
                loginBtn.querySelector('.btn-text').textContent = 'Signing In...';
            }

            setTimeout(function() {
                const email = emailInput ? emailInput.value.trim() : '';
                const password = passwordInput ? passwordInput.value : '';
                const remember = rememberMe ? rememberMe.checked : true;

                if (email === 'admin@hotel.com' && password === 'admin123') {
                    const userData = {
                        email: email,
                        name: 'Admin User',
                        loggedIn: true,
                        loginTime: new Date().toISOString()
                    };

                    if (remember) {
                        localStorage.setItem('hotelUser', JSON.stringify(userData));
                    } else {
                        sessionStorage.setItem('hotelUser', JSON.stringify(userData));
                    }

                    showToast('Login successful! Redirecting to dashboard...', 'success');

                    setTimeout(function() {
                        redirectToDashboard();
                    }, 1200);
                } else {
                    showToast('Invalid email or password. Please try again.', 'error');

                    if (loginBtn) {
                        loginBtn.classList.remove('loading');
                        loginBtn.disabled = false;
                        loginBtn.querySelector('.btn-text').textContent = 'Sign In';
                    }

                    if (loginForm) {
                        loginForm.classList.add('shake');
                        setTimeout(() => {
                            loginForm.classList.remove('shake');
                        }, 500);
                    }

                    if (passwordInput) {
                        passwordInput.value = '';
                        passwordInput.focus();
                    }
                }
            }, 800);
        });
    }

    // ============================
    // TOAST NOTIFICATION
    // ============================
    function showToast(message, type = 'success') {
        if (!toast) return;

        const toastIcon = toast.querySelector('.toast-icon');
        const toastMessage = toast.querySelector('.toast-message');
        
        if (toastMessage) {
            toastMessage.textContent = message;
        }
        
        if (toastIcon) {
            if (type === 'error') {
                toast.style.borderLeftColor = '#EF4444';
                toastIcon.className = 'fas fa-exclamation-circle toast-icon';
                toastIcon.style.color = '#EF4444';
            } else {
                toast.style.borderLeftColor = '#10B981';
                toastIcon.className = 'fas fa-check-circle toast-icon';
                toastIcon.style.color = '#10B981';
            }
        }

        toast.classList.add('show');

        // Auto-hide after 5 seconds
        clearTimeout(window.toastTimeout);
        window.toastTimeout = setTimeout(function() {
            hideToast();
        }, 5000);
    }

    function hideToast() {
        if (toast) {
            toast.classList.remove('show');
        }
    }

    // Toast close button
    if (toastClose) {
        toastClose.addEventListener('click', hideToast);
    }

    // ============================
    // KEYBOARD SHORTCUTS
    // ============================
    document.addEventListener('keydown', function(e) {
        // Press Escape to close toast
        if (e.key === 'Escape' && toast && toast.classList.contains('show')) {
            hideToast();
        }

        // Press Ctrl+Enter to submit form
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && loginForm) {
            loginForm.dispatchEvent(new Event('submit'));
        }
    });

    // ============================
    // CHECK FOR EXISTING SESSION
    // ============================
    function checkSession() {
        const user = localStorage.getItem('hotelUser') || sessionStorage.getItem('hotelUser');

        if (!user) {
            if (isDashboardPage()) {
                redirectToLogin();
            }
            return;
        }

        try {
            const userData = JSON.parse(user);
            if (userData.loggedIn) {
                if (isLoginPage()) {
                    redirectToDashboard();
                }
            } else if (isDashboardPage()) {
                redirectToLogin();
            }
        } catch (e) {
            // Invalid session data, clear it
            localStorage.removeItem('hotelUser');
            sessionStorage.removeItem('hotelUser');
            if (isDashboardPage()) {
                redirectToLogin();
            }
        }
    }

    // Check session on page load
    checkSession();

    // ============================
    // AUTO-FILL DEMO CREDENTIALS
    // ============================
    // Credentials are pre-filled in the HTML for demo purposes

    console.log('🏨 Hotel Management System v1.0');
    console.log('📧 Email: admin@hotel.com');
    console.log('🔑 Password: admin123');
    console.log('💡 Tip: Press Ctrl+Enter to submit');
});