r(function(){

	loadJSON(getDataPath('#json'),drawIt);

	var h = 0;
	var w = 0;
	var mid = {};
	var missions = {};
	var obj = {};

	function drawIt(data){
		missions = data.missions;
		var el = document.getElementById('solarsystem');

		w = $('#solarsystem').outerWidth();
		h = Math.round(w*1250/1909)
		mid = {'x': w/2,'y':h/2};
		el.innerHTML = '';
		el.style = 'width:'+w+'px;height:'+h+'px;';

		var solarsystem = Raphael("solarsystem", w, h);
		$('#solarsystem svg').attr('id','canvas');
		var path;
	
		var offx = 0;
		var offy = 40;
		
		obj = {
			"mercury": {
				"pos": getPos(8.5,4),
				"colour":colours.orange[1],
				"text":"white",
				"missions": 0,
				"insertion": "left"
			},
			"venus": {
				"pos": getPos(7,3),
				"colour":colours.orange[1],
				"text":"black",
				"missions": 0,
				"insertion": "right"
			},
			"earth": {
				"pos": getPos(0,0.2),
				"colour":"#000000",
				"missions": 0
			},
			"mars": {
				"pos": getPos(10,2),
				"colour":colours.orange[1],
				"missions": 0,
				"insertion": "left"
			},
			"jupiter": {	
				"pos": getPos(3,2),
				"colour":colours.orange[1],
				"missions": 0,
				"insertion": "left"
			},
			"saturn": {
				"pos": getPos(5,3),
				"colour":colours.orange[1],
				"missions": 0,
				"insertion": "right"
			},
			"uranus": {
				"pos": getPos(2,3),
				"colour":colours.orange[1],
				"text":"white",
				"missions": 0,
				"insertion": "left"
			},
			"neptune": {
				"pos": getPos(2,4),
				"colour":colours.orange[1],
				"text":"black",
				"missions": 0,
				"insertion": "left"
			},
			"pluto": {
				"pos": getPos(1,3),
				"colour":colours.orange[1],
				"text":"black",
				"missions": 0,
				"insertion": "left"
			},
			"midway": {
				"pos": getPos(1.5,2.5),
				"colour":colours.orange[4],
				"missions": 0,
			},
			"heliopause": {
				"pos": getPos(1,6),
				"colour":"#3abfb9",
				"missions": 0,
				"insertion": "right"
			},
			"heliopauseb": {
				"pos": getPos(6.2,5.5),
				"colour":"#3abfb9",
				"missions": 0,
				"insertion": "right"
			},
			"heliopause1": {
				"pos": getPos(5.5,4.5),
				"colour":"#3abfb9",
				"missions": 0,
				"insertion": "right"
			},
			"heliopause2": {
				"pos": getPos(1.1,6),
				"colour":"#3abfb9",
				"missions": 0,
				"insertion": "right"
			},
			"heliopause3": {
				"pos": getPos(0.9,6),
				"colour":"#3abfb9",
				"missions": 0,
				"insertion": "right"
			},
			"ceres": {
				"pos": getPos(13,3),
				"colour":colours.orange[1],
				"missions": 0,
				"insertion": "left"
			},
			"vesta": {
				"pos": getPos(13,2),
				"colour":colours.orange[3],
				"missions": 0,
				"insertion": "right"
			},
			"(21) Lutetia": {
				"pos": getPos(14,3),
				"colour": colours.orange[3],
				"missions": 0,
				"insertion": "right"
			},
			"(243) Ida": {
				"pos": getPos(5,1),
				"colour": colours.orange[3],
				"missions": 0,
				"insertion": "left"
			},
			"(433) Eros": {
				"pos": getPos(15,1),
				"colour": colours.orange[3],
				"missions": 0,
				"insertion": "left"
			},
			"(951) Gaspra": {
				"pos": getPos(5,2),
				"colour": colours.orange[3],
				"missions": 0,
				"insertion": "left"
			},
			"(2867) &#352;teins": {
				"pos": getPos(14,2),
				"colour": colours.orange[3],
				"missions": 0,
				"insertion": "right"
			},
			"(4179) Toutatis": {
				"pos": getPos(1,1),
				"colour": colours.orange[3],
				"missions": 0,
				"insertion": "left"
			},
			"(5535) Annefrank": {
				"pos": getPos(15,2),
				"colour": colours.orange[3],
				"missions": 0,
				"insertion": "left"
			},
			"(9969) Braille": {
				"pos": getPos(2,1),
				"colour": colours.orange[3],
				"missions": 0,
				"insertion": "left"			
			},
			"(132524) APL": {
				"pos": getPos(3,1),
				"colour": colours.orange[3],
				"missions": 0,
				"insertion": "left"
			},
			"(25143) Itokawa": {
				"pos": getPos(14,1),
				"colour": colours.orange[3],
				"missions": 0,
				"insertion": "left"
			},
			"(162173) 1999 JU3": {
				"pos": getPos(13,1),
				"colour": colours.orange[3],
				"missions": 0,
				"insertion": "left"
			},
			"1P/Halley": {
				"pos": getPos(0,4),
				"colour": colours.orange[3],
				"missions": 0,
				"insertion": "right"
			},
			"2P\/Encke": {
				"pos": getPos(16,1),
				"colour": colours.orange[3],
				"missions": 0,
				"insertion": "left"
			},
			"9P\/Tempel": {
				"pos": getPos(15,4),
				"colour": colours.orange[3],
				"missions": 0,
				"insertion": "left"
			},
			"19P\/Borrelly": {
				"pos": getPos(2,2),
				"colour": colours.orange[3],
				"missions": 0,
				"insertion": "left"
			},
			"21P\/Giacobini-Zinner": {
				"pos": getPos(16,3),
				"colour": colours.orange[3],
				"missions": 0,
				"insertion": "left"
			},
			"26P\/Grigg-Skjellerup": {
				"pos": getPos(1,2),
				"colour": colours.orange[3],
				"missions": 0,
				"insertion": "left"
			},
			"67P\/Churyumov-Gerasimenko": {
				"pos": getPos(14,4),
				"colour": colours.orange[3],
				"missions": 0,
				"insertion": "right"
			},
			"73P\/Schwassmann-Wachmann": {
				"pos": getPos(16,2),
				"colour": colours.orange[3],
				"missions": 0,
				"insertion": "left"
			},
			"81P\/Wild": {
				"pos": getPos(15,3),
				"colour": colours.orange[3],
				"missions": 0,
				"insertion": "left"
			},
			"103P\/Hartley": {
				"pos": getPos(15,5),
				"colour": colours.orange[3],
				"missions": 0,
				"insertion": "right"
			}
		};
	
		function getOrbitalRadius(a,z){
			if(!z) z = 0;
			return ((obj[a].missions+z+6)*spacing);
		}
		var d2r = Math.PI/180;
		var r2d = 180/Math.PI;
		function getIn(a,z,d,angle,r2){
			if(!z) z = 0;
			var r = getOrbitalRadius(a,z);
			if(a.indexOf('helio') >= 0 || a.indexOf('midway') >= 0 || a.indexOf('earth') >= 0) r = 0;
			var x = (obj[a].pos.x+r*Math.cos(angle*d2r));
			var y = (obj[a].pos.y+r*Math.sin(angle*d2r));
			if(!r2) r2 = Math.sqrt(d.x*d.x + d.y*d.y)*0.5;
			return [(x+limit(r2)*Math.cos((angle-90)*d2r)).toFixed(4),(y+limit(r2)*Math.sin((angle-90)*d2r)).toFixed(4),x.toFixed(4),y.toFixed(4)];
		}
		function getOut(a,z,d,angle,r2){
			if(!z) z = 0;
			var r = getOrbitalRadius(a,z);
			if(!r2) r2 = Math.sqrt(d.x*d.x + d.y*d.y)*0.2;
			if(a=="earth" || a=="midway") r = 0;
			return ["M",(obj[a].pos.x+r*Math.cos(angle*d2r)).toFixed(4),(obj[a].pos.y+r*Math.sin(angle*d2r)).toFixed(4),"C",(obj[a].pos.x+r*Math.cos(angle*d2r)+r2*Math.cos((angle+90)*d2r)).toFixed(4),(obj[a].pos.y+r*Math.sin(angle*d2r)+r2*Math.sin((angle+90)*d2r)).toFixed(4)];
		}
		function getCurve(a,b,a1,a2,r,r2){
			if(r && !r2) r2 = r;
			var scale = w/1909;
			var diff = {'x':(obj[b].pos.x-obj[a].pos.x)*scale,'y':(obj[b].pos.y-obj[a].pos.y)*scale};
			return getOut(a,-1,diff,a1,r*scale).concat(getIn(b,0,diff,a2,r2*scale));
		}
		function limit(a){
			return Math.max(30,Math.abs(a))*(a>=0 ? 1 : -1);
		}
		
		function fly(a,b,ins){
			if(!a || !b) return "";
			var s = {'x':obj[a].pos.x,'y':obj[a].pos.y};
			var e = {'x':obj[b].pos.x,'y':obj[b].pos.y};
			var diff = {'x':obj[b].pos.x-obj[a].pos.x,'y':obj[b].pos.y-obj[a].pos.y};
			var one = {'x':0,'y':0};
			var two = {'x':0,'y':0};
			
			if(a == "earth"){
				if(b=="mars") return getCurve(a,b,90,135,50,280);
				if(b=="venus") return getCurve(a,b,90,45);
				if(b=="jupiter") return getCurve(a,b,-90,270,20,200);
				if(b=="1P/Halley") return getCurve(a,b,270,315,100,180);
				if(b=="2P/Encke") return getCurve(a,b,270,270,200,50);
				if(b=="9P/Tempel") return getCurve(a,b,270,180,90,150);
				if(b=="21P/Giacobini-Zinner") return getCurve(a,b,270,180,100,150);
				if(b=="(433) Eros") return getCurve(a,b,270,180,50);
				if(b=="(4179) Toutatis") return getCurve(a,b,270,270,80,100);
				if(b=="(5535) Annefrank") return getCurve(a,b,270,180,70,90);
				if(b=="(9969) Braille") return getCurve(a,b,-90,270,50,50);
				if(b=="(132524) APL") return getCurve(a,b,270,315,50,100);
				if(b=="(25143) Itokawa") return getCurve(a,b,270,180,80,100);
				if(b=="(162173) 1999 JU3") return getCurve(a,b,270,135,80,70);
				return getCurve(a,b,-90,180)
			}else if(a=="mars"){
				if(b=="(2867) &#352;teins") return getCurve(a,b,315,225,230,100);
				if(b=="vesta") return getCurve(a,b,315,225,200,100)
			}else if(a=="(2867) &#352;teins"){
				return getCurve(a,b,225,270,50,80);
			}else if(a=="(25143) Itokawa"){
				return getCurve(a,b,0,90,50,100);	
			}else if(a=="(162173) 1999 JU3"){
				return getCurve(a,b,0,90,50,100);	
			}else if(a=="venus"){
				if(b=="mercury") return getCurve(a,b,180,180,100,100);
				if(b=="saturn") return getCurve(a,b,0,0,190,120);
				if(b=="(951) Gaspra") return getCurve(a,b,0,225,100,100);
				if(b=="1P/Halley") return getCurve(a,b,0,180,600,350);
				return getCurve(a,b,0,180,150)
			}else if(a=="jupiter"){
				if(b=="saturn") return getCurve(a,b,90,0,120);
				if(b=="heliopause") return getCurve(a,b,315,290.5,150,600);
				if(b=="pluto") return getCurve(a,b,315,225,100);
				return getCurve(a,b,0,180,150)
			}else if(a=="saturn"){
				if(b=="uranus") return getCurve(a,b,315,180,150,100);
				if(b=="heliopauseb") return getCurve(a,b,90,45,150);
				if(b=="heliopause1") return getCurve(a,b,90,45,150);
				return getCurve(a,b,90,0,150)
			}else if(a=="uranus"){
				return getCurve(a,b,0,270)
			}else if(a=="neptune"){
				if(b=="heliopause2") return getCurve(a,b,270,290.5,150,100);
				return getCurve(a,b,270,270)
			}else if(a=="midway"){
				return getCurve(a,b,225,270,50,50);
			}else if(a=="pluto"){
				if(b=="heliopause3") return getCurve(a,b,315,290.5,100,70);
				return getCurve(a,b,270,270)
			}else if(a=="(132524) APL"){
				return getCurve(a,b,45,270);
			}else if(a=="(9969) Braille"){
				return getCurve(a,b,0,270);
			}else if(a=="vesta"){
				return getCurve(a,b,225,180);
			}else if(a=="(21) Lutetia"){
				return getCurve(a,b,270,180,50,50);
			}else if(a=="(5535) Annefrank"){
				return getCurve(a,b,180,315,60,50);
			}else if(a=="81P/Wild"){
				return getCurve(a,b,45,90,50,140);
			}else if(a=="9P/Tempel"){
				return getCurve(a,b,225,270,80);
			}else if(a=="(951) Gaspra"){
				return getCurve(a,b,225,180,80,50);
			}else if(a=="(243) Ida"){
				return getCurve(a,b,315,270);
			}else if(a=="1P/Halley"){
				if(b=="26P/Grigg-Skjellerup") return getCurve(a,b,45,45,150,150);
				if(b=="21P\/Giacobini-Zinner") return getCurve(a,b,45,135,150,80);
			}else if(a=="21P/Giacobini-Zinner"){
				if(b=="1P/Halley") return getCurve(a,b,225,315,120,50)
			}else if(a=="2P/Encke"){
				return getCurve(a,b,270,270)
			}else{
				return getCurve(a,b,180,270);
			}
		}
	
		var eccentricity = 1;
		var spacing = 5.5*(w/1909);

		var orbit = {};
		var txt = [];
		var arriveat = {};
		var svg = solarsystem.set();
		var paths = new Array();
		
		
		colours['fail'] = colours.orange[3];
		colours['success'] = colours.orange[0];

		for(var i = 0; i < missions.length; i++){
	
			col = colours['success'];
			if(missions[i].failed) col = colours['fail'];
			
			var from = 'earth';
			var strokestyle = "";

			for(var p = 0; p < missions[i].parts.length; p++){

				a2b = from+'-'+missions[i].parts[p].to;
				if(!arriveat[a2b]) arriveat[a2b] = {'paths':[],'first':[],'last':[]};
				if(obj[missions[i].parts[p].to]){
	
					to = missions[i].parts[p].to;
					if(!orbit[to]) orbit[to] = [];
	
					if(typeof missions[i].parts[p].success==="boolean" && !missions[i].parts[p].success) col = colours['fail'];
					if(from != to){
	
						strokestyle = (missions[i].parts[p]['type']=="ongoing" ? "- " : "");
						// Make path to object
						var path = fly(from,to)
						// Store the path
						paths.push({'path':path.slice(0),'stroke':col,'strokestyle': strokestyle,'id':i});
						// Store the path for this a->b route
						arriveat[a2b].paths.push({'path':path.slice(0)})
					}
	
					// Draw orbit
					if(!orbit[to][i] && (to.indexOf('helio') < 0 && to.indexOf('midway') < 0 && to.indexOf('earth') < 0)){
						solarsystem.ellipse(obj[to].pos.x,obj[to].pos.y,getOrbitalRadius(to),getOrbitalRadius(to)*eccentricity).attr({'stroke':col,'stroke-width':1,'cursor':'pointer','title':missions[i].name,'opacity':1,'stroke-dasharray': strokestyle}).data('id',i);
						svg.push( solarsystem.ellipse(obj[to].pos.x,obj[to].pos.y,getOrbitalRadius(to),getOrbitalRadius(to)*eccentricity).attr({'stroke':'black','stroke-width':3,'cursor':'pointer','title':missions[i].name,'opacity':0.01}).data('id',i) );
					}
					orbit[to][i] = true;
	
					if(from != to) obj[to].missions++;
	
					from = to;
				}
			}
		}

		// Draw the opaque backgrounds for groups of path from Earth
		for(a2b in arriveat){
			var a = arriveat[a2b];
			if(a.paths.length > 1 && a2b.indexOf("earth")==0){
				path = a.paths[0].path.slice(0);
				last = a.paths[a.paths.length-1].path.slice(0);
				// For the final path we need to go in the opposite direction so we re-arrange:
				// M a b C x1 y1 x2 y2 x y -> L x y C x2 y2 x1 y1 a b
				path = path.concat(['L',last[8],last[9],'C',last[6],last[7],last[4],last[5],last[1],last[2]]);
				solarsystem.path(path).attr({'stroke':'','fill':colours.orange[4],'opacity':0.9})
			}
		};


		// Draw the a-b paths
		for(var p = 0; p < paths.length; p++){
			solarsystem.path(paths[p].path).attr({'stroke':paths[p].stroke,'cursor':'pointer','title':missions[paths[p].id].name,'stroke-width':1,'opacity':1,'stroke-dasharray': paths[p].strokestyle}).data('id',paths[p].id);
			svg.push( solarsystem.path(paths[p].path).attr({'stroke':'black','cursor':'pointer','title':missions[paths[p].id].name,'stroke-width':3,'opacity':0.01}).data('id',paths[p].id) );
		}

		// Draw each object
		for(var o in obj){
			if (o.indexOf("midway") < 0 && o.indexOf("helio") < 0) solarsystem.circle(obj[o].pos.x,obj[o].pos.y,spacing*2).attr({'fill':obj[o].colour,'fill-opacity':1,'stroke':0,'cursor':'pointer','title':capitaliseFirstLetter(parseHTML(o))}).data('name',o).data('id',o);
			if (o.indexOf("midway") < 0 && o.indexOf("helio") < 0 && obj[o].colour == colours.orange[1]) var t = solarsystem.text(obj[o].pos.x,obj[o].pos.y,capitaliseFirstLetter(parseHTML(o))).attr({'stroke':0,'fill':'black','text-anchor':'middle','font-size':'10'});
		}

		// Set up the tooltip
		tooltipsvg({
			'elements': svg,
			'html': function(){
				var id = parseInt(this.data('id'))
				var a = missions[id];
				a.launch = new Date(a.launch);
				var text = '<div class="stripe '+(a.failed ? 'failure':'success')+'"><\/div><h3>'+a.name+'<\/h3><table>';
				text += '<tr><td colspan="2" style="text-align:center;"><img src="images/logo_'+a.agency+'.png" style="width:64px;" /><\/td><\/tr>';
				text += '<tr><td>Launch date:<\/td><td>'+(a.launch).toISOString().substr(0,10)+'<\/td><\/tr>';
				for(var p = 0; p < a.parts.length; p++) text += '<tr><td>'+(a.parts[p].to.indexOf('helio')>=0 ? 'Outer Solar System' : capitaliseFirstLetter(a.parts[p].to)+' ('+a.parts[p].type+'):')+'<\/td><td>'+(typeof a.parts[p].success==="boolean" ? (!a.parts[p].success ? '&cross; ':'&check; ') : '')+(a.parts[p].date ? a.parts[p].date.substr(0,10) : '')+'<\/td><\/tr>';

				if(a.finish) text += '<tr><td>Mission end:<\/td><td>'+a.finish.substr(0,10)+'<\/td><\/tr>';
				text += '<\/table>';
				//text += '<a href="'+dir+a.file+'" class="repo">data file<\/a>';
				return text;
			}
		});
	}
	
	// Angle, radius
	function getPos(a,r){
		var x,y,r2;
		var scale = w/1909;
		r2 = 265*scale
		r3 = 160*scale;
		r = (r > 1) ? r3*(r-1) + r2: r2*r;
		a = (a/16)*2*Math.PI;
		x = r*Math.cos(a) + mid.x;
		y = r*Math.sin(a) + mid.y;
		return {'x':x,'y':y };
	}
	
	function capitaliseFirstLetter(string){
		return string.charAt(0).toUpperCase() + string.slice(1);
	}

	function parseHTML(txt){
		var div = document.createElement("div");
		div.innerHTML = txt;
		return div.innerHTML;
	}


	function tooltipsvg(data){
	
		var existinghtml = "";
	
		function show(el,text,l,t){

			if(!text) return;
			var dx = 0;
			var dy = 0;
			var inner = ($('.innerbox').length==1) ? $('.innerbox') : ($('#content').length==1 ? $('#content') : $('#holder'));
	
			if($('.tooltip').length == 0){
				$('body').append('<div class="tooltip"><div class="tooltip_padd"><div class="tooltip_inner">'+text+'<\/div><a href="" class="tooltip_close button">close</a><\/div><\/div>');
				$('.tooltip_close').on('click',function(e){ e.preventDefault(); e.stopPropagation(); closeTooltip(); });
			}else $('.tooltip_inner').html(text);
	
			var fs = parseInt($('.tooltip').css('font-size'));
			var x = l+dx;
			var y = t+dy/2;
			var c = "right";
	
			if(x+$('.tooltip').width()+fs*2 > inner.width()){
				x = l-$('.tooltip').width();
				if(x < 0) x = 0;
				c = "left";
			}
			if(y+$('.tooltip').height()+fs*2 > inner.offset().top+inner.height()){
				y = t-$('.tooltip').height()+dy/2;
				if(y < 0) y = 0;
				c += " bottom";
			}
			$('.tooltip').css({'left':x,'top':y}).removeClass('right').removeClass('left').removeClass('bottom').addClass(c);
	
		}
		function closeTooltip(){
			existinghtml = "";
			$('.tooltip').remove();
			$('body').removeClass('hastooltip');
		}

		function f_in(d){
			// Open the popup
			var newhtml = data.html.call(this);
			//console.log('in',this.data('id'),d.pageX,d.pageY,newhtml)
			if(newhtml!=existinghtml){
				show(this,newhtml,d.pageX,d.pageY);
				$('body').addClass('hastooltip');
				existinghtml = newhtml;
			}else{
				if($('.tooltip').is(':visible')){
					$('.tooltip_close').trigger('click');
					existinghtml = "";
				}
			}
		}
		function f_out(d){
			// Close the popup
			console.log('out',this,d)
			//$('.tooltip_close').trigger('click');
			//existinghtml = "";
		}

		data.elements.hover(f_in,f_out);
/*
		data.elements.on('click',{data:data},function(e){
			e.preventDefault();
			e.stopPropagation();
	
			var newhtml = e.data.data.html.call(this);
			if(newhtml!=existinghtml){
				show(this,newhtml);
				$('body').addClass('hastooltip');
				existinghtml = newhtml;
			}else{
				if($('.tooltip').is(':visible')){
					$('.tooltip_close').trigger('click');
					existinghtml = "";
				}
			}
		})*/
	}

});

