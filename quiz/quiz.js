// shim layer with setTimeout fallback
window.requestAnimFrame = (function(){
	return  window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function( callback ){ window.setTimeout(callback, 1000 / 60); };
})();

function Quiz(opt){

	this.init = function(file){
	
		this.el = S('#quiz-holder');
		this.level = {'title':'?','badge':'badge.svg'};
		this.getBadge();

		S('ol.levels button').on('click',{me:this},function(e){

			S().ajax(e.currentTarget.getAttribute('data'),{
				"dataType": "json",
				"this": e.data.me,
				"title": e.currentTarget.innerHTML,
				"success": function(d,attr){
					this.gotQuestions(d,attr);
				}
			});
			
		});

		this.el.find('form').on('submit',{me:this},function(e){
			e.preventDefault();
			e.stopPropagation();
			e.data.me.submit();
		});
		return this;
	}
	
	this.getBadge = function(){

		if(this.level.badge.indexOf("<?xml")!=0){
			S().ajax(this.level.badge,{
				"dataType": "text",
				"this": this,
				"success": function(d,attr){
					this.level.svg = d.replace(/^<\?xml[^\>]*>[\n\r]*/,"");
				}
			});
		}
		return this;
	}

	this.gotQuestions = function(questions,attr){
		
		var list,q,i,o,name,id,t,v;

		this.level.title = attr.title;

		this.el.find('.level-holder').css({'display':'none'});
		this.el.find('.question-holder').css({'display':''});

		this.score = 0;
		this.questions = questions;

		list = '';
		for(i = 0; i < questions.length; i++){

			// Update type
			if(typeof this.questions[i].type==="string"){
				if(this.questions[i].type.indexOf('select')==0){
					v = this.questions[i].type.substr(6,);
					this.questions[i].type = { "value": "select" };
					if(v=="All"){
						v = 0;
						for(o = 0; o < this.questions[i].options.length; o++){
							if(this.questions[i].options[o].correct) v++;
						}
					}else{
						v = parseInt(v);
					}
					this.questions[i].type.n = v;
				}else this.questions[i].type = { "value": this.questions[i].type, "n": 1 };
			}

			q = questions[i];

			list += '<li id="q-'+q.id+'">';
			list += '<h2>Question '+(i+1)+': '+q.question+'</h2>';
			list += '<ol class="answers">'
			for(o = 0; o < q.options.length; o++){
				list += '<li class="answer">'
				name = 'input-'+q.id;
				id = name;
				if(q.type.n==1){
					t = 'radio';
					id += '-'+o;
				}else{
					t = 'checkbox';
				}
				list += '<input class="q-inp" name="'+name+'" id="'+id+'" type="'+t+'" value="'+o+'" data-question="'+i+'" />'
				list += '<label class="q-lab" for="'+id+'">'+q.options[o].value+'</label>';
				list += '</li>'
			}
			list += '</ol>';
			list += '</li>';
		}

		if(list){
			// Update DOM
			if(this.el.find('.question-holder .quiz').length==0) this.el.find('.question-holder').append('<ol class="quiz"></ol>');
			this.el.find('.question-holder .quiz').html(list);
			for(i = 0; i < this.questions.length; i++){
				this.questions[i].el = this.el.find('#q-'+this.questions[i].id);
				// Add click events
				this.questions[i].el.find('.question-holder li.answer input').on('click',{'me':this,'q':i},function(e){
					e.data.me.validate(e.data.q);
				});
			}
		}
		
		// Add a button
		if(this.el.find('#check').length==0){
			this.el.find('form').append('<button id="check" class="button">Submit answer</button>');
			this.button = this.el.find('#check');
			this.button[0].disabled = true;
		}

		// Add a message
		if(this.el.find('form .message').length==0) this.el.find('form').append('<div class="message"></div>');
		this.message = this.el.find('.message');
		
		S('#totscore').html(questions.length);

		this.showQuestion(0);

		return this;
	}
	
	S('.noscript').remove();

	this.showQuestion = function(i){

		var el,j;
		
		// Show the submit button
		this.button.css({'display':''});
		
		// Remove any previous correct/wrong state
		this.el.removeClass('correct').removeClass('wrong');

		// Set the question number if it hasn't been defined
		if(typeof i==="undefined") i = 0;

		// Show or hide the questions
		for(q = 0; q < this.questions.length; q++){
			el = S('#q-'+this.questions[q].id);
			el.css({'display':(q==i ? '':'none')});
			if(q==i){
				S('#content')[0].setAttribute('class',this.questions[i].chapter);
			}
		}


		this.button[0].disabled = true;

		// Perhaps we need to finish
		if(i >= this.questions.length) return this.finish();		

		// Enable the options
		inp = this.questions[i].el.find('.answers input');
		if(inp.length > 0){
			for(j = 0; j < inp.length; j++) inp[j].disabled = false;
		}
		
		this.question = i;
		if(this.questions[i].hint && this.questions[i].hint.page) this.message.html('<div class="hint">Hint: <a href="../'+this.questions[i].hint.page+'/index.html" target="_infographic">'+(this.questions[i].hint.text || 'Explore the infographic')+'</a></div>');
		return this;
	}
	
	this.validate = function(q){

		var inp,n,i;
		inp = this.questions[q].el.find('.answers input');
		n = 0;
		for(i = 0; i < inp.length; i++){
			if(inp[i].selected || inp[i].checked) n++;
		}
		this.button[0].disabled = !(n==this.questions[q].type.n);

		return this;
	}

	this.submit = function(){

		var inp,n,i,o,correct,id;
		inp = this.questions[this.question].el.find('.answers input');
		n = 0;
		for(i = 0; i < inp.length; i++){
			checked = (inp[i].selected || inp[i].checked);
			o = parseInt(inp[i].value);
			if(checked && this.questions[this.question].options[o].correct) n++;
			inp[i].disabled = true;
		}
		correct = (n==this.questions[this.question].type.n);
		
		this.questions[this.question].result = correct;

		// Hide the submit button
		this.button.css({'display':'none'});

		// Set the class of the whole quiz and of the specific question
		this.el.addClass(correct ? 'correct' : 'wrong');
		//this.questions[this.question].el.addClass(correct ? 'correct' : 'wrong');

		// Show the response
		if(correct){
			this.message.html('<div class="response">'+(this.questions[this.question].success||"Yes")+'</div>');
		}else{
			this.message.html('<div class="response">'+(this.questions[this.question].wrong||"Wrong")+'</div>');
		}

		nq = this.question+1;

		id = (nq < this.questions.length) ? 'q-'+this.questions[nq].id : '';
		this.message.append('<br /><a href="#'+id+'" id="next" class="button">'+(nq < this.questions.length ? 'Next question':'Finish')+'</a>');
		this.message.find('#next').on('click',{me:this,'q':this.question+1},function(e){
			e.data.me.showQuestion(e.data.q);
		});
		
		this.updateScore();

		return this;
	}
	
	this.getScore = function(){
		// Update the score display
		var correct = 0;
		for(var i = 0; i < this.questions.length;i++){
			if(this.questions[i].result) correct++;
		}
		this.score = correct;
		return this;
	}
	
	this.updateScore = function(){
		this.getScore();
		S('.score').html(this.score+'/'+this.questions.length);
		return this;
	}
	
	this.finish = function(){
		this.getScore();

		// Build the results
		result = '<h2>'+(this.score==this.questions.length ? 'Congratulations!':'Oh no!')+'</h2>';
		result += '<p>You got <span class="score cosmos">'+this.score+'/'+this.questions.length+'</span></p>';
		result += (this.score==this.questions.length ? '<p>You have earned the <span class="cosmos">COSMOS</span> badge</p><br />'+this.level.svg.replace(/\>Quiz\</g,">"+this.level.title+" Quiz: 100%<"):'<p>Better luck next time</p>');
		result += '<br /><input type="reset" class="button reset" />';

		// Show the results
		this.message.html(result);
		
		this.el.find('.reset').on('click',{me:this},function(e){ e.data.me.reset(); });
		
		S('#content')[0].setAttribute('class','');

		// Hide the submit button
		this.button.css({'display':'none'});
	
		return this;	
	}

	this.reset = function(){
		this.el.find('.level-holder').css({'display':''});
		this.el.find('.question-holder').css({'display':'none'});

		for(var i = 0; i < this.questions.length;i++){
			delete this.questions[i].result;
		}
		this.score = 0;
		this.message.html('');
		this.showQuestion(0);
	}	

	return this;
}


r(function(){

	var quiz = new Quiz({});
	quiz.init("questions.json");

})