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

appConfigProjectMSF.controller('missionController', ["$scope", '$filter', "commonvariable", "OrgUnit", "OrgUnitGroupsOrgUnit", "DataSets", "OrgUnitChildren", "FilterResource", "DataSetsOrgUnit", "$modal", "User", "validatorService", function ($scope, $filter, commonvariable, OrgUnit, OrgUnitGroupsOrgUnit, DataSets, OrgUnitChildren, FilterResource, DataSetsOrgUnit, $modal, User, validatorService) {
    var $translate = $filter('translate');
    //Load Data of OU selected
    $scope.prevOu = "";
    $scope.showbutton = true;
    $scope.CreateDatasetVaccination = true;

    $scope.initValue = function () {

        ///OrgunitGroupSet 
        $scope.projectTypeId = commonvariable.ouGroupsetId.ProjectType;
        $scope.populationTypeId = commonvariable.ouGroupsetId.PopulationType;
        $scope.typeManagementID = commonvariable.ouGroupsetId.TypeManagement;
        $scope.gsEventID = commonvariable.ouGroupsetId.Event;
        $scope.gsContextID = commonvariable.ouGroupsetId.Context;
    }
    $scope.initValue();
   

    // if there exist Vaccination DataSet   then show the DataElements  
    $scope.showDataSetforEdit = function () {
        $scope.showForm(2);
    }
    //set message variable
	$scope.closeAlertMessage = function(index) {
       $scope.messages.splice(index, 1);
  	};
	
	$scope.messages=[];
	
	
	
	$scope.showfields=false;
	
	
	$scope.saveusers=function(){
		
		var user
		
		for (var i=0; i<=10;i++) {
			
			user={}
			user.surname = commonvariable.userDirective
			user.userCredentials= {}
			user.userCredentials.password=commonvariable.users.passwd
			user.organisationUnits = [{"id":commonvariable.NewOrganisationUnit.id}]
			user.dataViewOrganisationUnits = [{"id":commonvariable.NewOrganisationUnit.id}]
			user.userGroups = [{"id":commonvariable.users.uid_project_users_userGroup}]
			
			if (i == 0) { //MFP User
				user.firstName = commonvariable.users.postfix_mfp
				user.userCredentials.userRoles = [{"id":commonvariable.users.uid_role_mfp}]
				user.userCredentials.username=commonvariable.users.prefix + "-" + commonvariable.userDirective + "-" + commonvariable.users.postfix_mfp				
			} else { //FIELD User
				user.firstName = commonvariable.users.postfix_fielduser + i
				user.userCredentials.userRoles = [{"id":commonvariable.users.uid_role_fielduser}]
				user.userCredentials.username=commonvariable.users.prefix + "-" + commonvariable.userDirective + "-" + commonvariable.users.postfix_fielduser + i				
			}
			
			console.log(user)
			
			User.POST(user).$promise.then(function (data) {
				
				console.log(data)
				
			});
			
		}
		
		
	}

	///Save project
	$scope.projectsave=function(){


		var newOu={//payload
				name:commonvariable.ouDirective,
				level:(commonvariable.OrganisationUnit.level+1),
				code:commonvariable.ouDirectiveCode,
	            shortName:commonvariable.ouDirective,
	            openingDate: $filter('date')($scope.propendate,'yyyy-MM-dd'),
	           	parent: commonvariable.OrganisationUnitParentConf
				};
	    ///validate if object is ok.
		validatorService.emptyValue(newOu).then(function (result) {
		    if (result == false)
		    {

		OrgUnit.POST({},newOu)
		.$promise.then(function(data){
    		  console.log(data);
    		 // if (data.response.status == "SUCCESS") { ///verificar que en la versi�n 2.19 y 2.20 sea data.response.status
    		  if (data.response.importCount.imported >= 1) {
    		      commonvariable.RefreshTreeOU=true;
				  newOu.id=data.response.lastImported;
				  commonvariable.NewOrganisationUnit=newOu;
				 
				  if (commonvariable.orgUnitGroupSet[commonvariable.ouGroupsetId.ProjectType] != undefined)
				      OrgUnitGroupsOrgUnit.POST({uidgroup:commonvariable.orgUnitGroupSet[commonvariable.ouGroupsetId.ProjectType].id, uidorgunit:newOu.id});
				  if (commonvariable.orgUnitGroupSet[commonvariable.ouGroupsetId.PopulationType] != undefined)
				      OrgUnitGroupsOrgUnit.POST({ uidgroup: commonvariable.orgUnitGroupSet[commonvariable.ouGroupsetId.PopulationType].id, uidorgunit: newOu.id });
				  if (commonvariable.orgUnitGroupSet[commonvariable.ouGroupsetId.TypeManagement] != undefined)
				      OrgUnitGroupsOrgUnit.POST({ uidgroup: commonvariable.orgUnitGroupSet[commonvariable.ouGroupsetId.TypeManagement].id, uidorgunit: newOu.id });
				  if (commonvariable.orgUnitGroupSet[commonvariable.ouGroupsetId.Event] != undefined)
				      OrgUnitGroupsOrgUnit.POST({ uidgroup: commonvariable.orgUnitGroupSet[commonvariable.ouGroupsetId.Event].id, uidorgunit: newOu.id });
				  if (commonvariable.orgUnitGroupSet[commonvariable.ouGroupsetId.Context] != undefined)
				      OrgUnitGroupsOrgUnit.POST({ uidgroup: commonvariable.orgUnitGroupSet[commonvariable.ouGroupsetId.Context].id, uidorgunit: newOu.id });
				  

				  FilterResource.GET({resource:'dataSets', filter:'code:eq:'+"DS_VST_3"}).$promise
				  		.then(function(response){
				  			
				  			if (response.dataSets.length>0) {
				  				
				  				var dataSet = response.dataSets[0];
				  				DataSetsOrgUnit.POST({uidorgunit:newOu.id, uiddataset:dataSet.id});
				  			}
				  							  			
				  		});
				  				  
				  
				  $scope.saveusers();
				  
				 //set message variable
				  $scope.messages.push({ type: "success", text: $translate('PROJECT_SAVED') });
				  $scope.hideForm();
				//clear txtbox
				$scope.projectName="";

			}
			else{
    		      $scope.messages.push({ type: "danger", text: $translate('PROJECT_NOSAVED') });
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

				
	};
	
	
	$scope.showForm = function (frm) {
	    $scope.showbutton = false;

	   
		if(frm==1){
		    ///Clear form /////////////
		    commonvariable.clearForm["username"] = true;
		    commonvariable.clearForm["contextid"] = true;
		    commonvariable.clearForm["eventid"] = true;
		    commonvariable.clearForm["typemanager"] = true;
		    commonvariable.clearForm["populationtype"] = true;
		    commonvariable.clearForm["projecttype"] = true;
		    commonvariable.clearForm["projectcode"] = true;
		    commonvariable.clearForm["projectname"] = true;
		    $scope.propendate = "";

            //////////////////////////
			$scope.frmVaccination=false;
			$scope.frmProject=true;
			commonvariable.orgUnitGroupSet[commonvariable.ouGroupsetId.ProjectType] = undefined
			commonvariable.orgUnitGroupSet[commonvariable.ouGroupsetId.PopulationType] = undefined
			commonvariable.orgUnitGroupSet[commonvariable.ouGroupsetId.TypeManagement] = undefined
			commonvariable.orgUnitGroupSet[commonvariable.ouGroupsetId.Event] = undefined
			commonvariable.orgUnitGroupSet[commonvariable.ouGroupsetId.Context] = undefined						
		}
		else{
			$scope.frmVaccination=true;
			$scope.frmProject=false;
		}

	};

	$scope.hideForm=function(){
		$scope.projectName="";
		$scope.today();
		$scope.showfields=false;
		$scope.frmVaccination=false;
		$scope.frmProject = false;
		$scope.showbutton = true;

		$scope.getChildrenByOUID(commonvariable.OrganisationUnit.id);
		$scope.vaccinationName="";
		$scope.vaccinationCode="";
	    $scope.dataSetDescription=""
	    commonvariable.PeriodSelected=[];
	    commonvariable.DataElementSelected = [];
	};

    // Date datepicker
	  $scope.today = function() {
	    datetoday = new Date();
	    $scope.propendate=datetoday.getFullYear()+"-"+((datetoday.getMonth()+1)<=9?"0"+(datetoday.getMonth()+1):(datetoday.getMonth()+1))+"-"+(datetoday.getDate()<=9?"0"+datetoday.getDate():datetoday.getDate());
	  };
	  
	  $scope.today();

	  $scope.clear = function () {
	    $scope.propendate = null;
	  };

	   $scope.open = function($event) {
		    $event.preventDefault();
		    $event.stopPropagation();
		    $scope.opened = true;
	  };
    /////////////////////////////////////////

	 
	   $scope.getChildrenByOUID = function (uidSelected) {
	       OrgUnitChildren.get({ uid :uidSelected})
           .$promise.then(function (dataChild){
               $scope.ListChildren = dataChild.children;
	        });
	   }
    ///
	   $scope.$watch(function () {
	       if (commonvariable.OrganisationUnit && commonvariable.OrganisationUnit.id != $scope.prevOu) {
	           try {

	               $scope.missionname = commonvariable.OrganisationUnit.name;
	               $scope.missioncreated = commonvariable.OrganisationUnit.openingDate;
	               $scope.prevOu = commonvariable.OrganisationUnit.id;
	               $scope.hideForm();
	               //get Children for OU selected

	               $scope.getChildrenByOUID(commonvariable.OrganisationUnit.id);
	           } catch (err) {
	               console.log("Error, Organisation Unnit doesn't selected");
	           };
	       }
	   });
    
    ////////////////////////For Edit //////////////////////////////////////////

    ///enable textBox
	   $scope.operation = 'show';
	   $scope.enableforEdit = function () {
	       $scope.operation = 'edit';
	       commonvariable.NewOrganisationUnit = [];
	   }
	   $scope.enableforshow = function () {
	       $scope.operation = 'show';
	   }

    ////Edit mission
	   $scope.EditMission = function () {
		   
	       var newOu = {//payload
	           name: commonvariable.ouDirective,
	           level: commonvariable.OrganisationUnit.level,
	           shortName: commonvariable.ouDirective,
	           openingDate: $scope.mdopendate,
	           parent: commonvariable.OrganisationUnitParentConf
	       };

	       ///
	       $scope.messages.push({ type: "success", text: $translate('MISSION_UPDATED') });


	   }



   /////modal for delete message

	   $scope.modalDelete = function (size) {

	       var modalInstance = $modal.open({
	           templateUrl: 'ModalConfirm.html',
	           controller: 'ModalConfirmCtrl',
	           size: size,
	           resolve: {
	               information: function () {
	                   return { tittle: $translate('MISSION_DELETE_TITTLE'), description: $translate('MISSION_DELETE_DESCRIPTION'), id: commonvariable.OrganisationUnit.id };
	               }
	           }
	       });

	       modalInstance.result.then(function (option) {
	           if (option == true) {
	               $scope.messages.push({ type: "success", text: $translate('MISSION_DELETED') });
	           }
	           else {
	               $scope.messages.push({ type: "error", text: $translate('MISSION_NODELETED') });
	           }
	       }, function () {
	           console.log('Modal dismissed at: ' + new Date());
	       });
	   };

	
  
}]);



