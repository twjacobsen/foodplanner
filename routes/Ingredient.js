
/*
 *  REST ingredinet (CRUD)
 */

var ObjectId = require('mongoose').Types.ObjectId;

var findByName = function(req, res, cb){
  var query = new RegExp(req.params.query, "i");
  Ingredient.find({'name' : query}, function(err, ingredients){
    if(err)
      res.send(500, err);
    else
      if(typeof cb == 'function'){
        cb(ingredients);
      }else{
        res.send(ingredients);
      }
  });
}
 
exports.findByName = findByName;

exports.get = function(req, res){
  req.params.query = req.params.name;
  findByName(req, res, function(ingredients){
    res.send(ingredients[0]);
  });
}

exports.list = function(req, res){
  req.params.query = '.*';
  findByName(req, res, null);
}

exports.save = function(req, res){
  var name = req.params.name || req.body.name;
  req.params.query = '^'+ name + '$';
  findByName(req, res, function(existing){
    console.log('foundArgs', arguments);
    if(existing.length > 1){
      res.send(500, 'How can there be more than 1 existing?');
      return;
    }
    if(existing && existing.length > 0){
      res.send(existing[0]);
      return;
    }

    var ingredient = new Ingredient({
       name : name
      ,prodType : req.body.prodType || ''
    });

    ingredient.save(function(){
      console.log('saved', ingredient);
      res.send(ingredient);
    });
  });
}

exports.remove = function(req, res){
  var id = req.params.id || req.body.id;
  try{
    id = mongoose.Types.ObjectId(id);
  }catch(ex){
    res.send(500, { error: 'Invalid id provided: ' + id});
    return;
  }

  Ingredient.remove({'_id' : id}, function(err){
    if(err) res.send(500, {error: err});
    else res.send(true);
  });
}