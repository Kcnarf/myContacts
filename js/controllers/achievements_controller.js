App.AchievementsController= Ember.ArrayController.extend({
	needs: ["application"],

	unachievedAchievements: function () {
		return this.get('content').filterProperty('is_achieved',false);
	}.property('content.@each.is_achieved'),
	
	unachievedAchievementCount: function() {
		return this.get('unachievedAchievements').get('length');
	}.property('unachievedAchievements.length'),
	
	severalUnachievedAchievements: function() {
		return this.get('unachievedAchievementCount') > 1;
	}.property('unachievedAchievementCount'),
	
	noUnachievedAchievement: function() {
		return this.get('unachievedAchievementCount') === 0;
	}.property('unachievedAchievementCount'),
	
	setAsAchieved: function (achievement) {
		if (!achievement.get('is_achieved')) {
			achievement.set('is_achieved', true);
			achievement.get('transaction').commit()
		}
	},
	
	currentPathBinding: 'controllers.application.currentPath',
	currentPathObserver: function() {
		if (this.get('currentPath') == "about") {
			this.setAsAchieved(this.get('content').filterProperty('title', 'About-er').get('firstObject'));
		}
		else if (this.get('currentPath') == "achievements") {
			this.setAsAchieved(this.get('content').filterProperty('title', 'Eager Learner').get('firstObject'));
		}
	}.observes('currentPath')
})