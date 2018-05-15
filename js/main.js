let config = {
  apiKey: "AIzaSyC07NEscjfwml23RSkt5pmOPPi3A2Zft_s",
  authDomain: "dk-eliminator.firebaseapp.com",
  databaseURL: "https://dk-eliminator.firebaseio.com",
  projectId: "dk-eliminator",
  storageBucket: "",
  messagingSenderId: "811315800835"
};

firebase.initializeApp(config);

let database = firebase.database();

$(document).ready(function() {
    const winnersArray = [];
    const weekArray = []
    let gamesPerWeek = 0;
    let response;
    let gameentry;

    const fillBoxes = () => {
        const weekObject = {};
        //separate JSON into objects per week
        for(let k=0; k<gameentry.length; k++){
            const week = gameentry[k].week;
            if (weekObject[week]) {
                weekObject[week].push(gameentry[k])
            } else {
                weekObject[week] = [gameentry[k]]
            }
        }

        //set current week
        const currentWeek = "1";
        const currentWeekObject = weekObject[currentWeek];
        $(".masthead h3 span").html(currentWeek);

        //get amount of games per week
        for(let j=0; j<currentWeekObject.length; j++){
            gamesPerWeek++;
        }

        //make tie breaker be the game in the middle of the list
        let tiebreakerNumber = (gamesPerWeek / 2).toFixed(0);

        //write matchups on page
        for(let i=0; i<gamesPerWeek; i++){
            
            //format Date
            const date = currentWeekObject[i].date.replace(/-/g,'/');

            $('.matchups').append(
                '<div class="matchup">'
                    + '<div class="answer">'
                    + '<div><input type="radio" value="'+currentWeekObject[i].awayTeam.Abbreviation+'" id="question'+[i]+'-option1"><label for="question'+[i]+'-option1"><img src="images/'+currentWeekObject[i].awayTeam.Name+'.png" /><span>'+currentWeekObject[i].awayTeam.Name+'</span><div></div></label></div>'
                    + '<div><input type="radio" value="'+currentWeekObject[i].homeTeam.Abbreviation+'" id="question'+[i]+'-option2"><label for="question'+[i]+'-option2"><img src="images/'+currentWeekObject[i].homeTeam.Name+'.png" /><span>'+currentWeekObject[i].homeTeam.Name+'</span><div></div></label></div>'
                    + '</div>'
                    + '<div class="date-time">'+new Date(date).toDateString()+' &nbsp; <br /> '+currentWeekObject[i].time+' EST</div>'
                +'</div>'
            );
        }

        $('.tiebreaker .answer').append(
            '<div><label><span>'+currentWeekObject[tiebreakerNumber].awayTeam.Name+'</span><input type="text" class="tiebreaker-input-1"></label></div>'
          + '<div><label><span>'+currentWeekObject[tiebreakerNumber].homeTeam.Name+'</span><input type="text" class="tiebreaker-input-2"></label></div>'
        );
    }

    $.ajax({
        type: "GET",
        url: 'https://api.mysportsfeeds.com/v1.2/pull/nfl/2018-regular/full_game_schedule.json',
        dataType: 'json',
        async: false,
        headers: {
        "Authorization": "Basic " + btoa("ethanheffler" + ":" + "xispring03")
        },
        data: response,
        success: (response) => {
            gameentry = response.fullgameschedule.gameentry;
            fillBoxes(gameentry);
            return gameentry;
        }
    })

    //send picks to db
    $('.dk-btn-success').click( function(e) {
        const username = $('input.your-name').val()
        winnersArray.push(username);

        $('input:checked').each(function () {
            const winners = $(this).val();
            winnersArray.push(winners)
        });

        const tiebreakers = $('input.tiebreaker-input-1').val() + " - " + $('input.tiebreaker-input-2').val();
        winnersArray.push(tiebreakers)

        if (winnersArray.length < gameentry.length && $('.tiebreaker input').val().length === 0 && $('.your-name').val().length === 0) {
             $('.error').removeClass('hidden');
             $("html, body").animate({ scrollTop: $(document).height() }, 500);
        } else {
            firebase.database().ref("games").push({
                winnersArray: winnersArray
            });
            $('.error').addClass('hidden');
            window.location.href = 'leaderboard.html';
        }
        e.preventDefault();
    });

    //making picks
    $('label').click( function() {
        let amountPicked = $('.picked').length + 1,
            thisLabel = $(this);
            amountCompleted = ((amountPicked / gamesPerWeek) * 100) + '%';

        $('.amount-completed').css('width', amountCompleted);
        thisLabel.parents('.answer').addClass('picked');

        if (!thisLabel.parents('.matchup').is(':last-child')) {
            $("html, body").animate({
                scrollTop: thisLabel.parents('.matchup').next().offset().top - 100
            }, 500);
        }
    });
});
