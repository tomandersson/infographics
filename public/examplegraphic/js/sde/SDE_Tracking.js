/*
######################################

	SDE_Tracker 
	2.0
	für SiteStat-Tracking in HTML-Infografiken 
	(c) 2012 - Martin Woitzik

######################################
*/

/******************************************************
 *
 * 	KONSTRUKTOR
 *  
 * 	@param
 * 	ressort 	TrackingCode zum jeweiligen Ressort 
 * 				(eine der statischen Variablen, siehe unten)
 *  thema 		Thema unter dem die Grafik läuft (z.B. USA-Wahl, Bundesliga, Euro-Krise, Energiewende etc.) ... siehe Hauptmenü auf sz.de
 *  titel 		Titel der Grafik
 *
 ******************************************************/
var SDE_Tracker = function( ressort, thema, titel )
{	
	var self = this;	
	//Definition der Variablen für SiteStat
	this.ressort = ressort;
	this.thema = thema;
	this.titel = titel; 	
	this.customer = "sueddeutsche";
	this.website ="sueddeutsche";
	this.countryISO = "de";
	
	// Track also in MSIE ?
	// if this leads to errors just set to false
	this.msieTrackingActive = true;
	
	/**
	 *	Tracking von INFOGRAFIKEN per SiteStat
	 * 
	 *	@param
	 *  suffix 		Weiterer Parameter, der an die URL angehängt wird um genauer tracken zu können, welches Element aufgerufen wird, z.B. ".click", ".click_element1" usw.
	 * 				Es muss immer ein "." an den Anfang des Tags gehängt werden!!
	 * 	ressort 	SZTrackingCode zum jeweiligen Ressort (eine der statischen Variablen, siehe unten) [optional]
	 *  thema 		Thema unter dem die Grafik läuft (z.B. USA-Wahl, Bundesliga, Euro-Krise, Energiewende etc.) ... siehe Hauptmenü auf sz.de [optional]
	 *  titel 		Titel der Grafik [optional]
	 */	  
	this.track = function( suffix, ressort, thema, titel )
	{
		if (suffix == null)		suffix = "";
		if (ressort == null)	ressort = this.ressort;
		if (thema == null)		thema = this.thema;		
		if (titel == null)		titel = this.titel;			

		// Füge TrackingCode zusammen:
		// nachrichten_<ressort>.thema.<name_des_themas>.media_infografik.<name_der_grafik>
		var code = ressort + this.convertSiteStatCode( thema ) + TrackingCode.SUFFIX_VIDEO + this.convertSiteStatCode( titel ) + suffix;
		 
		// Generiere Zufallszahl
		var randomNum = Math.round(Math.random()*99999);
		// Füge TrackingURL zusammen:
		var reqUrl = "http://"+this.countryISO+".sitestat.com/"+this.customer+"/"+this.website+"/s?"+code+"&ns_type=flash"+"&ns__t="+(new Date()).getTime()+"&r="+randomNum;
		// Öffne TrackingURL per ajax-Call
		var doTracking = true;
		if (!this.msieTrackingActive && $.browser.msie) 
			doTracking = false;		
		if (doTracking)
			$.ajax( {type:"GET", dataType:"text", url:reqUrl, success:this.ajaxSuccess, error:this.ajaxError} );
	};	

	/**
	 *	Tracking von VIDEOS per SiteStat
	 * 
	 *	@param
	 *  suffix 		Weiterer Parameter, der an die URL angehängt wird um genauer tracken zu können, welches Element aufgerufen wird, z.B. ".click", ".click_element1" usw.
	 * 				Es muss immer ein "." an den Anfang des Tags gehängt werden!!
	 * 	ressort 	SZTrackingCode zum jeweiligen Ressort (eine der statischen Variablen, siehe unten) [optional]
	 *  thema 		Thema unter dem die Grafik läuft (z.B. USA-Wahl, Bundesliga, Euro-Krise, Energiewende etc.) ... siehe Hauptmenü auf sz.de [optional]
	 *  titel 		Titel der Grafik [optional]
	 */	  
	this.trackVideo = function( suffix, ressort, thema, titel )
	{
		if (suffix == null)		suffix = "";
		if (ressort == null)	ressort = this.ressort;
		if (thema == null)		thema = this.thema;		
		if (titel == null)		titel = this.titel;			

		// Füge TrackingCode zusammen:
		// nachrichten_<ressort>.thema.<name_des_themas>.media_infografik.<name_der_grafik>
		var code = ressort + this.convertSiteStatCode( thema ) + TrackingCode.SUFFIX_VIDEO + this.convertSiteStatCode( titel ) + suffix;
		 
		// Generiere Zufallszahl
		var randomNum = Math.round(Math.random()*99999);
		// Füge TrackingURL zusammen:
		var reqUrl = "http://"+this.countryISO+".sitestat.com/"+this.customer+"/"+this.website+"/s?"+code+"&ns_type=flash"+"&ns__t="+(new Date()).getTime()+"&r="+randomNum;
		// Öffne TrackingURL per ajax-Call
		var doTracking = true;
		if (!this.msieTrackingActive && $.browser.msie) 
			doTracking = false;		
		if (doTracking)
			$.ajax( {type:"GET", dataType:"text", url:reqUrl, success:this.ajaxSuccess, error:this.ajaxError} );
	};	
	
	/**
	 *	Entfernt alle ungültigen Zeichen, aus einem Sitestat-Tracking-String
	 *	
	 *	z.B.: 	convertSiteStatCode("Ein Video über die Wiesn");
	 *	  =>	"Ein Video über die Wiesn" wird SiteStat-konform konvertiert => "Ein_Video_ueber_die_Wiesn"
	 */ 
	this.convertSiteStatCode =  function( code )
	{			
		// Leerzeichen durch "_" ersetzen
		code = code.replace( / /g, "_" );
		
		// Sonderzeichen ersetzen
		code = code.replace( /ä/g, "ae" );
		code = code.replace( /ö/g, "oe" );
		code = code.replace( /ü/g, "ue" );
		code = code.replace( /Ä/g, "Ae" );
		code = code.replace( /Ö/g, "Oe" );
		code = code.replace( /Ü/g, "Ue" );
		code = code.replace( /ß/g, "ss" );

		// ersetze alle "Nichtwortklassen" => siehe RegExp Zeichenklassen!
		code = code.replace( /\W/g, "" );
		
		return code;
	}	  
	
	this.ajaxSuccess = function(data, textStatus, jqXHR) 
	{
		// do nothing
	}
	
	this.ajaxError = function(jqXHR, textStatus, errorThrown)
	{
		// do nothing
	}
};



