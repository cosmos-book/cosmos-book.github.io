r(function(){

	loadJSON(getDataPath('#data'),drawIt);

	var range = 230000;	// Maximum extent in km
	var scale = 100/range;
	var planets;
	var current = new Array();
	var currentP;
	
	function drawIt(data){

		planets = data.planets;
		var radius,dR,op;

		for(var p = 0; p < planets.length; p++){
			// If we don't already have a holder for this planet
			if($('#'+planets[p].name).length==0) $('#holder').append('<div class="table-row" id="'+planets[p].name+'">'+planets[p].name+'</div>');
		}
		
		// Build each planet		
		for(var p = 0; p < planets.length; p++){
			current[p] = {'planet':planets[p].name,'distance': planets[p].rings[0].distance[0] };
			var html = '<div class="full-width"><div class="system" data-id="'+p+'" data-name="'+planets[p].name+'"><div class="clickable"><h2 class="name">'+planets[p].name+'</h2>';
			
			html += '<div class="planet solid" style="width:'+(planets[p].radius*scale)+'%;"></div>';
			for(var r = 0; r < planets[p].rings.length; r++){
				radius = planets[p].rings[r].distance[0]*scale;
				dR = (planets[p].rings[r].distance[1]-planets[p].rings[r].distance[0])*scale;
				if(radius + dR > 100) dR = 100-radius;
				op = (planets[p].rings[r].opacity ? planets[p].rings[r].opacity: 1);
				if(op < 0.1) op = 0.1;
				
				html += '<div class="ring solid" data-id="'+r+'" style="left:'+radius+'%;width:'+dR+'%;opacity:'+op+';" title="'+planets[p].rings[r].name+'"></div>';

				if(planets[p].rings[r].gaps){
					for(var g = 0; g < planets[p].rings[r].gaps.length; g++){
						rgap = scale * ((planets[p].rings[r].gaps[g].distance.length==2) ? planets[p].rings[r].gaps[g].distance[0] : planets[p].rings[r].gaps[g].distance);
						dRgap = scale * ((planets[p].rings[r].gaps[g].distance.length==2) ? planets[p].rings[r].gaps[g].distance[1]-planets[p].rings[r].gaps[g].distance[0] : planets[p].rings[r].gaps[g].width);
	
						html += '<div class="gap" style="left:'+rgap+'%;width:'+dRgap+'%;;" title="'+planets[p].rings[r].gaps[g].name+'"></div>';
					}
				}

			}
			html += '</div><div class="indicator"><div class="handle"></div><div class="values"></div></div></div></div>';
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

		currentP = planet;
		// Which planet is this?
		for(var p = 0; p < planets.length; p++){
			if(planets[p].name == planet) break;
		}
		current[p].distance = d;

		var rgap,dRgap;
		var el = $('#'+planet);
		var i = el.find('.indicator');
		var w = el.outerWidth();
		var dpx = d*(w/range);
		i.css({'left':(scale*d)+'%'});


		var name = '';
		
		if(planets[p].radius > d) name += ' (planet)'
		for(var r = 0; r < planets[p].rings.length; r++){
			rname = planets[p].rings[r].name.replace(/_([^\s]+)/,function(i,a){ return '<sub>'+a+'</sub>'; });
			r1 = Math.floor((w/range)*planets[p].rings[r].distance[0]);
			r2 = Math.ceil((w/range)*planets[p].rings[r].distance[1]);
			if(dpx >= r1 && dpx <= r2) name += ' / '+rname
			if(planets[p].rings[r].gaps){
				for(var g = 0; g < planets[p].rings[r].gaps.length; g++){
					rgap = ((w/range)*((planets[p].rings[r].gaps[g].distance.length==2) ? planets[p].rings[r].gaps[g].distance[0] : planets[p].rings[r].gaps[g].distance));
					dRgap = Math.ceil((w/range)*((planets[p].rings[r].gaps[g].distance.length==2) ? planets[p].rings[r].gaps[g].distance[1]-planets[p].rings[r].gaps[g].distance[0] : planets[p].rings[r].gaps[g].width));
					dRgap += (rgap-Math.floor(rgap));
					rgap = Math.floor(rgap);
					if(dRgap < 1) dRgap = 1;
					if(rgap <= dpx && rgap+dRgap >= dpx) name += ' / '+planets[p].rings[r].gaps[g].name;
				}
			}
		}


		name = planets[p].name + (name ? name : '');
		d = Math.round(d);
		if(d < 0) d = 0;
		name += '<br />'+d+' km'+(d==0 ? ' - core':'')

		el.find('.values').html(name);
	}


	var dragging = false;
	var active = false;
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
	}).on('mouseover','.clickable,.indicator',function(e){
		active = true;
	}).on('mouseout','.clickable,.indicator',function(e){
		active = false;
	});
	

	$(document).on('keypress',function(e){
		if(!active) return true;
		if(!e) e = window.event;
		var code = e.keyCode || e.charCode || e.which || 0;
		var c = 0;
		
		if(code==37) c = "left";
		else if(code==32) c = "space";
		else if(code==38) c = "up";
		else if(code==39) c = "right";
		else if(code==40) c = "down";
		else c = String.fromCharCode(code);

		if(currentP){
			var el = $('#'+currentP+' .system');
			var p = parseInt(el.attr('data-id'));
			var name = el.attr('data-name');
			var r = 0;

			if(c=="right"){
				for(r = 0; r < planets[p].rings.length; r++){
					if(planets[p].rings[r].distance[0] > current[p].distance) break;
				}
				if(r == planets[p].rings.length) r = 0;
				setDistance(name,planets[p].rings[r].distance[0])
			}else if(c=="left"){
				for(r = planets[p].rings.length-1; r >= 0; r--){
					if(planets[p].rings[r].distance[0] < current[p].distance) break;
				}
				if(r < 0) r = planets[p].rings.length-1;
				setDistance(name,planets[p].rings[r].distance[0])			
			}else if(c=="down"){
				e.preventDefault();
				var np = '';
				var p = 0;
				for(p = 0; p < planets.length; p++){
					if(planets[p].name == currentP) break;
				}
				p++;
				if(p >= planets.length) p = 0;
				currentP = planets[p].name;
			}else if(c=="up"){
				e.preventDefault();
				var np = '';
				var p = 0;
				for(p = 0; p < planets.length; p++){
					if(planets[p].name == currentP) break;
				}
				p--;
				if(p < 0) p = planets.length-1;
				currentP = planets[p].name;
			}
		}
	});

	function setFromX(el,x){ setDistance(el.attr('data-name'),range*((x-el.offset().left-1)/el.outerWidth())); }

});
