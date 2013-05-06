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
	});
	this.resource('groups');
	this.resource('about');
});

App.ContactsSearchRoute= Ember.Route.extend({
	model: function() {
    return App.Contact.find();
  }
})

App.ContactRoute= Ember.Route.extend({
	model: function(params) {
		return App.Contact.FIXTURES.findProperty('alias', params.contact_alias);
//		return App.Contact.find().findProperty('alias', params.contact_alias);
	},
	serialize: function(contactInstance) {
		return {contact_alias: contactInstance.get('alias')};
	}
})

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
	alias: 'Doudou',
	first_name: 'Franck',
	last_name: 'Lebeau',
	home_phone: '',
	mobile_phone: '0637514454',
	office_phone: '0381666655',
	personal_mail: 'fl.franck.lebeau@gmail.com',
	office_mail: 'franck.lebeau@femto-st.fr',
	groups: [1]
},{
	id: 2,
	alias: 'Coco',
	first_name: 'Corinne',
	last_name: 'Lauzet',
	home_phone: '',
	mobile_phone: '0679470497',
	office_phone: '',
	personal_mail: 'corinne.lauzet@laposte.net',
	office_mail: 'corinne.lauzet@adeo.fr',
	groups: [1]
},{
	id: 3,
	alias: 'Bébert',
	first_name: 'Daniel',
	last_name: 'Bertin Mourot',
	home_phone: '',
	mobile_phone: '0679481704',
	office_phone: '',
	personal_mail: '',
	office_mail: '',
	groups: [2]
}];

App.Group.FIXTURES= [{
	id: 1,
	name: 'famille',
	contacts: [1,2]
},{
	id: 2,
	name: 'amis',
	contacts: [3]
}]