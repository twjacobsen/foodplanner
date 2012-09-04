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

angular.module('ingredientServices', ['ngResource'])
  .factory('Ingredient', function($resource){
    return $resource('ingredient/:name', {}, {
    
    });
  });
