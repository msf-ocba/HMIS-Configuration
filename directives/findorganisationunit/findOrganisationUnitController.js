Dhis2Api.directive('d2Findorganisationunit', function(){
    return{
        restrict: 'E',
        templateUrl: 'directives/findorganisationunit/findOrganisationUnitView.html',
        scope: { field: '@', placeholder: '@', value: '@', operation: '@' }
    }
});

Dhis2Api.controller("findOrganisationUnitController", ['$scope','$http', 'OrganisationUnitFind',"commonvariable",function ($scope, $http, OrganisationUnitFind, commonvariable) {



    $scope.findOu = function () {

        OrganisationUnitFind.get({ filter: $scope.field + ':eq:' + $scope.mdname })
            .$promise.then(function (data) {

                if (data.organisationUnits.length > 0) {

                    if ($scope.operation == 'edit' && $scope.value != $scope.mdname) {
                        $scope.OrganisationUnitfound = data.organisationUnits;
                        $scope.alertOu = true;
                        $scope.ouExist = 'has-error';
                    }
                    else {
                        if ($scope.operation != 'edit') {
                            $scope.OrganisationUnitfound = data.organisationUnits;
                            $scope.alertOu = true;
                            $scope.ouExist = 'has-error';
                        }                       
                    }

                } else {
                    $scope.alertOu = false;
                    if ($scope.field == "name")
                        commonvariable.ouDirective = $scope.mdname;
                    else
                        commonvariable.ouDirectiveCode = $scope.mdname;

                    $scope.ouExist = '';

                }
            });


    }

    $scope.$watch(function () {

        if (commonvariable.OrganisationUnit && commonvariable.OrganisationUnit.id != $scope.prevOu) {
            $scope.prevOu = commonvariable.OrganisationUnit.id;
            $scope.mdname = $scope.value;
        }
        //if (($scope.mdname == undefined || $scope.mdname == "") && ($scope.value != undefined || $scope.value != "")) {
           // $scope.mdname=$scope.value;
        //}

        if($scope.operation =='show'){
            $scope.mdname = $scope.value;
            $scope.alertOu = false;
            $scope.ouExist = '';
        }
        if ($scope.operation != $scope.prevOperation) {
            try {
                if ($scope.operation == 'edit')
                    $scope.isDisabled = false;
                else {
                    $scope.isDisabled = true;
                }
                    $scope.prevOperation = $scope.operation;
  

            } catch (err) {
                console.log("Error, Organisation Unnit doesn't selected");
            };
        }
    });


}]);


