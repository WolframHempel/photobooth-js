var hueOffset = 0, // -0.5 to 0.5
	saturationOffset = 0, // -0.5 to 0.5
	brightnessOffset = 0, // -0.5 to 0.5
	segmentX = 0,
	segmentY = 0;



self.onmessage = function( e )
{
	if( e.data.type === "setParams" )
	{
		hueOffset = e.data.hueOffset;
		saturationOffset = e.data.saturationOffset;
		brightnessOffset = e.data.brightnessOffset;
		segmentX = e.data.segmentX;
		segmentY = e.data.segmentY;
	}
	else
	{
		fProcess( e.data );
	}
};


/**
 * Converts an RGB color value to HSL. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes r, g, and b are contained in the set [0, 255] and
 * returns h, s, and l in the set [0, 1].
 *
 * @param   Number  r       The red color value
 * @param   Number  g       The green color value
 * @param   Number  b       The blue color value
 * @return  Array           The HSL representation
 */
var fRgbToHsl = function (r, g, b)
{
	r /= 255, g /= 255, b /= 255;
	var max = Math.max(r, g, b), min = Math.min(r, g, b);
	var h, s, l = (max + min) / 2;

	if(max == min)
	{
		h = s = 0; // achromatic
	}
	else
	{
		var d = max - min;
		s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
		switch(max)
		{
			case r: h = (g - b) / d + (g < b ? 6 : 0); break;
			case g: h = (b - r) / d + 2; break;
			case b: h = (r - g) / d + 4; break;
		}
		h /= 6;
	}

	return [h, s, l];
};

var fHue2rgb = function (p, q, t)
{
	if(t < 0) t += 1;
	if(t > 1) t -= 1;
	if(t < 1/6) return p + (q - p) * 6 * t;
	if(t < 1/2) return q;
	if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
	return p;
};

/**
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes h, s, and l are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * @param   Number  h       The hue
 * @param   Number  s       The saturation
 * @param   Number  l       The lightness
 * @return  Array           The RGB representation
 */
var fHslToRgb = function(h, s, l)
{
	var r, g, b;

	if(s === 0)
	{
		r = g = b = l; // achromatic
	}
	else
	{
		var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
		var p = 2 * l - q;
		r = fHue2rgb(p, q, h + 1/3);
		g = fHue2rgb(p, q, h);
		b = fHue2rgb(p, q, h - 1/3);
	}

	return [r * 255, g * 255, b * 255];
};

var fWrap = function( v )
{
	if( v > 1 ) return v - 1;
	if( v < 0 ) return 1 + v;
	return v;
};

var fCap = function( v )
{
	if( v > 1 ) return 1;
	if( v < 0 ) return 0;
	return v;
};

var fProcess = function( oImageData )
{

	var pHSB, pRGB;

	for( var i = 0; i < oImageData.data.length; i += 4 )
	{
		pHSB = fRgbToHsl( oImageData.data[ i ], oImageData.data[ i + 1 ], oImageData.data[ i + 2 ] );

		pRGB = fHslToRgb(
			fWrap( pHSB[ 0 ] + hueOffset ),
			fCap( pHSB[ 1 ] + saturationOffset ),
			fCap( pHSB[ 2 ] + brightnessOffset )
		);

		oImageData.data[ i ] = pRGB[ 0 ];
		oImageData.data[ i + 1 ] = pRGB[ 1 ];
		oImageData.data[ i + 2 ] = pRGB[ 2 ];
	}

	self.postMessage({
		x: segmentX,
		y: segmentY,
		imageData: oImageData
	});
};
