var Movie=require('../model/movie.js')
var Category=require('../model/category.js')
// 首页 分割线
exports.index= function(req, res){
  console.log('user in session:')
  console.log(req.session.user)
  Category
  .find({})
  .populate({path:'movies',options:{limit:4}})
  .exec(function(err,categories){
      if(err){
        console.log(err)
      }
    res.render('index', {// 调用当前路径下的 test.jade 模板
      title: '电影网站首页',
      movies: categories.movies,
      categories:categories
    })
  })
}
exports.search= function(req, res){
  var count=4
  var catId=req.query.cat
  var q=req.query.q
  var page=parseInt(req.query.p,10) || 0
  var index=page*count//从那个序号开始在数据库里找
  if(catId){
  Category
  .find({_id:catId})
  .populate({
    path:'movies',
    select:'title poster',
  })
  .exec(function(err,categories){
      if(err){
        console.log(err)
      }
      var category=categories[0] ||{}
      var movies=category.movies || []
      var cateMovies=movies.slice(index,index+count)
      // console.log("index："+index)
      // console.log("截取后的数据数量："+cateMovies.length)
      res.render('querylist', {
        title: '电影分类展示页',
        currentPage:page+1,
        name:category.name,
        cat:'cat='+catId,
        totalPage:Math.ceil(movies.length/count),
        cateMovies:cateMovies
    })
      })
    }
    else{
        Movie
          .find({title:new RegExp(q+'.*','i')})
          .exec(function(err,movies){
              if(err){
                console.log(err)
              }
              var cateMovies=movies.slice(index,index+count)
              res.render('querylist', {
                title: '电影分类展示页',
                currentPage:page+1,
                name:q,
                cat:'q='+catId,
                totalPage:Math.ceil(movies.length/count),
                cateMovies:cateMovies
            })
              })

    }
}