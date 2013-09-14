App.GroupEditController = Ember.ObjectController.extend({
  
	actions: {
		rollback: function() {
			this.get('transaction').rollback();
		},
		
		update: function() {
			this.get('transaction').commit()
		}
	}
})