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
App.Achievement.FIXTURES = [];
	
// Run before each test case.
QUnit.testStart(function () {
	App.Contact.FIXTURES = [];
	App.Group.FIXTURES = [];
	App.Contact_group_link.FIXTURES = [];
	App.Achievement.FIXTURES = [
		{id:1, title:'About-er', how_to:'Visit the \'About\' page.', is_achieved:false},
		{id:2, title:'Eager learner', how_to:'Visit the \'Achievements\' page.', is_achieved:false},
		{id:3, title:'I\'m not alone!', how_to:'Create a Contact.', is_achieved:false},
		{id:4, title:'Memoryless', how_to:'View a Contact', is_achieved:false},
		{id:5, title:'Something\'s alive out there', how_to:'Edit and update a Contact', is_achieved:false},
		{id:6, title:'Killer', how_to:'How to achieve it: Delete a Contact', is_achieved:false},
		{id:7, title:'Lover', how_to:'Set a Contact as \'favorite\'', is_achieved:false},
		{id:8, title:'Classifier', how_to:'Create a Group', is_achieved:false},
		{id:9, title:'Wording counts!', how_to:'Update a Group', is_achieved:false},
		{id:10, title:'Mass killer', how_to:'Delete a Group', is_achieved:false},
		{id:11, title:'Sorter', how_to:'Assign a Contact to at least one Group', is_achieved:false},
		{id:12, title:'Researcher ', how_to:'Use the innovative Search feature', is_achieved:false},
	];
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

Ember.Test.registerHelper('goToAchievements', function(app) {
	visit("/")
	.then(function() {
		click("a:contains('Achievements')");
	});
	return wait();
});

Ember.Test.registerHelper('setAsAchieved', function(app, achievementTitle) {
	goToAchievements()
	.then(function() {
		click("#achievementListing tbody tr:contains("+achievementTitle+") #toggleAchieved");
	});
	return wait();
});

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
		fillIn("creategroupmodal #name input", groupName);
	}).then(function() {
		click("creategroupmodal button:contains('Create & Close')");
	});
	return wait();
});

Ember.Test.registerHelper('goToEditGroup', function(app, groupName) {
	goToGroups()
	.then(function() {
		click("#groupListing tbody tr:contains("+groupName+") #editGroup");
	});
	return wait();
});

App.injectTestHelpers();
//TEST HELPERS -end

module("Integration/Achievement");

test("List of achievement is always displayed", function () {
	goToAchievements()
	.then(function() {
		deepEqual(find("#achievementListing").length, 1, "App should always display the list of Achievements");
  })
});

test("Achievement 'Eager learner' is auto-detected", function () {
	goToAchievements()
	.then(function() {
		deepEqual(find("#achievementListing tbody span.muted:contains('Eager learner')").length, 0, "Visiting the 'Achievements' page should auto-detect achievement 'Eager learner'");
  })
});

test("Achievement 'About-er' is auto-detected", function () {
	visit('about')
	.then(function() {
		return goToAchievements();
	}).then(function() {
		deepEqual(find("#achievementListing tbody span.muted:contains('About-er')").length, 0, "Visiting the 'About' page should auto-detect achievement 'About-er'");
  })
});

test("Achievement 'I'm not alone!' is auto-detected", function () {
	goToCreateContact()
	.then(function() {
		return click("#createContact .btn:contains('Cancel')");
	}).then(function() {
		return goToAchievements();
	}).then(function() {
		deepEqual(find("#achievementListing tbody span.muted:contains('I\'m not alone!')").length, 0, "Creating a Contact should auto-detect achievement 'I'm not alone!'");
  })
});

test("Achievement 'Memoryless' is auto-detected", function () {
	contactAlias="Alias1";
	createContact(contactAlias)
	.then(function() {
		return goToReadContact(contactAlias);
  }).then(function() {
		return click("readContactModal .close");
	}).then(function() {
		return goToAchievements();
	}).then(function() {
		deepEqual(find("#achievementListing tbody span.muted:contains('Memoryless')").length, 0, "Viewing a Contact should auto-detect achievement 'Memoryless'");
  })
});

test("Achievement 'Something's alive out there' is auto-detected", function () {
	contactAlias="Alias1";
	createContact(contactAlias)
	.then(function() {
		return goToEditContact(contactAlias);
  }).then(function() {
		return click("editContactModal .close");
	}).then(function() {
		return goToAchievements();
	}).then(function() {
		deepEqual(find("#achievementListing tbody span.muted:contains('Something\'s alive out there')").length, 0, "Editing a Contact should auto-detect achievement 'Something's alive out there'");
  })
});

// test("Achievement 'Killer' is auto-detected", function () {
// });

// test("Achievement 'Lover' is auto-detected", function () {
// });

test("Achievement 'Classifier' is auto-detected", function () {
	groupName="Group1";
	goToCreateGroup()
	.then(function() {
		return click("createGroupModal .close");
	}).then(function() {
		return goToAchievements();
	}).then(function() {
		deepEqual(find("#achievementListing tbody span.muted:contains('Classifier')").length, 0, "Creating a Group should auto-detect achievement 'Classifier'");
  })
});

test("Achievement 'Wording counts!' is auto-detected", function () {
	groupName="Group1";
	createGroup(groupName)
	.then(function() {
		return goToEditGroup(groupName);
  }).then(function() {
		return click("editGroupModal .close");
	}).then(function() {
		return goToAchievements();
	}).then(function() {
		deepEqual(find("#achievementListing tbody span.muted:contains('Wording counts!')").length, 0, "Editing a Group should auto-detect achievement 'Wording count!'");
  })
});

// test("Achievement 'Mass killer' is auto-detected", function () {
// });

// test("Achievement 'Sorter' is auto-detected", function () {
// });

// test("Achievement 'Reasercher' is auto-detected", function () {
// });

test("Special message when no longer unachieved achievements", function () {
	goToAchievements()
	.then(function() {
		return setAsAchieved('About-er');
  }).then(function() {
		return setAsAchieved('I\'m not alone!');
  }).then(function() {
		return setAsAchieved('Memoryless');
  }).then(function() {
		return setAsAchieved('Something\'s alive out there');
  }).then(function() {
		return setAsAchieved('Killer');
  }).then(function() {
		return setAsAchieved('Lover');
  }).then(function() {
		return setAsAchieved('Classifier');
  }).then(function() {
		return setAsAchieved('Wording counts!');
  }).then(function() {
		return setAsAchieved('Mass killer');
  }).then(function() {
		return setAsAchieved('Sorter');
  }).then(function() {
		return setAsAchieved('Researcher');
  }).then(function() {
		deepEqual(find("#achievementListing thead tr td:contains('Master of the App')").length, 1, "When no longer unchavied achievement, App should display achievement 'Master of the App'");
  })
});