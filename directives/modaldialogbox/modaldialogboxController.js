
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

Dhis2Api.directive('d2Modaldialogbox', function(){
	return{
		restrict: 'E',
		templateUrl: 'directives/modaldialogbox/modaldialogboxView.html'
	}
	}); 
Dhis2Api.controller("d2modaldialogboxController", ['$scope','$modal', function ($scope, $modal) {
    
}]);

Dhis2Api.controller('ModalConfirmCtrl', function ($scope, $modalInstance,information, OrgUnit, OrganisationUnitChildren, DataSetsOrgUnit, commonvariable) {
	$scope.information=information;
	$scope.ok = function () {

	    console.log($scope.information.id);

	    //si se desea regresar algun valor por ejemplo si elimino perfectamente retrona true de lo contrario false dnetro de close()
	    //$modalInstance.close(false);

	    
	   OrgUnit.PATCH({id:$scope.information.id},{closedDate:$scope.closedate}).$promise.then(function(data){
	    	  
	   if (data.response.status=="SUCCESS") {

		    OrganisationUnitChildren.get({uid:$scope.information.id,fields:'name,id,code,level,openingDate,shortName,dataSets'}).$promise.then(function(response){
	   			   
		    	
		        commonvariable.EditOrganisationUnit = commonvariable.OrganisationUnit;
		        commonvariable.EditOrganisationUnit["children"] = [];
		    	commonvariable.EditOrganisationUnit["closedDate"] = $scope.closedate;
		    	commonvariable.RefreshTreeOU = true;
		    	var children=response.organisationUnits;
				   
				   angular.forEach(children, function(valueOU, keyOU){
				       if ($scope.information.id != valueOU.id) {
				           OrgUnit.PATCH({ id: valueOU.id }, { closedDate: $scope.closedate });

				           var dataSets = valueOU.dataSets;

				           angular.forEach(dataSets, function (valueDS, keyDS) {
				               DataSetsOrgUnit.DELETE({ uidorgunit: valueOU.id, uiddataset: valueDS.id });
				           })
				       }

				   });
				   
				   			
			});	
		   	       
		    $modalInstance.close(true);		   		   
	   }
	   else $modalInstance.close(false);
	   
	   });
	    
	    	  
	    	    	    
	  };

	  $scope.cancel = function () {
	    $modalInstance.dismiss('cancel');
	  };


    // Date datepicker
	  $scope.today = function () {
	      datetoday = new Date();
	      $scope.closedate = datetoday.getFullYear() + "-" + ((datetoday.getMonth() + 1) <= 9 ? "0" + (datetoday.getMonth() + 1) : (datetoday.getMonth() + 1)) + "-" + (datetoday.getDate() <= 9 ? "0" + datetoday.getDate() : datetoday.getDate());
	  };

	  $scope.today();

	  $scope.clear = function () {
	      $scope.closedate = null;
	  };

	  $scope.open = function ($event) {
	      $event.preventDefault();
	      $event.stopPropagation();
	      $scope.opened = true;
	  };
    /////////////////////////////////////////
	});