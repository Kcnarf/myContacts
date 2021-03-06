//TEST HELPERS -begining
// in addition to those of group_tests and achievement_tests

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

Ember.Test.registerHelper('goToReadContact', function(app, contactAlias) {
	goToContacts()
	.then(function() {
		click("#contactListing tbody tr:contains("+contactAlias+") #readContact");
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
		fillIn("#contact-edit-modal input", newContactAlias);
	}).then(function() {
		click("#contact-edit-modal button:contains('Save & Close')");
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

Ember.Test.registerHelper('toggleFavorite', function(app, contactAlias) {
	goToContacts()
	.then(function() {
		click("#contactListing tbody tr:contains("+contactAlias+") #toggleFavorite");
	});
	return wait();
});

App.injectTestHelpers();
//TEST HELPERS -end

module("Integration/Contact", {
  setup: function() {
    Ember.run(App, App.advanceReadiness);
		App.reset();
  }
});

test("Special message when no Contact", function () {
	goToContacts()
	.then(function() {
		deepEqual(find("#noContactDefined:contains('No contact yet')").length, 1, "Without any contact defined, App should display message 'No contact yet'");
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
		return fillIn("#createContact #new_contact_alias input", contactAlias);
	}).then(function() {
		return click("#createContact .btn:contains('Cancel')");
	}).then(function() {
		deepEqual(find("#createGroup").length, 0, "After cancelation, UI allowing to create a Contact should no longer be displayed");
		deepEqual(find("#noContactDefined:contains('No contact yet')").length, 1, "Without any contact defined, App should display message 'No contact yet'");
		deepEqual(find("#contactListing").length, 0, "With no contact defined, App should not display a list of Contact(s)");
	})
});

test("Creation of first Contact", function () {
	var contactAlias= "Alias1";
	var expectedContactCount= 1;
	createContact(contactAlias)
	.then(function() {
		deepEqual(find("#noContactDefined:contains('No contact yet')").length, 0, "With at least 1 contact defined, App should not display message 'No contact yet'");
		ok(find("#contactListing thead tr").length>0, "With at least 1 contact defined, App should display the number of Contact(s)");
		ok(find("#contactListing tbody tr").length>0, "With at least 1 contact defined, App should display a list of Contact(s)");
		ok(find("#contactListing thead tr:contains('"+expectedContactCount+"')"), "App should display the right count of Contacts");
		deepEqual(find("#contactListing tbody tr").length, expectedContactCount, "App should display each Contact(s)");
		ok(find("#contactListing tbody tr:contains("+contactAlias+")").length>0, "The name of a newly created contact should be displayed in the list of Contact(s)");
	})
});

test("Creation of many Contacts", function () {
	var contactAlias= "Alias1";
	var expectedContactCount= 1;
	createContact(contactAlias)
	.then(function() {
		contactAlias= "Alias2";
		expectedContactCount= 2;
		return createContact(contactAlias);
	}).then(function() {
		deepEqual(find("#noContactDefined:contains('No contact yet')").length, 0, "With at least 1 contact defined, App should not display message 'No contact yet'");
		ok(find("#contactListing thead tr").length>0, "With at least 1 contact defined, App should display the number of Contact(s)");
		ok(find("#contactListing tbody tr").length>0, "With at least 1 contact defined, App should display a list of Contact(s)");
		ok(find("#contactListing thead tr:contains('"+expectedContactCount+"')").length>0, "App should display the right count of Contacts");
		deepEqual(find("#contactListing tbody tr").length, expectedContactCount, "App should display each Contact(s)");
		ok(find("#contactListing tbody tr:contains("+contactAlias+")").length>0, "The name of a newly created contact should be displayed in the list of Contact(s)");
	})
});

test("View of a Contact is available", function () {
	var contactAlias= "Alias1";
	createContact(contactAlias)
	.then(function() {
		return goToReadContact(contactAlias);
	}).then(function() {
		deepEqual(find("#contact-read-modal").css('display'), "block", "After clicking 'View Contact', UI allowing to view a Contact should be displayed");
	}).then(function() {
		return click("#contact-read-modal .close");
	}).then(function() {
		deepEqual(find("#contact-read-modal").length, 0, "After display cancelation, UI allowing to view a Contact should no longer exists");
	})
});

test("Update of a Contact is available", function () {
	var contactAlias= "Alias1";
	createContact(contactAlias)
	.then(function() {
		return goToEditContact(contactAlias);
	}).then(function() {
		deepEqual(find("#contact-edit-modal").css('display'), "block", "After clicking 'Edit Contact', UI allowing to edit a Contact should be displayed");
	}).then(function() {
		return click("#contact-edit-modal .close");
	})
});

test("Update of a Contact can be cancelled", function () {
	var contactAlias1= "Alias1";
	var contactAlias2= "Alias2";
	createContact(contactAlias1)
	.then(function() {
		return goToEditContact(contactAlias1);
	}).then(function() {
		return fillIn("#contact-edit-modal input", contactAlias2);
	}).then(function() {
		return click("#contact-edit-modal .close");
	}).then(function() {
		deepEqual(find("#contact-edit-modal").length, 0, "After edit cancelation, UI allowing to edit a Contact should no longer exists");
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
		deepEqual(find("#noContactDefined:contains('No contact yet')").length, 1, "Without any contact defined, App should display message 'No contact yet'");
		deepEqual(find("#contactListing").length, 0, "With no coptact defined, App should not display a list of contact(s)");
	})
});

test("Deletion of the non-last Contact", function() {
	var contactAlias1= "Alias1";
	var contactAlias2= "Alias2";
	var expectedContactCount= 1;
	createContact(contactAlias1)
	.then(function() {
		return createContact(contactAlias2);
	}).then(function() {
		return deleteContact(contactAlias1);
	}).then(function() {
		deepEqual(find("#noContactDefined:contains('No contact yet')").length, 0, "With at least 1 contact defined, App should not display message 'No contact yet'");
		ok(find("#contactListing thead tr").length>0, "With at least 1 contact defined, App should display the number of Contact(s)");
		ok(find("#contactListing tbody tr").length>0, "With at least 1 contact defined, App should display a list of Contact(s)");
		ok(find("#contactListing thead tr:contains('"+expectedContactCount+"')").length>0, "App should display the right count of Contacts");
		deepEqual(find("#contactListing tbody tr").length, 1, "App should display each Contact(s)");
		deepEqual(find("#contactListing tbody tr:contains("+contactAlias1+")").length, 0, "The name of a deleted Contact should no longer be displayed in the list of Contact(s)");
		deepEqual(find("#contactListing tbody tr:contains("+contactAlias2+")").length, expectedContactCount, "The name of a non-deleted Contact should remain displayed in the list of Contact(s)");
	})
});

test("Special message when no favorite Contact", function () {
	goToContacts()
	.then(function() {
		deepEqual(find("#noFavoriteContactDefined:contains('No favorite contact yet')").length, 1, "Without any favorite contact defined, App should display message 'No favorite contact yet'");
		deepEqual(find("#favoriteContactListing").length, 0, "With no favorite contact defined, App should not display a list of favorite Contact(s)");
  })
});

test("Setting the first Contact as favorite", function () {
	var contactAlias= "Alias1";
	var expectedFavoriteContactCount= 1;
	createContact(contactAlias)
	.then(function() {
		return toggleFavorite(contactAlias);
	}).then(function() {
		deepEqual(find("#noFavoriteContactDefined:contains('No favorite contact yet')").length, 0, "With at least 1 favorite contact defined, App should not display message 'No favorite contact yet'");
		ok(find("#favoriteContactListing thead tr").length>0, "With at least 1 favorite contact defined, App should display the number of favorite Contact(s)");
		ok(find("#favoriteContactListing tbody tr").length>0, "With at least 1 favorite contact defined, App should display a list of favorite Contact(s)");
		ok(find("#favoriteContactListing tbody tr:contains("+contactAlias+")").length>0, "The name of a new favorite contact should be displayed in the list of favorite Contact(s)");
		ok(find("#favoriteContactListing thead tr:contains('"+expectedFavoriteContactCount+"')").length>0, "App should display the right count of favorite Contacts");
		deepEqual(find("#favoriteContactListing tbody tr").length, expectedFavoriteContactCount, "App should display each favorite Contact(s)");
	})
});

test("Setting many Contacts as favorite", function () {
	var contactAlias= "Alias1";
	var expectedFavoriteContactCount= 1;
	createContact(contactAlias)
	.then(function() {
		return toggleFavorite(contactAlias);
	}).then(function() {
		contactAlias= "Alias2";
		expectedFavoriteContactCount= 2;
		return createContact(contactAlias)
	}).then(function() {
		return toggleFavorite(contactAlias);
	}).then(function() {
		deepEqual(find("#noFavoriteContactDefined:contains('No favorite contact yet')").length, 0, "With at least 1 favorite contact defined, App should not display message 'No favorite contact yet'");
		ok(find("#favoriteContactListing thead tr").length>0, "With at least 1 favorite contact defined, App should display the number of favorite Contact(s)");
		ok(find("#favoriteContactListing tbody tr").length>0, "With at least 1 favorite contact defined, App should display a list of favorite Contact(s)");
		ok(find("#favoriteContactListing tbody tr:contains("+contactAlias+")").length>0, "The name of a new favorite contact should be displayed in the list of favorite Contact(s)");
		ok(find("#favoriteContactListing thead tr:contains('"+expectedFavoriteContactCount+"')").length>0, "App should display the right count of favorite Contacts");
		deepEqual(find("#favoriteContactListing tbody tr").length, expectedFavoriteContactCount, "App should display each favorite Contact(s)");
	})
});

test("Unsetting the last favorite Contact", function () {
	var contactAlias= "Alias1";
	createContact(contactAlias)
	.then(function() {
		return toggleFavorite(contactAlias);
	}).then(function() {
		return toggleFavorite(contactAlias);
	}).then(function() {
		deepEqual(find("#noFavoriteContactDefined:contains('No favorite contact yet')").length, 1, "Without any favorite contact defined, App should display message 'No favorite contact yet'");
		deepEqual(find("#favoriteContactListing").length, 0, "With no favorite contact defined, App should not display a list of favorite Contact(s)");
	})
});

test("Unsetting the non-last favorite Contact", function () {
	var contactAlias= "Alias1";
	var expectedFavoriteContactCount= 1;
	createContact(contactAlias)
	.then(function() {
		return toggleFavorite(contactAlias);
	}).then(function() {
		contactAlias= "Alias2";
		return createContact(contactAlias)
	}).then(function() {
		return toggleFavorite(contactAlias);
	}).then(function() {
		return toggleFavorite(contactAlias);
	}).then(function() {
		deepEqual(find("#noFavoriteContactDefined:contains('No favorite contact yet')").length, 0, "With at least 1 favorite contact defined, App should not display message 'No favorite contact yet'");
		ok(find("#favoriteContactListing thead tr").length>0, "With at least 1 favorite contact defined, App should display the number of favorite Contact(s)");
		ok(find("#favoriteContactListing tbody tr").length>0, "With at least 1 favorite contact defined, App should display a list of favorite Contact(s)");
		deepEqual(find("#favoriteContactListing tbody tr:contains("+contactAlias+")").length, 0, "The name of a no longer favorite contact should no longer be displayed in the list of favorite Contact(s)");
		ok(find("#favoriteContactListing thead tr:contains('"+expectedFavoriteContactCount+"')").length>0, "App should display the right count of favorite Contacts");
		deepEqual(find("#favoriteContactListing tbody tr").length, expectedFavoriteContactCount, "App should display each favorite Contact(s)");
	})
});

test("Deleting of a favorite contact", function () {
	var contactAlias= "Alias1";
	createContact(contactAlias)
	.then(function() {
		return toggleFavorite(contactAlias);
	}).then(function() {
		return deleteContact(contactAlias);
	}).then(function() {
		deepEqual(find("#noFavoriteContactDefined:contains('No favorite contact yet')").length, 1, "Without any favorite contact defined, App should display message 'No favorite contact yet'");
		deepEqual(find("#favoriteContactListing").length, 0, "With no favorite contact defined, App should not display a list of favorite Contact(s)");
	})
});