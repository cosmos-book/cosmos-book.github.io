$(document).ready(function(){

	var data;
	var years = [1900,2100];
	var moon = 380000; // km
	var el = $('#holder');
	var h = $('#content').outerHeight();
	if(el.width() < h){
		w = el.width();
		h = w;
	}else{
		w = h;
	}
	var y1 = new Date(years[0],1,1,0,0,0);
	var y2 = new Date(years[1],1,1,0,0,0);


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
		for(var i = 0; i < data.length; i++){
			data[i].date = new Date((data[i].mjd-2440587.5)*86400000);
			data[i].date_disc = new Date(1900,1,1,0,0,0);
			data[i].date_disc += data[i].discovery_year*86400*365.25
		}
		console.log(data)
		buildPlot();
	}
	
	// Load the files
	loadCSV('data/close-approaches_1900-2178_top300_details.csv',parseFile,{});
	
	$("#slider").slider({
		range: true,
		min: 1900,
		max: 2100,
		values: years,
		slide: function(event, ui){
			updatePlot(ui.values)
		}
	});
	
	function buildPlot(){
		
		paper = Raphael("holder", w, h);
		$('#holder svg').attr('id','canvas');
		
		paper.circle(w/2,h/2,(w/2)-2).attr({'stroke':colours.blue[3],'stroke-width':1});

		for(var i = 0; i < data.length; i++){
			if(data[i].date >= y1 && data[i].date <= y2 && data[i].distance_km < moon){
				r = (data[i].distance_km/moon)*(w/2 - 2);
				t = (2*Math.PI*(data[i].date-y1)/(y2-y1))-Math.PI/2;
				
				x = r*Math.cos(t);
				y = r*Math.sin(t);
				console.log(data[i].date)
				s = (0.17*w/2)*(data[i].size/600);
				if(s < 1) s = 1;
				paper.circle((w/2)+x,(h/2)+y,s).attr({'fill':(data[i].collide ? colours.red[0] : colours.blue[1]),'stroke':0,'opacity':0.8})
			}
		}

	}
	function updatePlot(ys){

		if(ys && ys.length==2) years = ys;

		console.log(years)

		return;
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