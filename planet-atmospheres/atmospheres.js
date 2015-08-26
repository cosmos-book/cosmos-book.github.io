r(function(){

	// Configure
	var range = {'y':[-320,320] };
	var el = $('#holder');
	var planets = ['Venus','Earth','Mars','Titan','Jupiter','Saturn','Uranus','Neptune','Pluto'];

	// Calculate values
	var w = el.width()-1;
	var dy = 12;
	var h = 600;
	var mid = {'x': w/2,'y':h/2};
	
	var paper = Raphael("holder", w, h);
	$('#holder svg').attr('id','canvas');
	var svg = paper.set();
	var loaded = 0;
	var atmospheres = {};

	function parseFile(d,attrs){
		if(!atmospheres[attrs.planet]) atmospheres[attrs.planet] = {};
		if(attrs.profile){
			//Altitude (km),Pressure (mbar),Temperature (K)
			atmospheres[attrs.planet].profile = CSV2JSON(d,[
				{'name':'h','format':'number'},
				{'name':'P','format':'number'},
				{'name':'T','format':'number'}
			]);
		}else{
			atmospheres[attrs.planet].data = CSV2JSON(d,[
				{'name':'lower','format':'number'},
				{'name':'upper','format':'number'},
				{'name':'feature','format':'string'},
				{'name':'name','format':'string'},
				{'name':'T','format':'number'},
				{'name':'P','format':'number'},
				{'name':'colour','format':'string'}
			]);
		}
		loaded++;
		if(loaded==planets.length*2) drawIt();
	}

	$('.loader').remove();
	$('.noscript').remove();

	// Load the files
	for(var p = 0; p < planets.length; p++) loadCSV('data/'+planets[p].toLowerCase()+'.csv',parseFile,{'planet':planets[p]});
	for(var p = 0; p < planets.length; p++) loadCSV('data/'+planets[p].toLowerCase()+'_profile.csv',parseFile,{'planet':planets[p],'profile':true});

	function getColour(n){

		if(n.toLowerCase().indexOf('haze') >= 0) return '#b6c727';
		if(n.toLowerCase().indexOf('water') >= 0) return '#48c7e9';
		if(n.toLowerCase().indexOf('co2') >= 0) return '#57b7aa';
		if(n.toLowerCase().indexOf('methane') >= 0) return '#02a24b';
		if(n.toLowerCase().indexOf('ammonia') >= 0) return '#f6881f';
		if(n.toLowerCase().indexOf('ammonium') >= 0) return '#7d71b4';
		if(n.toLowerCase().indexOf('clouds') >= 0) return '#662d8f';
		if(n.toLowerCase().indexOf('ozone') >= 0) return '#a8dbd5';
		return 'black';
	}
	
	

	function buildCSSGradient(stops){
		// background: #1e5799; /* Old browsers */
		// background: -moz-linear-gradient(top,  #1e5799 0%, #2989d8 50%, #207cca 51%, #7db9e8 100%); /* FF3.6+ */
		// background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,#1e5799), color-stop(50%,#2989d8), color-stop(51%,#207cca), color-stop(100%,#7db9e8)); /* Chrome,Safari4+ */
		// background: -webkit-linear-gradient(top,  #1e5799 0%,#2989d8 50%,#207cca 51%,#7db9e8 100%); /* Chrome10+,Safari5.1+ */
		// background: -o-linear-gradient(top,  #1e5799 0%,#2989d8 50%,#207cca 51%,#7db9e8 100%); /* Opera 11.10+ */
		// background: -ms-linear-gradient(top,  #1e5799 0%,#2989d8 50%,#207cca 51%,#7db9e8 100%); /* IE10+ */
		// background: linear-gradient(to bottom,  #1e5799 0%,#2989d8 50%,#207cca 51%,#7db9e8 100%); /* W3C */
		// filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#1e5799', endColorstr='#7db9e8',GradientType=0 ); /* IE6-9 */

		var s = "";
		var c = "";
		var css = "";
		for(var i = 0; i < stops.length;i++){
			if(s != "") s += ',';
			s += ''+stops[i][0]+' '+stops[i][1]+'%';
			if(c != "") c += ',';
			c += 'color-stop('+stops[i][1]+'%,'+stops[i][0]+')';
		}
		css = 'background: '+stops[0][0]+';'; // Old browsers
		css += 'background: -moz-linear-gradient(top, '+s+');';	// FF3.6+
		css += 'background: -webkit-gradient(linear, left top, left bottom, '+c+');';	// Chrome,Safari4+
		css += 'background: -webkit-linear-gradient(top, '+s+');';	 // Chrome10+,Safari5.1+
		css += 'background: -o-linear-gradient(top, '+s+');';	 // Opera 11.10+
		css += 'background: -ms-linear-gradient(top, '+s+');';	 // IE10+
		css += 'background: linear-gradient(to bottom, '+s+');';	 // W3C
		css += 'filter: progid:DXImageTransform.Microsoft.gradient( startColorstr=\''+stops[0][0]+'\', endColorstr=\''+stops[stops.length-1][0]+'\',GradientType=0 );'; // IE6-9
		return css;		
	}
	
	// Draw the result
	function drawIt(){
	
		dx = w/(planets.length*2);
		dy = h/(range.y[1]-range.y[0]);

		var j = 0;
		for(var i in atmospheres){

			if(atmospheres[i]){

				x = (dx*2*j+dx*0.5);

				// Make graded background
				grad = '';
				hassurface = true;
				for(var d = 0; d < atmospheres[i].data.length; d++){
					if(atmospheres[i].data[d].lower < 0) hassurface = false;
				}
				if(atmospheres[i].profile){
					stops = [['rgba(255,255,255,0)',0]];
					for(var k=atmospheres[i].profile.length-1; k >= 0; k--){
						if(atmospheres[i].profile[k].h < range.y[1]){
							op = (atmospheres[i].profile[k].P < 1000 ? (Math.log10(atmospheres[i].profile[k].P)+6)/9 : 1);
							if(op < 0) op = 0;
							y = 100*((range.y[1]-atmospheres[i].profile[k].h)/(range.y[1]-range.y[0]));
							stops.push(['rgba(255,255,255,'+op.toFixed(2)+')',y.toFixed(2)]);
						}
					}
					if(hassurface) stops.push(['rgba(255,255,255,0)',50.001]);
					else stops.push(['rgba(255,255,255,0)',100]);
					grad = buildCSSGradient(stops);
				}else{
					if(hassurface) grad = buildCSSGradient([['rgba(255,255,255,0)',0],['rgba(255,255,255,1)',20],['rgba(255,255,255,1)',50],['rgba(255,255,255,0)',50.001]]);
					else grad = buildCSSGradient([['rgba(255,255,255,0)',0],['rgba(255,255,255,1)',20],['rgba(255,255,255,1)',80],['rgba(255,255,255,0)',100]]);
				}
				$('#holder').append('<div style="'+grad+';width: '+dx+'px;height:'+h+'px;position: absolute; left:'+x+'px;top:0px;z-index:0;"></div>')


				for(var d = 0; d < atmospheres[i].data.length; d++){
					y = h-(atmospheres[i].data[d].upper-range.y[0])*dy;
					y2 = ((atmospheres[i].data[d].upper-atmospheres[i].data[d].lower)*dy);
					if(y2==0) y2 = 2;
					//if(y < 0) y = 0;
					//if(y > h) y = h;
					p = dx*0.05;
					c = getColour(atmospheres[i].data[d].name);
					if(atmospheres[i].data[d].feature.toLowerCase().indexOf('cloud layer') >= 0){
						//console.log(i,'layer',atmospheres[i].data[d].upper,atmospheres[i].data[d].lower,atmospheres[i].data[d].feature)
						paper.rect(x,y,dx,y2).attr({'fill':c,'stroke':0,'opacity':0.5,'title':atmospheres[i].data[d].name})
					}
					if(atmospheres[i].data[d].feature.indexOf('Boundary') == 0){
						//console.log(i,atmospheres[i],'boundary',atmospheres[i].data[d].upper,atmospheres[i].data[d].lower,atmospheres[i].data[d].feature)
						paper.path('M'+(x-p)+','+y+'l'+(dx+2*p)+',0').attr({'stroke':'black','stroke-width':0.5,'stroke-dasharray':'- '})
						paper.text(x-p,y,atmospheres[i].data[d].name).attr({'text-anchor':'end','fill':'black','stroke':0})
					}
				}
				paper.text(x+dx*0.5,h-10,i).attr({'text-anchor':'middle','fill':'black','stroke':0})
			}
			j++;
		}


		$('.loader').remove();
	}


});

