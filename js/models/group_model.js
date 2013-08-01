App.Group = DS.Model.extend({
	name: DS.attr('string'),
	contact_group_links: DS.hasMany('App.Contact_group_link', {
    inverse: 'group'
  })
});