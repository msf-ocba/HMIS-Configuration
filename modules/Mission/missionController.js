appConfigProjectMSF.controller('missionController', ["$scope",'$filter',"commonvariable","Mission","OrgUnitGroupsOrgUnit", function($scope, $filter,commonvariable,Mission,OrgUnitGroupsOrgUnit) {
	
	//set message variable
	$scope.closeAlertMessage = function(index) {
       $scope.messages.splice(index, 1);
  	};
	
	$scope.messages=[];
	
	
	var $translate = $filter('translate');
	$scope.showfields=false;
	//console.log(commonvariable.OrganisationUnit);
	
	
	$scope.projectsave=function(){


		var newOu={//payload
				name:$scope.projectName,
				level:(commonvariable.OrganisationUnit.level+1),
	            shortName:$scope.projectName,
	           	openingDate:$scope.propendate,
	            parent:commonvariable.OrganisationUnit
				};

		Mission.POST({},newOu)
		.$promise.then(function(data){
    		  console.log(data);
    		  if(data.status=="SUCCESS"){
    		  	  commonvariable.RefreshTreeOU=true;
				  newOu.id=data.lastImported;
				  commonvariable.NewOrganisationUnit=newOu;
				 
				  if (commonvariable.orgUnitGroupSet.rQjuGZcxNxE!=undefined)
					  OrgUnitGroupsOrgUnit.POST({uidgroup:commonvariable.orgUnitGroupSet.rQjuGZcxNxE.id, uidorgunit:newOu.id});
				  if (commonvariable.orgUnitGroupSet.lR7GVB43jaX!=undefined)
					  OrgUnitGroupsOrgUnit.POST({uidgroup:commonvariable.orgUnitGroupSet.lR7GVB43jaX.id, uidorgunit:newOu.id});
				  if (commonvariable.orgUnitGroupSet.DIYl9kZDij3!=undefined)
					  OrgUnitGroupsOrgUnit.POST({uidgroup:commonvariable.orgUnitGroupSet.DIYl9kZDij3.id, uidorgunit:newOu.id});
				  if (commonvariable.orgUnitGroupSet.iiFM3YudVxq!=undefined)
					  OrgUnitGroupsOrgUnit.POST({uidgroup:commonvariable.orgUnitGroupSet.iiFM3YudVxq.id, uidorgunit:newOu.id});
				  if (commonvariable.orgUnitGroupSet.ZximACPowCs!=undefined)
					  OrgUnitGroupsOrgUnit.POST({uidgroup:commonvariable.orgUnitGroupSet.ZximACPowCs.id, uidorgunit:newOu.id});
				  

				 //set message variable
				$scope.messages.push({type:"success",
				text:"Project saved"});

				//clear txtbox
				$scope.projectName="";

			}
			else{
				$scope.messages.push({type:"danger",
				text:"Project doesn't saved, review that the field name isn't empty"});
			}
    	 });
				
	};
	
	
	$scope.showForm=function(frm){
		if(frm==1){
			$scope.frmVaccination=false;
			$scope.frmProject=true;
		}
		else{
			$scope.frmVaccination=true;
			$scope.frmProject=false;
		}

	};
	$scope.hideForm=function(){
		$scope.projectName="";
		$scope.today();
		$scope.showfields=false;
		$scope.frmVaccination=false;
		$scope.frmProject=false;
	};
	$scope.$watch(
		function($scope) {
			if(commonvariable.OrganisationUnit!=undefined){
				$scope.missionname=commonvariable.OrganisationUnit.name;
				$scope.missioncreated=commonvariable.OrganisationUnit.created;
		}
		});
	
    // Date datepicker
	  $scope.today = function() {
	    datetoday = new Date();
	    $scope.propendate=datetoday.getFullYear()+"-"+((datetoday.getMonth()+1)<=9?"0"+(datetoday.getMonth()+1):(datetoday.getMonth()+1))+"-"+(datetoday.getDate()<=9?"0"+datetoday.getDate():datetoday.getDate());
	  };
	  
	  $scope.today();

	  $scope.clear = function () {
	    $scope.propendate = null;
	  };

	   $scope.open = function($event) {
		    $event.preventDefault();
		    $event.stopPropagation();
		    $scope.opened = true;
	  };
/////////////////////////////////////////
	
}]);


