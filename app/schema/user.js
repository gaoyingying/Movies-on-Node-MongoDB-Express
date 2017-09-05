var mongoose =require('mongoose')
var bcrypt=require('bcrypt-nodejs')//用于加密
var SALT_WORK_FACTOR = 10
var UserSchema = new mongoose.Schema({
    name:{
        unique:true,
        type:String
    },
    password:{
        unique:true,
        type:String
    },
    role:{
        type:Number,
        default:0
    },
    meta:{
        createAt:{
            type:Date,
            default:Date.now()
        },
        updateAt:{
            type:Date,
            default:Date.now()
        }
    }

});
 UserSchema.pre('save',function(next){
     var user=this
    //每次存取数据就会调用这个方法
    if(this.isNew){
        this.meta.createAt=this.meta.updateAt=Date.now()
    }
    else{
        this.meta.updateAt=Date.now()
    }
    bcrypt.genSalt(SALT_WORK_FACTOR,function(err,salt){
        if(err){
           return next(err)
        }
        bcrypt.hash(user.password,salt,null,function(err,hash){
            if(err){
                return next(err)
            }
            user.password=hash
            next()
        })
    })
});
UserSchema.methods={
    comparePassword:function(_password,cb){
        bcrypt.compare(_password,this.password,function(err,isMatch){
            if(err){
                return cb(err)
            }
            cb(null,isMatch)
        })
    }
}
UserSchema.statics = {
    fetch: function(cb) {
        return this
          .find({})
          .sort('meta.updateAt')
          .exec(cb)
    }
}
//静态方法不会与数据库直接进行交互，只有经过实例来调用
module.exports =UserSchema