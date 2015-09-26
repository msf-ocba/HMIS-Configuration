appConfigProjectMSF.controller('healthServiceController', ["$scope",'$filter',"commonvariable","$modal", function($scope, $filter,commonvariable,$modal) {
	var $translate = $filter('translate');
	
	//set message variable
	$scope.closeAlertMessage = function(index) {
       $scope.messages.splice(index, 1);
  	};
	
	$scope.messages=[];
	
	
	$scope.showfields=false;
	console.log(commonvariable.OrganisationUnit);
	console.log(commonvariable.OrganisationUnitParentConf) //using as parent  for create OUs
	
	
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
				if(commonvariable.OrganisationUnit!=undefined){
					$scope.healthservicename=commonvariable.OrganisationUnit.name;
					$scope.healthservicecreated=commonvariable.OrganisationUnit.openingDate;
					$scope.healthservicecode=commonvariable.OrganisationUnit.code;
					
			}
			});

	
	
	
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
	}
	$scope.enableforshow = function () {
	    $scope.operation = 'show';
	}

    ////Edit SERVICE
	$scope.EditService = function () {

	    var newOu = {//payload
	        name: commonvariable.ouDirective,
	        level: commonvariable.OrganisationUnit.level,
	        shortName: commonvariable.ouDirective,
	        openingDate: $scope.mdopendate,
	        parent: commonvariable.OrganisationUnitParentConf
	    };

	    ///
	    $scope.messages.push({ type: "success", text: $translate('SERVICE_UPDATED') });


	}




    ///Delete PROJECT
	$scope.DeleteService = function () {



	    ///
	    $scope.messages.push({ type: "success", text: $translate('SERVICE_DELETED') });

	}



    /////modal for delete message

	$scope.modalDelete = function (size) {

	    var modalInstance = $modal.open({
	        templateUrl: 'modalDeleted.html',
	        controller: 'ModalDeleted',
	        size: size,
	        resolve: {
	            items: function () {
	                return $scope.items;
	            }
	        }
	    });

	    modalInstance.result.then(function (option) {
	        if (option) {
	            //method for delete mission
	            $scope.DeleteService();
	        }
	    }, function () {
	        console.log('Modal dismissed at: ' + new Date());
	    });
	};



}]);


appConfigProjectMSF.controller('ModalDeleted', function ($scope, $modalInstance) {


    $scope.ok = function () {
        $modalInstance.close(true);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});

