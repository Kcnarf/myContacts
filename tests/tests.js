/*******************************
* Test Code
*******************************/
//================================================================================
// Test Code

// Replace our fixture-based store with a REST-based store for testing, so we
// don't need a server.  We disable simulateRemoteResponse so that objects will
// appear to load at the end of every Ember.run block instead of waiting for a
// timer to fire.
App.Store = DS.Store.extend({
    adapter: DS.FixtureAdapter.create({ simulateRemoteResponse: false })
});

// Declare some fixture objects to use in our test application.  There's
// nothing like factory_girl or machinist yet.
App.Contact.FIXTURES = [];
App.Group.FIXTURES = [];
App.Contact_group_link.FIXTURES = [];

// Run before each test case.
QUnit.testStart(function () {
	// Put the application into a known state, and destroy the defaultStore.
	// Be careful about DS.Model instances stored in App; they'll be invalid
	// after this.
	// This is broken in some versions of Ember and Ember Data, see:
	// https://github.com/emberjs/data/issues/847
	Ember.run(function () { App.reset(); });
	// Display an error if asynchronous operations are queued outside of
	// Ember.run.  You need this if you want to stay sane.
	Ember.testing = true;
});

// Run after each test case.
QUnit.testDone(function () {
	Ember.testing = false;
});

// Optional: Clean up after our last test so you can try out the app
// in the jsFiddle.  This isn't normally required.
QUnit.done(function () {
	Ember.run(function () { App.reset(); });
});

module("Group features");

//KEYWORDS -begining
goToGroups= function() {
	$("a:contains('Groups')").click();
}

goToCreateGroup= function() {
	goToGroups();
	$("a:contains('Create a Group')").click();
	deepEqual($("#createGroup").css('display'), "block", "After clicking 'Create a Group', modal 'Create Group' should be displayed");
}

createGroup= function(name) {
	goToCreateGroup();
	$("#createGroup #new_group_name input").val('Group1');
	$("#createGroup button:contains('Create & Close')").click();
}
//KEYWORDS -end

test("Special message when no Group", function () {
	goToGroups();
	deepEqual($("#noGroupDefined:contains('No group yet')").length, 1, "Without any group defined, App should display message 'No Group yet'");
});

test("Creation of a Group can be cancelled", function () {
	goToCreateGroup();
	$("#createGroup .close").click();
	deepEqual($("#createGroup").css('display'), "none", "After cancelation, modal 'Create Group' should no longer be displayed");
	deepEqual($("#noGroupDefined:contains('No group yet')").length, 1, "Without any group defined, App should display message 'No Group yet'");
});

test("Creation of a Group", function () {
		var new_group_name= "group1";
    createGroup(new_group_name);
		deepEqual($("#noGroupDefined:contains('No group yet')").length, 0, "With at least 1 group defined, App should not display message 'No Group yet'");
		
});