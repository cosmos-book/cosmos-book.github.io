#!/usr/bin/perl
##########################
# Astronaut MD/YAML parser
##########################

use Time::Local;

# Find directory of this script
$pathdir = $0;
$pathdir =~ s/(\/?)[^\/]*$/$1/;
$datadir = $pathdir."data/";
$procdir = $datadir."processed/";

# Require the time and date sub-routines
require($pathdir.'timeanddate.pl');

# Define some values
$speed_light = 299792458;   # The speed of light in a vacuum
$speed_leo = 8050;          # Low Earth Orbit speed in m/s
$speed_moon = 11082.5;      # Speed to the Moon for Apollo missions 39,897 km/h
$epsilon_leo = (1 - ($speed_leo*$speed_leo)/($speed_light*$speed_light));
$epsilon_moon = (1 - ($speed_moon*$speed_moon)/($speed_light*$speed_light));
$gamma_leo = 1/sqrt($epsilon_leo);
$gamma_moon = 1/sqrt($epsilon_moon);

%countrycode = ('ABW'=>'Aruba','AFG'=>'Afghanistan','AGO'=>'Angola','AIA'=>'Anguilla','ALA'=>'&Aring;land Islands','ALB'=>'Albania','AND'=>'Andorra','ARE'=>'United Arab Emirates','ARG'=>'Argentina','ARM'=>'Armenia','ASM'=>'American Samoa','ATA'=>'Antarctica','ATF'=>'French Southern Territories','ATG'=>'Antigua and Barbuda','AUS'=>'Australia','AUT'=>'Austria','AZE'=>'Azerbaijan','BDI'=>'Burundi','BEL'=>'Belgium','BEN'=>'Benin','BES'=>'Bonaire, Sint Eustatius and Saba','BFA'=>'Burkina Faso','BGD'=>'Bangladesh','BGR'=>'Bulgaria','BHR'=>'Bahrain','BHS'=>'Bahamas','BIH'=>'Bosnia and Herzegovina','BLM'=>'Saint Barthélemy','BLR'=>'Belarus','BLZ'=>'Belize','BMU'=>'Bermuda','BOL'=>'Bolivia, Plurinational State of','BRA'=>'Brazil','BRB'=>'Barbados','BRN'=>'Brunei Darussalam','BTN'=>'Bhutan','BVT'=>'Bouvet Island','BWA'=>'Botswana','CAF'=>'Central African Republic','CAN'=>'Canada','CCK'=>'Cocos (Keeling) Islands','CHE'=>'Switzerland','CHL'=>'Chile','CHN'=>'China','CIV'=>'Côte d\'Ivoire','CMR'=>'Cameroon','COD'=>'Congo, the Democratic Republic of the','COG'=>'Congo','COK'=>'Cook Islands','COL'=>'Colombia','COM'=>'Comoros','CPV'=>'Cabo Verde','CRI'=>'Costa Rica','CUB'=>'Cuba','CUW'=>'Curaçao','CXR'=>'Christmas Island','CYM'=>'Cayman Islands','CYP'=>'Cyprus','CZE'=>'Czech Republic','DEU'=>'Germany','DJI'=>'Djibouti','DMA'=>'Dominica','DNK'=>'Denmark','DOM'=>'Dominican Republic','DZA'=>'Algeria','ECU'=>'Ecuador','EGY'=>'Egypt','ERI'=>'Eritrea','ESH'=>'Western Sahara','ESP'=>'Spain','EST'=>'Estonia','ETH'=>'Ethiopia','FIN'=>'Finland','FJI'=>'Fiji','FLK'=>'Falkland Islands (Malvinas)','FRA'=>'France','FRO'=>'Faroe Islands','FSM'=>'Micronesia, Federated States of','GAB'=>'Gabon','GBR'=>'United Kingdom','GEO'=>'Georgia','GGY'=>'Guernsey','GHA'=>'Ghana',	'GIB'=>'Gibraltar','GIN'=>'Guinea','GLP'=>'Guadeloupe','GMB'=>'Gambia','GNB'=>'Guinea-Bissau','GNQ'=>'Equatorial Guinea','GRC'=>'Greece','GRD'=>'Grenada','GRL'=>'Greenland','GTM'=>'Guatemala','GUF'=>'French Guiana','GUM'=>'Guam','GUY'=>'Guyana','HKG'=>'Hong Kong','HMD'=>'Heard Island and McDonald Islands','HND'=>'Honduras','HRV'=>'Croatia','HTI'=>'Haiti','HUN'=>'Hungary','IDN'=>'Indonesia','IMN'=>'Isle of Man','IND'=>'India','IOT'=>'British Indian Ocean Territory','IRL'=>'Ireland','IRN'=>'Iran, Islamic Republic of','IRQ'=>'Iraq','ISL'=>'Iceland','ISR'=>'Israel','ITA'=>'Italy','JAM'=>'Jamaica','JEY'=>'Jersey','JOR'=>'Jordan','JPN'=>'Japan','KAZ'=>'Kazakhstan','KEN'=>'Kenya','KGZ'=>'Kyrgyzstan','KHM'=>'Cambodia','KIR'=>'Kiribati','KNA'=>'Saint Kitts and Nevis','KOR'=>'Korea, Republic of','KWT'=>'Kuwait','LAO'=>'Lao People\'s Democratic Republic','LBN'=>'Lebanon','LBR'=>'Liberia','LBY'=>'Libya','LCA'=>'Saint Lucia','LIE'=>'Liechtenstein','LKA'=>'Sri Lanka','LSO'=>'Lesotho','LTU'=>'Lithuania','LUX'=>'Luxembourg','LVA'=>'Latvia','MAC'=>'Macao','MAF'=>'Saint Martin (French part)','MAR'=>'Morocco','MCO'=>'Monaco','MDA'=>'Moldova, Republic of','MDG'=>'Madagascar','MDV'=>'Maldives','MEX'=>'Mexico','MHL'=>'Marshall Islands','MKD'=>'Macedonia, the former Yugoslav Republic of','MLI'=>'Mali','MLT'=>'Malta','MMR'=>'Myanmar','MNE'=>'Montenegro','MNG'=>'Mongolia','MNP'=>'Northern Mariana Islands','MOZ'=>'Mozambique','MRT'=>'Mauritania','MSR'=>'Montserrat','MTQ'=>'Martinique','MUS'=>'Mauritius','MWI'=>'Malawi','MYS'=>'Malaysia','MYT'=>'Mayotte','NAM'=>'Namibia','NCL'=>'New Caledonia','NER'=>'Niger','NFK'=>'Norfolk Island','NGA'=>'Nigeria','NIC'=>'Nicaragua','NIU'=>'Niue',	'NLD'=>'Netherlands','NOR'=>'Norway','NPL'=>'Nepal','NRU'=>'Nauru','NZL'=>'New Zealand','OMN'=>'Oman','PAK'=>'Pakistan','PAN'=>'Panama','PCN'=>'Pitcairn','PER'=>'Peru','PHL'=>'Philippines','PLW'=>'Palau','PNG'=>'Papua New Guinea','POL'=>'Poland','PRI'=>'Puerto Rico','PRK'=>'Korea, Democratic People\'s Republic of','PRT'=>'Portugal','PRY'=>'Paraguay','PSE'=>'Palestine, State of','PYF'=>'French Polynesia','QAT'=>'Qatar','REU'=>'Réunion','ROU'=>'Romania','RUS'=>'Russian Federation','RWA'=>'Rwanda','SAU'=>'Saudi Arabia','SDN'=>'Sudan','SEN'=>'Senegal','SGP'=>'Singapore','SGS'=>'South Georgia and the South Sandwich Islands','SHN'=>'Saint Helena, Ascension and Tristan da Cunha','SJM'=>'Svalbard and Jan Mayen','SLB'=>'Solomon Islands','SLE'=>'Sierra Leone','SLV'=>'El Salvador','SMR'=>'San Marino','SOM'=>'Somalia','SPM'=>'Saint Pierre and Miquelon','SRB'=>'Serbia','SSD'=>'South Sudan','STP'=>'Sao Tome and Principe','SUR'=>'Suriname','SVK'=>'Slovakia','SVN'=>'Slovenia','SWE'=>'Sweden','SWZ'=>'Swaziland','SXM'=>'Sint Maarten (Dutch part)','SYC'=>'Seychelles','SYR'=>'Syrian Arab Republic','TCA'=>'Turks and Caicos Islands','TCD'=>'Chad','TGO'=>'Togo','THA'=>'Thailand','TJK'=>'Tajikistan','TKL'=>'Tokelau','TKM'=>'Turkmenistan','TLS'=>'Timor-Leste','TON'=>'Tonga','TTO'=>'Trinidad and Tobago','TUN'=>'Tunisia','TUR'=>'Turkey','TUV'=>'Tuvalu','TWN'=>'Taiwan, Province of China','TZA'=>'Tanzania, United Republic of','UGA'=>'Uganda','UKR'=>'Ukraine','UMI'=>'United States Minor Outlying Islands','URY'=>'Uruguay','USA'=>'United States','UZB'=>'Uzbekistan','VAT'=>'Holy See (Vatican City State)','VCT'=>'Saint Vincent and the Grenadines','VEN'=>'Venezuela, Bolivarian Republic of','VGB'=>'Virgin Islands, British','VIR'=>'Virgin Islands, U.S.','VNM'=>'Viet Nam','VUT'=>'Vanuatu','WLF'=>'Wallis and Futuna','WSM'=>'Samoa','YEM'=>'Yemen','ZAF'=>'South Africa','ZMB'=>'Zambia','ZWE'=>'Zimbabwe','URS'=>'Soviet Union','GDR'=>'East Germany','TCH'=>'Czechoslovakia');


