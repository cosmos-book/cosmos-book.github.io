$(document).ready(function(){

	var now = new Date();
	var start = new Date('1961-04-12T07:00Z');
	var end = new Date();
	var trips = new Array();
	var pxperyear = 1095;
	var h = Math.round(pxperyear*(end-start)/(86400000*365.25));
	// We create a variable used if we've set the scroll position
	var scrollTop = 0;
	$('#timelinedummy').css({'min-height':h});
	$('.loader').remove();
	var cc = {'ABW':'Aruba','AFG':'Afghanistan','AGO':'Angola','AIA':'Anguilla','ALA':'&Aring;land Islands','ALB':'Albania','AND':'Andorra','ARE':'United Arab Emirates','ARG':'Argentina','ARM':'Armenia','ASM':'American Samoa','ATA':'Antarctica','ATF':'French Southern Territories','ATG':'Antigua and Barbuda','AUS':'Australia','AUT':'Austria','AZE':'Azerbaijan','BDI':'Burundi','BEL':'Belgium','BEN':'Benin','BES':'Bonaire, Sint Eustatius and Saba','BFA':'Burkina Faso','BGD':'Bangladesh','BGR':'Bulgaria','BHR':'Bahrain','BHS':'Bahamas','BIH':'Bosnia and Herzegovina','BLM':'Saint Barthélemy','BLR':'Belarus','BLZ':'Belize','BMU':'Bermuda','BOL':'Bolivia, Plurinational State of','BRA':'Brazil','BRB':'Barbados','BRN':'Brunei Darussalam','BTN':'Bhutan','BVT':'Bouvet Island','BWA':'Botswana','CAF':'Central African Republic','CAN':'Canada','CCK':'Cocos (Keeling) Islands','CHE':'Switzerland','CHL':'Chile','CHN':'China','CIV':'Côte d\'Ivoire','CMR':'Cameroon','COD':'Congo, the Democratic Republic of the','COG':'Congo','COK':'Cook Islands','COL':'Colombia','COM':'Comoros','CPV':'Cabo Verde','CRI':'Costa Rica','CUB':'Cuba','CUW':'Curaçao','CXR':'Christmas Island','CYM':'Cayman Islands','CYP':'Cyprus','CZE':'Czech Republic','DEU':'Germany','DJI':'Djibouti','DMA':'Dominica','DNK':'Denmark','DOM':'Dominican Republic','DZA':'Algeria','ECU':'Ecuador','EGY':'Egypt','ERI':'Eritrea','ESH':'Western Sahara','ESP':'Spain','EST':'Estonia','ETH':'Ethiopia','FIN':'Finland','FJI':'Fiji','FLK':'Falkland Islands (Malvinas)','FRA':'France','FRO':'Faroe Islands','FSM':'Micronesia, Federated States of','GAB':'Gabon','GBR':'United Kingdom','GEO':'Georgia','GGY':'Guernsey','GHA':'Ghana',	'GIB':'Gibraltar','GIN':'Guinea','GLP':'Guadeloupe','GMB':'Gambia','GNB':'Guinea-Bissau','GNQ':'Equatorial Guinea','GRC':'Greece','GRD':'Grenada','GRL':'Greenland','GTM':'Guatemala','GUF':'French Guiana','GUM':'Guam','GUY':'Guyana','HKG':'Hong Kong','HMD':'Heard Island and McDonald Islands','HND':'Honduras','HRV':'Croatia','HTI':'Haiti','HUN':'Hungary','IDN':'Indonesia','IMN':'Isle of Man','IND':'India','IOT':'British Indian Ocean Territory','IRL':'Ireland','IRN':'Iran, Islamic Republic of','IRQ':'Iraq','ISL':'Iceland','ISR':'Israel','ITA':'Italy','JAM':'Jamaica','JEY':'Jersey','JOR':'Jordan','JPN':'Japan','KAZ':'Kazakhstan','KEN':'Kenya','KGZ':'Kyrgyzstan','KHM':'Cambodia','KIR':'Kiribati','KNA':'Saint Kitts and Nevis','KOR':'Korea, Republic of','KWT':'Kuwait','LAO':'Lao People\'s Democratic Republic','LBN':'Lebanon','LBR':'Liberia','LBY':'Libya','LCA':'Saint Lucia','LIE':'Liechtenstein','LKA':'Sri Lanka','LSO':'Lesotho','LTU':'Lithuania','LUX':'Luxembourg','LVA':'Latvia','MAC':'Macao','MAF':'Saint Martin (French part)','MAR':'Morocco','MCO':'Monaco','MDA':'Moldova, Republic of','MDG':'Madagascar','MDV':'Maldives','MEX':'Mexico','MHL':'Marshall Islands','MKD':'Macedonia, the former Yugoslav Republic of','MLI':'Mali','MLT':'Malta','MMR':'Myanmar','MNE':'Montenegro','MNG':'Mongolia','MNP':'Northern Mariana Islands','MOZ':'Mozambique','MRT':'Mauritania','MSR':'Montserrat','MTQ':'Martinique','MUS':'Mauritius','MWI':'Malawi','MYS':'Malaysia','MYT':'Mayotte','NAM':'Namibia','NCL':'New Caledonia','NER':'Niger','NFK':'Norfolk Island','NGA':'Nigeria','NIC':'Nicaragua','NIU':'Niue',	'NLD':'Netherlands','NOR':'Norway','NPL':'Nepal','NRU':'Nauru','NZL':'New Zealand','OMN':'Oman','PAK':'Pakistan','PAN':'Panama','PCN':'Pitcairn','PER':'Peru','PHL':'Philippines','PLW':'Palau','PNG':'Papua New Guinea','POL':'Poland','PRI':'Puerto Rico','PRK':'Korea, Democratic People\'s Republic of','PRT':'Portugal','PRY':'Paraguay','PSE':'Palestine, State of','PYF':'French Polynesia','QAT':'Qatar','REU':'Réunion','ROU':'Romania','RUS':'Russian Federation','RWA':'Rwanda','SAU':'Saudi Arabia','SDN':'Sudan','SEN':'Senegal','SGP':'Singapore','SGS':'South Georgia and the South Sandwich Islands','SHN':'Saint Helena, Ascension and Tristan da Cunha','SJM':'Svalbard and Jan Mayen','SLB':'Solomon Islands','SLE':'Sierra Leone','SLV':'El Salvador','SMR':'San Marino','SOM':'Somalia','SPM':'Saint Pierre and Miquelon','SRB':'Serbia','SSD':'South Sudan','STP':'Sao Tome and Principe','SUR':'Suriname','SVK':'Slovakia','SVN':'Slovenia','SWE':'Sweden','SWZ':'Swaziland','SXM':'Sint Maarten (Dutch part)','SYC':'Seychelles','SYR':'Syrian Arab Republic','TCA':'Turks and Caicos Islands','TCD':'Chad','TGO':'Togo','THA':'Thailand','TJK':'Tajikistan','TKL':'Tokelau','TKM':'Turkmenistan','TLS':'Timor-Leste','TON':'Tonga','TTO':'Trinidad and Tobago','TUN':'Tunisia','TUR':'Turkey','TUV':'Tuvalu','TWN':'Taiwan, Province of China','TZA':'Tanzania, United Republic of','UGA':'Uganda','UKR':'Ukraine','UMI':'United States Minor Outlying Islands','URY':'Uruguay','USA':'United States','UZB':'Uzbekistan','VAT':'Holy See (Vatican City State)','VCT':'Saint Vincent and the Grenadines','VEN':'Venezuela, Bolivarian Republic of','VGB':'Virgin Islands, British','VIR':'Virgin Islands, U.S.','VNM':'Viet Nam','VUT':'Vanuatu','WLF':'Wallis and Futuna','WSM':'Samoa','YEM':'Yemen','ZAF':'South Africa','ZMB':'Zambia','ZWE':'Zimbabwe','URS':'Soviet Union','GDR':'East Germany','TCH':'Czechoslovakia'};

	// Load the data file
	loadJSON(getDataPath('#data'),parseIt,{error:function(){ $('.loader').html("Oops. Couldn't find the data."); }});

	// Add scroll event
	$(document).on('scroll',function(e){
		updateTimeline(getYFrac());
		$('.tooltip_close').trigger('click')
	});

	// Add event for monitoring anchor changes
	window[(this.pushstate) ? 'onpopstate' : 'onhashchange'] = function(e){ setFromAnchor(); };
	
	// Set the scroll position using the page anchor
	function setFromAnchor(){
		var a = location.href.split("#")[1];
		if(a) setYPos(a);
	}
	// Get the fractional position in time
	function getYFrac(){
		var tl = $('#now');
		// If we've set the scroll position we use that rather than read it to avoid rounding errors
		var y = (scrollTop) ? scrollTop : $(document).scrollTop();
		if(scrollTop==0 && $('#scrollmsg').is(':visible')) $('#scrollmsg').css('opacity',0);
		scrollTop = 0;
		var startscroll = (tl.offset().top);
		var endscroll = startscroll + tl.height();
		var frac = -1;
		if(y > startscroll) frac = (y-startscroll)/($(document).height() - $(window).height() - startscroll);
		if(y > endscroll) frac = 1;
		return frac;
	}
	// Set the vertical scroll using a date string
	function setYPos(a){
		var d = Date.parse(a);
		if(isFinite(d)){
			$('body').addClass('scrolling');	// Avoid the page changing in length
			var frac = (d-start.getTime())/(end.getTime()-start.getTime());
			var tl = $('#now');
			var startscroll = (tl.offset().top);
			//var endscroll = startscroll + tl.height();
			var y = ( (1-frac)*($(document).height() - $(window).height() - startscroll) + startscroll );
			scrollTop = y;
			$(document).scrollTop(y);
		}
	}
	function updateTimeline(frac){
		var d,html;
		if(frac >= 0){
			$('body').addClass('scrolling');
			d = new Date(start.getTime()+(end-start)*(1-frac));
		}else{
			$('body').removeClass('scrolling')
			d = new Date();
		}
		
		var iso = d.toISOString();
		html = '<div class="title"><time datetime="'+iso+'"><span class="date">'+iso.substr(0,10)+'<\/span><!--<span class="time">'+d.toLocaleTimeString()+'<\/span>--><\/time><\/div>';
		$('#calendar').html(html);

		html = '<ul class="timeline">';
		for(var i = 0; i < trips.length; i++){
			if((trips[i].launchday < d && trips[i].landday > d) || (trips[i].launchday < d && !trips[i].landday)){
				html += '<li class="human '+trips[i].category+'" id="'+i+'"><div class="padder"><span class="name">'+trips[i].name+'</span></div><\/li>';
			}
		}
		html += '<\/ul>';

		$('#inspace').html(html);
		// Set up the tooltip
		tooltip({
			'elements':$('.timeline .human'),
			'html':function(){
				var id = parseInt($(this).attr('id'));
				var a = trips[id];
				var text = '<div class="stripe '+a.category+'"><\/div><h3>'+a.name+'<\/h3><table>';
				text += '<tr><td>Gender:<\/td><td>'+a.gender+'<\/td><\/tr>';
				text += '<tr><td>Country:<\/td><td>'+formatArray(a.country,cc)+'<\/td><\/tr>';
				text += '<tr><td>Year of birth:<\/td><td>'+a.dob.getFullYear()+'<\/td><\/tr>';
				text += '<tr><td>Trips to space:<\/td><td>'+a.missions+'<\/td><\/tr>';
				if(a.twitter) text += '<tr><td>Twitter:<\/td><td><a href="https://twitter.com/'+a.twitter.substr(1)+'">'+a.twitter+'</a><\/td><\/tr>';
				var start = a.launch.toISOString().substr(0,10);
				var end = (a.land ? a.land.toISOString().substr(0,10) : '');
				text += '<tr><td>This trip:<\/td><td>'+start+(end!=start ? ' - '+end : '')+'<br />('+formatArray(a.missionnames)+')<\/td><\/tr>';
				text += '<\/table>';
				text += '<a href="https://github.com/cosmos-book/cosmos-book.github.io/tree/master/human-spaceflight/data/'+a.file+'" class="repo">data file<\/a>';
				return text;
			}
		});
	}

	function parseIt(data){
		var launch,land,launchday,landday;
		var html = "";
		
		var nmax = 1;
		
		// Function to add seconds to date strings if they don't exist otherwise Safari 5 can't cope
		function fixDateString(d){
			var t = d.indexOf('T');
			var z = d.indexOf('Z');
			if(z < 1) d = d+'Z';
			if(z-t == 6) d = d.substr(0,z)+':00Z';
			return d;
		}

		trips = new Array();
		for(name in data) {
			for(var m = 0; m < data[name].missions.length; m++){
				//var ms = data[name].missions[m].period.split(/;/);
				launch = (data[name].missions[m].a) ? new Date(fixDateString(data[name].missions[m].a)) : "";
				launchday = (data[name].missions[m].a) ? new Date(fixDateString(data[name].missions[m].a)) : "";
				land = (data[name].missions[m].b) ? new Date(fixDateString(data[name].missions[m].b)) : "";
				landday = (data[name].missions[m].b) ? new Date(fixDateString(data[name].missions[m].b)) : "";

				// The start of the launch day
				if(launchday){
					launchday.setHours(0);
					launchday.setMinutes(0);
					launchday.setSeconds(0);
				}
				// The end of the landing day
				if(landday){
					landday.setHours(23);
					landday.setMinutes(59);
					landday.setSeconds(59);
				}
				trips.push({
					'launch':launch,
					'land':land,
					'launchday':launchday,
					'landday':landday,
					'name':name,
					'category':data[name].category,
					'dob':new Date(data[name].dob),
					'missions':data[name].missions.length,
					'missionnames':data[name].missions[m].names.split(";"),
					'country':data[name].country,
					'gender':data[name].gender,
					'file':data[name].file,
					'twitter':data[name].twitter
				});
			}
		}

		$('#inspace .timeline').remove();
		$('#scrollmsg').html('Scroll down to go back in time &#8675;')
	
		updateTimeline(-1);
		setFromAnchor();

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