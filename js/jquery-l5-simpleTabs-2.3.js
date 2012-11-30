// JavaScript Document - Tab functionality

(function( $ ) {

	$.widget( "l5.simpleTabs", {
		
		options: {
			
			index : 0,							// Index of the initial active tab
			selector : 'a',					// Tab element selector
			toggleContent : true,		// Associate tab with content block
			
			// CALLBACKS
			init : function () {},
			beforeChange : function () {},
			afterChange : function () {}
			
		},
 
		_create: function() {

			var o = this;
			
			o.index = -1;	// TAB INDEX; FIRST TIME THROUGH IT IS UNSET (-1)
			o.tabs = $(o.options.selector, this.element);
			o.content = [];
			
			if (o.options.toggleContent) {
				this.tabs.each(function () {
					var tab = $(this);
					var ref = tab.attr("data-ref") || tab.attr("href");
					if ( ! /^#[\w\-]+$/.test( ref ) ) {
						$.error( 'tabs: "' +  ref + '" is invalid' );
					}
					var contentBlock = $(ref);
					if (contentBlock.length == 0) {
						$.error( 'tabs: "' +  ref + '" not found' );
					}
					o.content.push(contentBlock.get(0));
				});
			}
			
			this.tabs.click(function () {
				
				var clicked = $(this);
				var index = o.tabs.index(this);
				
				// CALLBACK
				if (o.options.beforeChange({ element : this, index : index }, o) == false)
					return;
					
				// CHANGE TAB CONTENT
				if (o.options.toggleContent) {
					$(o.content).hide().removeClass('active').filter(clicked.attr("data-ref") || clicked.get(0).hash).show().addClass('active');
				}
				
				// CHANGE TAB
				o.tabs.removeClass('selected').prev().removeClass('prev').end().next().removeClass('next');
				clicked.addClass('selected').prev().addClass('prev').end().next().addClass('next');
				
				// CALLBACK
				o.options.afterChange({ element : this, index : index }, o);
				
				// SET THE ACTIVE INDEX; FIRST TIME THROUGH IT IS UNSET (-1)
				o.index = index; 
				
				return false;
				
			}).eq(o.options.index).click();
			
			// CALLBACK
			o.options.init(o);
			
		},
		
		set : function (n) {
			this.tabs.eq(n).click();
		},
		
		next : function () {
			this.set(this.index + 1);
		},
		
		prev : function () {
			this.set(this.index - 1);
		}
 
	});

}( jQuery ) );
