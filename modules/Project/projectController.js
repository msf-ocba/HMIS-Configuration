appConfigProjectMSF.controller('projectController', ["$scope",'$filter',"commonvariable", function($scope, $filter,commonvariable) {
	var $translate = $filter('translate');
	
	
	
	$scope.showfields=false;
	console.log(commonvariable.OrganisationUnit);
	
	$scope.showForm=function(){
		$scope.showfields=true;
	};
	$scope.hideForm=function(){
		$scope.mdname="";
		$scope.today();
		$scope.showfields=false;
	};
	
	$scope.$watch(
			function($scope) {
				if(commonvariable.OrganisationUnit!=undefined){
					$scope.projectname=commonvariable.OrganisationUnit.name;
					$scope.projectcreated=commonvariable.OrganisationUnit.created;
			}
			});
	
	
	// Date datepicker
	  $scope.today = function() {
	    datetoday = new Date();
	    $scope.mdopendate=datetoday.getFullYear()+"-"+((datetoday.getMonth()+1)<=9?"0"+(datetoday.getMonth()+1):(datetoday.getMonth()+1))+"-"+(datetoday.getDate()<=9?"0"+datetoday.getDate():datetoday.getDate());
	  };
	  $scope.today();
	  
	  $scope.open = function($event) {
		    $event.preventDefault();
		    $event.stopPropagation();
		    $scope.opened = true;
	  };
	  
	
}]);


