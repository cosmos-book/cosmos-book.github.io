$(document).ready(function(){

	var astronauts = new Array();
	var xaxis;
	var yaxis;
	var cc = {'ABW':'Aruba','AFG':'Afghanistan','AGO':'Angola','AIA':'Anguilla','ALA':'&Aring;land Islands','ALB':'Albania','AND':'Andorra','ARE':'United Arab Emirates','ARG':'Argentina','ARM':'Armenia','ASM':'American Samoa','ATA':'Antarctica','ATF':'French Southern Territories','ATG':'Antigua and Barbuda','AUS':'Australia','AUT':'Austria','AZE':'Azerbaijan','BDI':'Burundi','BEL':'Belgium','BEN':'Benin','BES':'Bonaire, Sint Eustatius and Saba','BFA':'Burkina Faso','BGD':'Bangladesh','BGR':'Bulgaria','BHR':'Bahrain','BHS':'Bahamas','BIH':'Bosnia and Herzegovina','BLM':'Saint Barthélemy','BLR':'Belarus','BLZ':'Belize','BMU':'Bermuda','BOL':'Bolivia, Plurinational State of','BRA':'Brazil','BRB':'Barbados','BRN':'Brunei Darussalam','BTN':'Bhutan','BVT':'Bouvet Island','BWA':'Botswana','CAF':'Central African Republic','CAN':'Canada','CCK':'Cocos (Keeling) Islands','CHE':'Switzerland','CHL':'Chile','CHN':'China','CIV':'Côte d\'Ivoire','CMR':'Cameroon','COD':'Congo, the Democratic Republic of the','COG':'Congo','COK':'Cook Islands','COL':'Colombia','COM':'Comoros','CPV':'Cabo Verde','CRI':'Costa Rica','CUB':'Cuba','CUW':'Curaçao','CXR':'Christmas Island','CYM':'Cayman Islands','CYP':'Cyprus','CZE':'Czech Republic','DEU':'Germany','DJI':'Djibouti','DMA':'Dominica','DNK':'Denmark','DOM':'Dominican Republic','DZA':'Algeria','ECU':'Ecuador','EGY':'Egypt','ERI':'Eritrea','ESH':'Western Sahara','ESP':'Spain','EST':'Estonia','ETH':'Ethiopia','FIN':'Finland','FJI':'Fiji','FLK':'Falkland Islands (Malvinas)','FRA':'France','FRO':'Faroe Islands','FSM':'Micronesia, Federated States of','GAB':'Gabon','GBR':'United Kingdom','GEO':'Georgia','GGY':'Guernsey','GHA':'Ghana',	'GIB':'Gibraltar','GIN':'Guinea','GLP':'Guadeloupe','GMB':'Gambia','GNB':'Guinea-Bissau','GNQ':'Equatorial Guinea','GRC':'Greece','GRD':'Grenada','GRL':'Greenland','GTM':'Guatemala','GUF':'French Guiana','GUM':'Guam','GUY':'Guyana','HKG':'Hong Kong','HMD':'Heard Island and McDonald Islands','HND':'Honduras','HRV':'Croatia','HTI':'Haiti','HUN':'Hungary','IDN':'Indonesia','IMN':'Isle of Man','IND':'India','IOT':'British Indian Ocean Territory','IRL':'Ireland','IRN':'Iran, Islamic Republic of','IRQ':'Iraq','ISL':'Iceland','ISR':'Israel','ITA':'Italy','JAM':'Jamaica','JEY':'Jersey','JOR':'Jordan','JPN':'Japan','KAZ':'Kazakhstan','KEN':'Kenya','KGZ':'Kyrgyzstan','KHM':'Cambodia','KIR':'Kiribati','KNA':'Saint Kitts and Nevis','KOR':'Korea, Republic of','KWT':'Kuwait','LAO':'Lao People\'s Democratic Republic','LBN':'Lebanon','LBR':'Liberia','LBY':'Libya','LCA':'Saint Lucia','LIE':'Liechtenstein','LKA':'Sri Lanka','LSO':'Lesotho','LTU':'Lithuania','LUX':'Luxembourg','LVA':'Latvia','MAC':'Macao','MAF':'Saint Martin (French part)','MAR':'Morocco','MCO':'Monaco','MDA':'Moldova, Republic of','MDG':'Madagascar','MDV':'Maldives','MEX':'Mexico','MHL':'Marshall Islands','MKD':'Macedonia, the former Yugoslav Republic of','MLI':'Mali','MLT':'Malta','MMR':'Myanmar','MNE':'Montenegro','MNG':'Mongolia','MNP':'Northern Mariana Islands','MOZ':'Mozambique','MRT':'Mauritania','MSR':'Montserrat','MTQ':'Martinique','MUS':'Mauritius','MWI':'Malawi','MYS':'Malaysia','MYT':'Mayotte','NAM':'Namibia','NCL':'New Caledonia','NER':'Niger','NFK':'Norfolk Island','NGA':'Nigeria','NIC':'Nicaragua','NIU':'Niue',	'NLD':'Netherlands','NOR':'Norway','NPL':'Nepal','NRU':'Nauru','NZL':'New Zealand','OMN':'Oman','PAK':'Pakistan','PAN':'Panama','PCN':'Pitcairn','PER':'Peru','PHL':'Philippines','PLW':'Palau','PNG':'Papua New Guinea','POL':'Poland','PRI':'Puerto Rico','PRK':'Korea, Democratic People\'s Republic of','PRT':'Portugal','PRY':'Paraguay','PSE':'Palestine, State of','PYF':'French Polynesia','QAT':'Qatar','REU':'Réunion','ROU':'Romania','RUS':'Russian Federation','RWA':'Rwanda','SAU':'Saudi Arabia','SDN':'Sudan','SEN':'Senegal','SGP':'Singapore','SGS':'South Georgia and the South Sandwich Islands','SHN':'Saint Helena, Ascension and Tristan da Cunha','SJM':'Svalbard and Jan Mayen','SLB':'Solomon Islands','SLE':'Sierra Leone','SLV':'El Salvador','SMR':'San Marino','SOM':'Somalia','SPM':'Saint Pierre and Miquelon','SRB':'Serbia','SSD':'South Sudan','STP':'Sao Tome and Principe','SUR':'Suriname','SVK':'Slovakia','SVN':'Slovenia','SWE':'Sweden','SWZ':'Swaziland','SXM':'Sint Maarten (Dutch part)','SYC':'Seychelles','SYR':'Syrian Arab Republic','TCA':'Turks and Caicos Islands','TCD':'Chad','TGO':'Togo','THA':'Thailand','TJK':'Tajikistan','TKL':'Tokelau','TKM':'Turkmenistan','TLS':'Timor-Leste','TON':'Tonga','TTO':'Trinidad and Tobago','TUN':'Tunisia','TUR':'Turkey','TUV':'Tuvalu','TWN':'Taiwan, Province of China','TZA':'Tanzania, United Republic of','UGA':'Uganda','UKR':'Ukraine','UMI':'United States Minor Outlying Islands','URY':'Uruguay','USA':'United States','UZB':'Uzbekistan','VAT':'Holy See (Vatican City State)','VCT':'Saint Vincent and the Grenadines','VEN':'Venezuela, Bolivarian Republic of','VGB':'Virgin Islands, British','VIR':'Virgin Islands, U.S.','VNM':'Viet Nam','VUT':'Vanuatu','WLF':'Wallis and Futuna','WSM':'Samoa','YEM':'Yemen','ZAF':'South Africa','ZMB':'Zambia','ZWE':'Zimbabwe','URS':'Soviet Union','GDR':'East Germany','TCH':'Czechoslovakia'};
	var labels = [{'text':'First Moon landing','date':'1969-07-20T20:18:04Z'},{'text':'Soyuz 11 disaster','date':'1971-06-30T02:16:52Z'},{'text':'Space Shuttle Challenger disaster','date':'1986-01-28T16:39:13Z'},{'text':'Space Shuttle Colombia disaster','date':'2003-02-01T13:59:00Z'},{'text':'Mir begins','date':'1986-02-20','pos':2},{'text':'Mir ends','date':'2001-03-21'},{'text':'ISS begins','date':'1998-11-20'}];
	$('.full-width').append('<div id="timeline"><\/div>');
	var app = $('#timeline');

	function parseIt(data){

		var launch,land;
		var html = "";
		var start = new Date('1961-01-01T00:00:00Z');
		var end = new Date();
		var tmp = new Date();
		tmp.setMonth(0);
		tmp.setDate(1);
		// Find the fraction we are into the current year
		var yfrac = ((new Date())-tmp)/(86400000*365.25);
		// Define the scale of the timeline
		var scale = 1/(end-start);
		var wide = app.width();
		var tall = app.height();
		
		var pixels = new Array(wide);
		for(px = 0; px < wide ; px++) pixels[px] = [false];

		var nmax = 1;
		
		// Function to add seconds to date strings if they don't exist otherwise Safari 5 can't cope
		function fixDateString(d){
			var t = d.indexOf('T');
			var z = d.indexOf('Z');
			if(z < 1) d = d+'Z';
			if(z-t == 6) d = d.substr(0,z)+':00Z';
			return d;
		}

		for(name in data) {
			for(var m = 0; m < data[name].missions.length; m++){
				//var ms = data[name].missions[m].period.split(/;/);
				launch = (data[name].missions[m].a) ? new Date(fixDateString(data[name].missions[m].a)) : "BLAH";
				land = (data[name].missions[m].b) ? new Date(fixDateString(data[name].missions[m].b)) : new Date();
				l = Math.floor((launch-start)*scale*wide);
				dl = Math.ceil((land-launch)*scale*wide);
				var n = 0;
				var row_ok = true;
				// Find level to fill
				for(var j = 0; j < nmax; j++){
					row_ok = true;
					for(var i = l ; i < l + dl ; i++){
						if(pixels[i][j]){
							// We can't use this row
							row_ok = false;
							break;
						}
					}
					if(row_ok){
						// This row has a suitably sized gap so fill it
						for(var i = l ; i < l + dl ; i++) pixels[i][j] = true;
						n = j;
						break;
					}
				}
				//if(name.indexOf('LIU')==0) console.log(name,l,new Date(fixDateString(data[name].missions[m].a)),fixDateString(data[name].missions[m].a),new Date('1983-08-30T06:53:00Z'))
				if(!row_ok){
					// There were no rows with a suitable sized gap so we create a new row
					for(var i = 0 ; i < pixels.length ; i++) pixels[i].push((i >= l && i < l+dl) ? true : false);
					n = j;
				}
				nmax = pixels[0].length;
				// Make a copy of the object
				var a = JSON.parse(JSON.stringify(data[name]));
				a.name = name;
				a.n = n;
				a.width = dl;
				a.left = l;
				a.missionnames = data[name].missions[m].names.split(";");
				a.launch = launch;
				a.land = (data[name].missions[m].b ? land : "");
				a.dob = new Date(a.dob);
				astronauts.push(a);
			}
		}
		nmax++;
		for(var a = 0 ; a < astronauts.length; a++) html += '<a href="#" class="human '+astronauts[a].category+'" id="'+a+'" style="top:'+((astronauts[a].n/nmax)*96)+'%;width:'+astronauts[a].width+'px;margin-left:'+astronauts[a].left+'px;height:'+(80/nmax)+'%;" title="'+astronauts[a].name+'"><\/a>';

		app.append('<div class="data">'+html+'<\/div>');
		app.append('<div class="xaxis">'+makeGridLines(end.getUTCFullYear()+yfrac,start.getUTCFullYear())+'<\/div>');
		app.append('<div class="labels">'+makeLabels(end,start,labels)+'<\/div>');
		app.parent().scrollLeft(wide);

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

		// Set up the tooltip
		tooltip({
			'elements':$('#timeline .human'),
			'html':function(){
				$('.human').removeClass('selected')
				var id = parseInt($(this).attr('id'));
				var missions = $('.human[title="'+$(this).attr('title')+'"]');
				missions.addClass('selected');
				var a = astronauts[id];
				var prev = "";
				var next = "";
				for(var i = 0; i < missions.length; i++){
					if($(missions[i]).attr('id') == id-1) prev = '<a href="#'+$(missions[i]).attr('id')+'" class="jumper prev" data-id="'+$(missions[i]).attr('id')+'">&lt; previous</a>';
					if($(missions[i]).attr('id') == id+1) next = '<a href="#'+$(missions[i]).attr('id')+'" class="jumper next" data-id="'+$(missions[i]).attr('id')+'">next &gt;</a>';
				}
				var text = '<div class="stripe '+a.category+'"><\/div><h3>'+a.name+'<\/h3><table>';
				text += '<tr><td>Gender:<\/td><td>'+a.gender+'<\/td><\/tr>';
				text += '<tr><td>Country:<\/td><td>'+formatArray(a.country,cc)+'<\/td><\/tr>';
				text += '<tr><td>Year of birth:<\/td><td>'+a.dob.getFullYear()+'<\/td><\/tr>';
				text += '<tr><td>Trips to space:<\/td><td>'+a.missions.length+'<\/td><\/tr>';
				if(a.twitter) text += '<tr><td>Twitter:<\/td><td><a href="https://twitter.com/'+a.twitter.substr(1)+'">'+a.twitter+'</a><\/td><\/tr>';
				var start = '<time datetime="'+a.launch.toISOString()+'" title="'+a.launch.toISOString()+'">'+a.launch.toISOString().substr(0,10)+'</time>';
				var end = (a.land ? '<time datetime="'+a.land.toISOString()+'" title="'+a.land.toISOString()+'">'+a.land.toISOString().substr(0,10)+'</time>' : '');
				text += '<tr><td>This trip:<\/td><td>'+start+(a.land ? ' &rarr; ' : '')+(end!=start ? end : '')+'<br />('+formatArray(a.missionnames)+')<\/td><\/tr>';
				if(prev || next) text += '<tr><td>'+prev+'<\/td><td>'+next+'<\/td><\/tr>';
				text += '<\/table>';
				text += '<a href="https://github.com/cosmos-book/cosmos-book.github.io/tree/master/human-spaceflight/data/'+a.file+'" class="repo">data file<\/a>';
				return text;
			}
		});

		$(document).on('click','.jumper',function(e){
			e.preventDefault();
			e.stopPropagation();
			// Get the element we need to jump to; its ID is stored in the data-id attribute
			var el = $('#'+$(this).attr('data-id'));
			// Scroll the timeline to the appropriate place
			app.parent().scrollLeft(parseInt(el.css('margin-left')));
			// Simulate a click of the element
			el.trigger('click')
		});
		
		// We can hide the loader/spinner as everything seems to be OK
		$('.loader').hide();
		$('.js-only').removeClass('js-only');
	}

	// Load the data file
	loadJSON(getDataPath('#data'),parseIt,{error:function(){ $('.loader').html("Oops. Couldn't find the data."); }});

	// If we click elsewhere we will deselect the astronaut
	$(document).on('click',function(e){ $('.human').removeClass('selected'); });
	
	// Hide any non-Javascript elements
	$('.noscript').hide();

	function makeGridLines(mx,mn){
		var step = 1;		// A grid spacing of 1 year
		var a = Math.ceil(mn/step)*step;
		var b = Math.floor(mx/step)*step;
		var html = "";

		for(var i = a; i <= b; i+=step) html += '<div class="gridline" style="'+'left:'+(100*((i-mn)/(mx-mn)))+'%"><span class="label">'+(i)+'<\/span><\/div>';

		return html;
	}

	function makeLabels(mx,mn,labels){
		var html = "";
		var d,l;
		var scale = 1/(mx-mn);
		var wide = app.width();

		for(var i = 0 ; i < labels.length; i++){
			d = (labels[i].date) ? new Date(labels[i].date) : new Date();
			l = 100*((d-mn)*scale);
			html += '<div class="labelline" style="'+'left:'+l.toFixed(3)+'%"><span class="label"'+(labels[i].pos ? 'style="bottom:'+(labels[i].pos*1.5)+'em;"' : '')+'>'+(labels[i].text)+'<\/span><\/div>';
		}

		return html;
	}

})