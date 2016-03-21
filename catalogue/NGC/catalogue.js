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
		'ISM':'Interstellar matter',
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



		var url = getDataPath('#data');
		$('.noscript').remove();

		var imgs = $('.tableholder img');
		for(var i = 0; i < imgs.length ; i++){
			// Add ID, title and class
			$(imgs[i]).attr('title','NGC '+(i+1)).attr('id',i+1).addClass('entry');
		}

		$('.loader').remove();

		function Coordinate(alpha,delta){
			alpha = alpha%360.0;
			var ra_h = parseInt(alpha/15);
			var ra_m = parseInt((alpha/15-ra_h)*60);
			var ra_s = ((alpha/15-ra_h-ra_m/60)*3600).toFixed(2);
			var ra = (ra_h+ra_m/60+ra_s/3600);
			if(ra_h < 10) ra_h = "0"+ra_h;
			if(ra_m < 10) ra_m = "0"+ra_m;
			if(ra_s < 10) ra_s = "0"+ra_s;
			var dec_sign = (delta >= 0) ? 1 : -1;
			var dec_d = parseInt(Math.abs(delta));
			var dec_m = parseInt((Math.abs(delta)-dec_d)*60);
			var dec_s = ((Math.abs(delta)-dec_d-dec_m/60)*3600).toFixed(1);
			return {ra:ra,ra_h:ra_h,ra_m:ra_m,ra_s:ra_s,dec:delta,dec_d:dec_d*dec_sign,dec_m:dec_m,dec_s:dec_s};
		}

		// Set up the tooltip
		tooltip({
			'elements':$('.entry'),
			'html':function(){
				var id = parseInt($(this).attr('id'));
				//a = _obj.catalogue[id];
				//var text = '<h3>'+(a.object.indexOf(_obj.label)==0 ? '' : _obj.label)+a.object+'<\/h3><table>';
				//text += '<tr><td style="text-align:center;">'+(classes[a.avmtype] ? classes[a.avmtype] : a.avmtype)+'<\/td><\/tr>';
				//text += '<tr><td><a href="http://aladin.u-strasbg.fr/AladinLite/?target=NGC'+a.object+'&fov=0.5&survey=P%2fDSS2%2fcolor"><img src="thumbnails/'+a.object+'.png" id="thumbnail" style="width:100%;height:auto;" /></a><\/tr>';
				//text += '<\/table>';
				function loadedJSON(d,e){
					var i = parseInt(d.name);
					var radec = Coordinate(d.ra,d.dec);
					var c = ''+radec.ra_h+'h'+radec.ra_m+'m'+radec.ra_s+'s, '+radec.dec_d+'&deg;'+radec.dec_m+'&prime;'+radec.dec_s+'&Prime;'

					var thumb = new Image();
					thumb.onload = function(){ };
					thumb.onerror = function(){
						// Our local copy failed (we haven't got one) so try a Simbad thumbnail
						var img2 = new Image();
						img2.onload = function(){
							// If it loaded, replace our thumbnail
							$('#thumbnail').attr('src',img2.src);
						}
						img2.onerror = function(){
							$('#thumbnail').attr('src','error.png');
						}
						img2.src = 'http://alasky.u-strasbg.fr/cgi/simbad-thumbnails/get-thumbnail.py?name='+d.name+'&size=200';
					}

					var text = '<h3>'+d.name+'<\/h3><table>';
					text += '<tr><td style="text-align:center;">'+(classes[d.avm.desc] ? classes[d.avm.desc] : d.avm.desc)+'<\/td><\/tr>';
					//text += '<tr><td style="text-align:center;">'+c+'<\/td><\/tr>';
					text += '<tr><td><div class="thumb">';
					text += '<a href="http://aladin.u-strasbg.fr/AladinLite/?target='+d.name+'&fov=0.5&survey=P%2fDSS2%2fcolor" class="thumblink">';
					text += '<img src="'+(d.img.thumb ? d.img.thumb : 'thumbnails/'+i+'.png')+'" id="thumbnail" style="width:100%;height:auto;" />';
					text += '</a>';
					text += '<div class="credit">Credit: ';
					if(d.img.credit) text += (d.img.source ? '<a href="'+d.img.source+'">'+(d.img.credit.lastIndexOf(" ") > 0 ? d.img.credit.substr(0,d.img.credit.substr(0,30).lastIndexOf(" ")) : d.img.credit.substr(0,30))+'&#8230;'+'</a>':d.img.credit.substr(0,30));
					else text += 'SIMBAD';
					text += '</div></div><\/tr>';
					text += '<\/table>';
					$('.tooltip_inner').html(text);
					thumb.src = (d.img.thumb ? d.img.thumb : 'thumbnails/'+i+'.png');
				}
				loadJSON('data/NGC'+id+'.json',loadedJSON,{'this':this});
				return "<h3>NGC"+id+"</h3><table><tr><td></td></tr><tr><td><div class=\"thumb\"><a href=\"#\"><img src=\"\" /></a><div class=\"credit\"></div></div></td></tr></table>";
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
