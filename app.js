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
  , passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy
  , mongoose = require('mongoose')
  , models = require('./models')
  , db
  , routes = require('./routes')
  , i18next = require('i18next')
  , stylus = require('stylus')
  , nib = require('nib');

var app = module.exports = express.createServer();

/* Configure DB connection (Can connect to both local and nodester DB) */
var generate_mongo_url = function(){
  if(app.settings.env == 'development'){
    obj = {
        "hostname":"localhost",
        "port":27017,
        "username":"",
        "password":"",
        "name":"Foodplanner",
        "db":"Foodplanner"
    }
    return "mongodb://" + obj.username + ":" + obj.password + "@" + obj.hostname + ":" + obj.port + "/" + obj.db;
  }
  else{
    return 'mongodb://nodejitsu:d450356b86ee77be58f7c512fe608891@alex.mongohq.com:10076/nodejitsudb750051738100';
  }
}
var mongourl = generate_mongo_url();
/* Create MongoDB connection */
db = mongoose.connect(mongourl);

/* Configure localization */
i18next.init({
   fallbackLng : 'da'
  ,ns: { namespaces : ['locale.common','locale.plans','locale.recipes','locale.ingredients'], defaultNs : 'locale.common'}
});

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.session({secret : 'very secret passphrase'}));
  app.use(passport.initialize());
  app.use(passport.session());
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


/* Configure Passport authentication */
passport.serializeUser(function(user, done){
  done(null, user._id);
});

passport.deserializeUser(function(id, done){
  User.findById(id, function(err, user){
    done(err, user);
  });
});

passport.use(new LocalStrategy(
    function(username, password, done){
      User.findOne({username : username}, function(err, user){
        if(err) return done(err);
        if(!user) return done(null, false);
        if(!user.verifyPassword(password)) return done(null, false);
        return done(null, user);
      });
    }
  )
);

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

/* User */
app.get('/user/:id', ensureAuthenticated, routes.User.get);
app.post('/login', 
  passport.authenticate('local', { failureRedirect : '/login' }),
  function(req, res){
    res.send(true);
  }
);
app.post('/user', routes.User.save);

/* Week */
app.get('/week', ensureAuthenticated, routes.Plan.getWeek);
app.get('/week/:fromDate?', ensureAuthenticated, routes.Plan.getWeek);

/* Day */
app.get('/day/:date', ensureAuthenticated, routes.Plan.getDay);
app.post('/day', ensureAuthenticated, routes.Plan.save);

/* Recipe */
app.get('/recipe/:name', ensureAuthenticated, routes.Recipe.get);
app.get('/recipes/:query', ensureAuthenticated, function(req, res){ routes.Recipe.findByName(req, res, null); });
app.post('/recipe', ensureAuthenticated, routes.Recipe.save);

/* Ingredient */
app.get('/ingredient/:name', ensureAuthenticated, routes.Ingredient.get);
app.get('/ingredients/:query', ensureAuthenticated, function(req, res){ routes.Ingredient.findByName(req, res, null); });
app.post('/ingredient/:name?', ensureAuthenticated, routes.Ingredient.save);
app.delete('/ingredient/:id?', ensureAuthenticated, routes.Ingredient.remove);

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

function ensureAuthenticated(req, res, next) {
  //Hack to ignore this until implemented fully..
  return next();


  if (req.isAuthenticated()) { return next(); }
  res.send(404, {error: 'User not logged in'});
  return;
}