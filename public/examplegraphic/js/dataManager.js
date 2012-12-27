/**
 * @author: Sonja Kowarschick <sonja.kowarschick@sueddeutsche.de>
 * @version: 10.08.2012
 *
 * Klasse zum Laden von Daten mittels Miso.js
 */

var SDE_DatenManager_Spreadsheet = function ( )
{

    // Super-Klasse aufrufen
    SDE_EventTarget.call( this );

    var self = this;

    this.loadDataFromSpreadsheet = function ( _key, _sheet, _json, _callback )
    {
        new SDE_DatenManager_Loader_Online ( _key, _sheet, _json, _callback );
    }

    this.loadDataFromJSON = function ( _json, _callback, index )
    {
        new SDE_DatenManager_Loader_Offline( _json, _callback, index );
    }
};

// Super-Klasse definieren
SDE_DatenManager_Spreadsheet.prototype = new SDE_EventTarget;

var SDE_DatenManager_Loader_Online = function ( _key, _sheet, _json, _callback )
{
    // Super-Klasse aufrufen
    SDE_EventTarget.call( this );

    var self = this;

    var loadingReadyEvent = 'loadingReady';

    if (_callback != null)
        self.addEventListener( loadingReadyEvent, _callback );

    var miso = new Miso.Dataset (
    {
        importer : Miso.Importers.GoogleSpreadsheet,
        parser : Miso.Parsers.GoogleSpreadsheet,
        key : _key,
        worksheet : _sheet
    } );

    miso.fetch(
    {
        success : function ( )
        {
            self.fireEvent( loadingReadyEvent, this );

            if (_callback != null)
                self.removeEventListener( loadingReadyEvent, _callback );
        },
        error : function ( e )
        {
            if (_json != null)
                new SDE_DatenManager_Loader_Offline( _json, _callback );
            else
                console.log("Es ist beim Laden ein Fehler aufgetreten, oder die JSON-Datei ist null. (",  e, ")" );
        }
    } );

}
// Super-Klasse definieren
SDE_DatenManager_Loader_Online.prototype = new SDE_EventTarget;

var SDE_DatenManager_Loader_Offline = function ( _json, _callback, index )
{
    // Super-Klasse aufrufen
    SDE_EventTarget.call( this );

    var self = this;

    var loadingReadyEvent = 'loadingReady';

    if (_callback != null)
        self.addEventListener( loadingReadyEvent, _callback );

    
    getJSONData( "http://192.168.0.112:3000/doc", loadMisoData );

    function loadMisoData ( _data )
    {
        // self.fireEvent( loadingReadyEvent, );
        var miso = new Miso.Dataset({data: _data[index]});
        miso.fetch(
        {
            success : function ( )
            {
                self.fireEvent( loadingReadyEvent, this );
                self.removeEventListener( loadingReadyEvent, _callback );
            },
            error : function ( e )
            {
                console.log( e );
            }
        } );
    }

    function getJSONData ( url, func )
    {
        $.getJSON( url, function ( data )
        {
            func( data )
        } );
    }
}
// Super-Klasse definieren
SDE_DatenManager_Loader_Offline.prototype = new SDE_EventTarget;

