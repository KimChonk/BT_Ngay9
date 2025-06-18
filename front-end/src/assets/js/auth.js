// Authentication JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const loginBtn = document.querySelector('.login-btn');
    
    // Toggle password visibility
    window.togglePassword = function() {
        const passwordField = document.getElementById('password');
        const toggleIcon = document.getElementById('toggleIcon');
        
        if (passwordField.type === 'password') {
            passwordField.type = 'text';
            toggleIcon.className = 'fas fa-eye-slash';
        } else {
            passwordField.type = 'password';
            toggleIcon.className = 'fas fa-eye';
        }
    };
    
    // Form validation
    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    function validatePassword(password) {
        return password.length >= 6;
    }
    
    // Show error message
    function showError(input, message) {
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
        errorElement.style.color = '#e74c3c';
        errorElement.style.fontSize = '12px';
        errorElement.style.marginTop = '5px';
        errorElement.style.marginLeft = '45px';
        
        inputGroup.appendChild(errorElement);
    }
    
    // Clear error message
    function clearError(input) {
        const inputGroup = input.parentElement;
        const errorElement = inputGroup.querySelector('.error-message');
        
        if (errorElement) {
            errorElement.remove();
        }
        
        input.style.borderColor = '#e1e5e9';
    }
    
    // Real-time validation
    emailInput.addEventListener('input', function() {
        if (this.value.trim() === '') {
            clearError(this);
        } else if (!validateEmail(this.value)) {
            showError(this, 'Email không hợp lệ');
        } else {
            clearError(this);
        }
    });
    
    passwordInput.addEventListener('input', function() {
        if (this.value.trim() === '') {
            clearError(this);
        } else if (!validatePassword(this.value)) {
            showError(this, 'Mật khẩu phải có ít nhất 6 ký tự');
        } else {
            clearError(this);
        }
    });
    
    // Form submission
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        let isValid = true;
        
        // Clear previous errors
        clearError(emailInput);
        clearError(passwordInput);
        
        // Validate email
        if (email === '') {
            showError(emailInput, 'Vui lòng nhập email');
            isValid = false;
        } else if (!validateEmail(email)) {
            showError(emailInput, 'Email không hợp lệ');
            isValid = false;
        }
        
        // Validate password
        if (password === '') {
            showError(passwordInput, 'Vui lòng nhập mật khẩu');
            isValid = false;
        } else if (!validatePassword(password)) {
            showError(passwordInput, 'Mật khẩu phải có ít nhất 6 ký tự');
            isValid = false;
        }
        
        if (isValid) {
            handleLogin(email, password);
        }
    });
    
    // Handle login process
    function handleLogin(email, password) {
        // Show loading state
        loginBtn.classList.add('loading');
        loginBtn.querySelector('span').textContent = 'Đang đăng nhập...';
        
        // Simulate API call
        setTimeout(() => {
            // For demo purposes, check for demo credentials
            if (email === 'admin@example.com' && password === '123456') {
                showSuccessMessage('Đăng nhập thành công!');
                
                // Redirect after success (in real app, this would be handled by server)
                setTimeout(() => {
                    window.location.href = 'pages/dashboard.html'; // Change to your dashboard page
                }, 1500);
            } else {
                showErrorMessage('Email hoặc mật khẩu không đúng');
            }
            
            // Reset button state
            loginBtn.classList.remove('loading');
            loginBtn.querySelector('span').textContent = 'Đăng Nhập';
        }, 2000);
    }
    
    // Show success message
    function showSuccessMessage(message) {
        showNotification(message, 'success');
    }
    
    // Show error message
    function showErrorMessage(message) {
        showNotification(message, 'error');
    }
    
    // Show notification
    function showNotification(message, type) {
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
        notification.style.position = 'fixed';
        notification.style.top = '20px';
        notification.style.right = '20px';
        notification.style.padding = '15px 20px';
        notification.style.borderRadius = '8px';
        notification.style.color = 'white';
        notification.style.fontWeight = '500';
        notification.style.zIndex = '1000';
        notification.style.transform = 'translateX(100%)';
        notification.style.transition = 'transform 0.3s ease';
        
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
    
    // Demo credentials helper
    console.log('Demo credentials:');
    console.log('Email: admin@example.com');
    console.log('Password: 123456');
});

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Enter key to submit form
    if (e.key === 'Enter' && !e.shiftKey) {
        const activeElement = document.activeElement;
        if (activeElement.tagName === 'INPUT' && activeElement.closest('#loginForm')) {
            e.preventDefault();
            document.getElementById('loginForm').dispatchEvent(new Event('submit'));
        }
    }
});

// Export functions for potential modular use
window.AuthModule = {
    validateEmail,
    validatePassword,
    showNotification
};
