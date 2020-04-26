var colours = {
	'red': ['#f04031','#f05948','#f68d69','#f9aa8f','#fee7dd'],
	'orange': ['#f6881f','#f9a04a','#fbb675','#fdcc9c','#ffe6d4'],
	'yellow': ['#ffcb06','#ffde00','#fff200','#fff79a','#fffcd5'],
	'yellowgreen': ['#b6c727','#cbd658','#dce57d','#e8eeae','#f2f6d5'],
	'green': ['#02a24b','#0ab26b','#67c18d','#9bd4ae','#e4f2e7'],
	'turquoise': ['#57b7aa','#89d0c8','#a8dbd5','#c5e6e1','#e3f3f2'],
	'other':['#5cb6ac','#83c4bb','','','#eaf5f5'],
	'blue': ['#00a2d3','#00b9e4','#48c7e9','#8fd7ed','#e1f4fe'],
	'lilac': ['#4f4c9a','#6e69b0','#8a84bf','#aaa5d1','#e8e7f2'],
	'purple': ['#662d8f','#7c52a1','#7d71b4','#af99c8','#e9e2ef'],
	'rose': ['#b72268','#c2567e','#cd7d94','#dba4b3','#f3e5e9'],
	'success':'#f04031',
	'fail':'#ffcb06'
}

/* CSV v0.1 */
function CSV(){

	this.toJSON = function(data,format,start,end,delim){

		if(typeof start!=="number") start = 1;

		var lines = this.toArray(data,delim);
		if(typeof end!=="number") end = lines.length;

		var header = lines[0];
		var simpleheader = JSON.parse(JSON.stringify(header));
		var line,datum,key,key2,f,i;
		var newdata = [];
		var lookup = {};
		// Work out a simplified (no spaces, all lowercase) version of the 
		// keys for matching against column headings.
		if(format){
			for(i in format){
				if(format[i]){
					key = i.replace(/ /g,"").toLowerCase();
					lookup[key] = i+'';
				}
			}
			for(i = 0; i < simpleheader.length; i++) simpleheader[i] = simpleheader[i].replace(/ /g,"").toLowerCase();
		}
		for(i = start; i < end; i++){
			line = lines[i];
			datum = {};
			if(line){
				for(var j=0; j < line.length; j++){
					key = header[j];
					key2 = simpleheader[j];
					if(format && lookup[key2]){
						key = lookup[key2];
						f = format[key];
						if(format[key].name) key = format[key].name;
						if(f.format=="number"){
							if(line[j]!=""){
								if(line[j]=="infinity" || line[j]=="Inf") datum[key] = Number.POSITIVE_INFINITY;
								else datum[key] = parseFloat(line[j]);
							}
						}else if(f.format=="date"){
							if(line[j]){
								line[j] = line[j].replace(/^"/,"").replace(/"$/,"");
								try {
									datum[key] = new Date(line[j]);
								}catch(err){
									this.log.warning('Invalid date '+line[j]);
									datum[key] = new Date('0001-01-01');
								}
							}else datum[key] = null;
						}else if(f.format=="boolean"){
							if(line[j]=="1" || line[j]=="true" || line[j]=="Y") datum[key] = true;
							else if(line[j]=="0" || line[j]=="false" || line[j]=="N") datum[key] = false;
							else datum[key] = null;
						}else{
							datum[key] = (line[j][0]=='"' && line[j][line[j].length-1]=='"') ? line[j].substring(1,line[j].length-1) : line[j];
						}
					}else{
						datum[key] = (line[j][0]=='"' && line[j][line[j].length-1]=='"') ? line[j].substring(1,line[j].length-1) : line[j];
					}
				}
				newdata.push(datum);
			}
		}
		return newdata;
	};

	/**
	 * CSVToArray parses any String of Data including '\r' '\n' characters,
	 * and returns an array with the rows of data.
	 * @param {String} str - the CSV string you need to parse
	 * @param {String} delim - the delimeter used to separate fields of data
	 * @returns {Array} rows - rows of CSV where first row are column headers
	 */
	this.toArray = function(str,delim){
		delim = (delim || ","); // user-supplied delimeter or default comma
		var pattern = new RegExp( // regular expression to parse the CSV values.
		 ( // Delimiters:
			"(\\" + delim + "|\\r?\\n|\\r|^)" +
			// Quoted fields.
			"(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
			// Standard fields.
			"([^\"\\" + delim + "\\r\\n]*))"
		 ), "gi"
		);

		var rows = [[]];  // array to hold our data. First row is column headers.
		// array to hold our individual pattern matching groups:
		var matches = false; // false if we don't find any matches
		// Loop until we no longer find a regular expression match
		while (matches = pattern.exec( str )) {
			var matched_delimiter = matches[1]; // Get the matched delimiter
			// Check if the delimiter has a length (and is not the start of string)
			// and if it matches field delimiter. If not, it is a row delimiter.
			if (matched_delimiter.length && matched_delimiter !== delim) {
			 // Since this is a new row of data, add an empty row to the array.
			 rows.push( [] );
			}
			var matched_value;
			// Once we have eliminated the delimiter, check to see
			// what kind of value was captured (quoted or unquoted):
			if (matches[2]) { // found quoted value. unescape any double quotes.
			matched_value = matches[2].replace(
			  new RegExp( "\"\"", "g" ), "\""
			);
			} else { // found a non-quoted value
			 matched_value = matches[3];
			}
			// Now that we have our value string, let's add
			// it to the data array.
			rows[rows.length - 1].push(matched_value);
		}
		return rows; // Return the parsed data Array
	};

	return this;
}

