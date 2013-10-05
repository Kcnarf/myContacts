App.Group = DS.Model.extend({
	name: DS.attr('string'),
	contact_group_links: DS.hasMany('contactGroupLink', {
    inverse: 'group'
  })
});