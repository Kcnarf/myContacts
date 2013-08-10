App.GroupsCreateView = Em.View.extend({
	templateName: 'groups/create',
	
	classNames: ['modal', 'fade', 'in'],

	attributeBindings: ['role', 'aria_hidden:aria-hidden', 'tabindex'],
	role:"dialog",
	aria_hidden:"true",
	tabindex:"-1",
	
	init: function () {
		this.elementId = "create-group-modal";
		this._super();
	},
	
	didInsertElement: function () {
		return this.$().modal('show');
	},
	willDestroyElement: function () {
		return this.$().modal('hide');
	}
});