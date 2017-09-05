var User=require('../model/user.js')
//用户登录
exports.signin=function(req,res){
  var _user=req.body.user
  var name=_user.name
  var password=_user.password
  User.findOne({name:name},function(err,user){
    if(err){
      console.log(err)
    }
    if(!user){
      console.log("user is not matched")
      return res.redirect('/')//阻止程序继续执行下去
    }
    user.comparePassword(password,function(err,isMatch){
      if(err){
        console.log(err)
      }
      if(isMatch){
        req.session.user=user
        return res.redirect('/')
      }
      else {
        console.log("password is not matched")
        return res.redirect('/')
      }
    })
  })
}
exports.logout=function(req,res){
  delete res.locals.user
  delete req.session.user
  res.redirect('/')
}

exports.signup=function(req,res){
  var userObj=req.body.user
  var name=userObj.name
  var password=userObj.password
  var _user
  User.findOne({name:name},function(err,user){
    if(err){
      console.log(err)
    }
    if(!user){
      _user=new User({
        name:name,
        password:password
      })
      _user.save(function(err,user){
        if(err){
          console.log(err);
        }
        console.log("注册成功！")
        res.redirect('/');//重定向
      })  
    }  
    else{
        res.redirect('/')
    }
  })
}
exports.Showsignup=function(req,res){
    res.render('signup', {
    title: '用户注册'
  })

}
//用户列表
exports.list=function(req,res){
  User.fetch(function(err,users){
    if(err){
      console.log(err);
    }
    res.render('userlist', {
    title: '用户列表',
    users:users
  })
  
  });
}
//用户删除
exports.delete=function(req,res){
  var _name=req.query.name;
  if(_name){
    User.remove({name:_name},function(err,user){
      if(err){
        console.log(err);
      }
      else{
        res.json({success:1});
      }
    })
  }
};
exports.isSigned=function(req,res,next){
  var _user=req.session.user
  if(_user){
  User.findOne({name:_user.name},function(err,user){
    if(err){
      console.log(err)
    }
    next()
  })
  }
else{
  return res.redirect('/signup')
}
}
exports.isAdmin=function(req,res,next){
  var _user=req.session.user
  var name=_user.name
  User.findOne({name:name},function(err,user){
    if(err){
      console.log(err)
    }
    if(user.role<10){
      return res.redirect('/')
    }
    next()
  })
}
