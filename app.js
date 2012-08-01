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
  , db = mongoose.connect('mongodb://localhost/Foodplanner')
  , models = require('./models')
  , routes = require('./routes')
  , i18next = require('i18next');

var app = module.exports = express.createServer();

// Configuration

i18next.init({
   fallbackLng : 'en-US'
  ,ns: { namespaces : ['locale.common','locale.plans','locale.recipes','locale.ingredients'], defaultNs : 'locale.common'}
});

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(i18next.handle);
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
  app.enable('less');
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
app.get('/week/:weekOffset?', routes.Plan.getWeek);

/* Day */
app.get('/day/:date', routes.Plan.getDay)

/* Recipe */
app.get('/recipe/:name', routes.Recipe.get)
app.get('/recipes/:query', routes.Recipe.findByName)

// Helpers
i18next.registerAppHelper(app);

app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);  
});
