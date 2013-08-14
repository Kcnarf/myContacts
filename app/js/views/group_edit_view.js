App.GroupEditView = Em.View.extend({
	templateName: 'group/edit',
	
	init: function () {
		this.elementId = "group-edit-modal";
		this._super();
	},

	classNames: ['modal', 'fade', 'in'],

	attributeBindings: ['role', 'aria_hidden:aria-hidden', 'tabindex'],
	role:"dialog",
	aria_hidden:"true",
	tabindex:"-1",

	didInsertElement: function () {
		return this.$().modal('show');
	},
	willDestroyElement: function () {
		return this.$().modal('hide');
	}
});