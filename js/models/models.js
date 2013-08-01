

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
	contact_group_links: DS.hasMany('App.Contact_group_link', {
    inverse: 'contact'
  }),
	
	groups: function(){
		return this.get('contact_group_links').getEach('group')
	}.property('contact_group_links.@each.relationshipLoaded'),
	
	groupCount: function() {
		return this.get('groups').get('length');
	}.property('groups.length')
});

App.Group = DS.Model.extend({
	name: DS.attr('string'),
	contact_group_links: DS.hasMany('App.Contact_group_link', {
    inverse: 'group'
  })
});

App.Contact_group_link= DS.Model.extend({
	contact: DS.belongsTo('App.Contact'),
	group: DS.belongsTo('App.Group'),
	
	relationshipLoaded: function(){
		this.get('contact').get('isLoaded') && this.get('group').get('isLoaded')
	}.property('contact.isLoaded', 'group.isLoaded')
});

/*
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
}]
*/