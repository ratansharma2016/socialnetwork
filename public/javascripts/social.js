
var app = angular.module('social',['ngRoute','ngResource']).run(function($rootScope,$http){
	$rootScope.updatedbtn=false;
	$rootScope.authenticated=false;
	$rootScope.current_user='';
	$rootScope.user_Id='';
	$rootScope.user_url='';
	$rootScope.signout=function(){
	$rootScope.authenticated=false;
	$rootScope.current_user='';
	$http.get('/auth/signout');
	}
});




app.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            
            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);

	
	
	app.config(function($routeProvider){
		$routeProvider
		.when('/',{
			templateUrl:'main.html',
			controller:'mainController'
		})
		.when('/login',{
			templateUrl:'login.html',
			controller:'authController'
		})
		.when('/signup',{
			templateUrl:'register.html',
			controller:'authController'
		});

	});


app.service('fileUpload', ['$http','$rootScope', function ($http,$rootScope) {
    this.uploadFileToUrl = function(file, uploadUrl){
        var fd = new FormData();
        fd.append('file', file);
        $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
        .success(function(data){
        	console.log(data);

        $rootScope.user_url='/images/'+data.filename;
        })
        .error(function(){
        });
    }
}]);


	app.factory('postService',function($resource){
		return $resource('/api/posts/:id',{userId:'@id'});
	});


	app.controller('mainController',function($scope, postService,$rootScope, $http){
		$scope.posts=postService.query();

		$scope.newPost={username:'',created_at:'',text:'',imgUrl:''};
		$scope.post=function(){
				
				$scope.newPost.username=$rootScope.current_user;
				$scope.newPost.created_at=Date.now();
				$scope.newPost.imgUrl=$rootScope.user_url;
				postService.save($scope.newPost, function(){
				$scope.posts=postService.query();
				console.log($scope.posts);
				$scope.newPost={username:'',created_at:'',text:''};
			});
			
		};

		$scope.remove=function(id,user){
			if(user===$rootScope.current_user){
			$http.delete('/api/posts/'+id).success(function(){
			$scope.posts=postService.query();
			$scope.newPost={username:'',created_at:'',text:''};
			});
			}else{
				$scope.posts=postService.query();
			}
			};


			$scope.edit=function(id,user){
			if(user===$rootScope.current_user){
			$rootScope.updatedbtn=true;
			$http.get('/api/posts/'+id).success(function(data){
				$scope.newPost=data;
			});
			}else{
			$scope.posts=postService.query();
			}

			};

			$scope.update=function(id,user){
			user=$scope.newPost.username;
			if(user===$rootScope.current_user){
			$http.put('/api/posts/'+$scope.newPost._id,{text:$scope.newPost.text,imgUrl:$rootScope.user_url}).success(function(){
				$scope.posts=postService.query();
				//console.log('updated1111');
				$scope.newPost={username:'',created_at:'',text:''};
			});
		}else{
				$scope.posts=postService.query();
			 }
			 $rootScope.updatedbtn=false;
			};
	});


	app.controller('authController',function($scope,$http,$location,$rootScope){

		$scope.user={username:'',password:''};
		$scope.error_message='';

		$scope.login=function(){
			$http.post('/auth/login',$scope.user).success(function(data){
				$rootScope.authenticated=true;
				$rootScope.current_user=data.user.username;
				$rootScope.user_Id=data.user._id;
				$rootScope.user_url='/images/'+data.user.imgUrl;
				$location.path('/');
			});
		};
		$scope.register=function(){
				$http.post('/auth/signup',$scope.user).success(function(data){
					console.log(data);
				$rootScope.authenticated=true;
				$rootScope.current_user=data.user.username;
				$location.path('/');
			});
		};
	});


// to upload profile image

app.controller('profImageCtrl', ['$scope', 'fileUpload','postService', function($scope,fileUpload,postService){
    
    $scope.uploadFile = function(id){
        var file = $scope.myFile;
        //console.log($scope.username);
        var uploadUrl = "/api/posts/profimage/"+id;
        fileUpload.uploadFileToUrl(file, uploadUrl);
        $scope.posts=postService.query();
        };
    
}]);

