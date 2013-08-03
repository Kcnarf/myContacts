App.AchievementController= Ember.ObjectController.extend({
	
	toggleAchieved: function () {
		this.get('content').set('is_achieved', !this.get('content').get('is_achieved'));
		this.get('transaction').commit()
	}
})