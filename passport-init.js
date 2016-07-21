//passport.init.js
var localStrategy=require('passport-local').Strategy;
var bCrypt=require('bcrypt-nodejs');
var mongoose=require('mongoose');
var User=mongoose.model('User');
var Post=mongoose.model('Post');
// Temporary data store
 var users= {};

 module.exports=function(passport){
 	// passport needs to serialize and deserialize user
 	passport.serializeUser(function(user,done){
 		console.log('serialize User ',user._id);
 		return done(null,user._id);
 	});
 	passport.deserializeUser(function(id,done){
 		User.findById({_id:id},function(err,user){
 				if(err){
 					return done(err,false);
 				}
 				if(!user){
 					return done('User not found ',false);
 				}
 				return done(null,user);
 		});
 		
 	});
 	passport.use('login',new localStrategy(
 		{passReqToCallback:true},
 		function(req,username,password,done){
 		User.findOne({'username':username},function(err,user){
 			if(err){
 				return done(err,false);
 			}
 			if(!user.username){
 				return done('User not found with the name '+ username,false);
 			}
 			if(!isValidPassword(user,password)){
 				return done('Invalid password ',false);
 			}
 			return done(null,user);
 		});	
 		
 	})
 	);
 	passport.use('signup',new localStrategy({
 		passReqToCallback:true},

 		function(req,username,password,done){
 			User.findOne({'username':username},function(err,user){
 				if(err){
 					return done(err,false);
 				}
 				if(user){
 					return done('User name already has taken',false);
 				}
 				var user= new User();
 				user.username=username;
 				user.password=createHash(password);
 				user.save(function(err,user){
 					if(err){
 						return done(err,false);
 					}
 					console.log('User successfully added'+user);
 					return done(null,user);
 				});
 			});
 		
 	})
 	);
 	var isValidPassword=function(user,password){
 		return bCrypt.compareSync(password,user.password);
 	};
 	var createHash=function(password){
 		return bCrypt.hashSync(password,bCrypt.genSaltSync(10),null);
 	};
 }