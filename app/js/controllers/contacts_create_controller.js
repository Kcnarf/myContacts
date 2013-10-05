App.ContactsCreateController = Ember.ObjectController.extend({
	needs:['groups'],
	selectedGroups: null,
	ctrlNewContact: null,

	allGroups: function (){
		return this.get('store').findAll('group');
	}.property(),

	actions: {
		rollback: function() {
			this.get('model').rollback();
			this.transitionToRoute('contacts.search');
		},
		
		create: function (newContact){
			this.set('ctrlNewContact', newContact);
			
			newContact.save();
			if (!Ember.isEmpty(this.get('selectedGroups'))) {
				ctrl= this;
				newContact.addObserver('id', this, function(){
					for(var i=0;i<this.get('selectedGroups').get('length');i++) {
						new_contact_group_link = App.Contact_group_link.createRecord();
						new_contact_group_link.set('contact', this.get('ctrlNewContact'));
						linkedGroup= this.get('selectedGroups').objectAt(i);
						new_contact_group_link.set('group', linkedGroup);
						this.get('ctrlNewContact').get('contact_group_links').pushObject(new_contact_group_link);
						linkedGroup.get('contact_group_links').pushObject(new_contact_group_link);
						
						new_contact_group_link.get('transaction').commit()
					};
					//newContact.get('groups').setObjects(self.get('selectedGroups'));
					this.get('ctrlNewContact').get('transaction').commit();
					this.transitionToRoute('contacts.search')
				})
			}
			else {
				this.transitionToRoute('contacts.search');
			}
		}
	}
});