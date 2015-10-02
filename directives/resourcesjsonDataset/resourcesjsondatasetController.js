Dhis2Api.directive('d2Resourcejsondataset', function(){
	return{
		restrict: 'E',
		templateUrl: 'directives/resourcesjsonDataset/resourcesjsondatasetView.html',
		scope: {
		    id: '@'
		    }
	}
	}); 
Dhis2Api.controller("d2ResourcejsondatasetController", ['$scope', '$interval', "commonvariable", "loadjsonresource", "DataElements", function ($scope, $interval, commonvariable, loadjsonresource, DataElements) {
    $scope.style=[];
    $scope.datasetcodeSelected = [];
	
    var stop;
    $scope.prevOu = undefined;

    $scope.$watch(function () {
        if (commonvariable.OrganisationUnit && commonvariable.OrganisationUnit.id != $scope.prevOu) {

            commonvariable.DataElementSelected = [];
            $scope.style = [];
 
            $scope.prevOu = commonvariable.OrganisationUnit.id;
        }
    });





    $scope.loadlevel=function(callBack){
        $scope.GroupDE=[];
       loadjsonresource.get($scope.id)
        .then(function(response){
            $scope.services = response.data.datasetByService[0].service;
              angular.forEach($scope.services, function (svalue, skey) {
                if (svalue.name == commonvariable.OrganisationUnit.name) 
                    $scope.levels = svalue.levels;
                 });
         });
    }

    $scope.loadlevel();

    $scope.selectdataset= function(dcode) {
        
        var index = $scope.datasetcodeSelected.indexOf(dcode);
        if (index > -1) {
            $scope.datasetcodeSelected.splice(index, 1);
            $scope.style[dcode] = '';
        }
        else {
            $scope.style[dcode] = 'success';
            $scope.datasetcodeSelected.push(dcode);
        }

        console.log($scope.datasetcodeSelected);
    };

   }]);

