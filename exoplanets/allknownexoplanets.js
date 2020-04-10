$(document).ready(function(){
	var w = $('#holder').width()-1;
	var h = w*0.8;
	var mid = {'x': w/2,'y':h/2};
	var loaded = 0;
	var exo;
	var solar;

	$('.noscript').remove();

	function parsePlanets(data,attrs){

		if(attrs.catalogue=="exo"){

			/*
			1	P.Name
			6	P.Radius(EU)
			37	P.Disc.Method
			9	P.Disc.Year
			14	P.MeanDistance(AU)
			11	P.Period(days)
			3	P.Mass(EU)
			72	P.Density(EU)
			103	P.Habitable*/

			// perl sort.pl -sort 1 -cols 1,6,110,37,9,14,11,3,72,103 -zap 1 exoplanets/data/phl_exoplanet_catalog.csv > exoplanets/data/phl_exoplanet_catalog_cutdown.csv
			exo = CSV2JSON(data,[
				{'name':'P.Name','format':'string'},
				{'name':'P.Radius(EU)','format':'number'},
				{'name':'P.RadiusEst(EU)','format':'number'},
				{'name':'P.Disc.Method','format':'string'},
				{'name':'P.Disc.Year','format':'number'},
				{'name':'P.MeanDistance(AU)','format':'number'},
				{'name':'P.Period(days)','format':'number'},
				{'name':'P.Mass(EU)','format':'number'},
				{'name':'P.Density(EU)','format':'number'},
				{'name':'P.Habitable','format':'boolean'}
			]);
		}else if(attrs.catalogue=="solar"){
			solar = CSV2JSON(data,[
				{'name':'P.Name','format':'string'},
				{'name':'P.Mass(EU)','format':'number'},
				{'name':'P.Radius(EU)','format':'number'},
				{'name':'P.Density(EU)','format':'number'},
				{'name':'P.Gravity(EU)','format':'number'},
				{'name':'P.EscVel(EU)','format':'number'},
				{'name':'P.SemMajorAxis(AU)','format':'number'},
				{'name':'P.TsMean(K)','format':'number'},
				{'name':'P.TeqMean(K)','format':'number'},
				{'name':'P.ESIi','format':'number'},
				{'name':'P.ESIs','format':'number'},
				{'name':'P.ESIg','format':'number'}
			]);
		}

		loaded++;
		if(loaded == 2) drawPlanets();
	}

	function drawPlanets(){
		var width = w;
		var height = h;
		var color = function(i){ return colours.blue[0] }
		var maxr = 0;
		
		function getColour(cls){ return $('.'+cls).css('background-color'); }
		var methods = {
			"Transit": {'label':'Transit','class':'transit','n':0 },
			"Primary Transit": {'class':'transit','n':0 },
			"Eclipse Timing Variations": {'class':'transit','n':0 },
			"TTV": {'class':'transit','n':0 },
			"Transit Timing Variations": {'class':'transit','n':0 },
			"Orbital Brightness Modulation": {'class':'transit','n':0 },
			"Radial Velocity": {'class':'radialvelocity','label':'Radial Velocity','n':0 },
			"radial velocity": {'class':'radialvelocity','n':0 },
			"Pulsar": {'class':'pulsar','label':'Pulsar Timing','n':0 },
			"Microlensing": {'class':'microlensing','label':'Microlensing','n':0 },
			"Imaging": {'class':'imaging','label':'Direct Imaging','n':0 },
			"Astrometry": {'class':'astrometry','label':'Astrometry','n':0 },
			"Other": {'class':'other','colour':'black','n':0 }
		}
		
		// Draw key
		$('#holder').prepend('Discovery technique: <ul class="key" id="key"></ul>');
		// Extract the appropriate keys
		for(key in methods){
			// Append divs to hold key item
			if(methods[key].label) $('#key').append('<li class="keyitem"><span class="keycircle '+methods[key].class+'"></span><span class="keylabel">'+methods[key].label+'</span></li>');
			// Get the background colour now that the element exists in the DOM (fix for Chrome)
			var colour = getColour(methods[key].class);
			if(colour) methods[key].colour = colour;
		}


		// Remove non-confirmed planets
		for(var i = exo.length-1; i >= 0;i--){
			// If the radius doesn't exist
			if(!exo[i]['P.Radius(EU)']){
				if(!exo[i]['P.RadiusEst(EU)']) exo.splice(i,1);
				else exo[i]['P.Radius'] = exo[i]['P.RadiusEst(EU)'];
			}else{
				exo[i]['P.Radius'] = exo[i]['P.Radius(EU)'];
			}
		}

		for(var i = 0; i < exo.length;i++){
			if(exo[i]['P.Radius'] > maxr) maxr = exo[i]['P.Radius'];
			var m = exo[i]['P.Disc.Method']
			if(methods[m]) methods[m].n++;
		}

		function scaleR(r){ return r*0.7; }

		var nodes = d3.range(exo.length).map(function(i) {
			theta = Math.random()*2*Math.PI;
			min = 0.1;
			r = Math.random()*0.8 + min;
			if(exo[i]['P.Radius'] > 30){
				r = Math.random()*min;
			}
			r *= Math.min(w,h);
			x = w/2 + r*Math.cos(theta);
			y = h/2 + r*Math.sin(theta);
			return {
				radius: (exo[i]['P.Radius'] ? scaleR(exo[i]['P.Radius']) + 1 : 0),
				method: exo[i]['P.Disc.Method'],
				'class': 'planet',
				x: x,
				y: y
			};
		});

		var root = nodes[0];
		root.radius = 0;
		root.fixed = true;
		
		var force = d3.layout.force()
			.gravity(0.07)
			.charge(function(d, i) {
				if(d.radius > 30) return -1/Math.pow(d.radius, 2.0);
				return -Math.pow(d.radius, 2.0) / 9
			})
			.nodes(nodes)
			.size([width, height])
		
		force.start();
	
		var svg = d3.select("#holder").append("svg")
			.attr("width", width)
			.attr("height", height);
			
		$('#holder svg').attr({'id':'canvas'});
		
		svg.selectAll("circle")
			.data(nodes.slice(1))
			.enter().append("circle")
			.attr("r", function(d) { return (d.radius > 1 ? d.radius-1 : 0); })
			.attr("class","exoplanet")
			.attr("title",function (d,i){ return nodes[i]['P.Name'] })
			.style("fill", function(d,i){
				return (methods[d.method]) ? methods[d.method].colour : methods['Other'].colour;
			})
			.attr("data", function(d,i){ return d.index; })
			.style("fill-opacity",1)
			.style("stroke-width",0)
			.style("stroke",0);


		// Remove non-confirmed planets
		for(var i = 0; i < solar.length; i++){
			solar[i]['P.Radius'] = solar[i]['P.Radius(EU)'];
		}



		// Construct our Solar System
		var solarsystem = {'x':50,'y':300 };
		var solnodes = d3.range(solar.length).map(function(i) {
			return {
				name: solar[i]['P.Name'],
				radius: (solar[i]['P.Radius'] ? scaleR(solar[i]['P.Radius']) + 1 : 0),
				'class': 'exoplanet',
				x: solarsystem.x,
				y: solarsystem.y
			};
		});
		var solarforce = d3.layout.force()
			.gravity(0.29)
			.charge(function(d, i) { return -Math.pow(d.radius, 2.0) / 9 })
			.nodes(solnodes)
			.size([solarsystem.x+50, solarsystem.y*2]);
		
		solarforce.start();

		svg.selectAll("circles")
			.data(solnodes.slice(1))
			.enter().append("circle")
			.attr("r", function(d) { return d.radius-1; })
			.attr("class","solar")
			.style("fill", methods['Other'].colour)
			.style("fill-opacity",1)
			.style("stroke-width",0)
			.style("stroke",0)

		var rs = [25,15,5,1];	// Scale circles
		var y = 0;
		var str = "";
		for(var j = 0; j < rs.length; j++){
			svg.append("circle")
				.attr("cx", 25)
				.attr("cy", y+80-scaleR(rs[j]))
				.attr("r",scaleR(rs[j]))
				.style("stroke","black")
				.style("fill","transparent")
				.style("stroke-width",1)
				.style("fill-opacity",1)
			svg.append("text")
				.attr("x",30+scaleR(rs[j]))
				.attr("y",y+80-scaleR(rs[j])+4)
				.text(parseHTML((rs[j] > 1 ? rs[j]+' &times; ':'')+"Earth diameter"));
			if(str) str += " / ";
			str += " "+rs[j]
			y += scaleR(rs[j])*2 + 10;
		}
		svg.append("text")
			.attr("x",solarsystem.x-30)
			.attr("y",solarsystem.y-30)
			.text(parseHTML("Solar System"));

		force.on("tick", function(e) {
			var q = d3.geom.quadtree(nodes),
			i = 0,
			n = nodes.length;
			
			while (++i < n) q.visit(collide(nodes[i]));
			
			svg.selectAll(".exoplanet").attr("cx", function(d) { return d.x; }).attr("cy", function(d) { return d.y; });
		});
		
		solarforce.on("tick", function(e) {
			var q = d3.geom.quadtree(solnodes),
			i = 0,
			n = solnodes.length;
			
			while (++i < n) q.visit(collide(solnodes[i]));
			
			svg.selectAll(".solar").attr("cx", function(d) { return d.x; }).attr("cy", function(d) { return d.y; });
		});
		
		function collide(node) {
			var r = node.radius + 16,
			nx1 = node.x - r,
			nx2 = node.x + r,
			ny1 = node.y - r,
			ny2 = node.y + r;
			return function(quad, x1, y1, x2, y2) {
				if (quad.point && (quad.point !== node)) {
					var x = node.x - quad.point.x,
					  y = node.y - quad.point.y,
					  l = Math.sqrt(x * x + y * y),
					  r = node.radius + quad.point.radius;
					if (l < r) {
						l = (l - r) / l * .5;
						node.x -= x *= l;
						node.y -= y *= l;
						quad.point.x += x;
						quad.point.y += y;
					}
				}
				return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
			};
		}
		
		// Set up the tooltips for exoplanets
		tooltip({
			'elements':$('circle.exoplanet'),
			'html':function(){
				var id = parseInt($(this).attr('data'));
				var a = exo[id];
				var p = a['P.Period(days)'];
				var pl = " days";
				if(p > 365){
					p = (p/365.25).toFixed(2);
					pl = " years";
				}else{
					p = (p||0).toFixed(2);
				}
				var text = '<div class="stripe '+(methods[nodes[id].method] ? methods[nodes[id].method]['class']:'')+'"><\/div><h3>'+a['P.Name']+'<\/h3><table>';
				if(a['P.Disc.Year']) text += '<tr><td>Discovered:<\/td><td>'+a['P.Disc.Year']+'<\/td><\/tr>';
				if(a['P.Radius']) text += '<tr><td>Planet radius:<\/td><td>'+a['P.Radius'].toFixed(1)+'&thinsp;&times;Earth'+(a['P.Radius(EU)'] ? '' : ' (est)')+'<\/td><\/tr>';
				if(a['P.MeanDistance(AU)']) text += '<tr><td>Distance to star:<\/td><td>'+a['P.MeanDistance(AU)']+' A.U.<\/td><\/tr>';
				if(a['P.Period(days)']) text += '<tr><td>Orbital period:<\/td><td>'+p+' '+pl+'<\/td><\/tr>';
				if(a['P.Mass(EU)']) text += '<tr><td>Planet mass:<\/td><td>'+a['P.Mass(EU)'].toFixed(1)+'&thinsp;&times;Earth<\/td><\/tr>';
				if(a['P.Density(EU)']) text += '<tr><td>Planet density:<\/td><td>'+a['P.Density(EU)'].toFixed(4)+' &times;Earth<\/td><\/tr>';
				if(a['P.Habitable']) text += '<tr><td>Potentially habitable?:<\/td><td>'+a['P.Habitable']+'<\/td><\/tr>';
				if(a['P.Disc.Method']) text += '<tr><td>Discovery method:<\/td><td>'+a['P.Disc.Method']+'<\/td><\/tr>';
				text += '<\/table>';
				return text;
			}
		});
	}

	// Load the data
	loadCSV("data/phl_exoplanet_catalog_cutdown.csv",parsePlanets,{'catalogue':'exo'});
	loadCSV("data/data_solar_ESI.csv",parsePlanets,{'catalogue':'solar'});
	
});
