var Category=require('../model/category.js')
 
// 后台录入页
exports.new=function(req, res){
  res.render('category_admin', {
    title:'后台分类录入页',
    category:{}
})
}
//后台录入的数据
exports.save=function(req,res){
  var category=req.body.category;
    var _category=new Category(category);
     _category.save(function(err,movie){
        if(err){
          console.log(err);
        }
        res.redirect('/admin/categorylist');
      })
  
}
// 列表页
exports.list=function(req,res){
  Category.fetch(function(err,categories){
    if(err){
      console.log(err);
    }
    res.render('categorylist', {
    categories:categories
  })
  
  });
}
exports.delete=function(req,res){
  var _name=req.query.name;
  if(_name){
    Category.remove({name:_name},function(err,category){
      if(err){
        console.log(err);
      }
      else{
        res.json({success:1});
      }
    })
  }
}