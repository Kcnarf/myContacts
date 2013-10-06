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
			var _this = this;
			this.set('ctrlNewContact', newContact);
			
			newContact.save().then(
				function () {
					//Succesful save, thus transition to edit route
					_this.transitionToRoute('contacts.search');
        },
        function (error) {    
          if (error.status == 422) {
            //422: validation error
            //Put json responsetext into validationErrors obj
            self.set('validationErrors', jQuery.parseJSON(error.responseText));
          } else {
            console.log("Validation error occured - " + error.responseText);
            alert("An error occured - REST API not available - Please try again");
          }
        }
      );
			/*
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
			*/
		}
	}
});