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

Dhis2Api.directive('d2Periodtype', function(){
	return{
		restrict: 'E',
		templateUrl: 'directives/periodtype/periodTypeView.html',
		scope:{
		    selected:'@selected'
		}
	};
});


Dhis2Api.controller("d2periodtypeController", ['$scope',"commonvariable",function ($scope, commonvariable) {
		$scope.Listperiod =commonvariable.Listperiod;
		$scope.selectperiod = function(PSelected){
			commonvariable.PeriodSelected=PSelected;
			$scope.PeriodSelected=PSelected.name;
		}

		$scope.$watch(
        function ($scope) {
            if ($scope.selected) {
                angular.forEach(commonvariable.Listperiod, function (value, key) {

                    if ($scope.selected == value.code) {
                        $scope.selectperiod(value);
                    }

                });
            }

        });
}]);