var addCtrl = angular.module('addCtrl', ['geolocation']);

addCtrl.controller('addCtrl', function($scope, $http, geolocation){

	//Initialize Variables
	//-----------------------------------------------
	$scope.formData = {};
	var coords 		= {},
		lat 		= 0,
		long 		= 0;

	//Set initial coordinates to the center of the US
	$scope.formData.latitude = 39.500;
    $scope.formData.longitude = -98.350;


    //Functions
    //-----------------------------------------------
    //Creates a new user based on the form fields

    $scope.createUser = function() {

    	//Grabs data from the text box
    	var userData = {
            username: $scope.formData.username,
            gender: $scope.formData.gender,
            age: $scope.formData.age,
            favlang: $scope.formData.favlang,
            location: [$scope.formData.longitude, $scope.formData.latitude],
            htmlverified: $scope.formData.htmlverified
        };

        //Saves the data to the db
        $http.post('/users', userData)
        	.success(function(data){
        		// Once complete, clear the form (except location)
                $scope.formData.username = "";
                $scope.formData.gender = "";
                $scope.formData.age = "";
                $scope.formData.favlang = "";
        	})
        	.error(function(data){
        		console.log("Error:" + data);
        	});
    };

});