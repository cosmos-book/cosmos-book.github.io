#!/usr/bin/perl

# Find directory of this script
$pathdir = $0;
$pathdir =~ s/(\/?)[^\/]*$/$1/;
$datadir = $pathdir."data/";
$procdir = $datadir."processed/";

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


# Loop over the files
foreach $file (sort(@files)){

	# Open the file
	open(FILE,"$datadir$file");
	@lines = <FILE>;
	close(FILE);

	print "$file:\n";
	$update = 0;
	$foundbirthplace = 0;
	$nasa = 0;
	$insert = 1;
	
	for($i = 0; $i < (@lines);$i++){
		if($lines[$i] =~ /^birthplace/){ $foundbirthplace = 1; }
		if($lines[$i] =~ /740566main_current.pdf/){ $nasa = 1; }
		if($lines[$i] =~ /^dob/){ $insert = $i; }
	}

	print "$foundbirthplace, $nasa, $insert\n";
	if(!$foundbirthplace && $nasa){
	
		print "  Birth location for $file: ";
		$loc = <STDIN>;
		$loc =~ s/[\n\r]//g;

		print "  Getting $loc...\n";
		# Get locations from Yahoo API
		$url = "http://query.yahooapis.com/v1/public/yql?q=select * from geo.places where text=\\\"".$loc."\\\"&format=xml&diagnostics=true";
		$ua = "Mozilla/5.0 (Windows NT 5.1) AppleWebKit/535.1 (KHTML, like Gecko) Chrome/13.0.782.220 Safari/535.1";
		@results = `wget -qO- -U "$ua" -e robots=off "$url"`;

		# RETURN FORMAT:
		#<?xml version="1.0" encoding="UTF-8"?>
		#<query xmlns:yahoo="http://www.yahooapis.com/v1/base.rng" yahoo:count="2" yahoo:created="2015-10-05T19:29:27Z" yahoo:lang="en-GB"><diagnostics><publiclyCallable>true</publiclyCallable><url execution-start-time="2" execution-stop-time="6" execution-time="4"><![CDATA[http://unifiedgeo.geotech.yahoo.com:4080/geo/v1/geocode?q=Leeds%2C%20UK&start=0&size=10&optionalfields=woe.ancestors&minconfidence=0.0001]]></url><javascript execution-start-time="0" execution-stop-time="10" execution-time="10" instructions-used="47703" table-name="geo.places"></javascript><user-time>11</user-time><service-time>4</service-time><build-version>0.2.240</build-version></diagnostics><results><place xml:lang="en-US" xmlns="http://where.yahooapis.com/v1/schema.rng" xmlns:yahoo="http://www.yahooapis.com/v1/base.rng" yahoo:uri="http://where.yahooapis.com/v1/place/26042"><woeid>26042</woeid><placeTypeName code="7">Town</placeTypeName><name>Leeds</name><country code="GB" type="Country" woeid="23424975">United Kingdom</country><admin1 code="" type="Country" woeid="24554868">England</admin1><admin2 code="" type="County" woeid="12602197">West Yorkshire</admin2><admin3/><locality1 type="Town" woeid="26042">Leeds</locality1><locality2/><postal/><centroid><latitude>53.80901</latitude><longitude>-1.55937</longitude></centroid><boundingBox><southWest><latitude>53.730968</latitude><longitude>-1.69971</longitude></southWest><northEast><latitude>53.868359</latitude><longitude>-1.41434</longitude></northEast></boundingBox><areaRank>1</areaRank><popRank>1</popRank><timezone type="Time Zone" woeid="28350903">Europe/London</timezone></place><place xml:lang="en-US" xmlns="http://where.yahooapis.com/v1/schema.rng" xmlns:yahoo="http://www.yahooapis.com/v1/base.rng" yahoo:uri="http://where.yahooapis.com/v1/place/26043"><woeid>26043</woeid><placeTypeName code="7">Town</placeTypeName><name>Leeds</name><country code="GB" type="Country" woeid="23424975">United Kingdom</country><admin1 code="" type="Country" woeid="24554868">England</admin1><admin2 code="" type="County" woeid="12602173">Kent</admin2><admin3/><locality1 type="Town" woeid="26043">Leeds</locality1><locality2/><postal type="Postal Code" woeid="26787731">ME17</postal><centroid><latitude>51.248852</latitude><longitude>0.61197</longitude></centroid><boundingBox><southWest><latitude>51.230492</latitude><longitude>0.58881</longitude></southWest><northEast><latitude>51.26939</latitude><longitude>0.62149</longitude></northEast></boundingBox><areaRank>1</areaRank><popRank>1</popRank><timezone type="Time Zone" woeid="28350903">Europe/London</timezone></place></results></query><!-- total: 11 -->
		#<!-- pprd1-node602-lh1.manhattan.bf1.yahoo.com -->


		$results[1] =~ /^.*<results>(.*)<\/results>.*/;
		$result = $1;

		$result =~ s/<\/place>/\n/g;
		@r = split(/\n/,$result);
		$n = @r;
		@lats = ();
		@lons = ();
		$location = "";
		if($n == 1){
			$p = $r[0];
			$p =~ /<centroid><latitude>([^\<]*)<\/latitude><longitude>([^\<]*)<\/longitude><\/centroid>/;
			$lat = $1;
			$lon = $2;
			$location = "birthplace:\n  - name:\t$loc\n    latitude:\t$lat\n    longitude:\t$lon\n";
			$update = 1;
		}else{
			print "    Choose:\n";
			for($j = 0; $j < $n; $j++){
				$p = $r[$j];
				$p =~ /<centroid><latitude>([^\<]*)<\/latitude><longitude>([^\<]*)<\/longitude><\/centroid>/;
				push(@lats,$1);
				push(@lons,$2);
				$p =~ /<name>([^\<]*)<\/name>/;
				$name = $1;
				$p =~ /<admin1 [^\>]*>([^\<]*)<\/admin1>/;
				$admin = $1;
				print "      (".($j+1).") $lats[$j], $lons[$j] ($name, $admin)\n";
			}
			print "      (null) None of the above\n";
			print "    Enter choice: ";
			$choice = <STDIN>;
			if(!$choice){ $choice = -1; }
			if($choice eq ""){ $choice = -1; }
			if($choice + 0 != $choice){ $choice = -1; }
			if($choice >= 1){
				$location = "birthplace:\n  - name:\t$loc\n    latitude:\t".$lats[$choice-1]."\n    longitude:\t".$lons[$choice-1]."\n";
				$update = 1;
			}else{
				$location = "";
			}
		}
		$lines[$insert] .= $location;
		#for($i = 0; $i < (@lines);$i++){
		#	#print "$lines[$i]";
		#}
		
		
	}
	
	if($update){
		open(FILE,">","$datadir$file");
		for($i = 0; $i < (@lines);$i++){
			print FILE "$lines[$i]";
		}
		close(FILE);
	}


}


