var MyApp = angular.module('MyApp', []);

MyApp.controller("RestCtrl" ,function($scope, $http) {

    var onUserComplete = function(response){
        $scope.user = response.data;
        console.log($scope.user);
    }

    var onError = function(reason){
        $scope.error = "Could not find user";
    }

    $scope.search = function(user_id){
        $http.get("http://localhost:8080/people/" + user_id).
            then(onUserComplete, onError);
    }

    $scope.user_id = 1;
    $scope.message = "Calling local springboot rest sevice";

});