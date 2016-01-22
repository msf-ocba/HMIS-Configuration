Dhis2Api.directive('d2Finduser', function(){
    return{
        restrict: 'E',
        templateUrl: 'directives/findUser/findUserView.html',
        scope: {placeholder: '@',id:'@'}
    }
});

Dhis2Api.controller("findUserController", ['$scope','$http', 'FilterResource',"commonvariable",function ($scope, $http, FilterResource, commonvariable) {



    $scope.findUser = function () {

        FilterResource.get({ resource: "users", filter: 'userCredentials.code:eq:'+ commonvariable.users.prefix + "-" + $scope.user + "-" + commonvariable.users.postfix_mfp  })
            .$promise.then(function (data) {
            	
            	if (data.users.length>0) {
            	
            		$scope.alertUser=true
            		$scope.userExist = 'has-error'
            		
            	} else {
            		$scope.alertUser = false
            		commonvariable.userDirective = $scope.user
            		$scope.userExist = '';
            	}
       	});


    }

    $scope.initValue = function () {
        $scope.user = "";
    }

    $scope.$watch(function () {
        //clear value 
        if (commonvariable.clearForm[$scope.id] == true) {
            $scope.initValue();
            commonvariable.clearForm[$scope.id] = false;
        }
    });



}]);


