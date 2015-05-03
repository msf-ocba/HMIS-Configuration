appConfigProjectMSF.controller('projectController', ["$scope",'$filter',"commonvariable", "Mission","OrgUnitGroupsOrgUnit", function($scope, $filter,commonvariable,Mission,OrgUnitGroupsOrgUnit) {
	
	
	//set message variable
	$scope.closeAlertMessage = function(index) {
       $scope.messages.splice(index, 1);
  	};
	
	$scope.messages=[];
	
	var $translate = $filter('translate');
	
	
	$scope.showfields=false;
	console.log(commonvariable.OrganisationUnit);
	
	
	$scope.sitesave=function(){

		var newOu={//payload
				name:$scope.siteName,
				level:(commonvariable.OrganisationUnit.level+1),
	            shortName:$scope.siteName,
	           	openingDate:$scope.siteDate,
	            parent:commonvariable.OrganisationUnit
				};

		Mission.POST({},newOu)
		.$promise.then(function(data){
    		  console.log(data);
    		  if(data.status=="SUCCESS"){
    		  	  commonvariable.RefreshTreeOU=true;
				  newOu.id=data.lastImported;
				  commonvariable.NewOrganisationUnit=newOu;
				  
				  if (commonvariable.orgUnitGroupSet.tQWPrbOHma9!=undefined)
					  OrgUnitGroupsOrgUnit.POST({uidgroup:commonvariable.orgUnitGroupSet.tQWPrbOHma9.id, uidorgunit:newOu.id});
				  

				 //set message variable
				$scope.messages.push({type:"success",
				text:"Health site saved"});

				//clear txtbox
				$scope.siteName="";

			}
			else{
				$scope.messages.push({type:"danger",
				text:"Health site doesn't saved, review that the field name isn't empty"});
			}
    	 });
				
	};
		
	
	
	$scope.showForm=function(){
		$scope.showfields=true;
	};
	$scope.hideForm=function(){
		$scope.mdname="";
		$scope.today();
		$scope.showfields=false;
	};
	
	$scope.$watch(
			function($scope) {
				if(commonvariable.OrganisationUnit!=undefined){
					$scope.projectname=commonvariable.OrganisationUnit.name;
					$scope.projectcreated=commonvariable.OrganisationUnit.created;
			}
			});
	
	
	// Date datepicker
	  $scope.today = function() {
	    datetoday = new Date();
	    $scope.siteDate=datetoday.getFullYear()+"-"+((datetoday.getMonth()+1)<=9?"0"+(datetoday.getMonth()+1):(datetoday.getMonth()+1))+"-"+(datetoday.getDate()<=9?"0"+datetoday.getDate():datetoday.getDate());
	  };
	  $scope.today();
	  
	  $scope.open = function($event) {
		    $event.preventDefault();
		    $event.stopPropagation();
		    $scope.opened = true;
	  };
	  
	
}]);


