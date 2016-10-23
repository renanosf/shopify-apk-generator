angular.module('starter.controllers', [])
.factory('$ProductsFactory', function($http,collections,apiKey,baseUrl,$q) {

  return {
    getProducts: function(index) {
    	return $q(function(resolve, reject) {
    		$http({
        		url: baseUrl + '/getProducts',
        		method: "POST",
        		dataType: 'json',
        		data: {collectionId : collections[index].id, apiKey : apiKey},
        		headers : {'Content-Type' : 'application/json'} 
      		})
      		.success(function(data){
        		if(data.status){
        			resolve(data.products);
        		}else{
        			reject();
        		}
      		})
      		.error(function(err){
        		reject();
      		});
    	});
    }
  };
})
.controller('CollectionCtrl', function($scope, $state, $ProductsFactory, $ionicPopup) {
	
	switch ($state.current.name) {
		case 'tab.collection_one':
			$scope.name = 'Beers';
			$scope.indice = 0;
			break;
		case 'tab.collection_two':
			$scope.name = 'Wines';
			$scope.indice = 1;
			break;
		case 'tab.collection_three':
			$scope.name = "Ice Creams";
			$scope.indice = 2;
			break;
		default:
			break;
	}

	$ProductsFactory.getProducts($scope.indice)
	.then(function(products){
		$scope.products = products;
		console.log($scope.products);
	},function(){
		$ionicPopup.alert({
			title : 'Error',
			template : 'Unable to get the list of products'
		});
	});
});
