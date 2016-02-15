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

appConfigProjectMSF.controller('healthServiceController', ["$scope",'$filter',"commonvariable","$modal", "OrgUnit", "OrgUnitOrgUnitGroups", "OrgUnitGroupByOrgUnit", "loadjsonresource", "FilterResource", "OrgUnitGroupsOrgUnit", "healthserviceService", function($scope, $filter,commonvariable,$modal, OrgUnit, OrgUnitOrgUnitGroups, OrgUnitGroupByOrgUnit, loadjsonresource, FilterResource, OrgUnitGroupsOrgUnit, healthserviceService) {
	var $translate = $filter('translate');

	
	/*$scope.initValue = function () {
        $scope.healthServiceId = commonvariable.ouGroupsetId.HealthService;
        $scope.healthServiceTypeId = commonvariable.ouGroupsetId.HealthServiceType;
	}
	
	$scope.initValue();*/
	
	healthserviceService.initValue($scope);
	
	//set message variable
	$scope.closeAlertMessage = function(index) {
       $scope.messages.splice(index, 1);
  	};
	
	$scope.messages=[];
	
	
	$scope.showfields=false;
	//console.log(commonvariable.OrganisationUnit);
	//console.log(commonvariable.OrganisationUnitParentConf) //using as parent  for create OUs
	
	
	$scope.showForm=function(frm){
		
		if(frm==1){
			$scope.frmSite=true;
		}
		else{
			$scope.frmSite=false;
		}

		
	//	$scope.showfields=true;
	};

	$scope.$watch(
			function($scope) {
				if(commonvariable.OrganisationUnit!=undefined && commonvariable.OrganisationUnit.id != $scope.prevOu){
					
					$scope.prevOu = commonvariable.OrganisationUnit.id;
					
					$scope.healthservicename=commonvariable.OrganisationUnit.name;
					$scope.healthservicecreated=commonvariable.OrganisationUnit.openingDate;
					$scope.healthservicecode=commonvariable.OrganisationUnit.code;
					
			}
			});

	
	// Date datepicker
	  $scope.today = function() {
	    datetoday = new Date();
	    $scope.healthServiceDate=datetoday.getFullYear()+"-"+((datetoday.getMonth()+1)<=9?"0"+(datetoday.getMonth()+1):(datetoday.getMonth()+1))+"-"+(datetoday.getDate()<=9?"0"+datetoday.getDate():datetoday.getDate());
	  };
	  $scope.today();
	  
	  $scope.open = function($event) {
		    $event.preventDefault();
		    $event.stopPropagation();
		    $scope.opened = true;
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
	}
	$scope.enableforshow = function () {
	    $scope.operation = 'show';
	}
	
	
	$scope.updateEditOrgUnit = function(editOu){
		
        //asign OU selected 
	      commonvariable.EditOrganisationUnit = commonvariable.OrganisationUnit;
        ///replace with new value
	      commonvariable.EditOrganisationUnit.name = editOu.name;
	      commonvariable.EditOrganisationUnit.shortName= editOu.name;
	      commonvariable.EditOrganisationUnit.code = editOu.code;
	      commonvariable.EditOrganisationUnit.openingDate = editOu.openingDate;
        //refresh tree for show change
	      commonvariable.RefreshTreeOU = true;
	
	      $scope.operation = 'show';		
		
	}
	
    ////Edit SERVICE
	$scope.EditService = function () {

	  var editOu = {//payload
	        openingDate: $filter('date')($scope.healthservicecreated,'yyyy-MM-dd'),
	        name: commonvariable.OrganisationUnit.name,
	        shortName: commonvariable.OrganisationUnit.name,
	        code: commonvariable.OrganisationUnit.code
	  };
	    
	    
  	  if (typeof(commonvariable.orgUnitGroupSet[commonvariable.ouGroupsetId.HealthService])!="undefined") {
	  
	 

  		  /*if (typeof(commonvariable.preOrgUnitGroupSet[commonvariable.ouGroupsetId.HealthService])=="undefined")
			  OrgUnitOrgUnitGroups.POST({ uidorgunit: commonvariable.OrganisationUnit.id, uidgroup: commonvariable.orgUnitGroupSet[commonvariable.ouGroupsetId.HealthService].id })*/
	  
		  if (commonvariable.preOrgUnitGroupSet[commonvariable.ouGroupsetId.HealthService].id != commonvariable.orgUnitGroupSet[commonvariable.ouGroupsetId.HealthService].id) {
			  OrgUnitOrgUnitGroups.DELETE({ uidorgunit: commonvariable.OrganisationUnit.id, uidgroup: commonvariable.preOrgUnitGroupSet[commonvariable.ouGroupsetId.HealthService].id });
			  //OrgUnitOrgUnitGroups.DELETE({uidorgunit: commonvariable.OrganisationUnit.id, uidgroup: commonvariable.preOrgUnitGroupSet[commonvariable.ouGroupsetId.HealthServiceType].id});
			  deleteOrgUnitGroup(commonvariable.OrganisationUnit.id, commonvariable.ouGroupsetId.HealthServiceType)
			  OrgUnitOrgUnitGroups.POST({ uidorgunit: commonvariable.OrganisationUnit.id, uidgroup: commonvariable.orgUnitGroupSet[commonvariable.ouGroupsetId.HealthService].id });
			  
			  var sitePrefix = commonvariable.OrganisationUnit.name.slice(0,3)
			  var healthServiceName = sitePrefix + commonvariable.orgUnitGroupSet[commonvariable.ouGroupsetId.HealthService].name
				 
			  editOu.name = healthServiceName
				 
			  loadjsonresource.get("healthservice").then(function(response) {
						
				  healthServiceSuffix = getServiceSuffix(response.data.healthserviceSuffix).suffix;
						
				  healthServiceCode=commonvariable.OrganisationUnit.parent.code + "_" + healthServiceSuffix;
			  
				  if (commonvariable.OrganisationUnit.children.length>0)
					  healthServiceCode = healthServiceCode +"_" + (commonvariable.OrganisationUnit.parent.children.length + 1);

				  editOu.code = healthServiceCode		
				  
				  var codeServiceType = undefined;
				  
				  loadjsonresource.get("servicebyservicetype").then(function(response) {
				  
					  codeServiceType = getServiceType(response.data.servicesByServiceType);
					  
					  FilterResource.GET({resource:'organisationUnitGroups', filter:'code:eq:'+codeServiceType}).$promise
				  		.then(function(response){
				  			
				  			if (response.organisationUnitGroups.length>0) {
				  				
				  				var orgUnitGroup = response.organisationUnitGroups[0];
								OrgUnitGroupsOrgUnit.POST({uidgroup:orgUnitGroup.id, uidorgunit:commonvariable.OrganisationUnit.id});

				  			}
				  							  			
				  		});

					  
				  });

				  
				  OrgUnit.PATCH({id:commonvariable.OrganisationUnit.id},editOu).$promise.then(function(data){

				    	  if (data.response.status=="SUCCESS") {
				    		  
				    			
			                  $scope.updateEditOrgUnit(editOu)
			                  
				    	      $scope.messages.push({ type: "success", text: $translate('SERVICE_UPDATED') });

				    	  }
				    	
				   });
												
			   });	
			  
			  
		  }
		  else{
			    OrgUnit.PATCH({id:commonvariable.OrganisationUnit.id},editOu).$promise.then(function(data){
			    	  
			    	  if (data.response.status=="SUCCESS") {
			    		  
		                  $scope.updateEditOrgUnit(editOu)
			    	      
			    	      	    	    	    	      
			    	      
			    	      $scope.messages.push({ type: "success", text: $translate('SERVICE_UPDATED') });
			    	      
			    	  }
			    	  else
							$scope.messages.push({type:"danger",
									text:"Health site doesn't saved, review that the field name isn't empty"});

			      
			    });	    
			  
			  
		  }
		  
			  
		  
  	  }
  	  

	}
	
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
	
	function deleteOrgUnitGroup (uidOrgUnit, uidOrgUnitGroupSet) {
		
		OrgUnitGroupByOrgUnit.get({uid:uidOrgUnit}).$promise.then(function(data) {
			
			ouOrgUnitGroups=data.organisationUnitGroups;
			
			OrgUnitGroupSet.get({uid:uidOrgUnitGroupSet}).$promise.then(function(data) {
								
				ougsOrgUnitGroups=data.organisationUnitGroups;
				
			    try {
			    	
			    	var find = false;
			    	
			        for (var i = 0; i < ouOrgUnitGroups.length; i++) {
			        
			        	if (find == true) break;
			        
			            for (var j = 0; j < ougsOrgUnitGroups.length; j++) {
			                if (ouOrgUnitGroups[i].id == ougsOrgUnitGroups[j].id) {
			                	find = true;
			      			  	OrgUnitOrgUnitGroups.DELETE({uidorgunit: uidOrgUnit, uidgroup: ouOrgUnitGroups[i].id});

			                    break;
			                }
			            }
			            
			        }
			    } catch (err) { };
			    
			});
			
		});
		
	
	}
	





    ///Delete PROJECT
	$scope.DeleteService = function () {



	    ///
	    $scope.messages.push({ type: "success", text: $translate('SERVICE_DELETED') });

	}



    /////modal for delete message

	$scope.modalDelete = function (size) {

	    var modalInstance = $modal.open({
	        templateUrl: 'ModalConfirm.html',
	        controller: 'ModalConfirmCtrl',
	        size: size,
	        resolve: {
	            information: function () {
	                return { tittle: $translate('HEALTHSERVICE_DELETE_TITTLE'), description: $translate('HEALTHSERVICE_DELETE_DESCRIPTION'), id: commonvariable.OrganisationUnit.id };
	            }
	        }
	    });

	    modalInstance.result.then(function (option) {
	        if (option == true) {
	            $scope.messages.push({ type: "success", text: $translate('HEALTHSERVICE_DELETED') });
	        }
	        else {
	            $scope.messages.push({ type: "error", text: $translate('HEALTHSERVICE_NODELETED') });
	        }
	    }, function () {
	        console.log('Modal dismissed at: ' + new Date());
	    });
	};



}]);

