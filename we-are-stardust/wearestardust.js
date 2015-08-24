$(document).ready(function(){

	var table;
	var categories = {};
	var toggles = new Toggler();
	
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
		$('table.periodic').before('<ul class="key"></ul>');
		for(c in categories){
			$('.key').append('<li class="keyitem" id="'+c+'"><div class="keylabel">'+categories[c].name+'</div></li>');
			toggles.addTo($('#'+c),c,{
				"off": {"label":"off","checked": true }, 
				"on": { "label":"on" }
			});
		}
		$('.key').append('<li class="keyitem"><div class="keysymbol life"></div><div class="keylabel">Essential to life</div><form><div class="toggleinput toggler"></div></form></li>');
		$('.key').append('<li class="keyitem"><div class="keysymbol formed"></div><div class="keylabel">Formed</div><form><div class="toggleinput toggler"></div></form></li>');
		$(document).on('click','.keylabel',function(){ toggles.toggle($(this).parent().attr('id')) });


		// Switch the Big Bang on
		toggles.change('big_bang','on');
		
	}

	$('.noscript').remove();

	// Load the files
	loadCSV('data/element_origin.csv',parseFile,{});


	function Toggler(toggles){
		this.toggles = (toggles ? toggles : {});

		return this;
	}
	
	Toggler.prototype.val = function(id){
		return $('input[name='+id+']:checked').val();
	}

	// Build a toggle button
	// Inputs
	//   el       = jQuery element to add this to (it should have a length==1)
	//   id       = The unique ID to use
	//   toggle.a = { "value": "a", "id": "uniqueid_a", "checked": true, "label": "Left label" }
	//   toggle.b = { "value": "b", "id": "uniqueid_b", "checked": false, "label": "Right label" }
	Toggler.prototype.addTo = function(el,id,toggles){

		if(!el || el.length !=1 || typeof el.append!=="function") return this;
		if(!toggles || !toggles['on'] || !toggles['off']) return this;
		if((typeof id!=="string") && (typeof toggles[0]!=="object") && (typeof toggles[1]!=="object")) return this;
		// Remove any existing version of this toggle
		el.find('toggler').remove();

		if(!toggles['off'].id) toggles['off'].id = id+'_off';
		if(!toggles['on'].id) toggles['on'].id = id+'_on';

		this.toggles[id] = { 'html':'', 'states':{}};
		this.toggles[id].states = toggles;

		var lc = '<label class="toggle-label';
		var html = "";
		html = '<form><div class="toggleinput toggler'+(toggles['off'].checked ? '' : ' checked')+'">'+lc+'1" for="'+toggles['off'].id+'">'+(toggles['off'].label ? toggles['off'].label : '')+'</label>';
		html += '<div class="toggle-bg">';
		html += '	<input id="'+toggles['off'].id+'" type="radio" '+(toggles['off'].checked ? 'checked="checked" ' : '')+'name="'+id+'" value="off">';
		html += '	<input id="'+toggles['on'].id+'" type="radio" '+(toggles['on'].checked ? 'checked="checked" ' : '')+'name="'+id+'" value="on">';
		html += '	<span class="switch"></span>';
		html += '</div>';
		html += ''+lc+'2" for="'+toggles['on'].id+'">'+(toggles['on'].label ? toggles['on'].label : '')+'</label></div></form>';

		this.toggles[id].html = html;

		el.append(html);

		el.on('click','.toggler',{id:id,me:this},function(e){
			var input = $(this).find('input:checked');
			if(input.attr('value')=="on"){
				$(this).addClass('checked');
				e.data.me.toggles[e.data.id].states['on'].checked = true;
				e.data.me.toggles[e.data.id].states['off'].checked = false;
			}else{
				$(this).removeClass('checked');
				e.data.me.toggles[e.data.id].states['on'].checked = false;
				e.data.me.toggles[e.data.id].states['off'].checked = true;
			}
			updatePeriodicTable();
		});

		return this;
	}

	Toggler.prototype.toggle = function(id){
		var t = this.toggles[id];
		if(!t) return this;
		if(t.states['off'].checked) $('#'+t.states['on'].id).trigger('click').closest('.toggler').trigger('click');
		else $('#'+t.states['off'].id).trigger('click').closest('.toggler').trigger('click');
		return this;
	}

	Toggler.prototype.change = function(id,v){
		var t = this.toggles[id];
		if(!t) return this;
		if(v=='on' && $('#'+t.states['on'].id).length>0) $('#'+t.states['on'].id).trigger('click').closest('.toggler').trigger('click');
		if(v=='off' && $('#'+t.states['off'].id).length>0) $('#'+t.states['off'].id).trigger('click').closest('.toggler').trigger('click');
		return this;
	}


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