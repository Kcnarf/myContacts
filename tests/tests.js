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
	deepEqual($("#createGroup").css('display'), "block", "[Global assert] After clicking 'Create a Group', modal 'Create Group' should be displayed");
};

createGroup= function(groupName) {
	goToCreateGroup();
	$("#createGroup #new_group_name input").val(groupName);
	$("#createGroup #new_group_name input").change();
	$("#createGroup button:contains('Create & Close')").click();
	deepEqual($("#noGroupDefined:contains('No group yet')").length, 0, "[Global assert] With at least 1 group defined, App should not display message 'No Group yet'");
	ok($("#groupListing thead tr").length>0, "[Global assert] With at least 1 group defined, App should display the number of Group(s)");
	ok($("#groupListing tbody tr").length>0, "[Global assert] With at least 1 group defined, App should display a list of Group(s)");
	ok($("#groupListing tbody tr:contains("+groupName+")").length>0, "[Global assert] The name of a newly created Group should be displayed in the list of Group(s)");
};

deleteGroup= function(groupName) {
	goToGroups();
	$("#groupListing tbody tr:contains("+groupName+") #deleteGroup").click();
};
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
		var expectedGroupCount= 1;
    createGroup(new_group_name);
		ok($("#groupListing thead tr:contains(expectedGroupCount)"), "App should display the right count of Groups");
		deepEqual($("#groupListing tbody tr").length, expectedGroupCount, "App should display each Group(s)");
});

test("Creation of a many Groups", function () {
		var newGroupName= "group1";
		var expectedGroupCount= 1;
    createGroup(newGroupName);
		ok($("#groupListing thead tr:contains(expectedGroupCount)"), "App should display the right count of Groups");
		deepEqual($("#groupListing tbody tr").length, expectedGroupCount, "App should display each Group(s)");
		newGroupName= "group2";
		expectedGroupCount= 2;
    createGroup(newGroupName);
		ok($("#groupListing thead tr:contains(expectedGroupCount)"), "App should display the right count of Groups");
		deepEqual($("#groupListing tbody tr").length, expectedGroupCount, "App should display each Group(s)");
});

test("Deletion of the last Group", function() {
	var newGroupName= "group1";
	createGroup(newGroupName);
	deleteGroup(newGroupName);
	deepEqual($("#noGroupDefined:contains('No group yet')").length, 1, "Without any group defined, App should display message 'No Group yet'");
});

test("Deletion of the not-last Group", function() {
	var groupName1= "group1";
	createGroup(groupName1);
	var groupName2= "Group2";
	createGroup(groupName2);
	deleteGroup(groupName1);
	deepEqual($("#groupListing tbody tr:contains("+groupName1+")").length, 0, "The name of a deleted Group should no longer be displayed in the list of Group(s)");
	deepEqual($("#groupListing tbody tr:contains("+groupName2+")").length, 1, "The name of a non-deleted Group should remain displayed in the list of Group(s)");
});