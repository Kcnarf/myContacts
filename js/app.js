App = Ember.Application.create({
	LOG_TRANSITIONS: true
});

App.Store= DS.Store.extend({
	//adapter: 'DS.FixtureAdapter'
	
	adapter: 'DS.LSAdapter'
	// /!\DS.LSAdapter checked with ember-data revision 11
	
	//adapter: 'DS.RESTAdapter'
});

// DS.RESTAdapter.reopen({
  // url: 'http://localhost/myContactsServer'
// });


App.Router.map(function() {
	this.resource('contacts', function(){
		this.route('search');
		this.route('create');
		this.resource('contact', {path: ':contact_id'});
	});
	this.resource('groups');
	this.resource('achievements');
	this.route('about');
});

App.ApplicationRoute = Ember.Route.extend({
	setupController: function(){
		App.Contact.find(); // populate the store with all Contact instances
		App.Group.find(); // populate the store with all Group instances
		App.Contact_group_link.find() // populate the store with all links/relationships between Contact and Group
	},
	redirect: function(){
		this.transitionTo('index')
	}
});

/*******************************
* Contacts
*******************************/

App.ContactsRoute = Ember.Route.extend({
	model: function(){
		return App.Contact.all();
	}
});

App.ContactsIndexRoute = Ember.Route.extend({
	redirect: function() {
		this.transitionTo('contacts.search');
	}
});

App.ContactsSearchRoute = Ember.Route.extend({
	model: function() {
		return this.modelFor('contacts');
	}
});

App.ContactsCreateRoute = Ember.Route.extend({
	model: function() {
		return App.Contact.createRecord();
	},
	
	activate: function() {
		this.controllerFor('contactsCreate').set('selectedGroups', null);
	}
});


/*******************************
* Contact
*******************************/

// N/A

/*******************************
* Groups
*******************************/

App.GroupsRoute = Ember.Route.extend({
	model: function(){
		return App.Group.all();
	}
});

/*******************************
* Group
*******************************/

// N/A
