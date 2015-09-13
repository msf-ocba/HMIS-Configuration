Dhis2Api.directive('d2Dropdownorgunitgroupset', function(){
	return{
		restrict: 'E',
		templateUrl: 'directives/orgunitgroupsets/orgunitGroupSetsView.html',
		scope: {
	        uidgroupset: '@',
	        operation: '@',
	        uidgroupsetfilterby: '@',
	        file: '@'
	      }
		}
	}); 

Dhis2Api.controller("d2DropdownorgunitgroupsetController", ['$q','$scope','$http', 'OrgUnitGroupSet',"commonvariable", "OrgUnitGroupByOrgUnit", "loadjsonresource", function ($q, $scope, $http, OrgUnitGroupSet, commonvariable, OrgUnitGroupByOrgUnit, loadjsonresource) {
	
	if ($scope.operation=="show") {
		$scope.disabled=true;
		getOrgUnitGroup(commonvariable.OrganisationUnit.id, $scope.uidgroupset).then(function(data){$scope.ougName=data.name;})
	}
	
	else {
		
		$scope.disabled=false;
		
		if ($scope.uidgroupsetfilterby != undefined) {
			
			getOrgUnitGroup(commonvariable.OrganisationUnit.id, $scope.uidgroupsetfilterby).then(function(data){
				
				var parentOrgUnitGroupName = data;
				loadjsonresource.get($scope.file).then(function(response) {					
					$scope.ListOrgUnitGroups = getServiceTypeBySiteType(response.data.servicesBySite, parentOrgUnitGroupName.code);
				});
			});
		}
		
		else  {
			OrgUnitGroupSet.get({uid:$scope.uidgroupset}).$promise.then(function(data) {
				$scope.ListOrgUnitGroups=data.organisationUnitGroups;
						
			});
		
		}
	}
	
	
	$scope.selectOrgUnitGroup = function(ougSelected){ 
		$scope.ougName=ougSelected.name;
		commonvariable.orgUnitGroupSet[$scope.uidgroupset]=ougSelected;
	}
	
	
	function getOrgUnitGroup (uidOrgUnit, uidOrgUnitGroupSet) {
				
		var defered = $q.defer();
        var promise = defered.promise;        

		OrgUnitGroupByOrgUnit.get({uid:uidOrgUnit}).$promise.then(function(data) {
			
			ouOrgUnitGroups=data.organisationUnitGroups;
			
			OrgUnitGroupSet.get({uid:uidOrgUnitGroupSet}).$promise.then(function(data) {
								
				ougsOrgUnitGroups=data.organisationUnitGroups;
				
				for (var i=0; i<ouOrgUnitGroups.length; i++) 
					for (var j=0; j<ougsOrgUnitGroups.length;j++) {
						if (ouOrgUnitGroups[i].id==ougsOrgUnitGroups[j].id) {
							
							defered.resolve(ouOrgUnitGroups[i]);																																		
							break;
						}							
					}
			});
			
		});
		
		return promise;
	}
	
	getServiceTypeBySiteType = function(servicesBySiteType, code) {
		
		var sites = servicesBySiteType.siteType;
		var services = {};
		
		for (var i=0; i<sites.length; i++) {			
			if (sites[i].code==code) {
				services = sites[i].services;
				break;
			}
		}
		return services;
	}
	
		
	

}]);