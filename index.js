const express = require('express');
const mysql = require('mysql');
const ejs = require('ejs');
const bodyParser = require('body-parser');

const app = express();

const connection = mysql.createConnection({
    host:'db.teamlog.kr',
    user: 'admin',
    password: 'teamlog2023!',
    database: 'teamlog_10319'
});

connection.connect();

app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get('/register', function(req,res) {
    res.render('register');
});

app.post('/register', function(req,res) {
    const {username, password} = req.body;

    connection.query(`INSERT INTO Info (username, password) VALUES('${username}', '${password}')`, 
    function(error) {
        if (error) {
            console.log(error);
        }
        res.render('successful-register');

    });
});

app.get('/login', function(req,res) {
    res.render('login');
});

app.post('/login', function(req,res) {
    const {username, password} = req.body;

    connection.query(`SELECT * FROM Info WHERE username='${username}' and password='${password}'`, function(error, results) {
        if (error) {
            console.log(error);
        }
        if (!Object.keys(results).length)
            res.render('fail');
        else 
            res.render('successful-login', {username});
    });
});



// 글 작성 페이지
app.get('/create', (req, res) => {
    res.render('create');
});

// 글 작성 처리


// 글 삭제 처리


app.listen(3000); mysql