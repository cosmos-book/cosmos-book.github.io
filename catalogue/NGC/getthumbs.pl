#!/usr/bin/perl

open(FILE,'data/NGC.csv');
@lines = <FILE>;
close(FILE);

for($i = 1; $i < @lines;$i++){
	$lines[$i] =~ s/[\n\r]//g;
	
	($o,$ra,$dec,$avm,$avmdesc,$s) = split(/,/,$lines[$i]);
	$name = $o;
	$name =~ s/ /\+/g;
	
	open(JSON,"data/NGC".$i.".json");
	@jsonlines = <JSON>;
	close(JSON);
	$ra = "";
	$dec = "";
	$thumb = "";
	$credit = "";
	$source = "";

	foreach $jline (@jsonlines){
		if($jline =~ /"thumb" ?: ?"([^\"]+)"/){ $thumb = $1; }
		if($jline =~ /"source" ?: ?"([^\"]+)"/){ $source = $1; }
		if($jline =~ /"credit" ?: ?"([^\"]+)"/){ $credit = $1; }
		if($jline =~ /"ra" ?: ?([^\,]+)/){ $ra = $1; }
		if($jline =~ /"dec" ?: ?([^\,]+)/){ $dec = $1; }
	}
	
	if(!$thumb){
		$url = "http://server1.sky-map.org/imgcut\?survey=DSS2\&w=256\&h=256\&ra=".($ra/15)."\&de=".$dec."\&angle=0.15\&output=PNG";
		#$url = "http://alasky.u-strasbg.fr/cgi/simbad-thumbnails/get-thumbnail.py?name=".$name."\&size=200";
		$file = $o;
		$file =~ s/NGC ([0-9]+)$/NGC$1.png/g;
		$file = 'thumbnails/'.$file;
		print "$o $file\n";
		if(!-e $file || (-e $file && -s $file == 0)){
			print "\t$url $file\n";
			@flines = `wget -q -O $file "$url"`;
		}
	}

	if(!$credit || !$thumb){
		if(!$thumb){ $thumb = $file; }
		if(!$credit){ $credit = "DSS2/Wikisky"; }
		if(!$source){ $source = "http://server1.wikisky.org/v2?ra=$ra\&de=$dec\&zoom=6\&img_source=DSS2"; }
		for($j = 0; $j <@jsonlines; $j++){
			$jsonlines[$j] =~ s/"thumb": ?""/"thumb": "$thumb"/;
			$jsonlines[$j] =~ s/"source": ?""/"source": "$source"/;
			$jsonlines[$j] =~ s/"credit": ?""/"credit": "$credit"/;
		}
		# Write out JSON file
		open(JSON,">","data/NGC".$i.".json");
		print JSON @jsonlines;
		close(JSON);
	}
	
	$imgfile = $thumb;
	if($thumb =~ s/NGC$i.png/NGC$i.jpg/){
		if(!-e $thumb){
			`convert $imgfile -quality 80 $thumb`;
		}
	}
	$dim = `convert -identify -format \%wx\%h $thumb info:`;
	if($dim =~ /256x256/){
		print "Shrinking $thumb\n";
		`convert $thumb -resize 225x225 $thumb`;
	}
	for($j = 0; $j <@jsonlines; $j++){
		$jsonlines[$j] =~ s/"thumb": ?"[^\"]*"/"thumb": "$thumb"/;
		$jsonlines[$j] =~ s/"source": ?""/"source": "$source"/;
		$jsonlines[$j] =~ s/"credit": ?""/"credit": "$credit"/;
	}
	# Write out JSON file
	open(JSON,">","data/NGC".$i.".json");
	print JSON @jsonlines;
	close(JSON);

}



