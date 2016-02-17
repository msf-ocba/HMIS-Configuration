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