App.GroupsCreateController = Ember.ObjectController.extend(Ember.Evented,{
  
	rollback: function() {
		this.get('transaction').rollback();
	},
	
	update: function() {
		this.get('content').get('transaction').commit();
		this.trigger('setAsAchieved', 'Classifier');
	}
})