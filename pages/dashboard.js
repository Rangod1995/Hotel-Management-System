document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    
    console.log('Dashboard loaded');
    
    // Get user data from localStorage
    const userData = localStorage.getItem('hotelUser');
    console.log('User data:', userData);
    
    // Check if user is logged in
    if (!userData) {
        console.log('No user data - redirecting to login');
        window.location.href = '../index.html';
        return;
    }
    
    // Parse and display user data
    try {
        const user = JSON.parse(userData);
        console.log('Parsed user:', user);
        
        // Display username in top bar
        const userDisplay = document.getElementById('userDisplay');
        if (userDisplay) {
            userDisplay.textContent = user.username || 'Admin';
        }
        
        // Display avatar initial
        const userAvatar = document.getElementById('userAvatar');
        if (userAvatar) {
            const initial = user.username ? user.username.charAt(0).toUpperCase() : 'A';
            userAvatar.textContent = initial;
        }
    } catch (e) {
        console.error('Error parsing user data:', e);
        // Fallback display
        const userDisplay = document.getElementById('userDisplay');
        if (userDisplay) {
            userDisplay.textContent = userData || 'Admin';
        }
    }
    
    // LOGOUT FUNCTIONALITY
    const logoutBtn = document.getElementById('logoutBtn');
    console.log('Logout button:', logoutBtn);
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Logout clicked');
            
            // Clear user data
            localStorage.removeItem('hotelUser');
            sessionStorage.removeItem('hotelUser');
            
            console.log('User data cleared');
            
            // Redirect to login
            window.location.href = '../index.html';
        });
    } else {
        console.error('Logout button not found!');
    }
});