/*

	https://developer.mozilla.org/en-US/docs/DOM/Touch_events
	
	This calls event.preventDefault() to keep the browser from continuing 
	to process the touch event (this also prevents a mouse event from also 
	being delivered) ... Since calling preventDefault() on a touchstart ... 
	prevents the corresponding mouse events from firing, it's common to call 
	preventDefault() on touchmove rather than touchstart. That way, mouse 
	events can still fire and things like links will continue to work.

*/

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
