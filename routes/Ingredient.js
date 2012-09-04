
/*
 *  REST ingredinet (CRUD)
 */
 
exports.findByName = function(req, res, cb){
  Ingredient.find({'name' : { $regex : req.params.query}}, function(err, ingredients){
    console.log('ingredients', ingredients)
    if(typeof cb == 'function')
      cb(err, ingredients);
    else
      if(err)
        console.log(err);
      else
        res.send(ingredients);
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
  req.params.query = req.params.name;
  exports.findByName(req, res, function(err, existing){
    if(err)
      return;
    if(existing){
      res.send(existing);
      return;
    }
    
    var ingredient = new Ingredient({
       name : req.params.name
      ,prodType : req.params.prodType || ''
    });
    
    ingredient.save(function(){
      res.send(ingredient);
    });
  });
}

exports.remove = function(req, res){
  Ingredient.remove({'_id' : req.params._id}, function(err){
    if(err) res.send(err);
    else res.send(true);
  });
}