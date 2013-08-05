App.AchievementsController= Ember.ArrayController.extend({
	needs: ["application"],
	
	currentPathBinding: 'controllers.application.currentPath',
	
	memorizedContactCount: null,
	allContacts: function() {
		return App.Contact.all();
	}.property(),
	
	contactCount: function() {
		return this.get('allContacts').get('length')
	}.property('allContacts.length'),
	
	memorizedGroupCount: null,
	allGroups: function() {
		return App.Group.all();
	}.property(),
	
	groupCount: function() {
		return this.get('allGroups').get('length')
	}.property('allGroups.length'),
	
	init: function() {
    this._super();
		this.set('memorizedContactCount', this.get('contactCount'));
		this.set('memorizedGroupCount', this.get('groupCount'));
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
	
	setAsAchieved: function (achievement) {
		if (!achievement.get('is_achieved')) {
			achievement.set('is_achieved', true);
			achievement.get('transaction').commit()
		}
	},
	
	currentPathObserver: function() {
		if (this.get('currentPath') == "about") {
			this.setAsAchieved(this.get('content').filterProperty('title', 'About-er').get('firstObject'));
		}
		else if (this.get('currentPath') == "achievements") {
			this.setAsAchieved(this.get('content').filterProperty('title', 'Eager Learner').get('firstObject'));
		}
	}.observes('currentPath'),
	
	contactCountObserver: function() {
		if (this.get('memorizedContactCount') < this.get('contactCount')) {
			this.setAsAchieved(this.get('content').filterProperty('title', 'I\'m not alone!').get('firstObject'));
		}
		else if (this.get('memorizedContactCount') > this.get('contactCount')) {
			this.setAsAchieved(this.get('content').filterProperty('title', 'Killer').get('firstObject'));
		}
		this.set('memorizedContactCount', this.get('contactCount'));
	}.observes('contactCount'),
	
	groupCountObserver: function() {
		if (this.get('memorizedGroupCount') < this.get('groupCount')) {
			this.setAsAchieved(this.get('content').filterProperty('title', 'Classifier').get('firstObject'));
		}
		else if (this.get('memorizedGroupCount') > this.get('groupCount')) {
			this.setAsAchieved(this.get('content').filterProperty('title', 'Mass killer').get('firstObject'));
		}
		this.set('memorizedGroupCount', this.get('groupCount'));
	}.observes('groupCount')
	
})