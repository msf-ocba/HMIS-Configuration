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

	
	var stop;
	$scope.prevOu = undefined;

	$scope.$watch(function () {
	    if (commonvariable.OrganisationUnit && commonvariable.OrganisationUnit.id != $scope.prevOu) {

	        commonvariable.DataElementSelected = [];
	        $scope.style = [];
 
	        $scope.prevOu = commonvariable.OrganisationUnit.id;
	    }
	});





    $scope.loadjson=function(callBack){
        $scope.GroupDE=[];
       loadjsonresource.get($scope.id)
        .then(function(response){
            $scope.services = response.data.datasetByService[0].service;
                //get code of data element
            angular.forEach($scope.services, function (vvalue, vkey) {
                    angular.forEach(vvalue.levels, function (lvalue, lkey) {
                        angular.forEach(lvalue.periods, function (pvalue, pkey) {
                            angular.forEach(pvalue.datasets, function (dvalue, dkey) {

                            });
                        });
                        

                    });

                 });

                if($scope.DEListCode){
                    callBack();
                }
        

        });

        
    }

    $scope.loadjson();

    $scope.selectgroup=function(key,skey){
        ///add dataelement selected of all group
         angular.forEach($scope.sections[skey].dataElementGroup[key].dataElements, function (dvalue, dkey) {
             commonvariable.DataElementSelected.push({ id: $scope.ListnameDataelement[dvalue.code].id });
         });

         //config style for list of DataElements
        if($scope.style[skey]==undefined)
            $scope.style[skey]=[];
        if($scope.style[skey][key]=='' || $scope.style[skey][key]==undefined)
            $scope.style[skey][key]='success';
        else
            $scope.style[skey][key]='';

    };

    $scope.selectgroupforEdit = function (key, skey) {
        ///add dataelement selected of all group
        angular.forEach($scope.sections[skey].dataElementGroup[key].dataElements, function (dvalue, dkey) {
            commonvariable.DataElementSelected.push({ id: $scope.ListnameDataelement[dvalue.code].id });
        });

        //config style for list of DataElements
        if ($scope.style[skey] == undefined)
            $scope.style[skey] = [];
        if ($scope.style[skey][key] == '' || $scope.style[skey][key] == undefined)
            $scope.style[skey][key] = 'success';       

    };

    }]);

