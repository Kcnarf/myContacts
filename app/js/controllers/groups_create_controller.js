App.GroupsCreateController = Ember.ObjectController.extend({
  
	rollback: function() {
		this.get('model').rollback();
	},
	
	update: function() {
		this.get('model').save()
	}
})