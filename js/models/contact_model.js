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