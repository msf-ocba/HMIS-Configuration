appConfigProjectMSF.controller('operationalCenterController', ["$scope",'$filter',"commonvariable","Mission", function($scope, $filter,commonvariable,Mission) {
	var $translate = $filter('translate');
	$scope.showfields=false;
	console.log(commonvariable.OrganisationUnit);
	$scope.missionsave=function(){
		Mission.POST(
				{//parameters
				uid:commonvariable.OrganisationUnit.id
				},{//payload
				name:$scope.mdname,
				shortName:$scope.mdname,
				openingDate:$scope.mdopendate
				});
	};
	$scope.showForm=function(){
		$scope.showfields=true;
	};
	$scope.hideForm=function(){
		$scope.mdname="";
		$scope.today();
		$scope.showfields=false;
	};
	
	// Date datepicker
	  $scope.today = function() {
	    datetoday = new Date();
	    $scope.mdopendate=datetoday.getFullYear()+"-"+((datetoday.getMonth()+1)<=9?"0"+(datetoday.getMonth()+1):(datetoday.getMonth()+1))+"-"+(datetoday.getDate()<=9?"0"+datetoday.getDate():datetoday.getDate());
	  };
	  $scope.today();

	  $scope.clear = function () {
	    $scope.mdopendate = null;
	  };

	   $scope.open = function($event) {
		    $event.preventDefault();
		    $event.stopPropagation();
		    $scope.opened = true;
	  };
/////////////////////////////////////////
}]);


