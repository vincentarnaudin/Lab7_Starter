// main.js

// CONSTANTS
const RECIPE_URLS = [
  'https://introweb.tech/assets/json/1_50-thanksgiving-side-dishes.json',
  'https://introweb.tech/assets/json/2_roasting-turkey-breast-with-stuffing.json',
  'https://introweb.tech/assets/json/3_moms-cornbread-stuffing.json',
  'https://introweb.tech/assets/json/4_50-indulgent-thanksgiving-side-dishes-for-any-holiday-gathering.json',
  'https://introweb.tech/assets/json/5_healthy-thanksgiving-recipe-crockpot-turkey-breast.json',
  'https://introweb.tech/assets/json/6_one-pot-thanksgiving-dinner.json',
];

// Run the init() function when the page has loaded
window.addEventListener('DOMContentLoaded', init);

// Starts the program, all function calls trace back here
async function init() {
  // initialize ServiceWorker
  initializeServiceWorker();
  // Get the recipes from localStorage
  let recipes;
  try {
    recipes = await getRecipes();
  } catch (err) {
    console.error(err);
  }
  // Add each recipe to the <main> element
  addRecipesToDocument(recipes);
}

/**
 * Detects if there's a service worker, then loads it and begins the process
 * of installing it and getting it running
 */
function initializeServiceWorker() {
  // B1. Check if 'serviceWorker' is supported in the current browser
  if ('serviceWorker' in navigator) {
    // B2. Listen for the 'load' event on the window object.
    window.addEventListener('load', function() {
      // B3. Register './sw.js' as a service worker
      navigator.serviceWorker.register('./sw.js')
        .then(function(registration) {
          // B4. Once the service worker has been successfully registered, console log that it was successful.
          console.log('Service Worker registered with scope:', registration.scope);
        })
        .catch(function(error) {
          // B5. In the event that the service worker registration fails, console log that it has failed.
          console.log('Service Worker registration failed:', error);
        });
    });
  }
}

/**
 * Reads 'recipes' from localStorage and returns an array of
 * all of the recipes found (parsed, not in string form). If
 * nothing is found in localStorage, network requests are made to all
 * of the URLs in RECIPE_URLs, an array is made from those recipes, that
 * array is saved to localStorage, and then the array is returned.
 * @returns {Array<Object>} An array of recipes found in localStorage
 */
async function getRecipes() {
  // A1. Check local storage to see if there are any recipes.
  const storedRecipes = localStorage.getItem('recipes');
  if (storedRecipes) {
    return JSON.parse(storedRecipes);
  }

  // A2. Create an empty array to hold the recipes that you will fetch
  const recipes = [];

  // A3. Return a new Promise
  return new Promise(async (resolve, reject) => {
    try {
      // A4. Loop through each recipe in the RECIPE_URLS array
      for (const recipeUrl of RECIPE_URLS) {
        // A6. Fetch the URL
        const response = await fetch(recipeUrl);
        // A7. Retrieve the JSON from the response
        const recipe = await response.json();
        // A8. Add the new recipe to the recipes array
        recipes.push(recipe);
      }

      // A9. Check if all recipes have been retrieved
      if (recipes.length === RECIPE_URLS.length) {
        // Save the recipes to storage
        saveRecipesToStorage(recipes);
        // Resolve the Promise with the recipes array
        resolve(recipes);
      }
    } catch (error) {
      // A10. Log any errors
      console.error(error);
      // A11. Reject the Promise with the error
      reject(error);
    }
  });
  console.log("test");
}

/**
 * Takes in an array of recipes, converts it to a string, and then
 * saves that string to 'recipes' in localStorage
 * @param {Array<Object>} recipes An array of recipes
 */
function saveRecipesToStorage(recipes) {
  localStorage.setItem('recipes', JSON.stringify(recipes));
}

/**
 * Takes in an array of recipes and for each recipe creates a
 * new <recipe-card> element, adds the recipe data to that card
 * using element.data = {...}, and then appends that new recipe
 * to <main>
 * @param {Array<Object>} recipes An array of recipes
 */
function addRecipesToDocument(recipes) {
  if (!recipes) return;
  let main = document.querySelector('main');
  recipes.forEach((recipe) => {
    let recipeCard = document.createElement('recipe-card');
    recipeCard.data = recipe;
    main.append(recipeCard);
  });
}
