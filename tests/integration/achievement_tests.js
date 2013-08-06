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
App.Achievement.FIXTURES = [
	{id:1, title:'About-er', how_to:'Visit the \'About\' page.', is_achieved:false},
	{id:2, title:'Eager learner', how_to:'Visit the \'Achievements\' page.', is_achieved:false},
	{id:3, title:'Non auto-detected achievement', how_to:'...', is_achieved:false}
];
	
// Run before each test case.
QUnit.testStart(function () {
	App.Contact.FIXTURES = [];
	App.Group.FIXTURES = [];
	App.Contact_group_link.FIXTURES = [];
	App.Achievement.FIXTURES = [
		{id:1, title:'About-er', how_to:'Visit the \'About\' page.', is_achieved:false},
		{id:2, title:'Eager learner', how_to:'Visit the \'Achievements\' page.', is_achieved:false},
		{id:3, title:'Non auto-detected achievement', how_to:'...', is_achieved:false}
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
/*
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

test("Special message when no longer unachieved achievements", function () {
	goToAchievements()
	.then(function() {
		return setAsAchieved('About-er');
  }).then(function() {
		return setAsAchieved('Non auto-detected achievement');
  }).then(function() {
		deepEqual(find("#achievementListing thead tr td:contains('Master of the App')").length, 1, "When no longer unchavied achievement, App should display achievement 'Master of the App'");
  })
});