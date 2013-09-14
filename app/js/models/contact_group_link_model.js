App.ContactGroupLink= DS.Model.extend({
	contact: DS.belongsTo('contact'),
	group: DS.belongsTo('group'),
	
	relationshipLoaded: function(){
		this.get('contact').get('isLoaded') && this.get('group').get('isLoaded')
	}.property('contact.isLoaded', 'group.isLoaded')
});