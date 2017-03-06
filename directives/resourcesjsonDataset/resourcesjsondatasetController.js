/* 
   Copyright (c) 2016.
 
   This file is part of Project Configuration for MSF.
 
   Project Configuration is free software: you can redistribute it and/or modify
   it under the terms of the GNU General Public License as published by
   the Free Software Foundation, either version 3 of the License, or
   (at your option) any later version.
 
   Project Configuration is distributed in the hope that it will be useful,
   but WITHOUT ANY WARRANTY; without even the implied warranty of
   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
   GNU General Public License for more details.
 
   You should have received a copy of the GNU General Public License
   along with Project Configuration.  If not, see <http://www.gnu.org/licenses/>. */

Dhis2Api.directive('d2Resourcejsondataset', function(){
	return{
		restrict: 'E',
		templateUrl: 'directives/resourcesjsonDataset/resourcesjsondatasetView.html',
		scope: {
		    id: '@'
		    }
	}
	}); 
Dhis2Api.controller("d2ResourcejsondatasetController", ['$scope', '$filter', '$interval', "commonvariable", "loadjsonresource", "OrgUnit", "DataSets", "commonService", "DatasetService",
                                                        function ($scope,$filter, $interval, commonvariable, loadjsonresource, OrgUnit, DataSets, commonService, DatasetService) {
   
    
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
    };

    $scope.$watch(function () {
        if ((commonvariable.OrganisationUnit && commonvariable.OrganisationUnit.id != $scope.prevOu) ||
        		commonvariable.refreshDataSets) {
            $scope.initForm();
            $scope.prevOu = commonvariable.OrganisationUnit.id;
            $scope.pdatasets = commonvariable.OrganisationUnit.dataSets;
            $scope.loadDataSet();
            commonvariable.refreshDataSets = false;
            //$scope.finddatasetSelected();
        }
    });


    $scope.showEdit = function () {
        $scope.operation = 'edit';
        $scope.loadLevels();
    };
                                                            
    $scope.editHealtServiceDataset = function () {
        angular.forEach($scope.datasetforsave, function (dvalue,dkey) {
            if (dvalue.code != "DS_DEM"){
                DataSets.Put({ uid: dvalue.id }, dvalue).$promise
                    .then(function (data) {
                        if (data.status == "OK") {
                            $scope.editOrgUnit($scope.datasetforsave);
                            $scope.initForm();
                        }
                        else {
                            $scope.messages.push({ type: "danger", text: $translate('DATASET_NOSAVED') });
                        }
                    });
            }
        });
    };

    $scope.loadLevels = function () {
        commonvariable.healhservicesCodeOUG = commonvariable.healhservicesCodeOUG.trim();
        DatasetService.getByService(commonvariable.healhservicesCodeOUG)
            .then( function (dataSetByLevels) {
                $scope.levels = dataSetByLevels.levels;
                $scope.levels = commonService.sortByKey($scope.levels, 'value');
            });
    };

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

