import "./private_layout.html";


Template.mainSidenav.events({

	"click [data-bs-toggle='collapse']": function(e, t) {
		let el = $(e.currentTarget);
		el.attr("aria-expanded", el.attr("aria-expanded") == "false" ? "true" : "false");
		let controlsEl = el.parent().find("#" + el.attr("aria-controls"));

		controlsEl.toggleClass("show").animate();
	}
});
