'use strict'

angular.module('foodplanner', ['dayServices', 'weekServices', 'recipeServices', 'ingredientServices'])
  .config(['$routeProvider', function($routeProvider){
    $routeProvider
      .when('/week', {templateUrl : 'views/week', controller: WeekCtrl})
      .when('/week/:fromDate', {templateUrl : 'views/week', controller: WeekCtrl})
      .when('/day/:date', {templateUrl : 'views/day', controller: DayCtrl})
      .when('/recipe/:recipe', {templateUrl : 'views/recipe', controller : RecipeCtrl})
      .when('/recipes', {templateUrl: 'views/recipes', controller: RecipeListCtrl})
      .otherwise({redirectTo: '/week'});
  }])
