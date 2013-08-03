App.AchievementsController= Ember.ArrayController.extend({
	
	unachievedAchievements: function () {
		return this.get('content').filterProperty('is_achieved',true);
	}.property('content.@each.is_achieved'),
	
	unachievedAchievementCount: function() {
		return this.get('unachievedAchievements').get('length');
	}.property('unachievedAchievements.length'),
	
	severalUnachievedAchievements: function() {
		return this.get('unachievedAchievementCount') > 1;
	}.property('unachievedAchievementCount')
})