/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
 
var TaskList = function(user_id){
    this.user_id = user_id;
    this.tasks = new Array();
};

TaskList.prototype.getTasks = function(connection, TaskModel, cb){
    var that = this;
    connection.query('SELECT * FROM tasks WHERE user_id=$1 ORDER BY created', [this.user_id], function(err, result) {
        if (!err) {
            if (result.rows.length !== 0) {
                for(var i in result.rows){
                    var task = new TaskModel(result.rows[i].id, result.rows[i].title, result.rows[i].desc, result.rows[i].status, result.rows[i].user_id);
                    task.setCreated(result.rows[i].created);
                    that.tasks.push(task);
                }
            }
        }
        else
            console.error('error', err);
        cb(err, that.tasks);
    });
};

module.exports = TaskList;