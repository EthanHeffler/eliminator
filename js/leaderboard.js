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
let databaseGames = database.ref("games");

$(document).ready(function() {
    databaseGames.on('value', function(snapshot) {
        let returnedWinnersArray;

        snapshot.forEach(function(childSnapshot) {
          returnedWinnersArray = childSnapshot.val().winnersArray;
          fillLeaderboard(returnedWinnersArray);
        });

        fillLeaderboardHeader(returnedWinnersArray.length)
    });

    function fillLeaderboardHeader (arrayLength) {
        for(let j=0; j<arrayLength - 2; j++){
            $('.leaderboard-header .games-container').append(
                 '<span>Game '+(parseInt([j]) + 1) +'</span>'
             );
        }
    }

    function fillLeaderboard (returnedWinnersArray) {

        //create proper amount of rows
        $('.leaderboard').append('<div class="row"></div>');
        
        //fill rows
        for(let i=0; i<returnedWinnersArray.length; i++){
            $('.leaderboard .row').last().append(
                 '<div>'+ returnedWinnersArray[i] + '</div>'
             );
        }
    }
});
