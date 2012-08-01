'use strict'

function WeekCtrl($scope, $routeParams, Week){
  $scope.prevWeekOffset = ($routeParams.weekOffset ? $routeParams.weekOffset*1-1 : -1);
  $scope.nextWeekOffset = ($routeParams.weekOffset ? $routeParams.weekOffset*1+1 : 1);
  
  $scope.week = Week.query({weekOffset : ($routeParams.weekOffset || 0)});
}

function DayCtrl($scope, $routeParams, Day, Recipe){
  $scope.date = $routeParams.date;
  $scope.day = Day.query({date: $routeParams.date});
  
  $scope.getRecipes = function(){
    $('#recipeContainer').show();
    if($scope.day.recipe)
      $scope.recipes = Recipe.query({name : $scope.day.recipe});
    else
      $scope.recipes = null;
  }
}

function RecipeCtrl($scope, $routerParms, Recipe){
  
}
