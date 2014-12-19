var rewire = require("rewire");
var taskListModel = require("../models/taskList.js");
var taskModel = require("../models/task.js");

describe("taskListModel tests", function() {
    beforeEach(function() {
        this.taskListObject = new taskListModel(321);
    });
    describe("constructor ", function() {
        it('should set model atribiutes', function() {
            expect(this.taskListObject.user_id).toEqual(321);
            expect(this.taskListObject.tasks).toEqual([]);
        });
    });
    describe("getTask function", function() {
        beforeEach(function() {
            this.connection = {query: function(query, arr, callback) {
                    callback(false, {rows: [{
                                id: 2,
                                title: "title from db",
                                desc: "desc from db",
                                status: "In progress"
                            }]});
                }};
        });
        it("shoud set tasks in list", function() {
            this.taskListObject.getTasks(this.connection, taskModel, function() {
            });
            expect(this.taskListObject.tasks[0].title).toEqual("title from db");
            expect(this.taskListObject.tasks[0].desc).toEqual("desc from db");
        });
    });
    describe("getTask error function", function() {
        beforeEach(function() {
            this.connection = {query: function(query, arr, callback) {
                    callback(true);
                }};
        });
        it("shoud set tasks in list", function() {
            this.taskListObject.getTasks(this.connection, taskModel, function() {});
            expect(typeof(this.taskListObject.tasks[0])).toEqual("undefined");
        });
    });
});

