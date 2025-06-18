/**
 * LoginForm Component
 * Handles login form functionality and validation
 */

class LoginForm {
    constructor(formId) {
        this.form = document.getElementById(formId);
        this.emailInput = document.getElementById('email');
        this.passwordInput = document.getElementById('password');
        this.submitBtn = document.querySelector('.login-btn');
        
        this.init();
    }
    
    init() {
        this.bindEvents();
    }
    
    bindEvents() {
        // Form submission
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Real-time validation
        this.emailInput.addEventListener('input', () => this.validateEmailField());
        this.passwordInput.addEventListener('input', () => this.validatePasswordField());
    }
    
    validateEmailField() {
        const email = this.emailInput.value.trim();
        
        if (email === '') {
            this.clearError(this.emailInput);
        } else if (!this.isValidEmail(email)) {
            this.showError(this.emailInput, 'Email không hợp lệ');
        } else {
            this.clearError(this.emailInput);
        }
    }
    
    validatePasswordField() {
        const password = this.passwordInput.value;
        
        if (password === '') {
            this.clearError(this.passwordInput);
        } else if (!this.isValidPassword(password)) {
            this.showError(this.passwordInput, 'Mật khẩu phải có ít nhất 6 ký tự');
        } else {
            this.clearError(this.passwordInput);
        }
    }
    
    handleSubmit(e) {
        e.preventDefault();
        
        const email = this.emailInput.value.trim();
        const password = this.passwordInput.value;
        
        // Clear previous errors
        this.clearError(this.emailInput);
        this.clearError(this.passwordInput);
        
        let isValid = true;
        
        // Validate email
        if (email === '') {
            this.showError(this.emailInput, 'Vui lòng nhập email');
            isValid = false;
        } else if (!this.isValidEmail(email)) {
            this.showError(this.emailInput, 'Email không hợp lệ');
            isValid = false;
        }
        
        // Validate password
        if (password === '') {
            this.showError(this.passwordInput, 'Vui lòng nhập mật khẩu');
            isValid = false;
        } else if (!this.isValidPassword(password)) {
            this.showError(this.passwordInput, 'Mật khẩu phải có ít nhất 6 ký tự');
            isValid = false;
        }
        
        if (isValid) {
            this.login(email, password);
        }
    }
    
    async login(email, password) {
        this.setLoading(true);
        
        try {
            // Simulate API call
            const result = await this.authenticateUser(email, password);
            
            if (result.success) {
                this.showNotification('Đăng nhập thành công!', 'success');
                setTimeout(() => {
                    window.location.href = 'pages/dashboard.html';
                }, 1500);
            } else {
                this.showNotification(result.message, 'error');
            }
        } catch (error) {
            this.showNotification('Có lỗi xảy ra. Vui lòng thử lại!', 'error');
        } finally {
            this.setLoading(false);
        }
    }
    
    authenticateUser(email, password) {
        return new Promise((resolve) => {
            setTimeout(() => {
                // Demo authentication
                if (email === 'admin@example.com' && password === '123456') {
                    resolve({ success: true });
                } else {
                    resolve({ 
                        success: false, 
                        message: 'Email hoặc mật khẩu không đúng' 
                    });
                }
            }, 2000);
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
    
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    isValidPassword(password) {
        return password.length >= 6;
    }
    
    showError(input, message) {
        const inputGroup = input.parentElement;
        let errorElement = inputGroup.querySelector('.error-message');
        
        // Remove existing error
        if (errorElement) {
            errorElement.remove();
        }
        
        // Add error styling
        input.style.borderColor = '#e74c3c';
        
        // Create error message
        errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        
        inputGroup.appendChild(errorElement);
    }
    
    clearError(input) {
        const inputGroup = input.parentElement;
        const errorElement = inputGroup.querySelector('.error-message');
        
        if (errorElement) {
            errorElement.remove();
        }
        
        input.style.borderColor = '#e1e5e9';
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
