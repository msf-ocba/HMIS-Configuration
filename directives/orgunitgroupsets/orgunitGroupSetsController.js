Dhis2Api.directive('d2Dropdownorgunitgroupset', function(){
	return{
		restrict: 'E',
		templateUrl: 'directives/orgunitgroupsets/orgunitGroupSetsView.html',
		scope: {
	        uidgroupset: '@'
	      }
		}
	}); 

Dhis2Api.controller("d2DropdownorgunitgroupsetController", ['$scope','$http', 'OrgUnitGroupSet',"commonvariable",function ($scope, $http, OrgUnitGroupSet, commonvariable) {
		
	
	OrgUnitGroupSet.get({uid:$scope.uidgroupset}).$promise.then(function(data) {
		$scope.ListOrgUnitGroups=data;			
	  });
	
	if(commonvariable.OrganisationUnit!=undefined && commonvariable.OrganisationUnit.level == 4){

		//Falta por completar
	}
	else console.log("La unidad no existe");
	
	
	$scope.selectOrgUnitGroup = function(ougSelected){ 
		$scope.ougName=ougSelected.name;
		commonvariable.orgUnitGroupSet[$scope.uidgroupset]=ougSelected;
	}

}]);