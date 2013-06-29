App = Ember.Application.create({
	LOG_TRANSITIONS: true
});

App.Store= DS.Store.extend({
	//adapter: 'DS.FixtureAdapter'
	adapter: 'DS.LSAdapter'
	// /!\DS.LSAdapter checked with ember-data revision 11
});

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
		App.RecentContacts.find(); // populate the store with the RecentContacts instance
	},
	redirect: function(){
		this.transitionTo('index')
	}
});

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
	needs: ['contacts', 'recentContacts'],
	
	contactCountBinding: 'controllers.contacts.contactCount',
	
	searchText: '',
	
	showContact: function (contact) {
		this.transitionToRoute('contact.read', contact)
	},
	
	switchFavorite: function (contact) {
		contact.set('is_favorite', !contact.get('is_favorite'));
		contact.get('transaction').commit();
	},
	
	edit: function (contact) {
		this.transitionToRoute('contact.edit', contact);
	},
	
	delete: function (contact) {
		contact.deleteRecord()
		this.get('store').commit();
		this.get('controllers.recentContacts').deleteContact(contact);
		this.transitionToRoute('contacts.search');
	},
	
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
		// l'id est généré automatiquement par le FixtureAdapter.
		// cree et ajoute le contact dans la liste (pas besoin du addObject dans le controller)
		return App.Contact.createRecord();
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

App.ContactIndexRoute = Ember.Route.extend({
	redirect: function() {
		this.transitionTo('contact.read')
	}
})

App.ContactReadRoute = Ember.Route.extend({
	model: function() {
		return this.modelFor('contact');
	},
	
	activate: function() {
		this.controllerFor('recentContacts').addContact(this.modelFor('contact'));
	}
});

App.ContactReadController = Ember.ObjectController.extend({
	groupCount: function() {
		return this.get('content').get('groups').get('length');
	}.property('content.groups.length'),
	
	delete: function(contact) {
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
		this.controllerFor('recentContacts').addContact(this.modelFor('contact'));
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

App.GroupController = Ember.ObjectController.extend({
  editGroup_modalTrigererId: function() {
		return '#editGroup_' + this.get('name');
	}.property('name'),
	
	editGroup_modalId: function() {
		return 'editGroup_'+ this.get('name');
	}.property('name')
})


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
	
	create: function() {
		var newGroup = App.Group.createRecord();
		newGroup.set('name', this.get('new_group_name'));
		newGroup.get('transaction').commit();
		this.set('new_group_name', '')
	},
	
	edit: function(group) {
		group.set('isEditing', true)
	},
	
	update: function(group) {
		group.get('transaction').commit();
		group.set('isEditing', false)
	},
	
	rollback: function(group) {
		group.get('transaction').rollback();
	},
	
	delete: function (group) {
		//TODO: suppress the link from Contact
		group.deleteRecord()
		this.get('store').commit();
	}
});

App.RecentContactsController = Ember.ArrayController.extend({
	
	addContact: function(contact) {
		var alreadyRecentContact = this.findProperty('alias', contact.get('alias'));
		if ( alreadyRecentContact ) {
			this.removeObject(alreadyRecentContact);
		}
		this.addObject(contact);
		//this.get('model').get('transaction').commit()
	},
	
	deleteContact: function(contact) {
		var alreadyRecentContact = this.findProperty('alias', contact.get('alias'));
		if ( alreadyRecentContact ) {
			this.removeObject(alreadyRecentContact);
		}
	}
});

App.RecentContactsController.reopen({
	reverse: function(){
		return this.toArray().reverse();
	}.property('this.content.@each'),
	
	recentContactCount: function () {
		return this.get('length');
	}.property('length'),
	
	severalRecentContacts: function () {
		return this.get('recentContactCount') > 1;
	}.property('recentContactCount')
})

App.Contact = DS.Model.extend({
	alias: DS.attr('string'),
	is_favorite: DS.attr('boolean'),
	first_name: DS.attr('string'),
	last_name: DS.attr('string'),
	home_phone: DS.attr('string'),
	mobile_phone: DS.attr('string'),
	office_phone: DS.attr('string'),
	personal_mail: DS.attr('string'),
	office_mail: DS.attr('string'),
	groups: DS.hasMany('App.Group'),
	
	groupCount: function() {
		return this.get('groups').get('length');
	}.property('groups.length')
});

App.Group = DS.Model.extend({
	name: DS.attr('string'),
	contacts: DS.hasMany('App.Contact')
});

App.RecentContacts = DS.Model.extend({
	list: DS.hasMany('App.Contact')
})

App.Contact.FIXTURES = [{
	id: 1,
	alias: 'FooTer',
	is_favorite: true,
	first_name: 'Foo',
	last_name: 'Ter',
	home_phone: '',
	mobile_phone: '060001',
	office_phone: '030002',
	personal_mail: 'foo.master@gmail.com',
	office_mail: 'foo.master@thelittlecompany.com',
	groups: [1]
},{
	id: 2,
	alias: 'BarMan',
	is_favorite: true,
	first_name: 'Bar',
	last_name: 'Man',
	home_phone: '',
	mobile_phone: '0600003',
	office_phone: '',
	personal_mail: 'bar.man@gmail.com',
	office_mail: 'bar.man@thebigcompany.com',
	groups: [1]
},{
	id: 3,
	alias: 'PolOpper',
	is_favorite: false,
	first_name: 'Pol',
	last_name: 'Opper',
	home_phone: '',
	mobile_phone: '0600004',
	office_phone: '',
	personal_mail: '',
	office_mail: '',
	groups: [2]
},{
	id: 4,
	alias: 'CasPer',
	is_favorite: false,
	first_name: 'Cas',
	last_name: 'Per',
	home_phone: '',
	mobile_phone: '',
	office_phone: '',
	personal_mail: '',
	office_mail: '',
	groups: []
},{
	id: 5,
	alias: 'DinGo',
	is_favorite: false,
	first_name: 'Din',
	last_name: 'Go',
	home_phone: '',
	mobile_phone: '',
	office_phone: '',
	personal_mail: '',
	office_mail: '',
	groups: [1,2]
}];

App.Group.FIXTURES = [{
	id: 1,
	name: 'FooBar',
	contacts: [1,2,5]
},{
	id: 3,
	name: 'Others',
	contacts: []
},{
	id: 2,
	name: 'Friends',
	contacts: [3,5]
}];

App.RecentContacts.FIXTURES = [{
	id: 1,
	list: [1,2]
}]