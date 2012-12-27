/**
 * @author: Sonja Kowarschick <sonja.kowarschick@sueddeutsche.de>
 * @version: 13.08.2012
 *
 * Diese Datei beeinhaltet das Model für Knockout.
 */

function ViewModel ( )
{
	var self = this;
	self.headline = ko.observable( );
	self.candidates = ko.observableArray( );

	self.text = ko.observable( );
	self.image = ko.observable( );
	self.teaser = ko.observable( );
	self.text_headline = ko.observable( );

	self.iconClick = function ( data, event )
	{
		if (activeCouncelor != data.id)
		{
			if (activeCouncelor != null)
				deactivateIcon( $( '#' + activeCouncelor ) );

			deactivateCandidate( );

			activeCouncelor = data.id;
			activatePerson( data );
			tracker.track();
		}
		else
		{
			deactivateIcon( $( event.currentTarget ) );
			activateCandidate( );
			activeCouncelor = null;
		}

};

self.candiateClick = function ( data, event )
{
    console.log('data= ',  $( event.currentTarget ));
	var x = event.clientX - $( event.currentTarget ).offset( ).left
	var y = event.clientY - $( event.currentTarget ).offset( ).top
	var cx = $( event.currentTarget ).width( ) / 2;
	var cy = $( event.currentTarget ).height( ) / 2;
	

	var d = Math.sqrt( Math.pow( cx - x, 2 ) + Math.pow( cy - y, 2 ) );

	if (($( event.target ).hasClass( 'candidate' ) || $( event.target ).hasClass( 'candidateImage' )) && d <= $( event.currentTarget ).width( ) / 2)
	{
		if (activeCouncelor != null)
			deactivateIcon( $( '#' + activeCouncelor ) );

		activateCandidate( );
		activeCouncelor = null;
		
		tracker.track( ".click" );
	}
};
}