/**
 * AuthManager - Manages authentication state and session persistence
 */

class AuthManager {
    static isAuthenticated() {
        // Check if user is logged in (either remembered or session)
        return localStorage.getItem('rememberedLogin') === 'true' || 
               sessionStorage.getItem('currentLogin') === 'true';
    }
    
    static getCurrentUser() {
        // Get current logged in user
        return localStorage.getItem('username') || 
               sessionStorage.getItem('username');
    }
    
    static logout() {
        // Clear all authentication data
        localStorage.removeItem('rememberedLogin');
        localStorage.removeItem('username');
        sessionStorage.removeItem('currentLogin');
        sessionStorage.removeItem('username');
        
        // Redirect to login
        window.location.href = '../index.html';
    }
    
    static requireAuth() {
        // Redirect to login if not authenticated
        if (!this.isAuthenticated()) {
            window.location.href = '../index.html';
            return false;
        }
        return true;
    }
    
    static redirectIfAuthenticated() {
        // Redirect to home if already authenticated (for login page)
        if (this.isAuthenticated()) {
            window.location.href = 'pages/home.html';
            return true;
        }
        return false;
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AuthManager;
}
