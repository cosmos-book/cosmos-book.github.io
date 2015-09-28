r(function(){

	// Configure
	var range = {'y':[-320,320] };
	var padd = {'left':0,'right':0,'top':20,'bottom':0};
	var el = $('#holder');
	var planets = ['Venus','Earth','Mars','Titan','Pluto','Jupiter','Saturn','Uranus','Neptune'];
	var pstops = [0.001,1,1000,10000,100000];

	// Calculate values
	var w = el.width()-1;
	var dy = 12;
	var h = 600;
	var mid = {'x': w/2,'y':h/2};
	
	var loaded = 0;
	var atmos = {};

	function parseFile(d,attrs){
		if(!atmos[attrs.planet]) atmos[attrs.planet] = {};
		if(attrs.profile){
			// Altitude (km),Pressure (mbar),Temperature (K)
			atmos[attrs.planet].profile = CSV2JSON(d,[
				{'name':'h','format':'number'},
				{'name':'P','format':'number'},
				{'name':'T','format':'number'}
			]);
		}else{
			atmos[attrs.planet].data = CSV2JSON(d,[
				{'name':'lower','format':'number'},
				{'name':'upper','format':'number'},
				{'name':'feature','format':'string'},
				{'name':'name','format':'string'},
				{'name':'T','format':'number'},
				{'name':'P','format':'number'},
				{'name':'colour','format':'string'}
			]);
		}
		loaded++;
		// If we've loaded all the files we can draw everything
		if(loaded==planets.length*2) drawIt();
	}

	// Load the constituent files
	for(var p = 0; p < planets.length; p++) loadCSV('data/'+planets[p].toLowerCase()+'.csv',parseFile,{'planet':planets[p]});

	// Load the pressure and temperature profiles
	for(var p = 0; p < planets.length; p++) loadCSV('data/'+planets[p].toLowerCase()+'_profile.csv',parseFile,{'planet':planets[p],'profile':true});

	// Return a colour determined by the atmospheric layer's label
	function getColour(n){
		if(n.toLowerCase().indexOf('haze') >= 0) return '#b6c727';
		if(n.toLowerCase().indexOf('water') >= 0) return '#48c7e9';
		if(n.toLowerCase().indexOf('co2') >= 0) return '#57b7aa';
		if(n.toLowerCase().indexOf('methane') >= 0) return '#02a24b';
		if(n.toLowerCase().indexOf('ammonia') >= 0) return '#f6881f';
		if(n.toLowerCase().indexOf('ammonium') >= 0) return '#7d71b4';
		if(n.toLowerCase().indexOf('clouds') >= 0) return '#662d8f';
		if(n.toLowerCase().indexOf('ozone') >= 0) return '#a8dbd5';
		return 'black';
	}
	
	
	// Build the cross-browser CSS for a linear gradient
	// Inputs:
	//   stops - array of [color,percent]
	function buildCSSGradient(stops){

		var s = "";
		var c = "";
		var css = "";
		for(var i = 0; i < stops.length;i++){
			if(s != "") s += ',';
			s += ''+stops[i][0]+' '+stops[i][1]+'%';
			if(c != "") c += ',';
			c += 'color-stop('+stops[i][1]+'%,'+stops[i][0]+')';
		}
		css = 'background: '+stops[0][0]+';'; // Old browsers
		css += 'background: -moz-linear-gradient(top, '+s+');';	// FF3.6+
		css += 'background: -webkit-gradient(linear, left top, left bottom, '+c+');';	// Chrome,Safari4+
		css += 'background: -webkit-linear-gradient(top, '+s+');';	 // Chrome10+,Safari5.1+
		css += 'background: -o-linear-gradient(top, '+s+');';	 // Opera 11.10+
		css += 'background: -ms-linear-gradient(top, '+s+');';	 // IE10+
		css += 'background: linear-gradient(to bottom, '+s+');';	 // W3C
		css += 'filter: progid:DXImageTransform.Microsoft.gradient( startColorstr=\''+stops[0][0]+'\', endColorstr=\''+stops[stops.length-1][0]+'\',GradientType=0 );'; // IE6-9
		return css;		
	}
	
	function getTemperatureColour(t){
		t -= 273.15;
		var v;
		var hot = [0,162,211];
		var cold = [240,64,49];
		if(t < 0){
			v = (t > -200 ? -t/200 : 1);
			return 'rgba('+Math.round(255-(255-hot[0])*v)+','+Math.round(255-(255-hot[1])*v)+','+Math.round(255-(255-hot[2])*v)+',1)';
		}else if(t > 0){
			v = (t > 400 ? 1 : t/400);
			return 'rgba('+Math.round(255-(255-cold[0])*v)+','+Math.round(255-(255-cold[1])*v)+','+Math.round(255-(255-cold[2])*v)+',1)';
		}else if (t==0) return 'rgba(255,255,255,1)';
	}
	
	function getPressureColour(p){
		var op = (p < 1000 ? (Math.log10(p)+6)/9 : 1);

		// We can't have negative opacity
		if(op < 0) op = 0;
		
		return 'rgba(255,255,255,'+op.toFixed(2)+')'
	}
	
	function formatPressure(p){
		var unit = 'mbar';
		if(p >= 1000){
			p /= 1000;
			unit = 'bar';
		}else if(p < 0.1){
			p *= 1000;
			unit = '&micro;bar';
		}
		return '<span class="number">'+(p)+'</span>'+unit;
	}
	// Draw the result
	function drawIt(){
	
		// Get reduced vertical height once padding is taken into account
		dh = (h - padd.top - padd.bottom);
		
		// Work out the width of a column
		dx = w/(planets.length*2);
		
		// Work out the scaling for the vertical direction px/km
		dy = dh/(range.y[1]-range.y[0]);

		var j = 0;
		for(var i = 0; i < planets.length; i++){

			p = planets[i];
			var planet = '';
			var keyitems = {};
			var pres = '';

			if(atmos[p]){

				// Make graded background
				grad = '';
				hassurface = true; // Does this object have a surface?
				for(var d = 0; d < atmos[p].data.length; d++){
					if(atmos[p].data[d].lower < 0) hassurface = false;
				}

				// Have we loaded an atmospheric profile?
				if(atmos[p].profile){

					// Find closest point in profile to top of our displayed atmosphere
					var top = 0;
					for(var k=0; k <atmos[p].profile.length; k++){
						if(atmos[p].profile[k].h > range.y[1]){
							top = k;
							break;
						}
					}

					// Create a starting stop
					var stops_p = [[getPressureColour(atmos[p].profile[top].P),0]];
					var stops_t = [[getTemperatureColour(atmos[p].profile[top].T),0]];

					// Loop over altitude data
					for(var k=atmos[p].profile.length-1; k >= 0; k--){
						if(atmos[p].profile[k].h < range.y[1]){

							// Get the percent up the atmospheric range
							y = 100*((range.y[1]-atmos[p].profile[k].h)/(range.y[1]-range.y[0]));

							// Add a colour stop
							stops_p.push([getPressureColour(atmos[p].profile[k].P),y.toFixed(2)]);
							stops_t.push([getTemperatureColour(atmos[p].profile[k].T),y.toFixed(2)]);
						}
					}

					for(var pr = 0; pr < pstops.length; pr++){
					
						var near = new Array(atmos[p].profile.length);
						for(var k=0; k < atmos[p].profile.length; k++) near[k] = Math.abs(atmos[p].profile[k].P - pstops[pr]);
						function indexMin(a){ return a.indexOf(Math.min.apply(Math, a)); }
						var pi = indexMin(near);
						if(pi && pi >=0){
							// Get the percent up the atmospheric range
							y = 100*((range.y[1]-atmos[p].profile[indexMin(near)].h)/(range.y[1]-range.y[0]));
							pres += '<div class="pressurelabel label" style="top:'+y+'%;">'+formatPressure(pstops[pr])+'</div>';
						}
					}


					// Add end stops
					stops_p.push(['rgba(255,255,255,0)',(hassurface ? 50.0001 : 100)]);
					stops_t.push(['rgba(255,255,255,0)',(hassurface ? 50.0001 : 100)]);

					// Build the CSS for our stops
					grad_p = buildCSSGradient(stops_p);
					grad_t = buildCSSGradient(stops_t);

					// Add the HTML element to the DOM
					planet += '<div class="temp" style="'+grad_t+';"></div>';
					planet += '<div class="pres" style="'+grad_p+';"></div>';
				}

				var layers = '';
				var labels = (pres ? pres : '');
				// Loop over the constituents
				for(var d = 0; d < atmos[p].data.length; d++){

					// Deal with lower and upper bounds being the wrong way around
					if(atmos[p].data[d].upper < atmos[p].data[d].lower){
						tmp = atmos[p].data[d].lower;
						atmos[p].data[d].lower = atmos[p].data[d].upper;
						atmos[p].data[d].upper = tmp;
					}

					// Find the vertical position of the top and bottom of this layer
					y = (100-100*(atmos[p].data[d].upper-range.y[0])/(range.y[1]-range.y[0]));
					y2 = (100*(atmos[p].data[d].upper-atmos[p].data[d].lower)/(range.y[1]-range.y[0]))

					// Have a minimum size so we can see it
					if(y2==0) y2 = 2+'px';
					else y2 = y2+'%';

					c = getColour(atmos[p].data[d].name);

					if(atmos[p].data[d].feature.toLowerCase().indexOf('cloud layer') >= 0){
						layers += '<div class="layer" style="background-color:'+c+';top:'+y+'%;height:'+y2+';" title="'+atmos[p].data[d].name+'"></div>';
						keyitems[atmos[p].data[d].name] = c;
					}

					if(atmos[p].data[d].feature.indexOf('Boundary') == 0){
						labels += '<div class="label" style="top:'+y+'%;"><div class="name" title="'+atmos[p].data[d].name+'">'+atmos[p].data[d].name+'</div><div class="dottedline"></div></div>';
					}
				}

				planet += '<div class="atmo">'+layers+'</div>';
				planet += '<div class="labl">'+labels+'</div>';
			}
			var key = '';
			var n;
			for(ki in keyitems){
				n = ki.replace("O2","O<sub>2</sub>");
				key = '<li class="keyitem"><span class="keycircle" style="background-color:'+keyitems[ki]+';"></span><span class="keylabel">'+n+'</span></li>'+key;
			}
			$('#holder').append('<div class="planet"><h2 class="header">'+p+'</h2><div class="planet_inner">'+planet+'</div><div class="key"><div class="curly-brace"><div class="left brace"></div><div class="right brace"></div></div>'+(key!="" ? '<ul class="key">'+key+'</ul>':'')+'</div></div>');
			j++;
		}

		$('.loader').remove();
		$('.noscript').remove();
	}


});

