/**
 * Created by fabio on 20/04/16.
 */
var app = angular.module('mainModule',[]);

app.controller('mainController',function ($scope,$http) {
    $scope.lista = [];

    $scope.salvar = function () {
        $scope.lista.push($scope.pessoa);
        $scope.pessoa = null;
    }

    $scope.remove = function (pessoa) {
        var index = $scope.lista.indexOf(pessoa);
        $scope.lista.splice(index,1);
    }

    $scope.editar = function (pessoa) {
        $scope.pessoa = pessoa;
    }

    $http.get('people.json').success(function (data) {
        $scope.lista = data;
    });
});
