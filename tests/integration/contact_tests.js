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

Ember.Test.registerHelper('goToEditContact', function(app, contactAlias) {
	goToContacts()
	.then(function() {
		click("#contactListing tbody tr:contains("+contactAlias+") #editContact");
	});
	return wait();
});

Ember.Test.registerHelper('editContact', function(app, contactAlias, newContactAlias) {
	goToEditContact(contactAlias)
	.then(function() {
		fillIn("#editContact_"+contactAlias+" input", newContactAlias);
	}).then(function() {
		click("#editContact_"+newContactAlias+" button:contains('Save & Close')");
	})
	return wait();
});

Ember.Test.registerHelper('deleteContact', function(app, contactAlias) {
	goToContacts()
	.then(function() {
		click("#contactListing tbody tr:contains("+contactAlias+") #deleteContact");
	});
	return wait();
});

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

test("Update of a Contact is available", function () {
	var contactAlias= "Alias1";
	createContact(contactAlias)
	.then(function() {
		return goToEditContact(contactAlias);
	}).then(function() {
		deepEqual(find("#editContact_"+contactAlias).css('display'), "block", "After clicking 'Edit Contact', UI allowing to edit a Contact should be displayed");
	}).then(function() {
		return click("#editContact_"+contactAlias+" .close");
	})
});

test("Update of a Contact can be cancelled", function () {
	var contactAlias1= "Alias1";
	var contactAlias2= "Alias2";
	createContact(contactAlias1)
	.then(function() {
		return goToEditContact(contactAlias1);
	}).then(function() {
		return fillIn("#editContact_"+contactAlias1+" input", contactAlias2);
	}).then(function() {
		return click("#editContact_"+contactAlias2+" .close");
	}).then(function() {
		deepEqual(find("#editContact_"+contactAlias1).css('display'), "none", "After edit cancelation, UI allowing to edit a Contact should no longer be displayed");
		ok(find("#contactListing tbody tr:contains("+contactAlias1+")").length>0, "After edit cancelation, the un-edited Contact should be displayed in the list of Contact(s)");
	})
});

test("Update of a Contact", function () {
	var contactAlias1= "Alias1";
	var contactAlias2= "Alias2";
	createContact(contactAlias1)
	.then(function() {
		return editContact(contactAlias1, contactAlias2);
	}).then(function() {
		ok(find("#contactListing tbody tr:contains("+contactAlias2+")").length>0, "After edition, the updated name of the Contact should be displayed in the list of Contact(s)");
		deepEqual(find("#contactListing tbody tr:contains("+contactAlias1+")").length, 0, "After edition, the old name of the Contact should no longer be displayed in the list of Contact(s)");
	})
});

test("Deletion of the last Contact", function() {
	var contactAlias= "Alias1";
	createContact(contactAlias)
	.then(function() {
		return deleteContact(contactAlias);
	}).then(function() {
		deepEqual(find("#noContactDefined:contains('No Contact yet')").length, 1, "Without any contact defined, App should display message 'No Contact yet'");
		deepEqual(find("#contactListing").length, 0, "With no coptact defined, App should not display a list of contact(s)");
	})
});

test("Deletion of the non-last Contact", function() {
	var contactAlias1= "Alias1";
	var contactAlias2= "alias2";
	createContact(contactAlias1)
	.then(function() {
		return createContact(contactAlias2);
	}).then(function() {
		return deleteContact(contactAlias1);
	}).then(function() {
		deepEqual(find("#contactListing tbody tr:contains("+contactAlias1+")").length, 0, "The name of a deleted Contact should no longer be displayed in the list of Contact(s)");
		deepEqual(find("#contactListing tbody tr:contains("+contactAlias2+")").length, 1, "The name of a non-deleted Contact should remain displayed in the list of Contact(s)");
	})
});
