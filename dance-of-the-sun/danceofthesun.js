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

r(function(){

	var positions;
	var w,h,scale;
	
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

	// Load the files
	loadJSON(getDataPath('#data'),parseFile,{});
	var sun = new Array();

	// Remove no script elements
	$('.noscript').remove();

	function drawIt(){
	
		var el = $('#holder');
	
		// Calculate values
		h = $(window).height()-$('#header').outerHeight();
		w = h;
		if(h > el.width()){
			w = (el.width()-1);
			h = w;
		}
		el.html('').css({'width':w+'px','height':h+'px','margin':'auto'});
		var solarsystem = Raphael("holder", w, h);
		$('#holder svg').attr({'id':'canvas'});
		var path = "M 0,0 ";
		var x,y;
		scale = w/4.5e6;
		var prevdate = new Date('1970-01-01T00:00:00Z');
		var j = 0;
		var now = new Date();
		var nowjd = getJD(now);
		var atyear = now.getFullYear();
		var foundnow = false;
	
		$("#slider").slider({
			min: 1978,
			max: 2042,
			value: now.getFullYear(),
			create: function(event, ui){
				updateData(now.getFullYear())
			},
			slide: function(event, ui){
				updateData(ui.value)
			}
		});

		// Draw Sun
		sun.push(solarsystem.circle(0,0,696342*scale).attr({'fill':'#ffde00','fill-opacity':1,'stroke':0}));	
		// Draw radiative zone
		sun.push(solarsystem.circle(0,0,0.7*696342*scale).attr({'fill':'#fff79a','fill-opacity':0.3,'stroke':0}));	
		// Draw core
		sun.push(solarsystem.circle(0,0,0.25*696342*scale).attr({'fill':'#fffcd5','fill-opacity':0.3,'stroke':0}));	
		sun.push(solarsystem.text(0,0,''+now.getFullYear()).attr({'stroke':0,'fill':'#000000','text-anchor':'middle'}));	

		
		// Draw space
		for(var i = 0; i < positions.length; i++,j++){
			x = (w/2) - scale*positions[i].r*Math.cos(Math.PI*positions[i].l/180);
			y = (h/2) - scale*positions[i].r*Math.sin(Math.PI*positions[i].l/180);
			path += ' '+(j > 0 ? 'L':'M')+x+','+y;
			// The Julian Date of the Unix Time epoch is 2440587.5
			var d = getDateFromJD(positions[i].jd);
			var year = d.getFullYear();
			if(year > prevdate.getFullYear()){
				solarsystem.circle(x,y,1.5).attr({'fill':'#f6881f','stroke':0});	
				//if(year % 2 == 0) solarsystem.text(x+7,y,''+year).attr({'stroke':0,'fill':'#000000','text-anchor':'start'});
				prevdate = d;
			}
			if(!foundnow && Math.abs(nowjd-positions[i].jd) < 3){
				foundnow = true;
				moveSun(x,y,year);
			}
		}
	
		// Draw barycentre path
		solarsystem.path(path).attr({'stroke':'#f6881f','stroke-width':1,'opacity':1});
	
		solarsystem.path('M'+(w/2)+','+(h/2)+' l-5,0 l10,0 l-5,0 l0,5 l0,-10 z').attr({'stroke':'black'})
	
		$('.loader').remove();
		$('.noscript').remove();
		$('.js-only').removeClass('js-only');
	}
	
	function getDateFromJD(jd){
		// The Julian Date of the Unix Time epoch is 2440587.5
		return new Date((jd-2440587.5)*86400000);
	}
	function moveSun(x,y,year){
		for(var i = 0 ; i < sun.length;i++) sun[i].transform('T'+x+','+y);
		if(sun.length > 0) sun[sun.length-1].attr({'text':year});
	}
	function getIndexFromYear(year){
		var i,d,yr,x,y;
		for(i = 0; i < positions.length; i++){
			d = getDateFromJD(positions[i].jd);
			if(d.getFullYear()==year) return i;
		}
		return positions.length-1;
	}
	function updateData(year){

		var d,yr,x,y;
		var i = getIndexFromYear(year);
		
		d = new Date((positions[i].jd-2440587.5)*86400000);
		x = (w/2) - scale*positions[i].r*Math.cos(Math.PI*positions[i].l/180);
		y = (h/2) - scale*positions[i].r*Math.sin(Math.PI*positions[i].l/180);
		moveSun(x,y,year);

		/*$(".titleyear").html(" in "+year);
		var i;
		for(i = data.length-1 ; i > 0 ; i--){
			if(year >= data[i].year) break;
		}
		var output = 'In '+year+' there were<div class="count">'+data[i].planets.count+'<\/div>';
		//if(data[i].dwarf.count > 0) output += ' and <div class="count">'+data[i].dwarf.count+'<\/div> dwarf planets';
		$("#output").html(output)
		
		if(data[i].description) $("#info").html(data[i].description)
		
		var planets = "";
		for(var p = 0; p < data[i].planets.names.length; p++){
			planets += '<div class="planet '+data[i].planets.names[p]+'"><div class="disc"><\/div><div class="label">'+data[i].planets.names[p]+'<\/div><\/div>';
		}
		$("#planets").html(planets)*/
	
	}
	
	function getJD(clock) {
		// The Julian Date of the Unix Time epoch is 2440587.5
		if(!clock) clock = this.clock;
		return ( clock.getTime() / 86400000.0 ) + 2440587.5;
	}
});
