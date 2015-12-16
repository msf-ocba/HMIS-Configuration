Dhis2Api.directive('d2Resourcejsondataset', function(){
	return{
		restrict: 'E',
		templateUrl: 'directives/resourcesjsonDataset/resourcesjsondatasetView.html',
		scope: {
		    id: '@'
		    }
	}
	}); 
Dhis2Api.controller("d2ResourcejsondatasetController", ['$scope', '$interval', "commonvariable", "loadjsonresource", "OrgUnit", "DataSets", function ($scope, $interval, commonvariable, loadjsonresource, OrgUnit, DataSets) {
   
    
    var stop;
    $scope.prevOu = undefined;
    $scope.initForm = function () {
        $scope.style = [];
        $scope.datasetcodeSelected = [];
        $scope.operation = 'show';
        $scope.prevOu = undefined;
    }
    $scope.$watch(function () {
        if (commonvariable.OrganisationUnit && commonvariable.OrganisationUnit.id != $scope.prevOu) {
            $scope.initForm();
            $scope.prevOu = commonvariable.OrganisationUnit.id;
            $scope.pdatasets = commonvariable.OrganisationUnit.dataSets;
            $scope.loadDataSet();
            $scope.finddatasetSelected();
        }
    });


    $scope.showedit = function () {
        $scope.operation = 'edit';
        $scope.loadlevel();
    }
    $scope.editHealtServiceDataset = function () {
        angular.forEach($scope.datasetforsave, function (dvalue,dkey) {
            DataSets.Put({ uid: dvalue.id }, dvalue)
         .$promise.then(function (data) {
             if (data.response.status == "SUCCESS") {
                 $scope.messages.push({ type: "success", text: $translate('VACCINATION_DATASET_SAVED') });
                 $scope.hideForm();
             }
             else {
                 $scope.messages.push({ type: "danger", text: $translate('VACCINATION_DATASET_NOSAVED') });
             }
         });

        });
    };

    $scope.loadlevel = function () {
        $scope.levels = [];
        $scope.GroupDE = [];
       // $scope.serviceName = "No existen Dataset para " + commonvariable.OrganisationUnit.name;
       loadjsonresource.get($scope.id)
        .then(function(response){
            $scope.services = response.data.datasetByService[0].service;
            angular.forEach($scope.services, function (svalue, skey) {
                 var ouname = commonvariable.OrganisationUnit.name.split("_");
                     ouname = ouname[ouname.length];
                     if (svalue.name == ouname) {
                      $scope.levels = svalue.levels;
                     // $scope.serviceName = svalue.name;
                  }
                 });
         });
    }

    //$scope.loadlevel();

    $scope.loadDataSet = function () {
        
        angular.forEach($scope.pdatasets, function (value, key) {

            var dcode = value.code;
            var index = $scope.datasetcodeSelected.indexOf(dcode);
            if (index > -1) {
                $scope.datasetcodeSelected.splice(index, 1);
                $scope.style[dcode] = '';
            }
            else {
                $scope.style[dcode] = 'success';
                $scope.datasetcodeSelected.push(dcode);
            }


        });
    }

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

        $scope.finddatasetSelected();
    };

    $scope.finddatasetSelected = function () {

        $scope.datasetforsave = [];
        angular.forEach($scope.datasetcodeSelected, function (value, key) {
            DataSets.Get({ filter: 'code:eq:' + value })
            .$promise.then(function (ds) {
                if (ds.dataSets.length > 0) {
                    //add the new OU to DataSet
                    ds.dataSets[0].organisationUnits.push(commonvariable.OrganisationUnitParentConf);
                    ///
                    $scope.datasetforsave.push(ds.dataSets[0]);
                }
            });

        });

    }

   }]);

