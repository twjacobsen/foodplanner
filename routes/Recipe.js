
/*
 *  REST recipe (CRUD)
 */
 
exports.findByName = function(req, res){
  Recipe.find({'name' : { $regex : req.params.query}}, function(err, recipes){
    if(err || recipes.length == 0){
      res.send([{name : 'Test1'},{name : 'Test2'}]);
      return;
    }
    res.send(recipes);
  });
}

exports.get = function(req, res){
  req.params.query = req.params.name;
  exports.findByName(req, res);
}
