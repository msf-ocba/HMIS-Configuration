Dhis2Api.directive('d2Resourcejsondataset', function(){
	return{
		restrict: 'E',
		templateUrl: 'directives/resourcesjsonDataset/resourcesjsondatasetView.html',
		scope: {
		    id: '@'
		    }
	}
	}); 
Dhis2Api.controller("d2ResourcejsondatasetController", ['$scope', '$filter', '$interval', "commonvariable", "loadjsonresource", "OrgUnit", "DataSets", function ($scope,$filter, $interval, commonvariable, loadjsonresource, OrgUnit, DataSets) {
   
    
    var stop;
    $scope.messages = [];
    $scope.prevOu = undefined;
    var $translate = $filter('translate');


    $scope.initForm = function () {
        $scope.style = [];
        $scope.datasetcodeSelected = [];
        $scope.operation = 'show';
        $scope.prevOu = undefined;
    }
    $scope.editOrgUnit = function (datasets) {
        try {
            commonvariable.OrganisationUnit.dataSets = datasets;
        }catch(err){
            commonvariable.OrganisationUnit.dataSets = [];
            commonvariable.OrganisationUnit.dataSets = datasets;
        }
        commonvariable.EditOrganisationUnit = commonvariable.OrganisationUnit;
        $scope.pdatasets = commonvariable.OrganisationUnit.dataSets;
         //refresh tree for show change
         commonvariable.RefreshTreeOU = true;
       
    }

    $scope.$watch(function () {
        if (commonvariable.OrganisationUnit && commonvariable.OrganisationUnit.id != $scope.prevOu) {
            $scope.initForm();
            $scope.prevOu = commonvariable.OrganisationUnit.id;
            $scope.pdatasets = commonvariable.OrganisationUnit.dataSets;
            $scope.loadDataSet();
            //$scope.finddatasetSelected();
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
                 $scope.editOrgUnit($scope.datasetforsave);
                // $scope.messages.push({ type: "success", text: $translate('DATASET_SAVED') });
                 $scope.initForm();
             }
             else {
                $scope.messages.push({ type: "danger", text: $translate('DATASET_NOSAVED') });
             }
         });

        });
    };

    $scope.loadlevel = function () {
        $scope.levels = [];
        $scope.GroupDE = [];
        commonvariable.healhservicesCodeOUG = commonvariable.healhservicesCodeOUG.trim();
       // $scope.serviceName = "No existen Dataset para " + commonvariable.OrganisationUnit.name;
       loadjsonresource.get($scope.id)
        .then(function(response){
            $scope.services = response.data.datasetByService[0].service;
            var ouname = commonvariable.OrganisationUnit.name.split("_");
            if (ouname == undefined)
                ouname = commonvariable.OrganisationUnit.name
            else
                ouname = ouname[ouname.length-1];
            angular.forEach($scope.services, function (svalue, skey) {
                if (svalue.code == commonvariable.healhservicesCodeOUG) {
                     $scope.levels = svalue.levels;
                     // $scope.serviceName = svalue.name;
                }
                if ($scope.services.length == skey + 1 && $scope.levels.length == 0){
                    $scope.messages.push({ type: "danger", text: "code " + commonvariable.healhservicesCodeOUG + " not found in file" });
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
                $scope.style[dcode] = "success";
                $scope.datasetcodeSelected.push(dcode);
            }



    };

    $scope.finddatasetSelected = function (dcode) {
        dcode = dcode.trim();
        $scope.datasetforsave = [];
        /////
        $scope.selectdataset(dcode);
       angular.forEach($scope.datasetcodeSelected, function (value, key) {
        DataSets.Get({ filter: 'code:eq:' + value })
            .$promise.then(function (ds) {
                if (ds.dataSets.length > 0) {
                    //add the new OU to DataSet
                    ds.dataSets[0].organisationUnits.push(commonvariable.OrganisationUnitParentConf);
                    ///
                    $scope.datasetforsave.push(ds.dataSets[0]);                     
                }
                else {
                  $scope.style[dcode]= 'danger';
            }
            });

       });

    }


    //set message variable
	  $scope.closeAlertMessage = function (index) {
	      $scope.messages.splice(index, 1);
	  };


   }]);

