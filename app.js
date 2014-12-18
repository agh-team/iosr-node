var express = require('express'),
        conf = require('./conf')
        , Db = require('./services/db')
        , db = new Db(conf.db_host, conf.db_user, conf.db_password, conf.db_database, conf.db_ssl)
        , Task = require('./models/task');


var app = express();


var port = process.env.PORT || conf.port;
app.listen(port, process.env.OPENSHIFT_NODEJS_IP);