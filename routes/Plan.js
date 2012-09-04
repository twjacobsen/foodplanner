
/*
 *  REST Plan (CRUD)
 */
 
exports.getDay = function(req, res){
  Plan.find({'date' : req.params.date}, function(err, plan){
    res.send(plan);
  });
}

exports.getWeek = function(req, res){
  var fromDate = (req.params.fromDate ? new Date(req.params.fromDate*1) : new Date());
  
  var  monday
      ,sunday
      ,offs = (fromDate.getDay()+6) % 7;
    
  monday = fromDate.setHours(-offs*24);
  sunday = new Date(monday).setHours(6*24);
  
  var _plans = [];
  
  for(var i = 0; i < 7; ++i){
    var plan = {
           day : i
          ,localDay : req.i18n.t('days.'+i).capitalize() 
          ,date : new Date(new Date(monday).setHours(i*24)).setHours(1,0,0,0)
          ,recipeName : ''
        }
    _plans.push(plan);
  }
  Plan
    .where('date').gte(new Date(monday).setHours(0,0,0,0))
    .where('date').lte(new Date(sunday).setHours(23,59,59,0))
    .run(function(err, plans){
      if(plans && plans.length > 0){
        for(var i = 0; i < plans.length; ++i){
          var day = (new Date(plans[i].date).getDay()+6) % 7;
          plans[i].day = _plans[day].day;
          _plans[day] = plans[i];
        }
      }
      res.send(_plans);
    });
}

exports.create = function(req, res){
  var  date = new Date(req.body.date*1).setHours(1,0,0,0)
      ,recipeName = req.body.recipeName
      ,recipeId = req.body.recipeId;

  var plan = new Plan({
     date : date
    ,recipeName : recipeName
    ,recipe : recipeId
  });
  
  plan.save(function(){
    res.send(plan);
  });
}

exports.save = function(req, res){
  Plan.findById(req.params.id, function(err, plan){
    if(!plan){
      exports.create(req, res);
      return;
    }
    plan.meal = req.body.meal;
    plan.save(function(){
      res.send(plan);
    });
  });
}
/*
 *  We do not DELETE plans, just remove the .meal-property
 */
exports.remove = function(req, res){
  Plan.remove({ '_id' : req.params.id}, function(err, plan){
    if(err) res.send(err);
    else res.send(true);
  });
}