S(document).ready(function(){

	var stars = [];
	var signals = [];
	var csv = new CSV();
	var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];


	S().ajax("lightsphere_stars.csv",{
		"dataType": "text",
		"success":function(d){
			stars = csv.toJSON(d,{'Star':{'name':'name'},'Number of known planets':{'format':'number','name':'planets'},'Distance (light years)':{'format':'number','name':'distance'},'angle':{'format':'number'}});
			S().ajax("lightsphere.csv",{
				"dataType": "text",
				"success":function(d){
					signals = csv.toJSON(d,{'Sent':{'name':'sent'},'Label':{'name':'label'},'angle':{'format':'number'}});
					for(var i = 0; i < signals.length; i++){
						d = new Date(signals[i].sent);
						signals[i].datestr = months[d.getMonth()]+' '+d.getFullYear();
						signals[i].date = d;
					}
					drawIt(signals,stars);
				}
			});
		
		}
	
	});


	var w = 1280;
	var h = 720;
	var xoff = 50;
	var yoff = h - 50;
	var d = Math.sqrt(Math.pow(w-xoff,2) + Math.pow(h-yoff,2))*0.95;

	function drawIt(signals,stars){

		var build = false;

		if(S('#lightspheres').length==0) build = true;

		function makeArc(r){
			return 'M '+r+','+h+' A '+r+', '+r+', 0, 0, 0, 0, '+(h-r)+' l -2,0 0,'+r+'';
		}

		maxtime = 0;
		now = new Date();
		for(var i = 0; i < signals.length; i++){
			diff = (now-signals[i].date);
			if(diff > maxtime) maxtime = diff;
		}

		if(build){

			scale = d*86400000*365.25/maxtime;

			var svg = '<svg id="lightspheres" width="'+w+'px" height="'+h+'px" viewBox="-'+xoff+' -'+yoff+' '+(w)+' '+(h)+'" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet">';

			for(var i = 0; i < signals.length; i++){
				diff = (now-signals[i].date);
				svg += '<g class="signal">';
				svg += '<circle id="signal-'+i+'" cx="0" cy="0" r="'+(d*diff/maxtime)+'" style="stroke:white;stroke-width:1.5px;fill:none;vector-effect:non-scaling-stroke;fill:'+colours.purple[0]+';fill-opacity:0.02;"></circle>';
				svg += '<text x="0" y="-7" font-size="10px" dominant-baseline="middle" transform="rotate('+((signals[i].angle+90)%360)+')"><textPath href="#signal-'+i+'" startOffset="50%" text-anchor="middle" side="left"><tspan style="font-weight:500;">'+signals[i].label+'</tspan> <tspan style="font-weight:300;">'+signals[i].datestr+'</tspan></textPath></text>';
				svg += '</g>';
			}

			for(var i = 0; i < stars.length; i++){
				x = 0;
				y = 0;
				r = stars[i].distance*scale;	// Distance in pixels
				a = (Math.random()*Math.PI/4) + Math.PI/15;
				if(stars[i].angle) a = (stars[i].angle)*Math.PI/180;
				x = r*Math.sin(a);
				y = -r*Math.cos(a);
				
				svg += '<g id="star-'+i+'" class="star">';
				svg += '<circle cx="'+x+'" cy="'+y+'" r="5" style="fill:'+colours.red[0]+';"></circle>';
				svg += '<text x="'+(x+10)+'" y="'+(y)+'" font-size="10px" dominant-baseline="middle" text-anchor="start" style="fill:black;"><tspan x="'+(x+10)+'" dy="0" style="font-weight:500;">'+stars[i].name+'</tspan>'+(stars[i].planets > 0 ? '<tspan x="'+(x+10)+'" dy="12" style="font-weight:300;">'+stars[i].planets+' planet'+(stars[i].planets==1 ? '':'s')+'</tspan>' : '')+'</text>';
				svg += '</g>';

			}

			for(var i = 0; i < signals.length; i++){
				diff = (now-signals[i].date);
			}

			svg += '<circle id="earth" cx="0" cy="0" r="40" style="fill:'+colours.green[3]+'"></circle>';
			svg += '<text x="0" y="0" font-size="10px" dominant-baseline="middle" text-anchor="middle">Earth</text>';

			svg += '</svg>';
			
		}

		S('#lightspheres-holder').html(svg);

		for(var i = 0; i < stars.length; i++){
			stars[i].el = S('#star-'+i);
		}


		S('.signal').on('mouseover',function(e){
			selectSignal(e.currentTarget.querySelector('circle').getAttribute('id').replace(/signal-/,""));
		});
		S('#earth').on('mouseover',function(e){ selectSignal(-1); });
		//S('#content').on('mouseleave',function(e){ selectSignal(-1); });
	}
	
	function selectSignal(s){
		var ly = 0;
		if(s >= 0) ly = (now-signals[s].date)/(86400000*365.25);
		for(var i = 0; i < stars.length; i++){
			if(stars[i].distance <= ly) stars[i].el.addClass('reached');
			else stars[i].el.removeClass('reached');
		}
	}


});