Dhis2Api.directive('d2Findorganisationunit', function(){
    return{
        restrict: 'E',
        templateUrl: 'directives/findorganisationunit/findOrganisationUnitView.html',
        scope: {field:'@', placeholder:'@'}
    }
});

Dhis2Api.controller("findOrganisationUnitController", ['$scope','$http', 'OrganisationUnitFind',"commonvariable",function ($scope, $http, OrganisationUnitFind, commonvariable) {
    $scope.findOu =function() {

        OrganisationUnitFind.get({filter: $scope.field + ':eq:' + $scope.mdname})
            .$promise.then(function (data) {

                if (data.organisationUnits.length > 0) {

                        $scope.OrganisationUnitfound = data.organisationUnits;
                        $scope.alertOu = true;
                        $scope.ouExist = 'has-error';

                } else{
                    $scope.alertOu = false;
                    if ($scope.field=="name")
                       commonvariable.ouDirective=$scope.mdname;
                    else
                        commonvariable.ouDirectiveCode=$scope.mdname;

                    $scope.ouExist = '';

            }
        }
        )


}}]);


