Dhis2Api.directive('d2Dropdownorgunitgroupsetcompa', function(){
	return{
		restrict: 'E',
		templateUrl: 'directives/orgunitgroupsetscompatibility/orgunitGroupSetsCompaView.html',
		scope: {
	        uidgroupset: '@',
	        file: '@'
	      }
		}
	}); 

Dhis2Api.controller("d2DropdownorgunitgroupsetcompaController", ['$scope','$http', 'OrgUnitGroupSet','OrgUnitGroupByGroupSets','OrgUnitGroupByOrgUnit',"commonvariable", "OrgUnitChildren", "loadjsonresource", function ($scope, $http, OrgUnitGroupSet, OrgUnitGroupByGroupSets, OrgUnitGroupByOrgUnit, commonvariable, OrgUnitChildren, loadjsonresource) {
	
    console.log ("Parameters " + $scope.uidgroupset + " " + $scope.file);	
	
    loadjsonresource.get($scope.file)
    .then(function(response){
    	
    	console.log(response.data);
    	
    });
    
	OrgUnitGroupSet.get({uid:$scope.uidgroupset}).$promise.then(function(data) {
		$scope.ListOrgUnitGroups=data;			
		
		console.log(data);
		
	  });

	$scope.selectOrgUnitGroup = function(ougSelected){ 
		$scope.ougName=ougSelected.name;
		commonvariable.orgUnitGroupSet[$scope.uidgroupset]=ougSelected;
	}

	
}]);