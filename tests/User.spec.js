var rewire = require("rewire");
var userModel = require("../models/user.js")

describe("userModel tests", function() {
    beforeEach(function() {
        this.userObject = new userModel();
    });
    describe("constructor", function() {
        it("should set atribiutes", function() {
            expect(this.userObject._users).toEqual([]);
            expect(typeof (this.userObject.cleanerInterval)).not.toBe("undefined");
            expect(this.userObject.expirationTime).toEqual(3600);
        });
    });
    describe("addUser and getUser", function() {
        beforeEach(function() {
            this.userObject.addUser({
                id: 3,
                name: "tester"
            });
        });
        it("add is working", function() {
            expect(this.userObject._users[3].name).toEqual("tester");
        });
        it("get is working", function() {
            expect(this.userObject.getUser(3).name).toEqual("tester");
            expect(this.userObject.getUser(1)).toEqual(false);
        });

    });

});

