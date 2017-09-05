var express=require('express');
var path=require('path');
var serveStatic=require('serve-static');
var bodyParser=require('body-parser');
var session = require('express-session');
var mongoStore=require('connect-mongo')(session)
var mongoose=require('mongoose');
mongoose.Promise=require('bluebird');
var morgan=require('morgan')
var logger=morgan('dev')
var port=process.env.PORT ||3000;
var dbUrl='mongodb://localhost:27017/movies'
var app =express();
var multipart=require('connect-multiparty')
mongoose.connect(dbUrl,{useMongoClient:true});
// mongoose.connect('mongodb://localhost/movie',{useMongoClient:true})
//连接本地数据库

app.set('views', './app/views/pages');
// 设置视图的根目录
app.set('view engine', 'jade');
// 设置默认的模板引擎
// app.use(express.bodyParser());   过版本语法，现已不支持
app.use(bodyParser.urlencoded({
	extended: true
}));
// app.use(bodyParser.json())
//上面那个要加extended:true，否则会在post的时候出错
//将表单里的数据进行格式化
// app.use(express.static(path.join(__dirname,'bower_components')));  过去版语法，现已不支持
app.use(serveStatic('public'));
// 设置静态目录，其实就是使view中引入的东西路径正确
app.use(multipart());
app.use(session({
  secret:'movie',
  store:new mongoStore({
    url:dbUrl,
    colection:'movie_sessions'
  }),
  resave:false,
  saveUninitialized:true
}))
app.locals.moment=require('moment');
app.listen(port);
var env=process.env.NODE_ENV || 'development'
if('development' ===env){//开发环境
  app.set('showStackError',true)//打印错误
  app.use(logger)//打印方法地址和状态值
  app.locals.pretty=true//格式化源码
  mongoose.set('debug',true)
}
require('./config/route.js')(app)
