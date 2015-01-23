var wd = require('wd');
require('colors');
var _ = require("lodash");
var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);
chai.should();
chaiAsPromised.transferPromiseness = wd.transferPromiseness;

// checking sauce credential
if(!process.env.SAUCE_USERNAME || !process.env.SAUCE_ACCESS_KEY){
    console.warn(
        '\nPlease configure your sauce credential:\n\n' +
        'export SAUCE_USERNAME=<SAUCE_USERNAME>\n' +
        'export SAUCE_ACCESS_KEY=<SAUCE_ACCESS_KEY>\n\n'
    );
    throw new Error("Missing sauce credentials");
}

// http configuration, not needed for simple runs
wd.configureHttp( {
    timeout: 60000,
    retryDelay: 15000,
    retries: 5
});

var desired = JSON.parse(process.env.DESIRED || '{browserName: "chrome"}');
desired.name = 'example with ' + desired.browserName;
desired.tags = ['tutorial'];

describe('iosr-node (' + desired.browserName + ')', function() {
    var browser;
    var allPassed = true;

    before(function(done) {
        var username = process.env.SAUCE_USERNAME;
        var accessKey = process.env.SAUCE_ACCESS_KEY;
        browser = wd.promiseChainRemote("ondemand.saucelabs.com", 80, username, accessKey);
        if(process.env.VERBOSE){
            // optional logging     
            browser.on('status', function(info) {
                console.log(info.cyan);
            });
            browser.on('command', function(meth, path, data) {
                console.log(' > ' + meth.yellow, path.grey, data || '');
            });            
        }
        browser
            .init(desired)
            .nodeify(done);
    });

    afterEach(function(done) {
        allPassed = allPassed && (this.currentTest.state === 'passed');  
        done();
    });

    after(function(done) {
        browser
            .quit()
            .sauceJobStatus(allPassed)
            .nodeify(done);
    });

    it("should get home page", function(done) {
    browser
            .get("http://iosr-node.herokuapp.com/demo")
	    .elementById('pl')
	    .click()
	    .get("http://iosr-node.herokuapp.com/demo")
            .title()
            .should.become("Twoja todo-lista")
            .nodeify(done);
    });

    it("home page - proper content", function(done) {
    browser
        .get("http://iosr-node.herokuapp.com/demo")
        .elementById('user_name')
        .text()
        .should.become("Witaj selenium tester")
        .elementById('logoutButton')
        .text()
        .should.become("Wyloguj")
        .elementById('new_task')
        .text()
        .should.become("Dodaj nowe zadanie")
        .nodeify(done);
    });

   it("adding new task", function(done) {
        browser
            .get("http://iosr-node.herokuapp.com/demo")
            .elementById('new_task')
            .click()
            .elementById('site_title')
            .text()
            .should.become("Twoja lista zadań")
            .elementByTagName('h2')
            .text()
            .should.become("Dodaj nowe zadanie")
            .elementById('title')
            .type("Zakupy")
            .elementById('saveNewTaskButton')
            .click()
            .elementByTagName('td')
            .text()
            .should.become('Zakupy')
            .nodeify(done);
    });

    it("todo list is not empty - edit status", function(done) {
        browser
            .get("http://iosr-node.herokuapp.com/demo")
            .elementById('editTaskButton')
            .text()
            .should.become("edytuj")
            .elementById('deleteTaskButton')
            .text()
            .should.become("usuń")
            .elementById('editTaskButton')
            .click()
            .elementByTagName('h2')
            .text()
            .should.become("Edytuj zadanie")
            .elementById('status')
            .text()
            .should.become('Do zrobieniaW trakcie realizacjiWstrzymaneWykonaneAnulowaneDo zrobienia')
            .elementById('status')
            .type("Wykonane")
            .elementById('saveEditedTaskButton')
            .click()
            .elementsByTagName('td')
            .text()
            .should.eventually.include("Twoja lista zadań\nWitaj selenium tester\nWyloguj\nTytuł Opis Status Data utworzenia\nZakupy Wykonane")
            .nodeify(done);
    });

    it("remove task", function(done) {
        browser
            .get("http://iosr-node.herokuapp.com/demo")
            .elementById('deleteTaskButton')
            .click()
            .elementByTagName('p')
            .text()
            .should.become('Nie masz żadnych zadan.')
            .nodeify(done);
    });
});
