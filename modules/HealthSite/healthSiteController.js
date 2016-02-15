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

appConfigProjectMSF.controller('healthSiteController', ["$scope", '$filter', "commonvariable", "OrgUnit", "OrgUnitGroupsOrgUnit", "loadjsonresource", "OrgUnitGroupByOrgUnit", "FilterResource", "$modal", "DataSetsOrgUnit", "GetMission", "validatorService", "OrganisationUnitChildren","OrgUnitOrgUnitGroups", "healthsiteService", function ($scope, $filter, commonvariable, OrgUnit, OrgUnitGroupsOrgUnit, loadjsonresource, OrgUnitGroupByOrgUnit, FilterResource, $modal, DataSetsOrgUnit, GetMission, validatorService, OrganisationUnitChildren, OrgUnitOrgUnitGroups, healthsiteService) {
	var $translate = $filter('translate');
	
/*    $scope.initValue = function () {
        ///OrgunitGroupSet 
        $scope.siteTypeId = commonvariable.ouGroupsetId.SiteType;
        $scope.healthServiceId = commonvariable.ouGroupsetId.HealthService;
    }*/
	
    healthsiteService.initValue($scope);	
	
	//set message variable
	$scope.closeAlertMessage = function(index) {
       $scope.messages.splice(index, 1);
  	};
	
	$scope.messages=[];
	
	
	$scope.showfields=false;
	//console.log(commonvariable.OrganisationUnit);
	
	
	$scope.servicesave=function(){
		
		var healthServiceName="";
		var healthServiceCode="";
		var healthServiceSuffix="";
		
		if (commonvariable.OrganisationUnit.code!=undefined) {

			healthServiceName = commonvariable.OrganisationUnit.code.slice(8,11);
		}
		
		healthServiceName = healthServiceName + "_" + commonvariable.orgUnitGroupSet[commonvariable.ouGroupsetId.HealthService].name;

		loadjsonresource.get("healthservice").then(function(response) {
					
			healthServiceSuffix = getServiceSuffix(response.data.healthserviceSuffix).suffix;
			
			
			var prenewOu={//payload
			        name: commonvariable.orgUnitGroupSet[commonvariable.ouGroupsetId.HealthService].name,
					level:(commonvariable.OrganisationUnit.level+1),
					code: healthServiceSuffix,
		            shortName:healthServiceName,
		           	openingDate:$filter('date')($scope.healthServiceDate, 'yyyy-MM-dd'),
		           	parent: commonvariable.OrganisationUnitParentConf
					};
		    ///validate if object is ok.
			validatorService.emptyValue(prenewOu).then(function (result) {
			    if (result == false) {

			        healthServiceCode = commonvariable.OrganisationUnit.code + "_" + healthServiceSuffix;

			        if (commonvariable.OrganisationUnit.children.length > 0)
			            healthServiceCode = healthServiceCode + "_" + (commonvariable.OrganisationUnit.children.length + 1);

			        var newOu = {//payload
			            name: healthServiceName,
			            level: (commonvariable.OrganisationUnit.level + 1),
			            code: healthServiceCode,
			            shortName: healthServiceName,
			            openingDate: $filter('date')($scope.healthServiceDate, 'yyyy-MM-dd'),
			            parent: commonvariable.OrganisationUnitParentConf
			        };

			        OrgUnit.POST({}, newOu)
                    .$promise.then(function (data) {
                        console.log(data);
                        if (data.response.status == "SUCCESS") {
                            commonvariable.RefreshTreeOU = true;
                            newOu.id = data.response.lastImported;
                            commonvariable.NewOrganisationUnit = newOu;

                            if (commonvariable.orgUnitGroupSet[commonvariable.ouGroupsetId.HealthService] != undefined)
                                OrgUnitGroupsOrgUnit.POST({ uidgroup: commonvariable.orgUnitGroupSet[commonvariable.ouGroupsetId.HealthService].id, uidorgunit: newOu.id });


                            console.log(commonvariable.orgUnitGroupSet[commonvariable.ouGroupsetId.HealthService].name)


                            FilterResource.GET({ resource: 'dataSets', filter: 'code:eq:' + "DS_INFR_3" }).$promise
                              .then(function (response) {

                                  if (response.dataSets.length > 0) {

                                      var dataSet = response.dataSets[0];
                                      DataSetsOrgUnit.POST({ uidorgunit: newOu.id, uiddataset: dataSet.id });
                                  }

                              });

                            if (commonvariable.orgUnitGroupSet[commonvariable.ouGroupsetId.HealthService].name == "Vaccination") { //Assocate Vacc datasets 

                                GetMission.get({ uid: newOu.id }).$promise.then(function (data) {

                                    var nameMission = data.parent.parent.parent.name

                                    var nameVacDataSet = "Vaccination_" + nameMission

                                    FilterResource.GET({ resource: 'dataSets', filter: 'name:eq:' + nameVacDataSet }).$promise
                                      .then(function (response) {

                                          if (response.dataSets.length > 0) {

                                              var dataSet = response.dataSets[0];
                                              DataSetsOrgUnit.POST({ uidorgunit: newOu.id, uiddataset: dataSet.id });
                                          }

                                      });

                                });
                            }

                            var codeServiceType = undefined;

                            loadjsonresource.get("servicebyservicetype").then(function (response) {

                                codeServiceType = getServiceType(response.data.servicesByServiceType);

                                FilterResource.GET({ resource: 'organisationUnitGroups', filter: 'code:eq:' + codeServiceType }).$promise
                                  .then(function (response) {

                                      if (response.organisationUnitGroups.length > 0) {

                                          var orgUnitGroup = response.organisationUnitGroups[0];
                                          OrgUnitGroupsOrgUnit.POST({ uidgroup: orgUnitGroup.id, uidorgunit: newOu.id });

                                      }

                                  });


                            });


                            OrgUnitGroupByOrgUnit.get({ uid: commonvariable.OrganisationUnit.id }).$promise.then(function (response) {

                                listOrgUnitGroups = response.organisationUnitGroups;

                                angular.forEach(listOrgUnitGroups, function (value, key) {
                                    OrgUnitGroupsOrgUnit.POST({ uidgroup: value.id, uidorgunit: newOu.id });
                                });

                                /*for (var i=0;i<listOrgUnitGroups.length;i++)
                                    OrgUnitGroupsOrgUnit.POST({uidgroup:listOrgUnitGroups[i].id,uidorgunit:newOu.id});*/

                            });


                            //set message variable
                            $scope.messages.push({
                                type: "success",
                                text: "Health service saved"
                            });

                            //clear txtbox
                            $scope.healthServiceName = "";

                            $scope.frmService = false;

                        }
                        else {
                            $scope.messages.push({
                                type: "danger",
                                text: "Health service doesn't saved, review that the field name isn't empty"
                            });
                        }
                    });

			    }
			    else {
			        $scope.messages.push({
			            type: "warning",
			            text: $translate("FORM_MSG_EMPTYFIELD")
			        });
			    }


			});

		});

	};
	
	getServiceSuffix = function(healthserviceSuffix) {
		
		var services = healthserviceSuffix.service;
		
		
		var serviceResult = {};
		
		for (var i=0; i<services.length; i++) {
			
			if (services[i].code==commonvariable.orgUnitGroupSet[commonvariable.ouGroupsetId.HealthService].code) {
				serviceResult = services[i];
				break;
			}
			
		}
		
		return serviceResult;
		
	}
	
	getServiceType = function(servicesByServiceType) {
		
		var serviceTypes=servicesByServiceType.serviceType;
		
		var codeResult;
		
		var find = false;
		
		for (var i=0; i<serviceTypes.length; i++) {
			
			var serviceType = serviceTypes[i];
			
			if (find == true ) break;
			
			for (var j=0; j<serviceType.services.length; j++) {
				if (serviceType.services[j].code == commonvariable.orgUnitGroupSet[commonvariable.ouGroupsetId.HealthService].code) {
					find = true;
					codeResult = serviceType.code;
					break;
				}
					
			}
			
			
		}
		
		return codeResult;
			
	}
	
	
	$scope.showForm=function(frm){
		
		if(frm==1){
		    $scope.frmService = true;
		    commonvariable.clearForm["healthservice"] = true;
		    $scope.healthServiceDate = "";
		}
		else{
			$scope.frmService=false;
		}

		
	//	$scope.showfields=true;
	};
	
	$scope.$watch(
			function ($scope) {

				if(commonvariable.OrganisationUnit!=undefined && commonvariable.OrganisationUnit.id != $scope.prevOu){
					
					$scope.prevOu = commonvariable.OrganisationUnit.id;
					
					$scope.healthsitename=commonvariable.OrganisationUnit.name;
					$scope.healthsitecreated=commonvariable.OrganisationUnit.openingDate;
					$scope.healthsitecode=commonvariable.OrganisationUnit.code;
			}
			});
	
	
	// Date datepicker
	  $scope.today = function() {
	    datetoday = new Date();
	    $scope.healthServiceDate=datetoday.getFullYear()+"-"+((datetoday.getMonth()+1)<=9?"0"+(datetoday.getMonth()+1):(datetoday.getMonth()+1))+"-"+(datetoday.getDate()<=9?"0"+datetoday.getDate():datetoday.getDate());
	  };
	  $scope.today();
	  
	  $scope.opensitedate = function($event) {
		    $event.preventDefault();
		    $event.stopPropagation();
		    $scope.openedsite = true;
	  };
	  
	  $scope.openservicedate = function($event) {
		    $event.preventDefault();
		    $event.stopPropagation();
		    $scope.openedservice = true;
	  };
	  

	
    ////////////////////////For Edit //////////////////////////////////////////

    //set message variable
	  $scope.closeAlertMessage = function (index) {
	      $scope.messages.splice(index, 1);
	  };

	  $scope.messages = [];
    ///enable textBox
	  $scope.operation = 'show';
	  $scope.enableforEdit = function () {
	      $scope.operation = 'edit';
	      commonvariable.NewOrganisationUnit = [];
	      commonvariable.ouDirective = $scope.healthsitename
	  }
	  $scope.enableforshow = function () {
	      $scope.operation = 'show';
	  }
	  
	  
	  $scope.updateOrgUnits = function (orgUnits) {
		  
	      angular.forEach(orgUnits, function(orgUnit, key){
	    	  
	    	  $scope.updateOrgUnitGroups(orgUnit);	    	  	    	  
	      });
	      		  
	  }
	  
	  $scope.updateOrgUnitGroups = function (orgUnit) {
		  
		  var success=false
	         
		  if (typeof(commonvariable.preOrgUnitGroupSet[commonvariable.ouGroupsetId.SiteType])=="undefined")
			  OrgUnitOrgUnitGroups.POST({ uidorgunit: orgUnit.id, uidgroup: commonvariable.orgUnitGroupSet[commonvariable.ouGroupsetId.SiteType].id }).$promise.then(function(data){
				  if (data.$resolved==true)
					  if (orgUnit.level == commonvariable.level.HealthSite)
						  $scope.operation = 'show';
						  
			  })
	        	  
	      else if (commonvariable.preOrgUnitGroupSet[commonvariable.ouGroupsetId.SiteType].id != commonvariable.orgUnitGroupSet[commonvariable.ouGroupsetId.SiteType].id) {
	    	  OrgUnitOrgUnitGroups.DELETE({ uidorgunit: orgUnit.id, uidgroup: commonvariable.preOrgUnitGroupSet[commonvariable.ouGroupsetId.SiteType].id }).$promise.then(function(data){
		    	  OrgUnitOrgUnitGroups.POST({ uidorgunit: orgUnit.id, uidgroup: commonvariable.orgUnitGroupSet[commonvariable.ouGroupsetId.SiteType].id }).$promise.then(function(data){
					  if (data.$resolved==true)
						  if (orgUnit.level == commonvariable.level.HealthSite)
							  $scope.operation = 'show';
		    		  
		    	  })		    		  
	    	  });
	      }
	           		  
	  }	  

    ////Edit SITE
	  $scope.EditSite = function () {

	      var editOu = {//payload
	          name: commonvariable.ouDirective,
	          shortName: commonvariable.ouDirective,
	          openingDate: $filter('date')($scope.healthsitecreated, 'yyyy-MM-dd')
	      };

	      OrgUnit.PATCH({id:commonvariable.OrganisationUnit.id},editOu).$promise.then(function(data){
	    	  
	    	  if (data.response.status=="SUCCESS") {
	    		  
	    			
                  //asign OU selected 
	    	      commonvariable.EditOrganisationUnit = commonvariable.OrganisationUnit;
                  ///replace with new value
	    	      commonvariable.EditOrganisationUnit.name = editOu.name;
	    	      commonvariable.EditOrganisationUnit.shortName= editOu.name;
	    	      commonvariable.EditOrganisationUnit.code = commonvariable.OrganisationUnit.code;
	    	      commonvariable.EditOrganisationUnit.openingDate = editOu.openingDate;
                  //refresh tree for show change
	    	      commonvariable.RefreshTreeOU = true;
	    	      
		    	  OrganisationUnitChildren.get({ uid: data.response.lastImported, fields: 'name,id,code,level' }).$promise.then(function (response) {
		   			   
					   var children=response.organisationUnits;
	   			
					   $scope.updateOrgUnits(children)
						   
					   $scope.healthsitename =  commonvariable.ouDirective;				   					   

				   });	    	      

	    	      
	    	      $scope.messages.push({ type: "success", text: $translate('SITE_UPDATED') });
	    	      
	    	  }
	    	  else
					$scope.messages.push({type:"danger",
							text:"Health site doesn't saved, review that the field name isn't empty"});	
	      
	      });
	      ///

	
	  }


    ///Delete PROJECT
	  $scope.DeleteSite = function () {

	      ///
	      $scope.messages.push({ type: "success", text: $translate('SITE_DELETED') });

	  }



    /////modal for delete message

	  $scope.modalDelete = function (size) {

	      var modalInstance = $modal.open({
	          templateUrl: 'ModalConfirm.html',
	          controller: 'ModalConfirmCtrl',
	          size: size,
	          resolve: {
	              information: function () {
	                  return { tittle: $translate('HEALTHSITE_DELETE_TITTLE'), description: $translate('HEALTHSITE_DELETE_DESCRIPTION'), id: commonvariable.OrganisationUnit.id };
	              }
	          }
	      });

	      modalInstance.result.then(function (option) {
	          if (option == true) {
	              $scope.messages.push({ type: "success", text: $translate('HEALTHSITE_DELETED') });
	          }
	          else {
	              $scope.messages.push({ type: "error", text: $translate('HEALTHSITE_NODELETED') });
	          }
	      }, function () {
	          console.log('Modal dismissed at: ' + new Date());
	      });
	  };



}]);
