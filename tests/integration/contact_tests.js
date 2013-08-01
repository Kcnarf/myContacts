// Setup of Ember's Testing framework
document.write('<div id="ember-testing-container"><div id="ember-testing"></div></div>');
App.rootElement = '#ember-testing';
App.LOG_TRANSITIONS= false;
App.setupForTesting();
App.injectTestHelpers();

// Replace our REST-based store with a fixture-based store for testing, so we
// don't need a server.  We disable simulateRemoteResponse so that objects will
// appear to load at the end of every Ember.run block instead of waiting for a
// timer to fire.
App.Store = DS.Store.extend({
	adapter: DS.FixtureAdapter.create({
		simulateRemoteResponse: false
	})
});

// Declare some fixture objects to use in our test application.
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
	App.reset();
});

// Run after each test case.
QUnit.testDone(function () {
	Ember.testing = false;
});


//TEST HELPERS -begining
Ember.Test.registerHelper('goToContacts', function(app) {
  visit("/")
  .then(function() {
		click("a:contains('Search contacts')");
	});
  return wait();
});

Ember.Test.registerHelper('goToCreateContact', function(app) {
	visit("/")
	.then(function() {
		click("a:contains('Create contact')");
	});
	return wait();
});

Ember.Test.registerHelper('createContact', function(app, contactAlias) {
	goToCreateContact()
	.then(function() {
		fillIn("#createContact #new_contact_alias input", contactAlias);
	}).then(function() {
		click("#createContact .btn:contains('Save')");
	});
	return wait();
});
/*
Ember.Test.registerHelper('goToEditGroup', function(app, groupName) {
	goToGroups()
	.then(function() {
		click("#groupListing tbody tr:contains("+groupName+") #editGroup");
	});
	return wait();
});

Ember.Test.registerHelper('editGroup', function(app, groupName, newGroupName) {
	goToEditGroup(groupName)
	.then(function() {
		fillIn("#editGroup_"+groupName+" input", newGroupName);
	}).then(function() {
		click("#editGroup_"+newGroupName+" button:contains('Save & Close')");
	})
	return wait();
});

Ember.Test.registerHelper('deleteGroup', function(app, groupName) {
	goToGroups()
	.then(function() {
		click("#groupListing tbody tr:contains("+groupName+") #deleteGroup");
	});
	return wait();
});
*/
App.injectTestHelpers();
//TEST HELPERS -end

module("Integration/Contact");

test("Special message when no Contact", function () {
	goToContacts()
	.then(function() {
		deepEqual(find("#noContactDefined:contains('No Contact yet')").length, 1, "Without any contact defined, App should display message 'No Contact yet'");
		deepEqual(find("#contactListing").length, 0, "With no contact defined, App should not display a list of Contact(s)");
  })
});

test("Creation of a Contact is available", function () {
	goToCreateContact()
	.then(function() {
		ok(find("#createContact"), "After clicking 'Create contact', UI allowing to create a Contact should be displayed");
	}).then(function() {
		return click("#createContact .btn:contains('Cancel')");
	})
});

test("Creation of a Contact can be cancelled", function () {
	var contactAlias= "alias1";
	goToCreateContact()
	.then(function() {
		fillIn("#createContact #new_contact_alias input", contactAlias);
	}).then(function() {
		return click("#createContact .btn:contains('Cancel')");
	}).then(function() {
		deepEqual(find("#createGroup").length, 0, "After cancelation, UI allowing to create a Contact should no longer be displayed");
		deepEqual(find("#noContactDefined:contains('No Contact yet')").length, 1, "Without any contact defined, App should display message 'No Contact yet'");
		deepEqual(find("#contactListing").length, 0, "With no contact defined, App should not display a list of Contact(s)");
	})
});

test("Creation of first Contact", function () {
	var contactAlias= "Alias1";
	var expectedContactCount= 1;
	createContact(contactAlias)
	.then(function() {
		deepEqual(find("#noContactDefined:contains('No Contact yet')").length, 0, "With at least 1 contact defined, App should not display message 'No Contact yet'");
		ok(find("#contactListing thead tr").length>0, "With at least 1 contact defined, App should display the number of Contact(s)");
		ok(find("#contactListing tbody tr").length>0, "With at least 1 contact defined, App should display a list of Contact(s)");
		ok(find("#contactListing tbody tr:contains("+contactAlias+")").length>0, "The name of a newly created contact should be displayed in the list of Contact(s)");
		ok(find("#contactListing thead tr:contains(expectedContactCount)"), "App should display the right count of Contacts");
		deepEqual(find("#contactListing tbody tr").length, expectedContactCount, "App should display each Contact(s)");
	})
});

