$(document).ready(function(){

	var table;
	var categories = {};
	var toggles = new Toggler({'click':updatePeriodicTable});
	
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

			var td = $('#'+table[i].symbol).parent();
			for(var j = 0; j < table[i].created.length; j++){
				var tmp = table[i].created[j].toLowerCase().replace(' ','_');
				if(tmp){
					if(!categories[tmp]) categories[tmp] = {'name':table[i].created[j]};
					table[i].created[j] = tmp;
				}
			}
		}
		
		// Add toggles for each category
		$('table.periodic').before('<ul class="key"><li class="keyitem"><span class="keylabel">Formed in:</span></li></ul>');
		for(c in categories){
			$('.key').append('<li class="keyitem" id="'+c+'"><div class="keylabel control">'+categories[c].name+'</div></li>');
			toggles.create($('#'+c),c,{
				"off": {"label":"off","checked": true }, 
				"on": { "label":"on" }
			});
		}
		$('.key').prepend('<ul class="key"><li class="keyitem"><span class="keylabel">Key:</span></li><li class="keyitem"><div class="keysymbol life"><img src="eg.png" style="width:100%;height:100%;" alt="e.g." title="Example element that is essential to life" /></div><div class="keylabel">Essential to life</div></li></ul><br />');
	//	$('.key').append('<li class="keyitem"><div class="keysymbol formed"></div><div class="keylabel">Formed</div><form><div class="toggleinput toggler"></div></form></li>');
		$(document).on('click','.keylabel',function(){ toggles.toggle($(this).parent().attr('id')) });


		// Switch the Big Bang on
		toggles.change('big_bang','on');
		
	}

	$('.noscript').remove();

	// Load the files
	loadCSV('data/element_origin.csv',parseFile,{});

	function updatePeriodicTable(){
		var td,ok,i,j,c;
		for(c in categories) categories[c].val = toggles.val(c);

		for(i = 0; i < table.length; i++){
			if(!table[i].td) table[i].td = $('#'+table[i].symbol).parent();
			ok = false;
			for(j = 0; j < table[i].created.length; j++){
				if(table[i].created[j] && categories[table[i].created[j]].val=="on"){
					ok = true;
					break;
				}
			}
			if(ok) table[i].td.addClass('formed');
			else table[i].td.removeClass('formed')
		}
	}
})