Dhis2Api.directive('d2Dropdownorgunitgroupset', function(){
	return{
		restrict: 'E',
		templateUrl: 'directives/orgunitgroupsets/orgunitGroupSetsView.html',
		scope: {
	        uidgroupset: '@',
	        operation: '@'
	      }
		}
	}); 

Dhis2Api.controller("d2DropdownorgunitgroupsetController", ['$scope','$http', 'OrgUnitGroupSet',"commonvariable", "OrgUnitGroupByOrgUnit", function ($scope, $http, OrgUnitGroupSet, commonvariable, OrgUnitGroupByOrgUnit) {
	
	
	if ($scope.operation=="show") {
		$scope.disabled=true;
		showOrgUnit();
	}
	
	else {

		
		$scope.disabled=false;
		
		OrgUnitGroupSet.get({uid:$scope.uidgroupset}).$promise.then(function(data) {
			
			$scope.ListOrgUnitGroups=data;	
				
		
		});
	
		if(commonvariable.OrganisationUnit!=undefined && commonvariable.OrganisationUnit.level == 4){

			//Falta por completar
		}
		else console.log("La unidad no existe");
	}
	
	
	$scope.selectOrgUnitGroup = function(ougSelected){ 
		$scope.ougName=ougSelected.name;
		commonvariable.orgUnitGroupSet[$scope.uidgroupset]=ougSelected;
	}
	
	showOrgUnit = function() {
		
		OrgUnitGroupByOrgUnit.get({uid:commonvariable.OrganisationUnit.id}).$promise.then(function(data) {
			
			ouOrgUnitGroups=data.organisationUnitGroups;
			
			OrgUnitGroupSet.get({uid:$scope.uidgroupset}).$promise.then(function(data) {
				
				ougsOrgUnitGroups=data.organisationUnitGroups;
				
				console.log(ougsOrgUnitGroups);
				
				for (var i=0; i<ouOrgUnitGroups.length; i++) 
					for (var j=0; j<ougsOrgUnitGroups.length;j++) {
						if (ouOrgUnitGroups[i].id==ougsOrgUnitGroups[j].id) {
							$scope.ougName = ouOrgUnitGroups[i].name;
							break;
						}
							
					}
				
						
				
			  });
			
			
			
		});

	}
	
	

}]);