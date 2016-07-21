//model.js
var mongoose=require('mongoose');

var userSchema = new mongoose.Schema({
	username:String,
	password:String,//hash generated password
	imgUrl:String,
	created_at:{type:Date,default:Date.now()}
});

var postSchema = new mongoose.Schema({
	text:String,
	username:String,
	imgUrl:String,
	created_at:{type:Date,default:Date.now()}
});
mongoose.model('User',userSchema);
mongoose.model('Post',postSchema);
