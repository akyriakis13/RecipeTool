let form = document.getElementById('custom-recipe-form');
form.addEventListener('submit', (event) => {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const ingredients = document.getElementById('ingredients').value;
    const description = document.getElementById('description').value;
    const url = document.getElementById('url').value;

    fetch('/save-recipe', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, ingredients, description, url })
    })
        .then(response => {
            if (response.ok) {
                alert('Recipe saved successfully');
                form.reset();
            } else {
                alert('Error saving recipe')
            }
        })
        .catch(error => {
            console.error(error);
            alert('Error saving recipe');
        });
});