
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    const errorMessage = document.getElementById('error-message');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const loginButton = document.querySelector('.login-button');

    usernameInput.focus();

    const passwordGroup = passwordInput.parentElement;
    const passwordToggle = document.createElement('span');
    passwordToggle.className = 'password-toggle';
    passwordToggle.style.position = 'absolute';
    passwordToggle.style.right = '10px';
    passwordToggle.style.top = '38px';
    passwordToggle.style.cursor = 'pointer';
    passwordToggle.style.color = '#666';
    passwordGroup.style.position = 'relative';
    passwordGroup.appendChild(passwordToggle);
    
    passwordToggle.addEventListener('click', function() {
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            passwordToggle.style.opacity = '0.8';
        } else {
            passwordInput.type = 'password';
            passwordToggle.style.opacity = '0.5';
        }
    });
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        errorMessage.style.display = 'none';
        
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();
        
        if (!username || !password) {
            errorMessage.textContent = 'Please enter both username and password.';
            errorMessage.style.display = 'block';
            return;
        }

        loginButton.classList.add('loading');
        loginButton.disabled = true;

        setTimeout(function() {
            if (authenticateUser(username, password)) {

                localStorage.setItem('adminLoggedIn', 'true');
                window.location.href = 'index.php'; 
            } else {
                errorMessage.textContent = 'Invalid username or password. Please try again.';
                errorMessage.style.display = 'block';
                passwordInput.value = '';
                passwordInput.focus();
                
                loginButton.classList.remove('loading');
                loginButton.disabled = false;
            }
        }, 1500);
    });

    function authenticateUser(username, password) {
        return (username === "admin" && password === "admin123");
    }

    if (localStorage.getItem('adminLoggedIn') === 'true') {
    }

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !loginButton.disabled) {
            loginForm.dispatchEvent(new Event('submit'));
        }
    });
});
