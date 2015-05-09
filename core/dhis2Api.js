/*
 *	Architeture 
 * 	Helder Yesid Castrillón
 * 	Hisp Colombia 2014
 * 
 * Core Module for using WebApi of dhis2
 * It is the persistence in the FrontEnd
 * 
 * */
var Dhis2Api = angular.module("Dhis2Api", ['ngResource']);

var urlApi = "http://localhost:8080/dhis/api/";
var urlBase = "http://localhost:8080/dhis/";

//Create all common variables of the apps 
Dhis2Api.factory("commonvariable", function () {
	var Vari={
			url: urlApi,
			urlbase: urlBase,
			OrganisationUnitList:[],
			OrganisationUnit:"",
			RefreshTreeOU:false,
			NewOrganisationUnit:[],
			orgUnitGroupSet:[]
			};

   return Vari; 
});

Dhis2Api.constant("urlApi", urlApi);

Dhis2Api.factory("userAuthorization", ['$resource','commonvariable',function($resource,commonvariable) {
	return $resource(commonvariable.url + "me/authorization/:menuoption",
		{
			menuoption:'@menuoption'
		},
		{ get: { method: "GET", transformResponse: function (response) {return {status: response};}	}});

}]);

Dhis2Api.factory("uidDhis",['md5','commonvariable', function(md5,commonvariable) {
	 var get = function(name) {
        if (!name) return undefined;
        return "h" + md5.createHash(name.toLowerCase()).substring(0, 10);
    };

    return {
        "get": get
    };
}]);

Dhis2Api.factory("TreeOrganisationunit",['$resource','commonvariable', function ($resource,commonvariable) {
	return $resource(commonvariable.url+"organisationUnits/:uid", 
   {
	uid:'@uid',
    fields:'name,id,level,children[name,id,level,created]'
   }, 
  { get: { method: "GET"} });
}]);

Dhis2Api.factory("Mission",['$resource','commonvariable', function ($resource,commonvariable) {
	return $resource(commonvariable.url+"organisationUnits",
		{},
		{ POST: { method: "POST"} });
}]);

Dhis2Api.factory("OrgUnitGroupSet",['$resource','commonvariable', function ($resource,commonvariable) {
			
	return $resource(commonvariable.url+"organisationUnitGroupSets/:uid",
		{	
		uid:'@uid'
		},
		{ get: { method: "GET"} });
}]);

Dhis2Api.factory("OrgUnitGroupByGroupSets",['$resource','commonvariable', function ($resource,commonvariable) {
	
	return $resource(commonvariable.url+"organisationUnitGroupSets/:uid",
		{	
		uid:'@uid',
		fields:'organisationUnitGroups'
		},
		{ get: { method: "GET"} });
}]);

Dhis2Api.factory("OrgUnitGroupByOrgUnit",['$resource','commonvariable', function ($resource,commonvariable) {
	
	return $resource(commonvariable.url+"organisationUnits/:uid",
		{	
		uid:'@uid',
		fields:'organisationUnitGroups'
		},
		{ get: { method: "GET"} });
}]);



Dhis2Api.factory("OrgUnitGroupsOrgUnit",['$resource','commonvariable', function ($resource,commonvariable) {
	
	return $resource(commonvariable.url+"organisationUnitGroups/:uidgroup/organisationUnits/:uidorgunit",
		{	
		uidgroup:'@uidgroup',
		uidorgunit: '@uidorgunit'
		},
		{ POST: { method: "POST"} });
}]);


