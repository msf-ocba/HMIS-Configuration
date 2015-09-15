appConfigProjectMSF.controller('healthSiteController', ["$scope",'$filter',"commonvariable", "OrgUnit", "OrgUnitGroupsOrgUnit", function($scope, $filter,commonvariable, OrgUnit, OrgUnitGroupsOrgUnit) {
	var $translate = $filter('translate');
	
	//set message variable
	$scope.closeAlertMessage = function(index) {
       $scope.messages.splice(index, 1);
  	};
	
	$scope.messages=[];
	
	
	$scope.showfields=false;
	console.log(commonvariable.OrganisationUnit);
	
	
	$scope.servicesave=function(){

		var newOu={//payload
				name:$scope.healthServiceName,
				level:(commonvariable.OrganisationUnit.level+1),
	            shortName:$scope.healthServiceName,
	           	openingDate:$scope.healthServiceDate,
	           	parent: commonvariable.OrganisationUnitParentConf
				};

		OrgUnit.POST({},newOu)
		.$promise.then(function(data){
    		  console.log(data);
    		  if(data.status=="SUCCESS"){
    		  	  commonvariable.RefreshTreeOU=true;
				  newOu.id=data.lastImported;
				  commonvariable.NewOrganisationUnit=newOu;		
				  
				  if (commonvariable.orgUnitGroupSet.BtFXTpKRl6n!=undefined)
					  OrgUnitGroupsOrgUnit.POST({uidgroup:commonvariable.orgUnitGroupSet.BtFXTpKRl6n.id, uidorgunit:newOu.id});

				  if (commonvariable.orgUnitGroupSet.akYeq1mMz2N!=undefined)
					  OrgUnitGroupsOrgUnit.POST({uidgroup:commonvariable.orgUnitGroupSet.akYeq1mMz2N.id, uidorgunit:newOu.id});


				 //set message variable
				$scope.messages.push({type:"success",
				text:"Health service saved"});

				//clear txtbox
				$scope.healthServiceName="";

			}
			else{
				$scope.messages.push({type:"danger",
				text:"Health service doesn't saved, review that the field name isn't empty"});
			}
    	 });
				
	};
	
	
	$scope.showForm=function(frm){
		
		if(frm==1){
			$scope.frmSite=true;
		}
		else{
			$scope.frmSite=false;
		}

		
	//	$scope.showfields=true;
	};
	
	$scope.$watch(
			function($scope) {
				if(commonvariable.OrganisationUnit!=undefined){
					$scope.healthsitename=commonvariable.OrganisationUnit.name;
					$scope.healthsitecreated=commonvariable.OrganisationUnit.openingDate;
					$scope.healthsitecode=commonvariable.OrganisationUnit.code;
			}
			});
	
	
	// Date datepicker
	  $scope.today = function() {
	    datetoday = new Date();
	    $scope.healthServiceDate=datetoday.getFullYear()+"-"+((datetoday.getMonth()+1)<=9?"0"+(datetoday.getMonth()+1):(datetoday.getMonth()+1))+"-"+(datetoday.getDate()<=9?"0"+datetoday.getDate():datetoday.getDate());
	  };
	  $scope.today();
	  
	  $scope.open = function($event) {
		    $event.preventDefault();
		    $event.stopPropagation();
		    $scope.opened = true;
	  };

	
}]);


