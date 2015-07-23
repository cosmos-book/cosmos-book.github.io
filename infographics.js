function r(f){/in/.test(document.readyState)?setTimeout('r('+f+')',9):f()}

// Defaults for infographics examples
var h = 1250;
var w = 1909;
var mid = {'x': w/2,'y':h/2};
var files_to_load = 0;

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

// Make a donut/ring shape
// x,y = centre coordinates
// r = radius of inner circle
// R = radius of outer circle
function donut(x, y, r, R) {
	var y1 = y+R;
	var y2 = y+r;
	var path = 'M'+x+' '+y1+ 'A'+R+' '+R+' 0 1 1 '+(x+0.001)+' '+y1; // Outer circle
	path += 'M'+x+' '+y2+ 'A'+r+' '+r+' 0 1 0 '+(x-0.001)+' '+y2;    // Inner Circle
	return path;
};

// Some useful functions
function scaleCanvas(s){
	h *= s;
	w *= s;
	mid.x *= s;
	mid.y *= s;
}
function loadFILE(file,fn,attrs,t){

	if(!attrs) attrs = {};
	attrs['_file'] = file;
	$.ajax({
		type: "GET",
		url: file,
		dataType: t,
		success: function(data) {
			files_to_load++;
			if(typeof fn==="function") fn.call(this,data,attrs);
		},
		error: function (request, status, error) {
			console.log('error loading '+file)
			console.log(request.responseText);
		}
	});
}

function loadJSON(file,fn,attrs,t){ loadFILE(file,fn,attrs,"json"); }
function loadCSV(file,fn,attrs,t){ loadFILE(file,fn,attrs,"text"); }
function loadDAT(file,fn,attrs,t){ loadFILE(file,fn,attrs,"text"); }

function Fixed2JSON(data,format,start){

	if(typeof start!=="number") start = 1;

	if(typeof data==="string") data = data.split(/[\n\r]/);

	var newdata = new Array();
	var tmp = "";

	// Work out the format of each field
	for(var f = 0; f < format.length; f++){
		if(format[f].format){
			format[f].typ = format[f].format[0];
			format[f].len = parseFloat(format[f].format.substr(1));
		}
	}

	// Parse each line
	for(var i = start; i < data.length; i++){
		datum = {};
		idx = 0;
		for(var j = 0; j < format.length; j++){
			if(format[j]){
				tmp = data[i].substr(idx,parseInt(format[j].len))

				if(format[j].typ=="F"){
					if(tmp=="infinity" || tmp=="Inf") datum[format[j].name] = Number.POSITIVE_INFINITY;
					else datum[format[j].name] = parseFloat(tmp.replace(/[^0-9\+\-\.Ee]/,""));
				}else if(format[j].typ=="I"){
					if(tmp=="infinity" || tmp=="Inf") datum[format[j].name] = Number.POSITIVE_INFINITY;
					else datum[format[j].name] = parseInt(tmp.replace(/ /,""));
				}else if(format[j].format=="D"){
					datum[format[j].name] = new Date(tmp);
				}else if(format[j].format=="B"){
					if(tmp=="1" || tmp=="true") datum[format[j].name] = true;
					else if(tmp=="0" || tmp=="false") datum[format[j].name] = false;
					else datum[format[j].name] = null;
				}else{
					datum[format[j].name] = (tmp[0]=='"' && tmp[tmp.length-1]=='"') ? tmp.substring(1,tmp.length-1) : tmp;
					datum[format[j].name] = datum[format[j].name].replace(/ +$/,'');	// Remove trailing spaces
				}
				idx += parseInt(format[j].len);
			}else datum[j] = null;
		}
		newdata.push(datum);
	}

	return newdata;
}

