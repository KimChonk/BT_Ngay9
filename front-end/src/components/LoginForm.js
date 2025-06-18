/**
 * LoginForm Component
 * Handles login form functionality and validation
 */

class LoginForm {
    constructor(formId) {
        this.form = document.getElementById(formId);
        this.usernameInput = document.getElementById('email'); // Changed to username
        this.passwordInput = document.getElementById('password');
        this.rememberCheckbox = document.getElementById('remember');
        this.submitBtn = document.querySelector('.login-btn');
        this.messageLabel = null; // Hidden message label
        
        this.init();
    }
      init() {
        this.createMessageLabel();
        this.bindEvents();
        this.checkRememberedLogin();
    }
    
    createMessageLabel() {
        // Create hidden message label
        this.messageLabel = document.createElement('div');
        this.messageLabel.className = 'message-label';
        this.messageLabel.style.display = 'none';
        this.messageLabel.style.color = '#e74c3c';
        this.messageLabel.style.fontSize = '14px';
        this.messageLabel.style.marginTop = '10px';
        this.messageLabel.style.textAlign = 'center';
        
        // Insert after form but before buttons
        const formOptions = document.querySelector('.form-options');
        formOptions.parentNode.insertBefore(this.messageLabel, formOptions.nextSibling);
    }
    
    checkRememberedLogin() {
        // Check if user is remembered and redirect to home
        if (localStorage.getItem('rememberedLogin') === 'true') {
            window.location.href = 'pages/home.html';
        }
    }
      bindEvents() {
        // Form submission
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Clear errors on input
        this.usernameInput.addEventListener('input', () => this.clearFieldError(this.usernameInput));
        this.passwordInput.addEventListener('input', () => this.clearFieldError(this.passwordInput));
        
        // Handle navigation links
        this.setupNavigationLinks();
    }
    
    setupNavigationLinks() {
        // Register link
        const registerLinks = document.querySelectorAll('a[href*="register"]');
        registerLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                window.location.href = 'pages/register.html';
            });
        });
        
        // Forgot password link  
        const forgotPasswordLinks = document.querySelectorAll('a[href*="forgot-password"]');
        forgotPasswordLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                window.location.href = 'pages/forgot-password.html';
            });
        });
    }
      handleSubmit(e) {
        e.preventDefault();
        
        const username = this.usernameInput.value.trim();
        const password = this.passwordInput.value;
        const rememberMe = this.rememberCheckbox.checked;
        
        // Clear previous errors and messages
        this.clearAllErrors();
        this.hideMessage();
        
        let isValid = true;
        let errorMessage = '';
        
        // Check if fields are empty
        if (!username || !password) {
            this.showFieldErrors(this.usernameInput, this.passwordInput);
            this.showMessage('Điền đầy đủ username và password');
            return;
        }
        
        // Check for unicode characters in username
        if (this.hasUnicodeCharacters(username)) {
            this.showFieldError(this.usernameInput);
            this.showMessage('Username không được dùng kí tự unicode');
            return;
        }
        
        // Check for unicode characters in password
        if (this.hasUnicodeCharacters(password)) {
            this.showFieldError(this.passwordInput);
            this.showMessage('Password không được dùng kí tự unicode');
            return;
        }
        
        // Authenticate user
        this.login(username, password, rememberMe);
    }
    
    hasUnicodeCharacters(str) {
        // Check for unicode characters (non-ASCII)
        return /[^\x00-\x7F]/.test(str);
    }
      async login(username, password, rememberMe) {
        this.setLoading(true);
        
        try {
            // Simulate API call
            const result = await this.authenticateUser(username, password);
            
            if (result.success) {
                // Handle remember me functionality
                if (rememberMe) {
                    localStorage.setItem('rememberedLogin', 'true');
                    localStorage.setItem('username', username);
                } else {
                    sessionStorage.setItem('currentLogin', 'true');
                    sessionStorage.setItem('username', username);
                }
                
                this.showNotification('Đăng nhập thành công!', 'success');
                setTimeout(() => {
                    window.location.href = 'pages/home.html';
                }, 1500);
            } else {
                this.showMessage('Sai thông tin đăng nhập');
            }
        } catch (error) {
            this.showMessage('Có lỗi xảy ra. Vui lòng thử lại!');
        } finally {
            this.setLoading(false);
        }
    }
      authenticateUser(username, password) {
        return new Promise((resolve) => {
            setTimeout(() => {
                // Demo user database
                const users = [
                    { username: 'admin', password: '123456' },
                    { username: 'user', password: 'password' },
                    { username: 'demo', password: 'demo123' }
                ];
                
                // Check if user exists
                const user = users.find(u => u.username === username);
                
                if (!user) {
                    // Username doesn't exist
                    resolve({ 
                        success: false, 
                        message: 'Sai thông tin đăng nhập' 
                    });
                } else if (user.password !== password) {
                    // Username exists but password doesn't match
                    resolve({ 
                        success: false, 
                        message: 'Sai thông tin đăng nhập' 
                    });
                } else {
                    // Valid credentials
                    resolve({ success: true });
                }
            }, 1000);
        });
    }
      setLoading(isLoading) {
        if (isLoading) {
            this.submitBtn.classList.add('loading');
            this.submitBtn.querySelector('span').textContent = 'Đang đăng nhập...';
            this.submitBtn.disabled = true;
        } else {
            this.submitBtn.classList.remove('loading');
            this.submitBtn.querySelector('span').textContent = 'Đăng Nhập';
            this.submitBtn.disabled = false;
        }
    }
    
    showFieldError(input) {
        input.style.borderColor = '#e74c3c';
        input.style.borderWidth = '2px';
    }
    
    showFieldErrors(...inputs) {
        inputs.forEach(input => this.showFieldError(input));
    }
    
    clearFieldError(input) {
        input.style.borderColor = '#e1e5e9';
        input.style.borderWidth = '1px';
    }
    
    clearAllErrors() {
        this.clearFieldError(this.usernameInput);
        this.clearFieldError(this.passwordInput);
    }
    
    showMessage(message) {
        this.messageLabel.textContent = message;
        this.messageLabel.style.display = 'block';
    }
    
    hideMessage() {
        this.messageLabel.style.display = 'none';
    }
    
    showNotification(message, type) {
        // Remove existing notifications
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Create notification
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        // Style notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '15px 20px',
            borderRadius: '8px',
            color: 'white',
            fontWeight: '500',
            zIndex: '1000',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease'
        });
        
        if (type === 'success') {
            notification.style.background = '#27ae60';
        } else if (type === 'error') {
            notification.style.background = '#e74c3c';
        } else if (type === 'info') {
            notification.style.background = '#3498db';
        }
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Export for modular use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LoginForm;
}

// Auto-initialize when DOM is loaded (if not using modules)
document.addEventListener('DOMContentLoaded', function() {
    if (typeof module === 'undefined' && document.getElementById('loginForm')) {
        // Only initialize if not already initialized from index.html
        if (!window.loginFormInitialized) {
            window.loginFormInitialized = true;
            new LoginForm('loginForm');
        }
    }
});
