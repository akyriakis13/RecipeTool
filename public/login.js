document.addEventListener("DOMContentLoaded", () => {

    const form = document.querySelector('form');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData.entries());

        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.status === 200) {
            console.log('Login Successful!');
            window.location.href = '/index.html'; // redirect to login page
        } else {
            console.error('Error:', response.statusText);
        }
    });
});