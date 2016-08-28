#!/usr/bin/perl

$limit = $ARGV[0];
if(!$limit){ $limit = 6e-6; }

$dir = "data";
$dataurl = "http://www.ngdc.noaa.gov/stp/space-weather/solar-data/solar-features/solar-flares/x-rays/goes/xrs/";
($sec,$min,$hour,$mday,$mon,$yy,$wday) = (localtime(time))[0,1,2,3,4,5,6];
if($yy < 1900){ $yy += 1900; }


#Date,Class,Value (W/m*2)
#1976-03-21T07:56,M4,0.000040
#1976-03-21T18:29,M2,0.000020

$json = "[";

$csv = "";

$csv = "Date,Class,Value (W/m*2)";
$csvx = $csv;

for($y = 1976; $y <= $yy; $y++){
	$year = sprintf("%04d",$y);
	
	$file = "goes-xrs-report_".$year.".txt";
	if($y == $yy){ $file = "goes-xrs-report_".$year."ytd.txt"; }

	if(!-e "$dir/$file"){
		`wget -q -O $dir/$file $dataurl$file`;
	}

	open(FILE,"$dir/$file");
	@lines = <FILE>;
	close(FILE);
	
	foreach $line (@lines){

		if($line =~ /^31777(..)(..)(..)..(....).(....).(....).(......)...{23}(.)(...)........./){
			$date = $year."-".$2."-".$3;
			$time = $4;
			$class = $8;
			$int = $9;
			if($int =~ /(..) /){ $int = $1."0"; }
			$int /= 10;

			if($time =~ /([0-9][0-9])([0-9][0-9])/){
				$date .= "T$1:$2";
			}
			if($class eq "X"){ $value = 1e-4; }
			elsif($class eq "M"){ $value = 1e-5; }
			elsif($class eq "C"){ $value = 1e-6; }
			elsif($class eq "B"){ $value = 1e-7; }
			$value *= $int;
			if($value > $limit && ($class eq "X" || $class eq "M" || $class eq "C" )){
				$csv .= "\n$date,$class$int,".sprintf("%f",$value);
				if($value >= 1e-4){ $csvx .= "\n$date,$class$int,".sprintf("%f",$value); }
				if(length($json) > 10){ $json .= ","; }
				$json .= "{ \"d\": \"$date\", \"m\": ".sprintf("%g",$value)." }";
			}
		}
	}
}
$json .= "]";

open(CSV,">","$dir/goes.csv");
print CSV $csv;
close(CSV);

open(CSV,">","$dir/goes_x.csv");
print CSV $csvx;
close(CSV);

open(JSON,">","$dir/goes.json");
print JSON $json;
close(JSON);
