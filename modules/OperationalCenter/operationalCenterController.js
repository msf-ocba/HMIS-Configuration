appConfigProjectMSF.controller('operationalCenterController', ["$scope",'$filter',"commonvariable","Mission", function($scope, $filter,commonvariable,Mission) {
	
	//set message variable
	$scope.closeAlertMessage = function(index) {
       $scope.messages.splice(index, 1);
  	};
	
	$scope.messages=[];
	

	var $translate = $filter('translate');
	$scope.showfields=false;
	$scope.missionsave=function(){
		var newOu={//payload
				name:$scope.mdname,
				level:(commonvariable.OrganisationUnit.level+1),
	            shortName:$scope.mdname,
	           	openingDate:$scope.mdopendate,
	            parent:commonvariable.OrganisationUnit
				};
		console.log($scope.mdname);
		console.log(commonvariable.OrganisationUnit.level+1);
		console.log($scope.mdopendate);
		console.log(commonvariable.OrganisationUnit);
		Mission.POST({},newOu)
		.$promise.then(function(data){
    		  console.log(data);
    		  if(data.status=="SUCCESS"){
    		  	  commonvariable.RefreshTreeOU=true;
				  newOu.id=data.lastImported;
				  commonvariable.NewOrganisationUnit=newOu;

				 //set message variable
				$scope.messages.push({type:"success",
				text:"Mission saved"});

				//clear txtbox
				$scope.mdname="";

			}
			else{
				$scope.messages.push({type:"danger",
				text:"Mission doesn't saved, review that the field name isn't empty"});
			}
    	 });
		
	};
	$scope.showForm=function(){
		if(commonvariable.OrganisationUnit==undefined){
				$scope.messages.push({type:"info",
				text:"Please select an operational center"});
				$scope.showfields=false;
		}
		else{
			$scope.showfields=true;
		}
	};
	$scope.hideForm=function(){
		$scope.mdname="";
		$scope.today();
		$scope.showfields=false;
	};
	
	// Date datepicker
	  $scope.today = function() {
	    datetoday = new Date();
	    $scope.mdopendate=datetoday.getFullYear()+"-"+((datetoday.getMonth()+1)<=9?"0"+(datetoday.getMonth()+1):(datetoday.getMonth()+1))+"-"+(datetoday.getDate()<=9?"0"+datetoday.getDate():datetoday.getDate());
	  };
	  $scope.today();

	  $scope.clear = function () {
	    $scope.mdopendate = null;
	  };

	   $scope.open = function($event) {
		    $event.preventDefault();
		    $event.stopPropagation();
		    $scope.opened = true;
	  };
/////////////////////////////////////////
}]);


