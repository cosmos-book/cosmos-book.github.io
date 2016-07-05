(function ($) {

	var classes = {
		'Cond':'Explanation',
		'?':'Object of unknown nature',
		'??':'Lost Object of unknown nature',
		'Rad':'Radio-source',
		'mR':'metric Radio-source',
		'cm':'centimetric Radio-source',
		'mm':'millimetric Radio-source',
		'smm':'sub-millimetric source',
		'HI':'HI (21cm) source',
		'rB':'radio Burst',
		'Mas':'Maser',
		'IR':'Infra-Red source',
		'FIR':'Far-IR source (&lambda; >= 30 &micro;m)',
		'NIR':'Near-IR source (&lambda; < 10 &micro;m)',
		'red':'Very red source',
		'ERO':'Extremely Red Object',
		'blu':'Blue object',
		'UV':'UV-emission source',
		'X':'X-ray source',
		'UX?':'Ultra-luminous X-ray candidate',
		'ULX':'Ultra-luminous X-ray source',
		'gam':'gamma-ray source',
		'gB':'gamma-ray Burst',
		'?!?':'Inexistent objects',
		'err':'Not an object (artefact)',
		'grv':'Gravitational Source',
		'Lev':'(Micro)Lensing Event',
		'Le?':'Possible gravitational lens',
		'LI?':'Possible gravitationally lensed image',
		'gLe':'Gravitational Lens',
		'..?':'Candidate objects',
		'SC?':'Possible Supercluster of Galaxies',
		'Cl?':'Possible Cluster of Galaxies',
		'Gr?':'Possible Group of Galaxies',
		'***':'Group of stars',
		'**?':'Interacting Binary Candidate',
		'*-*':'Binary Stars',
		'EB?':'Eclipsing Binary Candidate',
		'CV?':'Cataclysmic Binary Candidate',
		'XB?':'X-ray binary Candidate',
		'LX?':'Low-Mass X-ray binary Candidate',
		'HX?':'High-Mass X-ray binary Candidate',
		'Pec?':'Possible Peculiar Star',
		'Y*?':'Young Stellar Object Candidate',
		'pr?':'Pre-main sequence Star Candidate',
		'TT?':'T Tau star Candidate',
		'C*?':'Possible Carbon Star',
		'S*?':'Possible S Star',
		'OH?':'Possible Star with envelope of OH/IR type',
		'CH?':'Possible Star with envelope of CH type',
		'WR?':'Possible Wolf-Rayet Star',
		'Be?':'Possible Be Star',
		'HB?':'Possible Horizontal Branch Star',
		'RB?':'Possible Red Giant Branch Star',
		'sg?':'Possible Red Supergiant Star',
		'AB?':'Possible Asymptotic Giant Branch Star',
		'pA?':'Post-AGB Star Candidate',
		'BS?':'Candidate blue Straggler Star',
		'WD?':'White Dwarf Candidate',
		'N*?':'Neutron Star Candidate',
		'BH?':'Black Hole Candidate',
		'SN?':'SuperNova Candidate',
		'LM?':'Low-mass star candidate',
		'BD?':'Brown Dwarf Candidate',
		'mul':'Composite object',
		'reg':'Region defined in the sky',
		'vid':'Underdense region of the Universe',
		'SCG':'Supercluster of Galaxies',
		'ClG':'Cluster of Galaxies',
		'GrG':'Group of Galaxies',
		'CGG':'Compact Group of Galaxies',
		'PaG':'Pair of Galaxies',
		'IG':'Interacting Galaxies',
		'Gl?':'Possible Globular Cluster',
		'Cl*':'Cluster of Stars',
		'GlC':'Globular Cluster',
		'OpC':'Open (galactic) Cluster',
		'As*':'Association of Stars',
		'**':'Double or multiple star',
		'EB*':'Eclipsing binary',
		'Al*':'Eclipsing binary of Algol type',
		'bL*':'Eclipsing binary of beta Lyr type',
		'WU*':'Eclipsing binary of W UMa type',
		'EP*':'Star showing eclipses by its planet',
		'SB*':'Spectroscopic binary',
		'CV*':'Cataclysmic Variable Star',
		'DQ*':'Cataclysmic Var. DQ Her type',
		'AM*':'Cataclysmic Var. AM Her type',
		'NL*':'Nova-like Star',
		'No*':'Nova',
		'DN*':'Dwarf Nova',
		'XB*':'X-ray Binary',
		'LXB':'Low Mass X-ray Binary',
		'HXB':'High Mass X-ray Binary',
		'ISM':'Insterstellar matter',
		'PoC':'Part of Cloud',
		'PN?':'Possible Planetary Nebula',
		'CGb':'Cometary Globule',
		'bub':'Bubble',
		'EmO':'Emission Object',
		'Cld':'Cloud of unknown nature',
		'GNe':'Galactic Nebula',
		'BNe':'Bright Nebula',
		'DNe':'Dark Nebula',
		'RNe':'Reflection Nebula',
		'HI':'HI (neutral) region',
		'MoC':'Molecular Cloud',
		'glb':'Globule (low-mass dark cloud)',
		'cor':'Dense core inside a molecular cloud',
		'HVC':'High-velocity Cloud',
		'HII':'HII (ionized) region',
		'PN':'Planetary Nebula',
		'sh':'HI shell',
		'SR?':'SuperNova Remnant Candidate',
		'SNR':'SuperNova Remnant',
		'cir':'CircumStellar matter',
		'of?':'Outflow candidate',
		'out':'Outflow',
		'HH':'Herbig-Haro Object',
		'*':'Star',
		'*iC':'Star in Cluster',
		'*iN':'Star in Nebula',
		'*iA':'Star in Association',
		'*i*':'Star in double system',
		'V*?':'Star suspected of Variability',
		'Pe*':'Peculiar Star',
		'HB*':'Horizontal Branch Star',
		'Y*O':'Young Stellar Object',
		'Em*':'Emission-line Star',
		'Be*':'Be Star',
		'BS*':'Blue Straggler Star',
		'RG*':'Red Giant Branch star',
		'AB*':'Asymptotic Giant Branch Star',
		'C*':'Carbon Star',
		'S*':'S Star',
		'sg*':'Red supergiant star',
		'pA*':'Post-AGB Star',
		'WD*':'White Dwarf',
		'ZZ*':'Pulsating White Dwarf',
		'LM*':'Low-mass star (M<1solMass)',
		'BD*':'Brown Dwarf (M<0.08solMass)',
		'OH*':'Star with envelope of OH/IR type',
		'CH*':'Star with envelope of CH type',
		'pr*':'Pre-main sequence Star (optically detected)',
		'TT*':'T Tau-type Star',
		'WR*':'Wolf-Rayet Star',
		'PM*':'High proper-motion Star',
		'HV*':'High-velocity Star',
		'V*':'Variable Star',
		'Ir*':'Variable Star of irregular type',
		'Or*':'Variable Star of Orion Type',
		'RI*':'Variable Star with rapid variations',
		'Er*':'Eruptive variable Star',
		'Fl*':'Flare Star',
		'FU*':'Variable Star of FU Ori type',
		'RC*':'Variable Star of R CrB type',
		'Ro*':'Rotationally variable Star',
		'a2*':'Variable Star of alpha2 CVn type',
		'El*':'Ellipsoidal variable Star',
		'Psr':'Pulsar',
		'BY*':'Variable of BY Dra type',
		'RS*':'Variable of RS CVn type',
		'Pu*':'Pulsating variable Star',
		'RR*':'Variable Star of RR Lyr type',
		'Ce*':'Cepheid variable Star',
		'dS*':'Variable Star of delta Sct type',
		'RV*':'Variable Star of RV Tau type',
		'WV*':'Variable Star of W Vir type',
		'bC*':'Variable Star of beta Cep type',
		'cC*':'Classical Cepheid (delta Cep type)',
		'gD*':'Variable Star of gamma Dor type',
		'SX*':'Variable Star of SX Phe type (subdwarf)',
		'LP*':'Long-period variable star',
		'Mi*':'Variable Star of Mira Cet type',
		'sr*':'Semi-regular pulsating Star',
		'SN*':'SuperNova',
		'Sy*':'Symbiotic Star',
		'su*':'Sub-stellar object',
		'Pl?':'Extra-solar Planet Candidate',
		'G':'Galaxy',
		'PoG':'Part of a Galaxy',
		'GiC':'Galaxy in Cluster of Galaxies',
		'BiC':'Brightest galaxy in a Cluster (BCG)',
		'GiG':'Galaxy in Group of Galaxies',
		'GiP':'Galaxy in Pair of Galaxies',
		'HzG':'Galaxy with high redshift',
		'ALS':'Absorption Line system',
		'LyA':'Ly alpha Absorption Line system',
		'DLA':'Damped Ly-alpha Absorption Line system',
		'mAL':'metallic Absorption Line system',
		'LLS':'Lyman limit system',
		'BAL':'Broad Absorption Line system',
		'rG':'Radio Galaxy',
		'H2G':'HII Galaxy',
		'LSB':'Low Surface Brightness Galaxy',
		'AG?':'Possible Active Galaxy Nucleus',
		'Q?':'Possible Quasar',
		'Bz?':'Possible Blazar',
		'BL?':'Possible BL Lac',
		'EmG':'Emission-line galaxy',
		'SBG':'Starburst Galaxy',
		'BCG':'Blue compact Galaxy',
		'LeI':'Gravitationally Lensed Image',
		'LeG':'Gravitationally Lensed Image of a Galaxy',
		'LeQ':'Gravitationally Lensed Image of a Quasar',
		'AGN':'Active Galaxy Nucleus',
		'LIN':'LINER-type Active Galaxy Nucleus',
		'SyG':'Seyfert Galaxy',
		'Sy1':'Seyfert 1 Galaxy',
		'Sy2':'Seyfert 2 Galaxy',
		'Bla':'Blazar',
		'BLL':'BL Lac - type object',
		'OVV':'Optically Violently Variable object',
		'QSO':'Quasar',
		'S0':'Lenticular Galaxy',
		'SB':'Barred Galaxy',
		'S..':'Spiral Galaxy',
		'E':'Elliptical Galaxy',
		'SA0':'Ring Galaxy',
		'Irr':'Irregular Galaxy',
		'd':'Dwarf Galaxy'
	}

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
	
				if(col == 0) html += "<tr>";
	
				html += '<td class="'+typ.shape+'"><img src="../'+typ.shape+'.png" class="entry" id="'+i+'" title="'+this.label+(i+1)+'" /></td>'
	
				if(col % this.ncols == this.ncols-1) html += "</tr>";
	
			}
			$('#holder').html('<div class="tableholder"><table>'+html+'</table></div>');
			//$('#holder').after('<textarea>'+html+'</textarea>')
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
				
				var text = '<h3>'+(a.object.indexOf(_obj.label)==0 ? '' : _obj.label)+a.object+'<\/h3><table>';
				text += '<tr><td style="text-align:center;">'+(classes[a.avmtype] ? classes[a.avmtype] : a.avmtype)+'<\/td><\/tr>';
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
