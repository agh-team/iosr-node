var express = require('express')
        , everyauth = require('everyauth')
        , conf = require('./conf')
        , Db = require('./services/db')
        , db = new Db(conf.db_host, conf.db_user, conf.db_password, conf.db_database, conf.db_ssl)
        , Users = require('./models/user')
        , Task = require('./models/task')
        , TaskList = require('./models/taskList')
        , path = require('path')
        , users = new Users()
        , i18n = require('i18n');


everyauth.everymodule
        .findUserById(function(id, callback) {
            callback(null, users.getUser(id));
        });

everyauth.google
        .appId(conf.google.clientId)
        .appSecret(conf.google.clientSecret)
        .scope('https://www.googleapis.com/auth/userinfo.profile https://www.google.com/m8/feeds/')
        .findOrCreateUser(function(sess, accessToken, extra, googleUser) {
            googleUser.refreshToken = extra.refresh_token;
            googleUser.expiresIn = 10;//extra.expires_in;
            return users.addUser(googleUser);
        })
        .redirectPath('/');

i18n.configure({
    locales: ['en', 'pl'],
    cookie: 'locale',
    directory: __dirname + '/locales'
});

var app = express();
app
        .use(express.bodyParser())
        .use(express.cookieParser('mr ripley'))
        .use(express.session())
        .use(everyauth.middleware());

app.configure(function() {
    app.set('view engine', 'jade');
    app.set('views', __dirname + '/views');
    app.set('view options', {layout: false});
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(i18n.init);
});
app.get('/pl', function(req, res) {
    res.cookie('locale', 'pl', { maxAge: 900000, httpOnly: true });
    res.redirect('/');
});
app.get('/en', function(req, res) {
    res.cookie('locale', 'en', { maxAge: 900000, httpOnly: true });
    res.redirect('/');
});
app.get('/tasks', function(req, res) {

    if (typeof req.user === "undefined" && typeof req.session.user !== "undefined") {
        req.user = req.session.user;
    }

    if (typeof req.user === "undefined") {
        res.redirect('/');
        return;
    }

    var tasks = new TaskList(req.user.id);
    tasks.getTasks(db.getConnection(), Task, function(err, result) {
        if (!err) {
            res.render('tasks', {
                user: req.user,
                tasks: result

            });
        }
    });


});

app.get('/', function(req, res) {
    if (typeof req.user === "undefined" && typeof req.session.user !== "undefined") {
        req.user = req.session.user;
    }
    if (typeof req.user !== "undefined") {
        res.redirect('/tasks');
    }

    res.render('home', {
        layout: 'layout.jade',
        locals: {
            user: req.user
        }
    });
});

app.get('/demo', function(req, res) {
    req.session.user = {"id": 0, "name": "selenium tester", "picture": "http://cdn3.iconfinder.com/data/icons/softwaredemo/PNG/256x256/User1.png"};
    res.cookie('locale', 'pl', { maxAge: 900000, httpOnly: true });
    res.redirect('/');
    return;
});

app.get('/addTask', function(req, res) {
    if (typeof req.user === "undefined" && typeof req.session.user !== "undefined") {
        req.user = req.session.user;
    }
    if (typeof req.user === "undefined") {
        res.redirect('/');
        return;
    }
    res.render('addTask', {
    });
});

app.get('/deleteTask', function(req, res) {
    if (typeof req.user === "undefined" && typeof req.session.user !== "undefined") {
        req.user = req.session.user;
    }
    if (typeof req.user === "undefined") {
        res.redirect('/');
        return;
    }
    var task = new Task(req.query.id, undefined, undefined, undefined, req.user.id, undefined);
    task.delete(db.getConnection(), function(err) {
        if (!err)
            res.redirect('/');
    });
});

app.get('/editTask', function(req, res) {
    if (typeof req.user === "undefined" && typeof req.session.user !== "undefined") {
        req.user = req.session.user;
    }
    if (typeof req.user === "undefined") {
        res.redirect('/');
        return;
    }
    var task = new Task(req.query.id, undefined, undefined, undefined, req.user.id, undefined);
    task.getFromDb(db.getConnection(), function(err, task) {
        if (!err) {
            res.render('editTask', {task: task, statuses: conf.statuses});
        } else {
            return;
        }
    });

});

app.post('/saveTask', function(req, res) {
    if (typeof req.user === "undefined" && typeof req.session.user !== "undefined") {
        req.user = req.session.user;
    }
    if (typeof req.user === "undefined") {
        res.redirect('/');
        return;
    }
    var task = new Task(req.body.id, req.body.title, req.body.desc, req.body.status, req.user.id, conf.statuses);//-----USER ID
    task.save(db.getConnection(), function(err) {
        if (!err)
            res.redirect('/');
    });



});

var port = process.env.PORT || conf.port;
app.listen(port, process.env.OPENSHIFT_NODEJS_IP);