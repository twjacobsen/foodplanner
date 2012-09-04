/*
 * Extensions
 */
capitalize = function(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
 
String.prototype.capitalize = function(){ return capitalize(this); };

/**
 * Module dependencies.
 */

var express = require('express')
  , mongoose = require('mongoose')
  , models = require('./models')
  , db
  , routes = require('./routes')
  , i18next = require('i18next')
  , stylus = require('stylus')
  , nib = require('nib');

var app = module.exports = express.createServer();

// Configuration

/* Configure MongoDB to work both locally and using AppFog */
var mongoCfg;
if(process.env.VCAP_SERVICES){
    var env = JSON.parse(process.env.VCAP_SERVICES);
    mongoCfg = env['mongodb-1.8'][0]['credentials'];
}
else{
    mongoCfg = {
        "hostname":"localhost",
        "port":27017,
        "username":"",
        "password":"",
        "name":"Foodplanner",
        "db":"Foodplanner"
    }
}
var generate_mongo_url = function(obj){
    obj.hostname = (obj.hostname || 'localhost');
    obj.port = (obj.port || 27017);
    obj.db = (obj.db || 'test');
    if(obj.username && obj.password){
        return "mongodb://" + obj.username + ":" + obj.password + "@" + obj.hostname + ":" + obj.port + "/" + obj.db;
    }
    else{
        return "mongodb://" + obj.hostname + ":" + obj.port + "/" + obj.db;
    }
}
var mongourl = generate_mongo_url(mongoCfg);
/* Create MongoDB connection */
db = mongoose.connect('mongodb://nodejitsu:d450356b86ee77be58f7c512fe608891@alex.mongohq.com:10076/nodejitsudb750051738100');

/* Configure localization */
i18next.init({
   fallbackLng : 'da'
  ,ns: { namespaces : ['locale.common','locale.plans','locale.recipes','locale.ingredients'], defaultNs : 'locale.common'}
});

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(i18next.handle);
  app.use(stylus.middleware({
     src: __dirname + '/views'
    ,dest: __dirname + '/public'
    ,compile: function(str, path){
      return stylus(str)
        .set('filename', path)
        .set('compress', true)
        .use(nib())
        .import('nib');
    }
  }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.logger());
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.logger());
  app.use(express.errorHandler());
});


models.defineModels(mongoose, function(){
  app.User = User = mongoose.model('User');
  app.Plan = Plan = mongoose.model('Plan');
  app.ShoppingList = ShoppingList = mongoose.model('ShoppingList');
  app.Recipe = Recipe = mongoose.model('Recipe');
  app.Ingredient = Ingredient = mongoose.model('Ingredient');
});

// Routes
app.get('/', routes.index);
// Get views and partials
app.get('/views/:view', function(req, res){
  res.render(req.params.view, {title : 'Foodplanner', currentUser : req.currentUser});
});
app.get('/views/partials/:view', function(req, res){
  res.render(req.params.view, {title : 'Foodplanner', currentUser : req.currentUser});
});

//Get localizations
app.get('/locales/:lang/:namespace.json', function(req, res){
  var json = require(__dirname + '/locales/' + req.params.lang + '/' + req.params.namespace + '.json');
  res.send(json);
});

/* Week */
app.get('/week', routes.Plan.getWeek);
app.get('/week/:fromDate?', routes.Plan.getWeek);

/* Day */
app.get('/day/:date', routes.Plan.getDay);
app.post('/day', routes.Plan.updateDay);

/* Recipe */
app.get('/recipe/:name', routes.Recipe.get);
app.get('/recipes/:query', routes.Recipe.findByName);
app.post('/recipe', routes.Recipe.save);

/* Ingredient */
app.get('/ingredient/:name', routes.Ingredient.get);
app.get('/ingredients/:query', routes.Ingredient.findByName);
app.post('/ingredient', routes.Ingredient.save);

// Helpers
i18next.registerAppHelper(app);

if(app.settings.env == 'development')
  app.listen(8080, "0.0.0.0", function(){
    console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);  
  });
else
  app.listen(8080, "0.0.0.0", function(){
    console.log("Started in production mode!");
  });