'use strict'

function WeekCtrl($scope, $routeParams, Week){
  $scope.prevWeekOffset = ($routeParams.fromDate ? new Date($routeParams.fromDate*1).setHours(-7*24) : new Date().setHours(-7*24));
  $scope.nextWeekOffset = ($routeParams.fromDate ? new Date($routeParams.fromDate*1).setHours(7*24) : new Date().setHours(7*24));
  
  $scope.week = Week.query({fromDate : ($routeParams.fromDate || 0)});
}

function DayCtrl($scope, $routeParams, Day, Recipe){
  $scope.date = $routeParams.date;
  $scope.day = Day.query({date: $routeParams.date});

  $scope.getRecipes = function(){
    $('#recipeContainer').show();
    if($scope.day.recipe)
      $scope.recipes = Recipe.query({name : $scope.day.recipe});
    else
      $scope.recipes = [];
  }

  $scope.addRecipe = function(){
    Day.save({day : $scope.date, recipeName : $scope.day.recipe});
  }
}

function RecipeCtrl($scope, $routeParams, Recipe, Ingredient){
  $scope.recipe = Recipe.get({name : $routeParams.recipe}, function(){
    if(!$scope.recipe.recipeName || $scope.recipe.recipeName.length == 0){
      $scope.recipe.recipeName = $routeParams.recipe;
      $scope.recipe.recipeState = 'Edit';
    }else{
      $scope.recipe.recipeState = 'New';
    }
  });

  $scope.recipe.newIngredient = {};
  $scope.recipe.newIngredient.name;
  $scope.recipe.newIngredient.amount;
  $scope.recipe.newIngredient.amountUnit;

  $scope.addIngredient = function(){
    Ingredient.save({name : $scope.recipe.newIngredient.name});
    $scope.recipe.ingredients.push({
         name : $scope.recipe.newIngredient.name
        ,amount : $scope.recipe.newIngredient.amount
        ,amountUnit : $scope.recipe.newIngredient.amountUnit
      });
  }

  $scope.saveRecipe = function(){
    $scope.recipe.$save();
  }
}

function RecipeListCtrl($scope, $routeParams, Recipe){

}

function IngredientCtrl($scope, $routeParams, Ingredient){

}