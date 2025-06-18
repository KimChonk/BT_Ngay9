/**
 * RegisterForm Component
 * Handles user registration functionality and validation
 */

class RegisterForm {
    constructor(formId) {
        this.form = document.getElementById(formId);
        this.emailInput = document.getElementById('email');
        this.passwordInput = document.getElementById('password');
        this.confirmPasswordInput = document.getElementById('confirmPassword');
        this.fullNameInput = document.getElementById('fullName');
        this.phoneInput = document.getElementById('phone');
        this.submitBtn = document.querySelector('.register-btn');
        
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
        this.confirmPasswordInput.addEventListener('input', () => this.validateConfirmPasswordField());
        this.fullNameInput.addEventListener('input', () => this.validateFullNameField());
        this.phoneInput.addEventListener('input', () => this.validatePhoneField());
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
    
    validateFullNameField() {
        const fullName = this.fullNameInput.value.trim();
        
        if (fullName === '') {
            this.clearError(this.fullNameInput);
        } else if (fullName.length < 2) {
            this.showError(this.fullNameInput, 'Họ tên phải có ít nhất 2 ký tự');
        } else {
            this.clearError(this.fullNameInput);
        }
    }
    
    validatePhoneField() {
        const phone = this.phoneInput.value.trim();
        
        if (phone === '') {
            this.clearError(this.phoneInput);
        } else if (!this.isValidPhone(phone)) {
            this.showError(this.phoneInput, 'Số điện thoại không hợp lệ (10-11 số)');
        } else {
            this.clearError(this.phoneInput);
        }
    }
    
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    isValidPassword(password) {
        // Mật khẩu phải có ít nhất 6 ký tự, bao gồm chữ hoa, chữ thường và số
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{6,}$/;
        return passwordRegex.test(password);
    }
    
    isValidPhone(phone) {
        // Số điện thoại Việt Nam (10-11 số)
        const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8,9})$/;
        return phoneRegex.test(phone);
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
        const inputs = [this.emailInput, this.passwordInput, this.confirmPasswordInput, this.fullNameInput, this.phoneInput];
        inputs.forEach(input => this.clearError(input));
    }
    
    validateForm() {
        const email = this.emailInput.value.trim();
        const password = this.passwordInput.value;
        const confirmPassword = this.confirmPasswordInput.value;
        const fullName = this.fullNameInput.value.trim();
        const phone = this.phoneInput.value.trim();
        
        let isValid = true;
        
        // Validate all fields
        if (!email) {
            this.showError(this.emailInput, 'Email là bắt buộc');
            isValid = false;
        } else if (!this.isValidEmail(email)) {
            this.showError(this.emailInput, 'Email không hợp lệ');
            isValid = false;
        }
        
        if (!password) {
            this.showError(this.passwordInput, 'Mật khẩu là bắt buộc');
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
        
        if (!fullName) {
            this.showError(this.fullNameInput, 'Họ tên là bắt buộc');
            isValid = false;
        } else if (fullName.length < 2) {
            this.showError(this.fullNameInput, 'Họ tên phải có ít nhất 2 ký tự');
            isValid = false;
        }
        
        if (!phone) {
            this.showError(this.phoneInput, 'Số điện thoại là bắt buộc');
            isValid = false;
        } else if (!this.isValidPhone(phone)) {
            this.showError(this.phoneInput, 'Số điện thoại không hợp lệ (10-11 số)');
            isValid = false;
        }
        
        return isValid;
    }
    
    showLoading() {
        this.submitBtn.disabled = true;
        this.submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang đăng ký...';
    }
    
    hideLoading() {
        this.submitBtn.disabled = false;
        this.submitBtn.innerHTML = '<i class="fas fa-user-plus"></i> Đăng ký';
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
        this.clearAllErrors();
        
        const formData = {
            email: this.emailInput.value.trim(),
            password: this.passwordInput.value,
            fullName: this.fullNameInput.value.trim(),
            phone: this.phoneInput.value.trim()
        };
        
        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
            
            const data = await response.json();
            
            if (response.ok) {
                this.showSuccessMessage('Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản.');
                this.form.reset();
                  // Redirect to login page after 2 seconds
                setTimeout(() => {
                    window.location.href = '../index.html';
                }, 2000);
            } else {
                this.showErrorMessage(data.message || 'Đăng ký thất bại. Vui lòng thử lại.');
            }
        } catch (error) {
            console.error('Registration error:', error);
            this.showErrorMessage('Có lỗi xảy ra. Vui lòng thử lại sau.');
        } finally {
            this.hideLoading();
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RegisterForm;
}
