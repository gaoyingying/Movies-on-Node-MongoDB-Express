var mongoose =require('mongoose')
var Schema=mongoose.Schema
var ObjectId=Schema.Types.ObjectId
var CommentSchema = new Schema({
    movie:{type:ObjectId,ref:'Movie'},
    from:{type:ObjectId,ref:'User'},
    to:{type:ObjectId,ref:'User'},
    reply:[{
            from:{type:ObjectId,ref:'User'},
            to:{type:ObjectId,ref:'User'},
            content:String,
    }],//子评论
    content:String,
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

})
CommentSchema.pre('save',function(next){
    //每次存取数据就会调用这个方法
    if(this.isNew){
        this.meta.createAt=this.meta.updateAt=Date.now()
    }
    else{
        this.meta.updateAt=Date.now()
    }
    next();//执行next 使操作继续 
})
CommentSchema.statics = {
    fetch: function(cb) {
        return this
          .find({})
          .sort('meta.updateAt')
          .exec(cb)
    },
    findById: function(id, cb) {
        return this
          .findOne({_id: id})
          .exec(cb)
    }
}
//静态方法不会与数据库直接进行交互，只有经过实例来调用
module.exports=CommentSchema