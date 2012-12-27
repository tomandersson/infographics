/**
 * @author: Sonja Kowarschick <sonja.kowarschick@sueddeutsche.de>
 * @version: 10.08.2012 Haupt-Datei des Skripts.
 */

// ///////////////////////////////////////////////////////////////
// Globale Variablen - Start
// ///////////////////////////////////////////////////////////////

var tracker;

var dm;

var viewModel;
var candidates = new Array ( );

var legend, legendArray;
var switchBox;
var activeCouncelor = null;
var isliveModus = false;
var infos_common;
var infos_person;
var scrollbar;

// ///////////////////////////////////////////////////////////////
// Globale Variablen - Ende
// ///////////////////////////////////////////////////////////////

/**
 * Decodes HTML-Entities from strings 
 */
function htmlDecode(value) {
   return (typeof value === 'undefined') ? '' : $('<div/>').html(value).text();
}



var agentContainsString = function ( _string )
{
	var agent = navigator.userAgent.toLowerCase( );

	if (agent.indexOf( _string.toLowerCase( ) ) > -1)
		return true;

	return false;
};

/**
 * Initialisierung
 */
$( document ).ready( function ( )
{
	
	tracker = new SDE_Tracker( TrackingCode.POLITIK, "Wahlkampf", "MerkelsVertraute");    
		tracker.track();
	if (agentContainsString( "ipad" ))
	{
		$( 'head' ).append( '<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=1, minimum-scale=1, maximum-scale=1">' );
		$( 'body' ).bind( 'touchstart', preventDoubleTab );
	}


	scrollbar = new SDE_Scrollbar (
	{
		id : 'info',
		width : 350,
		height : 595,
		color : '#eee',
		barWidth : 10
	} );
	

	switchBox = new SDE_SwitchBox ( 'navi_switch', '#navi', switchClicked );
	legend = new SDE_Legend ( );

	legendArray = new Array ( );

	viewModel = new ViewModel ( );
	ko.applyBindings( viewModel );

	dm = new SDE_DatenManager_Spreadsheet ( );
	
	if (isliveModus)
	   dm.loadDataFromSpreadsheet( key, worksheet_common, null, loadingCommonDataReady );
	else
	   dm.loadDataFromJSON(infos_common, loadingCommonDataReady, 2);

} );

function loadingCommonDataReady ( event )
{
	var data = event.data;

	data.each( function ( row, rowIndex )
	{
		var tabsText = row [ 'Tabs' ];
		var tabsId = row [ 'TabId' ];
		var headline = row [ 'Ueberschrift' ];
		var legend_headline = row [ 'Legenden-Ueberschirft' ];
		var legend_text = row [ 'Legenden-Text' ];


		// Tabs
		if (tabsText != null && tabsId != null)
		{
			var id = 'tab' + tabsId;
			console.log('id:', id)
			switchBox.addSwitchElement( id, tabsText );
		}

		// Headline
		if (headline != null)
		{
			viewModel.headline( headline );
		}

		// Legend
		if (legend_headline != null && legend_text != null)
		{
			legendArray.push( "<strong>" + legend_headline + "</strong>: " + legend_text )
		}

		// Verarbeiten der Daten ist fertig;
		if (rowIndex == data.length - 1)
		{
			lastStepsBeforeStart_common( );
		}

	} );

}

function lastStepsBeforeStart_common ( )
{
	legend.createLegend( '#infografics', 'left', 600, legendArray );
	
	if (isliveModus)
       dm.loadDataFromSpreadsheet( key, worksheet_merkel, null, loadingMerkelDataReady);
    else
       dm.loadDataFromJSON(infos_person, loadingMerkelDataReady, 0);
	
}

function loadingMerkelDataReady ( event )
{
	var data = event.data;
	var candidate;
	data.each( function ( row, rowIndex )
	{
		handleRowData( row, rowIndex, 0 );

        if (rowIndex == data.length - 1)
        {
            lastStepsBeforeStart( );
        }
	} );
	dm.loadDataFromSpreadsheet( key, worksheet_steinbrueck, null, loadingSteinDataReady);

}

