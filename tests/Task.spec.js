var rewire = require("rewire");
var taskModel = require("../models/task.js");

describe("taskModel tests", function() {
    beforeEach(function() {
        this.taskObject = new taskModel(1, "title", "desc", "TODO", 321);
    });
    describe("constructor ", function() {
        it('should set model atribiutes', function() {
            expect(this.taskObject.id).toEqual(1);
            expect(this.taskObject.title).toEqual("title");
            expect(this.taskObject.desc).toEqual("desc");
            expect(this.taskObject.status).toEqual("TODO");
            expect(this.taskObject.user_id).toEqual(321);
        });
    });
    describe("setCreated function", function() {
        it("should set created time as Date object", function() {
            this.taskObject.setCreated("2014-12-17");
            expect(this.taskObject.created).toEqual("2014-12-17");
            ;
        });
    });
    describe("getFromDb function", function() {
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
        it("shoud set atribiutes from mock db", function() {
            this.taskObject.getFromDb(this.connection, function() {
            });
            expect(this.taskObject.id).toEqual(2);
            expect(this.taskObject.title).toEqual("title from db");
            expect(this.taskObject.desc).toEqual("desc from db");
            expect(this.taskObject.status).toEqual("In progress");
        });

    });
    describe("getFromDb error function", function() {
        beforeEach(function() {
            this.connection = {query: function(query, arr, callback) {
                    callback(true);
                }};
        });
        it("shoud set atribiutes from mock db", function() {
            this.taskObject.getFromDb(this.connection, function() {
            });
            expect(this.taskObject.id).toEqual(1);
            expect(this.taskObject.title).toEqual("title");
        });

    });
    describe("save function", function() {
        beforeEach(function() {
            this.callback = function() {
            };
            this.spyCallback = spyOn(this, "callback");
            this.connection = {query: function(query, arr, callback) {
                    callback(false);
                }};

        });
        it("call callback", function() {
            this.taskObject.save(this.connection, this.callback);
            expect(this.spyCallback).toHaveBeenCalled();
            this.taskObject.id = undefined;
            this.taskObject.save(this.connection, this.callback);
            expect(this.spyCallback).toHaveBeenCalled();
        });
        it("delete function", function() {
            this.taskObject.id = 1;
            this.taskObject.delete(this.connection, this.callback);
            expect(this.spyCallback).toHaveBeenCalled();
        });
    });
});

