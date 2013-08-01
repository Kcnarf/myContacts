App.ContactsController = Ember.ArrayController.extend({
	contactCount: function() {
		return this.get('length');
	}.property('length')
});