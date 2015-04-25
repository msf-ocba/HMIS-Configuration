appConfigProjectMSF.controller('operationalCenterController', ["$scope",'$filter',"commonvariable","Mission", function($scope, $filter,commonvariable,Mission) {
	
	//set message variable
	$scope.typemessage="info";
	$scope.message="";
	$scope.messageshow=false;

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
		Mission.POST({},newOu)
		.$promise.then(function(data){
    		  console.log(data);
    		  if(data.status=="SUCCESS"){
    		  	  commonvariable.RefreshTreeOU=true;
				  newOu.id=data.lastImported;
				  commonvariable.NewOrganisationUnit=newOu;

				 //set message variable
				$scope.typemessage="success";
				$scope.message="Mission saved";
				$scope.messageshow=true;

				//clear txtbox
				$scope.mdname="";

			}
			else{
				$scope.typemessage="danger";
				$scope.message="Mission doesn't saved, review that the field name isn't empty";
				$scope.messageshow=true;
			}
    	 });
		
	};
	$scope.showForm=function(){
		if(commonvariable.OrganisationUnit==undefined){
				$scope.typemessage="info";
				$scope.message="Please select a operational center";
				$scope.messageshow=true;
				$scope.showfields=false;
				console.log("Seleccione una unidad organizativa");
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


