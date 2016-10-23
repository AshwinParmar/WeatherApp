
/**
 * Created by fabio on 22/10/2016.
 */
var app = angular.module('geoApp', ["ds.clock"]);

app.controller('mainController', function ($scope, $http, $log, GeoLocationService) {
    $scope.type = undefined;
    $scope.weatherlist = [];
    $scope.position = [];
    $scope.geo_location_permission = false;
    $scope.weather_img = "";
    $scope.curdate = new Date();
    $scope.city = '';
    $scope.response_message = 0;

    var apiKey = 'd566654992c335cae8282ab2a9797a4e';
    var apiUrl = 'http://api.openweathermap.org/data/2.5/weather';

    $scope.searchWeather = function () {
        $scope.getWeatherDetailsByPosition('manual');
    }
    $scope.searchWeatherKeyUp = function () {
        if (event.code === 'Enter') {
            $scope.getWeatherDetailsByPosition('manual');
        }
    }

    $scope.getIcon = function () {
        return 'http://openweathermap.org/img/w/' + $scope.weather_img + '.png';
    }

    if (typeof $scope.type === 'undefined') {
        GeoLocationService.getPosition().then(
                function (position) {
                    $scope.position = position;
                    //$log.debug(position);
                    $scope.getWeatherDetailsByPosition();
                    //$log.debug($scope.weatherlist);
                },
                function (errorCode) {
                    if (errorCode === false) {
                        alert('GeoLocation is not supported by browser.');
                    } else if (errorCode === 1) {
                        //alert('User either denied GeoLocation or waiting for long to respond.');
                    }
                }
        );
    } else {
        console.log("Manual");
        //$scope.getWeatherDetailsByPosition('manual');
    }

    $scope.getWeatherDetailsByPosition = function ($type) {
        $scope.type = $type;
        var myUrl = apiUrl;
        var config = {};

        if (typeof $scope.type === 'undefined') {
            console.log($scope.type);
            if ($scope.position) {
                myUrl = apiUrl + "?lat=" + $scope.position.coords.latitude + "&lon=" + $scope.position.coords.longitude + "&appid=" + apiKey;
            } else {
                console.log("No position found");
            }
        } else {
            console.log($scope.type);
            myUrl = apiUrl + "?q=" + $scope.city + "&appid=" + apiKey;
            $log.debug('URL: ' + myUrl);
        }

        if ($scope.position) {
            //console.log(apiUrl);
            //$log.debug(myUrl);
            $http.get(myUrl, config).then(
                    function (success) {
                        //$log.debug(success);
                        $scope.weatherlist = success;
                        $scope.response_message = success.status;
                    },
                    function (error) {
                        //$log.debug(error);
                        $log.debug(error.status + ":" + error.statusText);
                        $scope.response_message = error.status;
                    }
            );
        } else {
            alert('GeoLocation is not correct, Please try again!');
        }
    }
});

// GeoLocationService
angular.module('geoApp').factory('GeoLocationService', function ($q, $window, $timeout) {
    var factoryObj = {};

    factoryObj.getPosition = function () {
        var deferred;
        var promiseTimeout = $timeout(function () {
            deferred.reject(1); // return 1 if browser waited for user input for more than timeout delay
        }, 300000);

        deferred = $q.defer();

        if (!$window.navigator.geolocation) { // check if geoLocation is not supported by browser
            $timeout.cancel(promiseTimeout);
            deferred.reject(false); // return false if geoLocation is not supported
        } else { // geoLocation is supported
            $window.navigator.geolocation.getCurrentPosition(function (position) {
                $timeout.cancel(promiseTimeout);
                return deferred.resolve(position);
            }, function (error) {
                $timeout.cancel(promiseTimeout);
                return deferred.reject(error.code || 1);
            });
        }

        return deferred.promise;
    };

    return factoryObj;
});