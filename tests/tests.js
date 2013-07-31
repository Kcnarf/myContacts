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

// Setup of Ember's Testing framework
document.write('<div id="ember-testing-container"><div id="ember-testing"></div></div>');
App.rootElement = '#ember-testing';
App.setupForTesting();
App.injectTestHelpers();
	
// Run before each test case.
QUnit.testStart(function () {
	App.Contact.FIXTURES = [];
	App.Group.FIXTURES = [];
	App.Contact_group_link.FIXTURES = [];
	// Put the application into a known state, and destroy the defaultStore.
	// Be careful about DS.Model instances stored in App; they'll be invalid
	// after this.
	// This is broken in some versions of Ember and Ember Data, see:
	// https://github.com/emberjs/data/issues/847
	Ember.run(function () { App.reset(); });
	// Display an error if asynchronous operations are queued outside of
	// Ember.run.  You need this if you want to stay sane.
	Ember.testing = true;
	App.reset();
});

// Run after each test case.
QUnit.testDone(function () {
	Ember.testing = false;
});

// Optional: Clean up after our last test so you can try out the app
// in the jsFiddle.  This isn't normally required.
/*
QUnit.done(function () {
	Ember.run(function () { App.reset(); });
});
*/


//TEST HELPERS -begining

Ember.Test.registerHelper('goToGroups', function(app) {
  visit("/")
  .then(function() {
		click("a:contains('Groups')");
	});
  return wait();
});

Ember.Test.registerHelper('goToCreateGroup', function(app) {
	goToGroups()
	.then(function() {
		click("a:contains('Create a Group')");
	});
	return wait();
});

Ember.Test.registerHelper('createGroup', function(app, groupName) {
	goToCreateGroup()
	.then(function() {
		fillIn("#createGroup #new_group_name input", groupName);
	}).then(function() {
		click("#createGroup button:contains('Create & Close')");
	});
	return wait();
});

Ember.Test.registerHelper('deleteGroup', function(app, groupName) {
	goToGroups()
	.then(function() {
		click("#groupListing tbody tr:contains("+groupName+") #deleteGroup");
	});
	return wait();
});

App.injectTestHelpers();
//TEST HELPERS -end


module("Group/creation features");

test("Special message when no Group", function () {
	goToGroups()
	.then(function() {
		deepEqual(find("#noGroupDefined:contains('No group yet')").length, 1, "Without any group defined, App should display message 'No Group yet'");
  })
});

test("Creation of a Group is available", function () {
	goToCreateGroup()
	.then(function() {
		deepEqual(find("#createGroup").css('display'), "block", "After clicking 'Create a Group', UI allowing to create a Group should be displayed");
	}).then(function() {
		return click("#createGroup .close");
	})
});

test("Creation of a Group can be cancelled", function () {
	goToCreateGroup()
	.then(function() {
		return click("#createGroup .close");
	}).then(function() {
		deepEqual(find("#createGroup").css('display'), "none", "After cancelation, modal 'Create Group' should no longer be displayed");
		deepEqual(find("#noGroupDefined:contains('No group yet')").length, 1, "Without any group defined, App should display message 'No Group yet'");
	})
});

test("Creation of first Group", function () {
	var groupName= "group1";
	var expectedGroupCount= 1;
	createGroup(groupName)
	.then(function() {
		deepEqual(find("#noGroupDefined:contains('No group yet')").length, 0, "With at least 1 group defined, App should not display message 'No Group yet'");
		ok(find("#groupListing thead tr").length>0, "With at least 1 group defined, App should display the number of Group(s)");
		ok(find("#groupListing tbody tr").length>0, "With at least 1 group defined, App should display a list of Group(s)");
		ok(find("#groupListing tbody tr:contains("+groupName+")").length>0, "The name of a newly created Group should be displayed in the list of Group(s)");
		ok(find("#groupListing thead tr:contains(expectedGroupCount)"), "App should display the right count of Groups");
		deepEqual(find("#groupListing tbody tr").length, expectedGroupCount, "App should display each Group(s)");
	})
});

test("Creation of a many Groups", function () {
	var groupName= "group1";
	var expectedGroupCount= 1;
	createGroup(groupName)
	.then(function() {
		deepEqual(find("#noGroupDefined:contains('No group yet')").length, 0, "With at least 1 group defined, App should not display message 'No Group yet'");
		ok(find("#groupListing thead tr").length>0, "With at least 1 group defined, App should display the number of Group(s)");
		ok(find("#groupListing tbody tr").length>0, "With at least 1 group defined, App should display a list of Group(s)");
		ok(find("#groupListing tbody tr:contains("+groupName+")").length>0, "The name of a newly created Group should be displayed in the list of Group(s)");
		ok(find("#groupListing thead tr:contains(expectedGroupCount)"), "App should display the right count of Groups");
		deepEqual(find("#groupListing tbody tr").length, expectedGroupCount, "App should display each Group(s)");
	}).then(function() {
		groupName= "group2";
		expectedGroupCount= 2;
		return createGroup(groupName)
	}).then(function() {
		deepEqual($("#noGroupDefined:contains('No group yet')").length, 0, "With at least 1 group defined, App should not display message 'No Group yet'");
		ok(find("#groupListing thead tr").length>0, "With at least 1 group defined, App should display the number of Group(s)");
		ok(find("#groupListing tbody tr").length>0, "With at least 1 group defined, App should display a list of Group(s)");
		ok(find("#groupListing tbody tr:contains("+groupName+")").length>0, "The name of a newly created Group should be displayed in the list of Group(s)");
		ok(find("#groupListing thead tr:contains(expectedGroupCount)"), "App should display the right count of Groups");
		deepEqual(find("#groupListing tbody tr").length, expectedGroupCount, "App should display each Group(s)");
	})
});

test("Deletion of the last Group", function() {
	var groupName= "group1";
	createGroup(groupName)
	.then(function() {
		return deleteGroup(groupName);
	}).then(function() {
		deepEqual(find("#noGroupDefined:contains('No group yet')").length, 1, "Without any group defined, App should display message 'No Group yet'");
	})
});

test("Deletion of the non-last Group", function() {
	var groupName1= "group1";
	var groupName2= "Group2";
	createGroup(groupName1)
	.then(function() {
		return createGroup(groupName2);
	}).then(function() {
		return deleteGroup(groupName1);
	}).then(function() {
		deepEqual(find("#groupListing tbody tr:contains("+groupName1+")").length, 0, "The name of a deleted Group should no longer be displayed in the list of Group(s)");
		deepEqual(find("#groupListing tbody tr:contains("+groupName2+")").length, 1, "The name of a non-deleted Group should remain displayed in the list of Group(s)");
	})
});