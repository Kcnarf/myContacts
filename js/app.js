App = Ember.Application.create({
	LOG_TRANSITIONS: true
});

App.Store= DS.Store.extend({
	//adapter: 'DS.FixtureAdapter'
	
	adapter: 'DS.LSAdapter'
	// /!\DS.LSAdapter checked with ember-data revision 11
	
	//adapter: 'DS.RESTAdapter'
});
/*
DS.RESTAdapter.reopen({
  url: 'http://localhost/myContactsServer'
});
*/

App.Router.map(function() {
	this.resource('contacts', function(){
		this.route('search');
		this.route('create');
		this.resource('contact', {path: ':contact_id'}, function () {
			this.route('read');
			this.route('edit');
		});
	});
	this.resource('groups',  function(){
		this.route('search');
	});
	this.resource('about');
});

App.ApplicationRoute = Ember.Route.extend({
	setupController: function(){
		App.Contact.find(); // populate the store with all Contact instances
		App.Group.find(); // populate the store with all Group instances
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

App.ContactsController = Ember.ArrayController.extend({
	contactCount: function() {
		return this.get('length');
	}.property('length')
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

App.ContactsSearchController = Ember.ArrayController.extend({
	sortProperties: ['alias'],
	sortAscending: true,
	needs: ['contacts'],
	
	contactCountBinding: 'controllers.contacts.contactCount',
	
	searchText: '',
	
	showContact: function (contact) {
		this.transitionToRoute('contact.read', contact)
	},
	
	switchFavorite: function (contact) {
		contact.set('is_favorite', !contact.get('is_favorite'));
		contact.get('transaction').commit()
	},
	
	edit: function (contact) {
		this.transitionToRoute('contact.edit', contact);
	},
	
	delete: function (contact) {
		var linkedGroups = contact.get('groups').toArray();
		var linkedGroup = null;
		for(var i=0;i<linkedGroups.length;i++) {
			linkedGroup = linkedGroups.objectAt(i);
			linkedGroup.get('contacts').removeObject(contact);
			linkedGroup.get('store').commit()
		};
		contact.deleteRecord()
		this.get('store').commit();
		this.transitionToRoute('contacts.search');
	},
	
	favoriteContacts: function () {
		return this.get('arrangedContent').filterProperty('is_favorite',true);
	}.property('arrangedContent.@each.is_favorite'),
	
	favoriteContactCount: function () {
		return this.get('favoriteContacts').get('length');
	}.property('favoriteContacts.length'),
	
	severalFavoriteContacts: function () {
		return this.get('favoriteContactCount') > 1;
	}.property('favoriteContactCount'),
	
	searchContacts: function () {
		if (Ember.isEmpty(this.get('searchText'))) {
			return this.get('arrangedContent');
		}
		else {
			var regexPattern = '';
			var searchTextArray = this.get('searchText').split("");
			for (var i=0;i<searchTextArray.length-1;i++)
			{ 
				regexPattern = regexPattern.concat('(', searchTextArray[i], ').*');
			}
			regexPattern = regexPattern.concat('(', searchTextArray[searchTextArray.length-1], ')')
			
			var regex = new RegExp(regexPattern,'i');
			var filtered = this.get('arrangedContent').filter(function(contact) {
				return regex.test(contact.get('alias'));
			});
			return filtered;
		}
	}.property('searchText'),
	
	searchedContactCount: function() {
		return this.get('searchContacts').get('length');
	}.property('searchContacts.length'),
	
	severalSearchedContacts: function() {
		return this.get('searchedContactCount') > 1;
	}.property('searchedContactCount'),
	
	resetSearch: function() {
		this.set('searchText', "");
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

App.ContactsCreateController = Ember.ObjectController.extend({
	selectedGroups: null,
	needs:['groups'],

	allGroups: function (){
		return App.Group.all();
	}.property(),

	create: function (newContact){
		var self = this;
		
		newContact.get('groups').setObjects(self.get('selectedGroups'));
		newContact.get('transaction').commit();
		this.transitionToRoute('contact.read', newContact);
	}
});


/*******************************
* Contact
*******************************/
App.ContactIndexRoute = Ember.Route.extend({
	redirect: function() {
		this.transitionTo('contact.read')
	}
})

App.ContactReadRoute = Ember.Route.extend({
	model: function() {
		return this.modelFor('contact');
	}
});

App.ContactReadController = Ember.ObjectController.extend({
	groupCount: function() {
		return this.get('content').get('groups').get('length');
	}.property('content.groups.length'),
	
	delete: function(contact) {
		var linkedGroups = contact.get('groups').toArray();
		var linkedGroup = null;
		for(var i=0;i<linkedGroups.length;i++) {
			linkedGroup = linkedGroups.objectAt(i);
			linkedGroup.get('contacts').removeObject(contact);
			linkedGroup.get('store').commit()
		};
		contact.deleteRecord()
		this.get('store').commit();
		this.transitionToRoute('contacts.search');
	}
})

App.ContactEditRoute = Ember.Route.extend({
	model: function() {
		return this.modelFor('contact');
	},
	
	activate: function() {
		this.controllerFor('contactEdit').set('selectedGroups',this.modelFor('contact').get('groups'));
	}
});

App.ContactEditController = Ember.ObjectController.extend({
	needs: ['groups'],
	selectedGroups: null,

	allGroups: function () {
		return App.Group.all();
	}.property(),

	groupCount: function() {
		return this.get('content').get('groups').get('length');
	}.property('content.groups.length'),
	
	update: function(contact) {
		var self = this;
		contact.get('groups').setObjects(self.get('selectedGroups'));
		contact.get('transaction').commit();
		this.transitionToRoute('contact.read', contact);
	}
})

App.ContactController = Ember.ObjectController.extend({
  needs: ['groups'],
	selectedGroups: null,
	
	allGroups: function () {
		return App.Group.all();
	}.property(),
	
	editContact_modalId: function() {
		return 'editContact_'+ this.get('alias');
	}.property('alias'),
	
	editContact_modalTrigererId: function() {
		return '#' + this.get('editContact_modalId');
	}.property('editContact_modalId'),
	
	update: function() {
		this.get('transaction').commit()
	},
	
	rollback: function() {
		this.get('transaction').rollback();
	},
	
	update: function(contact) {
		var self = this;
		contact.get('groups').setObjects(self.get('selectedGroups'));
		contact.get('transaction').commit();
	},
	
	delete: function () {
		var linkedGroups = contact.get('groups').toArray();
		var linkedGroup = null;
		for(var i=0;i<linkedGroups.length;i++) {
			linkedGroup = linkedGroups.objectAt(i);
			linkedGroup.get('contacts').removeObject(contact);
			linkedGroup.get('store').commit()
		};
		contact.deleteRecord()
		this.get('store').commit()
	}
})

/*******************************
* Groups
*******************************/

App.GroupsRoute = Ember.Route.extend({
	model: function(){
		return App.Group.all();
	}
});

App.GroupsController = Ember.ArrayController.extend({});

App.GroupsIndexRoute = Ember.Route.extend({
	redirect: function() {
		this.transitionTo('groups.search');
	}
});

App.GroupsSearchRoute = Ember.Route.extend({
	model: function(){
		return this.modelFor('groups');
	}
});

App.GroupsSearchController = Ember.ArrayController.extend({
	sortProperties: ['name'],
	sortAscending: true,
	
	new_group_name: '',
	
	groupCount: function() {
		return this.get('length');
	}.property('length'),
	
	severalGroups: function() {
		return this.get('groupCount') > 1;
	}.property('groupCount'),
	
	createGroup: function() {
		var newGroup = App.Group.createRecord();
		newGroup.set('name', this.get('new_group_name'));
		newGroup.get('transaction').commit();
		this.set('new_group_name', '')
	}
});

/*******************************
* Group
*******************************/

App.GroupController = Ember.ObjectController.extend({
  	
	editGroup_modalId: function() {
		return 'editGroup_'+ this.get('name');
	}.property('name'),
	
	editGroup_modalTrigererId: function() {
		return '#' + this.get('editGroup_modalId');
	}.property('editGroup_modalId'),
	
	update: function() {
		this.get('transaction').commit()
	},
	
	rollback: function() {
		this.get('transaction').rollback();
	},
	
	delete: function () {
		var linkedContacts = this.get('contacts').toArray();
		var linkedContact = null;
		for(var i=0;i<linkedContacts.length;i++) {
			linkedContact = linkedContacts.objectAt(i);
			linkedContact.get('groups').removeObject(this.get('content'));
			linkedContact.get('store').commit()
		};
		this.get('content').deleteRecord()
		this.get('store').commit()
	}
})