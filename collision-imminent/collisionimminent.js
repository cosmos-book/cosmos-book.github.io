$(document).ready(function(){

	var data;
	var years = [1900,2100];
	var range = 380000; // km
	var el = $('#holder');
	var h = $('#content').outerHeight();
	var asteroids;
	var paths;
	var grid;
	var earth;
	if(el.width() < h){
		w = el.width();
		h = w;
	}else{
		w = h;
	}
	var mid = { 'x': w/2, 'y': h/2 };
	var rad = (w/2)*0.85;
	var y1 = new Date(years[0],0,1,0,0,0);
	var y2 = new Date(years[1],0,1,0,0,0);
	var end = new Date(years[1],0,1,0,0,0);


	function parseFile(d,attrs){

		// Object,MJD,Year,Month,Day,Distance,H,Collide,Distance (km),DiscoveryYear,Warning,Size (m),Size Source,H Source
		// (Tunguska) 1908 MXX,2418149.51,1908,Jun.,30.01,4.26e-05,22.5,Y,6372.86929182,1908.45833333,0.0403242009127,85.0,I,C
		data = CSV2JSON(d,[
			{'name':'object','format':'string'},
			{'name':'mjd','format':'number'},
			{'name':'year','format':'number'},
			{'name':'month','format':'string'},
			{'name':'day','format':'number'},
			{'name':'distance','format':'number'},
			{'name':'H','format':'number'},
			{'name':'collide','format':'boolean'},
			{'name':'distance_km','format':'number'},
			{'name':'discovery_year','format':'number'},
			{'name':'warning','format':'number'},
			{'name':'size','format':'number'},
			{'name':'size_source','format':'string'},
			{'name':'h_source','format':'string'}
		]);
		
		// Preprocess data
		var v,y;
		days = 365;
		for(var i = 0; i < data.length; i++){
			data[i].date_close = new Date((data[i].mjd-2440587.5)*86400000);
			y = Math.floor(data[i].discovery_year);
			days = 365;
			if(y%4==0) days = 366;
			if(y%400==0) days = 365;
			data[i].date_disc = new Date((new Date(y,0,1,0,0,0)).valueOf() + (data[i].discovery_year-y)*(days)*86400000);
			data[i].dist = (data[i].distance_km < 6371 ? 6371 : data[i].distance_km);
		}


		buildPlot();
	}
	
	// Load the files
	loadCSV(getDataPath('#data'),parseFile,{});
	
	$("#slider").slider({
		range: true,
		min: 1900,
		max: 2100,
		values: years,
		slide: function(event, ui){
			updatePlot(ui.values)
		}
	});
	$("#slider2").slider({
		min: 0,
		max: range,
		value: range,
		slide: function(event, ui){
			updateRange(ui.value)
		}
	});
	
	function drawGrid(){
		var gridding,t,x,y,rot,r;
		
		r = 1.01*rad;

		if(grid) grid.remove();

		// Draw line from centre to top
		grid.push(paper.path('M'+mid.x+','+mid.y+' l0,-'+rad+'z').attr({'stroke':colours.blue[3],'stroke-width':0.5,'opacity':0.7}).toBack());
		x = mid.x;
		y = mid.y-r;
		grid.push(paper.text(x,y,years[0]).attr({'stroke':0,'fill':'black','text-anchor':'start'}).toBack().transform('r-90,'+x+','+y));

		// Draw the gridlines
		gridding = 10;
		if(years[1]-years[0] < 100) gridding = 5;
		if(years[1]-years[0] < 30) gridding = 2;
		if(years[1]-years[0] < 16) gridding = 1;
		for(var yr = (years[0] + gridding - years[0]%gridding); yr < years[1]; yr += gridding){
			t = getTheta(new Date(yr,0,1,0,0,0));
			x = mid.x + r*Math.cos(t);
			y = mid.y + r*Math.sin(t);
			grid.push(paper.path('M'+mid.x+','+mid.y+' l'+(rad*Math.cos(t))+','+(rad*Math.sin(t))+'z').attr({'stroke':colours.blue[3],'stroke-width':0.5,'opacity':0.7}).toBack());
			rot = (t*180/Math.PI);
			flip = (rot > 90 && rot < 270);
			if(flip) rot += 180
			grid.push(paper.text(x,y,yr).attr({'stroke':0,'fill':'black','text-anchor':(flip) ? 'end':'start'}).toBack().transform('r'+rot+','+x+','+y));
		}

		// Draw main circle
		grid.push(paper.circle(mid.x,mid.y,rad).attr({'stroke':colours.blue[3],'stroke-width':1,'opacity':0.7}).toBack());

	}
	
	function buildPlot(){
		
		paper = Raphael("holder", w, h);
		$('#holder svg').attr('id','canvas');
		asteroids = paper.set();
		paths = paper.set();
		grid = paper.set();
		
		drawGrid();
		drawAsteroids();
		drawKey();
		drawEarth();
		
		tooltip({
			'elements':$('circle'),
			'html':function(){
				var id = $(this).attr('id');
				if(!id) return "";
				id = parseInt(id);
				var a = data[id];
				var text = '<div><\/div><h3>'+a.object+'<\/h3><table>';
				text += '<tr><td>Discovered:<\/td><td>'+(a.date_disc.toDateString())+'<\/td><\/tr>';
				text += '<tr><td>Closest:<\/td><td>'+(a.date_close.toDateString())+'<\/td><\/tr>';
				text += '<tr><td>Closest approach:<\/td><td>'+Math.round(a.dist-6371)+' km<\/td><\/tr>';
				text += '<tr><td>Size:<\/td><td>'+(a.size > 0 ? a.size+" m" : "unknown")+'<\/td><\/tr>';
				text += '<\/table>';
				return text;
			}
		});
		
		$('.loader').remove();
		$('.noscript').remove();
		$('.js-only').removeClass('js-only');
	}
	function asteroidSize(s){
		s = (0.17*rad)*(s/600);
		if(s < 1.2) s = 1.2;
		return s;
	}
	function drawKey(){

		var a = [500,100,50,20];
		var label = '';
		var p = 1;
		var s = new Array(a.length);
		for(var i = 0; i < a.length; i++) s[i] = asteroidSize(a[i]);
		for(var i = 0; i < s.length; i++){
			// Create the asteroids for the key
			x = s[0]*2+p - s[i];
			y = s[0]+p;
			paper.circle(x,y,s[i]).attr({'fill':'','stroke':'black','stroke-width':0.5});
			if(label!="") label += ' / ';
			label += (i < s.length-1 ? '':'<')+a[i]+'m';
		}
		paper.text(s[0]*2+p+4,s[0]+p,label).attr({'text-anchor':'start'})
	}
	function drawAsteroids(){
		var x,y,c,shortnotice,advancenotice;
		var build = (asteroids.length==0);
		var colour = {
			'normal': $('.asteroid').css('background-color'),
			'after': $('.asteroid_after').css('background-color'),
			'short': $('.asteroid_short').css('background-color'),
			'collide': $('.asteroid_collide').css('background-color'),
		}
		for(var i = 0; i < data.length; i++){

			if(data[i].date_close < end){

				advancenotice = (data[i].date_disc < data[i].date_close)
				shortnotice = (data[i].date_disc < data[i].date_close && data[i].date_close-data[i].date_disc < 30*86400000);
	
				c = colour.normal;
	
				// If it doesn't have advance notice
				if(!advancenotice) c = colour.after;
				// If it is less than 30 days notice
				if(shortnotice) c = colour.short;
				// If it collides we make it red
				if(data[i].collide) c = colour.collide;
	
	
				if(data[i].date_close >= y1 && data[i].date_close <= y2 && data[i].dist < range){
					r = (data[i].dist/range)*rad;
					t = getTheta(data[i].date_close);
					
					x = r*Math.cos(t);
					y = r*Math.sin(t);
					s = asteroidSize(data[i].size);
					
					// Create or update the asteroids
					if(!asteroids[i]) asteroids[i] = paper.circle(mid.x+x,mid.y+y,s).attr({'fill':c,'stroke':0,'opacity':0.8,'cursor':'pointer'});
					else asteroids[i].attr({'cx':mid.x+x,'cy':mid.y+y}).show()
					asteroids[i].node.id = i;
					
				}else{
					if(asteroids[i]) asteroids[i].hide();
				}
	
				if(data[i].date_close <= y2 && data[i].date_close >= y1 && data[i].dist < range){
					// Create new paths
					path = arcPath(mid.x, mid.y, r, getTheta(data[i].date_disc), getTheta(data[i].date_close))
					if(!shortnotice && advancenotice){
						if(!paths[i]) paths[i] = paper.path(path).attr({'stroke':c,'stroke-width':0.5});
						else paths[i].attr({'path':path}).show();
					}
				}else{
					if(paths[i]) paths[i].hide();
				}
			}
		}
	}

	function arcPath(cx, cy, r, startAngle, endAngle){
		return ["M", cx + r * Math.cos(startAngle), cy + r * Math.sin(startAngle), "A", r, r, 0, (endAngle-startAngle > Math.PI ? 1 : 0), 1, cx + r * Math.cos(endAngle), cy + r * Math.sin(endAngle), ""];
	}
	function drawEarth(){
		var r = rad*6371/range;
		if(r > rad) r = rad;
		if(!earth) earth = paper.circle(mid.x,mid.y,r).attr({'fill':'black','stroke':0,'opacity':0.3}).toFront()
		else earth.attr({'r':r})
	}
	// Supply a date and get the theta back
	function getTheta(d){
		var t = (2*Math.PI*(d-y1)/(y2-y1));
		if(d > y2) t = 2*Math.PI;
		if(d < y1) t = 0;
		return (t-Math.PI/2);
	}
	function updatePlot(ys){

		if(ys && ys.length==2) years = ys;

		// Update year range
		y1.setUTCFullYear(years[0])
		y2.setUTCFullYear(years[1])

		drawGrid()
		drawAsteroids();
		$('.tooltip_close').trigger('click');

		return;
	}
	function updateRange(d){
		range = d;
		drawAsteroids();
		drawEarth();
		$('.tooltip_close').trigger('click');
	}

});
/*
 * jQuery UI Touch Punch 0.2.2
 *
 * Copyright 2011, Dave Furfero
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * From https://github.com/furf/jquery-ui-touch-punch
 *
 * Depends:
 *  jquery.ui.widget.js
 *  jquery.ui.mouse.js
 */
(function(b){b.support.touch="ontouchend" in document;if(!b.support.touch){return;}var c=b.ui.mouse.prototype,e=c._mouseInit,a;function d(g,h){if(g.originalEvent.touches.length>1){return;}g.preventDefault();var i=g.originalEvent.changedTouches[0],f=document.createEvent("MouseEvents");f.initMouseEvent(h,true,true,window,1,i.screenX,i.screenY,i.clientX,i.clientY,false,false,false,false,0,null);g.target.dispatchEvent(f);}c._touchStart=function(g){var f=this;if(a||!f._mouseCapture(g.originalEvent.changedTouches[0])){return;}a=true;f._touchMoved=false;d(g,"mouseover");d(g,"mousemove");d(g,"mousedown");};c._touchMove=function(f){if(!a){return;}this._touchMoved=true;d(f,"mousemove");};c._touchEnd=function(f){if(!a){return;}d(f,"mouseup");d(f,"mouseout");if(!this._touchMoved){d(f,"click");}a=false;};c._mouseInit=function(){var f=this;f.element.bind("touchstart",b.proxy(f,"_touchStart")).bind("touchmove",b.proxy(f,"_touchMove")).bind("touchend",b.proxy(f,"_touchEnd"));e.call(f);};})(jQuery);