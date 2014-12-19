pg = require('pg');

var Db = function(host,user,pass,database,ssl){
    this._client = new pg.Client({host: host, user: user, password: pass, database: database, ssl: ssl});
    this._client.connect();
};

Db.prototype.getConnection = function(){
    return this._client;
};

module.exports = Db;