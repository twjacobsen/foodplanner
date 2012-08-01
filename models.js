var  User
    ,Plan
    ,ShoppingList
    ,ShoppingListItem
    ,Recipe
    ,Ingredient;

function defineModels(mongoose, cb){
  var  Schema = mongoose.Schema
      ,ObjectId = Schema.ObjectId
  
  User = new Schema({
      userName : {type : String, unique : true}
     ,password : String
     ,email : {type : String, unique : true}
  });

  Plan = new Schema({
      date : Date
     ,recipe : ObjectId
     ,userID : ObjectId
  });
  
  ShoppingListItem = new Schema({
      listID : ObjectId
     ,ingredient : [Ingredient]
     ,count : Number
  });

  ShoppingList = new Schema({
      name : String
     ,userID : ObjectId
     /* Embedded documents solution */
     /*,items : [ShoppingListItem]*/
     /* No embedded documents solution */
     ,items : [{
         ingredient : [Ingredient]
        ,count : Number
     }]
  });
  
  ShoppingList.methods.addItem = function addItem(newItem, cb){
    var __self = this;
    var _id = __self._id;
    /**
     *  Embedded documents solution (Need to both maintain the embedded document source PLUS manually update the actual embedded document)
     **/
    /*ShoppingListItem.findOne({'listID' : _id, 'ingredient.name' : newItem.ingredient.name}, function(err, item){
      if(!item){
        var item = new ShoppingListItem({
           listID : _id
          ,ingredient : [newItem.ingredient]
          ,count : newItem.count
        });
        item.save(function(err, saved){
          __self.items.push(saved);
          __self.save(cb);
        });
      }else{
        item.count += newItem.count;
        item.save(function(err, saved){
          for(var i = 0; i < __self.items.length; ++i){
            if(__self.items[i]._id.equals(saved._id)){
              __self.items[i] = saved;
            }
          }
          __self.markModified('items');
          __self.save(cb);
        });
      }
    });*/
    
    /**
     * No embedded documents solution (Only need to maintain the internal objects)
     **/
   
    var existing = __self.items.filter(function(item){ return item.ingredient.name == newItem.ingredient.name;});
    if(existing.length > 0){
      existing[0].count += newItem.count;
    }else{
      __self.items.push(newItem)
    }
    __self.markModified('items');
    __self.save(cb);
  }
  
  ShoppingList.methods.removeItem = function removeItem(item, cb){
    var __self = this;
    var _id = __self._id;
    
    var  index = -1
        ,existing = __self.items.filter(function(_item, _index){ if(item.ingredient.name == _item.ingredient.name){ index = _index; return true;}});
    if(index != -1)
      __self.items.splice(index, 1);
      
    __self.markModified('items');
    __self.save(cb);
  }
  
  /*ShoppingList.pre('remove', function(next){
    ShoppingListItem.remove({'listID' : this._id});
  });*/

  Recipe = new Schema({
      name : { type : String , unique : true, set : capitalize }
     ,userID : ObjectId
     ,dateCreated : Date
     ,dateAltered : { type : Date, default : Date.now }
     ,ingredients : [{
          amount : Number
         ,ingredient : [Ingredient]
     }]
  });

  Ingredient = new Schema({
      name : { type : String, set : capitalize}
     ,prodType : String
  });
  
  mongoose.model('User', User);
  mongoose.model('Plan', Plan);
  mongoose.model('ShoppingList', ShoppingList);
  //ShoppingListItem = mongoose.model('ShoppingListItem', ShoppingListItem);
  mongoose.model('Recipe', Recipe);
  mongoose.model('Ingredient', Ingredient);
  
  cb();
}

exports.defineModels = defineModels;
