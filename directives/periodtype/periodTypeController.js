Dhis2Api.directive('d2Periodtype', function(){
	return{
		restrict: 'E',
		templateUrl: 'directives/periodtype/periodTypeView.html'
	};
});


Dhis2Api.controller("d2periodtypeController", ['$scope',"commonvariable",function ($scope, commonvariable) {
		$scope.Listperiod =commonvariable.Listperiod;
		$scope.selectperiod = function(PSelected){
			commonvariable.PeriodSelected=PSelected;
			$scope.PeriodSelected=PSelected.name;
		}
}]);