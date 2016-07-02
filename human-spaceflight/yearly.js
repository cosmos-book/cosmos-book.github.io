$(document).ready(function(){

	var now = new Date();
	var dir = $('#datadir').attr('href');	// Get astronaut base directory from document
	var cc = {'ABW':'Aruba','AFG':'Afghanistan','AGO':'Angola','AIA':'Anguilla','ALA':'&Aring;land Islands','ALB':'Albania','AND':'Andorra','ARE':'United Arab Emirates','ARG':'Argentina','ARM':'Armenia','ASM':'American Samoa','ATA':'Antarctica','ATF':'French Southern Territories','ATG':'Antigua and Barbuda','AUS':'Australia','AUT':'Austria','AZE':'Azerbaijan','BDI':'Burundi','BEL':'Belgium','BEN':'Benin','BES':'Bonaire, Sint Eustatius and Saba','BFA':'Burkina Faso','BGD':'Bangladesh','BGR':'Bulgaria','BHR':'Bahrain','BHS':'Bahamas','BIH':'Bosnia and Herzegovina','BLM':'Saint Barthélemy','BLR':'Belarus','BLZ':'Belize','BMU':'Bermuda','BOL':'Bolivia, Plurinational State of','BRA':'Brazil','BRB':'Barbados','BRN':'Brunei Darussalam','BTN':'Bhutan','BVT':'Bouvet Island','BWA':'Botswana','CAF':'Central African Republic','CAN':'Canada','CCK':'Cocos (Keeling) Islands','CHE':'Switzerland','CHL':'Chile','CHN':'China','CIV':'Côte d\'Ivoire','CMR':'Cameroon','COD':'Congo, the Democratic Republic of the','COG':'Congo','COK':'Cook Islands','COL':'Colombia','COM':'Comoros','CPV':'Cabo Verde','CRI':'Costa Rica','CUB':'Cuba','CUW':'Curaçao','CXR':'Christmas Island','CYM':'Cayman Islands','CYP':'Cyprus','CZE':'Czech Republic','DEU':'Germany','DJI':'Djibouti','DMA':'Dominica','DNK':'Denmark','DOM':'Dominican Republic','DZA':'Algeria','ECU':'Ecuador','EGY':'Egypt','ERI':'Eritrea','ESH':'Western Sahara','ESP':'Spain','EST':'Estonia','ETH':'Ethiopia','FIN':'Finland','FJI':'Fiji','FLK':'Falkland Islands (Malvinas)','FRA':'France','FRO':'Faroe Islands','FSM':'Micronesia, Federated States of','GAB':'Gabon','GBR':'United Kingdom','GEO':'Georgia','GGY':'Guernsey','GHA':'Ghana',	'GIB':'Gibraltar','GIN':'Guinea','GLP':'Guadeloupe','GMB':'Gambia','GNB':'Guinea-Bissau','GNQ':'Equatorial Guinea','GRC':'Greece','GRD':'Grenada','GRL':'Greenland','GTM':'Guatemala','GUF':'French Guiana','GUM':'Guam','GUY':'Guyana','HKG':'Hong Kong','HMD':'Heard Island and McDonald Islands','HND':'Honduras','HRV':'Croatia','HTI':'Haiti','HUN':'Hungary','IDN':'Indonesia','IMN':'Isle of Man','IND':'India','IOT':'British Indian Ocean Territory','IRL':'Ireland','IRN':'Iran, Islamic Republic of','IRQ':'Iraq','ISL':'Iceland','ISR':'Israel','ITA':'Italy','JAM':'Jamaica','JEY':'Jersey','JOR':'Jordan','JPN':'Japan','KAZ':'Kazakhstan','KEN':'Kenya','KGZ':'Kyrgyzstan','KHM':'Cambodia','KIR':'Kiribati','KNA':'Saint Kitts and Nevis','KOR':'Korea, Republic of','KWT':'Kuwait','LAO':'Lao People\'s Democratic Republic','LBN':'Lebanon','LBR':'Liberia','LBY':'Libya','LCA':'Saint Lucia','LIE':'Liechtenstein','LKA':'Sri Lanka','LSO':'Lesotho','LTU':'Lithuania','LUX':'Luxembourg','LVA':'Latvia','MAC':'Macao','MAF':'Saint Martin (French part)','MAR':'Morocco','MCO':'Monaco','MDA':'Moldova, Republic of','MDG':'Madagascar','MDV':'Maldives','MEX':'Mexico','MHL':'Marshall Islands','MKD':'Macedonia, the former Yugoslav Republic of','MLI':'Mali','MLT':'Malta','MMR':'Myanmar','MNE':'Montenegro','MNG':'Mongolia','MNP':'Northern Mariana Islands','MOZ':'Mozambique','MRT':'Mauritania','MSR':'Montserrat','MTQ':'Martinique','MUS':'Mauritius','MWI':'Malawi','MYS':'Malaysia','MYT':'Mayotte','NAM':'Namibia','NCL':'New Caledonia','NER':'Niger','NFK':'Norfolk Island','NGA':'Nigeria','NIC':'Nicaragua','NIU':'Niue',	'NLD':'Netherlands','NOR':'Norway','NPL':'Nepal','NRU':'Nauru','NZL':'New Zealand','OMN':'Oman','PAK':'Pakistan','PAN':'Panama','PCN':'Pitcairn','PER':'Peru','PHL':'Philippines','PLW':'Palau','PNG':'Papua New Guinea','POL':'Poland','PRI':'Puerto Rico','PRK':'Korea, Democratic People\'s Republic of','PRT':'Portugal','PRY':'Paraguay','PSE':'Palestine, State of','PYF':'French Polynesia','QAT':'Qatar','REU':'Réunion','ROU':'Romania','RUS':'Russian Federation','RWA':'Rwanda','SAU':'Saudi Arabia','SDN':'Sudan','SEN':'Senegal','SGP':'Singapore','SGS':'South Georgia and the South Sandwich Islands','SHN':'Saint Helena, Ascension and Tristan da Cunha','SJM':'Svalbard and Jan Mayen','SLB':'Solomon Islands','SLE':'Sierra Leone','SLV':'El Salvador','SMR':'San Marino','SOM':'Somalia','SPM':'Saint Pierre and Miquelon','SRB':'Serbia','SSD':'South Sudan','STP':'Sao Tome and Principe','SUR':'Suriname','SVK':'Slovakia','SVN':'Slovenia','SWE':'Sweden','SWZ':'Swaziland','SXM':'Sint Maarten (Dutch part)','SYC':'Seychelles','SYR':'Syrian Arab Republic','TCA':'Turks and Caicos Islands','TCD':'Chad','TGO':'Togo','THA':'Thailand','TJK':'Tajikistan','TKL':'Tokelau','TKM':'Turkmenistan','TLS':'Timor-Leste','TON':'Tonga','TTO':'Trinidad and Tobago','TUN':'Tunisia','TUR':'Turkey','TUV':'Tuvalu','TWN':'Taiwan, Province of China','TZA':'Tanzania, United Republic of','UGA':'Uganda','UKR':'Ukraine','UMI':'United States Minor Outlying Islands','URY':'Uruguay','USA':'United States','UZB':'Uzbekistan','VAT':'Holy See (Vatican City State)','VCT':'Saint Vincent and the Grenadines','VEN':'Venezuela, Bolivarian Republic of','VGB':'Virgin Islands, British','VIR':'Virgin Islands, U.S.','VNM':'Viet Nam','VUT':'Vanuatu','WLF':'Wallis and Futuna','WSM':'Samoa','YEM':'Yemen','ZAF':'South Africa','ZMB':'Zambia','ZWE':'Zimbabwe','URS':'Soviet Union','GDR':'East Germany','TCH':'Czechoslovakia'};

	var astronauts = new Array();
	var trips = new Array();
	
	// Load the data file
	loadJSON(getDataPath('#data'),parseIt,{error:function(){ $('.loader').html("Oops. Couldn't find the data."); }});



	function formatTime(s) {
		var h = Math.floor(s/3600);
		var m = Math.floor((s - h*3600)/60);
		return (h < 10 ? "0":"")+h+":"+(m < 10 ? "0":"")+m;
	}

	// Function to add seconds to date strings if they don't exist otherwise Safari 5 can't cope
	function fixDateString(d){
		var t = d.indexOf('T');
		var z = d.indexOf('Z');
		if(z < 1) d = d+'Z';
		if(z-t == 6) d = d.substr(0,z)+':00Z';
		return d;
	}
	function inYears(t){
		return (t/(365.25*86400000));
	}
	function parseIt(data){
	
		var now = new Date();
		var updatedate = new Date('1900-01-01T00:00:00Z');
		var d,time,longest,launch,land,tmp;
		for(name in data) {
			tmp = {};
			tmp = data[name];
			tmp.name = name;
			tmp.dob = new Date(data[name].dob);
			tmp.launches = 0;
			tmp.mission = data[name].missions;
			tmp.missions = "";
			time = 0;
			longest = 0;
			launch = new Date(fixDateString(data[name].mission[0].a));
			tmp.firstlaunch_age = inYears(launch-tmp.dob);

			for(var m = 0; m < data[name].mission.length; m++){
				launch = (data[name].mission[m].a) ? new Date(fixDateString(data[name].mission[m].a)) : "";
				land = (data[name].mission[m].b) ? new Date(fixDateString(data[name].mission[m].b)) : "";
				d = 0;
				if(land && launch){
					d = ((land-launch)/1000);
					if(d > longest) longest = d;
					trips.push({'name':name,'time':d});
				}
				if(launch){
					tmp.launches++;
					if(launch > updatedate) updatedate = launch;
				}

				if(tmp.missions) tmp.missions += ";";
				tmp.missions += data[name].mission[m].names;
				
				// They haven't landed and the launch was under three years ago - they are most likely in space
				if(m == data[name].mission.length-1){
					if(!land && now-launch < (86400000*365.25*3)){
						tmp.inspaceasof = launch;
						d2 = ((now-launch)/1000);
						if(d2 > longest) longest = d2;
						trips.push({'name':name,'time':d2});
					}
					tmp.oldest = (!land) ? inYears(now-tmp.dob) : inYears(land-tmp.dob);
				}
				time += d;
			}

			tmp.time_eva = tmp.eva;
			tmp.time_space = time;
			tmp.time_space_days = (tmp.time_space/86400);
			tmp.longest_trip = longest/86400;
			tmp.eva_string = formatTime(tmp.time_eva);
			// Keep a copy of the original number of days in space
			tmp.time_space_days_original = tmp.time_space_days;
			astronauts.push(tmp);
		}

		// Sort trips - longest first
		trips = trips.sort(function (a, b) { return a['time'] > b['time'] ? -1 : 1; });

		// Assign each one an ID
		for(var i = 0; i < astronauts.length; i++) astronauts[i].id = i;

		// Update the date
		$('.update').html(updatedate.toISOString().substr(0,10));

		updateAstronauts();

		// Set up the tooltip
		tooltip({
			'elements':$('table .human'),
			'html':function(){
				var name = $(this).attr('title');
				
				var a = data[name];
				var text = '<div class="stripe '+a.category+'"><\/div><h3>'+a.name+'<\/h3><table>';
				text += '<tr><td>Gender:<\/td><td>'+a.gender+'<\/td><\/tr>';
				text += '<tr><td>Country:<\/td><td>'+formatArray(a.country,cc)+'<\/td><\/tr>';
				text += '<tr><td>Year of birth:<\/td><td>'+a.dob.getFullYear()+'<\/td><\/tr>';
				text += '<tr><td>Age at first launch:<\/td><td>'+Math.floor(a.firstlaunch_age)+' years<\/td><\/tr>';
				text += '<tr><td>Launches:<\/td><td>'+a.launches+'<\/td><\/tr>';
				text += '<tr><td>Time in space:<\/td><td>'+a.time_space_days.toFixed(2)+' days<\/td><\/tr>';
				if(a.time_eva > 0) text += '<tr><td>Total <dfn title="Extra-vehicular activity - space walks">EVA</dfn>:<\/td><td>'+parseInt(a.eva_string.substr(0,a.eva_string.lastIndexOf(":")))+'h '+parseInt(a.eva_string.substr(a.eva_string.lastIndexOf(":")+1))+'m<\/td><\/tr>';
				text += '<tr><td>Missions:<\/td><td>'+formatArray(a.missions)+'<\/td><\/tr>';
				if(a.twitter) text += '<tr><td>Twitter:<\/td><td><a href="https://twitter.com/'+a.twitter+'">@'+a.twitter+'</a><\/td><\/tr>';
				if(a.inspaceasof != null) text += '<tr><td>Notes:<\/td><td>Currently in space<\/td><\/tr>';
				text += '<\/table>';
				text += '<a href="'+dir+a.file+'" class="repo">data file<\/a>';


				return text;
			}
		});
	}

	// Update all the astronauts
	function updateAstronauts(){
		var now = new Date();	// Get the time for now
		for(var i = 0; i < astronauts.length; i++){
			// Update time in space for astronauts currently in space
			if(astronauts[i].inspaceasof != null) astronauts[i].time_space_days = parseFloat((astronauts[i].time_space_days_original + ((now-astronauts[i].inspaceasof)/(1000*86400))).toFixed(2));
			// If they've only had one launch, their longest trip should be the same as their time in space
			if(astronauts[i].launches == 1 && astronauts[i].time_space_days > astronauts[i].longest_trip) astronauts[i].longest_trip = astronauts[i].time_space_days;
		}
	}

	// We provide a ";" separated list of values and format them into a nice, comma-separated string
	// We can provide an optional "lookup" array to replace 
	function formatArray(str,lookup){
		// Split into array
		var arr = (typeof str==="string") ? str.split(/;/) : str;
		str = "";
		for(var i = 0 ; i < arr.length; i++){
			if(str) str += ", ";
			str += (lookup) ? (lookup[arr[i]].indexOf(', ') > 0 ? lookup[arr[i]].substr(lookup[arr[i]].indexOf(', ')+2)+' '+lookup[arr[i]].substring(0,lookup[arr[i]].indexOf(', ')) : lookup[arr[i]]) : arr[i];
		}
		return str;
	}


	// We can hide the loader/spinner as everything seems to be OK
	$('.loader').hide();
	$('.js-only').show();
	// Hide any non-Javascript elements
	$('.noscript').hide();

})