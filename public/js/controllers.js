'use strict'

function WeekCtrl($scope, $routeParams, $location, Week, Recipe){
  $scope.prevWeekOffset = ($routeParams.fromDate ? new Date($routeParams.fromDate*1).setHours(-7*24) : new Date().setHours(-7*24));
  $scope.nextWeekOffset = ($routeParams.fromDate ? new Date($routeParams.fromDate*1).setHours(7*24) : new Date().setHours(7*24));

  $scope.dialog = {
     visible: false
    ,recipe: {
      ingredients: []
    }
  }
  
  $scope.week = Week.query({fromDate : ($routeParams.fromDate || 0)}, function(a,b,c){
    for(var i = $scope.week.length; i--;){
      var w = $scope.week[i];
      //If the recipe name is more than 20 chars, shorten it!
      if(w.recipeName.length > 20)
        w.shortRecipeName = w.recipeName.substr(0,17) + '...';
      else
        w.shortRecipeName = w.recipeName;

      $scope.week[i] = w;
    }
  });

  $scope.showRecipe = function(day){
    $scope.dialog.recipe = Recipe.get({name : day.recipe}, function(){ 
      $scope.dialog.hasRecipeData = $scope.dialog.recipe.procedure ||
                                   ($scope.dialog.recipe.ingredients && $scope.dialog.recipe.ingredients.length > 0);
    });
  }

  $scope.editRecipe = function(recipe){
    $location.path('/recipe/'+recipe.name).search({returnTo : '/week/'+$routeParams.fromDate});
  }
}

function DayCtrl($scope, $routeParams, $location, Day, Recipe, Recipes){
  $scope.date = $routeParams.date;
  $scope.day = Day.query({date: $routeParams.date});

  $scope.hiddenContainer = true;
  $scope.getRecipes = function(){
    $scope.hiddenContainer = false;
    if($scope.day.recipe){
      $scope.recipes = Recipes.query({query : $scope.day.recipe}, function(){
        var o = $scope.recipes.filter(function(e){
          return e.name == $scope.day.recipe;
        });
        if(o.length == 0)
          $scope.noExactMatch = true
        else
          $scope.noExactMatch = false
      });
    }else{
      $scope.recipes = [];
      $scope.noExactMatch = true
    }
  }

  $scope.newRecipe = function(name){
    Recipe.save({name : name}, function(newRecipe){
      Day.save({day : $scope.date, recipeName : newRecipe.name, recipe : newRecipe._id}, function(){
        $location.path('/recipe/'+name).search({ returnTo : '/week/'+$scope.date });
      });
    });
  }

  $scope.addRecipe = function(recipe){
    var onSaved = function(){
      $location.path('/week/'+$scope.date).search('returnTo', null);
    }
    if(!recipe){
      Day.save({day : $scope.date, recipeName : $scope.day.recipe}, onSaved);
    }else{
      Day.save({day : $scope.date, recipeName : recipe.name, recipe : recipe._id}, onSaved);
    }
  }
}

function RecipeCtrl($scope, $routeParams, $location, Recipe, Ingredient){
  $scope.recipe = Recipe.get({name : $routeParams.recipe}, function(){
    if(!$scope.recipe.name || $scope.recipe.name.length == 0){
      $scope.recipe.name = $routeParams.recipe;
      $scope.recipeState = 'New';
    }else{
      $scope.recipeState = 'Edit';
    }
    $scope.recipe.ingredients = $scope.recipe.ingredients || [];
  });

  $scope.newIngredient = {};

  $scope.addIngredient = function(){
    var ingredient = new Ingredient({name : $scope.newIngredient.name});
    ingredient.$save();
    $scope.recipe.ingredients.push({
       ingredient : ingredient
      ,amount : $scope.newIngredient.amount
      ,amountUnit : $scope.newIngredient.amountUnit
    });
    $scope.newIngredient = {};
  }

  $scope.removeIngredient = function(id){
    for(var i = $scope.recipe.ingredients.length; --i;){
      var ing = $scope.recipe.ingredients[i];
      if(ing.ingredient._id == id){
        $scope.recipe.ingredients.splice(i,1);
        return;
      }
    }
  }

  $scope.saveRecipe = function(){
    $scope.recipe.$save(function(){
      $location.path($routeParams.returnTo).search('returnTo', null);
    });
  }
}

function RecipeListCtrl($scope, $routeParams, Recipe){

}

function IngredientCtrl($scope, $routeParams, Ingredient){

}

function ShoppingListCtrl($scope, $routeParams, ShoppingList){
  
}