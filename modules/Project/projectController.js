appConfigProjectMSF.controller('projectController', ["$scope",'$filter',"commonvariable", "OrgUnit","OrgUnitGroupsOrgUnit","FilterResource", "DataSetsOrgUnit", "OrgUnitGroupByOrgUnit","$modal", "OrganisationUnitChildren", "OrgUnitOrgUnitGroups", "$q", "User", function($scope, $filter,commonvariable,OrgUnit,OrgUnitGroupsOrgUnit,FilterResource,DataSetsOrgUnit,OrgUnitGroupByOrgUnit,$modal, OrganisationUnitChildren, OrgUnitOrgUnitGroups, $q, User) {
	
	
	//set message variable
	$scope.closeAlertMessage = function(index) {
       $scope.messages.splice(index, 1);
  	};
	
	$scope.messages=[];
	
	$scope.prevOu=undefined;
	
	var $translate = $filter('translate');
	
	$scope.showfields=false;
	//console.log(commonvariable.OrganisationUnit);
	
	
	$scope.savesiteuser=function(){
		
		var user = {}
					
		user.surname = commonvariable.users.prefix + "-" + commonvariable.userDirective + "-" + commonvariable.users.postfix_siteuser
		user.userCredentials= {}
		user.userCredentials.password=commonvariable.users.passwd
		user.organisationUnits = [{"id":commonvariable.NewOrganisationUnit.id}]
		user.dataViewOrganisationUnits = [{"id":commonvariable.NewOrganisationUnit.id}]
		user.userGroups = [{"id":commonvariable.users.uid_project_users_userGroup}]

			
		user.firstName = commonvariable.users.postfix_siteuser
		user.userCredentials.userRoles = [{"id":commonvariable.users.uid_role_fielduser}]
		user.userCredentials.username=commonvariable.users.prefix + "-" + commonvariable.userDirective + "-" + commonvariable.users.postfix_siteuser
			
		User.POST(user).$promise.then(function (data) {
				
				console.log(data)
				
		});
			
	}
		
		
	
	
	$scope.sitesave=function(){
		
		
		var codeOrgUnit = undefined;
		
		if (commonvariable.OrganisationUnit.code!=undefined && commonvariable.OrganisationUnit.code.length>=7)
			codeOrgUnit = "OU_" + commonvariable.OrganisationUnit.code.slice(2,7) + $scope.siteprefix;
		
		var newOu={//payload
				name:commonvariable.ouDirective,
				level:(commonvariable.OrganisationUnit.level+1),
	            shortName:commonvariable.ouDirective,
	            code:codeOrgUnit,
	           	openingDate:$filter('date')($scope.siteDate,'yyyy-MM-dd'),
	            parent:commonvariable.OrganisationUnitParentConf
				};

		OrgUnit.POST({},newOu)
		.$promise.then(function(data){
    		  console.log(data);
    		 // if(data.response.status=="SUCCESS"){
    		  if(data.response.importCount.imported>=1){
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
				  
				  
				  $scope.savesiteuser()
				  				  				  				  

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
		
	    if (frm == 1) {
	        commonvariable.clearForm["hsname"] = true;
	        $scope.siteprefix = "";
			$scope.frmSite=true;
		}
		else{
			$scope.frmSite=false;
		}

		
	//	$scope.showfields=true;
	};
	
	
	
	$scope.hideForm=function(){
		//$scope.mdname="";
		$scope.today();
		$scope.showfields = false;
		commonvariable.clearForm = true;
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
	      commonvariable.NewOrganisationUnit = [];
	      
	      //Getting the current org. unit groups
	      
	      commonvariable.ouDirective = $scope.projectname
	      commonvariable.ouDirectiveCode = $scope.projectcode
	      
	      
	  }
	  
	  
	  $scope.enableforshow = function () {
	      $scope.operation = 'show';
	  }
	  
	  $scope.updateOrgUnitGroups = function (orgUnit) {
		  
	         try {
	        	  if (typeof(commonvariable.orgUnitGroupSet[commonvariable.ouGroupsetId.PopulationType])!="undefined") {

	        		  if (typeof(commonvariable.preOrgUnitGroupSet[commonvariable.ouGroupsetId.PopulationType])=="undefined")
	        			  OrgUnitOrgUnitGroups.POST({ uidorgunit: orgUnit.id, uidgroup: commonvariable.orgUnitGroupSet[commonvariable.ouGroupsetId.PopulationType].id })
	        	  
	        		  else if (commonvariable.preOrgUnitGroupSet[commonvariable.ouGroupsetId.PopulationType].id != commonvariable.orgUnitGroupSet[commonvariable.ouGroupsetId.PopulationType].id) {
	        			  OrgUnitOrgUnitGroups.DELETE({ uidorgunit: orgUnit.id, uidgroup: commonvariable.preOrgUnitGroupSet[commonvariable.ouGroupsetId.PopulationType].id });
	        			  OrgUnitOrgUnitGroups.POST({ uidorgunit: orgUnit.id, uidgroup: commonvariable.orgUnitGroupSet[commonvariable.ouGroupsetId.PopulationType].id })
	        		  }
	        	  }
	          } catch (err) {
	          };

	    	  
	          try {	        	 
	        	  if (typeof(commonvariable.orgUnitGroupSet[commonvariable.ouGroupsetId.Context])!="undefined") {
	        		  
	        		  if (typeof(commonvariable.preOrgUnitGroupSet[commonvariable.ouGroupsetId.Context])=="undefined" )
	        			  OrgUnitOrgUnitGroups.POST({ uidorgunit: orgUnit.id, uidgroup: commonvariable.orgUnitGroupSet[commonvariable.ouGroupsetId.Context].id });
	        	  
	        		  else if (commonvariable.preOrgUnitGroupSet[commonvariable.ouGroupsetId.Context].id != commonvariable.orgUnitGroupSet[commonvariable.ouGroupsetId.Context].id) {

	        			  OrgUnitOrgUnitGroups.DELETE({ uidorgunit: orgUnit.id, uidgroup: commonvariable.preOrgUnitGroupSet[commonvariable.ouGroupsetId.Context].id });
	        			  OrgUnitOrgUnitGroups.POST({ uidorgunit: orgUnit.id, uidgroup: commonvariable.orgUnitGroupSet[commonvariable.ouGroupsetId.Context].id });
	        		  }
	        	  }
	               

	          } catch (err) {
	          };
	          
	          try {
	        	  if (typeof(commonvariable.orgUnitGroupSet[commonvariable.ouGroupsetId.ProjectType])!="undefined") {

	        		  if (typeof(commonvariable.preOrgUnitGroupSet[commonvariable.ouGroupsetId.ProjectType])=="undefined")
	        			  OrgUnitOrgUnitGroups.POST({ uidorgunit: orgUnit.id, uidgroup: commonvariable.orgUnitGroupSet[commonvariable.ouGroupsetId.ProjectType].id })

	        		  else if (commonvariable.preOrgUnitGroupSet[commonvariable.ouGroupsetId.ProjectType].id != commonvariable.orgUnitGroupSet[commonvariable.ouGroupsetId.ProjectType].id) {

	        			  OrgUnitOrgUnitGroups.DELETE({ uidorgunit: orgUnit.id, uidgroup: commonvariable.preOrgUnitGroupSet[commonvariable.ouGroupsetId.ProjectType].id })
	        			  OrgUnitOrgUnitGroups.POST({ uidorgunit: orgUnit.id, uidgroup: commonvariable.orgUnitGroupSet[commonvariable.ouGroupsetId.ProjectType].id })
	        		  }
	        	  }
	          } catch (err) {
	          };
	          
	          
	         try {
	        	  if (typeof(commonvariable.orgUnitGroupSet[commonvariable.ouGroupsetId.TypeManagement])!="undefined") {

	        		  if (typeof(commonvariable.preOrgUnitGroupSet[commonvariable.ouGroupsetId.TypeManagement])=="undefined")
	        			  OrgUnitOrgUnitGroups.POST({ uidorgunit: orgUnit.id, uidgroup: commonvariable.orgUnitGroupSet[commonvariable.ouGroupsetId.TypeManagement].id })
	        		  else if (commonvariable.preOrgUnitGroupSet[commonvariable.ouGroupsetId.TypeManagement].id != commonvariable.orgUnitGroupSet[commonvariable.ouGroupsetId.TypeManagement].id) {
	        			  OrgUnitOrgUnitGroups.DELETE({ uidorgunit: orgUnit.id, uidgroup: commonvariable.preOrgUnitGroupSet[commonvariable.ouGroupsetId.TypeManagement].id });
	        			  OrgUnitOrgUnitGroups.POST({ uidorgunit: orgUnit.id, uidgroup: commonvariable.orgUnitGroupSet[commonvariable.ouGroupsetId.TypeManagement].id })
	        		  }
	        	  }
	          } catch (err) {
	        	  
	          };
	          
	          try {
	        	  if (typeof(commonvariable.orgUnitGroupSet[commonvariable.ouGroupsetId.Event])!="undefined") {

	        		  if (typeof(commonvariable.preOrgUnitGroupSet[commonvariable.ouGroupsetId.Event])=="undefined")
	        			  OrgUnitOrgUnitGroups.POST({ uidorgunit: orgUnit.id, uidgroup: commonvariable.orgUnitGroupSet[commonvariable.ouGroupsetId.Event].id })
	                  
	        		  else if (commonvariable.preOrgUnitGroupSet[commonvariable.ouGroupsetId.Event].id != commonvariable.orgUnitGroupSet[commonvariable.ouGroupsetId.Event].id) {
	        			  OrgUnitOrgUnitGroups.DELETE({ uidorgunit: orgUnit.id, uidgroup: commonvariable.preOrgUnitGroupSet[commonvariable.ouGroupsetId.Event].id });
	        			  OrgUnitOrgUnitGroups.POST({ uidorgunit: orgUnit.id, uidgroup: commonvariable.orgUnitGroupSet[commonvariable.ouGroupsetId.Event].id })
	        		  }
	        	  }
	          } catch (err) {
	          };
		  
	  }
	  
	  
	  $scope.updateCodes = function (orgUnit) {
		  
		  if (orgUnit.level == commonvariable.level.HealthSite || orgUnit.level == commonvariable.level.HealthService) {
			  
			  var textToUpdate = "OU_" + commonvariable.ouDirectiveCode.slice(2, 7);
			  var newCode = textToUpdate + orgUnit.code.slice(7);
			  
		      OrgUnit.PATCH({id:orgUnit.id},{code:newCode}).$promise.then(function(data){
		    	  
		    	  if (data.response.status!="SUCCESS")
		    		  console.log("Eror");
		    	  
		    	  //commonvariable.RefreshTreeOU = true;
		    	  
		      });			  
			  
		  }
		  		  
	  }
	  
	  
	  $scope.updateOrgUnits = function (orgUnits) {
		  
		  var defered = $q.defer();
	      var promise = defered.promise;        

	      
	      angular.forEach(orgUnits, function(orgUnit, key){
	    	  
	    	  $scope.updateOrgUnitGroups(orgUnit);
	    	  
	    	  $scope.updateCodes(orgUnit);	    	  	    	  
	    	  
		  });

		  
		  defered.resolve(true);
		  return promise;
		  
	  }
	  

    ////Edit PROJECT
	  $scope.EditProject = function () {
		  		  		  
		  		   		   		   
	      var editOu = {//payload
	          name: commonvariable.ouDirective,
	          shortName: commonvariable.ouDirective,
	          code: commonvariable.ouDirectiveCode,
	          openingDate: $filter('date')($scope.projectcreated, 'yyyy-MM-dd')
	      };
	      
	      
	      
	      OrgUnit.PATCH({id:commonvariable.OrganisationUnit.id},editOu).$promise.then(function(data){
	    	  
	    	  
	    	  if (data.response.status=="SUCCESS") {
	    		  
	
                  //asign OU selected 
	    	      commonvariable.EditOrganisationUnit = commonvariable.OrganisationUnit;
                  ///replace with new value
	    	      commonvariable.EditOrganisationUnit.name = editOu.name;
	    	      commonvariable.EditOrganisationUnit.shortName= editOu.codeshortName
	    	      commonvariable.EditOrganisationUnit.code = editOu.code;
	    	      commonvariable.EditOrganisationUnit.openingDate = editOu.openingDate;
                  //refresh tree for show change
	    	      commonvariable.RefreshTreeOU = true;


	    	   OrganisationUnitChildren.get({ uid: data.response.lastImported, fields: 'name,id,code,level' }).$promise.then(function (response) {
	    		   
	   			   
				   var children=response.organisationUnits;
   			
				   $scope.updateOrgUnits(children).then(function(data) {
					   
					   $scope.projectname =  commonvariable.ouDirective;
					   $scope.projectcode = commonvariable.ouDirectiveCode;
					   
					   $scope.operation = 'show';					   					   
				   });		   

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


