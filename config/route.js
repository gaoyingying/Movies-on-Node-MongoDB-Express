var Index=require('../app/controller/index.js')
var User=require('../app/controller/user.js')
var Movie=require('../app/controller/movie.js')
var Comment=require('../app/controller/comment.js')
var Category=require('../app/controller/category.js')
module.exports=function(app){

app.use(function(req,res,next){
  var user=req.session.user
  res.locals.user=user//user存在本地，所有渲染也都能获取到
  next()
})
app.get('/', Index.index)
 
app.get('/movie/:id', Movie.detail)
app.get('/admin/movie',User.isSigned,User.isAdmin,Movie.save)
app.get('/admin/movie/update/:id',User.isSigned,User.isAdmin,Movie.update)
app.post('/admin/movie/new',User.isSigned,User.isAdmin,Movie.savePoster,Movie.new)
app.get('/admin/movie/list',User.isSigned,User.isAdmin,Movie.list)
app.delete('/admin/movie/list',User.isSigned,User.isAdmin,Movie.delete)


app.post('/user/signin',User.signin)
app.get('/user/logout',User.logout)
app.get('/signup',User.Showsignup)
app.post('/user/signup',User.signup)
app.get('/admin/user/list',User.isSigned,User.isAdmin, User.list)
app.delete('/admin/user/list',User.isSigned,User.isAdmin,User.delete)

app.post('/user/comment',User.isSigned,Comment.save)

app.get('/admin/category/new',User.isSigned,User.isAdmin,Category.new)
app.post('/admin/category',User.isSigned,User.isAdmin,Category.save)
app.get('/admin/categorylist',User.isSigned,User.isAdmin,Category.list)
app.delete('/admin/categorylist',User.isSigned,User.isAdmin,Category.delete)

app.get('/resultsByCategory',Index.search)
}
