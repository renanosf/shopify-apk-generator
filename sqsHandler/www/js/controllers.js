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
			$scope.name = 'COLLECTION_TITLE1';
			$scope.indice = 0;
			break;
		/* REMOVE IF COLLECTIONS > 2
		case 'tab.collection_two':
			$scope.name = 'COLLECTION_TITLE2';
			$scope.indice = 1;
			break;
		REMOVE IF COLLECTIONS > 2 */
		/* REMOVE IF COLLECTIONS > 3
		case 'tab.collection_three':
			$scope.name = 'COLLECTION_TITLE3';
			$scope.indice = 2;
			break;
		REMOVE IF COLLECTIONS > 3 */
		/* REMOVE IF COLLECTIONS > 4
		case 'tab.collection_three':
			$scope.name = 'COLLECTION_TITLE4';
			$scope.indice = 2;
			break;
		REMOVE IF COLLECTIONS > 4 */
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
