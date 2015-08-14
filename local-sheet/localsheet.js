// shim layer with setTimeout fallback
window.requestAnimFrame = (function(){
	return  window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function( callback ){ window.setTimeout(callback, 1000 / 60); };
})();


r(function(){

	var w = $('#holder').width() - 1;
	var h = w*(1250/1909);
	var mid = {'x': w/2,'y':h/2};
	var url = getDataPath('#data');

	$('#holder').html('').css({'width':w+'px','height':h+'px'});
	var paper = Raphael("holder", w, h);
	$('#holder svg').attr('id','canvas');
	var svg = paper.set();
	var galaxies = paper.set();
	var lines = paper.set();
	var grid = paper.set();
	var data;
	var x = { min: 0, max: 0};
	var y = { min: 0, max: 0};
	var z = { min: 0, max: 0};
	var scale,xoff,yoff,n;
	var lyr2pc = (1/3.26);
	var rotation = 200;
	var inclination = 20;
	var d2r = Math.PI/180;
	var animating = false;
	var showlabels = true;
	

	$('form').prepend('<label for="inclination">Inclination:</label><input type="text" id="inclination" name="inclination" value="'+inclination+'" style="width: 3em;"/><button id="rotate_d" class="button">&darr;</button><button id="rotate_u" class="button">&uarr;</button><label for="rotation">Rotation:</label><input type="text" id="rotation" name="rotation" value="'+rotation+'" style="width: 3em;" /><button id="rotate_c" class="button">&larr;</button><button id="rotate_a" class="button">&rarr;</button><button id="toggle_animation" class="button">Spin</button>');
	$('#rotate_c').on('click',function(e){ e.preventDefault(); rotate(-5); });
	$('#rotate_u').on('click',function(e){ e.preventDefault(); tilt(-5); });
	$('#rotate_d').on('click',function(e){ e.preventDefault(); tilt(5); });
	$('#rotate_a').on('click',function(e){ e.preventDefault(); rotate(5); });
	$('#toggle_animation').on('click',function(e){ e.preventDefault(); animating = !animating; animate(); });
	$('#rotation').on('change',function(e){ e.preventDefault(); rotation = parseFloat($(this).val()); rotate(0); });
	$('#inclination').on('change',function(e){ e.preventDefault(); inclination = parseFloat($(this).val()); tilt(0); });



	function animate(){
		if(animating){
			rotate(1);
			requestAnimFrame(function() { animate(); });
		}
	}

	function parseCSV(d,attrs){
		loaded = true;

		data = CSV2JSON(d,[
			{'name':'name','format':'string'},
			{'name':'x','format':'number'},
			{'name':'y','format':'number'},
			{'name':'z','format':'number'},
			{'name':'l','format':'number'},
			{'name':'b','format':'number'},
			{'name':'morph','format':'string'},
			{'name':'v','format':'number'},
			{'name':'tau','format':'number'},
			{'name':'dist','format':'number'},
			{'name':'method','format':'string'},
			{'name':'mag_k','format':'number'},
			{'name':'mag_v','format':'number'},
			{'name':'b-v','format':'number'},
			{'name':'logmass','format':'number'},
			{'name':'inc','format':'string'},
			{'name':'pa','format':'string'},
			{'name':'v_rot','format':'number'},
			{'name':'angmom_l','format':'number'},
			{'name':'angmom_b','format':'number'}
		]);

		for(var i = 0; i < data.length; i++){
			data[i].x += 0.004;
			data[i].y -= 0.004;
			data[i].z -= 0.135;
		}

		preprocess();
		drawIt();
		
		// Set up the tooltip
		tooltip({
			'elements':$('circle'),
			'html':function(){
				var id = $(this).attr('id');
				id = parseInt(id.substr(id.indexOf("_")+1));
				var a = data[id];

				// Format of data in CSV:
				// name = Name
				// x = X (Mpc)
				// y = Y (Mpc)
				// z = Z (Mpc)
				// l = Supergalactic L
				// b = Supergalactic B
				// morph = Morphology
				// v = Velocity (km/s)
				// tau = Optical depth
				// dist = Heliocentric distance modulus (mag)
				// method = Method used to determine the distance modulus (C = Cepheid variables in V and I; FP = Fundamental Plane; P = planetary nebulae; S = surface brightness fluctuations in I; T = tip of the red giant branch in I; TF = Tully–Fisher relation)
				// mag_k = Absolute magnitude in Ks (mag)
				// mag_v = Absolute magnitude in V (mag)
				// b-v = B - V colour (mag)
				// logmass = Logarithm of the stellar mass (solar)
				// inc = Inclination to the plane of the sky (deg)
				// pa = Position angle of the line of nodes (deg)
				// v_rot = Tilt-corrected rotational velocity (km/s)
				// angmom_l = Longitude of the angular momentum vector (deg)
				// angmom_b = Latitude of the angular momentum vector (deg)

				var text = '<div><\/div><h3>'+a.name+'<\/h3><table>';
				text += '<tr><td>Distance:<\/td><td>'+(a.distance/lyr2pc).toFixed(3)+' Mlyr<\/td><\/tr>';
				text += '<tr><td>Mass:<\/td><td>'+formatNumber(a.logmass)+' solar<\/td><\/tr>';
				text += '<tr><td>Supergalactic lon:<\/td><td>'+a.l+'&deg;<\/td><\/tr>';
				text += '<tr><td>Supergalactic lat:<\/td><td>'+a.b+'&deg;<\/td><\/tr>';
				text += '<tr><td>B-V:<\/td><td>'+a['b-v']+'<\/td><\/tr>';
				text += '<\/table>';
				text += '<a href="https://github.com/cosmos-book/cosmos-book.github.io/tree/master/localsheet/data/localsheet.csv" class="repo">data file<\/a>';
				return text;
			}
		});
		$('.loader').remove();


	}

	function formatNumber(v){
		return (Math.pow(10,v)/Math.pow(10,Math.floor(v))).toFixed(2)+'&times;10<sup>'+(Math.floor(v))+'</sup>';
	}

	// Remove non-script elements
	$('.noscript').remove();

	// Load the CSV file
	loadCSV(url,parseCSV,{});


	function preprocess(){
		for(var i = 0; i < data.length; i++){
			if(data[i].z > z.max) z.max = data[i].z;
			if(data[i].z < z.min) z.min = data[i].z;
			if(data[i].x > x.max) x.max = data[i].x;
			if(data[i].x < x.min) x.min = data[i].x;
			if(data[i].y > y.max) y.max = data[i].y;
			if(data[i].y < y.min) y.min = data[i].y;
		}	
		xoff = w*0.5;
		yoff = h*0.40;
		scale = (w*0.48)/(x.max-x.min);
		drawGrid();
	}

	function drawGrid(){
		var cen = getPos(0,0,0,scale);
		for(var dz = 0; dz < 40; dz++){
			dzpc = (dz*lyr2pc)
			if(!grid[dz]) grid[dz] =(paper.ellipse(xoff+cen.x,yoff+cen.y,dzpc*scale,dzpc*scale*Math.sin(inclination*d2r)).attr({'stroke':'white','opacity':(dz%5==0 ? 1:0.4)}));
			else grid[dz].attr({'rx':dzpc*scale,'ry':dzpc*scale*Math.sin(inclination*d2r)});
		}
	}
	
	function drawIt(){

		drawGals(-1);	// The galaxies below the plane

		drawGals(1);	// The galaxies above the plane

	}
	
	function getGalaxyColour(g){
		//if(g.name == "Milky Way") return "#000000";
		if(g.z >= 0) return colours.orange[0];
		else if(g.z < 0) return colours.blue[0];
		else return "#000000";
	}

	function drawGals(z){
		var r,lop,cen,p,i,path;
		
		cen = getPos(0,0,0,scale);
		r = 5;
		lop = 0.8;


		for(i = 0; i < data.length; i++){
			if((data[i].z >= 0 && z >= 0) || (data[i].z < 0 && z < 0)){
				p = getPos(data[i].x,data[i].y,data[i].z,scale);

				if(!galaxies[i]){
					data[i].distance = Math.sqrt(data[i].x*data[i].x + data[i].y*data[i].y + data[i].z*data[i].z);
					galaxies[i] = paper.circle(xoff+p.x,yoff+p.y,r).attr({'id':i,'cursor':'pointer','fill':getGalaxyColour(data[i]),'stroke':0,'fill-opacity':0.8});
					galaxies[i].node.id = "galaxy_"+i;
				}else{
					galaxies[i].attr({'cx':xoff+p.x,'cy':yoff+p.y})
				}
				path = 'M'+(xoff+cen.x)+','+(yoff+cen.y)+' L'+(xoff+p.x0)+','+(yoff+p.y0)+' L'+(xoff+p.x)+','+(yoff+p.y+(z < 0 ? -r/2:r/2));
				if(!lines[i]) lines[i] = paper.path(path).attr({'stroke':getGalaxyColour(data[i]),'stroke-width':0.5,'opacity':lop});
				else lines[i].attr({'path':path});

				if(z < 0){
					galaxies[i].toBack();
					lines[i].toBack();
				}else{
					galaxies[i].toFront();
				}
			}
		}
	}

	function rotate(r){
		rotation += r;
		rotation = rotation % 360;
		$('#rotation').val(rotation);
		drawIt();
	}
	
	// Inputs:
	function tilt(a){
		inclination += a;
		$('#inclination').val(inclination);
		drawGrid();
		drawIt();
	}
	
	// Inputs:
	// xp - x position
	// yp - y position
	// zp - z position
	// s - scale 
	// Outputs { x, y }
	function getPos(xp,yp,zp,s){
		xp *= s;
		yp *= s;
		zp *= s;
		var da = rotation*Math.PI/180;
		var ang = Math.atan2(yp,xp);
		var rxy = Math.sqrt(xp*xp + yp*yp);
		var i = rxy*Math.cos(ang+da);
		var j = rxy*Math.sin(ang+da);
		var k = zp;
		var xS = i;
		var theta = Math.atan2(k,j);
		var ryz = Math.sqrt(j*j + k*k);
		var yS = -ryz*Math.sin(inclination*d2r + theta);
		var yS0 = -j*Math.sin(inclination*d2r);
		return {'x':xS,'y':yS,'x0':xS,'y0':yS0 };
	}
});

