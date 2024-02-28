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

Dhis2Api.service('projectService', ['$q', 'commonvariable', 'commonService', 'User', 'OrgUnit', 'OrgUnitGroupsOrgUnit', 'DemographicService',
                                    function ($q, commonvariable, commonService, User, OrgUnit, OrgUnitGroupsOrgUnit, DemographicService) {
	
	
    this.initValue=function($scope) {
    	
        $scope.projectTypeId = commonvariable.ouGroupsetId.ProjectType;
        $scope.populationTypeId = commonvariable.ouGroupsetId.PopulationType;
        $scope.typeManagementId = commonvariable.ouGroupsetId.TypeManagement;
        $scope.gsEventId = commonvariable.ouGroupsetId.Event;
        $scope.gsContextId = commonvariable.ouGroupsetId.Context;
        $scope.siteTypeId = commonvariable.ouGroupsetId.SiteType;    	
    	
    };
    
	this.saveSiteUser = function() {
		
		var user = {}
					
		user.surname = commonvariable.users.prefix + "-" + commonvariable.userDirective + "-" + commonvariable.users.postfix_siteuser
		user.userCredentials= {}
		user.userCredentials.password=commonvariable.users.passwd
		user.organisationUnits = [{"id":commonvariable.NewOrganisationUnit.id}]
		user.dataViewOrganisationUnits = [{"id":commonvariable.NewOrganisationUnit.id}]
		user.userGroups = [{"id":commonvariable.users.uid_project_users_userGroup}]

			
		user.firstName = commonvariable.users.postfix_siteuser
		user.userCredentials.userRoles = [{"id":commonvariable.users.uid_role_fielduser}]
		user.userCredentials.username=commonvariable.users.prefix + "-" + commonvariable.userDirective + "-" + commonvariable.users.postfix_siteuser
			
		User.POST(user).$promise.then( data => console.log(data) );
			
	};    
	
	updateOrgUnitGroups = function (orgUnit) {

        const projectGroupSets = [
            commonvariable.ouGroupsetId.PopulationType,
            commonvariable.ouGroupsetId.Context,
            commonvariable.ouGroupsetId.ProjectType,
            commonvariable.ouGroupsetId.TypeManagement,
            commonvariable.ouGroupsetId.Event
        ];

        const assignPromises = projectGroupSets
            .filter( groupSet => commonvariable.orgUnitGroupSet[groupSet] != undefined)
            .map( groupSet => {
                const group = commonvariable.orgUnitGroupSet[groupSet];
                return commonService.assignUniqueOrgunitGroupInGroupSet(orgUnit, group.id, groupSet);
            });

        return $q.all(assignPromises);
	};
    
	updateCodes = function (orgUnit) {
        var defered = $q.defer();
        var promise = defered.promise;
        if (orgUnit.level == commonvariable.level.HealthSite || orgUnit.level == commonvariable.level.HealthService) {
            
            var textToUpdate = "OU_" + commonvariable.ouDirectiveCode.slice(2, 7);
            var newCode = textToUpdate + orgUnit.code.slice(8);
            
            OrgUnit.PATCH({id:orgUnit.id},
                [
                    { "op": "replace", "path": "/code", "value": newCode }
               ]   
               /*
                {
                  code:newCode}
                  */
                  ).$promise.then( data => {
                defered.resolve(data);
                if (data.response.status != "SUCCESS")
                    console.log("Eror");
            });			  
            
        }
    
        return promise;
    };
	  
    updateOrgUnits = function (orgUnits) {
        var defered = $q.defer();
        var promise = defered.promise;

        angular.forEach(orgUnits, function(orgUnit, key){
            
            if (typeof orgUnit.code != 'undefined'){
                updateCodes(orgUnit).then(data => {});
            }

            if (orgUnits.length - 1 == key) {
                defered.resolve(true);
            }
        });	     
        return promise;
    };
	  
    this.saveHealthSite = async function (newOu){
        
        var deferred = $q.defer();

    
    ou=await OrgUnit.POST({}, newOu);
      
    // var data=ou.$promise.$$state.value.data;
       ou.$promise.then(data=>{  
            if (data.status == "OK") {
                saved=true;
                newOu.id = data.response.uid;
                commonvariable.NewOrganisationUnit = newOu;

                const siteTypeGroup = commonvariable.orgUnitGroupSet[commonvariable.ouGroupsetId.SiteType];
                if (siteTypeGroup != undefined) {
               OrgUnitGroupsOrgUnit.POST({ uidgroup: siteTypeGroup.id, uidorgunit: newOu.id });
switch(siteTypeGroup.code) {

case "OUG_HST_HOS": 
case "OUG_HST_HP":
case "OUG_HST_EIU":
case "OUG_HST_HCH":
case "OUG_HST_HC":
case "OUG_HST_VAC":
case "OUG_HST_OT":
    

//Add to Facilities OUG
OrgUnitGroupsOrgUnit.POST({ uidgroup: "v1pQlctBrzu", uidorgunit: newOu.id });
break;
case "OUG_HST_CA":
case "OUG_HST_OS":
case "OUG_HST_MC":
//Add to DMC OUG
OrgUnitGroupsOrgUnit.POST({ uidgroup: "QDPZ3c22JsQ", uidorgunit: newOu.id });
break;


}




                } else {
                    console.warn("Health site not associated to any health site group")
                }

                DemographicService.assignPopulationDataSet(newOu.id).then(
                    success => deferred.resolve(true),
                    error => deferred.resolve(false)
                );

            }
           
     		  
        },
        
    rejected => {  
 
    deferred.resolve(false) ;
    return deferred.promise;
 }
        
        );

//if (!saved) {  deferred.resolve(false) }
    return deferred.promise;

    };
	  
	  
    this.editProject = function(idOu, editOu){

        var defered = $q.defer();
        var promise = defered.promise;
        var projectEdited = false;		  
        
        OrgUnit.PATCH({id:idOu}, editOu).$promise.then( 
            success => {
                commonvariable.EditOrganisationUnit = commonvariable.OrganisationUnit;
                ///replace with new value
                commonvariable.EditOrganisationUnit.name = editOu[0].value;
                commonvariable.EditOrganisationUnit.shortName= editOu[1].value
                commonvariable.EditOrganisationUnit.code = editOu[2].value;
                commonvariable.EditOrganisationUnit.openingDate = editOu[3].value;
                //refresh tree for show change

                updateOrgUnitGroups({id:idOu}).then(
                    success => defered.resolve(true),
                    error => defered.resolve(false)
                );
            },
            error => defered.resolve(false)
        );
        return promise;
    };

}]);