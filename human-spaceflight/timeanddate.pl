# Sun-routines for formatting time and date

sub formatTime {
	my $s = $_[0];
	my $h = int($_[0]/3600);
	my $m = int(0.5 + ($s - $h*3600)/60);
	return sprintf("%02d:%02d",$h,$m);
}

sub extractTime {

	my ($output);
	my $str = $_[0];
	
	$output = "";
	$seconds = 0;

	if($str =~ /^([0-9]+)d/){ $seconds += $1*86400; }
	if($str =~ /(^|d)([0-9]+)h/){ $seconds += $2*3600; }
	if($str =~ /(^|h)([0-9]+)m/){ $seconds += $2*60; }

	return ($seconds);
}


sub duration {
	my $date_a = $_[0];
	my $date_b = $_[1];	# e.g. 15 March 2009, 23:43 UTC
	my ($launch,$land,$diff);
	$diff = 0;

	$launch = parseDate($date_a);
	$land = parseDate($date_b);
	

	if($launch && $land){
		$diff = int($land-$launch+0.5);
	}
	
	return $diff;
}


# Parse a date in either
# * 2014-10-07T13:14:12
# * 15 March 2009, 23:43 UTC
# * August 6, 1985, 19:45:26 UTC
sub parseDate {

	my $date = $_[0];
	my $t = 0;
	
	my %months = (
		'Jan', 1,
		'January', 1,
		'Feb', 2,
		'February', 2,
		'Mar',3,
		'March',3,
		'Apr',4,
		'April',4,
		'May',5,
		'Jun',6,
		'June',6,
		'Jul',7,
		'July',7,
		'Aug',8,
		'August',8,
		'Sep',9,
		'Sept',9,
		'September',9,
		'Oct',10,
		'October',10,
		'Nov',11,
		'November',11,
		'Dec',12,
		'December',12,
	);

	if($date =~ /^([0-9]+) ([A-za-z]+) ([0-9]{4})\, ([0-9]{2}):([0-9]{2}):?([0-9\.]*)/){
		$t = timegm($6+0,$5+0,$4+0,$1+0,$months{$2}-1,$3);
	}elsif($date =~ /^([A-za-z]+) ([0-9]+)\, ([0-9]{4})\, ([0-9]{2}):([0-9]{2}):?([0-9\.]*)/){
		$t = timegm($6+0,$5+0,$4+0,$2+0,$months{$1}-1,$3);
	}elsif($date =~ /^([0-9]{4})\-([0-9]{2})\-([0-9]{2})T([0-9]{2}):([0-9]{2}):?([0-9\.]*)/){
		$t = timegm($6+0,$5+0,$4+0,$3+0,$2-1,$1);
	}
	
	return $t;
}
1;