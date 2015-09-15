appConfigProjectMSF.controller('healthServiceController', ["$scope",'$filter',"commonvariable", function($scope, $filter,commonvariable) {
	var $translate = $filter('translate');
	
	//set message variable
	$scope.closeAlertMessage = function(index) {
       $scope.messages.splice(index, 1);
  	};
	
	$scope.messages=[];
	
	
	$scope.showfields=false;
	console.log(commonvariable.OrganisationUnit);
	
	
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
					
			}
			});

	
	
	
}]);


