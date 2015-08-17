var MyApp = angular.module('MyApp', ['ui.router']);


MyApp.controller("RestCtrl" ,function($scope, $http) {

    // Search API calls
    //$scope.searchByID = function(user_id){
    //    $http.get("http://localhost:8080/people/" + user_id)
    //        .success(function(response){
    //            $scope.users = response.data;
    //        })
    //        .error(onError)
    //};

    $scope.searchBySurname = function(surname){
            $http.get("http://localhost:8080/people/search/findByLastName?name=" + surname)
                .then(onUserComplete, onError);
    };

    var onUserComplete = function(response){
        $scope.users = response.data._embedded.people;
    };

    var onError = function(reason){
        $scope.search_error = "Could not find user";
    };

    // Create API call
    $scope.create = function(forename, surname){
        var dataObj = {
            firstName: forename,
            lastName: surname
        }
        $http.post("http://localhost:8080/people", dataObj)
            .success(function(data, status, header, config) {
                $scope.created = "Success record created at: " + header('Location');
                console.log(header());
            })
            .error(function(response, status){
                $scope.created = "Error "+status+" writing "+response;
            })
            .finally(function(){
                console.log("Create call complete.");
            });
    }

    // Delete API call
    $scope.delete = function(delete_id){
        $http.delete("http://localhost:8080/people/"+delete_id)
            .success(function(data){
                $scope.deleteresult = "User "+delete_id+" successfully deleted";
            })
            .error(function(data){
                $scope.deleteresult = "Error deleting user"+data;
            })
    }

    // Update API call
    $scope.update = function(user_id, data) {
        var dataObj = {
            firstName: data.forename,
            lastName: data.surname
        }
        $http.put("http://localhost:8080/people/"+user_id, dataObj)
            .success(function(){
                $scope.updateresult = "Success " + user_id + " updated";
            })
            .error(function(){
                $scope.updateresult = "Failed to update user " + user_id;
            })
    }

    $scope.forename = "";
    $scope.surname = "";
    $scope.created = "";

    $scope.user_surname = "";
    $scope.message = "Calling local springboot REST sevice";
});