App.ContactReadController= Ember.ObjectController.extend({
	needs: ['groups'],
	selectedGroups: null,
	
	allGroups: function () {
		return App.Group.all();
	}.property()
})