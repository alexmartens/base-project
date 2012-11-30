// JavaScript Document

$.fn.swipe = function (el1, el2) {
	
	$(this).each(function () {
		
		var x1, x2;
		
		$(this).on('touchstart', function (event) {
			
			x1 = event.originalEvent.targetTouches[0].pageX;
			
		}).on('touchmove', function (event) {
			
			event.preventDefault();
			
		}).on('touchend touchcancel', function (event) {
			
			x2 = event.originalEvent.changedTouches[0].pageX;
			
			var dx = x1 - x2;
			
			if (dx > 0) {
				$(el2).click();
			} else if (dx < 0) {
				$(el1).click();
			}
			
		});
		
	});
	
};
