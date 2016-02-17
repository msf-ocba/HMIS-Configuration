Dhis2Api.service('validatorService', ['$q', 'commonvariable', function ($q, commonvariable) {
    //get validation rules 
    this.emptyValue=function(objJson) {
        var defered = $q.defer();
        var promise = defered.promise;
        var objValidate = false;
        angular.forEach(objJson, function (value, key) {
            if (value == undefined || value == "")
                objValidate = true;
           });
        defered.resolve(objValidate);
        return promise;
    };

  

   




}]);