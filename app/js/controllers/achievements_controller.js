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
			achievement.save()
		}
	},
	
	currentPathBinding: 'controllers.application.currentPath',
	currentPathObserver: function() {
		switch(this.get('currentPath')) {
		 case "about":
			this.setAsAchieved(this.get('content').filterProperty('title', 'About-er').get('firstObject'));
			break;
		case "achievements":
			this.setAsAchieved(this.get('content').filterProperty('title', 'Eager learner').get('firstObject'));
			break;
		case "contacts.create":
			this.setAsAchieved(this.get('content').filterProperty('title', 'I\'m not alone!').get('firstObject'));
			break;
		case "contacts.contact.read":
			this.setAsAchieved(this.get('content').filterProperty('title', 'Memoryless').get('firstObject'));
			break;
		case "contacts.contact.edit":
			this.setAsAchieved(this.get('content').filterProperty('title', 'Something\'s alive out there').get('firstObject'));
			break;
		case "groups.create":
			this.setAsAchieved(this.get('content').filterProperty('title', 'Classifier').get('firstObject'));
			break;
		case "groups.group.edit":
			this.setAsAchieved(this.get('content').filterProperty('title', 'Wording counts!').get('firstObject'));
			break;
		}
	}.observes('currentPath'),
	
	//BEGIN: charting
	data: function() {
		if (this.get('model.@each.isLoaded')) {
			var data = [
				{category: 'unachieved', count: this.get('unachievedAchievementCount')},
				{category: 'achieved', count: this.get('content').get('length')-this.get('unachievedAchievementCount')}
			]
		}
		return data;
	}.property('unachievedAchievementCount', 'content.length')
	//END: charting
})