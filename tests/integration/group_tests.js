//TEST HELPERS -begining
// in addition to those of contact_tests and achievement_tests

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
		fillIn("#group-create-modal #name input", groupName);
	}).then(function() {
		click("#group-create-modal button:contains('Create & Close')");
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
		fillIn("#group-edit-modal input", newGroupName);
	}).then(function() {
		click("#group-edit-modal button:contains('Save & Close')");
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

App.injectTestHelpers();
//TEST HELPERS -end

module("Integration/Group");

test("Special message when no Group", function () {
	goToGroups()
	.then(function() {
		deepEqual(find("#noGroupDefined:contains('No group yet')").length, 1, "Without any group defined, App should display message 'No Group yet'");
		deepEqual(find("#groupListing").length, 0, "With no group defined, App should not display a list of Group(s)");
  })
});

test("Creation of a Group is available", function () {
	goToCreateGroup()
	.then(function() {
		deepEqual(find("#group-create-modal").css('display'), "block", "After clicking 'Create a Group', UI allowing to create a Group should be displayed");
	}).then(function() {
		return click("#group-create-modal .close");
	})
});

test("Creation of a Group can be cancelled", function () {
	var groupName= "Group1";
	goToCreateGroup()
	.then(function() {
		return fillIn("#group-create-modal #name input", groupName);
	}).then(function() {
		return click("#group-create-modal .close");
	}).then(function() {
		deepEqual(find("#group-create-modal").length, 0, "After cancelation, modal 'Create Group' should no longer exists");
		deepEqual(find("#noGroupDefined:contains('No group yet')").length, 1, "Without any group defined, App should display message 'No Group yet'");
	})
});

test("Creation of first Group", function () {
	var groupName= "Group1";
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
	var groupName= "Group1";
	var expectedGroupCount= 1;
	createGroup(groupName)
	.then(function() {
		deepEqual(find("#noGroupDefined:contains('No group yet')").length, 0, "With at least 1 group defined, App should not display message 'No Group yet'");
		ok(find("#groupListing").length>0, "With at least 1 group defined, App should display a list of Group(s)");
		ok(find("#groupListing tbody tr:contains("+groupName+")").length>0, "The name of a newly created Group should be displayed in the list of Group(s)");
		ok(find("#groupListing thead tr:contains(expectedGroupCount)"), "App should display the right count of Groups");
		deepEqual(find("#groupListing tbody tr").length, expectedGroupCount, "App should display each Group(s)");
	}).then(function() {
		groupName= "Group2";
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

test("Update of a Group is available", function () {
	var groupName= "Group1";
	createGroup(groupName)
	.then(function() {
		return goToEditGroup(groupName);
	}).then(function() {
		deepEqual(find("#group-edit-modal").css('display'), "block", "After clicking 'Edit Group', UI allowing to edit a Group should be displayed");
	}).then(function() {
		return click("#group-edit-modal .close");
	})
});

test("Update of a Group can be cancelled", function () {
	var groupName1= "Group1";
	var groupName2= "Group2";
	createGroup(groupName1)
	.then(function() {
		return goToEditGroup(groupName1);
	}).then(function() {
		return fillIn("#group-edit-modal input", groupName2);
	}).then(function() {
		return click("#group-edit-modal .close");
	}).then(function() {
		deepEqual(find("#group-edit-modal").length, 0, "After edit cancelation, UI allowing to edit a Group should no longer exists");
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