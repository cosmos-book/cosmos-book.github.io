#!/usr/bin/perl

open(FILE,'data/NGC.csv');
@lines = <FILE>;
close(FILE);

for($i = 1; $i < @lines;$i++){
	$lines[$i] =~ s/[\n\r]//g;
	
	($o,$ra,$dec,$avmcodes,$avmdesc,$s) = split(/,/,$lines[$i]);

	(@avm) = split(/;/,$avmcodes);
	
	$avmcode = "";
	for($j = 0; $j < @avm; $j++){
		if($avmcode){ $avmcode .= ","; }
		$avmcode .= "\"$avm[$j]\"";
	}
	$avmcode = "[$avmcode]";


	$file = "data/".$o.".json";
	$file =~ s/ //g;

	print "$file\n";

	open(FILE,$file);
	@flines = <FILE>;
	close(FILE);
	$img = "{\"thumb\":\"\", \"source\":\"\", \"credit\":\"\" }";
	for($j = 0; $j < @flines; $j++){
		if($flines[$j] =~ /\"img\" ?: ?(\{[^\}]*\})/){
			$img = $1;
		}
	}
	
	$json = "{\n\t\"name\": \"$o\",\n\t\"ra\": $ra,\n\t\"dec\": $dec,\n\t\"avm\": { \"desc\": \"$avmdesc\", \"codes\":$avmcode },\n\t\"ref\": \"$s\",\n\t\"img\": $img\n}";

	open(FILE,">",$file);
	print FILE $json;
	close(FILE);
}
