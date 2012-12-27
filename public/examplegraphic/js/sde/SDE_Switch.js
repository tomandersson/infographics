/*******************************************************************************
 * SDE-Switch Klasse Erzeugt eine Liste von Elementen, von denen jeweils eines
 * angeklickt werden kann
 *
 * Styling der Switches erfolgt über die CSS-Datei switch.css, die individuell
 * angepasst werden kann.
 *
 * 2012 - Sonja Kowarschick
 ******************************************************************************/

var SDE_SwitchBox = function ( _id, _parent, _switchClickedFunction, _switchDeaktivateFunction )
{

	// Super-Klasse aufrufen
	SDE_EventTarget.call( this );

	var self = this;

	var activeSwitch = 0;
	this.switches = new Object ( );
	this.id = _id + "_";

	this.switchEvent = "switchWasClicked";
	this.switchEventDeaktivate = "switchWasDeaktivated";
	var deactivate = true;

	/**
	 *
	 * @param _id : Eindeutiger Name der Switch-Box
	 * @param _parent : Div-Element, dem die Switch-Box hinzugefügt werden soll
	 * @param _switchClickedFunction :
	 *            Callback-Funktion, die ausgeführt wird, sobald ein Klick auf
	 *            einen "Button" erfolgt
	 */
	var initialize = function ( )
	{
		$( '<div id="' + _id + '"><ul></ul></div>' ).appendTo( _parent );
		self.box = $( 'div#' + _id + ' ul' );
		self.box.addClass( 'switch' );

		if (/MSIE 7.0/i.test( navigator.userAgent ))
		{
			self.box.addClass( 'msie7' );
		}

		self.addEventListener( self.switchEvent, _switchClickedFunction );
		if (_switchDeaktivateFunction != null)
			self.addEventListener( self.switchEventDeaktivate, _switchDeaktivateFunction );
		else
			deactivate = false;
	}

	this.cancleDeactivation = function ( )
	{
		deactivate = false;
	}
	/**
	 * Fügt der Switch-Box ein neues Element hinzu
	 *
	 * @param _id :
	 *            Eindeutiger Name des Switch-Elementes zur Identifikation
	 * @param _name :
	 *            Name, der auf dem Button angezeigt wird
	 */
	this.addSwitchElement = function ( _id, _name )
	{
		var switchElement = $( '<li>' + _name + '</li>' ).appendTo( this.box );
		switchElement.attr( 'id', this.id + _id );
		switchElement.addClass( 'switchelement' );
		switchElement.addClass( 'inactive' );

		switchElement.click( switchClicked );

		this.switches [ this.id + _id ] = switchElement;
	}
	/**
	 * Setzt einen Switch anhand seines Index aktiv und teilt dies dem User
	 * durch ein Event mit.
	 *
	 * @param _index
	 */
	this.setSwitchActiveById = function ( _id )
	{
		var id = this.id + _id;
		$.each( this.switches, function ( index, element )
		{
			element.removeClass( 'active' );
			element.addClass( 'inactive' );
		} );

		var index = null;
		var deactivateIcon = true;
		if (activeSwitch != id)
		{

			this.switches [ id ].removeClass( 'inactive' );
			this.switches [ id ].addClass( 'active' );
			activeSwitch = id;

			self.fireEvent( this.switchEvent,
			{
				element : this.switches [ id ],
				id : _id
			} );
		}
		else
		{
			if (deactivate)
			{
				self.fireEvent( this.switchEventDeaktivate,
				{
					element : this.switches [ id ],
					id : _id
				} );

				activeSwitch = null;

			}
			else
			{
				this.switches [ id ].removeClass( 'inactive' );
				this.switches [ id ].addClass( 'active' );
				activeSwitch = id;
				deactivateIcon = false;
			}

		}
	}
	
	
	
	this.setSwitchActiveByNumber = function ( _number )
	{

		var id = $(this.box.find('li')[_number]).attr('id');
		
		$.each( this.switches, function ( index, element )
		{
			element.removeClass( 'active' );
			element.addClass( 'inactive' );
		} );

		var index = null;
		var deactivateIcon = true;
		if (activeSwitch != id)
		{

			this.switches [ id ].removeClass( 'inactive' );
			this.switches [ id ].addClass( 'active' );
			activeSwitch = id;

			self.fireEvent( this.switchEvent,
			{
				element : this.switches [ id ],
				id : id.replace(_id+"_", '')
			} );
		}
		else
		{
			if (deactivate)
			{
				self.fireEvent( this.switchEventDeaktivate,
				{
					element : this.switches [ id ],
					id : id.replace(_id+"_", '')
				} );

				activeSwitch = null;

			}
			else
			{
				this.switches [ id ].removeClass( 'inactive' );
				this.switches [ id ].addClass( 'active' );
				activeSwitch = id;
				deactivateIcon = false;
			}

		}
		// if (deactivateIcon)
		// {

		// }
	}
	
	
	
	
	/**
	 * Event, das ausgeführt wird, sobald ein Element geklickt wurde Setzt das
	 * Element aktiv
	 *
	 * @param event
	 */
	var switchClicked = function ( event )
	{
		var id = $( event.currentTarget ).attr( 'id' );

		var switchIdLength = self.id.length;
		id = id.substr( switchIdLength, id.length );
		self.setSwitchActiveById( id );
	}
	
	this.getActiveSwitchWithNumber = function(){
	    console.log($("#" + activeSwitch).index());
		return $("#" + activeSwitch).index();
	}
	
	this.getActiveSwitchWithId = function(){
		return activeSwitch;
	}
	
	initialize( );
};

// Super-Klasse definieren
SDE_SwitchBox.prototype = new SDE_EventTarget;
