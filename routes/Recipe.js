
/*
 *  REST recipe (CRUD)
 */
 
exports.findByName = function(req, res){
  Recipe.find({'name' : { $regex : req.params.query}}, function(err, recipes){
    if(err){
      return;
    }
    res.send(recipes);
  });
}

exports.get = function(req, res){
  req.params.query = req.params.name;
  exports.findByName(req, res);
}

exports.list = function(req, res){
  req.params.query = '.*';
  exports.findByName(req, res);
}

exports.save = function(req, res){
  //Do update, if _id is provided
  if(req.params._id){
    Recipe.findById(req.params._id, function(err, recipe){
      //Update recipe
      
      recipe.save(function(){
        res.send(recipe);
      });
    });
  }else{
    var recipe = new Recipe({
       name : req.params.name
      ,procedure : req.params.procedure || ''
      ,ingredients : req.params.ingredients || []
    });
    
    recipe.save(function(){
      res.send(recipe);
    });
  }
}

exports.remove = function(req, res){
  Recipe.remove({'_id' : req.params._id}, function(err){
    if(err) res.send(err);
    else res.send(true);
  });
}