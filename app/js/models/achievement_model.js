App.Achievement = DS.Model.extend({

	title: DS.attr('string'),
	how_to: DS.attr('string'),
	is_achieved: DS.attr('boolean')
});