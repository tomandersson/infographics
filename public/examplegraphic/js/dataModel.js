/**
 * @author: Sonja Kowarschick <sonja.kowarschick@sueddeutsche.de>
 * @version: 13.08.2012
 *
 * Diese Datei beeinhaltet alle Daten-Models.
 */

function DataModel_Candidate ( data )
{
	var self = this;

	var nameArray = data.name.split( ' ' );

	self.id = data.id;

	self.name = data.name;
	self.headline = data.headline;
	self.text = data.text;
	self.department = data.department;
	self.counselors = new Array ( );
	
	self.circleImage = "img/grafics/candidate/circle/" + self.id + ".png";
	self.contentImage = "img/grafics/candidate/content/" + self.id  + ".png";
	self.iconInactive = "img/grafics/candidate/icon/" + self.id + ".png";
	self.iconActive = "img/grafics/candidate/icon/" + self.id + "_active.png";
	
	self.posX = data.pos.x + "px";
	self.posY = data.pos.y + "px";
	
	self.image = ko.computed( function ( )
	{
		return "url(img/grafics/candidate/circle/" + self.id + ".png)";
	} );

	self.imageContent = ko.computed( function ( )
	{
		return "url(img/grafics/candidate/content/" + self.id  + ".png)";
	} );
	
	self.imageIcon = ko.computed( function ( )
	{
		return "url(" + self.iconActive + ")";
	} );

}

function DataModel_Counselor ( data )
{
	var self = this;

	self.id = data.id;
	self.name = data.name;
	self.department = data.department;
	self.headline = data.headline;
	self.text = data.text;
	self.posX = data.pos.x + "px";
	self.posY = data.pos.y + "px";
	self.iconInactive = "img/grafics/councelor/icon/" + self.id + ".png";
	self.iconActive = "img/grafics/councelor/icon/" + self.id + "_active.png";
	self.contentImage = "img/grafics/councelor/content/" + self.id + ".png";
	
	self.imageIcon = ko.computed( function ( )
	{
		return "url(img/grafics/councelor/icon/" + self.id + ".png)";
	} );

	self.imageContent = ko.computed( function ( )
	{
		return "url(img/grafics/councelor/content/" + self.id + ".png)";
	} );
}