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

Dhis2Api.controller("d2DropdownorgunitgroupsetController", ['$q','$scope','$http', 'OrgUnitGroupSet',"commonvariable", "OrgUnitGroupByOrgUnit", "loadjsonresource", "getIDOUG", function ($q, $scope, $http, OrgUnitGroupSet, commonvariable, OrgUnitGroupByOrgUnit, loadjsonresource, getIDOUG) {
	
	if ($scope.operation!="show") {
		
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
		
		getIDOUG.get({filter:'code:eq:'+ougSelected.code}).$promise.then(function(response) {
			
			commonvariable.orgUnitGroupSet[$scope.uidgroupset]=response.organisationUnitGroups[0];
		
		});
	}
	
	
	function getOrgUnitGroup (uidOrgUnit, uidOrgUnitGroupSet) {
				
		var defered = $q.defer();
        var promise = defered.promise;        

		OrgUnitGroupByOrgUnit.get({uid:uidOrgUnit}).$promise.then(function(data) {
			
			ouOrgUnitGroups=data.organisationUnitGroups;
			
			OrgUnitGroupSet.get({uid:uidOrgUnitGroupSet}).$promise.then(function(data) {
								
				ougsOrgUnitGroups=data.organisationUnitGroups;
				
			    try {
			        for (var i = 0; i < ouOrgUnitGroups.length; i++)
			            for (var j = 0; j < ougsOrgUnitGroups.length; j++) {
			                if (ouOrgUnitGroups[i].id == ougsOrgUnitGroups[j].id) {

			                    defered.resolve(ouOrgUnitGroups[i]);
			                    break;
			                }
			            }
			    } catch (err) { };
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
	
	$scope.prevOu = undefined;
	$scope.$watch(function () {

	    ///
	    if ($scope.operation != $scope.prevOperation) {
	       
	        try {
	            getOrgUnitGroup(commonvariable.OrganisationUnit.id, $scope.uidgroupset).then(function (data) {
	            	$scope.ougName = data.name;
	            	if ($scope.operation=="edit") {
	            		commonvariable.preOrgUnitGroupSet[$scope.uidgroupset]=data;
	            	}
	            })
	        } catch (err) {
	            console.log("Error, Organisation Unit doesn't selected");
	        };
	        
	        
			OrgUnitGroupSet.get({uid:$scope.uidgroupset}).$promise.then(function(data) {
				$scope.ListOrgUnitGroups=data.organisationUnitGroups;
						
			});

	        
	        if ($scope.operation == 'edit')
	                $scope.disabled = false;
	            else {
	                $scope.disabled = true;
	               
	            }
	            $scope.prevOperation = $scope.operation;


	    }

	    if (commonvariable.OrganisationUnit && commonvariable.OrganisationUnit.id != $scope.prevOu) {
	        $scope.prevOu = commonvariable.OrganisationUnit.id;

	         //function to call when change of OU
	        if ($scope.operation == "show") {
	            $scope.disabled = true;
	            try{
	                getOrgUnitGroup(commonvariable.OrganisationUnit.id, $scope.uidgroupset).then(function (data) { $scope.ougName = data.name })
	            }catch(err){
	                console.log("Error, Organisation Unit doesn't selected");
	            };
	        }

	    }
	});
	

}]);