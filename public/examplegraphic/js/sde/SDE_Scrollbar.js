// http://www.ogonek.net/mousewheel/jQuery_mousewheel_plugin.js

jQuery.fn.extend ( {
	mousewheel : function ( up , down , preventDefault ) {
		return this.hover ( function ( ) {
			jQuery.event.mousewheel.giveFocus ( this , up , down , preventDefault );
		} , function ( ) {
			jQuery.event.mousewheel.removeFocus ( this );
		} );
	} ,
	mousewheeldown : function ( fn , preventDefault ) {
		return this.mousewheel ( function ( ) {
		} , fn , preventDefault );
	} ,
	mousewheelup : function ( fn , preventDefault ) {
		return this.mousewheel ( fn , function ( ) {
		} , preventDefault );
	} ,
	unmousewheel : function ( ) {
		return this.each ( function ( ) {
			// jQuery( this ).unmouseover( ).unmouseout( );
			jQuery.event.mousewheel.removeFocus ( this );
		} );
	} ,
	unmousewheeldown : jQuery.fn.unmousewheel ,
	unmousewheelup : jQuery.fn.unmousewheel
} );

jQuery.event.mousewheel = {
	giveFocus : function ( el , up , down , preventDefault ) {
		if ( el._handleMousewheel )
			jQuery ( el ).unmousewheel ( );

		if ( preventDefault == window.undefined && down && down.constructor != Function ) {
			preventDefault = down;
			down = null;
		}

		el._handleMousewheel = function ( event ) {
			if ( !event )
				event = window.event;
			if ( preventDefault )
				if ( event.preventDefault )
					event.preventDefault ( );
				else
					event.returnValue = false;
			var delta = 0;
			if ( event.wheelDelta ) {
				delta = event.wheelDelta / 120;
				if ( window.opera )
					delta = -delta;
			}
			else
			if ( event.detail ) {
				delta = -event.detail / 3;
			}
			if ( up && (delta > 0 || !down) )
				up.apply ( el , [ event , delta ] );
			else
			if ( down && delta < 0 )
				down.apply ( el , [ event , delta ] );
		};

		if ( window.addEventListener )
			window.addEventListener ( 'DOMMouseScroll' , el._handleMousewheel , false );
		window.onmousewheel = document.onmousewheel = el._handleMousewheel;
	} ,

	removeFocus : function ( el ) {
		if ( !el._handleMousewheel )
			return;

		if ( window.removeEventListener )
			window.removeEventListener ( 'DOMMouseScroll' , el._handleMousewheel , false );
		window.onmousewheel = document.onmousewheel = null;
		el._handleMousewheel = null;
	}
};

