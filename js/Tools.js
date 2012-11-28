var fCancelBubble = function( e )
{
	e.stopPropagation(); 
	e.cancelBubble=true;
};