test("Creation of a many Contacts", function () {
	var contactAlias= "alias1";
	var expectedContactCount= 1;
	createContact(contactAlias)
	.then(function() {
		deepEqual(find("#noContactDefined:contains('No Contact yet')").length, 0, "With at least 1 contact defined, App should not display message 'No Contact yet'");
		ok(find("#contactListing thead tr").length>0, "With at least 1 contact defined, App should display the number of Contact(s)");
		ok(find("#contactListing tbody tr").length>0, "With at least 1 contact defined, App should display a list of Contact(s)");
		ok(find("#contactListing tbody tr:contains("+contactAlias+")").length>0, "The name of a newly created contact should be displayed in the list of Contact(s)");
		ok(find("#contactListing thead tr:contains(expectedContactCount)"), "App should display the right count of Contacts");
		deepEqual(find("#contactListing tbody tr").length, expectedContactCount, "App should display each Contact(s)");
	}).then(function() {
		contactAlias= "Alias";
		expectedContactCount= 2;
		return createContact(contactAlias);
	}).then(function() {
	deepEqual(find("#noContactDefined:contains('No Contact yet')").length, 0, "With at least 1 contact defined, App should not display message 'No Contact yet'");
		ok(find("#contactListing thead tr").length>0, "With at least 1 contact defined, App should display the number of Contact(s)");
		ok(find("#contactListing tbody tr").length>0, "With at least 1 contact defined, App should display a list of Contact(s)");
		ok(find("#contactListing tbody tr:contains("+contactAlias+")").length>0, "The name of a newly created contact should be displayed in the list of Contact(s)");
		ok(find("#contactListing thead tr:contains(expectedContactCount)"), "App should display the right count of Contacts");
		deepEqual(find("#contactListing tbody tr").length, expectedContactCount, "App should display each Contact(s)");
	})
});
/*
test("Update of a Group is available", function () {
	var groupName= "Group1";
	createGroup(groupName)
	.then(function() {
		return goToEditGroup(groupName);
	}).then(function() {
		deepEqual(find("#editGroup_"+groupName).css('display'), "block", "After clicking 'Edit Group', UI allowing to edit a Group should be displayed");
	}).then(function() {
		return click("#editGroup_"+groupName+" .close");
	})
});

test("Update of a Group can be cancelled", function () {
	var groupName1= "Group1";
	var groupName2= "Group2";
	createGroup(groupName1)
	.then(function() {
		return goToEditGroup(groupName1);
	}).then(function() {
		return fillIn("#editGroup_"+groupName1+" input", groupName2);
	}).then(function() {
		return click("#editGroup_"+groupName2+" .close");
	}).then(function() {
		deepEqual(find("#editGroup_"+groupName1).css('display'), "none", "After edit cancelation, UI allowing to edit a Group should no longer be displayed");
		ok(find("#groupListing tbody tr:contains("+groupName1+")").length>0, "After edit cancelation, the un-edited Group should be displayed in the list of Group(s)");
	})
});

test("Update of a Group", function () {
	var groupName1= "Group1";
	var groupName2= "Group2";
	createGroup(groupName1)
	.then(function() {
		return editGroup(groupName1, groupName2);
	}).then(function() {
		ok(find("#groupListing tbody tr:contains("+groupName2+")").length>0, "After edition, the updated name of the Group should be displayed in the list of Group(s)");
		deepEqual(find("#groupListing tbody tr:contains("+groupName1+")").length, 0, "After edition, the old name of the Group should no longer be displayed in the list of Group(s)");
	})
});

test("Deletion of the last Group", function() {
	var groupName= "Group1";
	createGroup(groupName)
	.then(function() {
		return deleteGroup(groupName);
	}).then(function() {
		deepEqual(find("#noGroupDefined:contains('No group yet')").length, 1, "Without any group defined, App should display message 'No Group yet'");
		deepEqual(find("#groupListing").length, 0, "With no group defined, App should not display a list of Group(s)");
	})
});

test("Deletion of the non-last Group", function() {
	var groupName1= "Group1";
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
*/