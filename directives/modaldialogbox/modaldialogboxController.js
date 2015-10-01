Dhis2Api.directive('d2Modaldialogbox', function(){
	return{
		restrict: 'E',
		templateUrl: 'directives/modaldialogbox/modaldialogboxView.html'
	}
	}); 
Dhis2Api.controller("d2modaldialogboxController", ['$scope','$modal',function ($scope, $modal) {
    
}]);

Dhis2Api.controller('ModalConfirmCtrl', function ($scope, $modalInstance,information) {
	$scope.information=information;
	$scope.ok = function () {

	    ////Jose este es el id de la OU para desencadenar el borrado
	    console.log($scope.information.id);
	    /////aqui todo el codigo de borrar
	    //si se desea regresar algun valor por ejemplo si elimino perfectamente retrona true de lo contrario false dnetro de close()
         $modalInstance.close(true);
	    //$modalInstance.close(false);

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