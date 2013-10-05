//TEST HELPERS -begining
// in addition to those of group_tests and contact_tests

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
App.injectTestHelpers();
//TEST HELPERS -end

module("Integration/Achievement", {
  setup: function() {
    Ember.run(App, App.advanceReadiness);
		App.reset();
  }
});

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
	goToAchievements()
	.then(function() {
		return visit('about');
	}).then(function() {
		return goToAchievements();
	}).then(function() {
		deepEqual(find("#achievementListing tbody span.muted:contains('About-er')").length, 0, "Visiting the 'About' page should auto-detect achievement 'About-er'");
  })
});

test("Achievement 'I'm not alone!' is auto-detected", function () {
	goToAchievements()
	.then(function() {
		return goToCreateContact();
	}).then(function() {
		return click("#createContact .btn:contains('Cancel')");
	}).then(function() {
		return goToAchievements();
	}).then(function() {
		deepEqual(find("#achievementListing tbody span.muted:contains('I\'m not alone!')").length, 0, "Creating a Contact should auto-detect achievement 'I'm not alone!'");
  })
});

test("Achievement 'Memoryless' is auto-detected", function () {
	contactAlias="Alias1";
	goToAchievements()
	.then(function() {
		return createContact(contactAlias);
	}).then(function() {
		return goToReadContact(contactAlias);
  }).then(function() {
		return click("#contact-read-modal .close");
	}).then(function() {
		return goToAchievements();
	}).then(function() {
		deepEqual(find("#achievementListing tbody span.muted:contains('Memoryless')").length, 0, "Viewing a Contact should auto-detect achievement 'Memoryless'");
  })
});

test("Achievement 'Something's alive out there' is auto-detected", function () {
	contactAlias="Alias1";
	goToAchievements()
	.then(function() {
		return createContact(contactAlias);
	}).then(function() {
		return goToEditContact(contactAlias);
  }).then(function() {
		return click("#contact-edit-modal .close");
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
	goToAchievements()
	.then(function() {
		return goToCreateGroup();
	}).then(function() {
		return click("#group-create-modal .close");
	}).then(function() {
		return goToAchievements();
	}).then(function() {
		deepEqual(find("#achievementListing tbody span.muted:contains('Classifier')").length, 0, "Creating a Group should auto-detect achievement 'Classifier'");
  })
});

test("Achievement 'Wording counts!' is auto-detected", function () {
	groupName="Group1";
	goToAchievements()
	.then(function() {
		return createGroup(groupName);
	}).then(function() {
		return goToEditGroup(groupName);
  }).then(function() {
		return click("#group-edit-modal .close");
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