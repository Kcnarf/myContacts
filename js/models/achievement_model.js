App.Achievement = DS.Model.extend({

	title: DS.attr('string'),
	description: DS.attr('string'),
	achieved: DS.attr('boolean')
	
	// // Pages of myContacts
	// visit_achievements_page: DS.attr('boolean'),
	// visit_about_page: DS.attr('boolean'),
	
	// // Contact
	// create_a_contact: DS.attr('boolean'),
	// view_a_contact: DS.attr('boolean'),
	// update_a_contact: DS.attr('boolean'),
	// delete_a_contact: DS.attr('boolean'),
	// set_a_contact_as_favorite: DS.attr('boolean'),
	
	// // Group
	// create_a_group: DS.attr('boolean'),
	// view_a_group: DS.attr('boolean'),
	// update_a_groupo: DS.attr('boolean'),
	// delete_a_group: DS.attr('boolean'),
	
	// // Contact<->Group relationship
	// assign_a_contact_to_a_group: DS.attr('boolean'),
	
	// // Search feature
	// search_contacts: DS.attr('boolean'),
	// search_contacts_inovatively: DS.attr('boolean')
});