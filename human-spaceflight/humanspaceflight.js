// Creates an x-y data plot. The data points are created as <a> elements 
// within a holding element. The data file can be provided in the HTML
// document as a 'data' attribute of an element with the ID 'data'
var series;

(function(){

	//####################################################
	// Define some user variables
	var graph_cls = "innerbox"; // The CSS class for the element holding the data
	var data_cls = "human";     // The CSS class used for each data point

	// Categories used to update DOM elements with the total for that category e.g. class="<category>_count"
	var categories = ['astronaut','cosmonaut','taikonaut','international','tourist','inorbit'];

	// Define the order of the columns in the data file. The key for a column is set by 
	// 'name'. An optional 'format' can be provided.
	var data_format = [{'name':'name'},{'name':'country'},{'name':'gender'},{'name':'dob','format':'date'},{'name':'time_space_days','format':'number'},{'name':'time_space','format':'number'},{'name':'time_eva','format':'number'},{'name':'launches','format':'number'},{'name':'evas','format':'number'},{'name':'firstlaunch','format':'date'},{'name':'time_dilation','format':'number'},{'name':'firstlaunch_age','format':'number'},{'name':'qualifications','format':'string'},{'name':'missions','format':'string'},{'name':'longest_trip','format':'number'},{'name':'distance','format':'number'},{'name':'eva_string','format':'string'},{'name':'category','format':'string'},{'name':'file','format':'string'},{'name':'inspaceasof','format':'date'},{'name':'twitter','format':'string'}];

	// Define properties of the axes (these keys should match the data keys)
	var axes = {
		'name': {
			'default': true
		},
		'time_space_days': {
			'scale': 'log',
			'formatLabel': function(s,j){ return (s==0 ? j+' day'+(j>1 ? 's':''): ''); }
		},
		'longest_trip': {
			'samescaleas': 'time_space_days',
			'scale': 'log',
			'formatLabel': function(s,j){ return (s==0 ? j+' day'+(j>1 ? 's':''): ''); }
		},
		'dob': {
			'scale': 'linear',
			'gridlines': function(d){
				// Date-of-birth - we will put lines every decade
				var step = 10;
				var a = Math.ceil(d.min.getFullYear()/step)*step;
				var b = Math.floor(d.max.getFullYear()/step)*step;
				var day;
				var html = "";
				for(var i = a; i <= b; i += step){
					// Create a date at the start of the year
					day = new Date(2015,1,1,0,0,0);
					// Update the year
					x = getX(day.setFullYear(i),d.typ,d.min,d.max);
					html += '<div class="gridline" style="'+styleGridLine(d.axis,x)+'"><span class="label">'+i+'<\/span><\/div>';
				}
				return html;
			}
		},
		'time_eva': {
			'scale': 'linear',
			'formatLabel': function(i){ return (i/3600)+' hr'; },
			'step': function(d){ return getGridSpacing(d.min*1000,d.max*1000,true)/1000; }
		},
		'time_dilation': {
			'formatLabel': function(i){ return (i*1000)+' ms'; },
			'step': function(d){ return getGridSpacing(d.min*1000,d.max*1000,true)/1000; }
		},
		'firstlaunch_age': {
			'scale': 'linear',
			'formatLabel': function(i){ return i+' yr'; },
			'step': 5
		},
		'launches': {
			'scale': 'linear',
			'step': 1
		},
		'country': {},
		'gender': {}
	}

	// ISO (and other) country code conversion
	var cc = {'ABW':'Aruba','AFG':'Afghanistan','AGO':'Angola','AIA':'Anguilla','ALA':'&Aring;land Islands','ALB':'Albania','AND':'Andorra','ARE':'United Arab Emirates','ARG':'Argentina','ARM':'Armenia','ASM':'American Samoa','ATA':'Antarctica','ATF':'French Southern Territories','ATG':'Antigua and Barbuda','AUS':'Australia','AUT':'Austria','AZE':'Azerbaijan','BDI':'Burundi','BEL':'Belgium','BEN':'Benin','BES':'Bonaire, Sint Eustatius and Saba','BFA':'Burkina Faso','BGD':'Bangladesh','BGR':'Bulgaria','BHR':'Bahrain','BHS':'Bahamas','BIH':'Bosnia and Herzegovina','BLM':'Saint Barthélemy','BLR':'Belarus','BLZ':'Belize','BMU':'Bermuda','BOL':'Bolivia, Plurinational State of','BRA':'Brazil','BRB':'Barbados','BRN':'Brunei Darussalam','BTN':'Bhutan','BVT':'Bouvet Island','BWA':'Botswana','CAF':'Central African Republic','CAN':'Canada','CCK':'Cocos (Keeling) Islands','CHE':'Switzerland','CHL':'Chile','CHN':'China','CIV':'Côte d\'Ivoire','CMR':'Cameroon','COD':'Congo, the Democratic Republic of the','COG':'Congo','COK':'Cook Islands','COL':'Colombia','COM':'Comoros','CPV':'Cabo Verde','CRI':'Costa Rica','CUB':'Cuba','CUW':'Curaçao','CXR':'Christmas Island','CYM':'Cayman Islands','CYP':'Cyprus','CZE':'Czech Republic','DEU':'Germany','DJI':'Djibouti','DMA':'Dominica','DNK':'Denmark','DOM':'Dominican Republic','DZA':'Algeria','ECU':'Ecuador','EGY':'Egypt','ERI':'Eritrea','ESH':'Western Sahara','ESP':'Spain','EST':'Estonia','ETH':'Ethiopia','FIN':'Finland','FJI':'Fiji','FLK':'Falkland Islands (Malvinas)','FRA':'France','FRO':'Faroe Islands','FSM':'Micronesia, Federated States of','GAB':'Gabon','GBR':'United Kingdom','GEO':'Georgia','GGY':'Guernsey','GHA':'Ghana',	'GIB':'Gibraltar','GIN':'Guinea','GLP':'Guadeloupe','GMB':'Gambia','GNB':'Guinea-Bissau','GNQ':'Equatorial Guinea','GRC':'Greece','GRD':'Grenada','GRL':'Greenland','GTM':'Guatemala','GUF':'French Guiana','GUM':'Guam','GUY':'Guyana','HKG':'Hong Kong','HMD':'Heard Island and McDonald Islands','HND':'Honduras','HRV':'Croatia','HTI':'Haiti','HUN':'Hungary','IDN':'Indonesia','IMN':'Isle of Man','IND':'India','IOT':'British Indian Ocean Territory','IRL':'Ireland','IRN':'Iran, Islamic Republic of','IRQ':'Iraq','ISL':'Iceland','ISR':'Israel','ITA':'Italy','JAM':'Jamaica','JEY':'Jersey','JOR':'Jordan','JPN':'Japan','KAZ':'Kazakhstan','KEN':'Kenya','KGZ':'Kyrgyzstan','KHM':'Cambodia','KIR':'Kiribati','KNA':'Saint Kitts and Nevis','KOR':'Korea, Republic of','KWT':'Kuwait','LAO':'Lao People\'s Democratic Republic','LBN':'Lebanon','LBR':'Liberia','LBY':'Libya','LCA':'Saint Lucia','LIE':'Liechtenstein','LKA':'Sri Lanka','LSO':'Lesotho','LTU':'Lithuania','LUX':'Luxembourg','LVA':'Latvia','MAC':'Macao','MAF':'Saint Martin (French part)','MAR':'Morocco','MCO':'Monaco','MDA':'Moldova, Republic of','MDG':'Madagascar','MDV':'Maldives','MEX':'Mexico','MHL':'Marshall Islands','MKD':'Macedonia, the former Yugoslav Republic of','MLI':'Mali','MLT':'Malta','MMR':'Myanmar','MNE':'Montenegro','MNG':'Mongolia','MNP':'Northern Mariana Islands','MOZ':'Mozambique','MRT':'Mauritania','MSR':'Montserrat','MTQ':'Martinique','MUS':'Mauritius','MWI':'Malawi','MYS':'Malaysia','MYT':'Mayotte','NAM':'Namibia','NCL':'New Caledonia','NER':'Niger','NFK':'Norfolk Island','NGA':'Nigeria','NIC':'Nicaragua','NIU':'Niue',	'NLD':'Netherlands','NOR':'Norway','NPL':'Nepal','NRU':'Nauru','NZL':'New Zealand','OMN':'Oman','PAK':'Pakistan','PAN':'Panama','PCN':'Pitcairn','PER':'Peru','PHL':'Philippines','PLW':'Palau','PNG':'Papua New Guinea','POL':'Poland','PRI':'Puerto Rico','PRK':'Korea, Democratic People\'s Republic of','PRT':'Portugal','PRY':'Paraguay','PSE':'Palestine, State of','PYF':'French Polynesia','QAT':'Qatar','REU':'Réunion','ROU':'Romania','RUS':'Russian Federation','RWA':'Rwanda','SAU':'Saudi Arabia','SDN':'Sudan','SEN':'Senegal','SGP':'Singapore','SGS':'South Georgia and the South Sandwich Islands','SHN':'Saint Helena, Ascension and Tristan da Cunha','SJM':'Svalbard and Jan Mayen','SLB':'Solomon Islands','SLE':'Sierra Leone','SLV':'El Salvador','SMR':'San Marino','SOM':'Somalia','SPM':'Saint Pierre and Miquelon','SRB':'Serbia','SSD':'South Sudan','STP':'Sao Tome and Principe','SUR':'Suriname','SVK':'Slovakia','SVN':'Slovenia','SWE':'Sweden','SWZ':'Swaziland','SXM':'Sint Maarten (Dutch part)','SYC':'Seychelles','SYR':'Syrian Arab Republic','TCA':'Turks and Caicos Islands','TCD':'Chad','TGO':'Togo','THA':'Thailand','TJK':'Tajikistan','TKL':'Tokelau','TKM':'Turkmenistan','TLS':'Timor-Leste','TON':'Tonga','TTO':'Trinidad and Tobago','TUN':'Tunisia','TUR':'Turkey','TUV':'Tuvalu','TWN':'Taiwan, Province of China','TZA':'Tanzania, United Republic of','UGA':'Uganda','UKR':'Ukraine','UMI':'United States Minor Outlying Islands','URY':'Uruguay','USA':'United States','UZB':'Uzbekistan','VAT':'Holy See (Vatican City State)','VCT':'Saint Vincent and the Grenadines','VEN':'Venezuela, Bolivarian Republic of','VGB':'Virgin Islands, British','VIR':'Virgin Islands, U.S.','VNM':'Viet Nam','VUT':'Vanuatu','WLF':'Wallis and Futuna','WSM':'Samoa','YEM':'Yemen','ZAF':'South Africa','ZMB':'Zambia','ZWE':'Zimbabwe','URS':'Soviet Union','GDR':'East Germany','TCH':'Czechoslovakia'};

	// User-defined functions
	var fn = {
		'preprocessDatum':function(a){
			var now = new Date();	// Get the time for now

			// Update time in space for astronauts currently in space
			if(a.inspaceasof != null) a.time_space_days = parseFloat((a.time_space_days_original + ((now-a.inspaceasof)/(1000*86400))).toFixed(2));

			// If they've only had one launch, their longest trip should be the same as their time in space
			if(a.launches == 1 && a.time_space_days > a.longest_trip) a.longest_trip = a.time_space_days;

			// We are only including them if they've been in space
			if(a.time_space_days <= 0) a.showongraph = false;

			return a;
		},
		'tooltip':function(a){
			// Build the text output - this will depend on the structure of your data
			var text = '<div class="stripe '+a.category+'"><\/div><h3>'+a.name+'<\/h3><table>';
			text += '<tr><td>Gender:<\/td><td>'+a.gender+'<\/td><\/tr>';
			text += '<tr><td>Country:<\/td><td>'+formatArray(a.country,cc)+'<\/td><\/tr>';
			text += '<tr><td>Year of birth:<\/td><td>'+a.dob.getFullYear()+'<\/td><\/tr>';
			text += '<tr><td>Age at first launch:<\/td><td>'+a.firstlaunch_age+' years<\/td><\/tr>';
			text += '<tr><td>Launches:<\/td><td>'+a.launches+'<\/td><\/tr>';
			text += '<tr><td>Time in space:<\/td><td>'+a.time_space_days+' days<\/td><\/tr>';
			if(a.time_eva > 0) text += '<tr><td>Total EVA:<\/td><td>'+parseInt(a.eva_string.substr(0,a.eva_string.lastIndexOf(":")))+' hours '+parseInt(a.eva_string.substr(a.eva_string.lastIndexOf(":")+1))+' mins<\/td><\/tr>';
			text += '<tr><td>Missions:<\/td><td>'+formatArray(a.missions)+'<\/td><\/tr>';
			if(a.twitter) text += '<tr><td>Twitter:<\/td><td><a href="https://twitter.com/'+a.twitter+'">@'+a.twitter+'</a><\/td><\/tr>';
			if(a.inspaceasof != null) text += '<tr><td>Notes:<\/td><td>Currently in space<\/td><\/tr>';
			text += '<\/table>';
			text += '<a href="https://github.com/cosmos-book/cosmos-book.github.io/tree/master/human-spaceflight/data/'+a.file+'" class="repo">data file<\/a>';
			return text;
		}
	}
	var filter = { 'by':'name', 'placeholder': 'Filter by name e.g. \'Armstrong\'' };
	//####################################################
	
	
	// Some variables that will be used later
	var xaxis;
	var yaxis;


	// Once the DOM is available for use we call this
	$(document).ready(function(){

		// Extract the relative path from the 'href' or 'data' attribute of the element 
		// identified by the selector. Allows you to put this path in the HTML. Alternatively,
		// you can just hard-code the path here.
		var filename = getDataPath('#data'); 

		// Load the data file and call the function in the second argument once loaded. 
		// Other data/attributes can be sent in the third argument.
		loadFILE(filename,parseData,{},"text");

		// Hide any DOM elements with the class "noscript"
		$('.noscript').hide();

		// Stop form submitting when return key is pressed
		$('form').on('submit',function(e){ e.preventDefault(); });

		yaxis = $('#yaxis').val();

		// Add events to deal with changes to the drop down <select> lists
		// These have the IDs 'yaxis' and 'xaxis'
		$('#yaxis').on('change',function(){

			// Sort our data by the default field first
			for(var v in axes){
				if(axes[v]['default']) sortBy(v);
			}

			// Now sort by the selected field
			sortBy($(this).val());

			// Update the plot
			updateGraph();

			// Close any open tooltips
			$('.tooltip_close').trigger('click');

		});
		$('#xaxis').on('change',function(){

			// Set the x-axis value
			xaxis = $(this).val();

			// Update the plot
			updateGraph();

			// Close any open tooltips
			$('.tooltip_close').trigger('click')
		});

	});

	// Define helper functions
	function loadFILE(file,fn,attrs,t){

		// If we haven't got an attribute structure we make one
		if(!attrs) attrs = {};

		// Keep a copy of the filename
		attrs['_file'] = file;

		// Call the jQuery function to load the file
		$.ajax({
			type: "GET",
			url: file,
			dataType: t,
			success: function(data) {
				if(typeof fn==="function") fn.call((attrs['this'] ? attrs['this'] : this),data,attrs);
			},
			error: function (request, status, error) {
				console.log('error loading '+file)
				console.log(request.responseText);
				if(typeof attrs.error==="function") attrs.error.call((attrs['this'] ? attrs['this'] : this),data,attrs);
			}
		});
	}

	// Function to get the relative path of the data file
	function getDataPath(el){
		var url = "";
		// If there is a data attribute we use that
		if($(el).attr('data')){
			url = $(el).attr('data');
		}else if($(el).attr('href')){
			// Check if there is a href attribute instead.
			if($(el).attr('href').indexOf('blob/master/') > 0){
				// If it is a Github blog/master link, fix it.
				url = $(el).attr('href').substr($(el).attr('href').indexOf('blob/master/')+12)
			}else{
				url = $(el).attr('href');
			}
		}
		var loc = window.location || location;
		if(loc.hostname && loc.href.indexOf(loc.hostname) > 0){
			var path = location.href.substring(location.href.indexOf(loc.hostname)+(loc.hostname.length+1),location.href.lastIndexOf('/')+1);
			if(url.lastIndexOf(path)>=0) url = url.substr(url.lastIndexOf(path)+path.length);
		}
		return url;
	}

	// A function to parse a CSV text file into columns
	// Inputs:
	// 1) data - the string of text making up the file
	// 2) format - an array of the form:
	//             [{'name':'country'},{'name':'dob','format':'date'},{'name':'launches','format':'number'}
	//             available formats are: 'string', 'number', 'date', 'boolean'
	// 3) start - an optional line number from which to start parsing data from
	// 4) end - an optional line number to stop parsing data
	function CSV2JSON(data,format,start,end){

		// If no starting line is provided, we'll assume the zeroth line is the column titles
		if(typeof start!=="number") start = 1;
		// Set the delimiter
		var delim = ",";

		// Split our string into an array of lines
		if(typeof data==="string"){
			data = data.replace(/\r/,'');
			data = data.split(/[\n]/);
		}
		if(typeof end!=="number") end = data.length;

		// If we find tabs in the first line we'll change our delimiter to those
		if(data[0].indexOf("\t") > 0) delim = /\t/;

		var line,datum;

		// Create an empty array to hold our parsed data
		var newdata = new Array();

		// Loop over each row of data
		for(var i = start; i < end; i++){
			// Split this row by our delimiter
			line = data[i].split(delim);
			datum = {};
			// Loop over each column
			for(var j=0; j < line.length; j++){
				if(format[j]){
					// If a format is provided for this column, we'll attempt to coerse the value to that type
					if(format[j].format=="number"){
						if(line[j]!=""){
							if(line[j]=="infinity" || line[j]=="Inf") datum[format[j].name] = Number.POSITIVE_INFINITY;
							else datum[format[j].name] = parseFloat(line[j]);
						}
					}else if(format[j].format=="eval"){
						if(line[j]!="") datum[format[j].name] = eval(line[j]);
					}else if(format[j].format=="date"){
						if(line[j]) datum[format[j].name] = new Date(line[j].replace(/^"/,"").replace(/"$/,""));
						else datum[format[j].name] = null;
					}else if(format[j].format=="boolean"){
						if(line[j]=="1" || line[j]=="true" || line[j]=="Y") datum[format[j].name] = true;
						else if(line[j]=="0" || line[j]=="false" || line[j]=="N") datum[format[j].name] = false;
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

	// Make a tooltip providing the selector and a callback function to add content
	// tooltip({
	//     'elements':$('.selector'),
	//     'html':function(){}
	// )
	// requires jQuery
	function tooltip(data){

		var existinghtml = "";

		function show(el,text){

			if(!text) return;
			var l = parseInt($(el).offset().left);
			var t = parseInt($(el).offset().top);
			var dx = ($(el).attr('r')) ? $(el).attr('r')*2 : ($(el).attr('d') ? Raphael.pathBBox($(el).attr('d')).width : parseInt($(el).outerWidth()));
			var dy = ($(el).attr('r')) ? $(el).attr('r')*2 : ($(el).attr('d') ? Raphael.pathBBox($(el).attr('d')).height : parseInt($(el).outerHeight()));
			var inner = ($('.'+graph_cls).length==1) ? $('.'+graph_cls) : ($('#content').length==1 ? $('#content') : $('#holder'));

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
		})
	}

	// Sort the data
	function sortBy(i){
		yaxis = i;
		series = series.sort(function (a, b) {
			return a[i] > b[i] ? 1 : -1;
		});
	}

	function formatArray(str,lookup){
		// Split array
		var arr = str.split(/;/);
		str = "";
		for(var i = 0 ; i < arr.length; i++){
			if(str) str += ", ";
			if(lookup) str += lookup[arr[i]];
			else str += arr[i];
		}
		return str;
	}

	// Function which is called once the data file has been loaded
	function parseData(data,attrs){

		// Parse the data from the CSV file
		series = CSV2JSON(data,data_format);

		// Assign each one an ID
		for(var i = 0; i < series.length; i++){
			series[i].id = i;
			// Keep a copy of the original number of days in space
			series[i].time_space_days_original = series[i].time_space_days;
		}

		// Draw the astronauts to the page
		drawGraph();

		// Make the name filter
		makeFilter(filter.by,filter.placeholder);

		// Set up the tooltip
		// To change the displayed contents, update the 'html' attribute
		tooltip({
			'elements':$('.'+data_cls),
			'html':function(){
				// Get the ID of the item selected
				var id = parseInt($(this).attr('id'));
				for(var i = 0; i < series.length; i++){ if(series[i].id==id) break; }
				
				return (typeof fn.tooltip==="function") ? fn.tooltip.call(this,series[i]) : '';
			}
		});

		// We can hide any loader/spinner as everything seems to be OK
		$('.loader').hide();
		$('.js-only').removeClass('js-only');
	}


	function drawGraph(){
		var output = '';
		for(var i = 0; i < series.length; i++) output += '<a href="#" id="'+series[i].id+'" class="'+data_cls+' '+series[i].category+''+(series[i].inspaceasof != null ? ' inorbit' : '')+'" title="'+series[i].name+'"><\/a>';
		$('.'+graph_cls).append(output);

		updateGraph();

		// Update our category counters (class="<category>_count")
		updateCounters();
	}

	function makeFilter(filterBy,placeholder){
		// Build the name filter and append it to the <form class="axes">
		var labl = $('<label>').attr({'for':'filter_text'}).html('Filter');
		var inpt = $('<input>').attr({'class':'filterinp','id':'filter_text','type':'text','placeholder':placeholder});
		$('form.axes').append('<div class="right"></div>')
		$('form.axes .right').append(labl).append(inpt);

		// Attach the change event to the name filter
		$(inpt).on('change',function(){
			var search = $(this).val().toLowerCase();
			$('a.unmatched').removeClass('unmatched');
			if(search){
				for(var i = 0,n = series.length; i < n ; i++){
					if(series[i][filterBy].toLowerCase().indexOf(search) < 0) $('#'+series[i].id).addClass('unmatched');
				}
			}
			updateCounters();
		}).on('keyup',function(){
			$(this).change();
		});

	}

	function updateCounters(){
		for(var i = 0; i < categories.length; i++) $('.'+categories[i]+'_count').html(' / '+$('.'+graph_cls+' .'+data_cls+'.'+categories[i]+':not(.unmatched)').length);
	}

	// Update all the drawn astronauts
	function updateGraph(){

		var now = new Date();	// Get the time for now
		var wide = $(window).width()-parseInt($('#0').width());
		var tall = $(window).height()-parseInt($('#0').height());
		var xoff = 0;
		var good = 0;
		var mx_x = -1e100;
		var mn_x = 1e100;
		var mx_y = -1e100;
		var mn_y = 1e100;
		var x,y;
		if(!xaxis) xaxis = $('#xaxis option:eq(0)').val();
		for(var i = 0; i < series.length; i++){

			series[i].showongraph = true;
			if(typeof fn.preprocessDatum==="function") series[i] = fn.preprocessDatum.call(this,series[i]);

			// Only process data points that appear on the graph
			if(series[i].showongraph){
				good++;
				// Use a dummy axis key to work out the minimum and maximum values as we
				// want the longest trip and total time in space to have the same scale.
				xaxistmp = (axes[xaxis].samescaleas || xaxis);
				yaxistmp = (axes[yaxis].samescaleas || yaxis);
				if(series[i][xaxistmp] > mx_x) mx_x = series[i][xaxistmp];
				if(series[i][xaxistmp] < mn_x) mn_x = series[i][xaxistmp];
				if(series[i][yaxistmp] > mx_y) mx_y = series[i][yaxistmp];
				if(series[i][yaxistmp] < mn_y) mn_y = series[i][yaxistmp];
			}
		}

		var output = "";
		var dy = 1/good;	// The fractional vertical spacing of our data points
		for(var i = 0, j = 0; i < series.length; i++){

			x = getX(series[i][xaxis],xaxis,mn_x,mx_x);

			if(axes[yaxis].scale=="linear") y = (series[i][yaxis]-mn_y)/(mx_y-mn_y);
			else if(axes[yaxis].scale=="log") y = (series[i][yaxis] >= 0 ? (Math.log10(series[i][yaxis])-Math.log10(mn_y))/(Math.log10(mx_y)-Math.log10(mn_y)) : 1);
			else y = j*dy;

			if(series[i].time_space_days == 0){
				x = -100;
				$('#'+series[i].id).remove();
			}else{
				j++;
				$('#'+series[i].id).css({'left':(100*x)+"%",'top':(100*y)+"%"});
			}
		}
		if($('.yaxis').length==0) $('.'+graph_cls).append('<div class="yaxis"><\/div>');
		if($('.xaxis').length==0) $('.'+graph_cls).append('<div class="xaxis"><\/div>');

		$('.xaxis').html(makeGridLines("x",xaxis,mx_x,mn_x));
		$('.yaxis').html(makeGridLines("y",yaxis,mx_y,mn_y));

	}

	function getX(v,axis,mn,mx){
		var x = 0;
		if(axis=="time_space_days" || axis=="longest_trip") x = (v >= 0 ? (Math.log10(v)-Math.log10(mn))/(Math.log10(mx)-Math.log10(mn)) : 1);
		else x = (v-mn)/(mx-mn);
		return x;
	}

	function styleGridLine(axis,v){
		if(axis == "x") return 'left:'+(100*v)+'%';
		else return 'top:'+(v*100)+'%';
	}

	function makeGridLines(axis,typ,mx,mn){
		var html = "";
		var x;

		// If we have a log scale we can define the gridlines using the data
		if(axes[typ].scale=="log"){
			// For log axes we have major and minor grid lines
			var steps = [1,2,3,4,5,6,7,8,9]
			for(var i = 0.1; i <= mx; i*=10){
				for(var s = 0; s < steps.length ; s++){
					j = i*steps[s];
					x = getX(j,typ,mn,mx);
					html += '<div class="gridline'+(s==0 ? ' majorgridline':'')+'" style="'+styleGridLine(axis,x)+'"><span class="label">'+(axes[typ].formatLabel ? axes[typ].formatLabel.call(this,s,j) : i)+'<\/span><\/div>';
				}
			}
		}else{
			// Not a log scale
			if(axes[typ]){
				// If a function is provided to create the grid lines, we use that
				if(typeof axes[typ].gridlines==="function"){
					html = axes[typ].gridlines.call(this,{'typ':typ,'axis':axis,'min':mn,'max':mx});
				}else{
					// No function provided so we build grid lines using the data
					var a,b,step;
					if(typeof axes[typ].step==="number"){
						// A step size has been provided
						step = axes[typ].step;
						a = Math.ceil(mn/step)*step;
						b = Math.floor(mx/step)*step;
					}else{
						// Estimate a good step
						step = getGridSpacing(mn*1000,mx*1000,true)/1000;
						a = mn;
						b = mx;
					}
					for(var i = a; i <= b; i+=step){
						x = getX(i,typ,mn,mx);
						html += '<div class="gridline" style="'+styleGridLine(axis,x)+'"><span class="label">'+(axes[typ].formatLabel ? axes[typ].formatLabel.call(this,i) : i)+'<\/span><\/div>';
					}
				}
			}
		}
	
		return html;
	}

	// Calculate reasonable grid line spacings
	function getGridSpacing(mn,mx,isDate){

		var spacing = 0;
		var steps,t_div,t_inc,n,s,sp,t_max,t_min,i;
		var rg = mx-mn;

		// The base system
		var base = 10;

		if(isDate){
			// Dates are in milliseconds
			// Grid line spacings can range from 1 ms to 10000 years
			steps = [{'name': 'seconds','div':1000,'spacings':[0.001,0.002,0.005,0.01,0.02,0.05,0.1,0.25,0.5,1,2,5,10,15]},
					{'name': 'minutes', 'div':60000,'spacings':[0.5,1,2,5,10,15,20,30]},
					{'name': 'hours', 'div':3600000,'spacings':[0.5,1,2,4,6]},
					{'name': 'days', 'div':86400000,'spacings':[0.5,1,2,7]},
					{'name': 'weeks', 'div':7*86400000,'spacings':[1,2,4,8]},
					{'name': 'years', 'div':31557600000,'spacings':[0.25,0.5,1,2,5,10,20,50,100,200,500,1000,2000,5000]}];

			for(s = 0; s < steps.length ; s++){
				for(sp = 0; sp < steps[s].spacings.length; sp++){
					n = Math.ceil(rg/(steps[s].div*steps[s].spacings[sp]));
					if(n < 1) continue;
					if(!t_div || (n > 3 && n < t_div)){
						t_div = n;
						spacing = {'name':steps[s].name,'fract':steps[s].spacings[sp]};
						t_inc = (steps[s].div*steps[s].spacings[sp]);
					}
				}
			}
		}else t_inc = Math.pow(base,Math.floor(Math.log(rg)/Math.log(base)));

		t_max = (Math.floor(mx/t_inc))*t_inc;
		if(t_max < mx) t_max += t_inc;
		t_min = t_max;
		i = 0;
		do {
			i++;
			t_min -= t_inc;
		}while(t_min > mn);

		// Test for really tiny values that might mess up the calculation
		if(Math.abs(t_min) < 1E-15) t_min = 0.0;

		// Add more tick marks if we only have a few
		while(i < (isDate ? 3 : 5)) {
			t_inc /= 2.0;
			if((t_min + t_inc) <= mn) t_min += t_inc;
			if((t_max - t_inc) >= mx) t_max -= t_inc ;
			i = i*2;
		}
		return t_inc;
	}

})(); // end of self-executing code that stops us polluting the global namespace