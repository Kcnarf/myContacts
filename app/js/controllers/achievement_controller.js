App.AchievementController= Ember.ObjectController.extend({
	
	toggleAchieved: function () {
		this.set('is_achieved', !this.get('is_achieved'));
		this.get('transaction').commit()
	},
})