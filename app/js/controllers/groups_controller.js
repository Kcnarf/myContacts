App.GroupsController = Ember.ArrayController.extend({
	sortProperties: ['name'],
	sortAscending: true,
	
	new_group_name: '',
	
	groupCount: function() {
		return this.get('length');
	}.property('length'),
	
	severalGroups: function() {
		return this.get('groupCount') > 1;
	}.property('groupCount'),
	
	actions: {
		delete: function (group) {
			var old_contact_group_links= group.get('contact_group_links.content');
			while(!Ember.isEmpty(old_contact_group_links)) {
				old_contact_group_link = old_contact_group_links.get('firstObject')
				group.get('contact_group_links').removeObject(old_contact_group_link.record);
				linkedContact= old_contact_group_link.record.get('contact');
				linkedContact.get('contact_group_links').removeObject(old_contact_group_link.record);
				old_contact_group_link.record.deleteRecord();
				old_contact_group_link.record.get('store').commit()
			};
			group.deleteRecord()
			this.get('store').commit()
		}
	}
});