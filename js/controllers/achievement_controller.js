App.AchievementController= Ember.ObjectController.extend({
	
	toggleAchieved: function () {
		this.toggleProperty('is_achieved');
		this.get('transaction').commit()
	}
})