const apiKey = "ad25553c4568497fa70ee581ebfcb721";
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const recipesContainer = document.getElementById('recipesContainer');
const prevPage = document.getElementById('prevPage');
const nextPage = document.getElementById('nextPage');
const modal = document.getElementById('modal');
const modalDetails = document.getElementById('modalDetails');
const closeModal = document.getElementById('closeModal');
const vegetarianFilter = document.getElementById('vegetarianFilter');
const quickFilter = document.getElementById('quickFilter');

let currentPage = 1;
let query = '';
let isVegetarian = false;
let isQuick = false;

async function fetchRecipes(page = 1) {
  recipesContainer.innerHTML = '';
  const filters = `${isVegetarian ? '&diet=vegetarian' : ''}${isQuick ? '&maxReadyTime=30' : ''}`;
  const response = await fetch(
    `https://api.spoonacular.com/recipes/complexSearch?query=${query}&number=9&offset=${(page - 1) * 9}${filters}&apiKey=${apiKey}`
  );
  const data = await response.json();
  displayRecipes(data.results);
  

}
function displayRecipes(recipes) {
  nextPage.style.display = "block";
  prevPage.style.display = "block";
  const recipeHTML = recipes
    .map(
      (recipe) => `
      <div class="recipe-card">
        <img src="${recipe.image}" alt="${recipe.title}">
        <h3>${recipe.title}</h3>
        <button class="details-button" data-id="${recipe.id}">View Details</button>
      </div>
    `
    )
    .join('');
  recipesContainer.innerHTML = `<div class="recipes-grid">${recipeHTML}</div>`;
}
async function fetchRecipeDetails(id) {
  const response = await fetch(`https://api.spoonacular.com/recipes/${id}/information?apiKey=${apiKey}`);
  const recipe = await response.json();
  modalDetails.innerHTML = `
    <div class="modal-header">
      <img src="${recipe.image}" alt="${recipe.title}" class="modal-image">
      <h2>${recipe.title}</h2>
    </div>
    <p>${recipe.summary}</p>
    <h3>Ingredients:</h3>
    <ul>
      ${recipe.extendedIngredients.map(ing => `<li>${ing.original}</li>`).join('')}
    </ul>
    <h3>Instructions:</h3>
    <p>${recipe.instructions || 'No instructions available.'}</p>
  `;
  modal.classList.remove('hidden');
}

closeModal.addEventListener('click', () => {
  modal.classList.add('hidden');
});

searchButton.addEventListener('click', () => {
  prevPage.style.display = "flex;"
  nextPage.style.display = "flex;"
  query = searchInput.value;
  fetchRecipes();
});

searchInput.addEventListener('input', () => {
  query = searchInput.value;
  fetchRecipes();
});

vegetarianFilter.addEventListener('change', () => {
  isVegetarian = vegetarianFilter.checked;
  fetchRecipes();
});

quickFilter.addEventListener('change', () => {
  isQuick = quickFilter.checked;
  fetchRecipes();
});
recipesContainer.addEventListener('click', (e) => {
  if (e.target.classList.contains('details-button')) {
    const id = e.target.getAttribute('data-id');
    if (id) {
      fetchRecipeDetails(id);
    } else {
      console.error('Recipe ID not found.');
    }
  }
});

modal.addEventListener('click', (e) => {
  if (e.target === modal || e.target.classList.contains('close')) {
    modal.classList.add('hidden');
  }
});
prevPage.addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    fetchRecipes(currentPage);
    nextPage.disabled = false;
    prevPage.disabled = currentPage === 1;
  }
});
nextPage.addEventListener('click', () => {
  currentPage++;
  fetchRecipes(currentPage);
  prevPage.disabled = false;
});
