Dhis2Api.directive('d2Resourcejson', function(){
	return{
		restrict: 'E',
		templateUrl: 'directives/resourcesjson/resourcesjsonView.html',
		scope: {
		    id: '@'
		    }
	}
	}); 
Dhis2Api.controller("d2ResourcejsonController", ['$scope',"commonvariable","loadjsonresource","DataElements", function ($scope,commonvariable,loadjsonresource,DataElements) {
	$scope.style=[];

	

    //waiting for dataset of OU selected
	$scope.$watch(function () {
	    if (commonvariable.VaccinationDatasetSelected && commonvariable.VaccinationDatasetSelected.id != $scope.preid) {
	        $scope.preid = commonvariable.VaccinationDatasetSelected.id;
	        $scope.checkingDEGroup();
	    }
	});

	$scope.checkingDEGroup = function () {

	    angular.forEach($scope.sections, function (vvalue, vkey) {
	        angular.forEach(vvalue.dataElementGroup, function (dgvalue, dgkey) {
	            angular.forEach(dgvalue.dataElements, function (devalue, dekey) {
	                angular.forEach(commonvariable.VaccinationDatasetSelected.dataElements, function (Svalue, Skey) {
	                    if (Svalue.code == devalue.code) {
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
                $scope.ListnameDataelement[dvalue.code]={id:dvalue.id,name:dvalue.name};                
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
        console.log($scope.sections[skey].dataElementGroup[key].dataElements);

        ///
         angular.forEach($scope.sections[skey].dataElementGroup[key].dataElements, function (dvalue, dkey) {
            // console.log($scope.ListnameDataelement[dvalue.code]); 
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