function CSV2JSON(data,format,start,end){

	if(typeof start!=="number") start = 1;
	var delim = ",";

	if(typeof data==="string"){
		data = data.split(/[\n\r]/);
	}
	if(typeof end!=="number") end = data.length;

	if(data[0].indexOf("\t") > 0) delim = /\t/;
	
	var line,datum;
	var newdata = new Array();

	for(var i = start; i < end; i++){
		line = data[i].split(delim);
		datum = {};
		for(var j=0; j < line.length; j++){
			if(format[j]){
				if(format[j].format=="number"){
					if(line[j]!=""){
						if(line[j]=="infinity" || line[j]=="Inf") datum[format[j].name] = Number.POSITIVE_INFINITY;
						else datum[format[j].name] = parseFloat(line[j]);
					}
				}else if(format[j].format=="eval"){
					if(line[j]!="") datum[format[j].name] = eval(line[j]);
				}else if(format[j].format=="date"){
					datum[format[j].name] = new Date(line[j].replace(/^"/,"").replace(/"$/,""));
				}else if(format[j].format=="boolean"){
					if(line[j]=="1" || line[j]=="true") datum[format[j].name] = true;
					else if(line[j]=="0" || line[j]=="false") datum[format[j].name] = false;
					else datum[format[j].name] = null;
				}else{
					datum[format[j].name] = (line[j][0]=='"' && line[j][line[j].length-1]=='"') ? line[j].substring(1,line[j].length-1) : line[j];
				}
			}else{
				datum[j] = (line[j][0]=='"' && line[j][line[j].length-1]=='"') ? line[j].substring(1,line[j].length-1) : line[j];
			}
		}
		newdata.push(datum);
	}
	return newdata;
}


function capitaliseFirstLetter(string){
	return string.charAt(0).toUpperCase() + string.slice(1);
}
function parseHTML(txt){
	var div = document.createElement("div");
	div.innerHTML = txt;
	return div.innerHTML;
}
function savesvg(n){
	var canvas_ = document.getElementById((typeof n==="string" ? n : "canvas"));
	var text = (new XMLSerializer()).serializeToString(canvas_);
	var encodedText = encodeURIComponent(text);
	open("data:image/svg+xml," + encodedText);
}


// Add commas every 10^3
function addCommas(nStr) {
	nStr += '';
	var x = nStr.split('.');
	var x1 = x[0];
	var x2 = x.length > 1 ? '.' + x[1] : '';
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)) {
		x1 = x1.replace(rgx, '$1' + ',' + '$2');
	}
	return x1 + x2;
}

// Get the URL query string and parse it
function queryString() {
	var p = {length:0};
	var q = location.search;
	var val,key,bits;
	if(q && q != '#'){
		// remove the leading ? and trailing &
		q = q.replace(/^\?/,'').replace(/\&$/,'');
		bits = q.split('&');
		for(var i = 0; i < bits.length; i++){
			key = bits[i].split('=')[0];
			val = bits[i].split('=')[1];
			// convert floats
			if(/^-?[0-9.]+$/.test(val)) val = parseFloat(val);
			if(val == "true") val = true;
			if(val == "false") val = false;
			if(/^\?[0-9\.]+$/.test(val)) val = parseFloat(val);	// convert floats
			if(!p[key]){
				p.length++;
				if(typeof val==="string") val = val.replace(/%20/,' ')
				p[key] = val;
			}else{
				if(typeof p[key]==="string"){
					var old = p[key];
					p[key] = new Array();
					p[key].push(old);
				}
				p[key].push(val);
			}
		}
	}
	return p;
};

// Function to update the history
// qs = query string
// fn = call back function
function addHistory(qs,fn,a){
	if(!!(window.history && history.pushState)){
		history.pushState({},"Guide","?"+qs);
	}
	if(typeof fn==="function") fn.call(this,a)
}

// Make a tooltip providing the selector and a callback function to add content
// tooltip({
//     'elements':$('.selector'),
//     'html':function(){}
// )
function tooltip(data){
	data.elements.on('mouseover click',{data:data},function(d){
		//$('.tooltip').remove();
		var text = d.data.data.html.call(this);
		var l = parseInt($(this).offset().left);
		var t = parseInt($(this).offset().top);
		if($('.tooltip').length == 0) $('body').append('<div class="tooltip"><div class="tooltip_inner">'+text+'<\/div><\/div>');
		else $('.tooltip_inner').html(text);

		var fs = parseInt($('.tooltip').css('font-size'));
		var dx = $(this).width()/2;

		var x = l+dx;
		var y = t+dx;
		var c = "right";

		if(x+$('.tooltip').width()+fs*2 > $('.innerbox').width()){
			x = l-$('.tooltip').width()+dx;
			c = "left";
		}
		if(y+$('.tooltip').height()+fs*2 > $('.innerbox').height()){
			y = t-$('.tooltip').height()+dx;
			c += " bottom";
		}
		$('.tooltip').css({'left':x,'top':y}).removeClass('right').removeClass('left').removeClass('bottom').addClass(c);

	})
}


