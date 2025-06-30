/**
 * Anime Book Library - Theme Switcher
 * 
 * This script handles the theme switching functionality:
 * - Toggling between light and dark themes
 * - Saving theme preference to localStorage
 * - Loading saved theme preference on page load
 */

// DOM Elements
const themeToggle = document.getElementById('checkbox');

/**
 * Initialize theme functionality
 */
function initTheme() {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    
    // Apply saved theme or default to light theme
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeToggle.checked = true;
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        themeToggle.checked = false;
    }
    
    // Add event listener for theme toggle
    themeToggle.addEventListener('change', switchTheme);
}

/**
 * Switch between light and dark themes
 * @param {Event} e - The change event
 */
function switchTheme(e) {
    if (e.target.checked) {
        // Switch to dark theme
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
    } else {
        // Switch to light theme
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
    }
}

// Initialize theme when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initTheme);