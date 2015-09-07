$(document).ready(function(){

	var now = new Date();
	var start = new Date('1961-04-12T07:00Z');
	var end = new Date();
	var trips = new Array();
	var pxperyear = 1095;
	var h = Math.round(pxperyear*(end-start)/(86400000*365.25));
	$('#timeline').css({'min-height':h});
	$('.loader').remove();
	$('#timeline ol').hide();
	$('#scrollmsg').html('Scroll down to go back in time &#8675;')
	parseTrips();

	updateTimeline(getYFrac());
	
	setFromAnchor();
	
	// We create a variable used if we've set the scroll position
	var scrollTop = 0;
	$(document).on('scroll',{'test':'me'},function(e){
		updateTimeline(getYFrac());
		scrollTop = 0;	// Reset variable
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

		html = '<ul>';
		for(var i = 0; i < trips.length; i++){
			if((trips[i].launchday < d && trips[i].landday > d) || (trips[i].launchday < d && !trips[i].landday)){
				html += '<li class="human '+trips[i].category+'"><div class="padder"><span class="name">'+trips[i].name+'</span></div><\/li>';
			}
		}
		html += '<\/ul>';

		$('#inspace').html(html);
	}
	function parseTrips(){
		var a = $('#timeline ol.trips li');
		for(var i = 0; i < a.length; i++){
			var t = $(a[i]).find('time');
			var launch = new Date($(t[0]).attr('datetime'));
			var launchday = new Date($(t[0]).attr('datetime'));
			if(launchday){
				launchday.setHours(0);
				launchday.setMinutes(0);
				launchday.setSeconds(0);
			}
			var land = ($(t[1]).attr('datetime')!="" ? new Date($(t[1]).attr('datetime')) : '');
			var landday = ($(t[1]).attr('datetime')!="" ? new Date($(t[1]).attr('datetime')) : '');
			if(landday){
				landday.setHours(23);
				landday.setMinutes(59);
				landday.setSeconds(59);
			}
			trips.push({'launch':launch,'land':land,'launchday':launchday,'landday':landday,'name':$(a[i]).find('.name').html(),'category':$(a[i]).find('.human').attr('class').substr(6)});
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