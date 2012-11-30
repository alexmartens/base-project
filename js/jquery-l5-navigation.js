// Adds classes for styling navigation

$.fn.navigation = function () {
	var nav = $(this);
	
	function setActive (menu) {
		$(menu)
			.addClass("mouseover")
			.prev()
			.addClass("adjacent prev")
			.end()
			.next()
			.addClass("adjacent next");
	}
	
	function resetMenu (menu) {
		$(menu)
			.removeClass("mouseover")
			.prev()
			.removeClass("adjacent prev")
			.end()
			.next()
			.removeClass("adjacent next");
	}
	
	function touchHandler (e) {
		//var el = $(this).unbind('click');
		var el = $(this);
		var menu = el.parents('li');
		
		$("> ul > li", nav).each(function () { resetMenu(this); });
		$('html').css('cursor', 'pointer').click(function () {
			$('html').css('cursor', 'auto').unbind('click');
			//el.click(touchHandler);
			resetMenu(menu);
		});
		setActive(menu);
		
		return (menu.find('> ul').length == 0);
	}
	
	$(this).each(function () {				
		
		if (typeof TouchEvent != "undefined") {
			$("ul li h4 a", this).click(touchHandler);
		} else {

			$("ul li", this).each(function () {
				var menu = $(this);
				
				if (menu.find('> ul').length > 0)
					menu.addClass('dropdown');
				
				menu.hover(function (e) {
						setActive(this);
					}, function (e) {
						resetMenu(this);
				});		
			});

		}
		
	});
};
