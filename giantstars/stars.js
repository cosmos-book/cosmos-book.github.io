r(function(){

	// Define array to hold stars
	var stars = new Array();

	// Read stars from table in the page
	$('#stars tr').each(function(i){
		var row = $(this);
		var a = row.find('.cite a');
		var cite = '';
		if(a.length==1) cite = a.attr('href');
		if(row.find('.name').text()) stars.push({'name':row.find('.name').text(),'size':parseFloat(row.find('.size').text()),'cite':cite});
	})
	// Hide table
	$('#stars').hide();

	var w = $(window).width();
	var c1 = new Colour(colours.yellow[0],'yellow');
	var c2 = new Colour(colours.red[0],'red');
	var scale = 12;
	var offset = 5;
	var html = '<ul class="stars">';
	// Draw biggest stars first to have the correct z-index
	for(var i = stars.length-1; i >= 0; i--){
		html += '<li class="star" title="'+stars[i].name+' / '+stars[i].size+' &times; the Sun" style="width:'+(stars[i].size*scale)+'px;height:'+(stars[i].size*scale)+'px;right:'+(w*0.25 - stars[i].size*scale/2)+'px;bottom:'+(scale*offset)+'px;background-color:rgb('+Math.round(c1.rgb[0] + (c2.rgb[0]-c1.rgb[0])*i/stars.length)+','+Math.round(c1.rgb[1] + (c2.rgb[1]-c1.rgb[1])*i/stars.length)+','+Math.round(c1.rgb[2] + (c2.rgb[2]-c1.rgb[2])*i/stars.length)+');">'+(stars[i].cite.indexOf('http')==0 ? '<a href="'+stars[i].cite+'"></a>':stars[i].cite)+'</li>';
	}
	html += '<li class="sun" title="Sun" style="width:'+scale+'px;height:'+scale+'px;background-color:'+colours.yellow[0]+';right:'+(w*0.25 - scale/2)+'px;bottom:'+(scale*(offset-1.25))+'px;"></li></ul>';
	$('#holder').append(html);


	function Colour(c,n){
		this.hex = c;
		this.rgb = [h2d(c.substring(1,3)),h2d(c.substring(3,5)),h2d(c.substring(5,7))];
		this.hsv = rgb2hsv(this.rgb[0],this.rgb[1],this.rgb[2]);
		this.colour = c;
		this.name = n;
	}

	function d2h(d) { return ((d < 16) ? "0" : "")+d.toString(16);}
	function h2d(h) {return parseInt(h,16);}
	/**
	 * Converts an RGB color value to HSV. Conversion formula
	 * adapted from http://en.wikipedia.org/wiki/HSV_color_space.
	 * Assumes r, g, and b are contained in the set [0, 255] and
	 * returns h, s, and v in the set [0, 1].
	 *
	 * @param   Number  r       The red color value
	 * @param   Number  g       The green color value
	 * @param   Number  b       The blue color value
	 * @return  Array           The HSV representation
	 */
	function rgb2hsv(r, g, b){
		r = r/255, g = g/255, b = b/255;
		var max = Math.max(r, g, b), min = Math.min(r, g, b);
		var h, s, v = max;
	
		var d = max - min;
		s = max == 0 ? 0 : d / max;
	
		if(max == min){
			h = 0; // achromatic
		}else{
			switch(max){
				case r: h = (g - b) / d + (g < b ? 6 : 0); break;
				case g: h = (b - r) / d + 2; break;
				case b: h = (r - g) / d + 4; break;
			}
			h /= 6;
		}
	
		return [h, s, v];
	}
	
	/**
	 * Converts an HSV color value to RGB. Conversion formula
	 * adapted from http://en.wikipedia.org/wiki/HSV_color_space.
	 * Assumes h, s, and v are contained in the set [0, 1] and
	 * returns r, g, and b in the set [0, 255].
	 *
	 * @param   Number  h       The hue
	 * @param   Number  s       The saturation
	 * @param   Number  v       The value
	 * @return  Array           The RGB representation
	 */
	function hsv2rgb(h, s, v){
		var r, g, b;
	
		var i = Math.floor(h * 6);
		var f = h * 6 - i;
		var p = v * (1 - s);
		var q = v * (1 - f * s);
		var t = v * (1 - (1 - f) * s);
	
		switch(i % 6){
			case 0: r = v, g = t, b = p; break;
			case 1: r = q, g = v, b = p; break;
			case 2: r = p, g = v, b = t; break;
			case 3: r = p, g = q, b = v; break;
			case 4: r = t, g = p, b = v; break;
			case 5: r = v, g = p, b = q; break;
		}
	
		return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
	}

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
	function rgb2hsl(r, g, b){
		r /= 255, g /= 255, b /= 255;
		var max = Math.max(r, g, b), min = Math.min(r, g, b);
		var h, s, l = (max + min) / 2;
	
		if(max == min){
			h = s = 0; // achromatic
		}else{
			var d = max - min;
			s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
			switch(max){
				case r: h = (g - b) / d + (g < b ? 6 : 0); break;
				case g: h = (b - r) / d + 2; break;
				case b: h = (r - g) / d + 4; break;
			}
			h /= 6;
		}
	
		return [h, s, l];
	}
	
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
	function hsl2rgb(h, s, l){
		var r, g, b;
	
		if(s == 0){
			r = g = b = l; // achromatic
		}else{
			function hue2rgb(p, q, t){
				if(t < 0) t += 1;
				if(t > 1) t -= 1;
				if(t < 1/6) return p + (q - p) * 6 * t;
				if(t < 1/2) return q;
				if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
				return p;
			}
	
			var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
			var p = 2 * l - q;
			r = hue2rgb(p, q, h + 1/3);
			g = hue2rgb(p, q, h);
			b = hue2rgb(p, q, h - 1/3);
		}
	
		return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
	}

});