var SDE_Scrollbar = function ( _data ) {
	var self = this;
	
	var isIE10 = navigator.userAgent.indexOf ( "MSIE 10" ) != -1;

	var scrollbarIsNeeded = true;

	var elementID = _data.id;
	var width = _data.width;
	var height = _data.height;
	var barColor = _data.color;
	var barWidth = _data.barWidth;

	var content , wrapper , bar;

	var smoothness = 20;
	var startScroll = 0;
	var currentScroll = 0;
	var minScroll;

	var wrapperID;

	var createScrollbar = function ( ) {
		wrapperID = 'scroller_' + elementID;
		var wrapperHTML = $ ( '<div id="' + wrapperID + '" class="scroller_wrapper">' );

		var barID = 'scroller_bar_' + elementID;
		var barHTML = $ ( '<div class="scroller_bar" id="' + barID + '"></div>' )

		content = $ ( '#' + elementID ).wrap ( wrapperHTML );
		content.addClass ( 'scroll_content' );
		content.width ( width - barWidth - 6 );
		wrapper = $ ( '#' + wrapperID );
		wrapper.append ( barHTML );
		bar = $ ( '#' + barID );

		wrapper.width ( width );
		wrapper.height ( height );

		self.update ( );
	}

 	this.changeWidthOfContent = function( _newWidth ){
		content.width( _newWidth - barWidth - 6 );
		wrapper.width( _newWidth );
	}
	
	this.changeHeightOfContent = function( _newHeight ){
		wrapper.height( _newHeight );
		height = _newHeight;
		self.update( );		
	}	 	
	
	this.update = function ( ) {
		realHeight = content.height ( );
		ratio = height / realHeight;
		minScroll = realHeight - height;


		bar.width ( barWidth );
		bar.height ( height * ratio );
		bar.css ( {
			'background-color' : barColor
		} );
		
		if ( isTouchDevice ( ) && isIE10) {
			wrapper.css({
				'overflow-y': 'auto'
			});
		}
		
		content.css ( {
			'top' : 0
		} );


		if ( ratio > 1 ) {
			bar.hide ( );
			scrollbarIsNeeded = false;
		}
		else {

			bar.show ( );
			bar.css ( {
				'top' : 0
			} );
			scrollbarIsNeeded = true;
		}

		if ( scrollbarIsNeeded ) {
			if ( isTouchDevice ( ) ) {
				if ( isIE10) {
					bar.hide();
					wrapper.css({
						'overflow-y': 'scroll'
					})
				}
				else
					touchScroll ( wrapperID );
			}
			else {
				makeBarDraggable ( );
				addMouseWheelEvent ( );
			}
		}
	}
	function addMouseWheelEvent ( ) {
		wrapper.mousewheel ( function ( objEvent , intDelta ) {
			if ( objEvent.preventDefault )
				objEvent.preventDefault ( );
			else
				objEvent.returnValue = false;

			if ( !scrollbarIsNeeded )
				return;

			var scroll = intDelta > 0 ? smoothness : -smoothness;
			if ( intDelta > 0 ) {

				if ( currentScroll + scroll >= startScroll ) {
					currentScroll = startScroll;
					content.css ( {
						top : 0
					} );
					bar.css ( {
						top : 0
					} );
				}
				else {
					currentScroll += scroll;
					content.css ( {
						top : currentScroll
					} );

					bar.css ( {
						top : -currentScroll * ratio
					} );
				}

			}
			else
			if ( intDelta < 0 ) {
				var tempScroll = -currentScroll + scroll;

				if ( currentScroll + minScroll <= smoothness ) {
					currentScroll = -minScroll;
					content.css ( {
						top : currentScroll
					} );
					bar.css ( {
						top : Math.round ( -currentScroll * ratio )
					} );
				}
				else {
					currentScroll += scroll;

					content.css ( {
						top : currentScroll
					} );
					bar.css ( {
						top : Math.round ( -currentScroll * ratio )
					} );
				}

			}
		} );
	}

	function makeBarDraggable ( ) {
		bar.draggable ( {
			axis : "y" ,
			containment : "parent" ,
			drag : function ( event , ui ) {

				var dif = -ui.position.top;
				currentScroll = dif / ratio;
				content.css ( {
					top : currentScroll
				} )
			}
		} );
	}

	function isTouchDevice ( ) {
		if ( window.navigator.msPointerEnabled )
			return true;
		try {
			document.createEvent ( "TouchEvent" );
			return true;
		}
		catch(e) {
			return false;
		}
	}

	function touchScroll ( id ) {
		if ( isTouchDevice ( ) ) {
			//if touch events exist...
			var el = document.getElementById ( id );
			var scrollStartPos = 0;
			el.addEventListener ( 'touchstart' , touchstart , false );
			el.addEventListener ( 'touchmove' , touchmove, false );

		}
	}

	function touchstart ( event ) {
		if ( scrollbarIsNeeded ) {
			scrollStartPos = this.scrollTop + event.touches [ 0 ].pageY;
		}
	}

	function touchmove ( event ) {
		if ( scrollbarIsNeeded ) {

			this.scrollTop = scrollStartPos - event.touches [ 0 ].pageY;
			event.preventDefault ( );
			bar.css ( {
				top : this.scrollTop + this.scrollTop * ratio + "px"
			} );
		}
	}

	createScrollbar ( );
};
