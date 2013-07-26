App = Ember.Application.create({
	LOG_TRANSITIONS: true
});

App.Store= DS.Store.extend({
	//adapter: 'DS.FixtureAdapter'
	
	//adapter: 'DS.LSAdapter'
	// /!\DS.LSAdapter checked with ember-data revision 11
	
	adapter: 'DS.RESTAdapter'
});

DS.RESTAdapter.reopen({
  url: 'http://localhost/myContactsServer'
});


App.Router.map(function() {
	this.resource('contacts', function(){
		this.route('search');
		this.route('create');
		this.resource('contact', {path: ':contact_id'});
	});
	this.resource('groups');
	this.resource('about');
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
	needs:['groups'],
	selectedGroups: null,
	ctrlNewContact: null,

	allGroups: function (){
		return App.Group.all();
	}.property(),

	create: function (newContact){
		this.set('ctrlNewContact', newContact);
		
		newContact.get('transaction').commit();
		if (!Ember.isEmpty(this.get('selectedGroups'))) {
			ctrl= this;
			newContact.addObserver('id', this, function(){
				for(var i=0;i<this.get('selectedGroups').get('length');i++) {
					new_contact_group_link = App.Contact_group_link.createRecord();
					new_contact_group_link.set('contact', this.get('ctrlNewContact'));
					linkedGroup= this.get('selectedGroups').objectAt(i);
					new_contact_group_link.set('group', linkedGroup);
					this.get('ctrlNewContact').get('contact_group_links').pushObject(new_contact_group_link);
					linkedGroup.get('contact_group_links').pushObject(new_contact_group_link);
					
					new_contact_group_link.get('transaction').commit()
				};
				//newContact.get('groups').setObjects(self.get('selectedGroups'));
				this.get('ctrlNewContact').get('transaction').commit();
				this.transitionToRoute('contacts.search')
			})
		}
		else {
			this.transitionToRoute('contacts.search');
		}
	}
});


/*******************************
* Contact
*******************************/
App.ContactController= Ember.ObjectController.extend({
	needs: ['groups'],
	selectedGroups: null,
	
	allGroups: function () {
		return App.Group.all();
	}.property(),
	
	readContact_modalId: function() {
		return 'readContact_'+ this.get('alias');
	}.property('alias'),
	
	readContact_modalTrigererId: function() {
		return '#' + this.get('readContact_modalId');
	}.property('readContact_modalId'),
	
	editContact_modalId: function() {
		return 'editContact_'+ this.get('alias');
	}.property('alias'),
	
	editContact_modalTrigererId: function() {
		return '#' + this.get('editContact_modalId');
	}.property('editContact_modalId'),
	
	rollback: function() {
		this.get('transaction').rollback();
	},
	
	update: function() {
		var old_contact_group_links= this.get('content.contact_group_links.content');
		while(!Ember.isEmpty(old_contact_group_links)) {
			old_contact_group_link = old_contact_group_links.get('firstObject')
			this.get('content').get('contact_group_links').removeObject(old_contact_group_link.record);
			linkedGroup= old_contact_group_link.record.get('group');
			linkedGroup.get('contact_group_links').removeObject(old_contact_group_link.record);
			old_contact_group_link.record.deleteRecord();
			old_contact_group_link.record.get('store').commit()
		};
		
		for(var i=0;i<this.get('selectedGroups').get('length');i++) {
			new_contact_group_link = App.Contact_group_link.createRecord();
			new_contact_group_link.set('contact', this.get('content'));
			linkedGroup= this.get('selectedGroups').objectAt(i);
			new_contact_group_link.set('group', linkedGroup);
			this.get('content').get('contact_group_links').pushObject(new_contact_group_link);
			linkedGroup.get('contact_group_links').pushObject(new_contact_group_link)
			
			new_contact_group_link.get('transaction').commit();
		};
		this.get('transaction').commit();
	},
	
	delete: function () {
		var old_contact_group_links= this.get('content.contact_group_links.content');
		while(!Ember.isEmpty(old_contact_group_links)) {
			old_contact_group_link = old_contact_group_links.get('firstObject')
			this.get('content').get('contact_group_links').removeObject(old_contact_group_link.record);
			linkedGroup= old_contact_group_link.record.get('group');
			linkedGroup.get('contact_group_links').removeObject(old_contact_group_link.record);
			old_contact_group_link.record.deleteRecord();
			old_contact_group_link.record.get('store').commit()
		};
		
		this.get('content').deleteRecord()
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

App.GroupsController = Ember.ArrayController.extend({
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
		var old_contact_group_links= this.get('content.contact_group_links.content');
		while(!Ember.isEmpty(old_contact_group_links)) {
			old_contact_group_link = old_contact_group_links.get('firstObject')
			this.get('content').get('contact_group_links').removeObject(old_contact_group_link.record);
			linkedContact= old_contact_group_link.record.get('contact');
			linkedContact.get('contact_group_links').removeObject(old_contact_group_link.record);
			old_contact_group_link.record.deleteRecord();
			old_contact_group_link.record.get('store').commit()
		};
		this.get('content').deleteRecord()
		this.get('store').commit()
	}
})