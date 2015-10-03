appConfigProjectMSF.controller('healthSiteController', ["$scope", '$filter', "commonvariable", "OrgUnit", "OrgUnitGroupsOrgUnit", "loadjsonresource", "OrgUnitGroupByOrgUnit", "FilterResource", "$modal", "DataSetsOrgUnit", function ($scope, $filter, commonvariable, OrgUnit, OrgUnitGroupsOrgUnit, loadjsonresource, OrgUnitGroupByOrgUnit, FilterResource,$modal, DataSetsOrgUnit) {
	var $translate = $filter('translate');
	
	//set message variable
	$scope.closeAlertMessage = function(index) {
       $scope.messages.splice(index, 1);
  	};
	
	$scope.messages=[];
	
	
	$scope.showfields=false;
	//console.log(commonvariable.OrganisationUnit);
	
	
	$scope.servicesave=function(){
		
		var healthServiceName="";
		var healthServiceCode="";
		var healthServiceSuffix="";
		
		if (commonvariable.OrganisationUnit.code!=undefined) {

			healthServiceName = commonvariable.OrganisationUnit.code.slice(7,10);
		}
		
		healthServiceName = healthServiceName + commonvariable.orgUnitGroupSet.BtFXTpKRl6n.name;
		

		
		loadjsonresource.get("healthservice").then(function(response) {
			
		
			healthServiceSuffix = getServiceSuffix(response.data.healthserviceSuffix).suffix;
			
			
		});
		
		
		healthServiceCode=commonvariable.OrganisationUnit.code + "_" + healthServiceSuffix

		var newOu={//payload
				name:healthServiceName,				
				level:(commonvariable.OrganisationUnit.level+1),
				code:healthServiceCode,
	            shortName:commonvariable.ouDirective,
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
				  
				  
				  
				  FilterResource.GET({resource:'dataSets', filter:'code:eq:'+"DS_INFR_3"}).$promise
			  		.then(function(response){
			  			
			  			if (response.dataSets.length>0) {
			  				
			  				var dataSet = response.dataSets[0];
			  				DataSetsOrgUnit.POST({uidorgunit:newOu.id, uiddataset:dataSet.id});
			  			}
			  							  			
			  		});

				  

				  var codeServiceType = undefined;
				  
				  loadjsonresource.get("servicebyservicetype").then(function(response) {
				  
					  codeServiceType = getServiceType(response.data.servicesByServiceType);
					  
					  FilterResource.GET({resource:'organisationUnitGroups', filter:'code:eq:'+codeServiceType}).$promise
				  		.then(function(response){
				  			
				  			if (response.organisationUnitGroups.length>0) {
				  				
				  				var orgUnitGroup = response.organisationUnitGroups[0];
								OrgUnitGroupsOrgUnit.POST({uidgroup:orgUnitGroup.id, uidorgunit:newOu.id});

				  			}
				  							  			
				  		});

					  
				  });
				  
				  
				  OrgUnitGroupByOrgUnit.get({uid:commonvariable.OrganisationUnit.id}).$promise.then(function(response) {
						
					  listOrgUnitGroups = response.organisationUnitGroups;
					  
					  for (var i=0;i<listOrgUnitGroups.length;i++)
						  OrgUnitGroupsOrgUnit.POST({uidgroup:listOrgUnitGroups[i].id,uidorgunit:newOu.id});
					  
				  });



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
	
	getServiceSuffix = function(healthserviceSuffix) {
		
		var services = healthserviceSuffix.service;
		
		
		var serviceResult = {};
		
		for (var i=0; i<services.length; i++) {
			
			if (services[i].code==commonvariable.orgUnitGroupSet.BtFXTpKRl6n.code) {
				serviceResult = services[i];
				break;
			}
			
		}
		
		return serviceResult;
		
	}
	
	getServiceType = function(servicesByServiceType) {
		
		var serviceTypes=servicesByServiceType.serviceType;
		
		var codeResult;
		
		//I need to refactor this!!!!
		
		
		for (var i=0; i<serviceTypes.length; i++) {
			
			var serviceType = serviceTypes[i];
			
			
			for (var j=0; j<serviceType.services.length; j++) {
				if (serviceType.services[j].code == commonvariable.orgUnitGroupSet.BtFXTpKRl6n.code) {
					codeResult = serviceType.code;
					break;
				}
					
			}
			
			
		}
		
		return codeResult;
			
	}
	
	
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
	  }
	  $scope.enableforshow = function () {
	      $scope.operation = 'show';
	  }

    ////Edit SITE
	  $scope.EditSite = function () {

	      var newOu = {//payload
	          name: commonvariable.ouDirective,
	          level: commonvariable.OrganisationUnit.level,
	          shortName: commonvariable.ouDirective,
	          openingDate: $scope.mdopendate,
	          parent: commonvariable.OrganisationUnitParentConf
	      };

	      ///
	      $scope.messages.push({ type: "success", text: $translate('SITE_UPDATED') });

	
	  }




    ///Delete PROJECT
	  $scope.DeleteSite = function () {



	      ///
	      $scope.messages.push({ type: "success", text: $translate('SITE_DELETED') });

	  }



    /////modal for delete message

	  $scope.modalDelete = function (size) {

	      var modalInstance = $modal.open({
	          templateUrl: 'ModalConfirm.html',
	          controller: 'ModalConfirmCtrl',
	          size: size,
	          resolve: {
	              information: function () {
	                  return { tittle: $translate('HEALTHSITE_DELETE_TITTLE'), description: $translate('HEALTHSITE_DELETE_DESCRIPTION'), id: commonvariable.OrganisationUnit.id };
	              }
	          }
	      });

	      modalInstance.result.then(function (option) {
	          if (option == true) {
	              $scope.messages.push({ type: "success", text: $translate('HEALTHSITE_DELETED') });
	          }
	          else {
	              $scope.messages.push({ type: "error", text: $translate('HEALTHSITE_NODELETED') });
	          }
	      }, function () {
	          console.log('Modal dismissed at: ' + new Date());
	      });
	  };



}]);
