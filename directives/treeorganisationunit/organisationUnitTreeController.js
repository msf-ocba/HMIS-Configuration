Dhis2Api.directive('d2Treeorganisationunit', function(){
	return{
		restrict: 'E',
		templateUrl: 'directives/treeorganisationunit/organisationUnitTreeView.html',
		scope: {
		      treetype: '@',
		      size:'@'
		    }
	}
	}); 
Dhis2Api.controller("d2TreeorganisationUnitController", ['$scope','$location','TreeOrganisationunit',"commonvariable", function ($scope,$location,TreeOrganisationunit,commonvariable) {
	$scope.currentid="";
	 $scope.currentlevel=0;
     $scope.loadOrganisationUnit=function(){
         TreeOrganisationunit.get({filter:'level:eq:1'})
    	 .$promise.then(function(data){
    		  $scope.treeOrganisationUnitList = data.organisationUnits;
    	 });
    };
    $scope.loadOrganisationUnit();
	 
	$scope.update = function (json, valorOrig, valorDest,treeup)		{
    	 var type;
    	 var resultado;
    	 for (var i=0; i<json.length;i++){
    	     type = typeof json[i].children;

    	     if (json[i].id == valorOrig) {
    	         switch (treeup) {
    	             case 0:
    	                 json[i].children = valorDest;
    	                 break;
    	             case 1:
    	                 json[i].children.push(valorDest);
    	                 break;
    	             case 2:
    	                 //json[i].name = valorDest.name;
    	                 json[i] = valorDest;
    	                 break;
    	         }

    	     }
    	 	if (type=="undefined"){
    			resultado = true; 
    		}
    		else{
    			resultado = $scope.update(json[i].children, valorOrig, valorDest,treeup);
    		}
    	}
   	 return json;
   }
    
     
  $scope.$watch(
            function(OrganisationUnit) {
            	   //refresh if it is neccesary
                   if(commonvariable.RefreshTreeOU){
                       commonvariable.RefreshTreeOU = false;
                       if (commonvariable.NewOrganisationUnit.length == 0)
                           $scope.treeOrganisationUnitList = $scope.update($scope.treeOrganisationUnitList, $scope.OrganisationUnit.currentNode.id, commonvariable.EditOrganisationUnit, 2);
                       else
                            $scope.treeOrganisationUnitList=$scope.update($scope.treeOrganisationUnitList, $scope.OrganisationUnit.currentNode.id,commonvariable.NewOrganisationUnit,1);                                       
                   }

                try {

                    if($scope.OrganisationUnit.currentNode.closedDate)
                        $location.path('/Disabled');
                } catch (err) {

                };
                    //redirect to correct url
                if(typeof($scope.OrganisationUnit.currentNode)!="undefined" && !$scope.OrganisationUnit.currentNode.closedDate){//$scope.currentlevel!=$scope.OrganisationUnit.currentNode.level){
                        $scope.currentlevel=$scope.OrganisationUnit.currentNode.level;
                        var url="/";
                        switch($scope.currentlevel){
                            case 1:
                                url="/InternationalMSF";
                                break;
                             case 2:
                                url="/OperationalCenter";
                                break;                               
                            case 3:
                                url="/Mission";
                                break;
                            case 4:
                                url="/Project";
                                break;  
                            case 5:
                                url="/HealthSite";
                                break;                     
                            case 6:
                                url="/HealthService";
                                break;
                        }

                        $location.path(url);
                    }
                    

                    if($scope.OrganisationUnit.currentNode && $scope.currentid!=$scope.OrganisationUnit.currentNode.id && typeof($scope.OrganisationUnit.currentNode.children)=="undefined"){
            	   	    $scope.currentid=$scope.OrganisationUnit.currentNode.id;
						TreeOrganisationunit.get({uid:$scope.OrganisationUnit.currentNode.id})
						.$promise.then(function (data) {
                            ////disable display children if it has close date  
						    if ($scope.OrganisationUnit.currentNode.closedDate) {
						        data.children = [];
						    }
                            ///
							$scope.treeOrganisationUnitList=$scope.update($scope.treeOrganisationUnitList, $scope.OrganisationUnit.currentNode.id,data.children,0) 									  
						});
                    }

  	
                try {
                    if ($scope.OrganisationUnit.currentNode.id != $scope.PreOrganisationUnitId) {
                        switch ($scope.treetype) {
                            case "single":
                                commonvariable.OrganisationUnit = $scope.OrganisationUnit.currentNode;
                                $scope.PreOrganisationUnitId = $scope.OrganisationUnit.currentNode.id;
                                commonvariable.OrganisationUnitParentConf = {
                                    id: $scope.OrganisationUnit.currentNode.id,
                                    level: $scope.OrganisationUnit.currentNode.level,
                                    name: $scope.OrganisationUnit.currentNode.name,
                                    openingDate: $scope.OrganisationUnit.currentNode.openingDate,
                                    shortName: $scope.OrganisationUnit.currentNode.shortName
                                };
                                break;
                            case "multiple":
                                commonvariable.OrganisationUnitList = $scope.OrganisationUnit.listNodesSelected;
                                $scope.PreOrganisationUnitId = $scope.OrganisationUnit.currentNode.id;
                                break;
                        }
                    }
                } catch (err) {
                    $location.path('/InternationalMSF');
                };
            }
        );
}]);

