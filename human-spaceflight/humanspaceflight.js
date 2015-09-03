$(document).ready(function(){

	var astronauts;
	var xaxis;
	var yaxis;
	var categories = ['astronaut','cosmonaut','taikonaut','international','tourist','inorbit'];
	var cc = {'ABW':'Aruba','AFG':'Afghanistan','AGO':'Angola','AIA':'Anguilla','ALA':'&Aring;land Islands','ALB':'Albania','AND':'Andorra','ARE':'United Arab Emirates','ARG':'Argentina','ARM':'Armenia','ASM':'American Samoa','ATA':'Antarctica','ATF':'French Southern Territories','ATG':'Antigua and Barbuda','AUS':'Australia','AUT':'Austria','AZE':'Azerbaijan','BDI':'Burundi','BEL':'Belgium','BEN':'Benin','BES':'Bonaire, Sint Eustatius and Saba','BFA':'Burkina Faso','BGD':'Bangladesh','BGR':'Bulgaria','BHR':'Bahrain','BHS':'Bahamas','BIH':'Bosnia and Herzegovina','BLM':'Saint Barthélemy','BLR':'Belarus','BLZ':'Belize','BMU':'Bermuda','BOL':'Bolivia, Plurinational State of','BRA':'Brazil','BRB':'Barbados','BRN':'Brunei Darussalam','BTN':'Bhutan','BVT':'Bouvet Island','BWA':'Botswana','CAF':'Central African Republic','CAN':'Canada','CCK':'Cocos (Keeling) Islands','CHE':'Switzerland','CHL':'Chile','CHN':'China','CIV':'Côte d\'Ivoire','CMR':'Cameroon','COD':'Congo, the Democratic Republic of the','COG':'Congo','COK':'Cook Islands','COL':'Colombia','COM':'Comoros','CPV':'Cabo Verde','CRI':'Costa Rica','CUB':'Cuba','CUW':'Curaçao','CXR':'Christmas Island','CYM':'Cayman Islands','CYP':'Cyprus','CZE':'Czech Republic','DEU':'Germany','DJI':'Djibouti','DMA':'Dominica','DNK':'Denmark','DOM':'Dominican Republic','DZA':'Algeria','ECU':'Ecuador','EGY':'Egypt','ERI':'Eritrea','ESH':'Western Sahara','ESP':'Spain','EST':'Estonia','ETH':'Ethiopia','FIN':'Finland','FJI':'Fiji','FLK':'Falkland Islands (Malvinas)','FRA':'France','FRO':'Faroe Islands','FSM':'Micronesia, Federated States of','GAB':'Gabon','GBR':'United Kingdom','GEO':'Georgia','GGY':'Guernsey','GHA':'Ghana',	'GIB':'Gibraltar','GIN':'Guinea','GLP':'Guadeloupe','GMB':'Gambia','GNB':'Guinea-Bissau','GNQ':'Equatorial Guinea','GRC':'Greece','GRD':'Grenada','GRL':'Greenland','GTM':'Guatemala','GUF':'French Guiana','GUM':'Guam','GUY':'Guyana','HKG':'Hong Kong','HMD':'Heard Island and McDonald Islands','HND':'Honduras','HRV':'Croatia','HTI':'Haiti','HUN':'Hungary','IDN':'Indonesia','IMN':'Isle of Man','IND':'India','IOT':'British Indian Ocean Territory','IRL':'Ireland','IRN':'Iran, Islamic Republic of','IRQ':'Iraq','ISL':'Iceland','ISR':'Israel','ITA':'Italy','JAM':'Jamaica','JEY':'Jersey','JOR':'Jordan','JPN':'Japan','KAZ':'Kazakhstan','KEN':'Kenya','KGZ':'Kyrgyzstan','KHM':'Cambodia','KIR':'Kiribati','KNA':'Saint Kitts and Nevis','KOR':'Korea, Republic of','KWT':'Kuwait','LAO':'Lao People\'s Democratic Republic','LBN':'Lebanon','LBR':'Liberia','LBY':'Libya','LCA':'Saint Lucia','LIE':'Liechtenstein','LKA':'Sri Lanka','LSO':'Lesotho','LTU':'Lithuania','LUX':'Luxembourg','LVA':'Latvia','MAC':'Macao','MAF':'Saint Martin (French part)','MAR':'Morocco','MCO':'Monaco','MDA':'Moldova, Republic of','MDG':'Madagascar','MDV':'Maldives','MEX':'Mexico','MHL':'Marshall Islands','MKD':'Macedonia, the former Yugoslav Republic of','MLI':'Mali','MLT':'Malta','MMR':'Myanmar','MNE':'Montenegro','MNG':'Mongolia','MNP':'Northern Mariana Islands','MOZ':'Mozambique','MRT':'Mauritania','MSR':'Montserrat','MTQ':'Martinique','MUS':'Mauritius','MWI':'Malawi','MYS':'Malaysia','MYT':'Mayotte','NAM':'Namibia','NCL':'New Caledonia','NER':'Niger','NFK':'Norfolk Island','NGA':'Nigeria','NIC':'Nicaragua','NIU':'Niue',	'NLD':'Netherlands','NOR':'Norway','NPL':'Nepal','NRU':'Nauru','NZL':'New Zealand','OMN':'Oman','PAK':'Pakistan','PAN':'Panama','PCN':'Pitcairn','PER':'Peru','PHL':'Philippines','PLW':'Palau','PNG':'Papua New Guinea','POL':'Poland','PRI':'Puerto Rico','PRK':'Korea, Democratic People\'s Republic of','PRT':'Portugal','PRY':'Paraguay','PSE':'Palestine, State of','PYF':'French Polynesia','QAT':'Qatar','REU':'Réunion','ROU':'Romania','RUS':'Russian Federation','RWA':'Rwanda','SAU':'Saudi Arabia','SDN':'Sudan','SEN':'Senegal','SGP':'Singapore','SGS':'South Georgia and the South Sandwich Islands','SHN':'Saint Helena, Ascension and Tristan da Cunha','SJM':'Svalbard and Jan Mayen','SLB':'Solomon Islands','SLE':'Sierra Leone','SLV':'El Salvador','SMR':'San Marino','SOM':'Somalia','SPM':'Saint Pierre and Miquelon','SRB':'Serbia','SSD':'South Sudan','STP':'Sao Tome and Principe','SUR':'Suriname','SVK':'Slovakia','SVN':'Slovenia','SWE':'Sweden','SWZ':'Swaziland','SXM':'Sint Maarten (Dutch part)','SYC':'Seychelles','SYR':'Syrian Arab Republic','TCA':'Turks and Caicos Islands','TCD':'Chad','TGO':'Togo','THA':'Thailand','TJK':'Tajikistan','TKL':'Tokelau','TKM':'Turkmenistan','TLS':'Timor-Leste','TON':'Tonga','TTO':'Trinidad and Tobago','TUN':'Tunisia','TUR':'Turkey','TUV':'Tuvalu','TWN':'Taiwan, Province of China','TZA':'Tanzania, United Republic of','UGA':'Uganda','UKR':'Ukraine','UMI':'United States Minor Outlying Islands','URY':'Uruguay','USA':'United States','UZB':'Uzbekistan','VAT':'Holy See (Vatican City State)','VCT':'Saint Vincent and the Grenadines','VEN':'Venezuela, Bolivarian Republic of','VGB':'Virgin Islands, British','VIR':'Virgin Islands, U.S.','VNM':'Viet Nam','VUT':'Vanuatu','WLF':'Wallis and Futuna','WSM':'Samoa','YEM':'Yemen','ZAF':'South Africa','ZMB':'Zambia','ZWE':'Zimbabwe','URS':'Soviet Union','GDR':'East Germany','TCH':'Czechoslovakia'};

	// Load the data file
	loadDAT(getDataPath('#data'),parseAstronauts,{});

	// Hide any non-Javascript elements
	$('.noscript').hide();

	// Sort the astronauts
	function sortBy(i){
		yaxis = i;
		astronauts = astronauts.sort(function (a, b) {
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

	function drawAstronauts(){
		var output = '';
		for(var i = 0; i < astronauts.length; i++) output += '<a href="#" id="'+astronauts[i].id+'" class="human '+astronauts[i].category+''+(astronauts[i].inspaceasof != null ? ' inorbit' : '')+'" title="'+astronauts[i].name+'" data-name="'+astronauts[i].name.toLowerCase()+'"><\/a>';
		$('.innerbox').append(output);
		updateAstronauts();
		
		var labl = $('<label>').attr({'for':'filter_text'}).html('Filter');
		var inpt = $('<input>').attr({'class':'filterinp','id':'filter_text','type':'text','placeholder':'Filter by name e.g. \'Armstrong\''});
		$('form.axes').append(labl).append(inpt);
		
		$(inpt).on('change',function(){
			var search = $(this).val().toLowerCase();
			$('a.human.unmatched').removeClass('unmatched');
			if(search) $('.innerbox').find('a.human:not([data-name*="'+search+'"])').addClass('unmatched');
			updateAstronautCount();
		}).on('keyup',function(){
			$(this).change();
		});
		
		updateAstronautCount();
		
	}

	function updateAstronautCount(){
		for(var i = 0; i < categories.length; i++) $('.'+categories[i]+'_count').html(' / '+$('.innerbox .human.'+categories[i]+':not(.unmatched)').length);
	}
	// Add events to deal with changes to the drop down select lists
	$('#yaxis').on('change',function(){
		sortBy('name');
		sortBy($(this).val());
		updateAstronauts();
		$('.tooltip_close').trigger('click')
	});
	$('#xaxis').on('change',function(){
		xaxis = $(this).val();
		updateAstronauts();
		$('.tooltip_close').trigger('click')
	});

	// Update all the drawn astronauts
	function updateAstronauts(){

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
		if(!xaxis) xaxis = "time_space_days";
		for(var i = 0; i < astronauts.length; i++){
			// Update time in space for astronauts currently in space
			if(astronauts[i].inspaceasof != null) astronauts[i].time_space_days = parseFloat((astronauts[i].time_space_days_original + ((now-astronauts[i].inspaceasof)/(1000*86400))).toFixed(2));
			// If they've only had one launch, their longest trip should be the same as their time in space
			if(astronauts[i].launches == 1 && astronauts[i].time_space_days > astronauts[i].longest_trip) astronauts[i].longest_trip = astronauts[i].time_space_days;
			if(astronauts[i].time_space_days > 0){
				good++;
				// Use a dummy axis key to work out the minimum and maximum values as we
				// want the longest trip and total time in space to have the same scale.
				xaxistmp = (xaxis=="longest_trip" ? "time_space_days" : xaxis);
				yaxistmp = (yaxis=="longest_trip" ? "time_space_days" : yaxis);
				if(astronauts[i][xaxistmp] > mx_x) mx_x = astronauts[i][xaxistmp];
				if(astronauts[i][xaxistmp] < mn_x) mn_x = astronauts[i][xaxistmp];
				if(astronauts[i][yaxistmp] > mx_y) mx_y = astronauts[i][yaxistmp];
				if(astronauts[i][yaxistmp] < mn_y) mn_y = astronauts[i][yaxistmp];
			}
		}

		var output = "";
		var dy = 1/good;	// The vertical spacing of astronauts
		for(var i = 0, j = 0; i < astronauts.length; i++){
			
			x = getX(astronauts[i][xaxis],xaxis,mn_x,mx_x);
			
			if(yaxis=="dob" || yaxis=="time_eva" || yaxis=="firstlaunch_age" || yaxis=="launches") y = (astronauts[i][yaxis]-mn_y)/(mx_y-mn_y);
			else if(yaxis=="longest_trip") y = (astronauts[i][yaxis] >= 0 ? (Math.log10(astronauts[i][yaxis])-Math.log10(mn_y))/(Math.log10(mx_y)-Math.log10(mn_y)) : 1);
			else y = j*dy;
			
			if(astronauts[i].time_space_days == 0){
				x = -100;
				$('#'+astronauts[i].id).remove();
			}else{
				j++;
				$('#'+astronauts[i].id).css({'left':(100*x)+"%",'top':(100*y)+"%"});
			}
		}
		if($('.yaxis').length==0) $('.innerbox').append('<div class="yaxis"><\/div>');
		if($('.xaxis').length==0) $('.innerbox').append('<div class="xaxis"><\/div>');
		
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

		// We draw different grid lines depending on the axis type
		if(typ=="dob"){
			// Date-of-birth - we will put lines every decade
			var a = Math.ceil(mn.getFullYear()/10)*10;
			var b = Math.floor(mx.getFullYear()/10)*10;
			var d;
			for(var i = a; i <= b; i += 10){
				// Create a date at the start of the year
				d = new Date(2015,1,1,0,0,0);
				// Update the year
				x = getX(d.setFullYear(i),typ,mn,mx);
				html += '<div class="gridline" style="'+styleGridLine(axis,x)+'"><span class="label">'+i+'<\/span><\/div>';
			}
		}else if(typ=="time_eva"){
			// Extra-vehicular activity
			var a = mn;
			var b = mx;
			// Convert to Date-like objects to find a good step size then back into seconds
			var step = getGridSpacing(a*1000,b*1000,true)/1000;
			for(var i = a; i <= b; i+=step){
				x = getX(i,typ,mn,mx);
				html += '<div class="gridline" style="'+styleGridLine(axis,x)+'"><span class="label">'+(i/3600)+' hr<\/span><\/div>';
			}
		}else if(typ=="time_dilation"){
			// Time dilation
			var a = mn;
			var b = mx;
			// Convert to Date-like objects to find a good step size then back into seconds
			var step = getGridSpacing(a*1000,b*1000,true)/1000;
			for(var i = a; i <= b; i+=step){
				x = getX(i,typ,mn,mx);
				html += '<div class="gridline" style="'+styleGridLine(axis,x)+'"><span class="label">'+parseInt(i*1000)+' ms<\/span><\/div>';
			}
		}else if(typ=="firstlaunch_age"){
			// The age at first launch with a grid spacing of 5 years
			var step = 5;
			var a = Math.ceil(mn/step)*step;
			var b = Math.floor(mx/step)*step;
			for(var i = a; i <= b; i+=step){
				x = getX(i,typ,mn,mx);
				html += '<div class="gridline" style="'+styleGridLine(axis,x)+'"><span class="label">'+(i)+' yr<\/span><\/div>';
			}
		}else if(typ=="launches"){
			// The number of launches
			var step = 1;
			var a = Math.ceil(mn/step)*step;
			var b = Math.floor(mx/step)*step;
			for(var i = a; i <= b; i+=step){
				x = getX(i,typ,mn,mx);
				html += '<div class="gridline" style="'+styleGridLine(axis,x)+'"><span class="label">'+(i)+'<\/span><\/div>';
			}
		}else if(typ=="time_space_days" || typ=="longest_trip"){
			// For the total time in space and the longest trip we use a log scale with major and minor grid lines
			var steps = [1,2,3,4,5,6,7,8,9]
			for(var i = 0.1; i <= mx; i*=10){
				for(var s = 0; s < steps.length ; s++){
					j = i*steps[s];
					x = getX(j,typ,mn,mx);
					html += '<div class="gridline'+(s==0 ? ' majorgridline':'')+'" style="'+styleGridLine(axis,x)+'"><span class="label">'+(s==0 ? j+' day'+(j>1 ? 's':''): '')+'<\/span><\/div>';
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
	
	function parseAstronauts(data,attrs){

		// Parse the data from the CSV file
		astronauts = CSV2JSON(data,[{'name':'name'},{'name':'country'},{'name':'gender'},{'name':'dob','format':'date'},{'name':'time_space_days','format':'number'},{'name':'time_space','format':'number'},{'name':'time_eva','format':'number'},{'name':'launches','format':'number'},{'name':'evas','format':'number'},{'name':'firstlaunch','format':'date'},{'name':'time_dilation','format':'number'},{'name':'firstlaunch_age','format':'number'},{'name':'qualifications','format':'string'},{'name':'missions','format':'string'},{'name':'longest_trip','format':'number'},{'name':'distance','format':'number'},{'name':'eva_string','format':'string'},{'name':'category','format':'string'},{'name':'file','format':'string'},{'name':'inspaceasof','format':'date'}]);

		// Assign each one an ID
		for(var i = 0; i < astronauts.length; i++){
			astronauts[i].id = i;
			// Keep a copy of the original number of days in space
			astronauts[i].time_space_days_original = astronauts[i].time_space_days;
		}

		// Draw the astronauts to the page
		drawAstronauts();
		
		// Set up the tooltip
		tooltip({
			'elements':$('.human'),
			'html':function(){
				var id = parseInt($(this).attr('id'));
				for(var i = 0; i < astronauts.length; i++){ if(astronauts[i].id==id) break; }
				var a = astronauts[i];
				var text = '<div class="stripe '+a.category+'"><\/div><h3>'+a.name+'<\/h3><table>';
				text += '<tr><td>Gender:<\/td><td>'+a.gender+'<\/td><\/tr>';
				text += '<tr><td>Country:<\/td><td>'+formatArray(a.country,cc)+'<\/td><\/tr>';
				text += '<tr><td>Year of birth:<\/td><td>'+a.dob.getFullYear()+'<\/td><\/tr>';
				text += '<tr><td>Age at first launch:<\/td><td>'+a.firstlaunch_age+' years<\/td><\/tr>';
				text += '<tr><td>Launches:<\/td><td>'+a.launches+'<\/td><\/tr>';
				text += '<tr><td>Time in space:<\/td><td>'+a.time_space_days+' days<\/td><\/tr>';
				if(a.time_eva > 0) text += '<tr><td>Total EVA:<\/td><td>'+parseInt(a.eva_string.substr(0,a.eva_string.lastIndexOf(":")))+' hours '+parseInt(a.eva_string.substr(a.eva_string.lastIndexOf(":")+1))+' mins<\/td><\/tr>';
				text += '<tr><td>Missions:<\/td><td>'+formatArray(a.missions)+'<\/td><\/tr>';
				if(a.inspaceasof != null) text += '<tr><td>Notes:<\/td><td>Currently in space<\/td><\/tr>';
				text += '<\/table>';
				text += '<a href="https://github.com/cosmos-book/cosmos-book.github.io/tree/master/human-spaceflight/data/'+a.file+'" class="repo">data file<\/a>';
				return text;
			}
		});
		// We can hide the loader/spinner as everything seems to be OK
		$('.loader').hide();
		$('.js-only').show();
	}
})