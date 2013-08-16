App.AchievementsController= Ember.ArrayController.extend({
	needs: ["application", "groupsCreate"],
	
	init: function() {
		this.get('controllers.groupsCreate').one('setAsAchieved', this, function(achievementTitle) {
			this.setAsAchieved(achievementTitle);
		});
	},

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
	
	setAsAchieved: function (achievementTitle) {
		var achievement= this.get('content').findProperty('title', achievementTitle);
		if (!achievement.get('is_achieved')) {
			achievement.set('is_achieved', true);
			achievement.get('transaction').commit()
		}
	},
	
	currentPathBinding: 'controllers.application.currentPath',
	currentPathObserver: function() {
		switch(this.get('currentPath')) {
		 case "about":
			this.setAsAchieved('About-er');
			break;
		case "achievements":
			this.setAsAchieved('Eager learner');
			break;
		case "contacts.create":
			this.setAsAchieved('I\'m not alone!');
			break;
		case "contacts.contact.read":
			this.setAsAchieved('Memoryless');
			break;
		case "contacts.contact.edit":
			this.setAsAchieved('Something\'s alive out there');
			break;
		// case "groups.create":
			// this.setAsAchieved('Classifier');
			// break;
		case "groups.group.edit":
			this.setAsAchieved('Wording counts!');
			break;
		}
	}.observes('currentPath')
})