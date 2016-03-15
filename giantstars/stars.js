r(function(){

	// Define array to hold stars
	var stars = new Array();
	var spectral = {"O5": "#9bb0ff","O6": "#a2b8ff","O7": "#9db1ff","O8": "#9db1ff","O9": "#9ab2ff","O9.5": "#a4baff","B0": "#9cb2ff","B0.5": "#a7bcff","B1": "#a0b6ff","B2": "#a0b4ff","B3": "#a5b9ff","B4": "#a4b8ff","B5": "#aabfff","B6": "#acbdff","B7": "#adbfff","B8": "#b1c3ff","B9": "#b5c6ff","A0": "#b9c9ff","A1": "#b5c7ff","A2": "#bbcbff","A3": "#bfcfff","A5": "#cad7ff","A6": "#c7d4ff","A7": "#c8d5ff","A8": "#d5deff","A9": "#dbe0ff","F0": "#e0e5ff","F2": "#ecefff","F4": "#e0e2ff","F5": "#f8f7ff","F6": "#f4f1ff","F7": "#f6f3ff","F8": "#fff7fc","F9": "#fff7fc","G0": "#fff8fc","G1": "#fff7f8","G2": "#fff5f2","G4": "#fff1e5","G5": "#fff4ea","G6": "#fff4eb","G7": "#fff4eb","G8": "#ffedde","G9": "#ffefdd","K0": "#ffeedd","K1": "#ffe0bc","K2": "#ffe3c4","K3": "#ffdec3","K4": "#ffd8b5","K5": "#ffd2a1","K7": "#ffc78e","K8": "#ffd1ae","M0": "#ffc38b","M1": "#ffcc8e","M2": "#ffc483","M3": "#ffce81","M4": "#ffc97f","M5": "#ffcc6f","M6": "#ffc370","M8": "#ffc66d","B1": "#9db4ff","B2": "#9fb3ff","B3": "#a6bcff","B6": "#afc2ff","B7": "#aabdff","B9": "#b4c5ff","A0": "#b3c5ff","A3": "#becdff","A4": "#c3d2ff","A5": "#d4dcff","A7": "#c0cfff","A9": "#e0e3ff","F0": "#dae0ff","F2": "#e3e6ff","F3": "#e3e6ff","F5": "#f1efff","F7": "#f0efff","F8": "#fffcfd","G0": "#fff8f5","G2": "#fff4f2","G3": "#ffeee2","G4": "#fff5ee","G5": "#ffebd5","G6": "#fff2ea","G7": "#ffe7cd","G8": "#ffe9d3","K0": "#ffe1bd","K1": "#ffd8ab","K2": "#ffe5ca","K3": "#ffdba7","O7": "#9eb1ff","O8": "#9db2ff","O9": "#9eb1ff","B0": "#9eb1ff","B1": "#9eb1ff","B2": "#9fb4ff","B3": "#a3bbff","B5": "#a8bdff","B7": "#abbfff","B9": "#b2c3ff","A0": "#bccdff","A3": "#bdcbff","A5": "#cad7ff","A6": "#d1dbff","A7": "#d2dbff","A8": "#d1dbff","A9": "#d1dbff","F0": "#d5deff","F2": "#f1f1ff","F4": "#f1f0ff","F5": "#f2f0ff","F6": "#f1f0ff","F7": "#f1f0ff","G0": "#fff2e9","G1": "#fff3e9","G2": "#fff3e9","G3": "#fff3e9","G4": "#fff3e9","G5": "#ffecd3","G6": "#ffecd7","G8": "#ffe7c7","G9": "#ffe7c4","K0": "#ffe3be","K1": "#ffdfb5","K2": "#ffddaf","K3": "#ffd8a7","K4": "#ffd392","K5": "#ffcc8a","K7": "#ffd08e","M0": "#ffcb84","M1": "#ffc879","M2": "#ffc676","M3": "#ffc877","M4": "#ffce7f","M5": "#ffc57c","M6": "#ffb279","M7": "#ffa561","M8": "#ffa761","M9": "#ffe99a","B2": "#a5c0ff","B5": "#afc3ff","F0": "#cbd9ff","F2": "#e5e9ff","G5": "#ffebcb","M3": "#ffc977","O9": "#a4b9ff","B0": "#a1bdff","B1": "#a8c1ff","B2": "#b1c4ff","B3": "#afc2ff","B4": "#bbcbff","B5": "#b3caff","B6": "#bfcfff","B7": "#c3d1ff","B8": "#b6ceff","B9": "#ccd8ff","A0": "#bbceff","A1": "#d6dfff","A2": "#c7d6ff","A5": "#dfe5ff","F0": "#cad7ff","F2": "#f4f3ff","F5": "#dbe1ff","F8": "#fffcf7","G0": "#ffefdb","G2": "#ffeccd","G3": "#ffe7cb","G5": "#ffe6b7","G8": "#ffdca7","K0": "#ffddb5","K1": "#ffdcb1","K2": "#ffd387","K3": "#ffcc80","K4": "#ffc976","K5": "#ffd19a","M0": "#ffcc8f","M1": "#ffca8a","M2": "#ffc168","M3": "#ffc076","M4": "#ffb968","N": "#ff9d00"};

	// Read stars from table in the page
	$('#stars tr').each(function(i){
		var row = $(this);
		var a = row.find('.cite a');
		var cite = '';
		if(a.length==1) cite = a.attr('href');
		if(row.find('.name').text()){
			var c = row.find('.spectral').text().match(/^[A-Z][0-9]?/);
			var colour = (spectral[c[0]]) ? spectral[c[0]] : '#ffffff';
			stars.push({'name':row.find('.name').text(),'size':parseFloat(row.find('.size').text()),'cite':cite,'spectal':row.find('.spectral').text(),'spec':colour});
		}
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
	html += '<li class="sun" title="Sun" style="width:'+scale+'px;height:'+scale+'px;background-color:'+colours.yellow[0]+';right:'+(w*0.25 - scale/2)+'px;bottom:'+(scale*(offset-1.25))+'px;"><span class="label">Sun</span></li></ul>';
	$('#holder').append(html);
	var msg = ['Switch back to the colours used in the book.','Switch to more realistic colours for the stars.'];
	$('#holder p').append('<a href="#" class="togglecolour" style="margin-left: 0.25em;">'+msg[1]+'</a>');
	$('.togglecolour').on('click',function(){
		var real = ($(this).html()==msg[0]);
		$(this).html(real ? msg[1] : msg[0]);
		toggleStarColours(!real);
	});
	function toggleStarColours(real){
		for(var i = stars.length-1; i >= 0; i--){
			var colour = (real ? stars[i].spec : 'rgb('+Math.round(c1.rgb[0] + (c2.rgb[0]-c1.rgb[0])*i/stars.length)+','+Math.round(c1.rgb[1] + (c2.rgb[1]-c1.rgb[1])*i/stars.length)+','+Math.round(c1.rgb[2] + (c2.rgb[2]-c1.rgb[2])*i/stars.length)+')' );
			console.log($('.stars li.star:eq('+(stars.length-i-1)+')').css('background-color'),stars[i].spec,colour)
			$('.stars li.star:eq('+(stars.length-i-1)+')').css({'background-color':colour});
		}
	}

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