# Find all the astronaut Markdown files
@files = ();
# Open astronaut directory
opendir($dh,$datadir);
while(my $file = readdir $dh) {
	if($file =~ /^.*_.*.md$/i){
		push(@files,$file);
	}
}
closedir($dh);

@output = "";
@li = "";
%byyear = "";
$reflist = "";
$json = "";

# Loop over the files
foreach $file (sort(@files)){

	# Open the file
	open(FILE,"$datadir$file");
	@lines = <FILE>;
	close(FILE);

	# Reset variables
	$name = "";
	$dob = "";
	$type = "";
	$quals = "";
	$refs = "";
	$category = "";
	$timeinspace = 0;
	$timedilation = 0;
	$distance = 0;
	$eva = 0;
	$evas = 0;
	$country = "";
	$gender = "";
	$twitter = "";
	$missions = "";
	$inspace = 0;
	$inmission = 0;
	$inrefs = 0;
	$inquals = 0;
	$ineva = 0;
	$incountry = 0;
	$age = 0;
	$reset = 0;
	$launch = "";
	$firstlaunch = "";
	$longesttrip = 0;
	$launches = 0;
	$land = "";
	$mname = "";
	$reset = 0;
	$json_mission = "";
	$json_missionname = "";

	# Pre-check for country
	foreach $line (@lines){
		if($line =~ /^country:\t(.*)/){ $country = $1; }
		if($incountry){
			if($line =~ / -[\t\s]*(.*)/){
				if($country){ $country .= ";"; }
				$country .= $1;
			}
		}
		# Which section of the yaml are we in?
		if($line =~ /^qualifications:/){ $inmission = 0; $inrefs = 0; $inquals = 1; $ineva = 0; $incountry = 0; }
		if($line =~ /^references:/){ $inmission = 0; $inrefs = 1; $inquals = 0; $ineva = 0; $incountry = 0; }
		if($line =~ /^missions:/){ $inmission = 1; $inrefs = 0; $inquals = 0; $ineva = 0; $incountry = 0; }
		if($line =~ /^evas:/){ $ineva = 1; $inmission = 0; $inrefs = 0; $inquals = 0; $incountry = 0; }
		if($line =~ /^country:/){ $ineva = 0; $inmission = 0; $inrefs = 0; $inquals = 0; $incountry = 1; }
		if($line =~ /^gender:/){ $ineva = 0; $inmission = 0; $inrefs = 0; $inquals = 0; $incountry = 0; }
		if($line =~ /^twitter:/){ $ineva = 0; $inmission = 0; $inrefs = 0; $inquals = 0; $incountry = 0; }
		if($line =~ /^country:/){ $ineva = 0; $inmission = 0; $inrefs = 0; $inquals = 0; $incountry = 1; }
	}

	foreach $line (@lines){

		$line =~ s/[\n\r]//g;	# Remove newline characters

		# Find the values for various properties
		if($line =~ /^name:\t(.*)/){ $name = $1; $name =~ s/\s*$//; }
		if($line =~ /^dob:\t(.*)/){ $dob = $1; }
		#if($line =~ /^country:\t(.*)/){ $country = $1; }
		if($line =~ /^category:\t(.*)/){ $category = $1; }
		if($line =~ /^gender:\t(.*)/){ $gender = $1; }
		if($line =~ /^twitter:\t(.*)/){ $twitter = $1; }

		if($inmission){

			# Get the current time
			($sec,$min,$hour,$mday,$mon,$year,$wday,$yday,$isdst) = gmtime();

			# Build an ISO 8601 date string for the current time
			$now = sprintf("%04d",$year+1900)."-".sprintf("%02d",$mon+1)."-".sprintf("%02d",$mday)."T".sprintf("%02d",$hour).":".sprintf("%02d",$min)."Z";

			# We need to allow for an astronaut launching on one mission and landing on another.
			# If there is just a launch date we'll assume the next line is the landing date.
			if($line =~ /name:[\t\s]*([^\n\r]*)/){
				$mname = $1;
				if($missions){ $missions .= ";"; }
				$missions .= "$mname";
				if($json_missionname){ $json_missionname .= ";"; }
				$json_missionname .= "$mname";
			}elsif($line =~ /time_start:[\t\s]*([^\n\r]*)/){
				$t1 = $1;
				$land = "";
				if($t1){
					$launch = $1;
					$launches++;
					if(!$firstlaunch){
						$firstlaunch = $launch;
						$age = int(duration(fixDate($dob)."T00:00Z",$launch)/(365.25*86400));
						if($age < 20){ 
							print "$name seems to be $age years old at first launch\n";
						}
					}
				}else{
					#print "$name has no start time for $mname (may need checking)\n";
				}
			}elsif($line =~ /time_end:[\t\s]*([^\n\r]*)/){
				$t2 = $1;
				if($t2){
					$land = $t2;
				}else{
					#print "$name has no end time for $mname (may need checking)\n";
				}
			}else{
				if(!$land && $launch){
					if(duration($launch,$now) < 300*86400){
						print "$name is in space (launched $launch)\n";
						$inspace = 1;
						$land = $now;
					}
				}
			}
			
			# If we have both a launch time and a landing time, we 
			# calculate how long they've spent in space, their distance
			# travelled etc.
			if($launch && $land){

				$json_mission .= "{\"names\":\"$json_missionname\",\"a\":\"$launch\",\"b\":\"".($inspace==1 ? "": $land)."\"},";
				$json_missionname = "";
				$launchstr = $launch;
				$launchstr =~ s/T.*$//g;
				$landstr = ($inspace==1 ? "": $land);
				$yearstr = $landstr;
				$yearstr =~ s/T.*$//g;
				if($country eq ""){ print "Can't find country for $name\n"; }
				@countries = split(/;/,$country);
				$n = @countries;
				$countrystr = '';
				for($n = 0; $n < @countries; $n++){
					if($countrystr){ $countrystr .= "/"; }
					$countrystr .= '<span class="country '.$countries[$n].'">'.$countrycode{$countries[$n]}.'</span>';
				}
				#push(@li,'<li><span class="d"><time datetime="'.$launch.'">'.$launchstr.'</time>-<time datetime="'.$land.'">'.$landstr.'</time></span>/<span class="name">'.$name.'</span>/'.$countrystr.'/<time datetime="'.$dob.'" class="dob">'.$dob.'</time><span class="human '.$category.'"></span></li>');
				# We temporarily put the category at the end for the purposes of sorting
				push(@li,'<li><div class="padder"><time datetime="'.$launch.'">'.$launchstr.'</time><span class="divider">-</span><time datetime="'.$landstr.'">'.$yearstr.'</time><span class="divider">/</span><span class="name">'.$name.'</span><span class="human '.$category.'"></span></div></li>');

				$durn = duration($launch,$land);
				if($durn > $longesttrip){ $longesttrip = $durn; }
				$timeinspace += $durn;	# Add the duration
				$timedilation += $durn*(($mname =~ /Apollo/ ? $gamma_moon : $gamma_leo)-1);

				# For Apollo missions we'll set the distance as that to the Moon and back (380,000 km each way)
				$distance += ($mname =~ /Apollo/ ? 760000000 : $speed_leo*$durn);

				# Work out the years the astronaut is in space
				$launch =~ /^([0-9]{4})/;
				$y = $1;
				if($byyear{$y}{'total'}){
					$byyear{$y}{'total'}++;
				}else{
					$byyear{$y}{'total'} = 1;
				}
				if($byyear{$y}{$gender}){
					$byyear{$y}{$gender}++;
				}else{
					$byyear{$y}{$gender} = 1;
				}

				$land =~ /^([0-9]{4})/;
				if($1 != $y){
					$y2 = $1;
					# Loop over the years of the mission
					for($y = $y ; $y < $y2; $y++){
						if($byyear{$y}{'total'}){
							$byyear{$y}{'total'}++;
						}else{
							$byyear{$y}{'total'} = 1;
						}
						if($byyear{$y}{$gender}){
							$byyear{$y}{$gender}++;
						}else{
							$byyear{$y}{$gender} = 1;
						}
					}
				}

				$launch = "";
			}
		}
		# Get the length of the extra-vehicular activity
		if($ineva){
    		if($line =~ /duration:[\s\t]*([0-9dhms]*)/){
				$eva += extractTime($1);
				$evas++;
    		}
		}
		# Build a reference list
		if($inrefs){
			if($line =~ / -[\t\s]*(.*)/){
				$refs = $1;
				$reflist .= "* **$name**: $refs\n";
			}
		}
		if($inquals){
			if($line =~ / -[\t\s]*(.*)/){
				if($quals){ $quals .= ";"; }
				$quals .= "$1";
			}
		}
		#if($incountry){
		#	if($line =~ / -[\t\s]*(.*)/){
		#		if($country){ $country .= ";"; }
		#		$country .= $1;
		#	}
		#}
		
		$name =~ s/\"/\'/g;	# Fix nickname quoting

		# Which section of the yaml are we in?
		if($line =~ /^qualifications:/){ $inmission = 0; $inrefs = 0; $inquals = 1; $ineva = 0; $incountry = 0; }
		if($line =~ /^references:/){ $inmission = 0; $inrefs = 1; $inquals = 0; $ineva = 0; $incountry = 0; }
		if($line =~ /^missions:/){ $inmission = 1; $inrefs = 0; $inquals = 0; $ineva = 0; $incountry = 0; }
		if($line =~ /^evas:/){ $ineva = 1; $inmission = 0; $inrefs = 0; $inquals = 0; $incountry = 0; }
		if($line =~ /^country:/){ $ineva = 0; $inmission = 0; $inrefs = 0; $inquals = 0; $incountry = 1; }
		if($line =~ /^gender:/){ $ineva = 0; $inmission = 0; $inrefs = 0; $inquals = 0; $incountry = 0; }
		if($line =~ /^twitter:/){ $ineva = 0; $inmission = 0; $inrefs = 0; $inquals = 0; $incountry = 0; }
	}
	
	$json_mission =~ s/\,$//;

	# If the person has spent time in space we build some JSON for them
	if($timeinspace){
		$json .= "\"$name\":{\"category\":\"$category\",\"gender\":\"$gender\",\"dob\":\"$dob\",\"country\":\"$country\",\"eva\":$eva,\"file\":\"$file\",\"missions\":[$json_mission]".($twitter ne "" ? ",\"twitter\":\"$twitter\"" : "")."},\n";
	}

	# Print a warning that no gender (Male/Female/Other) is set
	if($gender ne "Male" && $gender ne "Female" && $gender ne "Other"){ print "$name is without a gender (Male/Female/Other)\n"; }

	# If anyone doesn't have a country but is defined as "astronauts" we'll set their country to the USA
	if(!$country && $category eq "astronauts"){ $country = "USA"; }

	# Store some tsv data for them
	push(@output,"$name\t$country\t$gender\t$dob\t".sprintf("%.2f",$timeinspace/86400)."\t$timeinspace\t$eva\t$launches\t$evas\t$firstlaunch\t".sprintf("%.6f",$timedilation)."\t$age\t$quals\t$missions\t".sprintf("%.2f",$longesttrip/86400)."\t".sprintf("%d",$distance/1000)."\t".formatTime($eva)."\t".$category."\t".$file."\t".($inspace ? $now : "")."\t".$twitter);

}


$json =~ s/\,$//;
$json = "{$json}\n";
open(FILE,">",$procdir."astronauts.json");
print FILE "$json";
close(FILE);

open(FILE,">",$procdir."astronauts.tsv");
print FILE "Name\tCountry\tGender\tDate of Birth\tTime in Space (days)\tTime in Space (s)\tEVA Time (s)\tNumber of Launches\tNumber of EVAs\tFirst Launch\tTime dilation (s)\tAge at first launch (yr)\tQualifications\tMissions\tLongest single trip (days)\tTotal distance covered (km)\tEVA (hh:mm)\tType\tFilename\tIn space as of\tTwitter";
$i = 0;
foreach $out (@output){
	if($i > 0){ print FILE "\n"; }
	print FILE "$out";
	$i++;
}
close(FILE);

open(FILE,'who.html');
@lines = <FILE>;
close(FILE);
open(FILE,'>','who.html');
$inmain = 0;
$indent = "";
foreach $line (@lines){

	if($line =~ /<\!-- End Timeline -->/){ $inmain = 0; }
	if($inmain==0){ print FILE $line; }
	if($line =~ /^([\s]*)<\!-- Start Timeline -->/){
		$inmain = 1;
		$indent = $1; 
		print FILE $indent."<ol class=\"timeline\">\n";
		@li = reverse(sort(@li));
		for($i = 0; $i < @li; $i++){
			$li[$i] =~ s/(<li)(>.*)<span( class="human[^\"]*")><\/span>/$1$3$2/g;
			# Only add those currently in space as raw HTML
			if($li[$i] =~ /<span class="divider">-<\/span><time datetime=""><\/time>/){
				print FILE $indent."\t".$li[$i]."\n";
			}
		}
		print FILE $indent."</ol>\n";
	}
}
close(FILE);


print "$procdir\n";
open(FILE,">",$procdir."references.md");
print FILE "# References\n";
print FILE $reflist;
close(FILE);



sub fixDate {
	my $d = $_[0];
	$d =~ s/\?\?/01/g;
	if(length($d)==4){
		$d .= "-01-01";	# We don't know the month or day so set them to the start of the year
	}
	if(length($d)==7){
		$d .= "-01";	# We don't know the day so set it to the start of the month
	}
	return $d;
}
