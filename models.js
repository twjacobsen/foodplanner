var  User
    ,Plan
    ,ShoppingList
    ,Recipe
    ,Ingredient;

function defineModels(mongoose, cb){
  var  Schema = mongoose.Schema
      ,ObjectId = Schema.ObjectId
      ,crypto = require('crypto');
  
  /**
   *  Schemas
   */
  User = new Schema({
      username : {type : String, unique : true}
     ,password : {type : String, set : function(password){
          this.salt = this.makeSalt();
          this.hashed_password = this.encryptPassword(password);
        }
      }
     ,email : {type : String, unique : true}
     ,firstName: String
     ,lastName: String
  });

  Plan = new Schema({
      date : Number
     ,recipeName : String
     ,recipe : {type : ObjectId, ref: 'Recipe'}
     ,userID : { type: ObjectId, ref: "User"}
  });

  ShoppingList = new Schema({
      name : {type : String, set : capitalize}
     ,userID : { type: ObjectId, ref: "User"}
     ,items : [{
         ingredient : Ingredient
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
         ,ingredient : Ingredient
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

  User.methods.makeSalt = function(){
    return Math.round((new Date().valueOf() * Math.random())) + 'very secret string';
  }

  User.methods.encryptPassword = function(password){
    return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
  }

  User.methods.verifyPassword = function(password){
    return this.encryptPassword(password) === this.hashed_password;
  }
  
  mongoose.model('User', User);
  mongoose.model('Plan', Plan);
  mongoose.model('ShoppingList', ShoppingList);
  mongoose.model('Recipe', Recipe);
  mongoose.model('Ingredient', Ingredient);
  
  cb();
}

exports.defineModels = defineModels;
