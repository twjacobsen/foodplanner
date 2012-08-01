'use strict'

angular.module('foodplanner', ['dayServices', 'weekServices', 'recipeServices'])
  .config(['$routeProvider', function($routeProvider){
    $routeProvider
      .when('/week', {templateUrl : 'views/week', controller: WeekCtrl})
      .when('/week/:weekOffset', {templateUrl : 'views/week', controller: WeekCtrl})
      .when('/day/:date', {templateUrl : 'views/day', controller: DayCtrl})
      .otherwise({redirectTo: '/week'});
  }])
