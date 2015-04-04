appConfigProjectMSF.controller('missionController', ["$scope",'$filter',"commonvariable","Mission", function($scope, $filter,commonvariable,Mission) {
	var $translate = $filter('translate');

	console.log(commonvariable.OrganisationUnit);

	$scope.missionsave=function(){
		Mission.POST({uid:commonvariable.OrganisationUnit.id,name:$scope.mdname,openingDate:$scope.mdopendate});
		console.log($scope.mdname);

		$scope.showfields=function(){
			$scope.show=true;
		}

		$scope.$watch(
			function($scope) {
				$scope.orgunitname=commonvariable.OrganisationUnit.name;
			});



	};
}]);


