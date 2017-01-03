const chrome = require('sinon-chrome');
var background = require("../background.js").main;
var assert = require("chai").assert;
var answer = 42;

describe("Test", function() {
	it("should be added to set", function() {
		assert.equal(42, answer);
	})
})