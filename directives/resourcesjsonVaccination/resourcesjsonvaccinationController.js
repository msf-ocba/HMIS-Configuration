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

Dhis2Api.directive('d2Resourcejsonvaccination', function(){
	return{
		restrict: 'E',
		templateUrl: 'directives/resourcesjsonVaccination/resourcesjsonvaccinationView.html',
		scope: {
		    id: '@'
		    }
	}
	}); 
Dhis2Api.controller("d2ResourcejsonvaccinationController", ['$scope', '$filter', '$interval', "commonvariable", "loadjsonresource", "DataElements", "DataSets", "OrgUnit", "validatorService",
                                                            function ($scope, $filter, $interval, commonvariable, loadjsonresource, DataElements, DataSets, OrgUnit, validatorService) {
	$scope.style=[];
	var $translate = $filter('translate');
	
	var stop;
	$scope.prevOu = undefined;

    //set message variable
	$scope.closeAlertMessage = function (index) {
	    $scope.messages.splice(index, 1);
	};


    // init value

	$scope.initValue = function () {
	    $scope.messages = [];

	    $scope.vaccinationName = commonvariable.OrganisationUnit.name;
	    $scope.vaccinationCode = commonvariable.OrganisationUnit.shortName;
	    $scope.preName = commonvariable.prefixVaccination.vaccinationName;
	    $scope.preCode = commonvariable.prefixVaccination.vaccinationCode;
	}

    //waiting for dataset of OU selected
	$scope.getDataElementSelected = function () {
	    $interval(function () {
	        if ($scope.ListnameDataelement && commonvariable.VaccinationDatasetSelected && commonvariable.VaccinationDatasetSelected.id != $scope.preid) {
	            if ($scope.ListnameDataelement.length > 0) {
	                $scope.preid = commonvariable.VaccinationDatasetSelected.id;
	                $scope.checkingDEGroup();
                    
	                if (angular.isDefined(stop)) {
	                   
	                    $interval.cancel(stop);
	                    stop = undefined;
	                }
	            }

	        }
	    }, 500);
	}
	$scope.$watch(function () {
	    if (commonvariable.OrganisationUnit && commonvariable.OrganisationUnit.id != $scope.prevOu) {

	        commonvariable.DataElementSelected = [];
	        $scope.style = [];
	        $scope.hideFormvaccination();
	        $scope.prevOu = commonvariable.OrganisationUnit.id;
	       
	    }
	});

	$scope.GetChildrenOU = function () {
	    $scope.childOU = [];
	    OrgUnit.get({ id: commonvariable.OrganisationUnit.id, includeDescendants: true, fields: 'name,id,level,closedDate', filter: 'level:eq:' + commonvariable.level.HealthService })
          .$promise.then(function (childOU) {
              angular.forEach(childOU.organisationUnits, function (ou, key) {
                  if(ou.id!=commonvariable.OrganisationUnit.id && ou.closedDate==undefined){
                      $scope.childOU.push({ id: ou.id });
                  }
                    
              });
             
          });
	}

	$scope.showFormvaccination = function (frm) {
	    $scope.initValue();
	    $scope.frmVaccination = true;
	    $scope.GetChildrenOU();
	};

	$scope.hideFormvaccination = function () {

	    $scope.showfields = false;
	    $scope.frmVaccination = false;

	    $scope.getDataset();
	    $scope.getDataElementSelected();
	    $scope.vaccinationName = "";
	    $scope.vaccinationCode = "";
	    $scope.dataSetDescription = ""
	    commonvariable.PeriodSelected = [];
	    commonvariable.DataElementSelected = [];
	};

    ///get if there exist a Dataset for this Mission.
	$scope.getDataset = function () {
	    $scope.initValue();
	    DataSets.Get({ filter: "name:eq:" + $scope.preName + $scope.vaccinationName, fields: 'id,name,code,description,periodType,dataElements' })
               .$promise.then(function (data) {
                   if (data.dataSets.length > 0) {
                       $scope.CreateDatasetVaccination = false;
                       $scope.VaccinationDataset = data.dataSets[0];
                       commonvariable.VaccinationDatasetSelected = $scope.VaccinationDataset;
                       $scope.vaccinationName = commonvariable.OrganisationUnit.name;
                       $scope.vaccinationCode = commonvariable.OrganisationUnit.shortName;
                       $scope.PeriodSelected = $scope.VaccinationDataset.periodType;
                       $scope.dataSetDescription = $scope.VaccinationDataset.description;
                       $scope.dataSetid = $scope.VaccinationDataset.id;
                   }
                   else
                       $scope.CreateDatasetVaccination = true;
               });
	}

    //
	$scope.saveDatasetVaccination = function () {

	    $scope.DataElementSelectedforPUT = [];
	    angular.forEach(commonvariable.DataElementSelected, function (evalue, ekey) {
	        $scope.DataElementSelectedforPUT.push({ id: evalue });
	    });

	    var newDataSet = {
	        name: $scope.preName + $scope.vaccinationName,
	        code: $scope.preCode + $scope.vaccinationCode,
	        shortName: $scope.preCode + $scope.vaccinationCode,
	        description: $scope.dataSetDescription,
	        periodType: commonvariable.PeriodSelected.code,
	        dataElements: $scope.DataElementSelectedforPUT,
	        renderAsTabs: true,
	        dataElementDecoration: true,
	        organisationUnits: $scope.childOU
	    };
	    
	    validatorService.emptyValue(newDataSet).then(function (result) {
	    	
	    	if (result == false){
	    	    DataSets.Post({}, newDataSet)
	            .$promise.then(function (data) {
	                if (data.response.status == "SUCCESS") {
	                    $scope.messages.push({ type: "success", text: $translate('VACCINATION_DATASET_SAVED') });
	                    $scope.hideFormvaccination();
	                }
	                else {
	                    $scope.messages.push({ type: "danger", text: $translate('VACCINATION_DATASET_NOSAVED') });
	                }
	            });	    		
	    	}
	    	else
	    		$scope.messages.push({type: "warning", text: $translate("FORM_MSG_EMPTYFIELD")});
	    });
	    
	};

	$scope.updateDatasetVaccination = function () {
	    $scope.DataElementSelectedforPUT = [];
	    angular.forEach(commonvariable.DataElementSelected, function (evalue, ekey) {
	        $scope.DataElementSelectedforPUT.push({ id: evalue });
	    });
	    var newDataSet = {
	        name: $scope.preName + $scope.vaccinationName,
	        code: $scope.preCode + $scope.vaccinationCode,
	        shortName: $scope.preCode + $scope.vaccinationCode,
	        description: $scope.dataSetDescription,
	        periodType: commonvariable.PeriodSelected.code,
	        dataElements: $scope.DataElementSelectedforPUT,
	        renderAsTabs: true,
	        dataElementDecoration: true,
	        organisationUnits: $scope.childOU
	    };
	    DataSets.Put({ uid: $scope.dataSetid }, newDataSet)
         .$promise.then(function (data) {
             if (data.response.status == "SUCCESS") {
                 $scope.messages.push({ type: "success", text: $translate('VACCINATION_DATASET_SAVED') });
                 $scope.hideFormvaccination();
             }
             else {
                 $scope.messages.push({ type: "danger", text: $translate('VACCINATION_DATASET_NOSAVED') });
             }
         });
	};



	$scope.checkingDEGroup = function () {
   
	    $scope.DESelected = [];

	    reallyselected = true;
	    angular.forEach($scope.sections, function (vvalue, vkey) {
	        angular.forEach(vvalue.dataElementGroup, function (dgvalue, dgkey) {
	            angular.forEach(dgvalue.dataElements, function (devalue, dekey) {
	                angular.forEach(commonvariable.VaccinationDatasetSelected.dataElements, function (Svalue, Skey) {

	                    var reallyselected = $scope.DESelected.filter(function (obj)
	                    {
	                        if (obj.dg == dgkey && obj.de == vkey) {
	                            return true;
	                        } else {
	                             return false;
	                        }
	                    });
	                    if (Svalue.code == devalue.code && reallyselected.length == 0) {
                            $scope.DESelected.push({ dg: dgkey, de: vkey });
                            $scope.selectgroupforEdit(dgkey, vkey);
	                    }

	                });
	            });


	        });

	    });

	};


     $scope.GetDataelement=function(codes){
        $scope.ListnameDataelement=[];
        DataElements.Get({filter:'code:in:['+codes+"]"})
        .$promise.then(function(response){
            angular.forEach(response.dataElements, function(dvalue,dkey){
                $scope.ListnameDataelement[dvalue.code] = { id: dvalue.id, name: dvalue.name };
                $scope.ListnameDataelement.length++;
            });
        });
        

    }


    $scope.loadjson=function(callBack){
        $scope.GroupDE=[];
       loadjsonresource.get($scope.id)
        .then(function(response){
                $scope.sections=response.data.vaccinationDataset;
                //get code of data element
                angular.forEach($scope.sections, function(vvalue,vkey){
                     angular.forEach(vvalue.dataElementGroup, function(dgvalue,dgkey){
                        angular.forEach(dgvalue.dataElements, function(devalue,dekey){
                            $scope.DEListCode=$scope.DEListCode+','+devalue.code;
                            if($scope.GroupDE[dgkey])
                                $scope.GroupDE[dgkey].push(devalue.code);
                            else{
                                $scope.GroupDE[dgkey]=[];
                                $scope.GroupDE[dgkey].push(devalue.code);
                            }
                        });
                        

                    });

                 });

                if($scope.DEListCode){
                    callBack();
                }
        

        });

        
    }

    $scope.loadjson(function(){
                            $scope.DEListCode="["+$scope.DEListCode+"]";
                            $scope.GetDataelement($scope.DEListCode);
    });


    $scope.selectgroup = function (key, skey) {

        ///add dataelement selected of all group

        angular.forEach($scope.sections[skey].dataElementGroup[key].dataElements, function (dvalue, dkey) {
            
            var uid = $scope.ListnameDataelement[dvalue.code].id;
            var index = commonvariable.DataElementSelected.indexOf(uid);
             if (index >= 0) {
                 commonvariable.DataElementSelected.splice(index, 1);
             }
             else {
                 commonvariable.DataElementSelected.push(uid);
             }

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
            commonvariable.DataElementSelected.push($scope.ListnameDataelement[dvalue.code].id);
        });

        //config style for list of DataElements
        if ($scope.style[skey] == undefined)
            $scope.style[skey] = [];
        if ($scope.style[skey][key] == '' || $scope.style[skey][key] == undefined)
            $scope.style[skey][key] = 'success';       

    };


     /// esto ya no se necesita pero es un codigo interesante que lee recursivamente el json ////
    $scope.toType = function(obj) {
        return ({}).toString.call(obj).match(/\s([a-z|A-Z]+)/)[1].toLowerCase()
    }

    $scope.readjson=function(datavalue){
         angular.forEach(datavalue, function(value, key){
                var typeobject=$scope.toType(value);
                if(typeobject=="array"||typeobject=="object")
                    $scope.readjson(value);
            });
    }
    ///////////////////////////////////////////////////////////////////////////////////////////

    }]);

