App.AchievementsController= Ember.ArrayController.extend({
	needs: ["application", "groups"],
	
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
	
	
	currentLoadedGroupsLength: null,
	
	loadedGroups: function() {
		return this.get('controllers.groups').filterProperty('isDirty', false);
	}.property('controllers.groups.@each.isDirty'),
	
	loadedGroupsLength: function() {
		return this.get('loadedGroups').get('length');
	}.property('loadedGroups'),
	
	loadedGroupsLengthObserver: function() {
		//console.log('loaded groups length changed', this.get('loadedGroupsLength'));
		if (this.get('currentLoadedGroupsLength')!=null) {
			if (this.get('currentLoadedGroupsLength')<this.get('loadedGroupsLength')) {
				//console.log('Group creation');
				this.setAsAchieved(this.get('content').filterProperty('title', 'Classifier').get('firstObject'));
			} else if (this.get('currentLoadedGroupsLength')>this.get('loadedGroupsLength')) {
				//console.log('Group deletion');
				this.setAsAchieved(this.get('content').filterProperty('title', 'Mass killer').get('firstObject'));
			}
		} //else {
			//console.log('First loading');
		//};
		this.set('currentLoadedGroupsLength', this.get('loadedGroupsLength'))
	}.observes('loadedGroupsLength'),
	
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
		// case "groups.create":
			// this.setAsAchieved(this.get('content').filterProperty('title', 'Classifier').get('firstObject'));
			// break;
		case "groups.group.edit":
			this.setAsAchieved(this.get('content').filterProperty('title', 'Wording counts!').get('firstObject'));
			break;
		}
	}.observes('currentPath')
})