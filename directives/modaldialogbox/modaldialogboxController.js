
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

Dhis2Api.controller('ModalConfirmCtrl', function ($scope, $q, $modalInstance, information, OrgUnit, OrganisationUnitChildren, DataSetsOrgUnit, commonvariable) {
	$scope.information=information;

	$scope.ok = function () {
		console.log("Remove");
		console.log($scope.removeDatasets);
	    OrganisationUnitChildren.get({uid:$scope.information.id,fields:'name,id,dataSets'}).$promise.then(function(response){
			var targetOu = response.organisationUnits;
			var closeTargetOuPromises = targetOu.map(function (orgUnit) {
				return OrgUnit.PATCH({id: orgUnit.id}, 
					
					//{closedDate: $scope.closedate}
					[
						{
							"op": "replace",
							"path": "/closedDate",
							"value": $scope.closedate
						},
					]
					
					).$promise;
			});
// REMOVE dataasets when closing a proejct
var unassignDatasetsPromises=[];
if  ($scope.removeDatasets) {
			
	for (i in targetOu) {
		orgUnit=targetOu[i];
		for (x in orgUnit.dataSets) {
		ds=orgUnit.dataSets[x];
		unassignDatasetsPromises=unassignDatasetsPromises.concat(DataSetsOrgUnit.DELETE({"uidorgunit": orgUnit.id, "uiddataset":ds.id}).$promise);
		}
	}
//	return unassignDatasetsPromises;
/*	
	var unassignDatasetsPromises = targetOu.map(function (orgUnit) {
				var payload = {
					"deletions": orgUnit.dataSets.map(function (ds) { 
						
						return { "id": ds.id };
								})
				};
			console.log("OU");
				console.log(orgUnit.id);
				console.log(payload);
				//return DataSetsOrgUnit.DELETE({"uidorgunit": orgUnit.id, "uiddataset":ds.id}).$promise;
				//http://localhost:8989/dhis/api/organisationUnits/QsFDgg9tCoP/dataSets/pMIZK4leYjt
				return DataSetsOrgUnit.POST({"uidorgunit": orgUnit.id}, payload).$promise;
			});
			
*/	
			var prom=closeTargetOuPromises.concat(unassignDatasetsPromises);

			//$q.all(prom).then(function(result) {
			}
			if ($scope.removeDatasets==undefined || $scope.removeDatasets==false) { 
				var prom=closeTargetOuPromises;
			}
				$q.all(prom).then(function(result) {
				//$q.all(closeTargetOuPromises).then(function(result) {
				
				console.log(result);

				commonvariable.EditOrganisationUnit = commonvariable.OrganisationUnit;
				commonvariable.EditOrganisationUnit["children"] = [];
				commonvariable.EditOrganisationUnit["closedDate"] = $scope.closedate;
				commonvariable.RefreshTreeOU = true;

				$modalInstance.close(true);
			})
			
		});
	};

	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};

    // Date datepicker
	$scope.today = function () {
		datetoday = new Date();
		$scope.closedate = datetoday.getFullYear() + "-" +
			((datetoday.getMonth() + 1) <= 9 ? "0" + (datetoday.getMonth() + 1) : (datetoday.getMonth() + 1)) + "-" +
			(datetoday.getDate() <= 9 ? "0" + datetoday.getDate() : datetoday.getDate());
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
});