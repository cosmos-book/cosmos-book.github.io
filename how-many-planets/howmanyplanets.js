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

/*
 * How many planets are there in the solar system?
 * Copyright 2015, Stuart Lowe
 */
var data;

$(document).ready(function(){

	data = [{
		"year": 1600,
		"description": "Before the invention of the telescope planets were \"wanderers\" across the sky. This classical definition included the Sun and Moon.",
		"planets":{
			"count":7,
			"names":["Sun","Mercury","Venus","Moon","Mars","Jupiter","Saturn"]
		},
		"dwarf":{
			"count":0,
			"names":[""]
		}
	},{
		"year": 1610,
		"description": "The invention of the telescope allowed Galileo to find four more \"wanderers\" - the moons of Jupiter (although \"moons\" wasn't yet a thing).",
		"planets":{
			"count":11,
			"names":["Sun","Mercury","Venus","Moon","Mars","Jupiter","Io","Europa","Ganymede","Callisto","Saturn"]
		},
		"dwarf":{
			"count":0,
			"names":[""]
		}
	},{
		"year": 1655,
		"description": "Titan was found orbiting Saturn and was added to the list of planets.",
		"planets":{
			"count":12,
			"names":["Sun","Mercury","Venus","Moon","Mars","Jupiter","Io","Europa","Ganymede","Callisto","Saturn","Titan"]
		},
		"dwarf":{
			"count":0,
			"names":[""]
		}
	},{
		"year": 1671,
		"description": "Iapetus was found orbiting Saturn.",
		"planets":{
			"count":13,
			"names":["Sun","Mercury","Venus","Moon","Mars","Jupiter","Io","Europa","Ganymede","Callisto","Saturn","Titan","Iapetus"]
		},
		"dwarf":{
			"count":0,
			"names":[""]
		}
	},{
		"year": 1672,
		"description": "Rhea was found orbiting Saturn.",
		"planets":{
			"count":14,
			"names":["Sun","Mercury","Venus","Moon","Mars","Jupiter","Io","Europa","Ganymede","Callisto","Saturn","Rhea","Titan","Iapetus"]
		},
		"dwarf":{
			"count":0,
			"names":[""]
		}
	},{
		"year": 1684,
		"description": "Tethys and Dione were found orbiting Saturn.",
		"planets":{
			"count":16,
			"names":["Sun","Mercury","Venus","Moon","Mars","Jupiter","Io","Europa","Ganymede","Callisto","Saturn","Tethys","Dione","Rhea","Titan","Iapetus"]
		},
		"dwarf":{
			"count":0,
			"names":[""]
		}
	},{
		"year": 1758,
		"description": "Comet Halley's reappearance caused \"planet\" to be redefined. The Sun was now a star. Comets were not planets. Earth was. Things orbiting other planets were redefined as \"moons\".",
		"planets":{
			"count":6,
			"names":["Mercury","Venus","Earth","Mars","Jupiter","Saturn"]
		},
		"dwarf":{
			"count":0,
			"names":[""]
		}
	},{
		"year": 1779,
		"description": "The ice giant Uranus was added to the planet club.",
		"planets":{
			"count":7,
			"names":["Mercury","Venus","Earth","Mars","Jupiter","Saturn","Uranus"]
		},
		"dwarf":{
			"count":0,
			"names":[""]
		}
	},{
		"year": 1801,
		"description": "Ceres was added to the planet club.",
		"planets":{
			"count":8,
			"names":["Mercury","Venus","Earth","Mars","Ceres","Jupiter","Saturn","Uranus"]
		},
		"dwarf":{
			"count":0,
			"names":[""]
		}
	},{
		"year": 1802,
		"description": "Pallas was added to the planet club.",
		"planets":{
			"count":9,
			"names":["Mercury","Venus","Earth","Mars","Ceres","Pallas","Jupiter","Saturn","Uranus"]
		},
		"dwarf":{
			"count":0,
			"names":[""]
		}
	},{
		"year": 1804,
		"description": "Juno was added to the planet club.",
		"planets":{
			"count":10,
			"names":["Mercury","Venus","Earth","Mars","Juno","Ceres","Pallas","Jupiter","Saturn","Uranus"]
		},
		"dwarf":{
			"count":0,
			"names":[""]
		}
	},{
		"year": 1807,
		"description": "Vesta was added to the planet club.",
		"planets":{
			"count":11,
			"names":["Mercury","Venus","Earth","Mars","Vesta","Juno","Ceres","Pallas","Jupiter","Saturn","Uranus"]
		},
		"dwarf":{
			"count":0,
			"names":[""]
		}
	},{
		"year": 1845,
		"description": "Astraea was added to the planet club.",
		"planets":{
			"count":12,
			"names":["Mercury","Venus","Earth","Mars","Vesta","Astraea","Juno","Ceres","Pallas","Jupiter","Saturn","Uranus"]
		},
		"dwarf":{
			"count":0,
			"names":[""]
		}
	},{
		"year": 1846,
		"description": "Neptune was added to the planet club.",
		"planets":{
			"count":13,
			"names":["Mercury","Venus","Earth","Mars","Vesta","Astraea","Juno","Ceres","Pallas","Jupiter","Saturn","Uranus","Neptune"]
		},
		"dwarf":{
			"count":0,
			"names":[""]
		}
	},{
		"year": 1847,
		"description": "With lots of small bodies being found forming a belt between Mars and Jupiter they were all redefined as \"asteroids\".",
		"planets":{
			"count":8,
			"names":["Mercury","Venus","Earth","Mars","Jupiter","Saturn","Uranus","Neptune"]
		},
		"dwarf":{
			"count":0,
			"names":[""]
		}
	},{
		"year": 1930,
		"description": "Pluto was added to the planet club.",
		"planets":{
			"count":9,
			"names":["Mercury","Venus","Earth","Mars","Jupiter","Saturn","Uranus","Neptune","Pluto"]
		},
		"dwarf":{
			"count":0,
			"names":[""]
		}
	},{
		"year": 2006,
		"description": "Eris was found to be larger than Pluto leading to Pluto being redefined as a \"dwarf planet\" along with Ceres and Eris.",
		"planets":{
			"count":8,
			"names":["Mercury","Venus","Earth","Mars","Jupiter","Saturn","Uranus","Neptune"]
		},
		"dwarf":{
			"count":3,
			"names":["Ceres","Pluto","Eris"]
		}
	},{
		"year": 2008,
		"description": "Haumea and Makemake were added to the \"dwarf planet\" club joining Pluto, Ceres, and Eris.",
		"planets":{
			"count":8,
			"names":["Mercury","Venus","Earth","Mars","Jupiter","Saturn","Uranus","Neptune"]
		},
		"dwarf":{
			"count":5,
			"names":["Ceres","Pluto","Haumea","Makemake","Eris"]
		}
	}]

	var now = new Date();
	var year = now.getFullYear();
	
	$('#eyear').html(year);

	$("#slider").slider({
		min: 1600,
		max: now.getFullYear(),
		value: now.getFullYear(),
		create: function(event, ui){
			updateData(now.getFullYear())
		},
		slide: function(event, ui){
			updateData(ui.value)
		}
	});
	
	function updateData(year){
		$(".titleyear").html(" in "+year);
		var i;
		for(i = data.length-1 ; i > 0 ; i--){
			if(year >= data[i].year) break;
		}
		var output = 'In '+year+' there were<div class="count">'+data[i].planets.count+'<\/div>';
		//if(data[i].dwarf.count > 0) output += ' and <div class="count">'+data[i].dwarf.count+'<\/div> dwarf planets';
		$("#output").html(output)
		
		if(data[i].description) $("#info").html(data[i].year+': '+data[i].description)
		
		var planets = "";
		for(var p = 0; p < data[i].planets.names.length; p++){
			planets += '<div class="planet '+data[i].planets.names[p]+'"><div class="disc"><\/div><div class="label">'+data[i].planets.names[p]+'<\/div><\/div>';
		}
		$("#planets").html(planets);
		$('.noscript').hide();
		$('.js-only').removeClass('js-only');
	
	}

})