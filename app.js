var express = require('express')
        , everyauth = require('everyauth')
        , conf = require('./conf')
        , Db = require('./services/db')
        , db = new Db(conf.db_host, conf.db_user, conf.db_password, conf.db_database, conf.db_ssl)
        , Users = require('./models/user')
        , Task = require('./models/task')
        , path = require('path')
        , users = new Users();


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

});

app.get('/', function(req, res) {

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

var port = process.env.PORT || conf.port;
app.listen(port, process.env.OPENSHIFT_NODEJS_IP);