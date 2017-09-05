var mongoose = require('mongoose')
var CategorySchema = require('../schema/category.js')
var Category = mongoose.model('Category', CategorySchema)

module.exports =Category

//导出Comment这个构造函数