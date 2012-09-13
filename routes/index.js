
/*
 * GET home page.
 */

var ObjectId = require('mongoose').Types.ObjectId;
var Plan = require('./Plan');
var Recipe = require('./Recipe')
var Ingredient = require('./Ingredient')
var User = require('./User')

exports.index = function(req, res){
  res.render('index', {title : 'Foodplanner', currentUser : req.currentUser});
};

exports.User = User;
exports.Plan = Plan;
exports.Recipe = Recipe;
exports.Ingredient = Ingredient;