Dhis2Api.directive('d2Resourcejson', function(){
	return{
		restrict: 'E',
		templateUrl: 'directives/resourcesjson/resourcesjsonView.html',
		scope: {
		    id: '@'
		    }
	}
	}); 
Dhis2Api.controller("d2ResourcejsonController", ['$scope', '$interval', "commonvariable", "loadjsonresource", "DataElements", function ($scope, $interval, commonvariable, loadjsonresource, DataElements) {
	$scope.style=[];

	
	var stop;
	$scope.prevOu = undefined;
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
	        $scope.prevOu = commonvariable.OrganisationUnit.id;
	        $scope.getDataElementSelected();
	    }
	});


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
	                        $scope.selectgroup(dgkey, vkey);
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

