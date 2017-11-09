$(document).ready(function(){
	var w = $('#holder').width()-1;
	var h = w*0.7;
	var mid = {'x': w/2,'y':h/2};
	var loaded = 0;
	var exo;
	var solar;

	$('.noscript').remove();

	function parsePlanets(data,attrs){

		if(attrs.catalogue=="exo"){
			exo = CSV2JSON(data,[
				{'name':'P.Name','format':'string'},
				{'name':'P.NameKepler','format':'string'},
				{'name':'P.NameKOI','format':'string'},
				{'name':'P.ZoneClass','format':'string'},
				{'name':'P.MassClass','format':'string'},
				{'name':'P.CompositionClass','format':'string'},
				{'name':'P.AtmosphereClass','format':'string'},
				{'name':'P.HabitableClass','format':'string'},
				{'name':'P.MinMass(EU)','format':'number'},
				{'name':'P.Mass(EU)','format':'number'},
				{'name':'P.MaxMass(EU)','format':'number'},
				{'name':'P.Radius(EU)','format':'number'},
				{'name':'P.Density(EU)','format':'number'},
				{'name':'P.Gravity(EU)','format':'number'},
				{'name':'P.EscVel(EU)','format':'number'},
				{'name':'P.SFluxMin(EU)','format':'number'},
				{'name':'P.SFluxMean(EU)','format':'number'},
				{'name':'P.SFluxMax(EU)','format':'number'},
				{'name':'P.TeqMin(K)','format':'number'},
				{'name':'P.TeqMean(K)','format':'number'},
				{'name':'P.TeqMax(K)','format':'number'},
				{'name':'P.TsMin(K)','format':'number'},
				{'name':'P.TsMean(K)','format':'number'},
				{'name':'P.TsMax(K)','format':'number'},
				{'name':'P.SurfPress(EU)','format':'number'},
				{'name':'P.Mag','format':'number'},
				{'name':'P.ApparSize(deg)','format':'number'},
				{'name':'P.Period(days)','format':'number'},
				{'name':'P.SemMajorAxis(AU)','format':'number'},
				{'name':'P.Eccentricity','format':'number'},
				{'name':'P.MeanDistance(AU)','format':'number'},
				{'name':'P.Inclination(deg)','format':'number'},
				{'name':'P.Omega(deg)','format':'string'},
				{'name':'S.Name','format':'string'},
				{'name':'S.NameHD','format':'string'},
				{'name':'S.NameHIP','format':'string'},
				{'name':'S.Constellation','format':'string'},
				{'name':'S.Type','format':'string'},
				{'name':'S.Mass(SU)','format':'number'},
				{'name':'S.Radius(SU)','format':'number'},
				{'name':'S.Teff(K)','format':'number'},
				{'name':'S.Luminosity(SU)','format':'number'},
				{'name':'S.[Fe/H]','format':'number'},
				{'name':'S.Age(Gyrs)','format':'number'},
				{'name':'S.ApparMag','format':'number'},
				{'name':'S.Distance(pc)','format':'number'},
				{'name':'S.RA(hrs)','format':'number'},
				{'name':'S.DEC(deg)','format':'number'},
				{'name':'S.MagfromPlanet','format':'number'},
				{'name':'S.SizefromPlanet(deg)','format':'number'},
				{'name':'S.No.Planets','format':'number'},
				{'name':'S.No.PlanetsHZ','format':'number'},
				{'name':'S.HabZoneMin(AU)','format':'number'},
				{'name':'S.HabZoneMax(AU)','format':'number'},
				{'name':'P.HZD','format':'number'},
				{'name':'P.HZC','format':'number'},
				{'name':'P.HZA','format':'number'},
				{'name':'P.HZI','format':'number'},
				{'name':'P.SPH','format':'number'},
				{'name':'P.IntESI','format':'number'},
				{'name':'P.SurfESI','format':'number'},
				{'name':'P.ESI','format':'number'},
				{'name':'S.HabCat','format':'boolean'},
				{'name':'P.Habitable','format':'boolean'},
				{'name':'P.HabMoon','format':'boolean'},
				{'name':'P.Confirmed','format':'boolean'},
				{'name':'P.Disc.Method','format':'string'},
				{'name':'P.Disc.Year','format':'number'}]);
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
			'Transit': {'label':'Transit','class':'transit','n':0 },
			"Primary Transit": {'class':'transit','n':0 },
			"TTV": {'class':'transit','n':0 },
			"Radial Velocity": {'class':'radialvelocity','label':'Radial Velocity','n':0 },
			"radial velocity": {'class':'radialvelocity','n':0 },
			"Pulsar": {'class':'pulsar','label':'Pulsar Timing','n':0 },
			"Microlensing": {'class':'microlensing','label':'Microlensing','n':0 },
			"Imaging": {'class':'imaging','label':'Direct Imaging','n':0 },
			"Astrometry": {'class':'astrometry','label':'Astrometry','n':0 },
			"other": {'class':'other','colour':'black','n':0 }
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


		for(var i = 0; i < exo.length;i++){
			if(exo[i]['P.Radius(EU)'] > maxr) maxr = exo[i]['P.Radius(EU)'];
			var m = exo[i]['P.Disc.Method']
			if(methods[m]) methods[m].n++;
		}

		function scaleR(r){ return r*0.7; }
		function getX(m){
			if(m=="Radial Velocity"){
				return Math.random()*w;
				return Math.random()*w*0.5 + w*0.25;
			}else{
				return Math.random()*w;
			}
		}
		function getY(m){
			if(m=="Radial Velocity"){
				return Math.random()*h;
				return Math.random()*h*0.5 + h*0.25;
			}else{
				return Math.random()*h;
			}
		}

		var nodes = d3.range(exo.length).map(function(i) {
			return {
				radius: (exo[i]['P.Radius(EU)'] ? scaleR(exo[i]['P.Radius(EU)']) + 1 : 0),
				method: exo[i]['P.Disc.Method'],
				'class': 'planet',
				x: getX(exo[i]['P.Disc.Method']),
				y: getY(exo[i]['P.Disc.Method'])
			};
		});

		var root = nodes[0];
		root.radius = 0;
		root.fixed = true;
		
		var force = d3.layout.force()
			.gravity(0.09)
			.charge(function(d, i) { return -Math.pow(d.radius, 2.0) / 9 })
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
				return (methods[d.method]) ? methods[d.method].colour : methods['other'].colour;
			})
			.attr("data", function(d,i){ return d.index; })
			.style("fill-opacity",1)
			.style("stroke-width",0)
			.style("stroke",0);


		// Construct our Solar System
		var solarsystem = {'x':50,'y':300 };
		var solnodes = d3.range(solar.length).map(function(i) {
			return {
				name: solar[i]['P.Name'],
				radius: (solar[i]['P.Radius(EU)'] ? scaleR(solar[i]['P.Radius(EU)']) + 1 : 0),
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
			.style("fill", methods['other'].colour)
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
				}
				var text = '<div class="stripe '+methods[nodes[id].method].class+'"><\/div><h3>'+a['P.Name']+'<\/h3><table>';
				if(a['P.Disc.Year']) text += '<tr><td>Discovered:<\/td><td>'+a['P.Disc.Year']+'<\/td><\/tr>';
				if(a['P.Radius(EU)']) text += '<tr><td>Planet radius:<\/td><td>'+a['P.Radius(EU)']+' &times;Earth<\/td><\/tr>';
				if(a['P.MeanDistance(AU)']) text += '<tr><td>Distance to star:<\/td><td>'+a['P.MeanDistance(AU)']+' A.U.<\/td><\/tr>';
				if(a['P.Period(days)']) text += '<tr><td>Orbital period:<\/td><td>'+p+' '+pl+'<\/td><\/tr>';
				if(a['P.Mass(EU)']) text += '<tr><td>Planet mass:<\/td><td>'+a['P.Mass(EU)']+' &times;Earth<\/td><\/tr>';
				if(a['P.Density(EU)']) text += '<tr><td>Planet density:<\/td><td>'+a['P.Density(EU)']+' &times;Earth<\/td><\/tr>';
				if(a['P.Habitable']) text += '<tr><td>Potentially habitable?:<\/td><td>'+a['P.Habitable']+'<\/td><\/tr>';
				text += '<\/table>';
				return text;
			}
		});
				
	}

	// Load the data
	loadCSV("data/phl_hec_all_confirmed.csv",parsePlanets,{'catalogue':'exo'});
	loadCSV("data/data_solar_ESI.csv",parsePlanets,{'catalogue':'solar'});
	
});
