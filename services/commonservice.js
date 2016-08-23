/* 
   Copyright (c) 2016.
 
   This file is part of Project Configuration for MSF.
 
   Project Configuration is free software: you can redistribute it and/or modify
   it under the terms of the GNU General Public License as published by
   the Free Software Foundation, either version 3 of the License, or
   (at your option) any later version.
 
   Project Configuration is distributed in the hope that it will be useful,
   but WITHOUT ANY WARRANTY; without even the implied warranty of
   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
   GNU General Public License for more details.
 
   You should have received a copy of the GNU General Public License
   along with Project Configuration.  If not, see <http://www.gnu.org/licenses/>. */

Dhis2Api.service('commonService', ['$q', 'commonvariable', 'OrgUnitGroupByOrgUnit', 'OrgUnitGroupSet', 'OrgUnitOrgUnitGroups',
                                   function ($q, commonvariable, OrgUnitGroupByOrgUnit, OrgUnitGroupSet, OrgUnitOrgUnitGroups) {
	

	this.getServiceSuffix = function(healthserviceSuffix) {
		
		var services = healthserviceSuffix.service;
		
		var serviceResult = {};
		
		for (var i=0; i<services.length; i++) {
			
			if (services[i].code==commonvariable.orgUnitGroupSet[commonvariable.ouGroupsetId.HealthService].code) {
				serviceResult = services[i];
				break;
			}
			
		}		
		return serviceResult;
		
	};
	
	
	existOrgUnitGroup = function(orgUnitGroup, orgUnitGroups) {
		
		var find = false;
		
		for (var i=0; i<orgUnitGroups.length; i++) {
			if (orgUnitGroup.code == orgUnitGroups[i].code) {
				find = true;
				break;
			}
		}
		
		return find;
		
	};

	
	selectOrgUnitGroup = function (uidOrgUnit, uidOrgUnitGroupSet) {
		
	    var defered = $q.defer();
	    var promise = defered.promise;
	    var find = false;
	    var ougroup = false;
		
		OrgUnitGroupByOrgUnit.get({uid:uidOrgUnit}).$promise.then(function(data) {
			
			ouOrgUnitGroups=data.organisationUnitGroups;
			
			OrgUnitGroupSet.get({uid:uidOrgUnitGroupSet}).$promise.then(function(data) {
								
				ougsOrgUnitGroups=data.organisationUnitGroups;
				
			    try {
			    	
			        for (var i = 0; i < ouOrgUnitGroups.length; i++) {
			        
			        	if (find == true) break;
			        
			            for (var j = 0; j < ougsOrgUnitGroups.length; j++) {
			                if (ouOrgUnitGroups[i].id == ougsOrgUnitGroups[j].id) {
			                	find = true;
			                	ougroup=ouOrgUnitGroups[i];
			                    break;
			                }
			            }
			            
			        }
			    } catch (err) { };
			    
			    if (find) {
		    		defered.resolve(ougroup);
			    }		    
			});
			
		});
		
		return promise;
	}	

	
	this.checkServicesOrgUnitGroups = function (orgUnits, servicesAllowed) {
		
	    //var defered = $q.defer();
	    //var promise = defered.promise;
	    //var compatible = true;	   
	    
	    /*angular.forEach(orgUnits, function (orgUnit, key) {
	    	
	    	  selectOrgUnitGroup(orgUnit.id, commonvariable.ouGroupsetId.HealthService).then (function(healthService) {
	    		  console.log(healthService);
			  
	    		  if (!existOrgUnitGroup(healthService, servicesAllowed)){				  
	    			  compatible=false;		
	    			  return compatible;
	    		  }

			  //defered.resolve(compatible);
		  });
	    	
	    });*/
	    
		
		var promises = [];
	    
	    angular.forEach(orgUnits, function (orgUnit, key) {
	    	
	    	var deferred = $q.defer();
	    	promises.push(deferred.promise);
	    	
	    	selectOrgUnitGroup(orgUnit.id, commonvariable.ouGroupsetId.HealthService).then (function(healthService) {
	    	  
	    		deferred.resolve(healthService)
	    	  
	    	});
	      	    	
	    });	    
	      
	    return $q.all(promises);
		
	}
	
	
	
	
	this.deleteOrgUnitGroup = function (uidOrgUnit, uidOrgUnitGroupSet) {
		
	    var defered = $q.defer();
	    var promise = defered.promise;
	    var find = false;
	    var idgroup = false;
		
		OrgUnitGroupByOrgUnit.get({uid:uidOrgUnit}).$promise.then(function(data) {
			
			ouOrgUnitGroups=data.organisationUnitGroups;
			
			OrgUnitGroupSet.get({uid:uidOrgUnitGroupSet}).$promise.then(function(data) {
								
				ougsOrgUnitGroups=data.organisationUnitGroups;
				
			    try {
			    	
			        for (var i = 0; i < ouOrgUnitGroups.length; i++) {
			        
			        	if (find == true) break;
			        
			            for (var j = 0; j < ougsOrgUnitGroups.length; j++) {
			                if (ouOrgUnitGroups[i].id == ougsOrgUnitGroups[j].id) {
			                	find = true;
			                	idgroup=ouOrgUnitGroups[i].id;
//			      			  	OrgUnitOrgUnitGroups.DELETE({uidorgunit: uidOrgUnit, uidgroup: ouOrgUnitGroups[i].id});

			                    break;
			                }
			            }
			            
			        }
			    } catch (err) { };
			    
			    if (find) {
			    	OrgUnitOrgUnitGroups.DELETE({uidorgunit: uidOrgUnit, uidgroup: idgroup}).$promise.then(function(data){
			    		defered.resolve(find);
			    	});
			    }		    
			});
			
		});
		
		return promise;
	}
	
	
	this.sortByKey = function (array, key) {
	    return array.sort(function(a, b) {
	        var x = a[key]; var y = b[key];
	        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
	    });
	}



}]);