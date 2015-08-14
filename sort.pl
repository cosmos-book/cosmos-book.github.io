#!/usr/bin/perl
#################################
# Stuart's CSV sorting script
# Sort and manipulate a csv file
#################################


use Text::ParseWords;

#################################
# Process command line arguments
#################################
for($i = 0; $i < (@ARGV) ; $i++){
	if($ARGV[$i] =~ /^\-+(.*)/){
		$flag = $1;
		if($flag eq "f" || $flag eq "file"){ $file = $ARGV[$i+1]; }
		if($flag eq "o" || $flag eq "order"){ $order = $ARGV[$i+1]; }
		if($flag eq "c" || $flag eq "cols" || $flag eq "columns"){ $show = $ARGV[$i+1]; }
		if($flag eq "s" || $flag eq "sort" || $flag eq "sortby"){ $column = $ARGV[$i+1]; }
		if($flag eq "m" || $flag eq "match"){ $match = $ARGV[$i+1]; }
		if($flag eq "z" || $flag eq "zap"){ $zap = $ARGV[$i+1]; }
		if($flag eq "n"){ $n = $ARGV[$i+1]; }
		$i++;
	}else{
		if(!$file){
			$file = $ARGV[$i];
		}
	}
}


if($ARGV[0] eq "--help" || $ARGV[0] eq "-h" || !-e $file || !$file){
	print <<END

Stuart's csv sorting script
===========================

Takes a comma or tab delimited file and re-orders the rows by a specified 
column (default=1). The input options are:

    -s = the column number to sort by
    -o = the sort order (reverse)
    -c = the columns to display (comma separated)
    -n = the number of results to display
    -z = zap rows where the sorting field is blank
    -f = the filename
    -m = match rows containing this string

The results are sent to the command line so use you can pipe it into a
file if you wish.

Examples
--------
1. Sort the radio telescopes by size and only show the name, size, lon/lat:
    perl sort.pl -sort 3 -cols 1,3,14,15 TEL/telescopes_radio.csv
2. Sort rovers by distance and only show the top 5:
    perl sort.pl -sort 8 -n 5 EXP/EXP01/rovers.csv
3. Sort rovers by distance with longest first and only show cols 1, 3 & 8:
    perl sort.pl -sort 8 -order reverse -cols 1,3,8 EXP/EXP01/rovers.csv
4. Sort radio interferometers by size and only show the name, size, lon/lat:
    perl sort.pl -sortby 1 -cols 1,3,14,15 -match Interf TEL/telescopes.csv

END
}


############################
# Sanity-check the inputs
############################
# Set a default order if poorly defined
if($order && $order ne "reverse"){
	$order = "reverse";
}
if(!$column){ $column = 1; }
if($n < 0){ $n = 0; }


# Zero-indexed
$column--;

#########################
# Process the data file
#########################
open(FILE,$file);
@lines = <FILE>;
close(FILE);

$header = $lines[0];
$header =~ s/[\n\r]//g;

$delim = ($header =~ /\t/) ? "\t" : ',';

$ncols = 0;

for($l = 1; $l < (@lines); $l++){
	$lines[$l] =~ s/[\n\r]//g;

	my $row;
	# Split by delimiters
	if($lines[$l] =~ /[^\s\t\n\r]/ && $lines[$l]){
		if(!$match || ($match && $lines[$l] =~ /$match/)){
			@$row = parse_line($delim, 0, $lines[$l]);
			$ncols = @$row;
			if(!$zap || ($zap && @$row[$zap-1])){
				push(@$data, $row);
			}
		}
	}
}

if($show){
	@showcols = split(/,/,$show);
}else{
	@showcols = "";
	for($r = 0; $r < $ncols; $r++){
		push(@showcols,$r+1);
	}
}


if(!$n){ $n = @lines; }

# Process the header
print parseRow(parse_line($delim, 0, $header));

# Process each data row
$counter = 0;
foreach $line (orderit(@$data)) {
	if($counter >= $n){ last; }
	print parseRow(@$line);
	$counter++;
}


# Order the rows
sub orderit {
	my @in = @_;
	my @sorted = ($in[0][$column] =~ /[a-zA-Z]/) ? (sort { lc($a->[$column]) cmp lc($b->[$column]) } @in) : (sort { $a->[$column] <=> $b->[$column] } @in);
	if($order eq "reverse"){ @sorted = reverse(@sorted); }
	return @sorted;
}

# Parse the row
sub parseRow {
	my $c,$r,$r2,$shown;
	my $out = "";
	my @row = @_;

	if($delim eq ","){
		# Need to escape the text fields containing commas
		for($r = 0; $r <(@row) ; $r++){
			if($row[$r] =~ /[\,]/){
				$row[$r] = "\"".$row[$r]."\"";
			}
		}
	}
	$shown = 0;

	for($c = 0 ; $c < @showcols ; $c++){
		if($c > 0){ $out .= $delim; }
		$out .= $row[$showcols[$c]-1];
	}
	if($out !~ /[^$delim]/){
		$out = "";
	}else{
		$out .= "\n";
	}
	
	return $out;	
}