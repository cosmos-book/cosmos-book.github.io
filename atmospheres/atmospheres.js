r(function(){

	// Configure
	var range = {'y':[-320,320], 'px':800 };
	var padd = {'left':0,'right':0,'top':20,'bottom':0};
	var el = $('#holder');
	var planets = ['Venus','Earth','Mars','Titan','Pluto','Jupiter','Saturn','Uranus','Neptune'];
	var pstops = [0.001,1,1000,10000,100000];
	
	// Add style
	var ypx = Math.round(100*range.px/(range.y[1]-range.y[0]));
	var offs = ypx*(range.y[1]%100)/100;
	$('<style type="text/css">.planet .planet_inner { min-height: '+range.px+'px; } .planet_inner { background-image: linear-gradient(white .14em, transparent .14em); background-position: 0 '+offs+'px; background-size: 100% '+ypx+'px; box-sizing: border-box; }</style>').appendTo("head");

	$('#holder').before('<div class="form"><label>Set all altitudes:</label><button class="button" data-type="altitude" data-value="0">0 km</button><label>Set all pressures:</label><button class="button" data-value="0.001" data-type="pressure">1 &micro;bar</button><button class="button" data-value="1" data-type="pressure">1 mbar</button><button class="button" data-value="10" data-type="pressure">10 mbar</button><button class="button" data-value="100" data-type="pressure">100 mbar</button><button class="button" data-value="1000" data-type="pressure">1 bar</button><button class="button" data-value="10000" data-type="pressure">10 bar</button><button class="button" data-value="100000" data-type="pressure">100 bar</button></div>');

	// Add events for control buttons - set the height or pressure for all planets
	$(document).on('click','button.button',function(){
		// Which property are we using?
		var t = $(this).attr('data-type');
		// What is the value?
		var v = parseFloat($(this).attr('data-value'));
		if(!v) v = 0;
		for(var i = 0; i < planets.length; i++){
			if(t == "altitude") setHeight(planets[i],v);
			else if(t=="pressure") setPressure(planets[i],v);
		}
	});
	
	var dragging = false;
	$(document).on('click','.clickable,.handle',function(e){
		dragging = true;
		setFromY($(this).closest('.planet').attr('data-name'),e.pageY-$(this).closest('.planet_inner').offset().top-1);
		dragging = false;
	}).on('mousedown','.clickable,.handle',function(e){
		dragging = true;
		return false;	// Don't allow text selection when starting to drag on the handle
	}).on('mouseup','.clickable,.handle',function(e){
		dragging = false;
	}).on('mousemove','.clickable,.handle',function(e){
		if(dragging) setFromY($(this).closest('.planet').attr('data-name'),e.pageY-$(this).closest('.planet_inner').offset().top-1);
	})
	function setFromY(p,y){ setHeight(p,range.y[0] + (range.y[1]-range.y[0])*(1 - y/range.px)); }

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
	
	function formatPressure(v){
		var unit = 'mbar';
		if(v >= 990){
			v /= 1000;
			unit = 'bar';
		}else if(v < 0.1){
			v *= 1000;
			unit = '&micro;bar';
			if(v < 0.1){
				v *= 1000;
				unit = 'nbar';
			}
		}
		v = v.toFixed(1);
		v = v.replace(".0","");
		return '<span class="number">'+(v)+'</span>'+unit;
	}
	function formatTemperature(v){
		var unit = 'K';
		v = v.toFixed(1);
		v = v.replace(".0","");
		return '<span class="number">'+(v)+'</span>'+unit;
	}
	function formatAltitude(v){
		var unit = 'km';
		v = Math.round(v);
		return '<span class="number">'+(v)+'</span>'+unit;
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
				atmos[p].hassurface = hassurface;

				planet += '<div class="atmosphere">';

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

					/*for(var pr = 0; pr < pstops.length; pr++){
					
						var near = new Array(atmos[p].profile.length);
						for(var k=0; k < atmos[p].profile.length; k++) near[k] = Math.abs(atmos[p].profile[k].P - pstops[pr]);
						function indexMin(a,tol){
							var mn = Math.min.apply(Math, a);
							if(!tol) tol = mn;
							return (mn <= tol) ? a.indexOf(mn) : -1;
						}
						var pi = indexMin(near,pstops[pr]*0.1);	// Find the index of the closest value within 10%.
						if(pi >= 0){
							// Get the percent up the atmospheric range
							y = 100*((range.y[1]-atmos[p].profile[indexMin(near)].h)/(range.y[1]-range.y[0]));
							pres += '<div class="pressurelabel label" style="top:'+y+'%;">'+formatPressure(pstops[pr])+'</div>';
						}
					}
					*/


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
					y2 = (100*(atmos[p].data[d].upper-atmos[p].data[d].lower)/(range.y[1]-range.y[0]));

					// Have a minimum size so we can see it
					if(y2==0) y2 = 2+'px';
					else y2 = y2+'%';

					c = getColour(atmos[p].data[d].name);

					if(atmos[p].data[d].feature.toLowerCase().indexOf('cloud layer') >= 0 && atmos[p].data[d].lower < range.y[1] && atmos[p].data[d].upper > range.y[0]){
						layers += '<div class="layer" style="background-color:'+c+';top:'+y+'%;height:'+y2+';" title="'+atmos[p].data[d].name+'"></div>';
						keyitems[atmos[p].data[d].name] = c;
					}

					if(atmos[p].data[d].feature.indexOf('Boundary') == 0 && atmos[p].data[d].name != "Surface" && atmos[p].data[d].lower < range.y[1] && atmos[p].data[d].upper > range.y[0]){
						labels += '<div class="label" style="top:'+y+'%;"><div class="name" title="'+atmos[p].data[d].name+'">'+atmos[p].data[d].name+'</div><div class="dottedline '+atmos[p].data[d].name+'"></div></div>';
					}
				}

				planet += '<div class="atmo">'+layers+'</div>';
				planet += '</div>';	// Close the container of the atmosphere
				planet += '<div class="labl">'+labels+'</div>';
				planet += '<div class="indicator"><div class="values"><div class="values_inner"></div></div><div class="handle"></div></div>';
				planet += '<div class="clickable"></div>';	// Add the clickable (empty) layer on top
			}
			var key = '';
			var n;
			for(ki in keyitems){
				n = ki.replace("O2","O<sub>2</sub>");
				key = '<li class="keyitem"><span class="keycircle" style="background-color:'+keyitems[ki]+';"></span><span class="keylabel">'+n+'</span></li>'+key;
			}
			$('#holder').append('<div class="planet" data-name="'+p+'"><h2 class="header">'+p+'</h2><div class="planet_inner">'+planet+'</div><div class="key"><div class="curly-brace"><div class="left brace"></div><div class="right brace"></div></div>'+(key!="" ? '<ul class="key">'+key+'</ul>':'')+'</div></div>');
			j++;

			// Set the label position to an altitude of 0km
			setHeight(p,0);
		}

		$('.loader').remove();
		$('.noscript').remove();
		
	}

	// For the specified planet, p, and an altitude we return formatted
	// strings for altitude (h), pressure (P) and temperature (T)
	function getValues(p,altitude){
		var k = 0;
		for(k=0; k < atmos[p].profile.length; k++){
			if(atmos[p].profile[k].h > altitude){
				k--;
				break;
			}
			if(atmos[p].profile[k].h == altitude) break;
		}
		var delta = 0;
		var dP = 0;
		var dT = 0;
		if(k < atmos[p].profile.length-1 && k >= 0){
			delta = (altitude-atmos[p].profile[k].h)/(atmos[p].profile[k+1].h-atmos[p].profile[k].h)
			dP = (atmos[p].profile[k+1].P - atmos[p].profile[k].P)*delta;
			dT = (atmos[p].profile[k+1].T - atmos[p].profile[k].T)*delta
		}else{
			if(k > atmos[p].profile.length-1) k = atmos[p].profile.length - 1;
			if(k < 0) k = 0;
		}
		return {'h':formatAltitude(altitude),'P':formatPressure(atmos[p].profile[k].P + dP),'T':formatTemperature(atmos[p].profile[k].T + dT)};
	}
	
	// Set the label position for planet, p, by the pressure (mbar)
	function setPressure(p,pressure){
		var altitude = 0;
		var limited = false;
		for(var k=1; k < atmos[p].profile.length; k++){
			if(pressure >= atmos[p].profile[k].P){
				delta = (pressure - atmos[p].profile[k-1].P)/(atmos[p].profile[k].P - atmos[p].profile[k-1].P);
				altitude = atmos[p].profile[k-1].h + (atmos[p].profile[k].h - atmos[p].profile[k-1].h)*delta;
				break;
			}
		}
		// If we can't find such a low pressure we use the maximum height
		if(k == atmos[p].profile.length){
			altitude = atmos[p].profile[atmos[p].profile.length-1].h;
			limited = true;
		}

		// Now we have the altitude we position the indicator
		setHeight(p,altitude,limited);
	}

	// Set the label position for planet, p, by the altitude
	// Also pass in a flag to say if we are limiting the altitude
	function setHeight(p,altitude,limited){

		// If we have a surface we limit the altitude
		if(atmos[p].hassurface && altitude < 0){
			altitude = 0;
			limited = true;
		}

		// Don't drop off the bottom of our displayed range
		if(altitude < range.y[0]){
			altitude = range.y[0];
			limited = true;
		}
		// Don't drop off the top of our range
		if(altitude > range.y[1]){
			altitude = range.y[1];
			limited = true;
		}

		var el = $('.planet[data-name='+p+']');
		var i = el.find('.indicator');
		i.css({'top':100*(range.y[1]-altitude)/(range.y[1]-range.y[0])+'%'});

		// If we've limited the altitude we add a CSS class
		if(limited) i.addClass('limited');
		else i.removeClass('limited');

		var v = getValues(p,altitude);
		el.find('.values_inner').html(v.h+'<br />'+v.P+'<br />'+v.T);
	}

});

