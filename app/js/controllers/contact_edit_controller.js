App.ContactEditController= Ember.ObjectController.extend({
	needs: ['groups'],
	selectedGroups: null,
	
	allGroups: function () {
		return App.Group.all();
	}.property(),
	
	rollback: function() {
		this.get('transaction').rollback();
	},
	
	actions: {
		update: function() {
			var old_contact_group_links= this.get('content.contact_group_links.content');
			while(!Ember.isEmpty(old_contact_group_links)) {
				old_contact_group_link = old_contact_group_links.get('firstObject')
				this.get('content').get('contact_group_links').removeObject(old_contact_group_link.record);
				linkedGroup= old_contact_group_link.record.get('group');
				linkedGroup.get('contact_group_links').removeObject(old_contact_group_link.record);
				old_contact_group_link.record.deleteRecord();
				old_contact_group_link.record.get('store').commit()
			};
			
			for(var i=0;i<this.get('selectedGroups').get('length');i++) {
				new_contact_group_link = App.Contact_group_link.createRecord();
				new_contact_group_link.set('contact', this.get('content'));
				linkedGroup= this.get('selectedGroups').objectAt(i);
				new_contact_group_link.set('group', linkedGroup);
				this.get('content').get('contact_group_links').pushObject(new_contact_group_link);
				linkedGroup.get('contact_group_links').pushObject(new_contact_group_link)
				
				new_contact_group_link.get('transaction').commit();
			};
			this.get('transaction').commit();
		}
	}
})