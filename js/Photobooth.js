Photobooth = function( container )
{
	//include Slider.js
	//in
	
	var hueOffset = 0,
		saturationOffset = 0,
		brightnessOffset = 0,
		pImageCallbacks = [],
		_width = container.offsetWidth,
		_height = container.offsetHeight;

	var fGetUserMedia =
	(
		navigator.getUserMedia ||
		navigator.webkitGetUserMedia ||
		navigator.mozGetUserMedia ||
		navigator.oGetUserMedia ||
		navigator.msieGetUserMedia ||
		false
	);

	var fGetAnimFrame =
	(
		window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.oRequestAnimationFrame ||
		window.msRequestAnimationFrame ||
		function( callback ){ window.setTimeout(callback, 1000 / 60);}
	);

	var c = function( n ){ return ePhotobooth.getElementsByClassName( n )[ 0 ]; };

	var ePhotobooth = document.createElement( "div" );
	ePhotobooth.className = "Photobooth";
	ePhotobooth.innerHTML = '<canvas></canvas><div class="warning notSupported">Sorry,Photobooth.js is not supported by your browser</div><div style="display:none"class="warning noWebcam">Please give Photobooth permission to use your Webcam. <span>Try again</span></div><ul><li title="hue"class="hue"></li><li title="saturation"class="saturation"></li><li title="brightness"class="brightness"></li><li title="crop"class="crop"></li><li title="take picture"class="trigger"></li></ul>';

	var eInput = document.createElement( "canvas" );
	var oInput = eInput.getContext( "2d" );

	var eOutput = ePhotobooth.getElementsByTagName( "canvas" )[ 0 ];
	var oOutput = eOutput.getContext( "2d" );

	var eVideo = document.createElement( "video" );
	eVideo.autoplay = true;
	
	var eNoWebcamWarning = c( "noWebcam" );
	eNoWebcamWarning.getElementsByTagName( "span" )[ 0 ].onclick = function(){fRequestWebcamAccess();};

	new Slider( c( "hue" ), function( value ){ hueOffset = value; });
	new Slider( c( "saturation" ), function( value ){ saturationOffset = value; });
	new Slider( c( "brightness" ), function( value ){ brightnessOffset = value; });
	
	this.isSupported = !! fGetUserMedia;

	this.resize = function( width, height )
	{
		_width = width;
		_height = height;
		ePhotobooth.style.width = container.offsetWidth + "px";
		ePhotobooth.style.height = container.offsetHeight + "px";
		eInput.width = container.offsetWidth;
		eInput.height = container.offsetHeight;
		eOutput.width = container.offsetWidth;
		eOutput.height = container.offsetHeight;
		eVideo.width = container.offsetWidth;
		eVideo.height = container.offsetHeight;
	};

	this.addImageCallback = function( callback )
	{
		pImageCallbacks.push( callback );
	};

	var fOnStream = function( oStream )
	{
		try{
			/**
			* Chrome
			*/
			eVideo.src = ( window.URL || window.webkitURL ).createObjectURL( oStream );
			fGetAnimFrame( fNextFrame );
		}
		catch( e )
		{
			/**
			* Firefox
			*/
			eVideo.mozSrcObject  =   oStream ;
			eVideo.addEventListener( "canplay", function(){ fGetAnimFrame( fNextFrame ); }, false );
			eVideo.play();
		}
	};

	var fOnStreamError = function()
	{
		eNoWebcamWarning.style.display = "block";
	};

	var fRequestWebcamAccess = function()
	{
		eNoWebcamWarning.style.display = "none";
		fGetUserMedia.call( navigator, {"video" : true }, fOnStream, fOnStreamError );
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
	var fRgbToHsl = function (r, g, b){
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

	var fNextFrame = function()
	{
		oInput.drawImage( eVideo, 0, 0, _width, _height );
		var oImgData = oInput.getImageData( 0, 0, _width, _height );
		var pData = oImgData.data;
		var pHSB, pRGB;

		for( var i = 0; i < pData.length; i += 4 )
		{
			pHSB = fRgbToHsl( pData[ i ], pData[ i + 1 ], pData[ i + 2 ] );
			pRGB = fHslToRgb(
				fWrap( pHSB[ 0 ] + hueOffset ),
				fCap( pHSB[ 1 ] + saturationOffset ),
				fCap( pHSB[ 2 ] + brightnessOffset )
			);
			pData[ i ] = pRGB[ 0 ];
			pData[ i + 1 ] = pRGB[ 1 ];
			pData[ i + 2 ] = pRGB[ 2 ];
		}

		oOutput.putImageData( oImgData, 0, 0 );

		fGetAnimFrame( fNextFrame );
	};


	if( !fGetUserMedia )
	{
		c( "notSupported" )[ 0 ].style.display = "block";
	}

	/**
	* Startup
	*/
	this.resize( _width, _height );
	container.appendChild( ePhotobooth );
	fGetAnimFrame( fRequestWebcamAccess );
};