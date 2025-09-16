/* 
   Copyright (c) 2016.
 
   This file is part of Project Configuration for MSF.
 
   Project Configuration is free software: you can redistribute it and/or modify
   it under the terms of the GNU General Public License as published by
   the Free Software Foundation, either version 3 of the License, or
   (at your option) any later version.
 
   Project Configuration is distributed in the hope that it will be useful,
   but WITHOUT ANY WARRANTY; without even the implied warranty of
   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
   GNU General Public License for more details.
 
   You should have received a copy of the GNU General Public License
   along with Project Configuration.  If not, see <http://www.gnu.org/licenses/>. */

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
            	
            	    $scope.alertUser = true;
            		$scope.userExist = 'has-error';
            		commonvariable.userDirective="";
            		
            	} else {
            	    $scope.alertUser = false;
            	    commonvariable.userDirective = $scope.user;
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


