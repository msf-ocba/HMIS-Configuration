Dhis2Api.directive('d2Periodtype', function(){
	return{
		restrict: 'E',
		templateUrl: 'directives/periodtype/periodTypeView.html',
		scope:{
		    selected:'@selected'
		}
	};
});


Dhis2Api.controller("d2periodtypeController", ['$scope',"commonvariable",function ($scope, commonvariable) {
		$scope.Listperiod =commonvariable.Listperiod;
		$scope.selectperiod = function(PSelected){
			commonvariable.PeriodSelected=PSelected;
			$scope.PeriodSelected=PSelected.name;
		}

		$scope.$watch(
        function ($scope) {
            if ($scope.selected) {
                angular.forEach(commonvariable.Listperiod, function (value, key) {

                    if ($scope.selected == value.code) {
                        $scope.selectperiod(value);
                    }

                });
            }

        });
}]);