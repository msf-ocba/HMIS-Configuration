Dhis2Api.directive('d2Resourcejson', function(){
	return{
		restrict: 'E',
		templateUrl: 'directives/resourcesjson/resourcesjsonView.html',
		scope: {
		      id: '@'
		    }
	}
	}); 
Dhis2Api.controller("d2ResourcejsonController", ['$scope',"commonvariable","loadjsonresource", function ($scope,commonvariable,loadjsonresource) {
	loadjsonresource.get($scope.id)
    .then(function(response){
        console.log(response.data);
    });
    }]);

