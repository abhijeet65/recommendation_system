const mysql = require('mysql');


var getMovies = function(callback){
    var connection = mysql.createConnection({
        host:'localhost',
        user:'root',
        password:'',
        database:'recommender_system'
    })
    connection.query("SELECT * FROM movies", function(error, results, fields){
        if(error){
            return "error"; 
        }
        callback(results);
    })
}

var getRecommendedMovies = function(movieList, callback){
    var connection = mysql.createConnection({
        host:'localhost',
        user:'root',
        password:'',
        database:'recommender_system'
    })
    console.log(movieList)
    var query = "SELECT * FROM movies WHERE ";
    for(var i = 0 ; i < movieList.length; i++){
        var movieID = movieList[i];
        if(movieID === ''){
            if(i != movieList.length - 1){
                if(movieList[i + 1] !== ''){
    
                    query += " OR ";
                }
            } 
            continue;   
        }
        query += "id = " + movieID;
        if(i != movieList.length - 1){
            if(movieList[i + 1] !== ''){

                query += " OR ";
            }
        }
        
    }
    console.log(query + "is query");
    connection.query(query, function(error, results, fields){
        if(error){
            console.log(error)
            return "error"; 
        }
        console.log(results)
        callback(results);
    })
}
function getMyMovies(userID, callback){
    //this function returns the list of movie objects that the user has rated
    var query = "SELECT * FROM movies m, ratings r WHERE r.userID = " + userID + " AND m.id = r.movieID";
    var connection = mysql.createConnection({
        host:'localhost',
        user:'root',
        password:'',
        database:'recommender_system'
    })
    connection.query(query, function(error, results, fields){
        if(error){
            // console.log(error);
            return "error"; 
        }
        console.log("the results are" + JSON.stringify(results))
        callback(results);
    }); 
}

function addMovieRating(movieID, userID, rating){
    //this function inserts/updates movie rating by a user to a movie
    var query = "SELECT * FROM ratings WHERE movieID = " + movieID + " AND userID = " + userID;
    var connection = mysql.createConnection({
        host:'localhost',
        user:'root',
        password:'',
        database:'recommender_system'
    })
    connection.query(query, function(error, results, fields){
        if(error){
            // console.log(error);
            return "error"; 
        }
        // console.log(results + " " + results.length)
        if(results.length >= 1){
            //the record exists in the database. we should issue update command
            query = "UPDATE ratings SET rating = " + rating + " WHERE movieID = " + movieID + " AND userID = " + userID;
            connection.query(query, function(error, results, fields){
                if(error){
                    // console.log(error);
                    return "error";
                }
                console.log("updated successfully");
            })
        }
        else{
            //the record does not exist in the database. issue insert command
            query = "INSERT INTO ratings(userID, movieID, rating) VALUES(" + userID + ", " + movieID + ", " + rating + ")";
            connection.query(query, function(error, results, fields){
                if(error){
                    // console.log(error);
                    return "error";
                }
                console.log("inserted successfully");
            })
        }
    })
}

module.exports = {
    'getMovies' : getMovies,
    'addMovieRating' : addMovieRating,
    'getRecommendedMovies' : getRecommendedMovies,
    'getMyMovies' : getMyMovies
}