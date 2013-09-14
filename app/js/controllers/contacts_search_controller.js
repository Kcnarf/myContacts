App.ContactsSearchController = Ember.ArrayController.extend({
	sortProperties: ['alias'],
	sortAscending: true,
	needs: ['contacts'],
	
	contactCountBinding: 'controllers.contacts.contactCount',
	
	searchText: '',
	
	favoriteContacts: function () {
		return this.get('arrangedContent').filterProperty('is_favorite',true);
	}.property('arrangedContent.@each.is_favorite'),
	
	favoriteContactCount: function () {
		return this.get('favoriteContacts').get('length');
	}.property('favoriteContacts.length'),
	
	severalFavoriteContacts: function () {
		return this.get('favoriteContactCount') > 1;
	}.property('favoriteContactCount'),
	
	searchContacts: function () {
		if (Ember.isEmpty(this.get('searchText'))) {
			return this.get('arrangedContent');
		}
		else {
			var regexPattern = '';
			var searchTextArray = this.get('searchText').split("");
			for (var i=0;i<searchTextArray.length-1;i++)
			{ 
				regexPattern = regexPattern.concat('(', searchTextArray[i], ').*');
			}
			regexPattern = regexPattern.concat('(', searchTextArray[searchTextArray.length-1], ')')
			
			var regex = new RegExp(regexPattern,'i');
			var filtered = this.get('arrangedContent').filter(function(contact) {
				return regex.test(contact.get('alias'));
			});
			return filtered;
		}
	}.property('searchText'),
	
	searchedContactCount: function() {
		return this.get('searchContacts').get('length');
	}.property('searchContacts.length'),
	
	severalSearchedContacts: function() {
		return this.get('searchedContactCount') > 1;
	}.property('searchedContactCount'),
	
	actions: {
		showContact: function (contact) {
			this.transitionToRoute('contact.read', contact)
		},
		
		toggleFavorite: function (contact) {
			contact.set('is_favorite', !contact.get('is_favorite'));
			contact.get('transaction').commit()
		},
		
		edit: function (contact) {
			this.transitionToRoute('contact.edit', contact);
		},
		
		delete: function (contact) {
			var old_contact_group_links= contact.get('contact_group_links.content');
			while(!Ember.isEmpty(old_contact_group_links)) {
				old_contact_group_link = old_contact_group_links.get('firstObject')
				contact.get('contact_group_links').removeObject(old_contact_group_link.record);
				linkedGroup= old_contact_group_link.record.get('group');
				linkedGroup.get('contact_group_links').removeObject(old_contact_group_link.record);
				old_contact_group_link.record.deleteRecord();
				old_contact_group_link.record.get('store').commit()
			};
			
			contact.deleteRecord();
			this.get('store').commit()
		},
	
		resetSearch: function() {
			this.set('searchText', "");
		}
	}
});