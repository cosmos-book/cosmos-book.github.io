

// shim layer with setTimeout fallback
window.requestAnimFrame = (function(){
	return  window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function( callback ){ window.setTimeout(callback, 1000 / 60); };
})();


r(function(){
    var questions = [
        {"question":"What was the first mission to encounter Mercury?",
        "answer":"Mariner 10",
        'comment':'Yes - Mariner 10 completed three flybys of Mercury in the 1970s',
        "page":"missions"},
        {"question":"How many Solar System bodies did the New Horizons spacecraft encounter (not including the Earth)?",
        "answer":"4",
        "page":"missions"},
        {"question":"How many missions have visited Solar System objects and returned to Earth?",
        "answer":"2",
        "page":"missions"},
        {"question":"How many missions are heading out of the Solar System?",
        "answer":"5",
        "page":"missions"},
        {"question":"What was the highest number of objects categorised as planets at any one time?",
        "answer":"16",
        "page":"how-many-planets"},
        {"question":"Which planet has the deepest water ice cloud layer?",
        "answer":"Saturn",
        'page':"atmospheres"},
        {"question":"Which of Saturn's rings are the furthest from the planet?",
        "answer":"Saturn",
        "page":"atmospheres"},
    ]
    for (q in questions){
        var ques=questions[q];
        var qid='q-'+q;
        $('#quiz-holder').append('<div class="questions" id="'+qid+'"></div>');
        $('#'+qid).append('<label><span class="q-lab">'+ques.question+'</span></label><input class="q-inp" id="'+qid+'-inp"><button class="q-button" id="'+qid+'-button">Check</button><span class="q-check"></span>')
    }
    $('#totscore').html(questions.length)
    $('.q-button').each(function(){
        $(this).click(function(){
            var wascorr=$(this).siblings('.q-check').hasClass('correct')
            var qnum=$(this).prop('id').split('-')[1];
            var answer=questions[qnum].answer.toLowerCase().trim();
            var submitted=$(this).siblings('.q-inp')[0].value.toLowerCase().trim();
            console.log(qnum,submitted)
            if (submitted==answer){
                $(this).siblings('.q-check').addClass('correct');
                $(this).siblings('.q-check').removeClass('incorrect');
                if (!wascorr){
                    $('#score').html(parseInt($('#score').html())+1);
                }
            }else{
                $(this).siblings('.q-check').removeClass('correct');
                $(this).siblings('.q-check').addClass('incorrect');
                if (wascorr){
                    $('#score').html(parseInt($('#score').html())-1);
                }
            }
        });
    });
    $('#quiz').append('QUIZ');
    $('.noscript').remove();
})