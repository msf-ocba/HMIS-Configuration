Dhis2Api.directive('d2Dropdownorgunitgroupset', function(){
	return{
		restrict: 'E',
		templateUrl: 'directives/orgunitgroupsets/orgunitGroupSetsView.html',
		scope: {
	        uidgroupSet: '@'
	      }
	}
	}); 

Dhis2Api.controller("d2DropdownorgunitgroupsetController", ['$scope','$http', 'OrgUnitGroupSet',"commonvariable",function ($scope, $http, OrgUnitGroupSet, commonvariable) {
		
	
	console.log("El scope " + $scope.uidgroupSet);
	
	OrgUnitGroupSet.get({uid:$scope.uidgroupSet}).$promise.then(function(data) {
		
		$scope.ListOrgUnitGroups=data;
		console.log($scope.ListOrgUnitGroups);			
	  });
	
	
	$scope.selectOrgUnitGroup = function(ougSelected){ 
		$scope.ProjectName=ougSelected.name;
	}

}]);