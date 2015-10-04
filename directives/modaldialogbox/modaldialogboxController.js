Dhis2Api.directive('d2Modaldialogbox', function(){
	return{
		restrict: 'E',
		templateUrl: 'directives/modaldialogbox/modaldialogboxView.html'
	}
	}); 
Dhis2Api.controller("d2modaldialogboxController", ['$scope','$modal', function ($scope, $modal) {
    
}]);

Dhis2Api.controller('ModalConfirmCtrl', function ($scope, $modalInstance,information, OrgUnit, OrganisationUnitChildren, DataSetsOrgUnit) {
	$scope.information=information;
	$scope.ok = function () {

	    ////Jose este es el id de la OU para desencadenar el borrado
	    console.log($scope.information.id);

	    
	    /////aqui todo el codigo de borrar
	    //si se desea regresar algun valor por ejemplo si elimino perfectamente retrona true de lo contrario false dnetro de close()
	    //$modalInstance.close(false);

	    
	   OrgUnit.PATCH({id:$scope.information.id},{closedDate:$scope.closedate}).$promise.then(function(data){
	    	  
	   if (data.response.status=="SUCCESS") {

		    OrganisationUnitChildren.get({uid:$scope.information.id,fields:'name,id,code,level,openingDate,shortName,dataSets'}).$promise.then(function(response){
	   			   
				   var children=response.organisationUnits;
				   
				   angular.forEach(children, function(valueOU, keyOU){

					   OrgUnit.PATCH({id:valueOU.id},{closedDate:$scope.closedate});					   
					   
					   var dataSets=valueOU.dataSets;
					   
					   angular.forEach(dataSets, function(valueDS, keyDS){
							DataSetsOrgUnit.DELETE({uidorgunit:valueOU.id, uiddataset:valueDS.id});				   				 						   
					   })
					   
				   });
				   			
				   /*for (var i=0; i<children.length;i++) {
					   
					   OrgUnit.PATCH({id:children[i].id},{closedDate:$scope.closedate});					   
					   
					   var dataSets=children[i].dataSets;
					   
					   for (var j=0; j<dataSets.length; j++)
							DataSetsOrgUnit.DELETE({uidorgunit:children[i].id, uiddataset:dataSets[j].id});				   				 
					   
				   }*/
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