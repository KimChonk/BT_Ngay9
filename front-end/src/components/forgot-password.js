/**
 * ForgotPasswordForm Component
 * Handles forgot password functionality and validation
 */

class ForgotPasswordForm {
    constructor(formId) {
        this.form = document.getElementById(formId);
        this.emailInput = document.getElementById('email');
        this.submitBtn = document.querySelector('.forgot-password-btn');
        this.backToLoginBtn = document.querySelector('.back-to-login');
        
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
        
        // Back to login button
        if (this.backToLoginBtn) {            this.backToLoginBtn.addEventListener('click', (e) => {
                e.preventDefault();
                window.location.href = '../index.html';
            });
        }
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
    
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    showError(input, message) {
        this.clearError(input);
        
        input.classList.add('error');
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        
        input.parentNode.appendChild(errorDiv);
    }
    
    clearError(input) {
        input.classList.remove('error');
        
        const errorMessage = input.parentNode.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    }
    
    validateForm() {
        const email = this.emailInput.value.trim();
        let isValid = true;
        
        if (!email) {
            this.showError(this.emailInput, 'Email là bắt buộc');
            isValid = false;
        } else if (!this.isValidEmail(email)) {
            this.showError(this.emailInput, 'Email không hợp lệ');
            isValid = false;
        }
        
        return isValid;
    }
    
    showLoading() {
        this.submitBtn.disabled = true;
        this.submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang gửi...';
    }
    
    hideLoading() {
        this.submitBtn.disabled = false;
        this.submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Gửi yêu cầu';
    }
    
    showSuccessMessage(message) {
        this.showMessage(message, 'success');
    }
    
    showErrorMessage(message) {
        this.showMessage(message, 'error');
    }
    
    showMessage(message, type) {
        // Remove existing messages
        const existingMessage = document.querySelector('.message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `message message-${type}`;
        messageDiv.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            ${message}
        `;
        
        this.form.insertBefore(messageDiv, this.form.firstChild);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 5000);
    }
    
    async handleSubmit(e) {
        e.preventDefault();
        
        if (!this.validateForm()) {
            return;
        }
        
        this.showLoading();
        this.clearError(this.emailInput);
        
        const email = this.emailInput.value.trim();
        
        try {
            const response = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                this.showSuccessMessage('Email khôi phục mật khẩu đã được gửi! Vui lòng kiểm tra hộp thư của bạn.');
                this.form.reset();
                
                // Show additional instructions
                setTimeout(() => {
                    this.showMessage(
                        'Nếu không thấy email, vui lòng kiểm tra thư mục spam. Link khôi phục sẽ hết hạn sau 1 giờ.',
                        'info'
                    );
                }, 2000);
            } else {
                this.showErrorMessage(data.message || 'Không thể gửi email khôi phục. Vui lòng thử lại.');
            }
        } catch (error) {
            console.error('Forgot password error:', error);
            this.showErrorMessage('Có lỗi xảy ra. Vui lòng thử lại sau.');
        } finally {
            this.hideLoading();
        }
    }
}

/**
 * ResetPasswordForm Component
 * Handles password reset functionality with token validation
 */
class ResetPasswordForm {
    constructor(formId) {
        this.form = document.getElementById(formId);
        this.passwordInput = document.getElementById('password');
        this.confirmPasswordInput = document.getElementById('confirmPassword');
        this.submitBtn = document.querySelector('.reset-password-btn');
        this.token = this.getTokenFromUrl();
        
        this.init();
    }
    
    init() {
        // Check if token exists
        if (!this.token) {
            this.showErrorMessage('Link khôi phục không hợp lệ hoặc đã hết hạn.');
            this.disableForm();
            return;
        }
        
        this.bindEvents();
        this.validateToken();
    }
    
    getTokenFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('token');
    }
    
    bindEvents() {
        // Form submission
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Real-time validation
        this.passwordInput.addEventListener('input', () => this.validatePasswordField());
        this.confirmPasswordInput.addEventListener('input', () => this.validateConfirmPasswordField());
    }
    
    validatePasswordField() {
        const password = this.passwordInput.value;
        
        if (password === '') {
            this.clearError(this.passwordInput);
        } else if (!this.isValidPassword(password)) {
            this.showError(this.passwordInput, 'Mật khẩu phải có ít nhất 6 ký tự, bao gồm chữ hoa, chữ thường và số');
        } else {
            this.clearError(this.passwordInput);
        }
        
        // Re-validate confirm password when password changes
        if (this.confirmPasswordInput.value !== '') {
            this.validateConfirmPasswordField();
        }
    }
    
    validateConfirmPasswordField() {
        const password = this.passwordInput.value;
        const confirmPassword = this.confirmPasswordInput.value;
        
        if (confirmPassword === '') {
            this.clearError(this.confirmPasswordInput);
        } else if (password !== confirmPassword) {
            this.showError(this.confirmPasswordInput, 'Mật khẩu xác nhận không khớp');
        } else {
            this.clearError(this.confirmPasswordInput);
        }
    }
    
    isValidPassword(password) {
        // Mật khẩu phải có ít nhất 6 ký tự, bao gồm chữ hoa, chữ thường và số
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{6,}$/;
        return passwordRegex.test(password);
    }
    
    showError(input, message) {
        this.clearError(input);
        
        input.classList.add('error');
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        
        input.parentNode.appendChild(errorDiv);
    }
    
    clearError(input) {
        input.classList.remove('error');
        
        const errorMessage = input.parentNode.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    }
    
    clearAllErrors() {
        const inputs = [this.passwordInput, this.confirmPasswordInput];
        inputs.forEach(input => this.clearError(input));
    }
    
    validateForm() {
        const password = this.passwordInput.value;
        const confirmPassword = this.confirmPasswordInput.value;
        let isValid = true;
        
        if (!password) {
            this.showError(this.passwordInput, 'Mật khẩu mới là bắt buộc');
            isValid = false;
        } else if (!this.isValidPassword(password)) {
            this.showError(this.passwordInput, 'Mật khẩu phải có ít nhất 6 ký tự, bao gồm chữ hoa, chữ thường và số');
            isValid = false;
        }
        
        if (!confirmPassword) {
            this.showError(this.confirmPasswordInput, 'Xác nhận mật khẩu là bắt buộc');
            isValid = false;
        } else if (password !== confirmPassword) {
            this.showError(this.confirmPasswordInput, 'Mật khẩu xác nhận không khớp');
            isValid = false;
        }
        
        return isValid;
    }
    
    disableForm() {
        this.passwordInput.disabled = true;
        this.confirmPasswordInput.disabled = true;
        this.submitBtn.disabled = true;
    }
    
    showLoading() {
        this.submitBtn.disabled = true;
        this.submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang đặt lại...';
    }
    
    hideLoading() {
        this.submitBtn.disabled = false;
        this.submitBtn.innerHTML = '<i class="fas fa-key"></i> Đặt lại mật khẩu';
    }
    
    showSuccessMessage(message) {
        this.showMessage(message, 'success');
    }
    
    showErrorMessage(message) {
        this.showMessage(message, 'error');
    }
    
    showMessage(message, type) {
        // Remove existing messages
        const existingMessage = document.querySelector('.message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `message message-${type}`;
        messageDiv.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            ${message}
        `;
        
        this.form.insertBefore(messageDiv, this.form.firstChild);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 5000);
    }
    
    async validateToken() {
        try {
            const response = await fetch(`/api/auth/validate-reset-token/${this.token}`);
            
            if (!response.ok) {
                this.showErrorMessage('Link khôi phục không hợp lệ hoặc đã hết hạn.');
                this.disableForm();
            }
        } catch (error) {
            console.error('Token validation error:', error);
            this.showErrorMessage('Không thể xác thực link khôi phục.');
            this.disableForm();
        }
    }
    
    async handleSubmit(e) {
        e.preventDefault();
        
        if (!this.validateForm()) {
            return;
        }
        
        this.showLoading();
        this.clearAllErrors();
        
        const password = this.passwordInput.value;
        
        try {
            const response = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token: this.token,
                    password: password
                })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                this.showSuccessMessage('Mật khẩu đã được đặt lại thành công!');
                this.form.reset();
                  // Redirect to login page after 3 seconds
                setTimeout(() => {
                    window.location.href = '../index.html';
                }, 3000);
            } else {
                this.showErrorMessage(data.message || 'Không thể đặt lại mật khẩu. Vui lòng thử lại.');
            }
        } catch (error) {
            console.error('Reset password error:', error);
            this.showErrorMessage('Có lỗi xảy ra. Vui lòng thử lại sau.');
        } finally {
            this.hideLoading();
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ForgotPasswordForm, ResetPasswordForm };
}
