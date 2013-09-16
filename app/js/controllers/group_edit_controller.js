App.GroupEditController = Ember.ObjectController.extend({
  
	rollback: function() {
		this.get('transaction').rollback();
	},
	
	update: function() {
		this.get('model').save()
	}
})