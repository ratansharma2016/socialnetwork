var express = require('express');
var router = express.Router();
var path = require('path');
var multer=require('multer');
var upload=multer({dest:'./public/images'});
var mongoose=require('mongoose');
require('../model/model.js');
var Post=mongoose.model('Post');
var User=mongoose.model('User');
var app=express();



var isAuthenticated=function(req,res,next){

	if(req.method==='GET')
	{
		return next();
	}
	if(req.isAuthenticated())
	{
		return next();

	}
	return res.redirect('/#login');
	
};

/* GET users listing. */
/*router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});*/
// Returns all posts
router.use('/posts',isAuthenticated);
router.post('/posts/profimage/:id',upload.single('file'),function(req,res){
	console.log(req.file);
	return res.send(req.file);
	User.update({_id:req.params.id}, {$set:{imgUrl:req.file.filename}},
		function(err,post){
		if(err){
		return res.send(500,err);
		}
		
});
	Post.update({_id:req.params.id}, {$set:{imgUrl:req.file.filename}},
		function(err,post){
		if(err){
		return res.send(500,err);
		}
	
});
	
});

/*.post('', upload.single('avatar'), function (req, res, next) {
  console.log(req.files);
  // req.file is the `avatar` file
  // req.body will hold the text fields, if there were any
});
*/
router.route('/posts')

// Temporary post received

.get(function(req,res){
	Post.find(function(err,data){
		if(err)
		{
			return res.send(500,err);
		}
		return res.send(data);
	});
})

// Temporary post created

.post(function(req,res){
	var post=new Post();
	post.text=req.body.text;
	post.username=req.body.username;
	post.imgUrl=req.body.imgUrl;
	post.save(function(err,data){
		if(err){
			return res.send(500,err);
		}
		console.log('One Post Added '+data);
		return res.json(post);
	});
});

//Searching post by ID

router.route('/posts/:id')
.get(function(req,res){
	Post.findById(req.params.id,function(err,post){
		if(err){
			return res.send(500,err);
		}
		return res.json(post);
	});
})

//To modify a post with proposted ID


.put(function(req,res){
	Post.findById(req.params.id,function(err,post){
		if(err){
			return res.send(500,err);
		}
        console.log(post,">>>>>>>>>>>SFSDF>>>>>>>>>>",req.params.id,req.body.text)     

		Post.update({_id:req.params.id}, {$set:{text:req.body.text,imgUrl:req.body.imgUrl}},
		function(err,post){
		if(err){
		return res.send(500,err);
		}
		console.log('One Post updated '+post);
		return res.json(post);
});

});
})


//To delete a post with proposted ID

.delete(function(req,res){
	Post.remove({_id:req.params.id},function(err,post){
		if(err){
			return res.send(500,err);
		}
		return res.json(post);
	});
});

module.exports = router;
