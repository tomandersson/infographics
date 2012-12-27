/*
 * Event-Target
 * Ermöglicht einer beliebigen Klasse ein Eventhandling 
 *
 * Sonja Kowarschick 
 * 2012
 */

var SDE_EventTarget = function()
{
	var eventListeners = new Array();

	this.addEventListener = function( _eventtype , _callbackfunction )
	{

		if ( typeof _eventtype != "string" )
		{
			console.log( "Eventtype is missing or not a string." );
		}

		if ( eventListeners[ _eventtype ] == null )
		{
			eventListeners[ _eventtype ] = new Array();
		}

		eventListeners[ _eventtype ].push( _callbackfunction );
	};

	this.fireEvent = function( _event , _data )
	{
		var eventObj = null;
		if ( typeof _event == "string" )
		{
			eventObj =
			{
				type : _event ,
				data : _data
			};
		}

		if ( ! eventObj.type )
		{
			ChartError.log( "Event object missing 'type' property." );
		}

		if ( eventListeners[ eventObj.type ] instanceof Array )
		{
			var listeners = eventListeners[ eventObj.type ];

			for ( var i = 0 ; i < listeners.length ; i++ )
			{
				listeners[ i ].call( this , eventObj );
			}
		}
	};

	this.removeEventListener = function( type , listener )
	{
		if ( eventListeners[ type ] instanceof Array )
		{
			var listeners = eventListeners[ type ];
			for ( var i = 0, len = listeners.length ; i < len ; i++ )
			{
				if ( listeners[ i ] === listener )
				{
					listeners.splice( i , 1 );
					break;
				}
			}
		}
	};

};
