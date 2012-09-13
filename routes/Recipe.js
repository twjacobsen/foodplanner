
/*
 *  REST recipe (CRUD)
 */
 
var ObjectId = require('mongoose').Types.ObjectId;

exports.findByName = function(req, res, cb){
  var query = req.params.query;
  var o = {};

  //Handle both _ids and names as query
  try{
    o._id = new ObjectId(query);
  }catch(ex){
    console.log(ex);
    o.name = new RegExp(query,"i")
  }

  Recipe.find(o, function(err, recipes){
    if(err)
      res.send(500, err);
    else
      if(typeof cb == 'function'){
        cb(recipes);
      }else{
        res.send(recipes);
      }
  });
}

exports.get = function(req, res){
  req.params.query = req.params.name;
  exports.findByName(req, res, function(recipes){
    res.send(recipes[0])
  });
}

exports.list = function(req, res){
  req.params.query = '.*';
  exports.findByName(req, res, null);
}

exports.save = function(req, res){
  var update = function(recipe){
    //Update recipe
    recipe.procedure = req.body.procedure;
    recipe.ingredients = req.body.ingredients;

    recipe.save(function(){
      res.send(recipe);
    });
  }

  //Do update, if _id is provided
  var _id, name, t = req.params.id || req.body._id || req.params.name || req.body.name;
  try{
    _id = new ObjectId(t);
  }catch(ex){
    name = t;
  }

  if(_id){
    Recipe.findById(_id, function(err, recipe){
      update(recipe);
    });
  }else if(name){
    Recipe.findOne({name : name}, function(err, recipe){
      update(recipe);
    });
  }else{
    var recipe = new Recipe({
       name : req.body.name
      ,procedure : req.body.procedure || ''
      ,ingredients : req.body.ingredients || []
    });
    
    recipe.save(function(){
      res.send(recipe);
    });
  }
}

exports.remove = function(req, res){
  Recipe.remove({'_id' : req.params.id || req.body._id}, function(err){
    if(err) res.send(err);
    else res.send(true);
  });
}