function handleRowData ( _row, _rowIndex, _candidateCounter )
{
	var row_data =
	{
		id : _row [ 'ID' ],
		name : _row [ 'Name' ],
		department : _row [ 'Funktion' ],
		headline : _row [ 'Ueberschrift' ],
		text : _row [ 'Text' ],
		pos : new Object (
		{
			x : _row [ 'Position X' ],
			y : _row [ 'Position Y' ]
		} )
	}
	var person;
	if (_rowIndex == 0)
	{
		person = new DataModel_Candidate ( row_data );
		candidates.push( person );

		preloadImages( person.circleImage );
		preloadImages( person.contentImage );
	}
	else
	{
		person = new DataModel_Counselor ( row_data );
		candidates [ _candidateCounter ].counselors.push( person );
		preloadImages( person.contentImage );
	}

	preloadImages( person.iconInactive );
	preloadImages( person.iconActive );
}

function preloadImages ( _src )
{
	var img = new Image ( );
	img.onload = function ( )
	{
	};
	img.src = _src;
}

function loadingSteinDataReady ( event )
{
	var data = event.data;
	
	var candidate;
	data.each( function ( row, rowIndex )
	{
		handleRowData( row, rowIndex, 1 );
		
		if (rowIndex == data.length - 1)
        {
            lastStepsBeforeStart( );
        }

	} );
}

function lastStepsBeforeStart ( )
{
	viewModel.candidates( candidates );
	switchBox.setSwitchActiveByNumber( 0 );

	$( '#loadingScreen' ).hide( );

}

function switchClicked ( event )
{
	var id = event.data.id.replace( 'tab', '' ).toLowerCase( );
	activateCandidate( );

	if (activeCouncelor != null)
		deactivateIcon( $( '#' + activeCouncelor ) );

	activeCouncelor = null;

	$( '.candidate' ).hide( );
	$( '#' + id ).show( );

}

function setContent ( _personData )
{
	viewModel.text_headline( _personData.headline );
	$('#text').html( _personData.text );
	viewModel.image( _personData.imageContent( ) );
	scrollbar.update();
	
}

function activatePerson ( _personData )
{
	activateIcon( $( '#' + _personData.id ) );
	setContent( _personData );
}

function deactivatePerson ( _personData )
{
	activateIcon( $( '#' + _personData.id ) );
	setContent( _personData );
}

function activateIcon ( icon )
{
	var text = icon.find( '.counselorText' );
	var flag = $( icon ).find( '.counselorTextBox' );
	var image = $( icon ).find( '.counselorImageBox' );

	text.show();

	flag.stop( ).animate(
	{
		'left' : '0px'
	} );

	activateImage( image );
}

function deactivateIcon ( icon )
{
	var text = icon.find( '.counselorText' );
	var flag = icon.find( '.counselorTextBox' );
	var image = icon.find( '.counselorImageBox' );
	

	flag.stop( ).animate(
	{
		'left' : '-100%'
	}, 300, function(){
		text.hide();
	} );

	deactivateImage( image );
}

function activateImage ( image )
{
	var bg = image.css( 'background-image' );

	if (!/_active.png/g.test( bg ))
	{
		image.css(
		{
			'background-image' : bg.replace( /.png/g, "_active.png" )
		} );
	}
}

function deactivateImage ( image )
{
	var bg = image.css( 'background-image' );
	if (/_active.png/g.test( bg ))
	{
		image.css(
		{
			'background-image' : bg.replace( /_active.png/g, ".png" )
		} );
	}
}

function activateCandidate ( )
{
    console.log(switchBox);
	var activeCandidate = switchBox.getActiveSwitchWithNumber( );
	
	console.log(candidates, activeCandidate);
	var image = $( '#' + candidates [ activeCandidate ].id + " .candidateImage" );
	activateImage( image );

	setContent( candidates [ activeCandidate ] );
}

function deactivateCandidate ( )
{
	var activeCandidate = switchBox.getActiveSwitchWithNumber( );
	var image = $( '#' + candidates [ activeCandidate ].id + " .candidateImage" );
	deactivateImage( image );
}

/*
 * Funktion, die entscheidet, ob es sich um einen Doppelklick handelt, falls ja,
 * wird das Zoomen verhindert.
 */
var preventDoubleTab = function ( e )
{
	var currentTouch = e.timeStamp;
	var lastTouch = $( this ).data( 'lastTouch' ) || currentTouch;

	var timeDif = currentTouch - lastTouch;
	var touchLength = e.originalEvent.touches.length;

	// Letzten Touch auf den Aktuellen setzen
	$( this ).data( 'lastTouch', currentTouch );

	if (!timeDif || timeDif > 500 || (touchLength > 1 && agentContainsString( "ipad" )))
		return;

	e.preventDefault( );

	$( this ).trigger( 'click' ).trigger( 'click' );
}

