appConfigProjectMSF.controller('missionController', ["$scope",'$filter',"commonvariable","Mission", function($scope, $filter,commonvariable,Mission) {
	var $translate = $filter('translate');
	$scope.showfields=false;
	console.log(commonvariable.OrganisationUnit);
	$scope.missionsave=function(){
		Mission.POST(
			{
			name:$scope.mdname,
			level:(commonvariable.OrganisationUnit.level+1),
            shortName:$scope.mdname,
           	openingDate:$scope.mdopendate,
            parent:commonvariable.OrganisationUnit.id
			});
		console.log($scope.mdname);
	};
	$scope.showForm=function(){
		$scope.showfields=true;
	};
	$scope.hideForm=function(){
		$scope.projectName="";
		$scope.today();
		$scope.showfields=false;
	};
	$scope.$watch(
		function($scope) {
			$scope.missionname=commonvariable.OrganisationUnit.name;
			$scope.missioncreated=commonvariable.OrganisationUnit.created;
		});
	
    // Date datepicker
	  $scope.today = function() {
	    datetoday = new Date();
	    $scope.projectDate=datetoday.getFullYear()+"-"+((datetoday.getMonth()+1)<=9?"0"+(datetoday.getMonth()+1):(datetoday.getMonth()+1))+"-"+(datetoday.getDate()<=9?"0"+datetoday.getDate():datetoday.getDate());
	  };
	  $scope.today();

	  $scope.clear = function () {
	    $scope.projectDate = null;
	  };

	   $scope.open = function($event) {
		    $event.preventDefault();
		    $event.stopPropagation();
		    $scope.opened = true;
	  };
/////////////////////////////////////////
	
}]);


