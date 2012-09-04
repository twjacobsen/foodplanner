var  User
    ,Plan
    ,ShoppingList
    ,Recipe
    ,Ingredient;

function defineModels(mongoose, cb){
  var  Schema = mongoose.Schema
      ,ObjectId = Schema.ObjectId
  
  /**
   *  Schemas
   */
  User = new Schema({
      userName : {type : String, unique : true}
     ,password : String
     ,email : {type : String, unique : true}
  });

  Plan = new Schema({
      date : Date
     ,recipeName : String
     ,recipe : {type : ObjectId, ref: 'Recipe'}
     ,userID : { type: ObjectId, ref: "User"}
  });

  ShoppingList = new Schema({
      name : {type : String, set : capitalize}
     ,userID : { type: ObjectId, ref: "User"}
     ,items : [{
         ingredient : [Ingredient]
        ,count : Number
     }]
  });
  
  Recipe = new Schema({
      name : { type : String , unique : true, set : capitalize }
     ,userID : { type: ObjectId, ref: "User"}
     ,dateCreated : { type : Date, default : Date.now }
     ,dateAltered : { type : Date, default : Date.now }
     ,procedure : String
     ,ingredients : [{
          amount : Number
         ,amountUnit : String
         ,ingredient : [Ingredient]
     }]
  });

  Ingredient = new Schema({
      name : { type : String, unique : true, set : capitalize}
     ,prodType : String
  });
  
  /**
   *  Middleware
   **/
   
  Recipe.pre('save', function(next){
    this.dateAltered = Date.now();
    next();
  });
  
  /**
   *  Schema methods
   **/
  
  mongoose.model('User', User);
  mongoose.model('Plan', Plan);
  mongoose.model('ShoppingList', ShoppingList);
  mongoose.model('Recipe', Recipe);
  mongoose.model('Ingredient', Ingredient);
  
  cb();
}

exports.defineModels = defineModels;
