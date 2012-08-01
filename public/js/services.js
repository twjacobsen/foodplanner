'use strict'

angular.module('weekServices', ['ngResource'])
  .factory('Week', function($resource){
    return $resource('week/:weekOffset', {weekOffset : 0}, {
      
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
