App.Contact_group_link= DS.Model.extend({
	contact: DS.belongsTo('App.Contact'),
	group: DS.belongsTo('App.Group'),
	
	relationshipLoaded: function(){
		this.get('contact').get('isLoaded') && this.get('group').get('isLoaded')
	}.property('contact.isLoaded', 'group.isLoaded')
});