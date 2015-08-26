r(function(){

	// Configure
	var range = {'y':[-320,320] };
	var padd = {'left':0,'right':0,'top':20,'bottom':0};
	var el = $('#holder');
	var planets = ['Venus','Earth','Mars','Titan','Pluto','Jupiter','Saturn','Uranus','Neptune'];

	// Calculate values
	var w = el.width()-1;
	var dy = 12;
	var h = 600;
	var mid = {'x': w/2,'y':h/2};
	
	// Build our Raphael canvas
	var paper = Raphael("holder", w, h);
	$('#holder svg').attr('id','canvas');
	var svg = paper.set();
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
		if(t<0) return 'rgba(0,162,211,'+(t > -200 ? -t/200 : 1).toFixed(2)+')';
		else if(t>0) return 'rgba(240,64,49,'+(t < 400 ? t/400 : 1).toFixed(2)+')';
		return 'rgba(255,255,255,1)';
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

			if(atmos[p]){

				// Find the left edge of this column
				x = (dx*2*j+dx*0.5);

				// Make graded background
				grad = '';
				hassurface = true; // Does this object have a surface?
				for(var d = 0; d < atmos[p].data.length; d++){
					if(atmos[p].data[d].lower < 0) hassurface = false;
				}

				// Have we loaded an atmospheric profile?
				if(atmos[p].profile){

					// Create a starting stop
					var stops_p = [['rgba(255,255,255,0)',0]];
					var stops_t = [[getTemperatureColour(atmos[p].profile[atmos[p].profile.length-1].T),0]];

					// Loop over altitude data
					for(var k=atmos[p].profile.length-1; k >= 0; k--){
						if(atmos[p].profile[k].h < range.y[1]){

							// Use the log_10 of the pressure to determine the opacity
							op = (atmos[p].profile[k].P < 1000 ? (Math.log10(atmos[p].profile[k].P)+6)/9 : 1);

							// We can't have negative opacity
							if(op < 0) op = 0;

							// Get the percent up the atmospheric range
							y = 100*((range.y[1]-atmos[p].profile[k].h)/(range.y[1]-range.y[0]));

							// Add a colour stop
							stops_p.push(['rgba(255,255,255,'+op.toFixed(2)+')',y.toFixed(2)]);
							stops_t.push([getTemperatureColour(atmos[p].profile[k].T),y.toFixed(2)]);
						}
					}

					// Add end stops
					stops_p.push(['rgba(255,255,255,0)',(hassurface ? 50.0001 : 100)]);
					stops_t.push(['rgba(255,255,255,0)',(hassurface ? 50.0001 : 100)]);

					// Build the CSS for our stops
					grad_p = buildCSSGradient(stops_p);
					grad_t = buildCSSGradient(stops_t);

					// Add the HTML element to the DOM
					$('#holder').append('<div style="'+grad_p+';width: '+(dx*0.75)+'px;height:'+dh+'px;position: absolute; left:'+(x+dx*0.25)+'px;top:'+padd.top+'px;z-index:0;"></div>')
					$('#holder').append('<div style="'+grad_t+';width: '+(dx*0.25)+'px;height:'+dh+'px;position: absolute; left:'+x+'px;top:'+padd.top+'px;z-index:0;"></div>')
				}

				// Loop over the constituents
				for(var d = 0; d < atmos[p].data.length; d++){

					// Find the vertical position of the top and bottom of this layer
					y = padd.top + dh - (atmos[p].data[d].upper-range.y[0])*dy;
					y2 = ((atmos[p].data[d].upper-atmos[p].data[d].lower)*dy);

					// Have a minimum size so we can see it
					if(y2==0) y2 = 2;

					px = dx*0.05;
					c = getColour(atmos[p].data[d].name);

					if(atmos[p].data[d].feature.toLowerCase().indexOf('cloud layer') >= 0) paper.rect(x+dx*0.25,y,dx*0.75,y2).attr({'fill':c,'stroke':0,'opacity':0.5,'title':atmos[p].data[d].name})

					if(atmos[p].data[d].feature.indexOf('Boundary') == 0){
						paper.path('M'+(x-px)+','+(Math.round(y)+0.5)+'l'+(dx+2*px)+',0').attr({'stroke':'black','stroke-width':0.5,'stroke-dasharray':'- '})
						paper.text(x-px,y,atmos[p].data[d].name).attr({'text-anchor':'end','fill':'black','stroke':0})
					}
				}
				// Write the name of the planet
				paper.text(x+dx*0.5,8,p).attr({'text-anchor':'middle','fill':'black','stroke':0,'font-size':12})
			}
			j++;
		}

		$('.loader').remove();
		$('.noscript').remove();
	}


});

