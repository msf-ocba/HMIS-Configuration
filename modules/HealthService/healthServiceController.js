appConfigProjectMSF.controller('healthServiceController', ["$scope",'$filter',"commonvariable","$modal", "OrgUnit", "OrgUnitOrgUnitGroups", "$q", function($scope, $filter,commonvariable,$modal, OrgUnit, OrgUnitOrgUnitGroups, $q) {
	var $translate = $filter('translate');
	
	//set message variable
	$scope.closeAlertMessage = function(index) {
       $scope.messages.splice(index, 1);
  	};
	
	$scope.messages=[];
	
	
	$scope.showfields=false;
	//console.log(commonvariable.OrganisationUnit);
	//console.log(commonvariable.OrganisationUnitParentConf) //using as parent  for create OUs
	
	
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
					$scope.healthservicename=commonvariable.OrganisationUnit.name;
					$scope.healthservicecreated=commonvariable.OrganisationUnit.openingDate;
					$scope.healthservicecode=commonvariable.OrganisationUnit.code;
					
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
	
	
    ////////////////////////For Edit //////////////////////////////////////////

    //set message variable
	$scope.closeAlertMessage = function (index) {
	    $scope.messages.splice(index, 1);
	};

	$scope.messages = [];
    ///enable textBox
	$scope.operation = 'show';
	$scope.enableforEdit = function () {
	    $scope.operation = 'edit';
	    commonvariable.NewOrganisationUnit = [];
	}
	$scope.enableforshow = function () {
	    $scope.operation = 'show';
	}
	
	
	$scope.updateHealthService = function () {

		  var defered = $q.defer();
	      var promise = defered.promise;
	      
	      try {
	        	  if (typeof(commonvariable.orgUnitGroupSet[commonvariable.ouGroupsetId.HealthService])!="undefined") {

	        		  if (typeof(commonvariable.preOrgUnitGroupSet[commonvariable.ouGroupsetId.HealthService])=="undefined")
	        			  OrgUnitOrgUnitGroups.POST({ uidorgunit: commonvariable.OrganisationUnit.id, uidgroup: commonvariable.orgUnitGroupSet[commonvariable.ouGroupsetId.HealthService].id })
	        	  
	        		  else if (commonvariable.preOrgUnitGroupSet[commonvariable.ouGroupsetId.HealthService].id != commonvariable.orgUnitGroupSet[commonvariable.ouGroupsetId.HealthService].id) {
	        			  OrgUnitOrgUnitGroups.DELETE({ uidorgunit: commonvariable.OrganisationUnit.id, uidgroup: commonvariable.preOrgUnitGroupSet[commonvariable.ouGroupsetId.HealthService].id });
	        			  OrgUnitOrgUnitGroups.POST({ uidorgunit: commonvariable.OrganisationUnit.id, uidgroup: commonvariable.orgUnitGroupSet[commonvariable.ouGroupsetId.HealthService].id })
	        		  }
	        	  }
	          } catch (err) {
	         };
	      
	      
	      defered.resolve(true);
		  return promise;
		
	}

    ////Edit SERVICE
	$scope.EditService = function () {

	    var editOu = {//payload
	        openingDate: $filter('date')($scope.healthservicecreated,'yyyy-MM-dd')
	    };
	    
	    OrgUnit.PATCH({id:commonvariable.OrganisationUnit.id},editOu).$promise.then(function(data){
	    	  
	    	  if (data.response.status=="SUCCESS") {
	    		  
	    			
                  //asign OU selected 
	    	      commonvariable.EditOrganisationUnit = commonvariable.OrganisationUnit;
                  ///replace with new value
	    	      commonvariable.EditOrganisationUnit.name = commonvariable.OrganisationUnit.name;
	    	      commonvariable.EditOrganisationUnit.shortName= commonvariable.OrganisationUnit.shortName;
	    	      commonvariable.EditOrganisationUnit.code = commonvariable.OrganisationUnit.code;
	    	      commonvariable.EditOrganisationUnit.openingDate = editOu.openingDate;
                  //refresh tree for show change
	    	      commonvariable.RefreshTreeOU = true;
	    	      

	    	      $scope.updateHealthService().then(function(data) {
	    	    	  $scope.operation = 'show';		    	    	  
	    	      });
	    	      	    	    	    	      
	    	      
	    	      $scope.messages.push({ type: "success", text: $translate('SERVICE_UPDATED') });
	    	      
	    	  }
	    	  else
					$scope.messages.push({type:"danger",
							text:"Health site doesn't saved, review that the field name isn't empty"});

	      
	    });	    

	    ///


	}




    ///Delete PROJECT
	$scope.DeleteService = function () {



	    ///
	    $scope.messages.push({ type: "success", text: $translate('SERVICE_DELETED') });

	}



    /////modal for delete message

	$scope.modalDelete = function (size) {

	    var modalInstance = $modal.open({
	        templateUrl: 'ModalConfirm.html',
	        controller: 'ModalConfirmCtrl',
	        size: size,
	        resolve: {
	            information: function () {
	                return { tittle: $translate('HEALTHSERVICE_DELETE_TITTLE'), description: $translate('HEALTHSERVICE_DELETE_DESCRIPTION'), id: commonvariable.OrganisationUnit.id };
	            }
	        }
	    });

	    modalInstance.result.then(function (option) {
	        if (option == true) {
	            $scope.messages.push({ type: "success", text: $translate('HEALTHSERVICE_DELETED') });
	        }
	        else {
	            $scope.messages.push({ type: "error", text: $translate('HEALTHSERVICE_NODELETED') });
	        }
	    }, function () {
	        console.log('Modal dismissed at: ' + new Date());
	    });
	};



}]);

