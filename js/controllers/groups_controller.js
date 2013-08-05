App.GroupsController = Ember.ArrayController.extend({
	needs: ["achievements"],
	
	sortProperties: ['name'],
	sortAscending: true,
	
	new_group_name: '',
	
	groupCount: function() {
		return this.get('length');
	}.property('length'),
	
	severalGroups: function() {
		return this.get('groupCount') > 1;
	}.property('groupCount'),
	
	createGroup: function() {
		var newGroup = App.Group.createRecord();
		newGroup.set('name', this.get('new_group_name'));
		newGroup.get('transaction').commit();
		this.set('new_group_name', '')
	},
	
	arrayContentWillChange: function(startIdx, removeAmt, addAmt) {
		this._super(startIdx, removeAmt, addAmt);
		if (removeAmt) {
			App.controllers.achievements.groupRemoved()
			console.log('Groups have been removed')
		} else if (addAmt) {
			App.console.log('Groups have been added')
		}
	}
});