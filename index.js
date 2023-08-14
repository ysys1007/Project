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

//ID, PS 등록 하는 곳 (register)
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

//로그인 하는 곳 
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
            res.render('fail-login');
        else 
            res.render('successful-login', {username});
    });
});



//게시물 보는 곳
app.get('/Home', function(req, res) {
    connection.query('SELECT * FROM posts', function(error, results) {
        if (error) {
            console.log(error);
            return;
        }
        res.render('Home', { posts: results }); // Home.ejs에 게시물 목록 전달
    });
});



// 글 작성하는 곳 
app.get('/create-post', function(req, res) {
    res.render('create-post');
});

app.post('/create-post', function(req, res) {
    const { title, content } = req.body;

    connection.query(
        `INSERT INTO posts (title, content) VALUES (?, ?)`,
        [title, content],
        function(error, results) {
            if (error) {
                console.log(error);
                return;
            }
            console.log('Post created:', results.insertId);
            res.redirect('/Home'); // 작성 후 홈 페이지로 리다이렉트
        }
    );
});



//글 작성 후 Home에 각각 버튼으로 게시물 보임. 
app.get('/', (req, res) => {
    res.render('home', { posts });
  });
  
  app.get('/create-post', (req, res) => {
    res.render('create-post');
  });
  
  app.post('/create-post', (req, res) => {
    const { title, content } = req.body;
    posts.push({ title, content });
    res.redirect('/Home');
  });

//글 버튼 클릭 시 수정...할 수 있을까?

// 글 삭제 처리


app.listen(3000); mysql