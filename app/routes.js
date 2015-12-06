//Dependencies
// ------------------------------------

var mongoose = require('mongoose');
var User = require('./model.js');

//Open App Routes
module.exports = function(app){

	//GET Routes
	//-------------------------------------------------
	//Retrive Records for all users in the db

	app.get('/users', function(req, res){

		// Uses Mongoose schema to run the search (empty conditions)
		var query = User.find({});
		query.exec(function(err, users){
			if(err){
				res.send(err);
			}
			res.json(users);
		});
	});


	//POST Routes
	//-------------------------------------------------
	//Provides Method for saving new users in the db

	app.post('/users', function(req, res){

        // Creates a new User based on the Mongoose schema and the post body
        var newuser = new User(req.body);

        var query = User.find({});
		query.exec(function(err, users){
			if(err){
				res.send(err);
			}

		});

        // New User is saved in the db.
        newuser.save(function(err){
            if(err){
                res.send(err);
            }

            // If no errors are found, it responds with a JSON of the new user
            res.json(req.body);
        });


    });
};