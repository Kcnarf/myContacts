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
		this.resource('contact', {path: '/:contact_id'}, function(){
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
	setupController: function(){
		App.Contact.find(); // populate the store with all Contact instances
		App.Group.find(); // populate the store with all Group instances
		App.Contact_group_link.find() // populate the store with all links/relationships between Contact and Group
		App.Achievement.find() // populate the store with all Achievement instances
		
		this.controllerFor('contacts').set('model', App.Contact.all());
		this.controllerFor('groups').set('model', App.Group.all());
		this.controllerFor('achievements').set('model', App.Achievement.all());
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

App.ContactEditRoute = Ember.Route.extend({
	model: function () {
		return this.modelFor('contact');
	},
	renderTemplate: function() {
    this.render({
			outlet: 'editContactOutlet'
			});
  },
	events: {
		rollback: function() {
			this.get('controller').get('content').get('transaction').rollback()
		},
		rollbackAndClose: function() {
			this.get('controller').get('content').get('transaction').rollback();
			this.transitionTo('contacts')
		},
		commit: function() {
			this.get('controller').get('content').get('transaction').commit();
		},
		commitAndClose: function() {
			this.get('controller').get('content').get('transaction').commit();
			if(this.get('controller').get('content').didUpdate) {
				return this.transitionTo('contacts');
			}
		}
	}
});

App.ContactEditView = Em.View.extend({
	templateName: 'contact/edit',
	tagName: 'editcontactmodal',

	classNames: ['modal', 'fade', 'in'],

	attributeBindings: ['role', 'aria_hidden:aria-hidden', 'tabindex'],
	role:"dialog",
	aria_hidden:"true",
	tabindex:"-1",

	didInsertElement: function () {
		return this.$().modal('show');
	},
	willDestroyElement: function () {
		return this.$().modal('hide');
	}
});

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
App.GroupsCreateRoute = Ember.Route.extend({
	model: function () {
		return App.Group.createRecord();
	},
	renderTemplate: function() {
    this.render({
			outlet: 'createGroupOutlet'
			});
  },
	events: {
		rollbackAndClose: function() {
			this.get('controller').get('content').get('transaction').rollback();
			this.transitionTo('groups')
		},
		commitAndClose: function() {
			this.get('controller').get('content').get('transaction').commit();
			if(this.get('controller').get('content').didUpdate) {
				return this.transitionTo('groups');
			}
		}
	}
});

App.GroupsCreateView = Em.View.extend({
	templateName: 'groups/create',
	tagName: 'creategroupmodal',

	classNames: ['modal', 'fade', 'in'],

	attributeBindings: ['role', 'aria_hidden:aria-hidden', 'tabindex'],
	role:"dialog",
	aria_hidden:"true",
	tabindex:"-1",

	didInsertElement: function () {
		return this.$().modal('show');
	},
	willDestroyElement: function () {
		return this.$().modal('hide');
	}
});

App.GroupEditRoute = Ember.Route.extend({
	model: function () {
		return this.modelFor('group');
	},
	renderTemplate: function() {
    this.render({
			outlet: 'editGroupOutlet'
			});
  },
	events: {
		rollback: function() {
			this.get('controller').get('content').get('transaction').rollback()
		},
		rollbackAndClose: function() {
			this.get('controller').get('content').get('transaction').rollback();
			this.transitionTo('groups')
		},
		commit: function() {
			this.get('controller').get('content').get('transaction').commit();
		},
		commitAndClose: function() {
			this.get('controller').get('content').get('transaction').commit();
			if(this.get('controller').get('content').didUpdate) {
				return this.transitionTo('groups');
			}
		}
	}
});

App.GroupEditView = Em.View.extend({
	templateName: 'group/edit',
	tagName: 'editgroupmodal',

	classNames: ['modal', 'fade', 'in'],

	attributeBindings: ['role', 'aria_hidden:aria-hidden', 'tabindex'],
	role:"dialog",
	aria_hidden:"true",
	tabindex:"-1",

	didInsertElement: function () {
		return this.$().modal('show');
	},
	willDestroyElement: function () {
		return this.$().modal('hide');
	}
});

/*******************************
* Achievements
*******************************/

App.AchievementsRoute = Ember.Route.extend({
	model: function(){
		return App.Achievement.all();
	}
});

/*******************************
* Achievement
*******************************/

// N/A
