'use strict'

angular.module('weekServices', ['ngResource'])
  .factory('Week', function($resource){
    return $resource('week/:fromDate', {}, {
      
    });
  });

angular.module('dayServices', ['ngResource'])
  .factory('Day', function($resource){
    return $resource('day/:date', {}, {
      
    });
  });

angular.module('recipeServices', ['ngResource'])
  .factory('Recipe', function($resource){
    return $resource('recipe/:name', {}, {
    
    });
  });

angular.module('recipesServices', ['ngResource'])
  .factory('Recipes', function($resource){
    return $resource('recipes/:query', {}, {
    
    });
  });

angular.module('ingredientServices', ['ngResource'])
  .factory('Ingredient', function($resource){
    return $resource('ingredient/:name', {}, {
      
    });
  });

angular.module('shoppingListServices', ['ngResource'])
  .factory('ShoppingList', function($resource){
    return $resource('shoppingList/:date', {}, {
      
    });
  });