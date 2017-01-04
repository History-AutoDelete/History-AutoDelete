var fs = require('fs');
var sinon = require('sinon');
var browser = require('sinon-chrome');
var assert = require('chai').assert;
//var jsdom = require('jsdom');
var answer = 42;

describe('background page', function () {
/*
    var window;

    beforeEach(function (done) {
        jsdom.env({
            // generated background page
            html: '<html></html>',
            // js source
            src: [fs.readFileSync('../background.js', 'utf-8')],
            created: function (errors, wnd) {
                // attach `browser` to window
                wnd.browser = browser;
                wnd.console = console;
            },
            done: function (errors, wnd) {
                if (errors) {
                    console.log(errors);
                    done(true);
                } else {
                    window = wnd;
                    done();
                }
            }
        });
    });

    afterEach(function () {
        browser.reset();
        window.close();

    });
*/
    it("equal 42", function() {
    	assert.equal(answer, 42, "it equals!");
    });
    
});