var Movie=require('../model/movie.js')
var Comment=require('../model/comment.js')
var Category=require('../model/category.js')
var _=require('underscore')
var fs=require('fs')
var path=require('path')
// 详情页
exports.detail= function(req, res){
  //通过req.params.id 得到路径里面的id号
  var id=req.params.id;
  Movie.findById(id,function(err,movie){
    Movie.update({_id:id},{$inc:{pv:1}},function(err){
      if(err){
        console.log(err)
      }
    })
    Comment
      .find({movie:id})
      .populate('from','name')
      .populate('reply.from reply.to','name')
      .exec(function(err,comments){
    res.render('detail', {//render 表示把数据填充到模板
    title: '电影详情',
    movie: movie,
    comments:comments
    })
      })
  })
}
 
// 后台录入页
exports.save=function(req, res){
  Category.find({},function(err,categories){
  res.render('admin', {
    title: '电影录入',
    categories:categories,
    movie:{}
  });
    })
}
//更新电影
exports.update=function(req,res){
  var id=req.params.id;
  if(id){
    Movie.findById(id,function(err,movie){
       Category.find({},function(err,categories){
          res.render('admin',{
            title:'后台更新页',
            movie:movie,
            categories:categories
      })
    })
    })
  }
}
exports.savePoster=function(req,res,next){
  var posterData=req.files.uploadPoster
  var filePath=posterData.path
  var originalFilename=posterData.originalFilename

  if(originalFilename){//有图片传入
    fs.readFile(filePath,function(err,data){
        var timestamp=Date.now()
        var type=posterData.type.split('/')[1]//类型后缀
        var poster=timestamp+'.'+type
        var newPath=path.join(__dirname,'../../','/public/upload/'+poster)
        //从当前路径__dirname  往上走两级 ，加入/pulic/upload 文件夹中
        fs.writeFile(newPath,data,function(err){
          if(err)
            console.log(err)
        })
        req.poster=poster
        next()
      })

  }
    else{
      next()
    }
}
//后台录入的数据
exports.new=function(req,res){
  var id=req.body.movie._id;
  var movieObj=req.body.movie;
  var oldCategory=movieObj.category
  var categoryName=movieObj.categoryName
  var _movie;
  if(req.poster){
    movieObj.poster='/upload/'+req.poster
  }
  if(id){
    Movie.findById(id,function(err,movie){
      if(err){
        console.log(err);
      }
      _movie=_.extend(movie,movieObj);
      //_.extend(old,new)新对象对应字段替换老对象对应字段
      if(categoryName){
        var _category=new Category({
          name:categoryName,
          movies:[_movie._id]
        })
        _category.save()//保存新分类
        _movie.category=_category._id
        Category.findById(oldCategory,function(err,category){
          if(err){
            console.log(err)
          }
          category.movies.forEach(function(movie,index) {
            if(movie==id){
              category.movies.splice(index,1)//删除旧分类里的电影
              category.save()
            } 
          });

        })
      }
      _movie.save(function(err,movie){
        if(err){
          console.log(err);
        }
        res.redirect('/movie/'+movie._id);//重定向
      })//movie是保存的movie
    })
   
  }
  else{
    //id不存在表示新添加的movie
    _movie=new Movie(movieObj);
    var categoryId=_movie.category
    
     _movie.save(function(err,movie){
        if(err){
          console.log(err);
        }
        if(categoryId){
        Category.findById(categoryId,function(err,category){
          category.movies.push(movie._id)
          category.save(function(err,category){
            if(err){
              console.log(err)
            }
          })
        })
        }
      else if(categoryName){
         var _category=new Category({
          name:categoryName,
          movies:[_movie._id]
        })
        _category.save(function(err,category){
           _movie.category=_category._id
           _movie.save()
        })
      }
      
      if(categoryName && categoryId){
         var _category=new Category({
          name:categoryName,
          movies:[_movie._id]
        })
        _category.save(function(err,category){
           _movie.category=_category._id
           _movie.save()
        })
      }
       res.redirect('/movie/'+movie._id);//重定向
      })//movie是保存的movie
  
  }
}
// 列表页
exports.list= function(req, res){
Movie.find({}).populate('category','name').sort('meta.updateAt').exec(function(err,movies){
 res.render('list', {
      title: '电影列表',
      movies: movies
    })
  })
}
//电影删除
exports.delete=function(req,res){
  var id=req.query.id;
  if(id){
    Movie.remove({_id:id},function(err,movie){
      if(err){
        console.log(err);
      }
      else{
        res.json({success:1});
      }
    })
  }
}