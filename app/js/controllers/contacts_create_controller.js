App.ContactsCreateController = Ember.ObjectController.extend({
	needs:['groups'],
	selectedGroups: null,

	allGroups: function (){
		return App.Group.all();
	}.property(),

	rollback: function() {
		this.get('transaction').rollback();
		this.transitionToRoute('contacts.search');
	},
	
	create: function (newContact){
		newContact.get('transaction').commit();
		newContact.one('didCreate', function(){
		  Ember.run.next(function(){
				newContact.reload();
			});
		});
		if (!Ember.isEmpty(this.get('selectedGroups'))) {
			newContact.addObserver('id', this, function(){
				for(var i=0;i<this.get('selectedGroups').get('length');i++) {
				
					new_contact_group_link = newContact.get('contact_group_links').createRecord({
						group: this.get('selectedGroups').objectAt(i)
					});
					new_contact_group_link.get('transaction').commit().then();
					// new_contact_group_link.set('contact', newContact);
					// linkedGroup= 
					// new_contact_group_link.set('group', linkedGroup);
					// newContact.get('contact_group_links').pushObject(new_contact_group_link);
					// linkedGroup.get('contact_group_links').pushObject(new_contact_group_link);
					//debugger;
				};
				
				//newContact.get('groups').setObjects(self.get('selectedGroups'));
				//this.get('ctrlNewContact').get('transaction').commit();
				this.transitionToRoute('contacts.search')
			});
			
		}
		else {
			this.transitionToRoute('contacts.search');
		}
	}
});