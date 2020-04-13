// shim layer with setTimeout fallback
window.requestAnimFrame = (function(){
	return  window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function( callback ){ window.setTimeout(callback, 1000 / 60); };
})();

function Quiz(opt){

	this.init = function(file){
	
		this.el = S('#quiz-holder');
		
		S().ajax(file,{
			"dataType": "json",
			"this": this,
			"success": function(d,attr){
				this.gotQuestions(d);
			}
		});


		S('form').on('submit',{me:this},function(e){
			e.preventDefault();
			e.stopPropagation();
			e.data.me.submit();
		});
		return this;
	}

	this.gotQuestions = function(questions){
		
		var list,q,i,o,name,id,t;

		this.questions = questions;

		list = '';
		for(i = 0; i < questions.length; i++){

			// Update type
			if(typeof this.questions[i].type==="string"){
				if(this.questions[i].type.indexOf('select')==0) this.questions[i].type = { "value": "select", "n": parseInt(this.questions[i].type.substr(6,)) };
				else this.questions[i].type = { "value": this.questions[i].type, "n": 1 };
			}

			q = questions[i];

			list += '<li id="q-'+q.id+'">';
			list += '<h2>'+q.question+'</h2>';
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
				list += '<label class="q-lab '+q.chapter+'" for="'+id+'">'+q.options[o].value+'</label>';
				list += '</li>'
			}
			list += '</ol>';
			list += '</li>';
		}
		if(list){
			this.el.find('.question-holder').append('<ol class="quiz">'+list+'</ol>');
			for(i = 0; i < this.questions.length; i++){
				this.questions[i].el = this.el.find('#q-'+this.questions[i].id);
				this.questions[i].el.find('.question-holder li.answer input').on('click',{'me':this,'q':i},function(e){
					e.data.me.validate(e.data.q);
				});
			}
		}
		
		// Add a button
		this.el.append('<button id="check" class="button">Submit answer</button>');
		this.button = this.el.find('#check');
		this.button[0].disabled = true;

		// Add a message
		this.el.append('<div class="message"></div>');
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
		if(this.questions[i].hint && this.questions[i].hint.page) this.message.html('<div class="hint">Hint: <a href="../'+this.questions[i].hint.page+'/index.html">'+(this.questions[i].hint.text || 'Explore the infographic')+'</a></div>');
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
		result = '<h2>'+(this.score==this.questions.length ? 'Congratulations!':'On no!')+'</h2>';
		result += '<p>You got <span class="score cosmos">'+this.score+'/'+this.questions.length+'</span></p>';
		result += (this.score==this.questions.length ? 'You have earned the <span class="cosmos">COSMOS</span> badge':'<p>Better luck next time</p>');
		result += '<br /><input type="reset" class="button reset" />';

		// Show the results
		this.message.html(result);
		
		this.el.find('.reset').on('click',{me:this},function(e){ e.data.me.reset(); });

		// Hide the submit button
		this.button.css({'display':'none'});
	
		return this;	
	}

	this.reset = function(){
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