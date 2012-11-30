// JavaScript Document

$.fn.dropdown = function () {
	$("> li", this).each(function () {
		var menuItem = $(this);
		var dropdown = $('> ul', this);
		var hasDropdown = dropdown.length > 0;
		
		dropdown.hide();
		
		menuItem.hover(function () {
			menuItem.addClass("hover");
			if (hasDropdown)
				dropdown.show();
		}, function () {
			menuItem.removeClass("hover");
			if (hasDropdown)
				dropdown.hide();
		});
	});
};
