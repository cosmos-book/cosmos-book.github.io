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

	foreach $line (@lines){

		$line =~ s/[\n\r]//g;	# Remove newline characters

		# Find the values for various properties
		if($line =~ /^name:\t(.*)/){ $name = $1; $name =~ s/\s*$//; }
		if($line =~ /^dob:\t(.*)/){ $dob = $1; }
		if($line =~ /^country:\t(.*)/){ $country = $1; }
		if($line =~ /^category:\t(.*)/){ $category = $1; }
		if($line =~ /^gender:\t(.*)/){ $gender = $1; }

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
						$age = int(duration($dob."T00:00Z",$launch)/(365.25*86400));
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
		if($incountry){
			if($line =~ / -[\t\s]*(.*)/){
				if($country){ $country .= ";"; }
				$country .= $1;
			}
		}
		
		$name =~ s/\"/\'/g;	# Fix nickname quoting

		# Which section of the yaml are we in?
		if($line =~ /^qualifications:/){ $inmission = 0; $inrefs = 0; $inquals = 1; $ineva = 0; $incountry = 0; }
		if($line =~ /^references:/){ $inmission = 0; $inrefs = 1; $inquals = 0; $ineva = 0; $incountry = 0; }
		if($line =~ /^missions:/){ $inmission = 1; $inrefs = 0; $inquals = 0; $ineva = 0; $incountry = 0; }
		if($line =~ /^evas:/){ $ineva = 1; $inmission = 0; $inrefs = 0; $inquals = 0; $incountry = 0; }
		if($line =~ /^country:/){ $ineva = 0; $inmission = 0; $inrefs = 0; $inquals = 0; $incountry = 1; }
		if($line =~ /^gender:/){ $ineva = 0; $inmission = 0; $inrefs = 0; $inquals = 0; $incountry = 0; }
	}
	
	$json_mission =~ s/\,$//;

	# If the person has spent time in space we build some JSON for them
	if($timeinspace){
		$json .= "\"$name\":{\"category\":\"$category\",\"gender\":\"$gender\",\"dob\":\"$dob\",\"country\":\"$country\",\"eva\":$eva,\"file\":\"$file\",\"missions\":[$json_mission]},\n";
	}

	# Print a warning that no gender (Male/Female/Other) is set
	if($gender ne "Male" && $gender ne "Female" && $gender ne "Other"){ print "$name is without a gender (Male, Female or Other)\n"; }

	# If anyone doesn't have a country but is defined as "astronauts" we'll set their country to the USA
	if(!$country && $category eq "astronauts"){ $country = "USA"; }

	# Store some tsv data for them
	push(@output,"$name\t$country\t$gender\t$dob\t".sprintf("%.2f",$timeinspace/86400)."\t$timeinspace\t$eva\t$launches\t$evas\t$firstlaunch\t".sprintf("%.6f",$timedilation)."\t$age\t$quals\t$missions\t".sprintf("%.2f",$longesttrip/86400)."\t".sprintf("%d",$distance/1000)."\t".formatTime($eva)."\t".$category."\t".$file."\t".($inspace ? $now : ""));

}


$json =~ s/\,$//;
$json = "{$json}\n";
open(FILE,">",$procdir."astronauts.json");
print FILE "$json";
close(FILE);

open(FILE,">",$procdir."astronauts.tsv");
print FILE "Name\tCountry\tGender\tDate of Birth\tTime in Space (days)\tTime in Space (s)\tEVA Time (s)\tNumber of Launches\tNumber of EVAs\tFirst Launch\tTime dilation (s)\tAge at first launch (yr)\tQualifications\tMissions\tLongest single trip (days)\tTotal distance covered (km)\tEVA (hh:mm)\tType\tFilename\tIn space as of";
$i = 0;
foreach $out (@output){
	if($i > 0){ print FILE "\n"; }
	print FILE "$out";
	$i++;
}
close(FILE);
	
print "$procdir\n";
open(FILE,">",$procdir."references.md");
print FILE "# References\n";
print FILE $reflist;
close(FILE);


