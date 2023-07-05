const viewRecipesBtn = document.getElementById('view-recipes-btn');

viewRecipesBtn.addEventListener('click', async () => {
    try {
        const response = await fetch('/view-recipes', {
            method: 'GET',
            credentials: 'same-origin',
        });

        if (!response.ok) {
            throw new Error(`Server responded with ${response.status}`);
        }

        const recipes = await response.json();

        // clear the current list
        const recipesList = document.getElementById('recipes-list');
        recipesList.innerHTML = ''; // clear any previous search results

        const listWrap = document.getElementById('list-wrap');
        listWrap.style.removeProperty('display');

        const main = document.getElementById('main');
        main.style.display = 'none';

        const exitButton = document.getElementById('exit-button');


        // display recipes as list items
        const ul = document.createElement('ul');
        recipes.forEach(recipe => {
            const li = document.createElement('li');
            li.innerHTML = `
            <div class="recipe-item">
                <h3>${recipe.name}</h3>
                <p><strong>Ingredients:</strong> ${recipe.ingredientlines}</p>
                <p><strong>Description:</strong> ${recipe.description ? recipe.description : 'N/A'}</p>
                <p><strong>Source:</strong> ${recipe.source}</p>
                <a href="${recipe.url}" target="_blank" class="get-recipe-link">View Recipe</a>
            </div>`;
            recipesList.appendChild(li);
        });

        // exit button
        exitButton.addEventListener('click', function() {
            recipesList.innerHTML = ''; // Clear recipe list
            listWrap.style.display = 'none';
            main.style.removeProperty('display');
        });

    } catch (error) {
        console.error(error);
        alert('Failed to fetch recipes');
    }
});