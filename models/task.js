/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var Task = function(id, title, desc, status, user_id, statuses) {
    this.id = id;
    this.title = title;
    this.desc = desc;
    if (typeof (status) !== "undefined") {
        this.status = status;
    }

    if (typeof (status) === "undefined" && typeof (statuses) !== "undefined")
        this.status = statuses[0];
    this.user_id = user_id;
};

Task.prototype.setCreated = function(created) {

    this.created = new Date(created);
    this.created = (this.created.getFullYear() + '-' + (this.created.getMonth() + 1) + '-' + this.created.getDate());
};

Task.prototype.getFromDb = function(connection, cb) {
    var that = this;
    connection.query('SELECT * FROM tasks WHERE user_id=$1 AND id=$2', [this.user_id, this.id], function(err, result) {
        if (!err) {

            if (result.rows.length !== 0) {
                that.id = result.rows[0].id;
                that.title = result.rows[0].title;
                that.desc = result.rows[0].desc;
                that.status = result.rows[0].status;
            }
        }
        else
            console.error('error', err);
        cb(err, that);
    });

};

Task.prototype.save = function(connection, cb) {
    if (typeof (this.id) === "undefined") { // add task
        connection.query('INSERT INTO tasks(title, "desc", status, user_id) VALUES($1,$2,$3,$4)',
                [this.title, this.desc, this.status, this.user_id], function(err, res) {
            cb(err, res);
        });
    } else {
        connection.query('UPDATE tasks SET title=$1, "desc"=$2, status=$3 WHERE user_id=$4 AND id=$5;',
                [this.title, this.desc, this.status, this.user_id, this.id], function(err, res) {
            cb(err, res);
        });
    }
};

Task.prototype.delete = function(connection, cb) {
    connection.query('DELETE FROM tasks WHERE user_id=$1 AND id=$2;',
            [this.user_id, this.id], function(err, res) {
        cb(err, res);
    });
};

module.exports = Task;