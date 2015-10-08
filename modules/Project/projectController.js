appConfigProjectMSF.controller('projectController', ["$scope",'$filter',"commonvariable", "OrgUnit","OrgUnitGroupsOrgUnit","FilterResource", "DataSetsOrgUnit", "OrgUnitGroupByOrgUnit","$modal", "OrganisationUnitChildren", "OrgUnitOrgUnitGroups", "$q", function($scope, $filter,commonvariable,OrgUnit,OrgUnitGroupsOrgUnit,FilterResource,DataSetsOrgUnit,OrgUnitGroupByOrgUnit,$modal, OrganisationUnitChildren, OrgUnitOrgUnitGroups, $q) {
	
	
	//set message variable
	$scope.closeAlertMessage = function(index) {
       $scope.messages.splice(index, 1);
  	};
	
	$scope.messages=[];
	
	$scope.prevOu=undefined;
	
	var $translate = $filter('translate');
	
	$scope.showfields=false;
	//console.log(commonvariable.OrganisationUnit);
	
	
	$scope.sitesave=function(){
		
		
		var codeOrgUnit = undefined;
		
		if (commonvariable.OrganisationUnit.code!=undefined && commonvariable.OrganisationUnit.code.length>=7)
			codeOrgUnit = "OU_" + commonvariable.OrganisationUnit.code.slice(2,7) + $scope.siteprefix;
		
		var newOu={//payload
				name:commonvariable.ouDirective,
				level:(commonvariable.OrganisationUnit.level+1),
	            shortName:commonvariable.ouDirective,
	            code:codeOrgUnit,
	           	openingDate:$scope.siteDate,
	            parent:commonvariable.OrganisationUnit
				};

		OrgUnit.POST({},newOu)
		.$promise.then(function(data){
    		  console.log(data);
    		  if(data.response.status=="SUCCESS"){
    		  	  commonvariable.RefreshTreeOU=true;
				  newOu.id=data.response.lastImported;
				  commonvariable.NewOrganisationUnit=newOu;
				  
				  if (commonvariable.orgUnitGroupSet.ZxNjaKVXY1D!=undefined) {
					  
					  OrgUnitGroupsOrgUnit.POST({uidgroup:commonvariable.orgUnitGroupSet.ZxNjaKVXY1D.id, uidorgunit:newOu.id});
				  }
				  
				  OrgUnitGroupByOrgUnit.get({uid:commonvariable.OrganisationUnit.id}).$promise.then(function(response) {
						
					  listOrgUnitGroups = response.organisationUnitGroups;
					  
					  angular.forEach(listOrgUnitGroups, function(value, key){
						  OrgUnitGroupsOrgUnit.POST({uidgroup:value.id, uidorgunit:newOu.id});
					  });
					  
					  /*for (var i=0;i<listOrgUnitGroups.length;i++)
						  OrgUnitGroupsOrgUnit.POST({uidgroup:listOrgUnitGroups[i].id,uidorgunit:newOu.id});*/
					  

				  });

				  FilterResource.GET({resource:'dataSets', filter:'code:eq:'+"DS_INFR_3"}).$promise
			  		.then(function(response){
			  			
			  			if (response.dataSets.length>0) {
			  				
			  				var dataSet = response.dataSets[0];
			  				DataSetsOrgUnit.POST({uidorgunit:newOu.id, uiddataset:dataSet.id});
			  			}
			  							  			
			  		});
				  				  				  				  

				 //set message variable
				$scope.messages.push({type:"success",
				text:"Health site saved"});

				//clear txtbox
				$scope.siteName="";
				
				$scope.frmSite = false;

			}
			else{
				$scope.messages.push({type:"danger",
				text:"Health site doesn't saved, review that the field name isn't empty"});
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
	
	
	
	$scope.hideForm=function(){
		$scope.mdname="";
		$scope.today();
		$scope.showfields=false;
	};
	
	$scope.$watch(
			function($scope) {
				if(commonvariable.OrganisationUnit!=undefined && commonvariable.OrganisationUnit.id != $scope.prevOu){
					
			        $scope.prevOu = commonvariable.OrganisationUnit.id;

					$scope.projectname=commonvariable.OrganisationUnit.name;
					$scope.projectcode=commonvariable.OrganisationUnit.code;
					$scope.projectcreated=commonvariable.OrganisationUnit.openingDate;
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
	      
	      //Getting the current org. unit groups
	      
	      
	  }
	  
	  
	  $scope.enableforshow = function () {
	      $scope.operation = 'show';
	  }
	  
	  $scope.updateOrgUnits = function (orgUnits) {
		  
		  var defered = $q.defer();
	      var promise = defered.promise;        

	      
	      angular.forEach(orgUnits, function(value, key){

	    	  if (commonvariable.preOrgUnitGroupSet[commonvariable.ouGroupsetId.Context].id!=commonvariable.orgUnitGroupSet[commonvariable.ouGroupsetId.Context].id) {
				   
				   OrgUnitOrgUnitGroups.DELETE({uidorgunit: value.id, uidgroup: commonvariable.preOrgUnitGroupSet[commonvariable.ouGroupsetId.Context].id });				   
				   OrgUnitOrgUnitGroups.POST({uidorgunit: value.id, uidgroup: commonvariable.orgUnitGroupSet[commonvariable.ouGroupsetId.Context].id});
			   }

			   if (commonvariable.preOrgUnitGroupSet[commonvariable.ouGroupsetId.ProjectType].id!=commonvariable.orgUnitGroupSet[commonvariable.ouGroupsetId.ProjectType].id) {
			   
				   OrgUnitOrgUnitGroups.DELETE({uidorgunit: value.id, uidgroup: commonvariable.preOrgUnitGroupSet[commonvariable.ouGroupsetId.ProjectType].id })				   
				   OrgUnitOrgUnitGroups.POST({uidorgunit: value.id, uidgroup: commonvariable.orgUnitGroupSet[commonvariable.ouGroupsetId.ProjectType].id })
			   }
			   
			   if (commonvariable.preOrgUnitGroupSet[commonvariable.ouGroupsetId.PopulationType].id!=commonvariable.orgUnitGroupSet[commonvariable.ouGroupsetId.PopulationType].id) {

				   OrgUnitOrgUnitGroups.DELETE({uidorgunit: value.id, uidgroup: commonvariable.preOrgUnitGroupSet[commonvariable.ouGroupsetId.PopulationType].id });				   
				   OrgUnitOrgUnitGroups.POST({uidorgunit: value.id, uidgroup: commonvariable.orgUnitGroupSet[commonvariable.ouGroupsetId.PopulationType].id })
			   }
			   
			   if (commonvariable.preOrgUnitGroupSet[commonvariable.ouGroupsetId.TypeManagement].id!=commonvariable.orgUnitGroupSet[commonvariable.ouGroupsetId.TypeManagement].id) {

				   OrgUnitOrgUnitGroups.DELETE({uidorgunit: value.id, uidgroup: commonvariable.preOrgUnitGroupSet[commonvariable.ouGroupsetId.TypeManagement].id  });				   
				   OrgUnitOrgUnitGroups.POST({uidorgunit: value.id, uidgroup: commonvariable.orgUnitGroupSet[commonvariable.ouGroupsetId.TypeManagement].id })
			   }
			   
			   if (commonvariable.preOrgUnitGroupSet[commonvariable.ouGroupsetId.Event].id!=commonvariable.orgUnitGroupSet[commonvariable.ouGroupsetId.Event].id) {
			   
				   OrgUnitOrgUnitGroups.DELETE({uidorgunit: value.id, uidgroup: commonvariable.preOrgUnitGroupSet[commonvariable.ouGroupsetId.Event].id  });				   
				   OrgUnitOrgUnitGroups.POST({uidorgunit: value.id, uidgroup: commonvariable.orgUnitGroupSet[commonvariable.ouGroupsetId.Event].id  })
			   }
	    	  
	      });

		  
		  /*for (var i=0; i<orgUnits.length; i++) {
			  
			   if (commonvariable.preOrgUnitGroupSet[commonvariable.ouGroupsetId.Context].id!=commonvariable.orgUnitGroupSet[commonvariable.ouGroupsetId.Context].id) {
			   
				   OrgUnitOrgUnitGroups.DELETE({uidorgunit: orgUnits[i].id, uidgroup: commonvariable.preOrgUnitGroupSet[commonvariable.ouGroupsetId.Context].id });				   
				   OrgUnitOrgUnitGroups.POST({uidorgunit: orgUnits[i].id, uidgroup: commonvariable.orgUnitGroupSet[commonvariable.ouGroupsetId.Context].id});
			   }

			   if (commonvariable.preOrgUnitGroupSet[commonvariable.ouGroupsetId.ProjectType].id!=commonvariable.orgUnitGroupSet[commonvariable.ouGroupsetId.ProjectType].id) {
			   
				   OrgUnitOrgUnitGroups.DELETE({uidorgunit: orgUnits[i].id, uidgroup: commonvariable.preOrgUnitGroupSet[commonvariable.ouGroupsetId.ProjectType].id })				   
				   OrgUnitOrgUnitGroups.POST({uidorgunit: orgUnits[i].id, uidgroup: commonvariable.orgUnitGroupSet[commonvariable.ouGroupsetId.ProjectType].id })
			   }
			   
			   if (commonvariable.preOrgUnitGroupSet[commonvariable.ouGroupsetId.PopulationType].id!=commonvariable.orgUnitGroupSet[commonvariable.ouGroupsetId.PopulationType].id) {

				   OrgUnitOrgUnitGroups.DELETE({uidorgunit: orgUnits[i].id, uidgroup: commonvariable.preOrgUnitGroupSet[commonvariable.ouGroupsetId.PopulationType].id });				   
				   OrgUnitOrgUnitGroups.POST({uidorgunit: orgUnits[i].id, uidgroup: commonvariable.orgUnitGroupSet[commonvariable.ouGroupsetId.PopulationType].id })
			   }
			   
			   if (commonvariable.preOrgUnitGroupSet[commonvariable.ouGroupsetId.TypeManagement].id!=commonvariable.orgUnitGroupSet[commonvariable.ouGroupsetId.TypeManagement].id) {

				   OrgUnitOrgUnitGroups.DELETE({uidorgunit: orgUnits[i].id, uidgroup: commonvariable.preOrgUnitGroupSet[commonvariable.ouGroupsetId.TypeManagement].id  });				   
				   OrgUnitOrgUnitGroups.POST({uidorgunit: orgUnits[i].id, uidgroup: commonvariable.orgUnitGroupSet[commonvariable.ouGroupsetId.TypeManagement].id })
			   }
			   
			   if (commonvariable.preOrgUnitGroupSet[commonvariable.ouGroupsetId.Event].id!=commonvariable.orgUnitGroupSet[commonvariable.ouGroupsetId.Event].id) {
			   
				   OrgUnitOrgUnitGroups.DELETE({uidorgunit: orgUnits[i].id, uidgroup: commonvariable.preOrgUnitGroupSet[commonvariable.ouGroupsetId.Event].id  });				   
				   OrgUnitOrgUnitGroups.POST({uidorgunit: orgUnits[i].id, uidgroup: commonvariable.orgUnitGroupSet[commonvariable.ouGroupsetId.Event].id  })
			   }
			   			   			   
		  }		*/	  
		  
		  defered.resolve(true);
		  return promise;
		  
	  }
	  

    ////Edit PROJECT
	  $scope.EditProject = function () {
		  
		  		   		   		   
	      var editOu = {//payload
	          name: commonvariable.ouDirective,
	          shortName: commonvariable.ouDirective,
	          openingDate: $scope.projectcreated
	      };
	      
	      
	      OrgUnit.PATCH({id:commonvariable.OrganisationUnit.id},editOu).$promise.then(function(data){
	    	  
	    	  if (data.response.status=="SUCCESS") {
	    		  
	   		   OrganisationUnitChildren.get({uid:data.response.lastImported, fields:'name,id,code'}).$promise.then(function(response){
	   			   
				   var children=response.organisationUnits;

	   		       ////
				   commonvariable.RefreshTreeOU = true;
				   			
				   $scope.updateOrgUnits(children).then(function(data) {
					   
					   $scope.projectname =  commonvariable.ouDirective;
					   $scope.projectcode = commonvariable.ouDirectiveCode;
					   
					   $scope.operation = 'show';					   					   
				   });
				   

				   //Actaulza el arbol
				   commonvariable.RefreshTreeOU=true;
				   

				   
			   });	
	    		  
	 	      $scope.messages.push({ type: "success", text: $translate('PROJECT_UPDATED') });
	    		  
	    	  }
	    	  else
				$scope.messages.push({type:"danger",
						text:"Project doesn't saved, review that the field name isn't empty"});

	      });

	      ///
	      
	  }


    ///Delete PROJECT
	  $scope.DeleteProject = function () {
	      ///
	      $scope.messages.push({ type: "success", text: $translate('PROJECT_DELETED') });

	  }



    /////modal for delete message

	  $scope.modalDelete = function (size) {

	      var modalInstance = $modal.open({
	          templateUrl: 'ModalConfirm.html',
	          controller: 'ModalConfirmCtrl',
	          size: size,
	          resolve: {
	              information: function () {
	                  return { tittle: $translate('PROJECT_DELETE_TITTLE'), description: $translate('PROJECT_DELETE_DESCRIPTION'), id: commonvariable.OrganisationUnit.id };
	              }
	          }
	      });

	      modalInstance.result.then(function (option) {
	          if (option == true) {
	              $scope.messages.push({ type: "success", text: $translate('PROJECT_DELETED') });
	          }
	          else {
	              $scope.messages.push({ type: "error", text: $translate('PROJECT_NODELETED') });
	          }
	      }, function () {
	          console.log('Modal dismissed at: ' + new Date());
	      });
	  };



}]);


