//creates the gservice factory to interact with google maps API.
angular.module('gservice', [])
	.factory('gservice', function($http){

		// Initialize Variables
        // -------------------------------------------------------------
        // Service our factory will return
        
        var googleMapService = {};

       	//Array of locations obtained from API calls
       	var locations = [];

       	// Selected Location (initialize to center of America)
        var selectedLat = 39.50;
        var selectedLong = -98.35;

        //Functions
        // -------------------------------------------------------------
        //Refresh the map with new data, Function will take new lattitude and longitude

        googleMapService.refresh = function(latitude, longitude){

        	//Clears the location array
        	locations = [];

        	//Set the selected lat and long equal with the new provided lat, long
        	selectedLat = latitude;
        	selectedLong = longitude;

        	//Perform an AJAX call to get all of the records in the db
        	$http.get('/users')
        		.success(function(response){
        			// Convert the results into Google Map Format
                	locations = convertToMapPoints(response);

                	// Then initialize the map.
                	initialize(latitude, longitude);

        		}).error(function(){});
        };

        // Private Inner Functions
        // --------------------------------------------------------------
        // Convert a JSON of users into map points

        var convertToMapPoints = function(response){

        	 // Clear the locations holder
            var locations = [];

        	//Loop through all the json entries in response 
        	var length = response.length;

        	for(var i =0; i < length; i++){

        		var user = response[i];

        		// Create popup windows for each record
                var  contentString =
                    '<p><b>Username</b>: ' + user.username +
                    '<br><b>Age</b>: ' + user.age +
                    '<br><b>Gender</b>: ' + user.gender +
                    '<br><b>Favorite Language</b>: ' + user.favlang +
                    '</p>';

                // Converts each of the JSON records into Google Maps Location format (Note [Lat, Lng] format).
                locations.push({
                    latlon: new google.maps.LatLng(user.location[1], user.location[0]),
                    message: new google.maps.InfoWindow({
                        content: contentString,
                        maxWidth: 320
                    }),
                    username: user.username,
                    gender: user.gender,
                    age: user.age,
                    favlang: user.favlang
                });
        	}

        	// location is now an array populated with records in Google Maps format
        	return locations;
        };


        // Initializes the map
		var initialize = function(latitude, longitude) {

			// Uses the selected lat, long as starting point
		    var myLatLng = {lat: selectedLat, lng: selectedLong};
		    var map;

		    // If map has not been created already...
		    if (!map){

		        // Create a new map and place in the index.html page
		        map = new google.maps.Map(document.getElementById('map'), {
		            zoom: 3,
		            center: myLatLng
		        });
		    }

		    // Loop through each location in the array and place a marker
	    	locations.forEach(function(n, i){

	    		var marker = new google.maps.Marker({
	    			position: n.latlon,
	    			map: map,
	    			title: "Big Map",
	    			icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
				});

				// For each marker created, add a listener that checks for clicks
		        google.maps.event.addListener(marker, 'click', function(e){

		            // When clicked, open the selected marker's message
		            currentSelectedMarker = n;
		            n.message.open(map, marker);
		        });

	    	});

	    	// Set initial location as a bouncing red marker
		    var initialLocation = new google.maps.LatLng(latitude, longitude);
		    var marker = new google.maps.Marker({
		        position: initialLocation,
		        animation: google.maps.Animation.BOUNCE,
		        map: map,
		        icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
		    });

		    lastMarker = marker;

		};

		// Refresh the page upon window load. Use the initial latitude and longitude
		google.maps.event.addDomListener(window, 'load',
		    googleMapService.refresh(selectedLat, selectedLong));

		return googleMapService;

	});