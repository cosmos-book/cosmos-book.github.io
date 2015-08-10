function r(f){/in/.test(document.readyState)?setTimeout('r('+f+')',9):f()}

r(function(){

	var positions;
	
	function parseFile(d,attrs){


		// Data from JPL Horizons
		// Ephemeris Type [change] :  	OBSERVER
		// Target Body [change] :  	Solar System Barycenter [SSB] [0]
		// Observer Location [change] :  	Sun (body center) [500@10]
		// Time Span [change] :  	Start=1965-01-01, Stop=2065-01-01, Step=5 d
		// Table Settings [change] :  	QUANTITIES=18-21; date/time format=BOTH; angle format=DEG; range units=KM; CSV format=YES
		// Display/Output [change] :  	plain text
	
		positions = d.positions;
		
		drawIt();
	}

	$('.noscript').remove();

	// Load the files
	loadJSON('data/barycentre.json',parseFile,{});


	function drawIt(){
	
		var el = $('#holder');
	
		// Calculate values
		var w,h;
		h = $(window).height()-$('#header').outerHeight();
		w = h;
		el.html('').css({'width':w+'px','height':h+'px'});
		var solarsystem = Raphael("holder", w, h);
		$('#holder svg').attr({'id':'canvas'});
		var path = "M 0,0 ";
		var colour = '#fdcd00';
		var x,y;
		var scale = w/3e6;
		var prevdate = new Date('1970-01-01T00:00:00Z');
		var j = 0;
		var now = new Date();
		var atyear = now.getFullYear();

		
		// Draw space
		for(var i = 0; i < positions.length; i++,j++){
			x = (w/2) - scale*positions[i].r*Math.cos(Math.PI*positions[i].lon/180);
			y = (h/2) - scale*positions[i].r*Math.sin(Math.PI*positions[i].lon/180);
			path += ' '+(j > 0 ? 'L':'M')+x+','+y;
			// The Julian Date of the Unix Time epoch is 2440587.5
			var d = new Date((positions[i].jd-2440587.5)*86400000);
			var year = d.getFullYear();
			if(year > prevdate.getFullYear()){
				solarsystem.circle(x,y,2).attr({'fill':'#000000','stroke':0});	
				//var year = (positions[i].date.substr(0,4));
				if(year % 2 == 0) solarsystem.text(x+7,y,''+year).attr({'stroke':0,'fill':'#000000','text-anchor':'start'});
				if(year == atyear){
					// Draw Sun
					solarsystem.circle(x,y,696342*scale).attr({'fill':'#feee00','fill-opacity':1,'stroke':0});	
					// Draw radiative zone
					solarsystem.circle(x,y,0.7*696342*scale).attr({'fill':'#feee00','fill-opacity':0.3,'stroke':0});	
					// Draw core
					solarsystem.circle(x,y,0.25*696342*scale).attr({'fill':'#ffffff','fill-opacity':0.3,'stroke':0});	
				}
				prevdate = d;
			}
		}
	
		// Draw barycentre path
		solarsystem.path(path).attr({'stroke':colour,'stroke-width':1,'opacity':1});
	
		solarsystem.path('M'+(w/2)+','+(h/2)+' l-5,0 l10,0 l-5,0 l0,5 l0,-10 z').attr({'stroke':'black'})
	
		$('.loader').remove();
	}
});
