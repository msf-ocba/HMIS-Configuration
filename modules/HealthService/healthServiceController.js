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

appConfigProjectMSF.controller('healthServiceController', ["$scope",'$filter',"commonvariable","$modal", "healthserviceService", "commonService", "OrgUnit",
                                                           function($scope, $filter,commonvariable,$modal, healthserviceService, commonService, OrgUnit) {
	var $translate = $filter('translate');

	
	healthserviceService.initValue($scope);
	
	//set message variable
	$scope.closeAlertMessage = function(index) {
       $scope.messages.splice(index, 1);
  	};
	
	$scope.messages=[];

	$scope.showfields=false;
	
	$scope.showForm = function(frm){
		$scope.frmSite = (frm == 1);
	};

	$scope.$watch(
		function($scope) {
			
			if(commonvariable.OrganisationUnit!=undefined && commonvariable.OrganisationUnit.id != $scope.prevOu){

				$scope.operation = 'show';
				$scope.messages = [];

				$scope.prevOu = commonvariable.OrganisationUnit.id;

				$scope.name = commonvariable.OrganisationUnit.name;
			
				$scope.healthservicecreated = commonvariable.OrganisationUnit.openingDate;
				$scope.code = commonvariable.OrganisationUnit.code;
			}
		}
	);

	
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

	$scope.operation = 'show';

	$scope.enableforEdit = function () {
	    $scope.operation = 'edit';
	    commonvariable.NewOrganisationUnit = [];
	};

	$scope.enableforshow = function () {
	    $scope.operation = 'show';
	};
	
	
	$scope.updateEditOrgUnit = function(editOu){
		
        //asign OU selected 
	      commonvariable.EditOrganisationUnit = commonvariable.OrganisationUnit;
        ///replace with new value
	      commonvariable.EditOrganisationUnit.name = editOu[0].value;
	      commonvariable.EditOrganisationUnit.shortName= editOu[1].value;
	      commonvariable.EditOrganisationUnit.code = editOu[2].value;
	      commonvariable.EditOrganisationUnit.openingDate = editOu[3].value;
        //refresh tree for show change
	      commonvariable.RefreshTreeOU = true;
	
	      $scope.operation = 'show';		
		
	};
	
    ////Edit SERVICE
	$scope.EditService = function () {
/*
		var editOu = {//payload
	        openingDate: $filter('date')($scope.healthservicecreated, 'yyyy-MM-dd'),
	        name: $scope.name,
	        shortName: $scope.name.substr(0,50),
	        code: $scope.code
		};
		*/

		var editOu = [//payload
		{"op": "replace", "path": "/name", "value": $scope.name},
		{"op": "replace", "path": "/shortName", "value":  $scope.name.substr(0,50)},
		{"op": "replace", "path": "/code", "value": $scope.code},
		{"op": "replace", "path": "/openingDate", "value":$filter('date')($scope.healthservicecreated, 'yyyy-MM-dd')}
];
		if (typeof(commonvariable.orgUnitGroupSet[commonvariable.ouGroupsetId.HealthService])!="undefined") {

			healthserviceService.editHealthService(commonvariable.OrganisationUnit.id, editOu, $scope).then(function(updated){
				if (updated) {
					commonvariable.RefreshTreeOU = true;
					$scope.operation = 'show';

					$scope.messages.push({ type: "success", text: $translate('SERVICE_UPDATED') });
				}
				else {
					$scope.messages.push({type:"danger", text:"Health service doesn't saved, review that the field name isn't empty"});
				}
			});
		}
	};
	

    ///Delete PROJECT
	$scope.DeleteService = function () {
		$scope.messages.push({ type: "success", text: $translate('SERVICE_DELETED') });
	};

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

