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