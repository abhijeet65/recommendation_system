const express = require('express');
const configuration = require('../../config/configuration');
var pythonShell = require('python-shell');

var getRecommendations = function(userID, callback){
    var options = {
        args:
        [
            userID,
            configuration.neighboring_users,
            configuration.number_of_movies,
            configuration.default_movies_length
        ],
        pythonPath: '/usr/bin/python3.4',
        scriptPath: '/home/puneeth/Projects/recommender_system/utilities/'
    }    
    pythonShell.run('recommender_backend.py', options, function(err, data){
        if(err){
            console.log(err);
        }
        else{
            callback(data);
        }
    })
}
module.exports = {
    'getRecommendations' : getRecommendations   
};