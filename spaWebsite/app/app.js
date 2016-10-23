angular.module('AppGenerator',['ui.router','flow','mgo-angular-wizard'])
.constant('baseUrl','http://54.162.181.5/webservice/')
.factory('AppGeneratorFactory',function($http,$window,$q,baseUrl){
	
	var _apiKey = $window.localStorage.getItem('apiKey');
	var _apiPassword = $window.localStorage.getItem('apiPassword');
	var _appName = $window.localStorage.getItem('appName');
	var _storeUrl = $window.localStorage.getItem('storeUrl');
	var _customCollections = $window.localStorage.getItem('customCollections') === null ? [] : JSON.parse($window.localStorage.getItem('customCollections'));
	var _selectedCollections = $window.localStorage.getItem('selectedCollections') === null ? [] : JSON.parse($window.localStorage.getItem('selectedCollections'));
	var _iconUrl = $window.localStorage.getItem('icon');
	var _splashUrl = $window.localStorage.getItem('splash');
	
	var setInfo = function(obj,customCollections){
		_apiKey = obj.apiKey;
		_apiPassword = obj.apiPassword;
		_customCollections = customCollections;
		_storeUrl = obj.storeUrl;
		obj.appName = obj.appName.replace(/ /g,'');
		_appName = obj.appName;
		window.localStorage.setItem('apiKey',_apiKey);
		window.localStorage.setItem('apiPassword',_apiPassword);
		window.localStorage.setItem('storeUrl',_storeUrl);
		window.localStorage.setItem('appName',_appName);
		window.localStorage.setItem('customCollections',angular.toJson(_customCollections));
	};

	return {
		getInfo : function(){
			return {
				apiKey : _apiKey,
				apiPassword : _apiPassword,
				storeUrl : _storeUrl,
				appName : _appName
			};
		},
		getCollections : function(){
			return angular.copy(_customCollections);
		},
		getSelectedCollections : function(){
			return angular.copy(_selectedCollections);
		},
		setSelectedCollections : function(c,cc){
			_selectedCollections = c;
			_customCollections = cc;
			console.log(angular.toJson(cc));
			window.localStorage.setItem('selectedCollections',angular.toJson(c));
			window.localStorage.setItem('customCollections',angular.toJson(cc));
		},
		hasKeys : function(){
			return _apiKey && _apiPassword && _storeUrl;
		},
		setInfo : setInfo,
		sendKeys : function(obj){

			return $q(function(resolve, reject) {
				
				if(obj.apiKey === null || obj.apiPassword === null || obj.storeUrl === null || obj.appName === null || obj.appName === '' || obj.apiKey === '' ||obj.apiPassword === '' || obj.storeUrl === ''){
					alert("Complete all fields");
					reject();
					return;
				}

  				$http({
					url : baseUrl + "setKeys",
					method : "POST",
					data : obj,
					dataType : 'json',
					headers : {'Content-Type' : 'application/json'}
				})
				.success(function(data){
					if(data.status){
						setInfo(obj,data.custom_collections);
						resolve(data.custom_collections);
					}else{
						alert(data.msg);
						reject();
					}
				})
				.error(function(){
					alert("Internal sever error");
					reject();
				});
  			});
		},
		setImage : function(url,type){
			if(type === "icon"){
				_iconUrl = url;
				window.localStorage.setItem('icon',_iconUrl);
			}else{
				_splashUrl = url;
				window.localStorage.setItem('splash',_splashUrl);
			}
		},
		getIconUrl : function(){
			return _iconUrl;
		},
		getSplashUrl : function(){
			return _splashUrl;
		},
		checkUser : function(){
			return $q(function(resolve,reject){
				if(_apiKey !== null && _apiPassword !== null && _storeUrl !== null && _appName !== null && _customCollections.length > 0 && _selectedCollections.length > 0 && _iconUrl !== null && _splashUrl !== null){
					resolve();
				}else{
					reject();
				}
			});
		},
		getInfoApp : function(){
			var data = {
				apiKey : _apiKey
			};

			return $q(function(resolve,reject){
				$http({
					url : baseUrl + "getInfoApp",
					method : "POST",
					data : data,
					dataType : 'json',
					headers : {'Content-Type' : 'application/json'}
				})
				.success(function(data){
					resolve(data);
				})
				.error(function(){
					alert("internal server error");
					reject();
				});
			});
		},
		createApp : function(){
			var data = {
				apiKey : _apiKey,
				apiPassword : _apiPassword,
				storeUrl : _storeUrl,
				appName : _appName,
				customCollections : _customCollections,
				selectedCollections : _selectedCollections,
				iconUrl : _iconUrl,
				splashUrl : _splashUrl
			};

			return $q(function(resolve,reject){
				$http({
					url : baseUrl + "createApp",
					method : "POST",
					data : data,
					dataType : 'json',
					headers : {'Content-Type' : 'application/json'}
				})
				.success(function(data){
					resolve(data);
				})
				.error(function(){
					alert("internal server error");
					reject();
				});
			});
		}
	};
})
.config(function($stateProvider,$urlRouterProvider){
	
	$stateProvider.state({
		name : 'home',
		url : '/',
		templateUrl : 'templates/home.html',
		controller : 'HomeController'
	});

	$stateProvider.state({
		name : 'dashboard',
		url : '/dashboard',
		templateUrl : 'templates/dashboard.html',
		controller : 'DashboardController'
	});

	$urlRouterProvider.otherwise('/');
	
})
.run(function($window){
	$window.loading_screen.finish();
})
.controller('HomeController',function($scope,AppGeneratorFactory,$state,$q,WizardHandler,$timeout){
	
	$scope.info = AppGeneratorFactory.getInfo();
	$scope.buttonText = "Continue";
	$scope.selectedCollections = [];

	if(AppGeneratorFactory.hasKeys()){
		$timeout(function(){
			$scope.selectedCollections = AppGeneratorFactory.getSelectedCollections();
			$scope.customCollections = AppGeneratorFactory.getCollections();
			console.log($scope.customCollections);
			if($scope.selectedCollections.length > 0){
				$scope.iconUrl = AppGeneratorFactory.getIconUrl();
				if($scope.iconUrl){
					$scope.splashUrl = AppGeneratorFactory.getSplashUrl();
					if($scope.splashUrl){
						WizardHandler.wizard().finish();
					}else{
						WizardHandler.wizard().goTo(3);
					}
				}else{
					WizardHandler.wizard().goTo(2);
				}
			}else{
				WizardHandler.wizard().next();
			}
		},15);
	}

	$scope.sendKeys = function(){
		$scope.buttonText = "Loading";
		var d = $q.defer();
		AppGeneratorFactory.sendKeys($scope.info)
		.then(function(customCollections){
			$scope.selectedCollections = AppGeneratorFactory.getSelectedCollections();
			$scope.customCollections = angular.copy(customCollections);
			$scope.buttonText = "Continue";
			return d.resolve(true);
		},function(){
			$scope.buttonText = "Continue";
			return d.reject(false);
		});
		return d.promise;
	};

	$scope.selectCollection = function(c,index){
		c.icon = null;
		$scope.selectedCollections.push(c);
		$scope.customCollections.splice(index,1);
	};

	$scope.checkCollections = function(){
		if($scope.selectedCollections.length > 0){
			for(var i = 0; i < $scope.selectedCollections.length; i++){
				console.log($scope.selectedCollections[i].icon);
				if($scope.selectedCollections[i].icon === null || $scope.selectedCollections[i].icon === ''){
					return false;
				}
			}
			AppGeneratorFactory.setSelectedCollections($scope.selectedCollections,$scope.customCollections);
			return true;
		}else{
			return false;
		}
	};

	$scope.sendIcon = function(flow){
        flow.upload();
        $scope.loadingImage = true;
    };

    $scope.progress = function(file,flow){
    };

    $scope.success = function(arq, res, flow){
        var arq = JSON.parse(res);
        alert("File Uploaded");
        AppGeneratorFactory.setImage(arq.arquivo,flow.opts.query.tipo);
        WizardHandler.wizard().next();
    };

    $scope.error = function(file,msg){
        alert("Error");
    };

    $scope.finishedWizard = function(){
    	$state.go("dashboard");
    };
})
.controller('DashboardController',function($scope,AppGeneratorFactory,$state){
	AppGeneratorFactory.checkUser()
	.then(function(){
		console.log("Existe");
		AppGeneratorFactory.getInfoApp()
		.then(function(data){
			console.log(data);
			$scope.msg = data.msg;
			$scope.status = data.status;
			if(data.status === 2){
				$scope.apkUrl = data.apkUrl;
			}else if(data.status === 0){
				AppGeneratorFactory.createApp()
				.then(function(data){
					console.log(data);
					$scope.status = 1;
					$scope.msg = data.msg;
				},function(){
					$scope.msg = "An error occurred";
				});
			}
		});
	},function(){
		$state.go('home');
	})
});