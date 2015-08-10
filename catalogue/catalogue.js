(function ($) {

	function Catalogue(init){

		if(!init) init = {};
		
			// Configure
		this.padd = {'top':0,'bottom':0,'left':0,'right':1};
		this.el = $('#holder');
		this.ncols = (typeof init.cols==="number") ? init.cols : 10;
		this.url = getDataPath('#data');
		this.label = (typeof init.label==="string") ? init.label : "";

		$('.noscript').remove();
	
		// Load the files
		loadCSV(this.url,this.parseFile,{'this':this});
	
	}

	Catalogue.prototype.parseFile = function parseFile(d,attrs){
		this.catalogue = CSV2JSON(d,[
			{'name':'object','format':'string'},
			{'name':'ra','format':'number'},
			{'name':'dec','format':'number'},
			{'name':'avmcode','format':'string'},
			{'name':'avmtype','format':'string'},
			{'name':'source','format':'string'}
		]);
		this.draw();
	}
	
	function goTo(t){
		location.href = 'http://ned.ipac.caltech.edu/cgi-bin/nph-objsearch?objname='+t+'&extend=no'
	}
	
	// Draw the result
	Catalogue.prototype.draw = function(){
	
		// Calculate values
		var w = this.el.width()-1;
		var i,v,x,y;
		var space = 0.2;
		var padd = 3;
		var dx = (w/(this.ncols + (this.ncols-1)*space + 3));
		if(dx > 32) dx = 32;
		var dy = dx;
		this.padd.left = dx*padd;
		
		w = ((this.ncols-1)*dx*space) + (this.ncols*dx) + (padd*dx) + this.padd.left + this.padd.right;
		if(w > this.el.width()-1) w = this.el.width();
		var h = (Math.ceil(this.catalogue.length/this.ncols))*(dy+space*dx) + this.padd.top + this.padd.bottom;
		var mid = {'x': w/2,'y':h/2};
		var yoff;
		collen = Math.ceil(this.catalogue.length/this.ncols);

		var s = dx/2;
		var xoff = this.padd.left;
		var yoff = this.padd.top;
		space = dx*space;

		var cat = this.catalogue;
		var row,col;
		var collen = Math.ceil(cat.length/this.ncols);

		if($('#holder table').length==0){
			var html = "";
			var typ;
			var n = cat.length;
			for(var i = 0; i < n; i++){
			
				row = Math.floor(i/this.ncols);
				col = i % this.ncols;
	
				x = xoff + col*(s*2+space);
				y = yoff + row*(s*2+space);
				
				typ = getType(cat[i].avmcode);
				console.log(typ)
	
				if(col == 0) html += "<tr>";
	
				html += '<td class="'+typ.shape+'"><img src="../'+typ.shape+'.png" class="entry" id="'+i+'" title="'+this.label+(i+1)+'" /></td>'
	
				if(col % this.ncols == this.ncols-1) html += "</tr>";
	
			}
			$('#holder').html('<div class="tableholder"><table>'+html+'</table></div>');
		}
		$('.loader').remove();

		// Draw key
		$('#holder').prepend('<ul class="key" id="key"></ul>');
		// Extract the appropriate keys
		for(var i = 0; i < key.length; i++){
			if(key[i].code[0].indexOf('7.2')<0){
				// Append divs to hold key item
				$('#key').append('<li class="keyitem"><span id="'+key[i].code[0]+'" class="keysymbol"><img src="../'+key[i].shape+'.png" alt="'+key[i].label+'" title="'+key[i].label+'" /></span><span class="keylabel">'+key[i].label+'</span></li>');
			}
		}


		var _obj = this;

		// Set up the tooltip
		tooltip({
			'elements':$('.entry'),
			'html':function(){
				var id = parseInt($(this).attr('id'));
				
				a = _obj.catalogue[id];
				
				var text = '<h3>'+a.object+'<\/h3><table>';
				text += '<tr><td style="text-align:center;">'+a.avmtype+'<\/td><\/tr>';
				//text += '<tr><td>RA:<\/td><td>'+a.ra.toFixed(5)+'<\/td><\/tr>';
				//text += '<tr><td>Declination:<\/td><td>'+a.dec.toFixed(5)+'<\/td><\/tr>';
				text += '<tr><td><img src="http://server7.sky-map.org/imgcut?survey=DSS2&w=256&h=256&ra='+(a.ra/15)+'&de='+a.dec+'&angle=1.25&output=PNG" style="width:100%;height:auto;" /><\/tr>';
				text += '<\/table>';
				return text;
			}
		});


	}


	$.catalogue = function(placeholder,input) {
		if(typeof input==="object") input.container = placeholder;
		else {
			if(typeof placeholder==="string") input = { container: placeholder };
			else input = placeholder;
		}
		input.plugins = $.catalogue.plugins;
		return new Catalogue(input);
	};
	
	$.catalogue.plugins = [];

})(jQuery);
