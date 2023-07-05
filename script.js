document.querySelector('#search-form').addEventListener('submit', function(event) {
    event.preventDefault(); // prevent default form submission

    // get the data
    const formData = {
        ingredient: document.querySelector('#ingredient').value,
        cuisineType: document.querySelector('#cuisine-type').value,
        glutenFree: document.querySelector('#gluten-free').checked,
        vegan: document.querySelector('#vegan').checked,
        vegetarian: document.querySelector('#vegetarian').checked
    };

    // Handle the data
    fetch(`/recipes?ingredient=${formData.ingredient}&cuisineType=${formData.cuisineType}&glutenFree=${formData.glutenFree}&vegan=${formData.vegan}&vegetarian=${formData.vegetarian}`)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            const recipeList = document.getElementById('recipe-list');
            recipeList.innerHTML = ''; // clear any previous search results

            const listWrap = document.createElement('div');
            listWrap.classList.add('list-wrap');

            const exitButton = document.createElement('button');
            exitButton.innerText = 'X';
            exitButton.classList.add('exit-button');
            listWrap.appendChild(exitButton);

            const ul = document.createElement('ul');
            data.forEach(recipe => {
                const li = document.createElement('li');
                li.innerHTML = `
                <div class="recipe-item">
                    <img src="${recipe.image}" alt="${recipe.label}">
                    <div>
                        <h3>${recipe.label}</h3>
                        <p class="ingredient-text">${recipe.ingredientLines.join(', ')}</p>
                    </div>
                    <a href="${recipe.url}" target="_blank" class="get-recipe-link">Get Recipe</a>
                    <button class="save-recipe">Save Recipe</button>
                </div>
            `;
                ul.appendChild(li);
            });

            listWrap.appendChild(ul);
            recipeList.appendChild(listWrap);

            // exit button
            exitButton.addEventListener('click', function() {
                recipeList.innerHTML = ''; // Clear recipe list
            });

            // save button
            const saveButtons = document.querySelectorAll('.save-recipe');
            saveButtons.forEach(button => {
                button.addEventListener('click', function(event) {
                    const li = event.target.closest('li');
                    const recipe = {
                        image: li.querySelector('img').getAttribute('src'),
                        label: li.querySelector('h3').textContent,
                        url: li.querySelector('a').getAttribute('href'),
                        ingredientLines: li.querySelector('p').textContent.split(', ')
                    };
                    saveRecipe(recipe);
                });
            });
        })
        .catch(error => console.error(error));
});

function saveRecipe(recipe) {
    const recipeData = {
        label: recipe.label,
        url: recipe.url,
        ingredientLines: recipe.ingredientLines.join(', ')
    };

    const token = document.cookie.split('=')[1]; // get the JWT token from cookie

    fetch('/recipes', {
        method: 'POST',
        body: JSON.stringify({ recipe: recipeData }),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // include the JWT token in the headers
        }
    })
        .then(response => {
            if (response.ok) {
                console.log(`Recipe "${recipeData.label}" saved!`);
            } else {
                console.error('Error saving recipe');
            }
        })
        .catch(error => console.error(error));
}