/******************************************************
 * 
 * 	TrackingCode
 *  alle fürs Tracking relevanten Sitestat-Ressort-Codes
 * 
 ******************************************************/
var TrackingCode = new Object();

TrackingCode.SUFFIX = ".media_infografiken.";
TrackingCode.SUFFIX_VIDEO = ".media_video.";

TrackingCode.AUTO = "nachrichten_auto.thema.";
TrackingCode.BAYERN = "nachrichten_bayern.thema.";
TrackingCode.BILDUNG = "nachrichten_bildung.thema.";
TrackingCode.DIGITAL = "nachrichten_digital.thema.";
TrackingCode.GELD = "nachrichten_geld.thema.";
TrackingCode.GESUNDHEIT = "nachrichten_gesundheit.thema.";
TrackingCode.KARRIERE = "nachrichten_karriere.thema.";
TrackingCode.KULTUR = "nachrichten_kultur.thema.";
TrackingCode.LEBENSTIL = "nachrichten_lebenstil.thema.";
TrackingCode.MEDIEN = "nachrichten_medien.thema.";
TrackingCode.MUENCHEN = "nachrichten_muenchen.thema.";
TrackingCode.PANORAMA = "nachrichten_panorama.thema.";
TrackingCode.POLITIK = "nachrichten_politik.thema.";
TrackingCode.REISE = "nachrichten_reise.thema.";
TrackingCode.SPORT = "nachrichten_sport.thema.";
TrackingCode.WIRTSCHAFT = "nachrichten_wirtschaft.thema.";
TrackingCode.WISSEN = "nachrichten_wissen.thema.";
