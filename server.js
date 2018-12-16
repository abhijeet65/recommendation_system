var express = require('express');
var bodyParser = require('body-parser');
var login = require('./routes/api/loginAPI');
var ejs = require('ejs');
var path = require('path'); 
var session = require('client-sessions');
var CronJob = require('cron').CronJob;

//mysql 
var mysql  = require('mysql');
var connection = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'root',
    database:'recommender_system'
})

connection.connect(function(err){
    if(err){
        console.log("something wrong. Could not connect with database");
    }
    else console.log("mysql successfully connected");
})

//

//cron jobs
/* new CronJob('00 * * * * *', function() {
     console.log('You will see this message every second');
    // connection.query("delete from Paste where unix_timestamp(now()) - `expiryDuration` * 60 > `timestamp` / 1000", function(err, results, fields){
        if(!err){
            console.log("cron job #1 executed successfully");
        }
        else{
            console.log("contact team! not working");
        }

    }) 
}, null, true, 'America/Los_Angeles');
 */

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//sessions
app.use(session({
    cookieName : 'session',
    secret : 'time_scheduler_session'
}));



app.use(express.static(path.join(__dirname, 'public/')));


app.use(function(req, res, next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


var router = express.Router();
router.get('/', function(req, res){
    res.json("Welcome to this time_scheduler web app.");
    console.log("hello");
});

router.post('/register', login.register);
router.post('/login', login.login);

app.use('/api/loginlogout', router);

app.use('/user', require('./routes/user'));

//recommender system apis
// app.use('/recommender', require('./routes/api/recommenderAPI'))

app.get('/', function(req, res){
    console.log("index page");
});

app.get('/login', function(req, res){
    res.render('login.ejs', {title : "hello please login", type : "good"})
})

app.get('/register', function(req, res){
    res.render('register.ejs', {type : "good"});
});

app.get('/profile', function(req, res){
    if(!req.session.user)res.redirect('/login');
    else
        res.render('dashboard.ejs', {title:'Dashboard', user : req.session.user});
});

// app.use('/api/processPaste', require('./routes/processPaste'));

/* app.get('/managePastes', function(req, res){
    if(!req.session.user)res.redirect('/login');
    var private_pastes, public_pastes;
    var Query = "";
    var userID = req.session.user;
        if(userID){
            //return public pastes belonging to the user
            Query = "select title, body, timestamp from Paste where email = '" + userID + "' and exposure = 'public';";
        }
        else{
            //return public pastes belonging to everyone
            Query = "select title, body, timestamp from Paste where exposure = 'public';";
        }
        console.log("the query is " + Query);
        var returnSet;
        connection.query(Query, function(err, results, fields){
            if(err){
                console.log("Some error occured");
            }
            else {
                console.log(JSON.stringify(results) + "succ");
                getPrivateCallback(results, userID);
            }
        })
    var getPrivateCallback = function(resultPublic, userID){
        connection.query("select title, body, timestamp from Paste where email = '" + userID + "' and exposure = 'private';", function(err, resultPrivate, fields){
            if(err){
                console.log("Some error occured");
                return 'error';
            }
            else {
                res.render('managePastes.ejs', {title:'Manage Pastes', user:req.session.user, public_pastes : resultPublic, private_pastes:resultPrivate});

            }
        })
    }
});
 */
/* app.get('/explorePastes', function(req, res){

    connection.query("select title, body, timestamp from Paste where exposure = 'public' order by timestamp desc;", function(err, resultPublic, fields){
        if(err){
            console.log("Some error occured");
            return 'error';
        }
        else {
            res.render('explorePastes.ejs', {title:'Explore Pastes', user:req.session.user, public_pastes : resultPublic});
        }
    })
}); */

app.get('/logout', function(req, res){
    req.session.user = undefined;
    res.redirect('/profile');
})
app.listen(3000, function(req, res){
    console.log("We are connected");
});

