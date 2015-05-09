Dhis2Api.directive('d2Dropdownorgunitgroupsetfilter', function(){
	return{
		restrict: 'E',
		templateUrl: 'directives/orgunitgroupsetswithfilter/orgunitGroupSetsFilterView.html',
		scope: {
	        uidgroupset: '@',
	        filter: '@'
	      }
		}
	}); 

Dhis2Api.controller("d2DropdownorgunitgroupsetfilterController", ['$scope','$http', 'OrgUnitGroupSet','OrgUnitGroupByGroupSets','OrgUnitGroupByOrgUnit',"commonvariable",function ($scope, $http, OrgUnitGroupSet, OrgUnitGroupByGroupSets, OrgUnitGroupByOrgUnit, commonvariable) {
		
			 //Regular Project   Health Post       HCwHos       HCwoHos      Epidemic Isol     Hospital      Community      Mobile
	filters = {"vKs2xhGp5T0" : ["h6F9u3N41HZ", "obaoBf7krPh", "iS4889QMH1a", "WxQC2vqWXOB", "VIUTzhC3Cbd", "zplJaZsSI0W", "xh1SiIw0ghk"],
	
	//Emergency Project      Health Post       HCwHos        HCwoHos     Epidemic Isol    Hospital      Community      Mobile
		"ohsrsdStmPr"	:  ["h6F9u3N41HZ", "obaoBf7krPh", "iS4889QMH1a", "WxQC2vqWXOB", "VIUTzhC3Cbd", "zplJaZsSI0W", "xh1SiIw0ghk"],

    //Regular Vaccination    Health Post       HCwHos        HCwoHos     Epidemic Isol    Hospital      Vacc. site     
		"hRGx8gjJyNk"	:  ["h6F9u3N41HZ", "obaoBf7krPh", "iS4889QMH1a", "WxQC2vqWXOB", "VIUTzhC3Cbd", "pMmPRanTBqH"],
		
	//Emergency Vaccination    Health Post       HCwHos        HCwoHos     Epidemic Isol    Hospital      Vacc. site     
		"URE4Y7RHgTV"	:    ["h6F9u3N41HZ", "obaoBf7krPh", "iS4889QMH1a", "WxQC2vqWXOB", "VIUTzhC3Cbd", "pMmPRanTBqH"]		

	};
	

	
	var uid_to_filter="";
	
	OrgUnitGroupByGroupSets.get({uid:$scope.filter}).$promise.then (function(data) {
		
		orgUnitGroupsGroupSets = data.organisationUnitGroups;
						
		OrgUnitGroupByOrgUnit.get({uid:commonvariable.OrganisationUnit.id}).$promise.then (function(data){

			orgUnitGroupsOrgUnit = data.organisationUnitGroups;			
			
			
			for (var i=0; i<orgUnitGroupsOrgUnit.length;i++)
				for (var j=0; j<orgUnitGroupsGroupSets.length;j++)
					if (orgUnitGroupsOrgUnit[i].id == orgUnitGroupsGroupSets[j].id) 
						uid_to_filter = orgUnitGroupsOrgUnit[i].id;

			
			OrgUnitGroupSet.get({uid:$scope.uidgroupset}).$promise.then(function(data){
				
				var filter = filters[uid_to_filter];
				
				$scope.organisationUnitGroups = [];
				
				var orgUnitsGroupsList = data.organisationUnitGroups;
				
				for (var i=0;i<orgUnitsGroupsList.length;i++) 
					
					if (filter.indexOf(orgUnitsGroupsList[i].id)!=-1) 
						$scope.organisationUnitGroups.push(orgUnitsGroupsList[i]);
			});
			
		});
		
		
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