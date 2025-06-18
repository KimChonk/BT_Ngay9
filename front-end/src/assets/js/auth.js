// Authentication JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    // Check which form exists on current page
    const isLoginPage = !!loginForm;
    const isRegisterPage = !!registerForm;
    
    if (isLoginPage) {
        // Initialize the new LoginForm component
        const loginFormInstance = new LoginForm('loginForm');
    }
    
    if (isRegisterPage) {
        initializeRegisterForm();
    }
    
    // Initialize login form
    function initializeLoginForm() {
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        const loginBtn = document.querySelector('.login-btn');
        
        // Real-time validation for login
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

        // Form submission for login
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
                let loginSuccess = false;
                
                // Check demo credentials
                if (email === 'admin@example.com' && password === '123456') {
                    loginSuccess = true;
                }
                
                // Check registered user from localStorage
                const registeredUser = localStorage.getItem('registeredUser');
                if (registeredUser) {
                    const userData = JSON.parse(registeredUser);
                    if (userData.email === email && userData.password === password) {
                        loginSuccess = true;
                    }
                }
                
                if (loginSuccess) {
                    showSuccessMessage('Đăng nhập thành công!');
                    
                    // Store login session
                    localStorage.setItem('currentUser', JSON.stringify({
                        email: email,
                        loginTime: new Date().toISOString()
                    }));
                    
                    // Redirect after success
                    setTimeout(() => {
                        window.location.href = 'pages/dashboard.html';
                    }, 1500);
                } else {
                    showErrorMessage('Email hoặc mật khẩu không đúng');
                }
                
                // Reset button state
                loginBtn.classList.remove('loading');
                loginBtn.querySelector('span').textContent = 'Đăng Nhập';
            }, 2000);
        }
    }
    
    // Initialize register form
    function initializeRegisterForm() {
        const fullNameInput = document.getElementById('fullName');
        const emailInput = document.getElementById('registerEmail');
        const phoneInput = document.getElementById('phone');
        const passwordInput = document.getElementById('registerPassword');
        const confirmPasswordInput = document.getElementById('confirmPassword');
        const agreeTermsInput = document.getElementById('agreeTerms');
        const registerBtn = document.querySelector('.login-btn');
        
        // Real-time validation for register
        fullNameInput.addEventListener('input', function() {
            if (this.value.trim() === '') {
                clearError(this);
            } else if (!validateFullName(this.value)) {
                showError(this, 'Tên phải có ít nhất 2 ký tự');
            } else {
                clearError(this);
            }
        });
        
        emailInput.addEventListener('input', function() {
            if (this.value.trim() === '') {
                clearError(this);
            } else if (!validateEmail(this.value)) {
                showError(this, 'Email không hợp lệ');
            } else {
                clearError(this);
            }
        });

        phoneInput.addEventListener('input', function() {
            if (this.value.trim() === '') {
                clearError(this);
            } else if (!validatePhone(this.value)) {
                showError(this, 'Số điện thoại không hợp lệ');
            } else {
                clearError(this);
            }
        });

        passwordInput.addEventListener('input', function() {
            if (this.value.trim() === '') {
                clearError(this);
            } else if (!validateStrongPassword(this.value)) {
                showError(this, 'Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số');
            } else {
                clearError(this);
                // Also validate confirm password if it has value
                if (confirmPasswordInput.value) {
                    validateConfirmPassword();
                }
            }
        });

        confirmPasswordInput.addEventListener('input', function() {
            validateConfirmPassword();
        });
        
        function validateConfirmPassword() {
            if (confirmPasswordInput.value.trim() === '') {
                clearError(confirmPasswordInput);
            } else if (confirmPasswordInput.value !== passwordInput.value) {
                showError(confirmPasswordInput, 'Mật khẩu xác nhận không khớp');
            } else {
                clearError(confirmPasswordInput);
            }
        }

        // Form submission for register
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const fullName = fullNameInput.value.trim();
            const email = emailInput.value.trim();
            const phone = phoneInput.value.trim();
            const password = passwordInput.value;
            const confirmPassword = confirmPasswordInput.value;
            const agreeTerms = agreeTermsInput.checked;
            let isValid = true;
            
            // Clear previous errors
            clearError(fullNameInput);
            clearError(emailInput);
            clearError(phoneInput);
            clearError(passwordInput);
            clearError(confirmPasswordInput);
            
            // Validate full name
            if (fullName === '') {
                showError(fullNameInput, 'Vui lòng nhập họ và tên');
                isValid = false;
            } else if (!validateFullName(fullName)) {
                showError(fullNameInput, 'Tên phải có ít nhất 2 ký tự');
                isValid = false;
            }
            
            // Validate email
            if (email === '') {
                showError(emailInput, 'Vui lòng nhập email');
                isValid = false;
            } else if (!validateEmail(email)) {
                showError(emailInput, 'Email không hợp lệ');
                isValid = false;
            }
            
            // Validate phone
            if (phone === '') {
                showError(phoneInput, 'Vui lòng nhập số điện thoại');
                isValid = false;
            } else if (!validatePhone(phone)) {
                showError(phoneInput, 'Số điện thoại không hợp lệ');
                isValid = false;
            }
            
            // Validate password
            if (password === '') {
                showError(passwordInput, 'Vui lòng nhập mật khẩu');
                isValid = false;
            } else if (!validateStrongPassword(password)) {
                showError(passwordInput, 'Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số');
                isValid = false;
            }
            
            // Validate confirm password
            if (confirmPassword === '') {
                showError(confirmPasswordInput, 'Vui lòng xác nhận mật khẩu');
                isValid = false;
            } else if (confirmPassword !== password) {
                showError(confirmPasswordInput, 'Mật khẩu xác nhận không khớp');
                isValid = false;
            }
            
            // Validate terms agreement
            if (!agreeTerms) {
                showErrorMessage('Vui lòng đồng ý với điều khoản sử dụng');
                isValid = false;
            }
            
            if (isValid) {
                handleRegister(fullName, email, phone, password);
            }
        });
        
        // Handle register process
        function handleRegister(fullName, email, phone, password) {
            // Show loading state
            registerBtn.classList.add('loading');
            registerBtn.querySelector('span').textContent = 'Đang đăng ký...';
            
            // Simulate API call
            setTimeout(() => {
                // For demo purposes, simulate successful registration
                showSuccessMessage('Đăng ký thành công! Chuyển hướng đến trang đăng nhập...');
                
                // Store user data in localStorage for demo
                const userData = {
                    fullName,
                    email,
                    phone,
                    password,
                    registeredAt: new Date().toISOString()
                };
                localStorage.setItem('registeredUser', JSON.stringify(userData));
                
                // Redirect to login page after success
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 2000);
                
                // Reset button state
                registerBtn.classList.remove('loading');
                registerBtn.querySelector('span').textContent = 'Đăng Ký';
            }, 2000);
        }
    }
    
    // Toggle password visibility with dynamic IDs
    window.togglePassword = function(inputId = 'password', iconId = 'toggleIcon') {
        const passwordField = document.getElementById(inputId);
        const toggleIcon = document.getElementById(iconId);
        
        if (passwordField.type === 'password') {
            passwordField.type = 'text';
            toggleIcon.className = 'fas fa-eye-slash';
        } else {
            passwordField.type = 'password';
            toggleIcon.className = 'fas fa-eye';
        }
    };
    
    // Form validation functions
    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    function validatePassword(password) {
        return password.length >= 6;
    }
    
    function validateStrongPassword(password) {
        // At least 8 characters, with uppercase, lowercase, and number
        const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
        return strongPasswordRegex.test(password);
    }
    
    function validateFullName(name) {
        return name.trim().length >= 2;
    }
    
    function validatePhone(phone) {
        // Vietnamese phone number validation
        const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/;
        return phoneRegex.test(phone.replace(/\s/g, ''));
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
        if (activeElement.tagName === 'INPUT' && activeElement.closest('#registerForm')) {
            e.preventDefault();
            document.getElementById('registerForm').dispatchEvent(new Event('submit'));
        }
    }
});

// Export functions for potential modular use
window.AuthModule = {
    validateEmail,
    validatePassword,
    validateStrongPassword,
    validateFullName,
    validatePhone,
    showNotification
};
