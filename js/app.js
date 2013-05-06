App = Ember.Application.create({
	LOG_TRANSITIONS: true
});

App.Store= DS.Store.extend({
  revision: 12,
  adapter: 'DS.FixtureAdapter'
});

App.Router.map(function() {
	this.resource('contacts', function(){
		this.route('search');
		this.resource('contact', {path: ':contact_alias'});
		this.route('create');
	});
	this.resource('groups');
	this.resource('about');
});

App.ContactsIndexRoute= Ember.Route.extend({
	redirect: function() {
    this.transitionTo('contacts.search');
  }
});

App.ContactsSearchRoute= Ember.Route.extend({
	model: function() {
    return App.Contact.find();
  }
});

App.ContactRoute= Ember.Route.extend({
	model: function(params) {
		return App.Contact.find().findProperty('alias', params.contact_alias);
	},
	serialize: function(contactInstance) {
		return {contact_alias: contactInstance.get('alias')};
	}
})

App.ContactsCreateRoute= Ember.Route.extend({
	model: function() {
    return App.Contact.createRecord({
			id: App.Contact.find().length
		});
	}
});

App.ContactsCreateController = Ember.ObjectController.extend({
  create: function (newContact){
    App.Contact.find().addObject(newContact);
		this.transitionToRoute('contact', newContact);
  }
});

App.Contact= DS.Model.extend({
	alias: DS.attr('string'),
	first_name: DS.attr('string'),
	last_name: DS.attr('string'),
	home_phone: DS.attr('string'),
	mobile_phone: DS.attr('string'),
	office_phone: DS.attr('string'),
	personal_mail: DS.attr('string'),
	office_mail: DS.attr('string'),
	groups: DS.hasMany('App.Group')
});

App.Group= DS.Model.extend({
	name: DS.attr('string'),
	contacts: DS.hasMany('App.Contact')
});

App.Contact.FIXTURES= [{
	id: 1,
	alias: 'FooTer',
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
	first_name: 'Cas',
	last_name: 'Per',
	home_phone: '',
	mobile_phone: '',
	office_phone: '',
	personal_mail: '',
	office_mail: '',
	groups: []
}];

App.Group.FIXTURES= [{
	id: 1,
	name: 'FooBar',
	contacts: [1,2]
},{
	id: 2,
	name: 'Friends',
	contacts: [3]
}]