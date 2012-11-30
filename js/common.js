// JavaScript Document

// Set form validation messages
$.extend($.validator.messages, {
		required: "Invalid",
		email: "Email Address Invalid"
});

$.validator.setDefaults({
	errorElement: "strong",
	onfocusout: function(element) { $(element).valid(); },
	onclick: function(element) { $(element).valid(); },
	showErrors: function(errorMap, errorList) {
		for ( var i = 0; this.errorList[i]; i++ ) {
			var error = this.errorList[i];
			$(error.element).parent().find('em').hide();
		}
		this.defaultShowErrors();
	},
	unhighlight: function(element, errorClass, validClass) {
		$(element).removeClass(errorClass).addClass(validClass);
		$(element).parent().find('em').css('display', 'inline');
	}
});

jQuery.validator.addClassRules({
	creditcard : { 
		creditcard: true,
		minlength: 16,
		maxlength: 16
	}
});

function convert(src, dst)
{
    var orig = document.getElementById( src ).value;
    var conv = document.getElementById( dst );

    var s = orig;

    // Codes can be found here:
    // http://en.wikipedia.org/wiki/Windows-1252#Codepage_layout
    s = s.replace( /\u2018|\u2019|\u201A|\uFFFD/g, "'" );
    s = s.replace( /\u201c|\u201d|\u201e/g, '"' );
    s = s.replace( /\u02C6/g, '^' );
    s = s.replace( /\u2039/g, '<' );
    s = s.replace( /\u203A/g, '>' );
    s = s.replace( /\u2013/g, '-' );
    s = s.replace( /\u2014/g, '--' );
    s = s.replace( /\u2026/g, '...' );
    s = s.replace( /\u00A9/g, '(c)' );
    s = s.replace( /\u00AE/g, '(r)' );
    s = s.replace( /\u2122/g, 'TM' );
    s = s.replace( /\u00BC/g, '1/4' );
    s = s.replace( /\u00BD/g, '1/2' );
    s = s.replace( /\u00BE/g, '3/4' );
    s = s.replace(/[\u02DC|\u00A0]/g, " ");

    conv.innerHTML = s;
    conv.focus();
    conv.select();
}

$(function() {
					 
	// ADD CLASSES FOR STYLING
	$('ul li:last-child').addClass('last');
	$('table.list tbody tr td:last-child').addClass('last-child');
	$('table.list tbody tr:last-child').addClass('last-child');
	$('table.list tbody tr:nth-child(even)').addClass('even');
	$('table.list tbody tr:nth-child(odd)').addClass('odd');

	// ADD SWIPE TO CAROUSEL
	if (typeof TouchEvent != "undefined")
		$('#feature').swipe('.back','.forward');

	$('#primary-nav').navigation();
	
	// FILTER INPUT
	$('#contact-message').focusout(function (e){
		var o = $(this);
		var s = o.val();
		o.val(s.replace(/[^a-zA-Z 0-9]+/g, ''));
	});
	
	// ELLIPSE LONG TEXT
	$('.ellipse').ellipse();
	$('.max100').ellipse({ maxWidth : 100 });
	$('.chars10').ellipse({ maxChars : 10 });

	// Validate form when triggered by the corresponding class
	$("form.validate").each(function() {
		$(this).validate({ ignore: ":hidden" });
	});
	
	// Initialize collapsible menus
	$('.collapsible').collapsibleMenu({ multiple: false });
	
	// Initialize toggles
	$('.toggle').toggle();
	
	// Initialize tabs
	$('.tabs').simpleTabs({
		beforeChange : function (index) {
			// alert(index);
		}
	});
	
	// Initialize and establish links/triggers to components
	$('.overlay-trigger').overlay({ close: function () { return confirm("Are you sure?"); } });
	$('.tooltip-trigger').tooltip();
	
	// Initialise homepage carousel
	/*
	$('.infinite-carousel').carousel({ speed : 7500, infinite : true });
	*/
	
	// Submit links
	$('.submit-link').each(function () {
		$(this).click(function () {
			$(this).parents('form').submit();
			return false;
		});
	});		
	
});
