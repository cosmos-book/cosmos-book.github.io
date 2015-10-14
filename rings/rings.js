r(function(){

	loadJSON('data/planets.json',drawIt);

	var range = 230000;	// Maximum extent in km
	var scale = 100/range;
	var planets;
	
	function drawIt(data){

		planets = data.planets;
		var radius,dR,op;

		for(var p = 0; p < planets.length; p++){
			$('#holder').append('<div class="table-row" id="'+planets[p].name+'">'+planets[p].name+'</div>');
		}
		
		// Build each planet		
		for(var p = 0; p < planets.length; p++){
			var html = '<div class="system" data-name="'+planets[p].name+'"><div class="clickable">';
			
			html += '<div class="planet solid" style="width:'+(planets[p].diameter*scale)+'%;"></div>';
			for(var r = 0; r < planets[p].rings.length; r++){
				radius = planets[p].rings[r].distance[0]*scale;
				dR = (planets[p].rings[r].distance[1]-planets[p].rings[r].distance[0])*scale;
				if(radius + dR > 100) dR = 100-radius;
				op = (planets[p].rings[r].opacity ? planets[p].rings[r].opacity: 1);
				
				html += '<div class="ring solid" style="left:'+radius+'%;width:'+dR+'%;opacity:'+op+';" title="'+planets[p].rings[r].name+'"></div>';

				if(planets[p].rings[r].gaps){
					for(var g = 0; g < planets[p].rings[r].gaps.length; g++){
						rgap = scale * ((planets[p].rings[r].gaps[g].distance.length==2) ? planets[p].rings[r].gaps[g].distance[0] : planets[p].rings[r].gaps[g].distance);
						dRgap = scale * ((planets[p].rings[r].gaps[g].distance.length==2) ? planets[p].rings[r].gaps[g].distance[1]-planets[p].rings[r].gaps[g].distance[0] : planets[p].rings[r].gaps[g].width);
	
						html += '<div class="gap" style="left:'+rgap+'%;width:'+dRgap+'%;;" title="'+planets[p].rings[r].gaps[g].name+'"></div>';
					}
				}

			}
			html += '</div><div class="indicator"><div class="handle"></div><div class="values"></div></div></div>';
			$('#'+planets[p].name).html(html);

			setDistance(planets[p].name,0);

		}

		setDistance('Jupiter',100000);
		setDistance('Saturn',138000);
		setDistance('Uranus',40000);
		setDistance('Neptune',55000);

		return;

	}

	// Set the label position for planet, p, by the radial distance, d (km)
	function setDistance(planet,d){

		var rgap,dRgap;
		var el = $('#'+planet);
		var i = el.find('.indicator');
		var w = el.outerWidth();
		var dpx = d*(w/range);
		i.css({'left':(scale*d)+'%'});

		// Which planet is this?
		for(var p = 0; p < planets.length; p++){
			if(planets[p].name == planet) break;
		}

		var name = '';
		
		if(planets[p].diameter > d) name += ' (planet)'
		for(var r = 0; r < planets[p].rings.length; r++){
			rname = planets[p].rings[r].name.replace(/_([^\s]+)/,function(i,a){ return '<sub>'+a+'</sub>'; });
			if(planets[p].rings[r].distance[0] <= d && planets[p].rings[r].distance[1] >= d) name += ' / '+rname
			if(planets[p].rings[r].gaps){
				for(var g = 0; g < planets[p].rings[r].gaps.length; g++){
					rgap = ((w/range)*((planets[p].rings[r].gaps[g].distance.length==2) ? planets[p].rings[r].gaps[g].distance[0] : planets[p].rings[r].gaps[g].distance));
					dRgap = Math.ceil((w/range)*((planets[p].rings[r].gaps[g].distance.length==2) ? planets[p].rings[r].gaps[g].distance[1]-planets[p].rings[r].gaps[g].distance[0] : planets[p].rings[r].gaps[g].width));
					dRgap += (rgap-Math.floor(rgap));
					if(dRgap < 1) dRgap = 1;
					if(rgap <= dpx && rgap+dRgap >= dpx) name += ' / '+planets[p].rings[r].gaps[g].name;
				}
			}
		}


		name = planets[p].name + (name ? name : '');
		name += '<br />'+Math.round(d)+' km'

		el.find('.values').html(name);
	}


	var dragging = false;
	$(document).on('click','.clickable,.indicator',function(e){
		dragging = true;
		setFromX($(this).closest('.system'),e.pageX);
		dragging = false;
	}).on('mousedown','.clickable,.indicator',function(e){
		dragging = true;
		return false;	// Don't allow text selection when starting to drag on the handle
	}).on('mouseup','.clickable,.indicator',function(e){
		dragging = false;
	}).on('mousemove','.clickable,.indicator',function(e){
		if(dragging){
			setFromX($(this).closest('.system'),e.pageX);
		}
	})
	function setFromX(el,x){ setDistance(el.attr('data-name'),range*((x-el.offset().left-1)/el.outerWidth())); }

});
