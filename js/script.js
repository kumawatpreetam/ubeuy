document.addEventListener('DOMContentLoaded', () => {
    // Theme Toggle
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    const icon = themeToggle.querySelector('i');

    function setTheme(isDark) {
        body.classList.toggle('dark-mode', isDark);
        icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        
        // Update meta theme-color for mobile browsers
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) {
            metaThemeColor.setAttribute('content', isDark ? '#1a1a1a' : '#ffffff');
        }
    }

    function toggleTheme() {
        const isDark = !body.classList.contains('dark-mode');
        setTheme(isDark);
    }

    // Load saved theme or system preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        setTheme(savedTheme === 'dark');
    } else {
        // Check system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setTheme(prefersDark);
    }

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addListener((e) => {
        if (!localStorage.getItem('theme')) {
            setTheme(e.matches);
        }
    });

    themeToggle.addEventListener('click', toggleTheme);

    // Tab Switching
    const tabBtns = document.querySelectorAll('.tab-btn');
    const forms = document.querySelectorAll('.form');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetForm = btn.dataset.tab;

            // Update active states
            tabBtns.forEach(b => b.classList.remove('active'));
            forms.forEach(f => f.classList.remove('active'));

            btn.classList.add('active');
            document.getElementById(`${targetForm}Form`).classList.add('active');
        });
    });

    // Password Visibility Toggle
    const toggleBtns = document.querySelectorAll('.toggle-password');

    toggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const input = btn.parentElement.querySelector('input');
            const icon = btn.querySelector('i');

            if (input.type === 'password') {
                input.type = 'text';
                icon.className = 'fas fa-eye-slash';
            } else {
                input.type = 'password';
                icon.className = 'fas fa-eye';
            }
        });
    });

    // Password Strength Indicator
    const signupPassword = document.getElementById('signupPassword');
    const strengthIndicator = document.querySelector('.password-strength');

    function checkPasswordStrength(password) {
        let strength = 0;
        
        // Length check
        if (password.length >= 8) strength += 25;
        
        // Uppercase check
        if (/[A-Z]/.test(password)) strength += 25;
        
        // Lowercase check
        if (/[a-z]/.test(password)) strength += 25;
        
        // Number/Special character check
        if (/[0-9!@#$%^&*]/.test(password)) strength += 25;

        return strength;
    }

    signupPassword?.addEventListener('input', (e) => {
        const strength = checkPasswordStrength(e.target.value);
        strengthIndicator.style.setProperty('--strength', `${strength}%`);
        
        // Update color based on strength
        let color = '#ff4444'; // Weak
        if (strength >= 75) color = '#4CAF50'; // Strong
        else if (strength >= 50) color = '#FFA500'; // Medium
        
        strengthIndicator.style.backgroundColor = color;
    });

    // Form Validation
    const signupForm = document.getElementById('signupForm');
    const confirmPassword = document.getElementById('confirmPassword');

    signupForm?.addEventListener('submit', (e) => {
        e.preventDefault();

        // Check Terms & Conditions
        const termsAccepted = document.getElementById('termsAccept').checked;
        if (!termsAccepted) {
            alert('Please accept the Terms & Conditions to continue');
            return;
        }

        // Verify reCAPTCHA
        const recaptchaResponse = grecaptcha.getResponse();
        if (!recaptchaResponse) {
            alert('Please complete the reCAPTCHA verification');
            return;
        }

        // Check passwords if not in OTP mode
        if (!signupAuthToggle.checked && signupPassword.value !== confirmPassword.value) {
            alert('Passwords do not match!');
            return;
        }

        // Get mailing list preference
        const joinMailingList = document.getElementById('mailingList').checked;

        // Add your signup logic here
        console.log('Form submitted successfully', {
            joinMailingList,
            recaptchaResponse
        });
    });

    // Auth Toggle Functionality
    const loginAuthToggle = document.getElementById('loginAuthToggle');
    const signupAuthToggle = document.getElementById('signupAuthToggle');
    const loginPasswordFields = document.getElementById('loginPasswordFields');
    const loginOTPFields = document.getElementById('loginOTPFields');
    const signupPasswordFields = document.getElementById('signupPasswordFields');
    const signupOTPFields = document.getElementById('signupOTPFields');
    const signupButton = document.getElementById('signupButton');

    // Login Toggle
    loginAuthToggle?.addEventListener('change', (e) => {
        const isOTP = e.target.checked;
        loginPasswordFields.classList.toggle('hidden', isOTP);
        loginOTPFields.classList.toggle('hidden', !isOTP);
        
        // Hide password fields when OTP is selected
        const passwordGroup = loginForm.querySelector('.password-group');
        if (passwordGroup) {
            passwordGroup.style.display = isOTP ? 'none' : 'block';
        }
    });

    // Signup Toggle
    signupAuthToggle?.addEventListener('change', (e) => {
        const isOTP = e.target.checked;
        signupPasswordFields.classList.toggle('hidden', isOTP);
        signupOTPFields.classList.toggle('hidden', !isOTP);
        signupButton.textContent = isOTP ? 'Sign Up with OTP' : 'Sign Up with Password';
        
        // Hide password fields when OTP is selected
        const passwordGroups = signupForm.querySelectorAll('.password-group');
        passwordGroups.forEach(group => {
            group.style.display = isOTP ? 'none' : 'block';
        });
    });

    // Forgot Password Modal
    const modal = document.getElementById('forgotPasswordModal');
    const forgotPasswordLinks = document.querySelectorAll('.forgot-password a');
    const closeModal = document.querySelector('.close-modal');
    const forgotPasswordForm = document.getElementById('forgotPasswordForm');

    function showModal() {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    function hideModal() {
        modal.classList.remove('show');
        document.body.style.overflow = '';
        // Reset form
        forgotPasswordForm.reset();
        // Reset reCAPTCHA if it exists
        if (typeof grecaptcha !== 'undefined') {
            grecaptcha.reset();
        }
    }

    forgotPasswordLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            showModal();
        });
    });

    closeModal.addEventListener('click', hideModal);

    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            hideModal();
        }
    });

    // Form submission
    forgotPasswordForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Verify reCAPTCHA
        const recaptchaResponse = grecaptcha.getResponse();
        if (!recaptchaResponse) {
            alert('Please complete the reCAPTCHA verification');
            return;
        }

        const email = document.getElementById('resetEmail').value;

        console.log('Password reset requested', {
            email,
            recaptchaResponse
        });

        // Show success message
        alert('Password reset instructions have been sent to your email.');
        
        hideModal();
    });

    // Login Form
    const loginForm = document.getElementById('loginForm');

    loginForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        const isOTP = loginAuthToggle.checked;
        if (isOTP) {
            const otp = document.getElementById('loginOTP').value;
            console.log('Login attempted with OTP:', otp);
        } else {
            console.log('Login attempted with password');
        }
    });
});