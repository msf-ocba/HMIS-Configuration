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

appConfigProjectMSF.controller('healthSiteController', ["$scope", '$filter', "commonvariable", "loadjsonresource", "$modal", "DataSetsOrgUnit", "validatorService", "healthsiteService", "commonService",
                                                        function ($scope, $filter, commonvariable, loadjsonresource, $modal, DataSetsOrgUnit, validatorService, healthsiteService, commonService) {
	var $translate = $filter('translate');
		
    healthsiteService.initValue($scope);	
	
	//set message variable
	$scope.closeAlertMessage = function(index) {
       $scope.messages.splice(index, 1);
  	};
	
	$scope.messages=[];
	
	
	$scope.showfields=false;
	
	
	$scope.servicesave=function(){
		
		var healthServiceName="";
		var healthServiceCode="";
		var healthServiceSuffix="";
		
		if (commonvariable.OrganisationUnit.code!=undefined) 
			healthServiceName = commonvariable.OrganisationUnit.code.slice(8,11);
		
	
		loadjsonresource.get("healthservice").then(function(response) {

		    try {
		        var nameforValidate = commonvariable.orgUnitGroupSet[commonvariable.ouGroupsetId.HealthService].name;
		    } catch (err) {
		        var nameforValidate = undefined;
		    }
		    

			var prenewOuValidate = {//payload
			    name: nameforValidate,
			    level: (commonvariable.OrganisationUnit.level + 1),
			    healthServiceSuffix: response.data.healthserviceSuffix,
		        openingDate: $filter('date')($scope.healthServiceDate, 'yyyy-MM-dd'),
			    parent: commonvariable.OrganisationUnitParentConf,
			    healthServiceId: commonvariable.orgUnitGroupSet[commonvariable.ouGroupsetId.healthServiceId]
			};
		    ///validate if object is ok.
			validatorService.emptyValue(prenewOuValidate).then(function (result) {
				
			    if (result == false) {

			        healthServiceSuffix = commonService.getServiceSuffix(response.data.healthserviceSuffix).suffix;
			        healthServiceName = healthServiceName + "_" + commonvariable.orgUnitGroupSet[commonvariable.ouGroupsetId.HealthService].name;
			       

			        var prenewOu = {//payload
			            name: commonvariable.orgUnitGroupSet[commonvariable.ouGroupsetId.HealthService].name,
			            level: (commonvariable.OrganisationUnit.level + 1),
			            code: healthServiceSuffix,
			            shortName: healthServiceName,
			            openingDate: $filter('date')($scope.healthServiceDate, 'yyyy-MM-dd'),
			            parent: commonvariable.OrganisationUnitParentConf
			        };


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
			        
			        healthsiteService.saveHealthService(newOu).then(function (result){
			        	
			        	commonvariable.RefreshTreeOU = true;
			        	
			        	if (result == true) {
	                        //set message variable
	                        $scope.messages.push({
	                            type: "success",
	                            text: "Health service saved"
	                        });

	                        //clear txtbox
	                        $scope.healthServiceName = "";

	                        $scope.frmService = false;			        		
			        	} else
                            $scope.messages.push({
                                type: "danger",
                                text: "Health service doesn't saved, review that the field name isn't empty"
                            });			        	
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
	  
	  
    ////Edit SITE
	  $scope.EditSite = function () {

	      var editOu = {//payload
	          name: commonvariable.ouDirective,
	          shortName: commonvariable.ouDirective,
	          openingDate: $filter('date')($scope.healthsitecreated, 'yyyy-MM-dd')
	      };
	      
	      healthsiteService.editHealthSite(commonvariable.OrganisationUnit.id, editOu).then(function(result){
	    	  if (result == true) {
	    	      commonvariable.RefreshTreeOU = true;
				  $scope.healthsitename =  commonvariable.ouDirective;		
				  $scope.operation = 'show';
		    	  $scope.messages.push({ type: "success", text: $translate('SITE_UPDATED') });
	    	  } else
	    		  $scope.messages.push({type:"danger",
						text:"Health site doesn't saved, review that the field name isn't empty"});	
	      }); 
	
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
