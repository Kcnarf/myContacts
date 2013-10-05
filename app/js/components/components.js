App.BaseChartComponent = Ember.Component.extend({
	classNames: ['chart'],

	didInsertElement: function() {
		Ember.run.once(this, 'update');
	},

	update: function() {
		if (this.get('isLoaded')) {
			d3.select(this.$()[0])
				.data([ this.get('data') ])
				.call(this.get('chart'));
		}
	}.observes('data')
});

/*
App.BarChartComponent = App.BaseChartComponent.extend({
	chart: BarChart()
		.margin({left: 40, top: 40, bottom: 80, right: 40})
		.manyColors(true)
		.colors(['#be3600', '#ff4b00', '#ff6100', '#ff7600', '#ff8c00']) 
		// .oneColor('#BE3600')
		.rotateAxisLabels(true)
		// .hideAxisLabels(true)
		// .noTicks(true)
		// .staticDataLabels(true)
});
*/

App.PieChartComponent = App.BaseChartComponent.extend({
	chart: PieChart()
		.oneColor('#BE3600')
		.labelColor('white')
		.labelSize('11px')
		// .margin({left: 40, top: 40, bottom: 50, right: 40})
		// .hideAxisLabels(true)
		// .noTicks(true)
		// .staticDataLabels(true)
});