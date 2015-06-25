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
	
    $scope.loadjson=function(){
        loadjsonresource.get($scope.id)
        .then(function(response){
                $scope.sections=response.data.vaccinationDataset[0];
        });
    }

    $scope.toType = function(obj) {
        return ({}).toString.call(obj).match(/\s([a-z|A-Z]+)/)[1].toLowerCase()
    }

    $scope.readjson=function(datavalue){
         angular.forEach(datavalue, function(value, key){
                var typeobject=$scope.toType(value);
                if(typeobject=="array"||typeobject=="object")
                    $scope.readjson(value);
            });
    }

    }]);

