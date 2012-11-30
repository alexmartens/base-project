// JavaScript Document

(function( $ ) {

  $.widget( "l5.collapsibleMenu", {
 
    // These options will be used as defaults
    options: {
			defaultIndex : -1,
			multiple : true,
			clickable : true,
			toggle : '> :even',
			
			// Callbacks
			beforeExpand : function () {},
			afterExpand : function () {},
			beforeCollapse : function () {},
			afterCollapse : function () {}
    },
 
    // Set up the widget
    _create: function () {

			var o = this;
			
			this.toggles = o.element.find(o.options.toggle);
			
			this.toggles.filter(':first').addClass('first').end().filter(':last').addClass('last');
			
			this.toggles.bind({
				expand : function () {
						
					var index = o.toggles.index(this);
					
					if (! $(this).hasClass('active')) {
						
						o.options.beforeExpand(index);
						$(this).addClass('active').next().slideDown({ 
							complete: function () { 
									$(this).addClass('open'); 
									o.options.afterExpand(index); 
							} 
						});
						
						if (! o.options.multiple) {
							// Close all open
							o.toggles.filter('.active').not(this).trigger('collapse');
						}
						
					}
				},
				collapse : function () {
					var index = o.toggles.index(this);
					
					if ( $(this).hasClass('active'))
					
						o.options.beforeCollapse(index); 
					
						$(this).removeClass('active').next().slideUp({ 
							complete: function () { 
								$(this).removeClass('open'); 
								o.options.afterCollapse(index); 
							} 
						});
				}
			}).next().hide();
			
			if (this.options.clickable) {
				this.toggles.bind({
					click : function () {
						var el = $(this);
						
						if (el.hasClass('active'))
							el.trigger('collapse');
						else {
							el.trigger('expand');
						}
					}
				});
			}
			
			if (this.options.defaultIndex > -1) {
				var el = this.toggles.eq(this.options.defaultIndex);
				el.trigger('expand');
			}
			
    },
		
		expand : function ( n ) {
			
			if (n >= 0) {
				this.toggles.eq(n).trigger('expand');
			} else
				this.toggles.trigger('expand');
			
		},
		collapse : function ( n ) { 
			
			if (n >= 0) {
				this.toggles.eq(n).trigger('collapse');
			} else
				this.toggles.trigger('collapse');
			
		},
		
		advance : function ( ) {
			
			if ( ! this.options.multiple ) {
				var index = this.toggles.index(this.toggles.filter('.active'));
				
				this.toggles.filter(':eq(' + (index+1) + ')').trigger('expand');
				this.toggles.filter(':eq(' + index + ')').trigger('collapse');
			}
			
		},

    // Use the _setOption method to respond to changes to options
    _setOption: function ( key, value ) {

			this.options[ key ] = value;
			
      // In jQuery UI 1.8, you have to manually invoke the _setOption method from the base widget
      $.Widget.prototype._setOption.apply( this, arguments );
			// For UI 1.9 the _super method can be used instead
			// this._super( "_setOption", key, value );

    },
 
    // Use the destroy method to clean up any modifications your widget has made to the DOM

    destroy: function () {
			
			this.toggles.removeClass('active').filter(':first').removeClass('first').end().filter(':last').removeClass('last').end().unbind('click').next().show();

      // In jQuery UI 1.8, you must invoke the destroy method from the base widget
      $.Widget.prototype.destroy.call( this );
			// In jQuery UI 1.9 and above, you would define _destroy instead of destroy and not call the base method
						
    }

  });

}( jQuery ) );

