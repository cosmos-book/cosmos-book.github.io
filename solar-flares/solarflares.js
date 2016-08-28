r(function(){

	var data;
	var scale = "linear";
	var minradius = 300;

	var sdate = new Date('1976-01-01T00:00:00');
	var edate = new Date();
	var syear = sdate.getFullYear();
	var eyear = edate.getFullYear();
	var c,d,theta,r;
	var conv = {};
	var d2r = Math.PI/180;
	var r2d = 180/Math.PI;

	function parseFile(d,attrs){

		// Date,Class,Value (W/m*2)
		data = CSV2JSON(d,[{'name':'date','format':'date'},
							{'name':'class','format':'string'},
							{'name':'value','format':'number'}
							]);

		drawFlares();
	}

	// Load the files
	if(scale=="linear") loadCSV('data/goes_x.csv',parseFile,{});
	else loadCSV('data/goes.csv',parseFile,{});

	// Remove no script elements
	$('.noscript').remove();

	function drawFlares(){

		var solarsystem = "";

		function makeCircle(r,prop){
			return '<div class="level '+prop['class']+''+(typeof prop.n === "number" ? ' '+prop['class'][0]+prop.n : '')+'" style="width: '+(r)+'px;height:'+(r)+'px;left:-'+(r/2)+'px;top:-'+(r/2)+'px;"></div>';
		}

		$('#sun').html('<div class="disc"></div>'+'<div id="caption"><div class="text">Hover over a flare<br />for more information</div></div>')
		$('#sun .disc').css({'width':minradius+'px','height':minradius+'px','left':'-'+(minradius/2)+'px','top':'-'+(minradius/2)+'px'});
		$('#caption').css({'width':(minradius*0.9)+'px','margin-left':(minradius*0.05)+'px','height':(minradius/3)+'px','margin-top':(minradius/3)+'px','left':'-'+(minradius/2)+'px','top':'-'+(minradius/2)+'px'});

		// Display X class circle
		if(scale!="linear"){
			if(scale=="log"){
				// Show C class
				for(var i = 0; i < 9; i++){
					solarsystem += makeCircle(getR(0.000001*(i+1)),{'class':'C','n':i});
				}
				// Show M class
				for(var i = 0; i < 9; i++){
					solarsystem += makeCircle(getR(0.00001*(i+1)),{'class':'M','n':i});
				}
				for(var i = 1; i < 9; i++){
					solarsystem += makeCircle(getR(0.0001*(i+1)),{'class':'X','n':i});
				}
			}else{
				solarsystem += makeCircle(getR(0.000001),{'class':'C'});
				solarsystem += makeCircle(getR(0.00001),{'class':'M'});
				solarsystem += makeCircle(getR(0.0001),{'class':'X'});
				solarsystem += makeCircle(getR(0.001),{'class':'X10'});
			}
		}else if(scale == "linear"){
			for(var i = 10; i < 30; i++){
				solarsystem += makeCircle(getR(0.0001*(i+1)),{'class':'X10','n':i});
			}	
		}
		if(scale=="log" || scale=="linear"){
			for(var i = 0; i < 10; i++){
				solarsystem += makeCircle(getR(0.0001*(i+1)),{'class':'X','n':i});
			}
		}
		$('#sun').append(solarsystem);

		var flares = "";
		function makeFlare(i,theta,r,prop){
			theta = theta.toFixed(3);
			cls = data[i]['class'][0];
			if(data[i]['class'][0]=="X" && parseInt(data[i]['class'].slice(1)) >= 10) cls = "X10";
			return '<div id="flare'+i+'" class="flare '+cls+'" style="border-top-width: '+Math.floor(r)+'px;-ms-transform:rotate('+theta+'deg);-webkit-transform:rotate('+theta+'deg);transform:rotate('+theta+'deg);"></div>';
		}

		for(i = 0, j=0; i < data.length; i++){
			if(data[i].date >= sdate && data[i].date < edate){
				theta = 360*(data[i].date-sdate)/(edate-sdate) - 180; // calculate the angle in degrees
				ok = false;
				if(scale == "sqrt" && data[i]['value'] >= 4e-5) ok = true;
				if(scale == "linear" && data[i]['value'] >= 1e-4) ok = true;
				if(ok){
					flares += makeFlare(i,theta,getR(data[i].value)*0.5);
					j++
				}
			}
		}

		$('#sun').append(flares);

		$('.flare').on('mouseover',function(){
			var id = parseInt($(this).attr('id').slice(5));
			$('#caption .text').html(data[id]['date'].toUTCString()+'<br /><span class="number">'+data[id]['class']+'</span>');
		}).on('mouseout',function(){
			$('#caption .text').html('')
		});
		return;
	}
	function getColour(v,a){
		var col;
		if(v > 1e-6) col = colour.C;
		if(v > 1e-5) col = colour.M;
		if(v > 1e-4) col = colour.X;
		if(v > 1e-3) col = colour.X10;
		return col;
	}

	function getR(v){
		return minradius+getScale(v);
	}
	function getScale(v){
		if(scale=="linear"){
			return v*220000;
		}else if(scale=="log"){
			return (Math.log10(v) - Math.log10(0.0000001))*60;
		}else if(scale=="sqrt"){
			return (Math.sqrt(v)-Math.sqrt(0.000001))*9800;
		}
	}
});
