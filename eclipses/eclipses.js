var solar,lunar;
var key;

r(function(){

	// Configure
	var range = {'y':[1900,2100],'x': [0,366] };
	var padd = {'top':0,'bottom':0,'left':36,'right':1};
	var el = $('#holder');

	// Calculate values
	var w = el.width()-10;
	var dy = 12;
	var h = dy*(range.y[1]-range.y[0] + 2) + padd.top + padd.bottom;
	var mid = {'x': w/2,'y':h/2};
	
	el.html('');
	paper = Raphael("holder", w, h);
	$('#holder svg').attr('id','canvas');
	var svg = paper.set();
	var loaded = 0;
	var mn,mx,yoff,dx;

	function parseFile(d,attrs){
		if(attrs.cat=="solar"){
			solar = CSV2JSON(d,[
				{'name':'id','format':'number'},
				{'name':'jd','format':'number'},
				{'name':'date','format':'string'},
				{'name':'greatest','format':'string'},
				{'name':'deltaT','format':'number'},
				{'name':'luna','format':'number'},
				{'name':'saros','format':'number'},
				{'name':'type','format':'string'},
				{'name':'q','format':'string'}
			]);
		}else if(attrs.cat=="lunar"){
			lunar = CSV2JSON(d,[
				{'name':'id','format':'number'},
				{'name':'jd','format':'number'},
				{'name':'date','format':'string'},
				{'name':'greatest','format':'string'},
				{'name':'deltaT','format':'number'},
				{'name':'luna','format':'number'},
				{'name':'saros','format':'number'},
				{'name':'type','format':'string'},
				{'name':'q','format':'string'}
			]);
		}
		loaded++;
		
		if(loaded==2) drawIt();
	}

	// Load the files
	loadCSV('data/solar.csv',parseFile,{'cat':'solar'});
	loadCSV('data/lunar.csv',parseFile,{'cat':'lunar'});

	// The Julian Date of the Unix Time epoch is 2440587.5
	function getJD(clock){ return ( clock.getTime() / 86400000.0 ) + 2440587.5; }

	// Extend Date to provide the day-of-year number
	Date.prototype.getDOY = function() {
		var onejan = new Date(this.getFullYear(),0,1);
		return Math.ceil((this - onejan) / 86400000);
	}

	// Is this integer a leap year
	function isLeapYear(y){
		var leap = false;
		if(y%4 == 0) leap = true;
		if(y%100 == 0) leap = false;
		if(y%400 == 0) leap = true;
		return leap;
	}

	// Act as a link
	function goTo(type,i){
		var dat = (type=="lunar" ? lunar[i] : solar[i]);
		location.href = 'http://eclipse.gsfc.nasa.gov/OH/OH'+dat.y+'.html\#'+(type=="lunar" ? "LE":"SE")+dat.date.replace(/ /g,'')+''+dat.type[0];
	}
	
	// Draw the result
	function drawIt(){
		
		var minx = 0;
		var maxx = 366;
		var miny = range.y[0];
		var maxy = range.y[1];
		var months = [31,28,31,30,31,30,31,31,30,31,30,31];
		var monthnames = ['January','February','March','April','May','June','July','August','September','October','November','December'];

		for(var i = 0; i < lunar.length; i++){
			lunar[i].d = new Date(lunar[i].date);
			if(lunar[i].jd < 2086404.89002) lunar[i].d.setFullYear(parseInt(lunar[i].date.substr(0,5)))
			lunar[i].y = (lunar[i].d ? lunar[i].d.getFullYear() : 0);
		}

		for(var i = 0; i < solar.length; i++){
			solar[i].d = new Date(solar[i].date)
			if(solar[i].jd < 2086404.89002) solar[i].d.setFullYear(parseInt(solar[i].date.substr(0,5)))
			solar[i].y = (solar[i].d ? solar[i].d.getFullYear() : 0);
		}
	
		// Work out size of a day
		dx = parseFloat(((w-padd.left-padd.right)/(maxx+1-range.x[0])).toFixed(1));
		//dy = parseFloat(((h-padd.top-padd.bottom)/(maxy+1-miny)).toFixed(1));

		// Draw Moon phases
		for(var y = miny; y < maxy; y++){
			leap = (isLeapYear(y) ? 0 : 1);
			var phases = [];
			for(var x = range.x[0]+leap; x < maxx; x++){
				phases.push({'p':moonPhase(dateFromDay(y,x)),'pc':(100*x/(maxx-range.x[0]+leap))});
			}
			var stops = [];
			stops.push({'phase':phases[0].p.toFixed(2),'pc':0});
			for(var i = 1; i < phases.length-1; i++){
				if(phases[i].p < phases[i-1].p && phases[i].p < phases[i+1].p) stops.push({'phase':0,'pc':phases[i].pc.toFixed(2)})
				if(phases[i].p > phases[i-1].p && phases[i].p > phases[i+1].p) stops.push({'phase':1,'pc':phases[i].pc.toFixed(2)})
			}
			stops.push({'phase':phases[phases.length-1].p.toFixed(2),'pc':100});
			var grad = "0";
			for(var i = 0; i < stops.length; i++){
				grad += "-rgb("+(stops[i].phase < 0.5 ? 225 : 255)+", "+(stops[i].phase < 0.5 ? 244 : 255)+", "+(stops[i].phase < 0.5 ? 254 : 255)+"):"+stops[i].pc;
			}
			paper.rect(padd.left+(leap*dx),getY(y,miny,maxy),(w-padd.left-padd.right-leap*dx),dy).attr({'fill':grad,'stroke':0});
		}

		// Draw key
		var s = 5;
		var y = 20;
		var xoff = w-padd.right-140;
		var yoff = padd.top + s;
		var canvi = new Array();
		$('#holder').prepend('<ul id="key"></ul>');
		// Extract the appropriate keys
		for(var i = 0; i < key.length; i++){
			if(key[i].code[0].indexOf('7.2')==0){
				// Append divs to hold key item
				$('#key').append('<li class="keyitem"><span id="'+key[i].code[0]+'" class="keysymbol"></span><span class="keylabel">'+key[i].label+'</span></li>');
				canvi.push(Raphael(key[i].code[0],s*2,s*2));
				getObjectPath(key[i].code[0],s*2,s*2,5,canvi[canvi.length-1],{'title':key[i].label});
			}
		}

		// Draw month boundaries
		for(var m = 0; m <= months.length; m++){
			path = '';
			for(var y = miny; y < maxy; y++){
				months[1] = (isLeapYear(y) ? 29 : 28);
				days = (isLeapYear(y) ? 0 : 1);
				for(var m2 = 0; m2 < m; m2++) days += months[m2];

				path += (!path) ? 'M':'L'
				// For best anti-aliasing we want the x-coordinate to be shifted 0.5 pixels
				path += (Math.round(getX(days)-0.5)+0.5)+','+getY(y)+'l0,'+dy;
			}
			paper.path(path).attr({'stroke':colours.blue[0],'stroke-width':0.5})
		}

		// Loop over each Lunar eclipse adding it to the chart
		for(var i = 0; i < lunar.length; i++){
			if(lunar[i].y >= miny && lunar[i].y < maxy){
				avm = "";
				if(lunar[i]['type'][0]=='T') avm = "7.2.2.1";
				if(lunar[i]['type'][0]=='P') avm = "7.2.2.2";
				if(lunar[i]['type'][0]=='N') avm = "7.2.2.3";
				if(avm){
					d = new Date(lunar[i].date);
					attr = {'title':d.toDateString()};
					if(lunar[i].y >= 1996) attr.cursor = 'pointer';
					p = drawObject(avm,getX(lunar[i].d.getDOY())+(dx/2)+(isLeapYear(lunar[i].y) ? 0 : dx),getY(lunar[i].y)+dy/2,dy*0.4,attr);
					// Add event to object
					var j = i;
					p.obj.data('i',i).click(function(e){ goTo('lunar',this.data("i")); });
				}
			}
		}
		// Loop over each Solar eclipse adding it to the chart
		for(var i = 0; i < solar.length; i++){
			if(solar[i].y >= miny && solar[i].y < maxy){
				avm = "";
				if(solar[i]['type'][0]=='T') avm = "7.2.1.1";
				if(solar[i]['type'][0]=='P') avm = "7.2.1.2";
				if(solar[i]['type'][0]=='A') avm = "7.2.1.3";
				if(solar[i]['type'][0]=='H') avm = "7.2.1.4";
				if(avm){
					var j = i;
					d = new Date(solar[i].date);
					attr = {'title':d.toDateString()};
					if(solar[i].y >= 1996) attr.cursor = 'pointer';
					p = drawObject(avm,getX(solar[i].d.getDOY())+(dx/2)+(isLeapYear(solar[i].y) ? 0 : dx),getY(solar[i].y)+dy/2,dy*0.4,attr);
					// Add event to object
					p.obj.data('i',i).click(function(e){ goTo('solar',this.data("i")); });
				}
			}
		}

		// Add year labels
		for(var y = miny; y < maxy; y++){
			if(y%4==0){
				paper.text(padd.left/2,parseFloat(getY(y))+dy/2,y).attr({'fill':'black','stroke':0})
			}
		}

		// Add month labels
		var day = 1;		
		for(var m = 0; m < monthnames.length; m++){
			day += months[m]/2;
			x = parseFloat(getX(day));
			paper.text(x,padd.top+dy,monthnames[m]).attr({'fill':'black','stroke':0,'text-anchor':'middle'})
			day += months[m]/2;
		}

	}

	function dateFromDay(year, day){
		var date = new Date(year, 0); // initialize a date in `year-01-01`
		return new Date(date.setDate(day)); // add the number of days
	}

	function getX(x){
		mn = range.x[0];
		mx = range.x[1];
		return parseFloat((padd.left + (w-padd.left-padd.right)*(x-mn)/(mx-mn)).toFixed(1))
	}

	function getY(y){
		return parseFloat((padd.top + dy*2 + dy*(y-range.y[0])).toFixed(1))
	}


	function moonPhase(moondate){

		var Epoch = 2447891.5;
 
 		var JDnow = getJD(moondate);

		// here is where the previous calculations start
		// note the new way of calculating D -- the answer is the same
		D = JDnow - Epoch;                      // find diff from 31 Dec 1989
		var n = D * (360 / 365.242191);                         //no 46-3
		if(n > 0) n = n - Math.floor(Math.abs(n / 360)) * 360;    //no 46-3
		else n = n + (360 + Math.floor(Math.abs(n / 360)) * 360);  //no 46-3

		var Mo = n + 279.403303 - 282.768422;                   //no 46-4;
		if(Mo < 0) { Mo = Mo + 360 }                            //no 46-4
		var Ec = 360 * .016713 * Math.sin(Mo * 3.141592654 / 180) / 3.141592654;        //no 46-5
		var lamda = n + Ec + 279.403303;                        //no 46-6
		if(lamda > 360) { lamda = lamda - 360 }                 //no 46-6
		var l = 13.1763966 * D + 318.351648;                    //no 65-4
		if (l > 0) {
			l = l - Math.floor(Math.abs(l / 360)) * 360;  //no 65-4
		} else {
			l = l + (360 + Math.floor(Math.abs(l / 360)) * 360);  //no 65-4
		}
		var Mm = l - .1114041 * D - 36.34041;                   //no 65-5
		if (Mm > 0) {
			Mm = Mm - Math.floor(Math.abs(Mm / 360)) * 360;                       //no 65-5
		} else {
			Mm = Mm + (360 + Math.floor(Math.abs(Mm / 360)) * 360);                       //no 65-5
		}
		var N65 = 318.510107 - .0529539 * D;                    //no 65-6
		if (N65 > 0) {
			N65 = N65 - Math.floor(Math.abs(N65 / 360)) * 360;                    //no 65-6
		} else {
			N65 = N65 + (360 + Math.floor(Math.abs(N65 / 360)) * 360);                    //no 65-6
		}
		var Ev = 1.2739 * Math.sin((2 * (l - lamda) - Mm) * 3.141592654 / 180);         //no 65-7
		var Ae = .1858 * Math.sin(Mo * 3.141592654 / 180);      //no 65-8
		var A3 = .37 * Math.sin(Mo * 3.141592654 / 180);        //no 65-8
		var Mmp = Mm + Ev - Ae - A3;                            //no 65-9
		var Ec = 6.2886 * Math.sin(Mmp * 3.141592654 / 180);    //no 65-10
		var A4 = .214 * Math.sin((2 * Mmp) * 3.141592654 / 180);                        //no 65-11
		var lp = l + Ev + Ec - Ae + A4;                         //no 65-12
		var V = .6583 * Math.sin((2 * (lp - lamda)) * 3.141592654 / 180);               //no 65-13
		var lpp = lp + V;                                       //no 65-14
		var D67 = lpp - lamda;                                  //no 67-2
		return .5 * (1 - Math.cos(D67 * 3.141592654 / 180));      //no 67-3
	}

});

