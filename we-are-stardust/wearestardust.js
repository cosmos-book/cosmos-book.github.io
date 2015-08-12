$(document).ready(function(){

	var table;
	
	function parseFile(d,attrs){
		//He,Helium,Non-metal,18,1,Big Bang; Stars; Massive stars; Supernovae,
		table = CSV2JSON(d,[
			{'name':'symbol','format':'string'},
			{'name':'element','format':'string'},
			{'name':'type','format':'string'},
			{'name':'col','format':'number'},
			{'name':'row','format':'number'},
			{'name':'created','format':'string'},
			{'name':'humanrole','format':'string'}
		]);
		
		for(var i = 0; i < table.length; i++){
			if(!table[i].created) table[i].created = "";
			table[i].created = table[i].created.split(";");
		}
		
	}

	$('.noscript').remove();

	// Load the files
	loadCSV('data/element_origin.csv',parseFile,{});




})