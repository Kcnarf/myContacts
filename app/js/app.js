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
  host: 'http://localhost/myContactsServer'
});


App.Router.map(function() {
	this.resource('contacts', function(){
		this.route('search');
		this.route('create');
		this.resource('contact', {path: '/:contact_id'}, function(){
			this.route('read');
			this.route('edit');
		});
	});
	this.resource('groups', function(){
		this.route('create');
		this.resource('group', {path: '/:group_id'}, function(){
			this.route('edit');
		});
	});
	this.resource('achievements');
	this.route('about');
});

App.ApplicationRoute = Ember.Route.extend({
	init: function() {
	//setupController: function() {
		var store = this.get('store');
		store.findAll('contact'); // populate the store with all Contact instances
		store.findAll('group'); // populate the store with all Group instances
		store.findAll('contact_group_link'); // populate the store with all links/relationships between Contact and Group
		store.findAll('achievement'); // populate the store with all Achievement instances
		
		//this.controllerFor('achievements').set('model', App.Achievement.all());
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
		return this.get('store').findAll('contact');
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
		return this.get('store').createRecord('contact');
	},
	
	activate: function() {
		this.controllerFor('contactsCreate').set('selectedGroups', null);
	}
});


/*******************************
* Contact
*******************************/
App.ContactReadRoute = Ember.Route.extend({
	model: function () {
		return this.modelFor('contact');
	},
	renderTemplate: function() {
    this.render({
			outlet: 'readContactOutlet'
			});
  },
	actions: {
		close: function() {
			this.transitionTo('contacts')
		}
	}
});

App.ContactEditRoute = Ember.Route.extend({
	model: function () {
		return this.modelFor('contact');
	},
	renderTemplate: function() {
    this.render({
			outlet: 'editContactOutlet'
			});
  },
	actions: {
		rollback: function() {
			this.get('controller').rollback()
		},
		rollbackAndClose: function() {
			this.get('controller').rollback();
			this.transitionTo('contacts')
		},
		commit: function() {
			this.get('controller').update();
		},
		commitAndClose: function() {
			this.get('controller').update();
			if(this.get('controller').get('content').didUpdate) {
				return this.transitionTo('contacts');
			}
		}
	}
});

/*******************************
* Groups
*******************************/

App.GroupsRoute = Ember.Route.extend({
	model: function(){
		return this.get('store').findAll('group');
	}
});

App.GroupsCreateRoute = Ember.Route.extend({
	model: function () {
		return this.get('store').createRecord('group');
	},
	renderTemplate: function() {
		this.render({
			outlet: 'createGroupOutlet'
		});
  },
	actions: {
		rollbackAndClose: function() {
			this.get('controller').rollback();
			this.transitionTo('groups')
		},
		commitAndClose: function() {
			this.get('controller').update();
			if(this.get('controller').get('content').didUpdate) {
				return this.transitionTo('groups');
			}
		}
	}
});
/*******************************
* Group
*******************************/

App.GroupEditRoute = Ember.Route.extend({
	model: function () {
		return this.modelFor('group');
	},
	renderTemplate: function() {
		this.render({
			outlet: 'editGroupOutlet'
		});
  },
	actions: {
		rollback: function() {
			this.get('controller').rollback()
		},
		rollbackAndClose: function() {
			this.get('controller').rollback();
			this.transitionTo('groups')
		},
		commit: function() {
			this.get('controller').update()
		},
		commitAndClose: function() {
			this.get('controller').update();
			if(this.get('controller').get('content').didUpdate) {
				return this.transitionTo('groups');
			}
		}
	}
});

/*******************************
* Achievements
*******************************/

App.AchievementsRoute = Ember.Route.extend({
	model: function(){
		return this.get('store').findAll('achievement');
	}
});

/*******************************
* Achievement
*******************************/

// N/A
