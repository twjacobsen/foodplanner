var User = new Schema({
     userName : String
    ,password : String
    ,email : String
});

var Plan = new Schema({
     date : Date
    ,meal : String
    ,userID : ObjectId
});

var ShoppingList = new Schema({
     name : String
    ,userID : ObjectId
    ,items : [ShoppingListItem]
});

var ShoppingListItem = new Schema({
     listID : ObjectId
    ,ingredient : Ingredient
    ,count : Number
});

var Recipe = new Schema({
     name : { type : String , unique : true }
    ,userID : ObjectId
    ,dateCreated : Date
    ,dateAltered : { type : Date, default : Date.now }
    ,ingredients : [{
    	 amount : Number
    	,ingredient : [Ingredients]
    }]
});

var Ingredient = new Schema({
     name : { type : String, unique : true}
    ,prodType : String
});
