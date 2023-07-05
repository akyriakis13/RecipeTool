
document.addEventListener("DOMContentLoaded", () => {

    let loginButton = document.getElementById('login-button');

    loginButton.addEventListener('click', function () {
        window.location.href = 'login.html';
    });

    let signupButton = document.getElementById('signup-button');

    signupButton.addEventListener('click', function () {
        window.location.href = 'signup.html';
    })

});