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

var appConfigProjectMSF = angular.module("appConfigProjectMSF", ['ngRoute','Dhis2Api','pascalprecht.translate','ui.bootstrap','d2Menu', 'angularFileUpload','angularTreeview','angular-md5']);

appConfigProjectMSF.config(function($routeProvider) {
 
	  $routeProvider.when('/InternationalMSF', {
		    templateUrl: "modules/InternationalMSF/internationalMSFView.html",
		    controller: "internationalMSFController"
	  });
	  $routeProvider.when('/Disabled', {
	      templateUrl: "modules/disabledOU/disabledView.html",
	      controller: "disabledController"
	  });
	  $routeProvider.when('/OperationalCenter', {
		  	templateUrl: "modules/OperationalCenter/operationalCenterView.html",
		  	controller: "operationalCenterController"
		  });
	  $routeProvider.when('/Mission', {
		  	templateUrl: "modules/Mission/missionView.html",
		  		 controller: "missionController"
		  });
		  
	  $routeProvider.when('/Project', {
		    templateUrl: "modules/Project/projectView.html",
		    controller: "projectController"
		  });
	  $routeProvider.when('/HealthSite', {
		  	templateUrl: "modules/HealthSite/healthSiteView.html",
		  	controller: "healthSiteController"
		  });
	  $routeProvider.when('/HealthService', {
		  	templateUrl: "modules/HealthService/healthServiceView.html",
		  	controller: "healthServiceController"
		  });	
	  $routeProvider.otherwise({
	        redirectTo: '/'
	  });   

	});

appConfigProjectMSF.config(function ($translateProvider, urlApi) {
  
	  $translateProvider.useStaticFilesLoader({
          prefix: 'languages/',
          suffix: '.json'
      });
	  
	  $translateProvider.registerAvailableLanguageKeys(
			    ['es', 'en'],
			    {
			        'en*': 'en',
			        'es*': 'es',
			        '*': 'en' // must be last!
			    }
			);
	  
	  $translateProvider.fallbackLanguage(['en']);

	  jQuery.ajax({ url: urlApi + 'userSettings/keyUiLocale/', contentType: 'text/plain', method: 'GET', dataType: 'text', async: false}).success(function (uiLocale) {
		  if (uiLocale == ''){
			  $translateProvider.determinePreferredLanguage();
		  }
		  else{
			  $translateProvider.use(uiLocale);
		  }
      }).fail(function () {
    	  $translateProvider.determinePreferredLanguage();
	  });
	  
});