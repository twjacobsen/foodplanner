
/*
 *  REST Plan (CRUD)
 */
 
exports.getDay = function(req, res){
  console.log(req.params.date)
  Plan.find({'date' : req.params.date}, function(err, plan){
    console.log('day', plan)
    res.send(plan);
  });
}

exports.getWeek = function(req, res){
  var weekOffs = req.params.weekOffset || 0;
  
  var  monday
      ,sunday
      ,offs = (new Date().getDay()+6) % 7;
    
  monday = new Date().setHours(-offs*24);
  if(weekOffs){
    weekOffs = 7*weekOffs;
    monday = new Date(monday).setHours(weekOffs*24);
  }
  sunday = new Date(monday).setHours(6*24);
  
  var _plans = [];
  
  for(var i = 0; i < 7; ++i){
    var plan = {
           day : i
          ,localDay : req.i18n.t('days.'+i).capitalize() 
          ,date : new Date(new Date(monday).setHours(i*24)).setHours(1,0,0,0)
          ,meal : ''
        }
    _plans.push(plan);
  }
  Plan
    .where('date').gte(new Date(monday).setHours(0,0,0,0))
    .where('date').lte(new Date(sunday).setHours(23,59,59,0))
    .run(function(err, plans){
      for(var i = 0; i < plans.length; ++i){
        var day = (new Date(plans[i].date).getDay()+6) % 7;
        plans[i].day = _plans[day].day;
        _plans[day] = plans[i];
      }
      res.send(_plans);
    });
}

exports.create = function(req, res){
  var  date = new Date(req.body.date*1).setHours(1,0,0,0)
      ,meal = req.body.meal
      ,day = (new Date(date).getDay() + 6) % 7;

  var plan = new Plan({
     date : date
    ,day : day
    ,meal : meal
  });
  plan.save(function(){
    res.send(plan);
  });
}

exports.update = function(req, res){
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
  Plan.findById(req.params.id, function(err, plan){
    delete plan.meal;
    plan.save(function(){
      res.send(plan);
    });
  });
}
