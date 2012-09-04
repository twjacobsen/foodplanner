
/*
 * GET home page.
 */
 
var Plan = require('./Plan');
var Recipe = require('./Recipe')
var Ingredient = require('./Ingredient')

exports.index = function(req, res){
  res.render('index', {title : 'Foodplanner', currentUser : req.currentUser});
};

exports.Plan = Plan;
exports.Recipe = Recipe;
exports.Ingredient = Ingredient;