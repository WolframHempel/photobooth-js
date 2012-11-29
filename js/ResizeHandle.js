var ResizeHandle = function( eContainer, maxWidth, maxHeight )
{
	this.setMax = function( width, height )
	{
		maxWidth = width;
		maxHeight = height;
	};

	this.getData = function()
	{
		return {
			x: left,
			y: top,
			width: width,
			height: height
		};
	};
	
	this.isActive = function()
	{
		return isVisible;
	};
	this.toggle = function()
	{
		if( isVisible === false )
		{
			element.style.opacity = 1;
			isVisible = true;
		}
		else
		{
			element.style.opacity = 0;
			isVisible = false;
		}
	};

	var left = 30,
		top = 30,
		width = 100,
		height = 100,
		tempLeft = 30,
		tempTop = 30,
		tempWidth = 100,
		tempHeight = 100,
		isVisible = false,
		element = document.createElement( 'div' );

	element.className = 'resizehandle';
	element.innerHTML = '<div class="handle"><div></div></div>';

	eContainer.appendChild( element );

	/**
	* Dragging the frame
	*/
	var eHandle = element.getElementsByTagName( "div" )[ 0 ];
	var oHandleDrag = new Drag( eHandle );

	oHandleDrag.onMove = function( x, y )
	{
		if( left + x + width < maxWidth && left + x > 0 )
		{
			tempLeft = left + x;
			element.style.left = tempLeft + "px";
		}
		if( top + y + height < maxHeight && top + y > 0 )
		{
			tempTop = top + y;
			element.style.top = tempTop + "px";
		}
	};

	oHandleDrag.onStop = function()
	{
		left = tempLeft;
		top = tempTop;
	};

	/**
	* Resizing the frame
	*/
	var eResizeHandle = element.getElementsByTagName( "div" )[ 1 ];
	eResizeHandle.addEventListener( "mousedown", fCancelBubble, false );
	var oResizeDrag = new Drag( eResizeHandle );

	oResizeDrag.onMove = function( x, y )
	{
		if( left + x + width < maxWidth && width + x > 18 )
		{
			tempWidth = width + x;
			element.style.width = tempWidth + "px";

		}
		if( top + y + height < maxHeight && height + y > 18 )
		{
			tempHeight = height + y;
			element.style.height = tempHeight + "px";
		}
	};

	oResizeDrag.onStop = function()
	{
		width = tempWidth;
		height = tempHeight;
	};
	
};