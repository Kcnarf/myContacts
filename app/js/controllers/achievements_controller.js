App.AchievementsController= Ember.ArrayController.extend({
	needs: ["application", "contacts", "groups"],
	
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
		switch(this.get('currentPath')) {
		 case "about":
			this.setAsAchieved(this.get('content').filterProperty('title', 'About-er').get('firstObject'));
			break;
		case "achievements":
			this.setAsAchieved(this.get('content').filterProperty('title', 'Eager learner').get('firstObject'));
			break;
		// case "contacts.create":
			// this.setAsAchieved(this.get('content').filterProperty('title', 'I\'m not alone!').get('firstObject'));
			// break;
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
	}.observes('currentPath'),
	
	
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
			//console.log('First loading of Groups');
		//};
		this.set('currentLoadedGroupsLength', this.get('loadedGroupsLength'))
	}.observes('loadedGroupsLength'),
	
	currentLoadedContactsLength: null,
	loadedContacts: function() {
		return this.get('controllers.contacts').filterProperty('isDirty', false);
	}.property('controllers.contacts.@each.isDirty'),
	loadedContactsLength: function() {
		return this.get('loadedContacts').get('length');
	}.property('loadedContacts'),
	loadedContactsLengthObserver: function() {
		//console.log('loaded Contacts length changed', this.get('loadedContactsLength'));
		if (this.get('currentLoadedContactsLength')!=null) {
			if (this.get('currentLoadedContactsLength')<this.get('loadedContactsLength')) {
				//console.log('Contact creation');
				this.setAsAchieved(this.get('content').filterProperty('title', 'I\'m not alone!').get('firstObject'));
			} else if (this.get('currentLoadedContactsLength')>this.get('loadedContactsLength')) {
				//console.log('Contact deletion');
				this.setAsAchieved(this.get('content').filterProperty('title', 'Killer').get('firstObject'));
			}
		} // else {
			// console.log('First loading of contacts');
		// };
		this.set('currentLoadedContactsLength', this.get('loadedContactsLength'))
	}.observes('loadedContactsLength'),
})