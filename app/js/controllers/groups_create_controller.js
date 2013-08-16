App.GroupsCreateController = Ember.ObjectController.extend({
  needs: ['achievements'],
	
	rollback: function() {
		this.get('transaction').rollback();
	},
	
	update: function() {
		this.get('content').get('transaction').commit();
		this.get('controllers.achievements').setAsAchieved('Classifier');
	},
})