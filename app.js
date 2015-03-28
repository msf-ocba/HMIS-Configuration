var appConfigProjectMSF = angular.module("appConfigProjectMSF", ['ngRoute','Dhis2Api','pascalprecht.translate','ui.bootstrap','d2Menu', 'angularFileUpload','angularTreeview']);

appConfigProjectMSF.config(function($routeProvider) {
 
	  $routeProvider.when('/InternationalMSF', {
		    templateUrl: "modules/InternationalMSF/internationalMSFView.html",
		    controller: "internationalMSFController"
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