// Setup of Ember's Testing framework
document.write('<div id="ember-testing-container"><div id="ember-testing"></div></div>');
App.rootElement = '#ember-testing';
App.LOG_TRANSITIONS= false;
App.setupForTesting();
App.injectTestHelpers();

App.ApplicationAdapter = DS.FixtureAdapter;

QUnit.testStart(function () {
	App.Contact.FIXTURES = [];
	App.Group.FIXTURES = [];
	App.ContactGroupLink.FIXTURES = [];
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
	]
})