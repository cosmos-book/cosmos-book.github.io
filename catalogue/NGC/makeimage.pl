#!/usr/bin/perl

$id = $ARGV[0];
$id += 0;

if($id < 0 || $id > 7839){ exit; } 

open(JSON,"data/NGC".$id.".json");
@jsonlines = <JSON>;
close(JSON);


foreach $line (@jsonlines){
	if($line =~ /"thumb" ?: ?"([^\"]*)"/){ $thumb = $1; }
	if($line =~ /"source" ?: ?"([^\"]*)"/){ $source = $1; }
	if($line =~ /"credit" ?: ?"([^\"]*)"/){ $credit = $1; }
}

$imgfile = "thumbnails/NGC".$id.".jpg";
$srchtml = "sources/NGC".$id.".html";
print "$srchtml\n";

if(!-e $srchtml){

	print "Enter source URL: ";
	$srcurl = <STDIN>;
	$srcurl =~ s/[\n\r]//g;

	if($srcurl){
		print "\tDownloading $srcurl\n";
		@flines = `wget -q -O $srchtml "$srcurl"`;
	}

	if(!$source){ $source = $srcurl; }

}

open(FILE,$srchtml);
@flines = <FILE>;
close(FILE);

$html = "";
foreach $line (@flines){
	$line =~ s/[\n\r]//g;
	$html .= $line;
}
if(!$credit){
	if($html =~ /<p class="credit">(.*)<\/p>/){
		$credit = $1;
		$credit =~ s/<[^\>]*>//g;
	}
}
$credit =~ s/^Credit[^\:]*: //g;

if(!$thumb || !-e $thumb || !-e $imgfile){

	if($html =~ /id="embed_text" value="<img src='([^\']*)'/){
		$imgurl = $1;
		print "\tDownloading image: $imgurl\n";
		$imgfile = "thumbnails/NGC".$id.".jpg";
		@flines = `wget -q -O $imgfile "$imgurl"`;
	}else{
		print "\tCan't find image\n";
	}
}

if(-e $imgfile){
	print "Got $imgfile\n";
	$dim = `convert -identify -format \%wx\%h $imgfile info:`;
	if($dim !~ /256x256/){
		print "$dim\n";
		`convert $imgfile -define jpeg:size=256x256  -thumbnail 256x256^ -gravity center -extent 256x256 $imgfile`
	}
	if(!$thumb){ $thumb = $imgfile; }
}

if(!$credit){ $credit = "HST/ESA/NASA"; }

for($i = 0; $i <@jsonlines; $i++){
	$jsonlines[$i] =~ s/"thumb": ?""/"thumb": "$thumb"/;
	$jsonlines[$i] =~ s/"source": ?""/"source": "$source"/;
	$jsonlines[$i] =~ s/"credit": ?""/"credit": "$credit"/;
}
# Write out JSON file
open(JSON,">","data/NGC".$id.".json");
print JSON @jsonlines;
close(JSON);

print "$credit\n";