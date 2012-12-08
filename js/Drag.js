var Drag = function( element )
{
	this.startX = 0;
	this.startY = 0;

	element.addEventListener( "mousedown", this, false );
};

/**
 * functionality implemented after instantiation.
 *
 * @param x = number // x coordinate of drag event
 * @param y = number // y coordinate of drag event
 */
Drag.prototype.onStart = function ( x, y ) {};
Drag.prototype.onMove = function ( x, y ) {};
Drag.prototype.onStop = function ( x, y ) {};

Drag.prototype.handleEvent = function ( event ) {
	this['fon'+event.type](event);
};

Drag.prototype.fonmousedown = function ( e )
{
	e.preventDefault();

	this.startX = e.clientX;
	this.startY = e.clientY;

	this.onStart( this.startX, this.startY );

	document.addEventListener( "mousemove", this, false );
	document.addEventListener( "mouseup", this, false );
};

Drag.prototype.fonmousemove = function( e )
{
	this.onMove( e.clientX - this.startX, e.clientY - this.startY );
};

Drag.prototype.fonmouseup = function( e )
{
	this.onStop( e.clientX - this.startX, e.clientY - this.startY );

	document.removeEventListener( "mousemove", this );
	document.removeEventListener( "mouseup", this );
};