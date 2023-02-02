ABOUT_INFO = false;
LOAD_STATS_TOURNAMENT = false;
GROUP = [];
SLICE_BRACKET = 0;
BRACKET = [];

function getActiveListRooms( tournamentID, typeCount ){

    var tmpShort = tournamentID;
    if( typeCount == 'short' ){
        tmpShort = 'nearest';
    }

    if( status == "user_not_team" || status == "error_auth" ){
        clearInterval( setID );
    }

    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "functions.php",
        "method": "GET",
        "headers": {
            "content-type": "application/x-www-form-urlencoded"
        },
        "data": {
            "userID": getCookie('tss_identity_id'),
            "action": "get_activeList_room",
            "token": getCookie('tss_identity_token'),
            "tournamentID": tournamentID
        }
    };

    $.ajax(settings).done(function (response) {

        arrayBattle = $.parseJSON(response);

        if( arrayBattle["status"] == "ERROR" && arrayBattle["data"] == "user_not_team" ){
            status = "user_not_team";
        }
        else if( arrayBattle["status"] == "ERROR" && arrayBattle["data"] == "error_auth" ){
            status = "error_auth";
        }

        if( arrayBattle.status == "OK" ){

            if( arrayBattle["result"].length > 0 ) {
                $('#next_battle_view_'+tmpShort).css( 'display', '' );
                TIME_SERVER = Number( arrayBattle['timeNow'] ) - 5;

                $("#info_next_battle").empty()
                $("#next_battle").css("display","block")

                $("#button_join_room").css("display","none")
                // arrayBattle["result"].forEach(function(item, i) {
                var item = arrayBattle["result"][0];
                //item['startTime']
                // var UNIX_TIMESTAMP = Math.round(new Date().getTime() / 1000);
                var UNIX_TIMESTAMP = Math.round(new Date().getTime() / 1000);
                var TIME_NEXT_BATTLE = item['startTime'] * 1000;

                $('#timer_start_battle_'+tmpShort).attr('timeBattle',arrayBattle['timer']);
                $( '<tr><td class="text-center">'+GetViewTime( item['startTime'] )+'</td></tr>' ).appendTo('#info_next_battle');

                if( item.startTournament == false ){
                    $('#lang_start_tournament_'+tmpShort).css( 'display', '' );
                    $('#next_battle_'+tmpShort).css( 'display', 'none' );
                }
                else{
                    $('#lang_start_tournament_'+tmpShort).css( 'display', 'none' );
                    $('#next_battle_'+tmpShort).css( 'display', '' );
                }

                if( item.InfoNextMatch != null ){
                    $('#block_team_match'+tmpShort).css( 'display', '' );

                    if( item.nextTeamID.realName == null ){
                        $('#team_enemy_'+tmpShort).text( 'Команда еще не известна' );
                    }
                    else{
                        $('#team_enemy_'+tmpShort).text( item.nextTeamID.realName );
                        $('#team_enemy_'+tmpShort).attr( 'onclick', 'infoTeam( '+item.nextTeamID.teamID+',  '+item.tournamentID+' )' );
                    }

                    if( item.nextTeamID != null ){
                        if( item.nextTeamID.realName == null ){
                            $('#team_enemy_'+tmpShort).text( 'Команда еще не известна' );
                        }
                    }
                    if( item.InfoNextMatch != null ){
                        $('#info_match_'+tmpShort).attr( 'onclick', 'matchInfo( '+item.tournamentID+', '+item.InfoNextMatch.groupInfoTmp+', \''+item.typeGroup+'\' )' );
                    }
                }
                else{
                    $('#block_team_match'+tmpShort).css( 'display', 'none' );

                }


                if( item['viewButton'] == true && typeof item['battleId'] !== "undefined"  ){
                    if( tmpShort == 'nearest' ){
                        $("#timer_start_battle_nearest").css("display","none");
                    }
                    $("#button_join_room_"+tournamentID).css("display","");
                    $("#button_join_room_onClick_"+tmpShort).css("display","");
                    $("#button_join_room_onClick_"+tmpShort).attr("onClick","joinRoom('"+item['battleId']+"')");
                }

                // });
                timerBattle( tournamentID, tmpShort );
            }
            else{
                $('#next_battle_view_'+tmpShort).css( 'display', 'none' );
                $("#next_battle").css("display","none")
            }

        }

        if( arrayBattle.status == "ERROR" && arrayBattle.data == "error_auth" ){

            $("#not_loggin").css("display","block")

        }



    });

}

function timerBattle( tournamentID, tmpShort ){

    var days, hours, minutes, seconds;
    var timer_start_battle = $('#timer_start_battle_'+tmpShort);//document.getElementById('timer_start_battle_'+tmpShort);
    var timeBattleOLD = timer_start_battle.attr('timeBattle');
    var timeBattleTimer = timeBattleOLD;
    setInterval(function () {
        timer_start_battle = $('#timer_start_battle_'+tmpShort);
        var timeBattleNEW = timer_start_battle.attr('timeBattle');
        if( timeBattleOLD != timeBattleNEW ){
            timeBattleOLD = timer_start_battle.attr('timeBattle');
            timeBattleTimer = timeBattleNEW;
        }
        timeBattleTimer -=1;



        var seconds_left = timeBattleTimer;

        if (seconds_left < 0){
            if( tmpShort != 'nearest' ){
                timer_start_battle.text('BATTLE START');
                return false;
            }
            else{
                timer_start_battle.text('');
                return false;
            }
        }

        days = parseInt(seconds_left / 86400);
        if( days < 10 ){
            days = '0' + days;
        }
        seconds_left = seconds_left % 86400;

        hours = parseInt(seconds_left / 3600);
        if( hours < 10 ){
            hours = '0' + hours;
        }
        seconds_left = seconds_left % 3600;

        minutes = parseInt(seconds_left / 60);
        if( minutes < 10 ){
            minutes = '0' + minutes;
        }
        seconds = parseInt(seconds_left % 60);
        if( seconds < 10 ){
            seconds = '0' + seconds;
        }

        $('#timer_days_'+tmpShort).text(days);
        $('#timer_hours_'+tmpShort).text(hours);
        $('#timer_minutes_'+tmpShort).text(minutes);
        $('#timer_seconds_'+tmpShort).text(seconds);

    }, 1000);
}


var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
};

function getCookie(name) {
    var matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : '';
}

function main_menu_tournament(action, param) {


    $('#about_info').css('display', 'none');
    $('#regulation_info').css('display', 'none');
    $('#all_teams').css('display', 'none');
    $('#reg_in_teams').css('display', 'none');
    $('#result_tournaments').css('display', 'none');
    $('#bracket').css('display', 'none');
    $('#my_team_button').css('display', 'none');
    $('#card_team_tpl_page').css('display', 'none');

    $('.link_other_news').removeClass('active');
    $('[name-buttom='+action+']').addClass('active');

    if( action == "result_tournaments" ){
        GetStatsTournamentShort(param);
        $('[name-buttom=stats_tournaments_tss]').addClass('active');
    }
    else if (action == "team"){
        render_team_page(param['team_id'], Number(param['id']))
    }
    $('#'+action).css('display', '');
}

function emptyNameTeam( team, arrTournament ) {

    var arr = team.split('_');

    if( team.indexOf('Group_Winner_') + 1 || team.indexOf('Group_Looser_') + 1 ){
        if( arr[1] == 'Looser' ){
            arr[1] = 'Loser';
        }
        return arr[1] + " of Group " + ( Number(arr[2]) + 1 );
    }
    if( team.indexOf('Winner_Winner_') + 1 || team.indexOf('Winner_Looser_') + 1 || team.indexOf('Looser_Winner_') + 1 ){

        if( arr[1] == 'Looser' ){
            arr[1] = 'Loser';
        }
        if( arr[0] == "Winner" ){

            return arr[1] + " of " + arrTournament['winner'][arr[0]][arr[2]][arr[3]]['nameBattle'];
        }
        else{
            return arr[1] + " of " + arrTournament['loser'][arr[0]][arr[2]][arr[3]]['nameBattle'];
        }
    }
    if( team.indexOf('LooserFinal_') + 1 ){

        return arr[1] + " of " + arrTournament['loser']['LooserFinal'][arr[2]][arr[3]]['nameBattle'];
    }
    if( team.indexOf('Semifinal_') + 1 ){

        // return arr[1] + " of " + arrTournament['loser']['Semifinal'][arr[2]][arr[3]]['nameBattle'];
        return arr[1] + " of Losers Bracket";
    }

}

function GetViewTime( time ){
    // return date.getDate() + '.' + date.getUTCMonth() + '.' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes(); // 11/22/06 1:38 PM 47 906
    //return date.toISOString().split('.')[0].replace('T', ' ')+' UTC';
    if( getCookie( 'lang' ) == 'ru' ){
        time = Number(time) + 10800
        var date = new Date( time * 1000 );
        var options = {
            year: '2-digit',
            month: 'numeric',
            day: 'numeric',
            timeZone: 'UTC',
            hour: 'numeric',
            minute: 'numeric',
        };
        return date.toLocaleString("ru-RU", options) + ' МСК';
    }
    else{
        var date = new Date( time * 1000 );
        var options = {
            year: '2-digit',
            month: 'short',
            day: 'numeric',
            timeZone: 'UTC',
            hour: 'numeric',
            minute: 'numeric',
            timeZoneName:'short',
            hour12: false
        };
        return date.toLocaleString('en-US', options);
    }
}

function time(){
    return parseInt(new Date().getTime()/1000)
}

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function getParamForFilterTournaments(){
    var dayTournamentStart = Date.parse($('#dayTournamentStart').val())/1000;
    var dayTournamentEnd = Date.parse($('#dayTournamentEnd').val())/1000;

    if(isNaN(dayTournamentStart)){
        dayTournamentStart = 0
    }
    else if(Number(dayTournamentStart) > 0 && isNaN(dayTournamentEnd)){
        dayTournamentEnd = 1905125335
    }
    else if(isNaN(dayTournamentStart)){
        dayTournamentEnd = 0;
    }

    return {
        'statisticGroup':$('#statisticGroup').val(),
        'ratingCheck':$("#ratingCheck").is(':checked'),
        'cluster':$('#cluster').val(),
        'gameMode':$('#gameMode').val(),
        // 'statusTournament':document.getElementById("statusTournament").options[document.getElementById("statusTournament").options.selectedIndex].value,
        'statusTournament':0,
        'teamSize':$('#teamSize').val()
    }
}

function clearParamFilterTournaments() {
    $('.li_select').removeClass('active');
    $('.sprite_main.change_tss.right').removeClass('view')

    document.getElementById('statisticGroup').options[0].selected=false;
    document.getElementById('statisticGroup').options[1].selected=false;
    document.getElementById('statisticGroup').options[2].selected=false;
    document.getElementById('statisticGroup').options[3].selected=false;

    document.getElementById('cluster').options[0].selected=false;
    document.getElementById('cluster').options[1].selected=false;
    document.getElementById('cluster').options[2].selected=false;
    document.getElementById('cluster').options[3].selected=false;

    document.getElementById('gameMode').options[0].selected=false;
    document.getElementById('gameMode').options[1].selected=false;
    document.getElementById('gameMode').options[2].selected=false;

    document.getElementById('teamSize').options[0].selected=false;
    document.getElementById('teamSize').options[1].selected=false;
    document.getElementById('teamSize').options[2].selected=false;
    document.getElementById('teamSize').options[3].selected=false;
    document.getElementById('teamSize').options[4].selected=false;

    // document.getElementById('statusTournament').options[0].selected=true;
    // document.getElementById('ratingCheck').checked = false;

}

function select_menu_bracket(name_menu, tournamentID) {
    SLICE_BRACKET = 0;
    $('[id-tss=group_block]').css('display', 'none');
    $('[id-tss=group_block_winner]').css('display', 'none');
    $('[id-tss=group_block_loser]').css('display', 'none');
    $('[menu-tss=group_block]').removeClass('active');
    $('[menu-tss=group_block_winner]').removeClass('active');
    $('[menu-tss=group_block_loser]').removeClass('active');



    $('[id-tss='+name_menu+']').css('display', '');
    $('[menu-tss='+name_menu+']').addClass('active');

    GetArrayBracketData( tournamentID, BRACKET['bracket'], BRACKET['countRoundWinner'], BRACKET['countRoundLooser'], "" )

}

// function getCoords(elem) {
//     // (1)
//     var box = elem.getBoundingClientRect();
//
//     var body = document.body;
//     var docEl = document.documentElement;
//
//     // (2)
//     var scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
//     var scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;
//
//     // (3)
//     var clientTop = docEl.clientTop || body.clientTop || 0;
//     var clientLeft = docEl.clientLeft || body.clientLeft || 0;
//
//     // (4)
//     var top = box.top + scrollTop - clientTop;
//     var left = box.left + scrollLeft - clientLeft;
//
//     return {
//         top: top,
//         left: left
//     };
// }

function renderTemplate( tplname, params, renderer ){
    var newNode = $("#templates_for_all").
    find("[name="+tplname+"]").
    clone();
    if (newNode.length !== 1)
    {
        return;
    }

    if ( typeof renderer !== "function" )
        renderer = defaultRenderer;
    renderer(newNode, params);
    return newNode;
}

function get_left_time_start(sec) {
    var d = sec/86400 ^ 0 ;
    var h = sec/3600 ^ 0 ;
    var m = (sec-h*3600)/60 ^ 0 ;
    if(d>0){
        return d + " day"
    }
    else if(h>0){
        return h + " hour"
    }
    else if(m>0){
        return m + " minute"
    }
    else{
        return ""
    }


}

function show_all_card_info_tournament(id) {

    function hide_block_card_info_tournament() {
        $("[tournamentid="+id+"] > div.block_tournament_more_info > div.hide_more_info_tournament").removeClass("view_all_card")
    }

    if ($("[tournamentid="+id+"] > div.block_tournament_more_info > div.hide_more_info_tournament").hasClass("view_all_card") == true){
        $("[tournamentid="+id+"]").animate({height: '195px'},250);
        $("[tournamentid="+id+"] > div.block_tournament_more_info > div.hide_more_info_tournament").animate({opacity: 0},250);
        $("[tournamentid="+1279+"] > div.block_tournament_more_info > div.row > div.col-lg-6 > div.open_hide_info > span").removeClass("hide_block");
        $("[tournamentid="+1279+"] > div.block_tournament_more_info > div.row > div.col-lg-6 > div.open_hide_info > span").addClass("view_block");


        setTimeout(hide_block_card_info_tournament, 250);
    }
    else{
        $("[tournamentid="+id+"] > div.block_tournament_more_info > div.hide_more_info_tournament").addClass("view_all_card")
        $("[tournamentid="+id+"]").animate({height: '310px'},250);
        $("[tournamentid="+id+"] > div.block_tournament_more_info > div.hide_more_info_tournament").animate({opacity: 1},250);
        $("[tournamentid="+1279+"] > div.block_tournament_more_info > div.row > div.col-lg-6 > div.open_hide_info > span").removeClass("view_block");
        $("[tournamentid="+1279+"] > div.block_tournament_more_info > div.row > div.col-lg-6 > div.open_hide_info > span").addClass("hide_block");


    }
}

function show_team_tournament(id, tournamentID) {

    function hide_block_card_info_tournament() {
        $("[tournamentid="+id+"] > div.block_tournament_more_info > div.hide_more_info_tournament").removeClass("view_all_card")
    }

    if ($("[name-block-id="+id+"] > span").hasClass("open_off") == true){
        // $("[tournamentid="+id+"]").animate({height: '195px'},1000);
        // $("[tournamentid="+id+"] > div.block_tournament_more_info > div.hide_more_info_tournament").animate({opacity: 0},1000);
        $("[name-block-id="+id+"] > span").removeClass("open_off");
        $("[name-block-id="+id+"] > span").addClass("close_off");
        $('[name-block=hide_'+id+']').css('display', '');
        infoTeam(id, tournamentID);


        // setTimeout(hide_block_card_info_tournament, 1000);
    }
    else{
        // $("[tournamentid="+id+"] > div.block_tournament_more_info > div.hide_more_info_tournament").addClass("view_all_card")
        // $("[tournamentid="+id+"]").animate({height: '350px'},1000);
        // $("[tournamentid="+id+"] > div.block_tournament_more_info > div.hide_more_info_tournament").animate({opacity: 1},1000);
        // $("[tournamentid="+1279+"] > div.block_tournament_more_info > div.row > div.col-lg-6 > div.open_hide_info > span").removeClass("view_block");
        // $("[tournamentid="+1279+"] > div.block_tournament_more_info > div.row > div.col-lg-6 > div.open_hide_info > span").addClass("hide_block");
        $("[name-block-id="+id+"] > span").removeClass("close_off");
        $("[name-block-id="+id+"] > span").addClass("open_off");
        $('[name-block=hide_'+id+']').css('display', 'none');


    }
}

function checker_reg_team(action, tournamentID) {

    if(action == "team_new"){
        $('[team-menu=new_team]').attr('src', 'images/tpl2/team_new_off.png').removeAttr('onclick')
        $('[team-menu=find_team]').attr('src', 'images/tpl2/team_find_off.png').attr('onclick', 'checker_reg_team("find_team", '+tournamentID+')')
        $('[block-name=search_team]').css('display', 'none')
        $('[block-name=reg_new_team]').css('display', '')

    }
    else{
        $('[team-menu=find_team]').attr('src', 'images/tpl2/team_find_on.png').removeAttr('onclick')
        $('[team-menu=new_team]').attr('src', 'images/tpl2/team_new_on.png').attr('onclick', 'checker_reg_team("team_new", '+tournamentID+');')
        $('[block-name=search_team]').css('display', '')
        $('[block-name=reg_new_team]').css('display', 'none')
        searchTeam( tournamentID );
    }

}

function GetTournamentsList( count, params, status_tournament ) {

    $('#linkLoadTournaments_'+status_tournament).css('display', 'none');
    $('#imgLoadTournaments').css('display', '');

    var current_time = Math.round(new Date().getTime() / 1000);
    var local_main_param = localStorage.getItem('all_tournaments');
    if (local_main_param !== undefined && local_main_param !== null)
    {
        var tournaments = $.parseJSON(local_main_param);
        if ( current_time > (tournaments['time_create'] + 1200 ) ){
            localStorage.removeItem('all_tournaments');
            local_main_param = null;
        }
    }


    if (local_main_param === undefined || local_main_param === null)
    {

        var settings = {
            "async": true,
            "crossDomain": true,
            "url": "functions.php",
            "method": "POST",
            "headers": {
                "content-type": "application/x-www-form-urlencoded"
            },
            "data": {
                "countCard": count,
                "action": "GetActiveTournaments",
                "params": {}
            }
        };
        $.ajax(settings).done(function (response) {

            var tournaments = $.parseJSON(response);

            tournaments['time_create'] = Math.round(new Date().getTime() / 1000);
            var serialObj = JSON.stringify(tournaments);
            // localStorage.setItem('all_tournaments', serialObj);
            set_item_local_storage('all_tournaments', serialObj);

            if(status_tournament != 'short'){
                viewCardTournament(filter_tournament(tournaments, params, tournaments['my_rating'], status_tournament), tournaments['my_rating'], status_tournament);
            }
            else{
                viewCardTournamentNewsPage(filter_tournament(tournaments, {'statisticGroup': [], 'ratingCheck': false, 'cluster': [], 'gameMode': [], 'statusTournament': 0, 'teamSize':[]}, tournaments['my_rating'], 'open'), tournaments['my_rating'], 'open');
            }


            if (tournaments['data'].length < Number(tournaments['countViewTournament'])) {
                tournaments['viewLink'] = false;
            }
            else {
                tournaments['viewLink'] = true;
            }

            if (tournaments['data'].length < 1) {
                renderTemplate("empty_tournaments", {},
                    function (cloned, params) {
                    }).appendTo('#contentCardTournament');
            }


            $('#imgLoadTournaments').css('display', 'none');

        });

    }
    else
    {
        var tournaments = $.parseJSON(local_main_param);

        if(status_tournament != 'short'){
            viewCardTournament(filter_tournament(tournaments, params, tournaments['my_rating'], status_tournament), tournaments['my_rating'], status_tournament);
        }
        else{
            viewCardTournamentNewsPage(filter_tournament(tournaments, {'statisticGroup': [], 'ratingCheck': false, 'cluster': [], 'gameMode': [], 'statusTournament': 0, 'teamSize':[]}, tournaments['my_rating'], 'open'), tournaments['my_rating'], 'open');
        }

        $('#imgLoadTournaments').css('display', 'none');

    }

    if ((Number(document.getElementsByName("templateCardTournaments").length - 1)%14))
    {
        $('#linkLoadTournaments_'+status_tournament).css('display', 'none');
    }
    else
    {
        $('#linkLoadTournaments_'+status_tournament).css('display', '');
    }

}




function set_item_local_storage(key, value) {

    try {
        localStorage.setItem(key, value);
        return true;
    } catch (e) {
        localStorage.clear();
        localStorage.setItem(key, value);
    }

}

function viewCardTournament( tournaments, rating , status_tournament){

    var lang;
    if( getCookie('lang') == 'ru' ){
        lang = 'RU';
    }
    else{
        lang = 'EN'
    }

    var name_block = "contentCardTournament_";
    if(status_tournament == 'live'){
        name_block = "contentCardTournamentActive_";
    }
    else if (status_tournament == 'past'){
        name_block = "contentCardTournamentPast_";
    }

    var column_to_append = 1;


    if(tournaments.length == 0 && $(".card_tournament."+status_tournament).length == 0){

        $("[name-block="+status_tournament+"_tournaments]").css('display', 'none');
    }
    else{
        $("[name-block="+status_tournament+"_tournaments]").css('display', '');
    }

    for( var i in tournaments ) {
        renderTemplate("templateCardTournaments", tournaments[i],
            function (cloned, params) {

                if( Number(tournaments[i]['groupType']) > 0 ){

                    if ( Number(tournaments[i]['groupType']) == 2 && Number(tournaments[i]['teamInGroup']) == 2 ) {
                        tournaments[i]['amountTeam'] = Number(tournaments[i]['amountTeam']);
                    }
                    else if ( Number(tournaments[i]['groupType']) == 2 && Number(tournaments[i]['teamInGroup']) > 2 ){
                        tournaments[i]['amountTeam'] = ( Number(tournaments[i]['amountTeam']) / 2 ) * Number(tournaments[i]['teamInGroup']);
                    }
                    else if ( Number(tournaments[i]['groupType']) == 3 ){
                        tournaments[i]['amountTeam'] = Number(tournaments[i]['teamInGroup']);
                    }

                    else{
                        tournaments[i]['amountTeam'] = Number(tournaments[i]['amountTeam']) * ( Number(tournaments[i]['groupType']) * Number(tournaments[i]['teamInGroup']) );
                    }


                }

                if( Number(tournaments[i]['countAllKeyAccess']) > 0 ){
                    tournaments[i]['keyTournament'] = 1;
                }
                else{
                    tournaments[i]['keyTournament'] = false;
                }

                if( tournaments[i]['ticket_access'] != '' ){
                    tournaments[i]['needTicket'] = 1;
                }
                else{
                    tournaments[i]['needTicket'] = false;
                }

                if(tournaments[i]['tournamentID'] != null && tournaments[i]['json_data'] ){
                    tournaments[i]['tournamentBracket'] = true;
                }
                else{
                    tournaments[i]['tournamentBracket'] = false;
                }
                if( tournaments[i] == 1 && time() < tournaments[i]['dateStartTournament'] ){
                    tournaments[i]['countTeam'] = tournaments[i]['countAllTeamsConfirm']+"/" + "~";
                }
                else{
                    if( Number(tournaments[i]['tournamentID']) == 7562 )
                    {
                        tournaments[i]['countTeam'] = "7/" + tournaments[i]['amountTeam'];
                    }
                    else
                    {
                        tournaments[i]['countTeam'] = tournaments[i]['countAllTeamsConfirm']+"/" + tournaments[i]['amountTeam'];
                    }


                }

                if( LOGIN_STATUS == true ){
                    if( tournaments[i]['teamID'] != null ){
                        tournaments[i]['myTeam_confirmed'] = 1;//???

                        tournaments[i]['statusMyTeam'] = true;
                        tournaments[i]['idMyTeam'] = tournaments[i]['teamID'];
                    }
                    else{
                        tournaments[i]['statusMyTeam'] = false;
                        tournaments[i]['idMyTeam'] = 0;
                    }
                }
                else{
                    tournaments[i]['statusMyTeam'] = false;
                }

                tournaments[i]['viewerDateStartTournament'] = GetViewTime( tournaments[i]['dateStartTournament'] );
                tournaments[i]['viewerDateEndTournament'] = GetViewTime( tournaments[i]['dateEndTournament'] );

                if (tournaments[i]['status'] == false || tournaments[i]['dateEndTournament'] <= time()){
                    tournaments[i]['tornamentStatus'] = 'past';
                    tournaments[i]['tornamentStatusStyle'] = 'default';
                }
                else if (tournaments[i]['dateStartReg'] <= time() && tournaments[i]['dateStartTournament'] >= time()){
                    tournaments[i]['tornamentStatus'] = 'open';
                    tournaments[i]['tornamentStatusStyle'] = 'success';
                }
                else if (tournaments[i]['dateEndTournament'] >= time() && time() >= tournaments[i]['dateStartTournament']){
                    tournaments[i]['tornamentStatus'] = 'live';
                    tournaments[i]['tornamentStatusStyle'] = 'danger';
                }
                if( tournaments[i]['gameMode'] == 'HB' ){
                    tournaments[i]['gameMode'] = 'SB';
                }
                var preset_type = false;
                if(tournaments[i]['preset_type_select'] != 'default')
                {
                    preset_type = true
                }

                tournaments[i]["nameImage"] = GetIconTournament(tournaments[i]['tournamentID'], tournaments[i]['icon_tournament']);

                tournaments[i]["time_left_to_start"] = get_left_time_start(Number(tournaments[i]['dateStartTournament']) - Number(time()));
                if(status_tournament == "open"){
                    var snum = Number(tournaments[i]['dateStartTournament']) - Number(time());
                    var fnum = Number(tournaments[i]['dateStartTournament']) - Number(tournaments[i]['dateStartReg']);
                    var per = (snum/fnum)*100;

                    var reserve_team = Number(tournaments[i]['maxTeamSize'])-Number(tournaments[i]['teamSize']);

                    if((Number(tournaments[i]['dateStartTournament']) - Number(time())) > 7200){
                        cloned.find("[card-name=time_left_to_start]").text( tournaments[i]['time_left_to_start'] ).css("color", "#CFD8DC");
                        cloned.find("[card-name=progress_color]").addClass('tss_progress_color_default').css( 'width', per.toFixed(0)+"%" );
                    }
                    else {
                        cloned.find("[card-name=time_left_to_start]").text( tournaments[i]['time_left_to_start'] );
                        cloned.find("[card-name=progress_color]").addClass('tss_progress_color_alarm').css( 'width', per.toFixed(0)+"%" );
                    }
                }
                else if(status_tournament == "live"){
                    tournaments[i]["time_left_to_start"] = get_left_time_start(Number(tournaments[i]['dateEndTournament']) - Number(time()));

                    cloned.find("[card-name=time_left_to_start_text]").text(LANG_JS.tour_will_end);

                    var snum = Number(tournaments[i]['dateEndTournament']) - Number(time());
                    var fnum = Number(tournaments[i]['dateEndTournament']) - Number(tournaments[i]['dateStartTournament']);
                    var per = (snum/fnum)*100;

                    var reserve_team = Number(tournaments[i]['maxTeamSize'])-Number(tournaments[i]['teamSize']);

                    if((Number(tournaments[i]['dateEndTournament']) - Number(time())) > 1800){
                        cloned.find("[card-name=time_left_to_start]").text( tournaments[i]['time_left_to_start'] ).css("color", "#CFD8DC");
                        cloned.find("[card-name=progress_color]").addClass('tss_progress_color_default').css( 'width', per.toFixed(0)+"%" );
                    }
                    else {
                        cloned.find("[card-name=time_left_to_start]").text( tournaments[i]['time_left_to_start'] );
                        cloned.find("[card-name=progress_color]").addClass('tss_progress_color_alarm').css( 'width', per.toFixed(0)+"%" );
                    }
                }
                else if (status_tournament != 'my') {
                    cloned.find("[card-name=time_left_to_start_text]").text(LANG_JS.tour_end);
                    cloned.find("[card-name=block_time_left_to_start]").css('display', 'none');
                }



                if(tournaments[i]['statisticGroup'] == 'aircraft'){
                    cloned.find("[card-name=tournamentIdBlock]").attr( "tournamentid", tournaments[i]['tournamentID'] ).addClass(status_tournament).css('background-image', 'url(/images_v2/fight_plane_bg.png)');
                }
                else{
                    cloned.find("[card-name=tournamentIdBlock]").attr( "tournamentid", tournaments[i]['tournamentID'] ).addClass(status_tournament).css('background-image', 'url(/images_v2/fight_tank_bg.png)');
                }

                cloned.find("[card-name=imageTournament]").attr( 'src','//static-tss.warthunder.com/icon_tournament/'+tournaments[i]["nameImage"] );
                cloned.find("[card-name=dayTournament]").text(GetViewTime( tournaments[i]['dateStartTournament'] ));
                cloned.find("[card-name=formatTeam]").text( tournaments[i]['teamSize']+'x'+tournaments[i]['teamSize'] + ' ' + tournaments[i]['gameMode']);
                cloned.find("[card-name=clusterTournament]").text( tournaments[i]['cluster'] );
                cloned.find("[card-name=attr_id_for_show_all_info]").attr( 'onclick', 'show_all_card_info_tournament('+tournaments[i]['tournamentID']+')' );
                cloned.find("[card-name=countTeam]").text( tournaments[i]['countTeam'] );
                cloned.find("[card-name=reserve_team]").text('('+tournaments[i]['teamSize']+'+'+(Number(tournaments[i]['maxTeamSize'])-Number(tournaments[i]['teamSize']))+')');
                cloned.find("[card-name=typeTournament]").text(GetTypeTournamentShort(tournaments[i]['typeTournament'], tournaments[i]['groupType']));
                cloned.find("[card-name=prize_pool]").html(  tournaments[i]['prize_pool'].replace('Golden eagles', '<span class="sprite_main ge_on"></span>')  );
                cloned.find("[card-name=schedulerTournament]").text(
                    GetViewTime( tournaments[i]['dateStartTournament'] ) +' - '+
                    GetViewTime( tournaments[i]['dateEndTournament'] )
                );
                if(status_tournament == "open"){
                    cloned.find("[card-name=join_tournament_button]").attr( 'href', '?action=tournament&id='+tournaments[i]["tournamentID"]+'&page_load=reg_in_teams' );
                    cloned.find("[card-name=stats_tournament_button]").attr( 'href', '?action=tournament&id='+tournaments[i]["tournamentID"]+'&page_load=result_tournaments' ).css('display', 'none');
                    cloned.find("[card-name=bracket_tournament_button]").attr( 'href', '?action=tournament&id='+tournaments[i]["tournamentID"]+'&page_load=bracket' ).css('display', 'none');
                }
                else if(status_tournament == "past"){
                    cloned.find("[card-name=join_tournament_button]").attr( 'href', '?action=tournament&id='+tournaments[i]["tournamentID"]+'&page_load=reg_in_teams' ).css('display', 'none');
                    cloned.find("[card-name=bracket_tournament_button]").attr( 'href', '?action=tournament&id='+tournaments[i]["tournamentID"]+'&page_load=bracket' ).css('display', 'none')
                    cloned.find("[card-name=stats_tournament_button]").attr( 'href', '?action=tournament&id='+tournaments[i]["tournamentID"]+'&page_load=result_tournaments' );
                }
                else if(status_tournament == "live"){
                    cloned.find("[card-name=join_tournament_button]").attr( 'href', '?action=tournament&id='+tournaments[i]["tournamentID"]+'&page_load=reg_in_teams' ).css('display', 'none');
                    cloned.find("[card-name=stats_tournament_button]").attr( 'href', '?action=tournament&id='+tournaments[i]["tournamentID"]+'&page_load=result_tournaments' ).css('display', 'none');
                    cloned.find("[card-name=bracket_tournament_button]").attr( 'href', '?action=tournament&id='+tournaments[i]["tournamentID"]+'&page_load=bracket' );
                }
                else if(status_tournament == "my"){

                    if( tournaments[i]['tornamentStatus'] == 'past' ){
                        cloned.find("[card-name=time_left_to_start_text]").text(LANG_JS.end_tournament_place + tournaments[i]['place']);
                        cloned.find("[card-name=block_time_left_to_start]").css('display', 'none');

                        cloned.find("[card-name=join_tournament_button]").attr( 'href', '?action=tournament&id='+tournaments[i]["tournamentID"]+'&page_load=reg_in_teams' ).css('display', 'none');
                        cloned.find("[card-name=bracket_tournament_button]").attr( 'href', '?action=tournament&id='+tournaments[i]["tournamentID"]+'&page_load=bracket' ).css('display', 'none')
                        cloned.find("[card-name=stats_tournament_button]").attr( 'href', '?action=tournament&id='+tournaments[i]["tournamentID"]+'&page_load=result_tournaments' );
                    }
                    else if(tournaments[i]['tornamentStatus'] == 'open'){
                        cloned.find("[card-name=time_left_to_start_text]").text(LANG_JS.end_reg);
                        cloned.find("[card-name=join_tournament_button]").attr( 'href', '?action=tournament&id='+tournaments[i]["tournamentID"]+'&page_load=reg_in_teams' ).css('display', 'none');
                        cloned.find("[card-name=bracket_tournament_button]").attr( 'href', '?action=tournament&id='+tournaments[i]["tournamentID"]+'&page_load=bracket' ).css('display', 'none')
                        cloned.find("[card-name=stats_tournament_button]").attr( 'href', '?action=tournament&id='+tournaments[i]["tournamentID"]+'&page_load=bracket' ).css('display', 'none');

                        cloned.find("[card-name=block_tournament_open_live]").css('display', '');
                        cloned.find("[card-name=bracket_tournament_my_team]").attr( 'href', '?action=tournament&id='+tournaments[i]["tournamentID"]+'&page_load=team&team_id='+tournaments[i]["teamID"] ).css('display', '');
                        cloned.find("[card-name=bracket_tournament_about_info]").attr( 'href', '?action=tournament&id='+tournaments[i]["tournamentID"]).css('display', '');
                        cloned.find("[card-name=bracket_tournament_create_training_room]").attr( 'onClick', 'windowTrainingRoom( '+tournaments[i]["tournamentID"]+', '+tournaments[i]["teamID"]+', '+preset_type+' )');

                        var snum = Number(tournaments[i]['dateStartTournament']) - Number(time());
                        var fnum = Number(tournaments[i]['dateStartTournament']) - Number(tournaments[i]['dateStartReg']);
                        var per = (snum/fnum)*100;

                        if((Number(tournaments[i]['dateStartTournament']) - Number(time())) > 7200){
                            cloned.find("[card-name=time_left_to_start]").text( timeConversion(Number(tournaments[i]['dateStartTournament']) - Number(time())) ).css("color", "#CFD8DC").attr('text_time_left_id', tournaments[i]['tournamentID']);
                            cloned.find("[card-name=progress_color]").addClass('tss_progress_color_default').css( 'width', per.toFixed(0)+"%" ).attr('line_time_left_id', tournaments[i]['tournamentID']);
                        }
                        else {
                            cloned.find("[card-name=time_left_to_start]").text( timeConversion(Number(tournaments[i]['dateStartTournament']) - Number(time())) ).css("color", "#CFD8DC").attr('text_time_left_id', tournaments[i]['tournamentID']);
                            cloned.find("[card-name=progress_color]").addClass('tss_progress_color_alarm').css( 'width', per.toFixed(0)+"%" ).attr('line_time_left_id', tournaments[i]['tournamentID']);
                        }

                        function update_timer(dateStartTournament, tournamentID){
                            var intervalID = setInterval(function() {

                                dateStartTournament = dateStartTournament - 1;
                                if (dateStartTournament == 0){
                                    $("[text_time_left_id="+tournamentID+"]").text('Турнир начался');
                                    clearInterval(intervalID);
                                }
                                $("[text_time_left_id="+tournamentID+"]").text(timeConversion(dateStartTournament))
                            }, 1000);
                        }

                        function update_line_time(dateStartTournament, dateStartReg, tournamentID){
                            var intervalID = setInterval(function() {
                                var snum = Number(dateStartTournament) - Number(time());
                                var fnum = Number(dateStartTournament) - Number(dateStartReg);
                                var per = (snum/fnum)*100;

                                $("[line_time_left_id="+tournamentID+"]").css( 'width', per.toFixed(0)+"%" )
                            }, 2000);


                        }

                        var dateStartTournament = Number(tournaments[i]['dateStartTournament']) - Number(time());
                        update_timer(dateStartTournament, tournaments[i]['tournamentID'])
                        update_line_time(Number(tournaments[i]['dateStartTournament']), Number(tournaments[i]['dateStartReg']), tournaments[i]['tournamentID'])

                    }
                    else if(tournaments[i]['tornamentStatus'] == 'live'){

                    }
                    // else{
                    //     cloned.find("[card-name=next_battle]").attr( 'id', 'next_battle_view_'+tournaments[i]['tournamentID'] );
                    //     cloned.find("[card-name=next_battle_battle]").attr( 'id', 'next_battle_'+tournaments[i]['tournamentID'] );
                    //     cloned.find("[card-name=next_battle_start_tournament]").attr( 'id', 'lang_start_tournament_'+tournaments[i]['tournamentID'] );
                    //     cloned.find("[card-name=next_battle_block_team_match]").attr( 'id', 'block_team_match'+tournaments[i]['tournamentID'] );
                    //     cloned.find("[card-name=next_battle_team_enemy]").attr( 'id', 'team_enemy_'+tournaments[i]['tournamentID'] );
                    //     cloned.find("[card-name=next_battle_info_match]").attr( 'id', 'info_match_'+tournaments[i]['tournamentID'] );
                    //     cloned.find("[card-name=next_battle_timer_start_battle]").attr( 'id', 'timer_start_battle_'+tournaments[i]['tournamentID'] );
                    //     cloned.find("[card-name=next_battle_timer_days]").attr( 'id', 'timer_days_'+tournaments[i]['tournamentID'] );
                    //     cloned.find("[card-name=next_battle_timer_hours]").attr( 'id', 'timer_hours_'+tournaments[i]['tournamentID'] );
                    //     cloned.find("[card-name=next_battle_timer_minutes]").attr( 'id', 'timer_minutes_'+tournaments[i]['tournamentID'] );
                    //     cloned.find("[card-name=next_battle_timer_seconds]").attr( 'id', 'timer_seconds_'+tournaments[i]['tournamentID'] );
                    //
                    //     cloned.find("[card-name=button_join_room_onClick_]").attr( 'id', 'button_join_room_onClick_'+ tournaments[i]['tournamentID']);
                    //
                    //     getActiveListRooms( tournaments[i]['tournamentID'] );
                    // }
                    //
                    // cloned.find("[card-name=join_tournament_button]").attr( 'href', '?action=tournament&id='+tournaments[i]["tournamentID"]+'&page_load=reg_in_teams' ).css('display', 'none');
                    // cloned.find("[card-name=stats_tournament_button]").attr( 'href', '?action=tournament&id='+tournaments[i]["tournamentID"]+'&page_load=result_tournaments' ).css('display', 'none');
                    // cloned.find("[card-name=bracket_tournament_button]").attr( 'href', '?action=tournament&id='+tournaments[i]["tournamentID"]+'&page_load=bracket' ).css('display', '');
                }












                cloned.find("[card-name=tornamentStatus]").attr( "style", "min-height:150px;" );
                cloned.find("[card-name=tornamentStatus]").addClass( tournaments[i]['tornamentStatus'] );
                cloned.find("[card-name=headerNameTournament]").text( tournaments[i]['name'+lang] );
                // cloned.find("[card-name=formatTeam]").text( tournaments[i]['teamSize']+'x'+tournaments[i]['teamSize'] );
                // cloned.find("[card-name=countTeam]").text( tournaments[i]['countTeam'] );
                // cloned.find("[card-name=gameMode]").text( tournaments[i]['gameMode'] );
                cloned.find("[card-name=typeTournament]").text( GetTypeTournamentShort(tournaments[i]['typeTournament'], tournaments[i]['groupType']) );
                cloned.find("[card-name=typeTournament]").attr( 'data-original-title', 'type_tournament_'+tournaments[i]['typeTournament'] );

                cloned.find("[card-name=labelTournament]").addClass( 'label-'+tournaments[i]['tornamentStatusStyle'] );
                cloned.find("[card-name=labelTournament]").text( tournaments[i]['tornamentStatus'].toUpperCase() );

                cloned.find("[card-name=buttonParamTournament]").attr( 'onclick', 'paramTournament( '+tournaments[i]["tournamentID"]+' )' );
                cloned.find("[card-name=buttonInfoTournament]").attr( 'href', '?action=tournament&id='+tournaments[i]["tournamentID"] );




                cloned.find("[card-name=buttonComments]").css( 'display', 'none' );

                if( tournaments[i]['user_tournament'] == true ){
                    cloned.find("[card-name=userTournament]").css( 'display', '' );
                }

                cloned.find("[card-name=headerNameTournament]").attr( 'data-original-title', tournaments[i]['name'+lang] );

                if( tournaments[i]["nameImage"] !=false ){
                    cloned.find("[card-name=imageTournament]").append( '<img src="//static-tss.warthunder.com/icon_tournament/'+tournaments[i]["nameImage"]+'" class="img_tournament"/>' );
                    // cloned.find("[card-name=imageTournament]").append( '<img src="icon_tournament/'+tournaments[i]["nameImage"]+'" class="img_tournament" onerror = "this.style.display = \'none\'"/>' );
                }

                if( tournaments[i]['myTeam_confirmed'] == 0 && tournaments[i]['statusMyTeam'] == 1 && tournaments[i]['tornamentStatus'] == 'open' ){
                    cloned.find("[card-name=myTeamConfirm]").css( 'display', '' );
                }
                if( check_rating(rating, tournaments[i]['rating_a'], tournaments[i]['rating_b'], tournaments[i]['gameMode'], tournaments[i]['statisticGroup']) == true ){
                    cloned.find("[card-name=NotRating]").css( 'display', '' );
                }


                if( tournaments[i]['keyTournament'] == true ){
                    cloned.find("[card-name=keyTournament]").css( 'display', '' );
                }

                if( tournaments[i]['statusMyTeam'] == true ){

                    cloned.find("[card-name=buttonMyTeamTournament]").css( 'display', '' );
                    cloned.find("[card-name=buttonJoinTeamTournament]").css( 'display', 'none' );

                    cloned.find("[card-name=buttonMyTeamTournament]").attr( 'id', 'button_my_team_'+tournaments[i]['tournamentID'] );
                    cloned.find("[card-name=buttonJoinTeamTournament]").attr( 'id', 'button_team_join_'+tournaments[i]['tournamentID'] );
                    cloned.find("[card-name=buttonMyTeamTournament]").attr( 'onclick', 'myTeam('+tournaments[i]["idMyTeam"]+', '+tournaments[i]["tournamentID"]+')' );

                    if( Number(tournaments[i]['maxTeamSize']) == 1 ){
                        cloned.find("[card-name=buttonJoinTeamTournament]").attr( 'onclick', 'GetRegistrationTournament('+tournaments[i]["tournamentID"]+', '+tournaments[i]["keyTournament"]+', '+tournaments[i]["needTicket"]+', true), createTeam()' );
                    }
                    else{
                        cloned.find("[card-name=buttonJoinTeamTournament]").attr( 'onclick', 'GetRegistrationTournament('+tournaments[i]["tournamentID"]+', '+tournaments[i]["keyTournament"]+', '+tournaments[i]["needTicket"]+'), false' );
                    }
                    // cloned.find("[card-name=buttonJoinTeamTournament]").attr( 'onclick', 'GetRegistrationTournament('+tournaments[i]["tournamentID"]+', '+tournaments[i]["keyTournament"]+', '+tournaments[i]["needTicket"]+')' );

                }
                else{

                    if( ( LOGIN_STATUS == true && Number(tournaments[i]['amountTeam']) > Number(tournaments[i]['countAllTeamsConfirm']) && tournaments[i]['tornamentStatus'] == 'open' ) || ( LOGIN_STATUS == true && tournaments[i]['blitz'] == 1 && tournaments[i]['tornamentStatus'] == 'open' ) ){
                        cloned.find("[card-name=buttonMyTeamTournament]").css( 'display', 'none' );
                        cloned.find("[card-name=buttonJoinTeamTournament]").css( 'display', '' );
                        cloned.find("[card-name=buttonMyTeamTournament]").attr( 'id', 'button_my_team_'+tournaments[i]['tournamentID'] );
                        if( check_rating(rating, tournaments[i]['rating_a'], tournaments[i]['rating_b'], tournaments[i]['gameMode'], tournaments[i]['statisticGroup']) == true ){
                            cloned.find("[card-name=buttonJoinTeamTournament]").removeAttr( 'onclick' );
                            cloned.find("[card-name=buttonJoinTeamTournament]").attr( 'disabled', 'disabled' );
                        }
                        else{

                            cloned.find("[card-name=buttonJoinTeamTournament]").attr( 'id', 'button_team_join_'+tournaments[i]['tournamentID'] );

                            if( Number(tournaments[i]['maxTeamSize']) == 1 ){
                                cloned.find("[card-name=buttonJoinTeamTournament]").attr( 'onclick', 'GetRegistrationTournament('+tournaments[i]["tournamentID"]+', '+tournaments[i]["keyTournament"]+', '+tournaments[i]["needTicket"]+', true), createTeam()' );
                            }
                            else{
                                cloned.find("[card-name=buttonJoinTeamTournament]").attr( 'onclick', 'GetRegistrationTournament('+tournaments[i]["tournamentID"]+', '+tournaments[i]["keyTournament"]+', '+tournaments[i]["needTicket"]+', false)' );
                            }

                        }
                        cloned.find("[card-name=buttonMyTeamTournament]").attr( 'onclick', 'myTeam('+tournaments[i]["idMyTeam"]+', '+tournaments[i]["tournamentID"]+')' );

                    }
                    else if( LOGIN_STATUS != true && tournaments[i]['tornamentStatus'] == 'open' ){
                        cloned.find("[card-name=buttonNotLoginTournament]").css( 'display', '' );
                    }

                }


                if (i % 2 == 0 ){
                    column_to_append = 2;
                }
                else{
                    column_to_append = 1;
                }

            }).appendTo( '#'+name_block+column_to_append );
    }
    $('[data-toggle="tooltip"]').tooltip();
    $('[data-toggle="popover"]').popover();

}

function viewCardTournamentNewsPage( tournaments, rating , status_tournament){

    var lang;
    if( getCookie('lang') == 'ru' ){
        lang = 'RU';
    }
    else{
        lang = 'EN'
    }

    var name_block = "contentCardTournament_";
    if(status_tournament == 'live'){
        name_block = "contentCardTournamentActive_";
    }
    else if (status_tournament == 'past'){
        name_block = "contentCardTournamentPast_";
    }

    var column_to_append = 1;

    if(tournaments.length == 0){

        $("#short_tournament_block").css('display', 'none');
    }
    var tournament_counter = 0;
    for( var i in tournaments ) {
        if(tournament_counter >= 4){
            break;
        }
        renderTemplate("short_list_tour_tpl", tournaments[i],
            function (cloned, params) {
                if(tournaments[i]['statisticGroup'] == 'aircraft'){
                    cloned.find("[name-card=background_image]").css('background-image', 'url(/images_v2/fight_plane_bg.png)')
                }
                else{
                    cloned.find("[name-card=background_image]").css('background-image', 'url(/images_v2/fight_tank_bg.png)')
                }

                cloned.find("[name-card=name_tournament]").text(tournaments[i]['name'+lang]);
                cloned.find("[name-card=format_team]").text(tournaments[i]['teamSize']+'x'+tournaments[i]['teamSize']);
                cloned.find("[name-card=difficulty]").text(tournaments[i]['gameMode']);
                cloned.find("[name-card=cluster]").text(tournaments[i]['cluster']);
                cloned.find("[name-card=type_bracket]").text(GetTypeTournamentShort( tournaments[i]['typeTournament'], tournaments[i]['groupType'] ));

                cloned.find("[name-card=date_start]").text(GetViewTime( tournaments[i]['dateStartTournament'] ));
                cloned.find("[name-card=date_end]").text(GetViewTime( tournaments[i]['dateEndTournament'] ));

                cloned.find("[name-card=about_info]").attr('href', '/?action=tournament&id='+tournaments[i]['tournamentID']+'&page_load=about_info');
                cloned.find("[name-card=reg_in_teams]").attr('href', '/?action=tournament&id='+tournaments[i]['tournamentID']+'&page_load=reg_in_teams');

            }).appendTo( '#short_tournament' );
        tournament_counter += 1;
    }


}

function filter_tournament(tournaments, params, my_rating, status_tournament) {
    var return_tournaments = tournaments['data'];

    if (params.length == 0 )
    {
        params = getParamForFilterTournaments();
    }
    params.statusTournament = status_tournament;
    return_tournaments.sort(function (a, b) {
        if (parseInt(a.dateStartTournament) < parseInt(b.dateStartTournament)) {
            return -1;
        }
        else
        {
            return 1;
        }

        // if (parseInt(a.dateStartTournament) > parseInt(b.dateStartTournament) ){
        //     if ( parseInt(new Date().getTime() / 1000) < parseInt(a.dateStartTournament ))
        //     {
        //         return -1;
        //     }
        //     else
        //     {
        //         return 1;
        //     }
        // }
        // if (parseInt(a.dateStartTournament) < parseInt(b.dateStartTournament)) {
        //     if ( parseInt(new Date().getTime() / 1000) < parseInt(a.dateStartTournament ))
        //     {
        //         return -1;
        //     }
        //     else
        //     {
        //         return 1;
        //     }
        // }
    });

    if (params.dayTournamentStart > 0 || params.dayTournamentEnd > 0)
    {
        return_tournaments = return_tournaments.filter(function(return_tournaments)
        {
            return Number(return_tournaments['dateStartTournament']) > params.dayTournamentStart && Number(return_tournaments['dateStartTournament']) < params.dayTournamentEnd
        });
    }

    if (params.ratingCheck === true)
    {
        return_tournaments = return_tournaments.filter(function(return_tournaments)
        {
            if( Number(my_rating[return_tournaments['gameMode'].toLowerCase()+'_'+return_tournaments['statisticGroup']]) == 1000 || my_rating['rating']=='no_rating')
            {
                my_rating[return_tournaments['gameMode'].toLowerCase()+'_'+return_tournaments['statisticGroup']] = 0
            }
            return Number(my_rating[return_tournaments['gameMode'].toLowerCase()+'_'+return_tournaments['statisticGroup']]) >= Number(return_tournaments['rating_a']) && Number(return_tournaments['rating_b']) >= Number(my_rating[return_tournaments['gameMode'].toLowerCase()+'_'+return_tournaments['statisticGroup']])
        });
    }

    if (params.gameMode.length > 0)
    {
        return_tournaments = return_tournaments.filter(function(return_tournaments)
        {
            return $.inArray(return_tournaments['gameMode'], params['gameMode']) >= 0;
        });
    }
    if (params.statisticGroup.length > 0)
    {
        return_tournaments = return_tournaments.filter(function(return_tournaments)
        {
            return $.inArray(return_tournaments['statisticGroup'], params['statisticGroup']) >= 0;
        });
    }

    if (params.cluster.length > 0)
    {
        return_tournaments = return_tournaments.filter(function(return_tournaments)
        {
            return $.inArray(return_tournaments['cluster'], params['cluster']) >= 0;
        });

    }

    if (params.statusTournament != 0)
    {
        var current_time = Math.round(new Date().getTime() / 1000);

        if(params.statusTournament == 'open')
        {
            return_tournaments = return_tournaments.filter(function(return_tournaments)
            {
                return Number(return_tournaments['dateStartReg']) < current_time && Number(return_tournaments['dateStartTournament']) > current_time
            });
        }
        else if(params.statusTournament == 'live')
        {
            return_tournaments = return_tournaments.filter(function(return_tournaments)
            {
                return Number(return_tournaments['dateStartTournament']) < current_time && Number(return_tournaments['dateEndTournament']) > current_time
            });
        }
        else if(params.statusTournament == 'past')
        {
            return_tournaments = return_tournaments.filter(function(return_tournaments)
            {
                return Number(return_tournaments['dateEndTournament']) < current_time
            });
        }
    }


    if (params.teamSize.length > 0)
    {
        return_tournaments = return_tournaments.filter(function(return_tournaments)
        {
            return $.inArray(return_tournaments['teamSize'], params['teamSize']) >= 0;

        });

    }

    if(status_tournament == "past"){
        return return_tournaments.slice(0, 4)
    }
    else{
        return return_tournaments.slice($(".card_tournament."+status_tournament).length, $(".card_tournament."+status_tournament).length + 14)
    }

}

var MD5 = function(d){result = M(V(Y(X(d),8*d.length)));return result.toLowerCase()};function M(d){for(var _,m="0123456789ABCDEF",f="",r=0;r<d.length;r++)_=d.charCodeAt(r),f+=m.charAt(_>>>4&15)+m.charAt(15&_);return f}function X(d){for(var _=Array(d.length>>2),m=0;m<_.length;m++)_[m]=0;for(m=0;m<8*d.length;m+=8)_[m>>5]|=(255&d.charCodeAt(m/8))<<m%32;return _}function V(d){for(var _="",m=0;m<32*d.length;m+=8)_+=String.fromCharCode(d[m>>5]>>>m%32&255);return _}function Y(d,_){d[_>>5]|=128<<_%32,d[14+(_+64>>>9<<4)]=_;for(var m=1732584193,f=-271733879,r=-1732584194,i=271733878,n=0;n<d.length;n+=16){var h=m,t=f,g=r,e=i;f=md5_ii(f=md5_ii(f=md5_ii(f=md5_ii(f=md5_hh(f=md5_hh(f=md5_hh(f=md5_hh(f=md5_gg(f=md5_gg(f=md5_gg(f=md5_gg(f=md5_ff(f=md5_ff(f=md5_ff(f=md5_ff(f,r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+0],7,-680876936),f,r,d[n+1],12,-389564586),m,f,d[n+2],17,606105819),i,m,d[n+3],22,-1044525330),r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+4],7,-176418897),f,r,d[n+5],12,1200080426),m,f,d[n+6],17,-1473231341),i,m,d[n+7],22,-45705983),r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+8],7,1770035416),f,r,d[n+9],12,-1958414417),m,f,d[n+10],17,-42063),i,m,d[n+11],22,-1990404162),r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+12],7,1804603682),f,r,d[n+13],12,-40341101),m,f,d[n+14],17,-1502002290),i,m,d[n+15],22,1236535329),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+1],5,-165796510),f,r,d[n+6],9,-1069501632),m,f,d[n+11],14,643717713),i,m,d[n+0],20,-373897302),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+5],5,-701558691),f,r,d[n+10],9,38016083),m,f,d[n+15],14,-660478335),i,m,d[n+4],20,-405537848),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+9],5,568446438),f,r,d[n+14],9,-1019803690),m,f,d[n+3],14,-187363961),i,m,d[n+8],20,1163531501),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+13],5,-1444681467),f,r,d[n+2],9,-51403784),m,f,d[n+7],14,1735328473),i,m,d[n+12],20,-1926607734),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+5],4,-378558),f,r,d[n+8],11,-2022574463),m,f,d[n+11],16,1839030562),i,m,d[n+14],23,-35309556),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+1],4,-1530992060),f,r,d[n+4],11,1272893353),m,f,d[n+7],16,-155497632),i,m,d[n+10],23,-1094730640),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+13],4,681279174),f,r,d[n+0],11,-358537222),m,f,d[n+3],16,-722521979),i,m,d[n+6],23,76029189),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+9],4,-640364487),f,r,d[n+12],11,-421815835),m,f,d[n+15],16,530742520),i,m,d[n+2],23,-995338651),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+0],6,-198630844),f,r,d[n+7],10,1126891415),m,f,d[n+14],15,-1416354905),i,m,d[n+5],21,-57434055),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+12],6,1700485571),f,r,d[n+3],10,-1894986606),m,f,d[n+10],15,-1051523),i,m,d[n+1],21,-2054922799),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+8],6,1873313359),f,r,d[n+15],10,-30611744),m,f,d[n+6],15,-1560198380),i,m,d[n+13],21,1309151649),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+4],6,-145523070),f,r,d[n+11],10,-1120210379),m,f,d[n+2],15,718787259),i,m,d[n+9],21,-343485551),m=safe_add(m,h),f=safe_add(f,t),r=safe_add(r,g),i=safe_add(i,e)}return Array(m,f,r,i)}function md5_cmn(d,_,m,f,r,i){return safe_add(bit_rol(safe_add(safe_add(_,d),safe_add(f,i)),r),m)}function md5_ff(d,_,m,f,r,i,n){return md5_cmn(_&m|~_&f,d,_,r,i,n)}function md5_gg(d,_,m,f,r,i,n){return md5_cmn(_&f|m&~f,d,_,r,i,n)}function md5_hh(d,_,m,f,r,i,n){return md5_cmn(_^m^f,d,_,r,i,n)}function md5_ii(d,_,m,f,r,i,n){return md5_cmn(m^(_|~f),d,_,r,i,n)}function safe_add(d,_){var m=(65535&d)+(65535&_);return(d>>16)+(_>>16)+(m>>16)<<16|65535&m}function bit_rol(d,_){return d<<_|d>>>32-_}
function GetTypeTournamentShort( typeTournament, groupType ){

    if( typeTournament == 'double-elumination' && groupType == 0  )
    {return 'DE'}
    else if( typeTournament == 'single-elumination' && groupType == 0 )
    {return 'SE'}
    else if( typeTournament == 'single-elumination' && groupType == 1 )
    {return 'G1+SE'}
    else if( typeTournament == 'single-elumination' && groupType == 2 )
    {return 'G2+SE'}
    else if( typeTournament == 'double-elumination' && groupType == 1 )
    {return 'G1+DE'}
    else if( typeTournament == 'double-elumination' && groupType == 2 )
    {return 'G2+DE'}
    else if( typeTournament == 'double-elumination-league' && groupType == 3 )
    {return 'LG'}
    else if( typeTournament == 'swiss-league' && groupType == 3 )
    {return 'SLG'}
    else if( typeTournament == 'swiss' )
    {return 'SW'}
    else
        return typeTournament;

}

function GetIconTournament(tournamentID, icon_tournament){
    if(icon_tournament != null){
        return icon_tournament+'.png';
    }
    else if(icon_tournament == null){
        return MD5(tournamentID)+'.png';

    };
    return false;
}

function check_rating(rating, rating_a, rating_b, gameMode, statisticGroup){
    if( gameMode == 'SB' ){
        gameMode = 'HB';
    }

    var _table = gameMode.toLowerCase() + "_" + statisticGroup.toLowerCase();
    if(LOGIN_STATUS == 0){
        return false;
    }
    if(rating === false){
        rating = {};
        rating[_table] = 0;
    }

    if(rating != null){
        if(Number(rating[_table]) == 1000 || rating['rating']=='no_rating'){
            rating[_table] = 0;
        }
        if( Number(rating[_table]) >= Number(rating_a) && Number(rating[_table]) <= Number(rating_b) ){
            return false;
        }
        else{
            return true;
        }

    }
    else if( 0 >= Number(rating_a) && 0 <= Number(rating_b) && rating == false ){
        return false;
    }



}

function viewerBlock( action, tournamentID, statusOne, short ) {

    $('[data-tss=main_menu]').attr('class', 'btn btn-other_bottom');
    $('[id-tss='+action+'_tss]').attr('class', 'btn btn-other_bottom active');

    $('[txt-block-all=txt]').css('display', 'none');
    $('[txt-block-name='+action+']').css('display', '');
    $('[txt-block-name='+action+']').css('display', '');

    if( action == 'list_team' ){
        GetAllListTeam( tournamentID );
    }
    else if( action == 'list_team_pro' ){
        GetAllListTeamPro( tournamentID );
    }
    else if ( action == 'shedule_matches'){
        load_tournament_page(tournamentID, 'shedule_matches')
    }
    else if( action == 'all_teams' ){
        load_tournament_page(tournamentID, 'all_teams')
    }
    else if( action == 'bracket_youtube' && RENDER_BRACKET == false ){
        load_tournament_page(tournamentID, 'bracket_youtube');
        RENDER_BRACKET = true;
        $('[id-tss=info_bracket_tss]').removeAttr( "onclick" );
        $('[id-tss=info_bracket_tss]').attr("onclick", "viewerBlock( \"bracket_youtube\", " + tournamentID + ", true )");
    }
    else if( action == 'info_bracket' && statusOne == 0 ){

        if( short == 'short' ){
            $('[id-tss=info_bracket_tss]').removeAttr( "onclick" );
            $('[id-tss=info_bracket_tss]').attr("onclick", "viewerBlock( \"info_bracket\", " + tournamentID + ", 0, short )");
        }
        else {
            $('[id-tss=info_bracket_tss]').removeAttr( "onclick" );
            $('[id-tss=info_bracket_tss]').attr("onclick", "viewerBlock( \"info_bracket\", " + tournamentID + ", 0 )");
        }

    }
    else if( action == 'stats_tournaments' ){
        $('[id-tss=stats_tournaments_tss]').removeAttr( "onclick" );
        $('[id-tss=stats_tournaments_tss]').attr("onclick", "viewerBlock( \"stats_tournaments\", " + tournamentID + ", 0 )");
    }
    else if( action == 'tank' || action == 'aircraft' || action == 'ship' || action == 'mixed' ){
        viewRating( action, tournamentID );
    }

}

function viewRating( action, page ) {
    page = page === undefined ? 0 : page;
    $('#all_top_users').empty();

    // if( typeof(eval(action.toUpperCase()))[[page]] == typeof ({}) ){
    //   var a_rating = eval(action.toUpperCase()[page]);
    //   for (var type_mode in a_rating[page]['rating']){
    //       RenderAllRating( a_rating['rating'][type_mode], action, type_mode, USER_ID, USER_RATING )
    //
    //   }
    // }
    // else{
    var settings = {
        "async": true,
        "dataType":"json",
        "crossDomain": true,
        "url": "functions.php",
        "method": "POST",
        "headers": {
            "content-type": "application/x-www-form-urlencoded"
        },
        "data": {
            "action": 'rating_user',
            "type": action,
            "page": 0
        }
    };

    $.ajax( settings ).done(function ( response ) {

        if( response['status'] == 'OK' ){
            USER_ID = response['userID'];
            USER_NICK = response['nick'];
            USER_RATING = response['user_rating'];
            if( action == 'ship' ){
                SHIP[page] = response['data']
            }
            else if(action == 'aircraft'){
                AIRCRAFT[page] = response['data']
            }
            else if(action == 'tank'){
                TANK[page] = response['data'];
            }
            else if(action == 'mixed'){
                MIXED[page] = response['data']
            }

        }
        var a_rating = response['data'];
        for (var type_mode in a_rating['rating']){

            RenderAllRating( a_rating['rating'][type_mode], action, type_mode, response['userID'], response['user_rating'], response['next_page'] )
        }
    });


    //
    // }

}

function RenderAllRating( rating, action, type_mode, userID, user_rating, next_page, generate_new, page ) {

    generate_new = generate_new === undefined ? true : generate_new;
    page = page === undefined ? 0 : page;

    if (rating.length > 0 && generate_new === true){
        renderTemplate("template_user_rating", rating, function (cloned, params) {
            cloned.find("[name=need_id]").attr("id", action+"_"+type_mode );
            cloned.find("[name=header_block]").text(LANG_JS[action+"_"+type_mode]);
        }).appendTo('#all_top_users');
    }
    else if ( generate_new === true){
        // renderTemplate("template_user_rating", rating, function (cloned, params) {
        //     cloned.find("[name=need_id]").attr("id", action+"_"+type_mode );
        //     cloned.find("[name=header_param]").remove();
        //     cloned.find("[name=header_block]").text(LANG_JS[action+"_"+type_mode]+': N/D');
        // }).appendTo('#all_top_users');
    }


    var status_user_rating = false;
    for( var key in rating ) {

        renderTemplate("value_rating_user", rating[key],
            function (cloned, param) {
                if( param['userID'] == userID ){
                    cloned.find("[name=place]").attr('style', 'background-color: #a75300');
                    cloned.find("[name=rating]").attr('style', 'background-color: #a75300');
                    cloned.find("[name=nick]").attr('style', 'background-color: #a75300');
                    status_user_rating = true;
                }

                cloned.find("[name=place]").text(param['num']);
                cloned.find("[name=rating]").text( Math.floor( param[type_mode+'_'+action] ) );
                cloned.find("[name=nick]").text( param['nick'] );
                var nick = param['nick']
                cloned.find("[name=nick]").html( '<a href="'+LANG_JS.linc_player+nick+'" target="_blank">'+nick+'</a>' );
            }).appendTo('#'+action+"_"+type_mode);
    }




    // if( status_user_rating == false && user_rating[type_mode+'_'+action] !== undefined ){
    //     renderTemplate("value_rating_user", {},
    //         function (cloned, param) {
    //             cloned.find("[name=place]").attr('style', 'background-color: #a75300');
    //             cloned.find("[name=rating]").attr('style', 'background-color: #a75300');
    //             cloned.find("[name=nick]").attr('style', 'background-color: #a75300');
    //             cloned.find("[name=place]").text(user_rating[type_mode+'_'+action]['place']);
    //             cloned.find("[name=rating]").text( Math.floor( user_rating[type_mode+'_'+action]['rating'] ) );
    //             cloned.find("[name=nick]").text( USER_NICK );
    //         }).appendTo('#'+action+"_"+type_mode);
    // }

    // if( rating.length > 0 ){
    //     renderTemplate("pagination", rating, function (cloned, params) {
    //         // if( next_page == undefined){
    //         //     next_page = [];
    //         //     next_page['ab'] = true;
    //         //     next_page['rb'] = true;
    //         //     next_page['hb'] = true;
    //         // }
    //
    //         // if (next_page[type_mode] == true){
    //         //     cloned.find("[name=next_h]").removeClass("disabled");
    //         //     cloned.find("[name=next]").attr("onclick",  'get_new_page_rating('+(page+1)+', "'+action+'", "'+type_mode+'", 1)');
    //         // }
    //         // else{
    //         //     cloned.find("[name=next_h]").addClass("disabled");
    //         //     cloned.find("[name=next]").removeAttr("onclick");
    //         // }
    //         //
    //         // if( page == 0 ){
    //         //     cloned.find("[name=back]").removeAttr("onclick");
    //         //     cloned.find("[name=back_h]").addClass("disabled");
    //         // }
    //         // else{
    //         //     cloned.find("[name=back_h]").removeClass("disabled");
    //         //     cloned.find("[name=back]").attr("onclick",  'get_new_page_rating('+(page-1)+', "'+action+'", "'+type_mode+'", 1)');
    //         // }
    //         //
    //         // cloned.find("[name=number_page]").text(page+1);
    //
    //     }).appendTo('#'+action+"_"+type_mode);
    // }
    $("[tss-link=load_rating_all]").attr("onclick",  'get_new_page_rating('+(page+1)+', "'+action+'", "hb", 1);get_new_page_rating('+(page+1)+', "'+action+'", "ab", 1);get_new_page_rating('+(page+1)+', "'+action+'", "rb", 1)');

}

function get_new_page_rating(page, action, type_mode, userID){
    // $('#'+action+"_"+type_mode).empty();

    var settings = {
        "async": true,
        "dataType": "json",
        "crossDomain": true,
        "url": "functions.php",
        "method": "POST",
        "headers": {
            "content-type": "application/x-www-form-urlencoded"
        },
        "data": {
            "action": 'rating_user',
            "type": action,
            "page": page
        }
    };

    $.ajax(settings).done(function (response) {

        if (response['status'] == 'OK') {
            USER_ID = response['userID'];
            USER_RATING = response['user_rating'];
            if (action == 'ship') {
                SHIP[page] = response['data']
            }
            else if (action == 'aircraft') {
                AIRCRAFT[page] = response['data']
            }
            else if (action == 'tank') {
                TANK[page] = response['data']
            }
            else if (action == 'mixed') {
                MIXED[page] = response['data']
            }

        }
        var a_rating = response['data'];



        RenderAllRating(a_rating['rating'][type_mode], action, type_mode, response['userID'], response['user_rating'], response['next_page'], false, page)
    });
    // }

}

function load_tournament_page(tournamentId, page) {
    var local_main_param = localStorage.getItem(page+'_'+tournamentId);
    if(page=='about_info'){
        if( ABOUT_INFO == true ){
            return;
        }
    }
    if (local_main_param === undefined || local_main_param === null){
        if (page == 'all_teams'){
            var param = {
                "tournamentID": tournamentId,
                "action": "GetListAllTeam",
                "type":"pro"};}


        else {
            var param = {"action": "get_"+page, "tournamentId": tournamentId};
        }
        request_server(param, 'render_'+page, page+'_'+tournamentId)
    }
    else{
        var arrayData = $.parseJSON(local_main_param);
        var current_time = Math.round(new Date().getTime() / 1000);
        eval('render_'+page)(arrayData);
        if ( current_time > (arrayData['time_create'] + 600) && (page == "all_teams" || page != "about_info")){
            localStorage.removeItem(page+'_'+tournamentId);
            console.log("Need refresh")
        }
        else if(current_time > arrayData['time_del'])
        {
            localStorage.removeItem(page+'_'+tournamentId);

        }
    }
}

function request_server(param, name_render, name_storage){
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "functions.php",
        "method": "POST",
        "headers": {
            "content-type": "application/x-www-form-urlencoded"
        },
        "data": param
    };

    $.ajax( settings ).done(function ( response ) {

        var arrayData = $.parseJSON(response);


        arrayData['time_create'] = Math.round(new Date().getTime() / 1000);

        if(name_render == 'render_about_info')
        {
            arrayData['time_del'] = Math.round(new Date().getTime() / 1000)+1800;
        }
        else
        {
            arrayData['time_del'] = Math.round(new Date().getTime() / 1000)+600;
        }

        var serialObj = JSON.stringify(arrayData);
        set_item_local_storage(name_storage, serialObj);

        eval(name_render)(arrayData);


    });
}

function render_about_info(data){

    if (data['status'] == "OK")
    {
        $('#tournament_block').css('display', '');
        $('.loading_img').css('display', 'none');
        ABOUT_INFO = true;
        var tournaments = data['data']['tournaments'];
        var missions_tournament = data['data']['missions_tournament'];
        var all_technics = data['data']['all_technics']['list'];
        if (typeof all_technics === "undefined") {
            all_technics = [];
            for (var country in data['data']['all_technics'])
            {
                for (var tech in data['data']['all_technics'][country])
                {
                    var add_tech = data['data']['all_technics'][country][tech];
                    add_tech['country'] = country;
                    all_technics.push(add_tech);
                }
            }
            data["data"]["all_technics"]["preset"] = {"0": {"image": "6", "nameEN": "", "nameRU": ""}};
        }

        var arrHash = window.location['hash'].substring(1).split('-');

        var typeTournament = tournaments['typeTournament'];
        var groupType = tournaments['groupType'];

        if( typeTournament == 'double-elumination' && groupType == 0  ){
            if(getUrlParameter('page_load') == "bracket") {
                checkBracket("bracket", 1);
                $('[id-tss=group_block_winner]').css('display', '');
            }
            else{
                $('[name-buttom=tournament_bracket]').attr('onclick', "checkBracket('bracket', 1);$('[id-tss=group_block_winner]').css('display', '');$('.link_other_news').removeClass('active');$(this).addClass('active');$('#about_info').css('display', 'none');$('#regulation_info').css('display', 'none');$('#all_teams').css('display', 'none');$('#reg_in_teams').css('display', 'none');$('#result_tournaments').css('display', 'none');$('#bracket').css('display', '');");
            }
        }
        else if( typeTournament == 'single-elumination' && groupType == 0 ){
            if(getUrlParameter('page_load') == "bracket") {
                checkBracket("bracket", 1);
                $('[id-tss=group_block_winner]').css('display', '');
            }
            else{
                $('[name-buttom=tournament_bracket]').attr('onclick', "checkBracket('bracket', 1);$('[id-tss=group_block_winner]').css('display', '');$('.link_other_news').removeClass('active');$(this).addClass('active');$('#about_info').css('display', 'none');$('#regulation_info').css('display', 'none');$('#all_teams').css('display', 'none');$('#reg_in_teams').css('display', 'none');$('#result_tournaments').css('display', 'none');$('#bracket').css('display', '');");
            }
        }
        else if( typeTournament == 'single-elumination' && groupType > 0 ){
            if(getUrlParameter('page_load') == "bracket") {
                checkBracket('bracket', 1);
                GetNewBracketGroup(1, tournaments['tournamentID'], '');
                $('[id-tss=group_block_winner]').css('display', '');
            }
            else{
                $('[name-buttom=tournament_bracket]').attr('onclick', "checkBracket('bracket', 1);GetNewBracketGroup(1, "+tournaments['tournamentID']+", '');$('[id-tss=group_block_winner]').css('display', '');$('.link_other_news').removeClass('active');$(this).addClass('active');$('#about_info').css('display', 'none');$('#regulation_info').css('display', 'none');$('#all_teams').css('display', 'none');$('#reg_in_teams').css('display', 'none');$('#result_tournaments').css('display', 'none');$('#bracket').css('display', '');");
            }
        }
        else if( typeTournament == 'double-elumination' && groupType >0 ){
            if(getUrlParameter('page_load') == "bracket") {
                checkBracket("bracket", 1);
                GetNewBracketGroup(1, tournaments['tournamentID'], '');
                $('[id-tss=group_block_winner]').css('display', '');
            }
            else{
                $('[name-buttom=tournament_bracket]').attr('onclick', "checkBracket('bracket', 1);GetNewBracketGroup(1, "+tournaments['tournamentID']+", '');$('[id-tss=group_block_winner]').css('display', '');$('.link_other_news').removeClass('active');$(this).addClass('active');$('#about_info').css('display', 'none');$('#regulation_info').css('display', 'none');$('#all_teams').css('display', 'none');$('#reg_in_teams').css('display', 'none');$('#result_tournaments').css('display', 'none');$('#bracket').css('display', '');");
            }

        }
        else if( typeTournament == 'double-elumination-league' && groupType == 3 ){
            if(getUrlParameter('page_load') == "bracket") {
                checkBracket("bracket", 1);
                GetNewBracketGroup(1, tournaments['tournamentID'], '');
                $('[id-tss=group_block_winner]').css('display', '');
            }
            else{
                $('[name-buttom=tournament_bracket]').attr('onclick', "checkBracket('bracket', 1);GetNewBracketGroup(1, "+tournaments['tournamentID']+", '');$('[id-tss=group_block_winner]').css('display', '');$('.link_other_news').removeClass('active');$(this).addClass('active');$('#about_info').css('display', 'none');$('#regulation_info').css('display', 'none');$('#all_teams').css('display', 'none');$('#reg_in_teams').css('display', 'none');$('#result_tournaments').css('display', 'none');$('#bracket').css('display', '');");
            }
        }
        else if( typeTournament == 'swiss-league' && groupType == 3 ){
            if(getUrlParameter('page_load') == "bracket") {
                checkBracket("bracket", 1);
                checkBracket("bracket_swiss", 1);
                $('[id-tss=group_block_winner]').css('display', '');
            }
            else{
                $('[name-buttom=tournament_bracket]').attr('onclick', "checkBracket('bracket', 1);checkBracket('bracket_swiss', 1);$('[id-tss=group_block_winner]').css('display', '');$('.link_other_news').removeClass('active');$(this).addClass('active');$('#about_info').css('display', 'none');$('#regulation_info').css('display', 'none');$('#all_teams').css('display', 'none');$('#reg_in_teams').css('display', 'none');$('#result_tournaments').css('display', 'none');$('#bracket').css('display', '');");
            }
        }
        else if( typeTournament == 'swiss' ){
            if(getUrlParameter('page_load') == "bracket") {
                checkBracket("bracket_swiss", 1);
                $('[id-tss=group_block]').css('display', '');
            }
            else{
                $('[name-buttom=tournament_bracket]').attr('onclick', "checkBracket('bracket_swiss', 1);$('[id-tss=group_block]').css('display', '');$('.link_other_news').removeClass('active');$(this).addClass('active');$('#about_info').css('display', 'none');$('#regulation_info').css('display', 'none');$('#all_teams').css('display', 'none');$('#reg_in_teams').css('display', 'none');$('#result_tournaments').css('display', 'none');$('#bracket').css('display', '');");
                // $('[name-buttom=tournament_bracket]').attr('onclick', "main_menu_tournament('bracket')");
            }
        }


        if (time()+120 >= tournaments['dateStartTournament']){
            $('[name-buttom=tournament_bracket_block]').css('display', '')
        }

        $('[card-name=imageTournament]').attr('src', '//static-tss.warthunder.com/icon_tournament/'+GetIconTournament(tournaments['tournamentID'], tournaments['icon_tournament']));

        // var myShare = document.getElementById('my-share');
        // var share = Ya.share2(myShare, {
        //     content: {
        //         url: 'http://tss.warthunder.com/?action=tournament&id='+tournaments['tournamentID'],
        //         description: tournaments['name'+LANG]
        //     },
        //     theme: {
        //         counter: true
        //     }
        //     // здесь вы можете указать и другие параметры
        // });

        if(Number(USER_ID) == Number(tournaments['creator_UserID']))
        {
            CREATOR = true;
        }

        var local_main_param = localStorage.getItem('all_teams_'+tournaments['tournamentID']);
        if (local_main_param === undefined || local_main_param === null){
            request_server({"tournamentID": tournaments['tournamentID'],"action": "GetListAllTeam","type":"pro"}, "add_teams_storage", 'all_teams_'+tournaments['tournamentID']);
        }
        else
        {
            var arrayData_all_teams = $.parseJSON(local_main_param);

        }

        $("[card-name=prize_pool]").html(  tournaments['prize_pool'].replace('Golden eagles', ' <span class="sprite_main ge_off" style="margin-bottom: 4px;"></span> ')  );

        if(Number(tournaments['dateStartTournament'])+60 < time())
        {
            $("[id-tss=info_bracket_tss]").css('display', '');
        }

        if (tournaments['status'] == false || tournaments['dateEndTournament'] <= time()){
            tournaments['tornamentStatus'] = 'past';
            tournaments['tornamentStatusStyle'] = 'default';
        }
        else if (tournaments['dateStartReg'] <= time() && tournaments['dateStartTournament'] >= time()){
            tournaments['tornamentStatus'] = 'open';
            tournaments['tornamentStatusStyle'] = 'success';
        }
        else if (tournaments['dateEndTournament'] >= time() && time() >= tournaments['dateStartTournament']){
            tournaments['tornamentStatus'] = 'live';
            tournaments['tornamentStatusStyle'] = 'danger';
        }
        else{
            tournaments['tornamentStatus'] = 'undefined';
        }
        if( tournaments['gameMode'] == 'HB' ){
            tournaments['gameMode'] = 'SB';
        }
        var my_team_id = ID_MY_TEAM;
        // var local_my_team = localStorage.getItem('my_team_'+tournaments['tournamentID']);
        // if (local_my_team === undefined || local_my_team === null){
        //     var my_team_id = 0;
        // }
        // else
        // {
        //     var arrayData_my_team = $.parseJSON(local_my_team);
        //     var my_team_id = arrayData_my_team['teamID'];
        // }

        // $('[id-tss=register_new_team]').attr('onclick', "GetRegistrationTournament("+Number(tournaments['tournamentID'])+", "+tournaments['keyTournament']+")");
        if( Number(tournaments['maxTeamSize']) == 1 ){
            $('[id-tss=register_new_team]').attr( 'onclick', 'GetRegistrationTournament('+tournaments["tournamentID"]+', '+tournaments["keyTournament"]+', '+tournaments["needTicket"]+', true), createTeam()' );
        }
        else{
            $('[id-tss=register_new_team]').attr( 'onclick', 'GetRegistrationTournament('+tournaments["tournamentID"]+', '+tournaments["keyTournament"]+', '+tournaments["needTicket"]+', false)' );
        }
        if( tournaments['tornamentStatus'] == 'open' && my_team_id == 0 )
        {
            $('[id-tss=register_new_team]').css('display', '');
        }

        if(my_team_id > 0)
        {

            $('[name-buttom=my_team_button_block]').css('display', '')
            $('[name-buttom=my_team_button]').css('display', '').attr('onclick', 'render_team_page('+my_team_id+', '+tournaments["tournamentID"]+')');
            $('[name-buttom=reg_in_teams_block]').css('display', 'none')
        }

        if(Number(tournaments['dateStartTournament']) < time()+120)
        {
            if(tournaments['typeTournament'] == 'swiss')
            {
                $('[id-tss=info_bracket_tss]').attr("onclick", "viewerBlock( \"info_bracket\", " + tournaments.tournamentID + ", 0 );checkBracket( 'bracket_swiss', 1 )");
                $('[id-tss=refresh_bracket]').attr("onclick", "viewerBlock( \"info_bracket\", " + tournaments.tournamentID + ", 0 );checkBracket( 'bracket_swiss', 1 )");
            }
            else if((tournaments['typeTournament'] == "double-elumination" || tournaments['typeTournament'] == "single-elumination") && Number(tournaments['groupType']) == 0 )
            {
                $('[id-tss=info_bracket_tss]').attr("onclick", "viewerBlock( \"info_bracket\", " + tournaments.tournamentID + ", 0 );checkBracket( 'bracket', 1 )");
                $('[id-tss=refresh_bracket]').attr("onclick", "viewerBlock( \"info_bracket\", " + tournaments.tournamentID + ", 0 );checkBracket( 'bracket', 1 )");
            }
            else if((tournaments['typeTournament'] == "double-elumination" || tournaments['typeTournament'] == "single-elumination") && Number(tournaments['groupType']) > 0 )
            {
                $('[id-tss=info_bracket_tss]').attr("onclick", "viewerBlock( \"info_bracket\", " + tournaments.tournamentID + ", 0 );checkBracket( 'bracket', 1 )");
                $('[id-tss=refresh_bracket]').attr("onclick", "viewerBlock( \"info_bracket\", " + tournaments.tournamentID + ", 0 );checkBracket( 'bracket', 1 )");
                $('[id-tss=group_and_bracket]').css('display', '');
                if(true)
                {
                    $('[id-tss=btn_my_group_lang]').remove()
                }
            }
            else if (tournaments['typeTournament'] == 'swiss-league'){
                $('[id-tss=info_bracket_tss]').attr("onclick", "viewerBlock( \"info_bracket\", " + tournaments.tournamentID + ", 0 );checkBracket( 'bracket', 1 )");
                $('[id-tss=btn_bracket_menu]').attr("onclick", "viewerBlock( \"info_bracket\", " + tournaments.tournamentID + ", 0 );checkBracket( 'bracket', 1 )");
                $('[id-tss=refresh_bracket]').attr("onclick", "viewerBlock( \"info_bracket\", " + tournaments.tournamentID + ", 0 );checkBracket( 'bracket', 1 )");
                $('[id-tss=group_and_bracket]').css('display', '');
                $('[id-tss=btn_all_group_lang]').attr("onclick", "viewerBlock( \"info_bracket\", " + tournaments.tournamentID + ", 0 );checkBracket( 'bracket_swiss', 1 )");
                if(true)
                {
                    $('[id-tss=btn_my_group_lang]').remove()
                }
            }
        }

        if(isStatsTournamentPresent == true || Number(tournaments['dateEndTournament']) < time())
        {
            $('[name-buttom=stats_tournaments_tss_block]').css('display', '');
            $('[name-buttom=reg_in_teams_block]').css('display', 'none');
        }

        if (Number(tournaments['dateStartTournament']) < time()){
            $('[name-buttom=reg_in_teams_block]').css('display', 'none');
        }

        var reserve_team = Number(tournaments['maxTeamSize'])-Number(tournaments['teamSize']);
        $('#gameMod_param_tour').text(tournaments['gameMode']);
        $('#formatTeam_tour').text(tournaments['teamSize']+'(+'+reserve_team+')');
        $('#typeTournament_tour').text(GetTypeTournamentShort( tournaments['typeTournament'], tournaments['groupType'] ));
        $('#cluster_tour_h').text(tournaments['cluster']);
        $('#tour_status_label').addClass('label-'+tournaments['tornamentStatusStyle']).text(tournaments['tornamentStatus'].toUpperCase());


        $('#table_my_reward').empty();
        for (var reward in data['data']['allRewards'])
        {
            if("reward_a" in data['data']['allRewards'][reward])
            {
                var reward_li = '<div id="panelPrecios"><ul>';
                for (var reward_i in data['data']['allRewards'][reward]["reward_a"])
                {
                    var tmp_prize = data['data']['allRewards'][reward]["reward_a"][reward_i]['prize'];
                    var tmp_type = data['data']['allRewards'][reward]["reward_a"][reward_i]['type'];

                    if(tmp_type == 'decal' || tmp_type == 'camouflage' || tmp_type == 'camouflage_item')
                    {
                        reward_li = reward_li+'<li><a data-toggle="tooltip" title="<img height=\'100px\' src=\'//static-tss.warthunder.com/images/prize/'+tmp_prize.replace("/","_")+'.png\' />">'+LANG_JS[tmp_prize]+' '+LANG_JS[tmp_type+'_p']+' <span class="glyphicon glyphicon-picture" aria-hidden="true"></span></a></li>';
                    }
                    else if( tmp_type != 'gold' )
                    {
                        reward_li = reward_li+'<li>'+LANG_JS[tmp_prize]+' '+LANG_JS[tmp_type+'_p']+'</li>';
                    }
                    else
                    {
                        reward_li = reward_li+'<li>'+tmp_prize+' '+LANG_JS[tmp_type+'_p']+'</li>';
                    }
                }
                var reward_li = reward_li + '</ul></div>';
            }
            else
            {
                var reward_li = data['data']['allRewards'][reward]['reward'].slice(0, -1);
            }


            renderTemplate("rewards_tpl", reward,
                function (cloned, params) {
                    if(Number(data['data']['allRewards'][reward]['place']) == 1){
                        cloned.find("[name=reward_place]").text(LANG_JS.one_place);
                        cloned.find("[name=reward_place]").addClass("place_text_header gold");
                        cloned.find("[name=left_livery]").addClass("sprite_main first_place_left");
                        cloned.find("[name=right_livery]").addClass("sprite_main first_place_right");
                    }
                    else if(Number(data['data']['allRewards'][reward]['place']) == 2){
                        cloned.find("[name=reward_place]").text(LANG_JS.two_place);
                        cloned.find("[name=reward_place]").addClass("place_text_header silver");
                        cloned.find("[name=left_livery]").addClass("sprite_main silver_place_left");
                        cloned.find("[name=right_livery]").addClass("sprite_main silver_place_right");
                    }
                    else if(Number(data['data']['allRewards'][reward]['place']) == 3){
                        cloned.find("[name=reward_place]").text(LANG_JS.third_place);
                        cloned.find("[name=reward_place]").addClass("place_text_header bronze");
                        cloned.find("[name=left_livery]").addClass("sprite_main bronze_place_left");
                        cloned.find("[name=right_livery]").addClass("sprite_main bronze_place_right");
                    }
                    else{
                        cloned.find("[name=reward_place]").text(data['data']['allRewards'][reward]['place']+ ' ' + LANG_JS.place);
                        cloned.find("[name=reward_place]").addClass("place_text_header other");
                    }
                    cloned.find("[name=rewards_o]").html(reward_li);
                }).appendTo('#table_my_reward');
            $('#panelPrecios [data-toggle="tooltip"]').tooltip({
                animated: 'fade',
                placement: 'bottom',
                html: true
            });
        }

        $('[name_data=regulation_tournament]').html(bb_code_r(data['data']['tournaments']['regulations'+LANG]));
        $('[name_data=structure_tournament]').html(bb_code_r(data['data']['tournaments']['structure_tournament_'+LANG]));
        $('[name_data=discussions_tournament]').html(bb_code_r(data['data']['tournaments']['descriptionTournament'+LANG]));
        $('[name_data=discussions_tournament]').html(bb_code_r(data['data']['tournaments']['discussion_'+LANG]));

        var mission_type = [];
        for (var i in missions_tournament)
        {
            if( missions_tournament[i]['type_battle'] == '' )
            {
                missions_tournament[i]['type_battle'] = "tank"
            }

            if (typeof mission_type[missions_tournament[i]['type_battle']] === "undefined") {
                mission_type[missions_tournament[i]['type_battle']] = [];
            }
            mission_type[missions_tournament[i]['type_battle']].push(missions_tournament[i])

        }
        $('[name-template-param=descriptionTournament]').html(bb_code_r(tournaments['descriptionTournament'+LANG]));
        $('.name_current_page').text(tournaments['name'+LANG]);

        $('#listLocationsTournament_tour').empty();

        for (var type in mission_type){
            // $('<div class="well well-lg" style="padding:2px;margin-bottom:0;background-color: #191818;border: 1px solid transparent;"><div class="row"><div class="col-md-12 text-center">'+LANG_JS[type]+'</div></div></div>').appendTo('#listLocationsTournament_tour_'+type);
            for( var image in mission_type[type] ) {
                renderTemplate("block_maps", image,
                    function (cloned, params) {
                        cloned.find("[name=image_maps]").attr("src", "//static-tss.warthunder.com/images/locations/"+mission_type[type][image]['image']+".jpg");
                        cloned.find("[name=image_maps]").css("padding", "10px");
                        cloned.find("[name=name_maps]").text(mission_type[type][image]['name'+LANG]);

                    }).appendTo('#listLocationsTournament_tour_'+type);
            }

        }

        var presets = [];
        // var presets = data['data']['all_technics']['preset'];
        var preset_id = 0;
        for (var i in all_technics)
        {

            if (typeof all_technics[i]['preset_id'] !== "undefined") {
                all_technics[i]['preset_id'] = all_technics[i]['preset_id'];
            }
            if (typeof presets[all_technics[i]['preset_id']] === "undefined") {
                presets[all_technics[i]['preset_id']] = [];
            }
            if (typeof presets[all_technics[i]['preset_id']][all_technics[i]['country']] === "undefined") {
                presets[all_technics[i]['preset_id']][all_technics[i]['country']] = [];
            }

            presets[all_technics[i]['preset_id']][all_technics[i]['country']].push(all_technics[i])
        }

        for(var preset in presets)
        {
            all_technics = presets[preset];
            $('<div id="preset_'+preset+'"></div>').appendTo('#allTechnics_tour');
            var name_preset_lang = "";
            if (typeof data["data"]["all_technics"]["preset"][preset] !== "undefined" && data["data"]["all_technics"]["preset"][preset] != null)
            {
                if (typeof data["data"]["all_technics"]["preset"][preset]["name"+LANG] !== "undefined")
                {
                    name_preset_lang = data["data"]["all_technics"]["preset"][preset]["name"+LANG];
                }

            }


            $('<div class="well well-lg" style="padding:2px;margin-bottom:0;background-color: #191818;border: 1px solid transparent;"><div class="row"><div class="col-md-12 text-center">'+name_preset_lang+'</div></div></div>').appendTo('#preset_'+preset);

            for( var flag in all_technics ) {
                renderTemplate("tehnicks_flag", flag,
                    function (cloned, params) {
                        cloned.find("[name=image_flag]").addClass("country_"+flag);
                        cloned.find("[name=name_country]").text(flag);
                        cloned.find("[name=id_flag]").attr("id", "country_"+flag+preset);
                    }).appendTo('#preset_'+preset);
            }

            for( var flag in all_technics ) {
                for (var key_tehn in all_technics[flag]) {
                    renderTemplate("tech_mission_img", key_tehn,
                        function (cloned, params) {
                            cloned.find("[name=teh_image]").attr("src", "images/tehnics_new/" + all_technics[flag][key_tehn]['image'] + ".png");
                            cloned.find("[name=teh_text]").text(all_technics[flag][key_tehn]['name'+LANG]);
                            cloned.find("[name=teh_text_br]").text(all_technics[flag][key_tehn]['rank']);
                        }).appendTo('#country_' + flag+preset);
                }
            }
        }
        $('[card-name=dateStartTournament]').text(GetViewTime(Number(data['data']['tournaments']['dateStartTournament'])));
        $('[card-name=time_start_tournament]').text(GetViewTime(Number(data['data']['tournaments']['dateStartTournament'])));




        var time_start = data['data']['time_start'];
        $('[name=time_start_tournament]').text(GetViewTime(Number(data['data']['tournaments']['dateStartTournament'])));
        $('[name=time_final_tournament]').text(GetViewTime(Number(time_start['timeFinal'])));
        $('[card-name=time_final_tournament]').text(GetViewTime(Number(time_start['timeFinal'])));
        if(data['data']['tournaments']['typeTournament'] == 'swiss')
        {
            $('[id-tss=final_time]').css('display', 'none');
        }

        var arr = time_start['timeInviteGroup'].split(', ');
        if (arr.length > 0 && time_start['timeInviteGroup'] != '')
        {
            $('[name=group_time]').css('display', '');
            for (var time_ in arr)
            {
                renderTemplate("tournament_time_all", key_tehn,
                    function (cloned, params) {
                        cloned.find("[name=number]").text(Number(time_)+1);
                        cloned.find("[name=time_tour]").text(GetViewTime(arr[time_]));
                    }).appendTo('#time_tournament_about_group');
            }
        }

        if(tournaments['typeTournament']=='swiss')
        {
            var time_win = time_start['timeWinnerStr'].split(', ');
            all_time_bracket = unique(time_win);
            all_time_bracket.sort();
        }
        else if(tournaments['typeTournament'] == 'single-elumination')
        {
            var time_win = time_start['timeWinnerStr'].split(', ');
            all_time_bracket = unique(time_win);
            all_time_bracket.sort();
        }
        else
        {
            var time_win = time_start['timeWinnerStr'].split(', ');
            var time_los = time_start['timeLooserStr'].split(', ');
            var time_losF = time_start['timeLooserFinal'].split(', ');
            var time_losS = time_start['timeSemifinal'].split(', ');
            var all_time_bracket = time_win.concat(time_los, time_losF, time_losS);
            all_time_bracket = unique(all_time_bracket);
            all_time_bracket.sort();
        }

        $('[name=bracket_time]').css('display', '');
        for (var time_ in all_time_bracket)
        {

            renderTemplate("tournament_time_all", key_tehn,
                function (cloned, params) {
                    cloned.find("[name=number]").text(Number(time_)+1);
                    cloned.find("[name=time_tour]").text(GetViewTime(Number(all_time_bracket[time_])));
                }).appendTo('#time_tournament_about_bracket');
        }

        var reserve_team = Number(data['data']['tournaments']['maxTeamSize'])-Number(data['data']['tournaments']['teamSize']);

        if(Number(data['data']['tournaments']['dateStartTournament']) > Number(time())){
            var snum = Number(data['data']['tournaments']['dateStartTournament']) - Number(time());
            var fnum = Number(data['data']['tournaments']['dateStartTournament']) - Number(data['data']['tournaments']['dateStartReg']);
            var per = (snum/fnum)*100;
            tournaments["time_left_to_start"] = get_left_time_start(Number(data['data']['tournaments']['dateStartTournament']) - Number(time()));


            if((Number(data['data']['tournaments']['dateStartTournament']) - Number(time())) > 7200){
                $("[card-name=time_left_to_start]").text( tournaments['time_left_to_start'] ).css("color", "#CFD8DC");
                $("[card-name=progress_color]").addClass('tss_progress_color_default').css( 'width', per.toFixed(0)+"%" );
            }
            else {
                $("[card-name=time_left_to_start]").text( tournaments['time_left_to_start'] );
                $("[card-name=progress_color]").addClass('tss_progress_color_alarm').css( 'width', per.toFixed(0)+"%" );
            }
            $("[block-name=text_timer_end_reg]").css("display", "");
            $("[block-name=time_start_tournament_line]").css("display", "");
            $("[name-icon=icon_type_status_tournament]").addClass("start");
        }
        else if(Number(data['data']['tournaments']['dateEndTournament']) > Number(time())){
            var snum = Number(data['data']['tournaments']['dateEndTournament']) - Number(time());
            var fnum = Number(data['data']['tournaments']['dateEndTournament']) - Number(data['data']['tournaments']['dateStartTournament']);
            var per = (snum/fnum)*100;
            tournaments["time_left_to_start"] = get_left_time_start(Number(data['data']['tournaments']['dateEndTournament']) - Number(time()));

            if((Number(data['data']['tournaments']['dateEndTournament']) - Number(time())) > 7200){
                $("[card-name=time_left_to_start]").text( tournaments['time_left_to_start'] ).css("color", "#CFD8DC");
                $("[card-name=progress_color]").addClass('tss_progress_color_default').css( 'width', per.toFixed(0)+"%" );
            }
            else {
                $("[card-name=time_left_to_start]").text( tournaments['time_left_to_start'] );
                $("[card-name=progress_color]").addClass('tss_progress_color_alarm').css( 'width', per.toFixed(0)+"%" );
            }
            $("[block-name=text_timer_end_tournament]").css("display", "");
            $("[block-name=time_start_tournament_line]").css("display", "");
            $("[name-icon=icon_type_status_tournament]").addClass("start");
        }
        else{
            $("[block-name=text_end_tournament]").css("display", "");
            $("[name-icon=icon_type_status_tournament]").addClass("tournament_end");
            $("[block-name=date_end_tournament]").css("display", "");
            $("[block-name=dateEndTournament]").text(GetViewTime(Number(data['data']['tournaments']['dateEndTournament'])));

        }





        $("[card-name=formatTeam_tour]").text( data['data']['tournaments']['teamSize']+'x'+data['data']['tournaments']['teamSize'] + ' ' + data['data']['tournaments']['gameMode']);
        $('[card-name=reserve_team]').text(tournaments['teamSize']+'(+'+reserve_team+')');




        // $('[card-name=countTeam]').text(arrayData_all_teams['listTeamsReady'].length+"/"+get_amount_team(tournaments));

        if (typeof arrayData_all_teams !== undefined && local_main_param !== null) {
            var per = (Number(arrayData_all_teams['listTeamsReady'].length)/Number(get_amount_team(tournaments)))*100;
            var teams = arrayData_all_teams['listTeamsReady'].length+"/"+get_amount_team(tournaments)
        }
        else{
            var per = 0;
            var teams = '?'
        }


        if(Number(per) < 80){
            $("[card-name=team_left_to_start]").text(teams ).css("color", "#CFD8DC");
            $("[card-name=progress_color_team]").addClass('tss_progress_color_default').css( 'width', per.toFixed(0)+"%" );
        }
        else {
            $("[card-name=team_left_to_start]").text(teams );
            $("[card-name=progress_color_team]").addClass('tss_progress_color_alarm').css( 'width', per.toFixed(0)+"%" );
        }

        $('[card-name=typeTournament]').text(GetTypeTournamentShort( tournaments['typeTournament'], tournaments['groupType'] ));
        $('[card-name=clusterTournament]').text(tournaments['cluster']);

    }
    else
    {
        $('#access_denied_tournament').css('display', '');
        $('.loading_img').css('display', 'none');
    }







}

function add_teams_storage(data){

    var local_tournaments = localStorage.getItem('about_info_'+data['tournamentId']);
    local_tournaments = $.parseJSON(local_tournaments);

    $('[card-name=team_left_to_start]').text(data['listTeamsReady'].length+"/"+get_amount_team(local_tournaments['data']['tournaments']));
}

function get_amount_team(tournaments) {

    if( Number(tournaments['groupType']) > 0 ){

        if ( Number(tournaments['groupType']) == 2 && Number(tournaments['teamInGroup']) == 2 ) {
            tournaments['amountTeam_'] = Number(tournaments['amountTeam']);
        }
        else if ( Number(tournaments['groupType']) == 2 && Number(tournaments['teamInGroup']) > 2 ){
            tournaments['amountTeam_'] = ( Number(tournaments['amountTeam']) / 2 ) * Number(tournaments['teamInGroup']);
        }
        else if ( Number(tournaments['groupType']) == 3 ){
            tournaments['amountTeam_'] = Number(tournaments['teamInGroup']);
        }

        else{
            tournaments['amountTeam_'] = Number(tournaments['amountTeam']) * ( Number(tournaments['groupType']) * Number(tournaments['teamInGroup']) );
        }
        tournaments['amountTeam'] = tournaments['amountTeam_']
    }

    return tournaments['amountTeam'];
}


function bb_code_r(content){
    content = content.replace(/(\A|[^=\]'\"a-zA-Z0-9])((http|ftp|https|ftps|irc):\/\/[^<>\s]+)/gi, "$1<a href=$2 target=_blank>$2</a>");
    content = content.replace(/\[b\]((\s|.)+?)(\[\/b\]|\n)/gi, '<b>$1</b>');
    content = content.replace(/\[u\]((\s|.)+?)\[\/u\]/gi, '<span class="underline">$1</span>');
    content = content.replace(/\[s\]((\s|.)+?)\[\/s\]/gi, '<span class="strike">$1</span>');
    content = content.replace(/\[url=((http|ftp|https|ftps|irc):\/\/[^<>\s]+?)\]((\s|.)+?)\[\/url\]/gi, "<a href=\"$1\" target=\"_blank\">$3</a>");
    content = content.replace(/\[url\]((http|ftp|https|ftps|irc):\/\/[^<>\s]+?)\[\/url\]/gi, "<a href=\"$1\" target=\"_blank\">$1</a>");
    content = content.replace(/\n/g,"<br/>");
    content = content.replace(/\[br\]/g,"");
    content = content.replace(/\[hr\]/g,"<hr>");
    content = content.replace(/\[list\](.+?)\[\/list\]/g,"<ul>$1</ul>");
    content = content.replace(/\[\*\](.+?)\[\/\*\]/g,"<li>$1</li>");
    content = content.replace(/\[h4\](.+?)\[\/h4\]/g,"<h4>$1</h4>");
    return content;
}

function unique(arr) {
    var obj = {};

    for (var i = 0; i < arr.length; i++) {
        var str = arr[i];
        obj[str] = true;
    }

    return Object.keys(obj);
}

function navRulesTournament( id_link ) {

    $('[id_li=navRules]').removeClass('active');
    $('[id_link='+id_link+']').addClass('active');
    $('.txt_rules_tournament_1').css('display','none');
    $('[id_rules='+id_link+']').css('display', 'inline-block');

}

function GetAllListTeam( tournamentID ) {
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "functions.php",
        "method": "POST",
        "headers": {
            "content-type": "application/x-www-form-urlencoded"
        },
        "data": {
            "tournamentID": tournamentID,
            "action": "GetListAllTeam"
        }
    };


    $.ajax( settings ).done(function ( response ) {

        // $('#table_teams_tournament_page').empty();
        // $('#table_teams_tournament_page_not_confirm').empty();

        var allTeams = $.parseJSON(response);


        for (var name_block in allTeams) {
            if(name_block == 'listTeamsNotReady' || name_block == 'listTeamsReady') {
                for (var team in allTeams[name_block]) {
                    renderTemplate("card_team_tpl", allTeams[name_block][team],
                        function (cloned, params) {
                            cloned.find("[name=nameTeam]").text(params["teamName"]);
                            cloned.find("[name=nameTeamCaptain]").text(params["nickCaptain"]);
                            if(name_block == 'listTeamsReady') {
                                cloned.find("[name=left_block]").addClass('green');
                            }
                            else{
                                cloned.find("[name=left_block]").addClass('gray');
                            }
                            cloned.find("[name=open_hide_block]").attr('onclick', "show_team_tournament(" + params['idTeam'] + ", " + tournamentID + ")");

                            cloned.find("[name=teamSizeAll]").attr('teamSizeAll', 'hide_' +params["idTeam"]);
                            cloned.find("[name=minTeamSizeAllWindow]").attr('minTeamSizeAllWindow', 'hide_' +params["idTeam"]);
                            cloned.find("[name=maxTeamSizeAllWindow]").attr('maxTeamSizeAllWindow', 'hide_' +params["idTeam"]);

                            cloned.find("[name=link_team_hide_id]").attr('name-block', 'hide_' + params['idTeam']);
                            cloned.find("[name=link_team]").html('<a href="http://tss.warthunder.com/index.php?action=tournament&id='+tournamentID+'&page_load=team&team_id='+params['idTeam']+'">Link</a>');
                            cloned.find("[name=team_hide_size]").attr('name-block', 'hide_' + params['idTeam']);
                            cloned.find("[name=team_hide_size_all_users]").attr('name-block-all-users', 'hide_' + params['idTeam']);
                            cloned.find("[name=block_users]").attr('name-block', 'hide_' + params['idTeam']);
                            cloned.find("[name=open_hide_block]").attr('name-block-id', params['idTeam']);

                            cloned.find("[name=bottom_confirm_team]").attr('id_bottom', params['idTeam']);


                            cloned.find("[name=nameTeam]").attr('onclick', 'infoTeam(' + params["idTeam"] + ', ' + tournamentID + ')');
                        }).appendTo('#' + name_block);
                }
            }
        }

        // renderTemplate("templateNotConfirmHeaderTeam", '',
        //     function (cloned, params) {}).appendTo('#table_teams_tournament_page_not_confirm');

        // for( var team in allTeams['listTeamsNotReady'] ) {
        //
        //     renderTemplate("blokTemplateNotConfirmListTeam", allTeams['listTeamsNotReady'][team],
        //         function (cloned, params) {
        //             cloned.find("[name=nameTeam]").text(params["teamName"]);
        //             cloned.find("[name=nameTeamCaptain]").text(params["nickCaptain"]);
        //             cloned.find("[name=nameTeam]").attr( 'onclick', 'infoTeam('+params["idTeam"]+', '+tournamentID+')' );
        //         }).appendTo('#table_teams_tournament_page_not_confirm');
        //
        // }
    });
}

function infoTeam( teamID, tournamentID ) {

    $(".loading_img").css("display","");
    $('#descriptionTeam_hide').css( 'display', 'none' );
    $('#descriptionTeamText').css( 'display', 'none' );
    $('#my_team_info').css('display','none');
    $('#pass_join_team_window').css('display','none');
    $('#search_team').css('display','none');
    $('#table_my_teams').empty();
    $('#button_dissolution_team').css('display','none');
    $('#button_confirmed_team').css('display','none');
    $('#button_confirmed_team_revert').css('display','none');
    $('#button_live_team').css('display','none');
    $(".teamADDerror").css("display", "none");
    $(".teamADDerror").empty();

    $('#info_my_team_window').modal();

    var local_main_param = localStorage.getItem('teams_teamId_'+teamID+tournamentID);

    if (local_main_param === undefined || local_main_param === null){
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": "functions.php",
            "method": "POST",
            "headers": {
                "content-type": "application/x-www-form-urlencoded"
            },
            "data": {
                "tournamentID": tournamentID,
                "teamID": teamID,
                "action": "infoTeam"
            }
        };

        $.ajax( settings ).done(function ( response ) {
            var arrayData = $.parseJSON(response);
            var current_time = Math.round(new Date().getTime() / 1000);
            arrayData['time_create'] = current_time;
            render_window_teams(arrayData, tournamentID, teamID)
            var serialObj = JSON.stringify(arrayData);
            // localStorage.setItem('teams_teamId_'+teamID+tournamentID, serialObj);
            set_item_local_storage('teams_teamId_'+teamID+tournamentID, serialObj)
        });
    }
    else{

        var current_time = Math.round(new Date().getTime() / 1000);
        var arrayData = $.parseJSON(local_main_param);

        if ( current_time > (arrayData['time_create'] + 600) ){
            localStorage.removeItem('teams_teamId_'+teamID+tournamentID);
            console.log("Need refresh")
        }
        render_window_teams(arrayData, tournamentID, teamID)
    }



}

function GetConfarmationTournamentRevert( tournamentID, tournamentName, teamID ){

    var btn = $('.link_other_news_red');
    btn.attr('disabled', 'disabled');

    $("#modal_body_regulation_window_OK").css("display","none")
    $("#modal_body_regulation_window_ERROR").css("display","none")
    $("#modal_body_regulation_window_ERROR_txt").css("display","none")
    $("#modal_body_regulation_window_revert_OK").css("display","none")

    $.ajax({
        type:'POST',
        url:"functions.php?id="+tournamentID+"&action=confarmationTeamRevert&teamID="+teamID+"",
        cache:false,
        success:function(data){

            var arrayData = jQuery.parseJSON(data);

            if (arrayData.status == 'OK') {
                $("#modal_body_regulation_window_revert_OK").css("display","block");
                localStorage.removeItem('teams_teamId_'+teamID+tournamentID);
                render_team_page(teamID, tournamentID)

            }
            else if (arrayData.status == 'ERROR') {

                $("#modal_body_regulation_window_ERROR").css("display","block")
                $("#modal_body_regulation_window_ERROR_txt").text(arrayData.data);
            }
            btn.removeAttr('disabled');
            // myTeam( teamID, tournamentID );
        }
    });

    // $('#confarmation_window').css('z-index', '1100');
    // $('#confarmation_window').modal()

}

function GetConfarmationTournament( tournamentID, tournamentName, teamID ){

    var btn = $('.link_other_news_green');
    btn.attr('disabled', 'disabled');

    $("#modal_body_regulation_window_OK").css("display","none")
    $("#modal_body_regulation_window_ERROR").css("display","none")
    $("#modal_body_regulation_window_ERROR_txt").css("display","none")
    $("#modal_body_regulation_window_revert_OK").css("display","none")

    $.ajax({
        type:'POST',
        url:"functions.php?id="+tournamentID+"&action=confarmationTeam&teamID="+teamID+"",
        cache:false,
        success:function(data){

            var arrayData = jQuery.parseJSON(data);

            if (arrayData.status == 'OK') {
                $("#modal_body_regulation_window_OK").css("display","block")
                localStorage.removeItem('teams_teamId_'+teamID+tournamentID);
                render_team_page(teamID, tournamentID)
            }
            else if (arrayData.status == 'ERROR') {
                var id_block = Number(time());
                renderTemplate("error_block", arrayData,
                    function (cloned, params) {
                        cloned.find("[name=text_error]").text( params['data'] );
                        cloned.find("[name=id_block]").attr( 'id_block', id_block );
                    }).prependTo( '#card_team_tpl_page' );
            }
            setTimeout(function () { $('[id_block='+id_block+']').remove() }, 5000);
            btn.removeAttr('disabled');
            // myTeam( teamID, tournamentID );

            localStorage.removeItem('teams_teamId_'+(teamID)+(tournamentID));
        }

    });


    $('#confarmation_window').css('z-index', '1100')
    $('#confarmation_window').modal()


}

function disbandTeam( tournamentID, teamID ){

    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "functions.php",
        "method": "POST",
        "headers": {
            "content-type": "application/x-www-form-urlencoded"
        },
        "data": {
            "tournamentID": tournamentID,
            "action": "disbandTeam",
            "teamID": teamID,
        }
    }

    $.ajax( settings ).done(function ( response ) {
        var arrayData = $.parseJSON(response);

        if ( arrayData.status == 'OK' ){

            $('#createTeam').css('display', '')
            $('#myTeam').css('display', 'none')
            $('#my_team_info').css('display', 'none')

            $('#myTeam').css('display', 'none');
            $('#createTeam').css('display', '');
            searchTeam( tournamentID );
            $("#button_my_team_"+tournamentID).css("display","none")
            $("#button_team_join_"+tournamentID).css("display","")
            localStorage.removeItem('my_team_'+tournamentID);
            localStorage.removeItem('all_tournaments');
            localStorage.removeItem('all_teams_'+tournamentID);
            request_server({"tournamentID": tournamentID,"action": "GetListAllTeam","type":"pro"}, "add_teams_storage", 'all_teams_'+tournamentID);
            main_menu_tournament('all_teams');
            $("#status_del_team").text(LANG_JS.teamDelSuccess);
            $('[name-buttom=reg_in_teams_block]').css('display', '');
            $('[name-buttom=my_team_button_block]').css('display', 'none');

            main_menu_tournament("reg_in_teams", "")

        }

    });

}

function render_team_page(teamID, tournamentID) {
    $('#card_team_tpl_page').empty();
    $('.loading_img').css('display', '');
    $('#about_info').css('display', 'none');
    $('#regulation_info').css('display', 'none');
    $('#all_teams').css('display', 'none');
    $('#reg_in_teams').css('display', 'none');
    $('#result_tournaments').css('display', 'none');
    $('#bracket').css('display', 'none');

    $('.link_other_news').removeClass('active');
    $('[name-buttom=my_team_button]').addClass('active');
    $('#card_team_tpl_page').css('display', '');
    function render_page_team_html(arrayData, tournamentID, teamID) {
        var local_main_param = localStorage.getItem('about_info_'+tournamentID);
        if (local_main_param !== undefined && local_main_param !== null){
            var param_tournaments = $.parseJSON(local_main_param);
        }
        else{
            var param_tournaments = {'status':'ERROR'};
        }


        renderTemplate("card_team_tpl", arrayData['param_team'],
            function (cloned, params) {

                cloned.find("[name=nameTeam]").text(params["realName"]);
                cloned.find("[name=link_team_hide_id]").attr('name-block_page', 'hide_' + teamID).css('display', '');
                // cloned.find("[name=team_hide_size_all_users]").attr('name-block-all-users_page', 'hide_' + params['idTeam']).css('display', '');
                cloned.find("[name=team_hide_size]").attr('name-block_page', 'hide_' + teamID).css('display', '');
                cloned.find("[name=link_team]").text('http://tss.warthunder.com/index.php?action=tournament&id='+tournamentID+'&page_load=team&team_id='+teamID);
                if (params['descriptionTeam'] != ""){
                    cloned.find("[name=descriptionTeam]").html(params['descriptionTeam']);
                    cloned.find("[name-block=descriptionTeam]").css('display', '');
                }

                if(Number(params["confirmed"]) == 1) {
                    cloned.find("[name=left_block]").addClass('green');
                }
                else{
                    cloned.find("[name=left_block]").addClass('gray');
                }

                cloned.find("[name=nameTeamCaptain]").attr('team-html', 'team_captain');


                cloned.find("[name=teamSizeAll]").attr('teamSizeAll', 'hide_' +teamID);
                cloned.find("[name=minTeamSizeAllWindow]").attr('minTeamSizeAllWindow', 'hide_' +teamID);
                cloned.find("[name=maxTeamSizeAllWindow]").attr('maxTeamSizeAllWindow', 'hide_' +teamID);

                if (param_tournaments['status'] == 'OK'){
                    if(arrayData['param_team']['confirmed'] == "0"){
                        cloned.find("[name=team_not_confirmed]").css('display', '');

                        cloned.find("[name=minTeamSizeAllWindow]").text(param_tournaments['data']['tournaments']['minTeamSize']);
                        cloned.find("[name=maxTeamSizeAllWindow]").text(param_tournaments['data']['tournaments']['maxTeamSize']);
                    }
                    if( "1" == "1" ){
                        cloned.find("[name=team_info_reg]").css('display', '');
                        cloned.find("[name=team_info_reg_text]").text(LANG_JS.date_check_online_captain);
                    }
                }


                cloned.find("[name=open_hide_block]").attr('onclick', "show_team_tournament(" + teamID + ", " + tournamentID + ")").css('display', 'none');



                cloned.find("[name=team_hide_size_all_users]").attr('name-block-all-users_page', 'hide_' +teamID);
                cloned.find("[name=block_users]").attr('name-block_page', 'hide_' + teamID);
                cloned.find("[name=open_hide_block]").attr('name-block-id_page', teamID);

                cloned.find("[name=bottom_confirm_team]").attr('id_bottom_page', teamID);
                cloned.find("[name=id_bottom_page_revert]").attr('id_bottom_page_revert', teamID);

            }).appendTo('#card_team_tpl_page');

        $('[name-block-all-users_page=hide_'+teamID+']').empty();
        for( var users_team in arrayData['users_team'] ) {
            renderTemplate("users_team_tpl", arrayData['users_team'][users_team],
                function (cloned, params) {

                    cloned.find("[name=teamSizeAll_]").text(arrayData['users_team'].length);

                    cloned.find("[name=user_nick_in_teams]").text(params["nick"]);
                    cloned.find("[name=user_nick_rating]").text(params["pvp_ratio"]);

                    $('[teamSizeAll=hide_' +teamID+']').text(params["nick"])
                    cloned.find("[name=teamSizeAll]").attr('teamSizeAll', 'hide_' +teamID);
                    cloned.find("[name=minTeamSizeAllWindow]").attr('minTeamSizeAllWindow', 'hide_' +teamID);
                    cloned.find("[name=maxTeamSizeAllWindow]").attr('maxTeamSizeAllWindow', 'hide_' +teamID);

                    if (params["role"] == "captain"){
                        $('[team-html=team_captain]').text(params["nick"])
                    }

                    if(arrayData['param_team']['teamCaptainID'] == USER_ID){
                        cloned.find("[name=bottom_del_user]").css('display', '');
                        // $("[name=bottom_del]").attr("onClick","disbandTeam('"+tournamentID+"', '"+teamID+"', '"+params['userID']+"')").css('display', '')

                        if(Number(USER_ID) == Number(params['userID'])){
                            cloned.find("[name=bottom_del]").attr("onClick","disbandTeam('"+tournamentID+"', '"+teamID+"', '"+params['userID']+"')").css('display', '')
                        }
                        else{
                            cloned.find("[name=bottom_del]").attr("onClick","delUserTeam('"+arrayData['param_tournaments']['tournamentID']+"', '"+arrayData['param_team']['id_team']+"', '"+params['userID']+"')").css('display', '')
                        }

                        // cloned.find("[name=bottom_del]").css('display', '').attr('onclick', "disbandTeam('"+tournamentID+"', '"+teamID+"')");

                        if(arrayData['param_team']['confirmed'] == "0"){
                            $('[id_bottom_page='+teamID+']').css('display', '').attr('onclick', "GetConfarmationTournament('"+tournamentID+"', '', '"+teamID+"' )");
                        }
                        else{
                            $('[id_bottom_page_revert='+teamID+']').css('display', '').attr('onclick', "GetConfarmationTournamentRevert('"+tournamentID+"', '', '"+teamID+"' )");
                        }

                    }
                    else if(Number(params['userID']) == Number(USER_ID)){
                        cloned.find("[name=bottom_del_user]").css('display', '').attr('onclick', "liveTeam( "+tournamentID+", "+teamID+" )");
                        // $("[name=bottom_del]").attr("onClick","delUserTeam('"+arrayData['param_tournaments']['tournamentID']+"', '"+arrayData['param_team']['id_team']+"', '"+params['userID']+"')").css('display', '')
                    }
                }
            ).appendTo('[name-block-all-users_page=hide_'+teamID+']');
        }
    }


    var local_main_param = localStorage.getItem('teams_teamId_'+teamID+tournamentID);
    if (local_main_param === undefined || local_main_param === null){
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": "functions.php",
            "method": "POST",
            "headers": {
                "content-type": "application/x-www-form-urlencoded"
            },
            "data": {
                "tournamentID": tournamentID,
                "teamID": teamID,
                "action": "infoTeam"
            }
        };

        $.ajax( settings ).done(function ( response ) {
            var arrayData = $.parseJSON(response);
            var current_time = Math.round(new Date().getTime() / 1000);
            arrayData['time_create'] = current_time;
            render_page_team_html(arrayData, tournamentID, teamID)
            var serialObj = JSON.stringify(arrayData);
            // localStorage.setItem('teams_teamId_'+teamID+tournamentID, serialObj);
            set_item_local_storage('teams_teamId_'+teamID+tournamentID, serialObj)
            $('.loading_img').css('display', 'none');
        });
    }
    else{

        var current_time = Math.round(new Date().getTime() / 1000);
        var arrayData = $.parseJSON(local_main_param);

        if ( current_time > (arrayData['time_create'] + 1) ){
            localStorage.removeItem('teams_teamId_'+teamID+tournamentID);
            console.log("Need refresh")
        }
        render_page_team_html(arrayData, tournamentID, teamID)
        $('.loading_img').css('display', 'none');
    }



}

function render_window_teams(arrayData, tournamentID, teamID) {

    $('[name-block-all-users=hide_'+teamID+']').empty();

    for( var users_team in arrayData['users_team'] ) {
        renderTemplate("users_team_tpl", arrayData['users_team'][users_team],
            function (cloned, params) {
                cloned.find("[name=user_nick_in_teams]").text(params["nick"]);
                cloned.find("[name=user_nick_rating]").text(params["pvp_ratio"]);




                if(arrayData['param_team']['teamCaptainID'] == USER_ID){
                    cloned.find("[name=bottom_del_user]").css('display', '');
                    cloned.find("[name=bottom_del]").css('display', '').attr('onclick', "disbandTeam('"+tournamentID+"', '"+teamID+"')");

                    if(arrayData['param_team']['confirmed'] == "0"){
                        $('[id_bottom='+teamID+']').css('display', '').attr('onclick', "GetConfarmationTournament('"+tournamentID+"', '', '"+teamID+"' )");
                    }

                }
                else if(params['userID'] == USER_ID){
                    cloned.find("[name=bottom_del_user]").css('display', '').attr('onclick', "liveTeam( "+tournamentID+", "+teamID+" )");
                }



            }).appendTo('[name-block-all-users=hide_'+teamID+']');
    }


    var users_count_all = 0;
    if( arrayData['users_team'] != undefined ){
        users_count_all = arrayData['users_team'].length;
    }
    $('#button_join_team_window_team_pass').attr( "onClick", "joinToTeam( '" + tournamentID + "', '" + teamID + "', $('#password_current_team').val() )" );

    if( arrayData['param_team']['typeRegister'] == 'closed' ){
        $('#lock_button_join_team').css( 'display', '' );
    }
    else{
        $('#lock_button_join_team').css( 'display', 'none' );
    }


    $('#teamSizeAll').text( users_count_all );



    $('#nameTeamText').text( arrayData['param_team']['realName'] );
    if( getCookie('lang') == 'ru' ){
        $('#nameTournamentText').text( arrayData['param_tournaments']['nameRU'] );
    }
    else{
        $('#nameTournamentText').text( arrayData['param_tournaments']['nameEN'] );
    }
    $('#nameTournamentText').attr('href', '?action=tournament&id='+arrayData['param_tournaments']['tournamentID'] );
    if( arrayData['param_team']['iconTeam'] != false ){
        $('#iconTeamInfoTeam').html( '<img src="uploads/team_icon/'+arrayData['param_team']['iconTeam']+'" style="max-width:100px;">' );
    }
    else{
        $('#iconTeamInfoTeam').empty();
    }

    if( arrayData['param_team']['descriptionTeam'] !='' ){
        $('#descriptionTeam_hide').css( 'display', '' );
        $('#descriptionTeamText').css( 'display', '' );
        $('#descriptionTeamText').html( arrayData['param_team']['descriptionTeam'] );
    }
    else{
        $('#descriptionTeam_hide').css( 'display', 'none' );
    }

    $('#contactsCaptainTeamText').text( arrayData['param_team']['contactsTeamCaptain'] );
    $('#contactsCaptainTeamText').text( arrayData['param_team']['contactsTeamCaptain'] );
    $('#directLinkTeam').attr( 'value', window.location['origin'] + '/#team-' + teamID + '_' + tournamentID );

    var myTeam_status = false;
    if( users_count_all > 0 ){
        arrayData['users_team'].forEach(function (user_info) {
            if( getCookie('tss_identity_id') == user_info['userID'] ){
                myTeam_status = true;
            }
        });
    }


    if( arrayData['param_team']['confirmed'] == 0 && getCookie( 'tss_identity_id' ) > 5 && myTeam_status == false ){//FIXME авторизацию надо проверять по другому
        $('#button_join_team_window_team').css( 'display', '' );
        $('#button_join_team_window_team').attr( "onClick", "joinTeamStart( '" + arrayData['param_team']['tournamentID'] + "', '" + arrayData['param_team']['id_team'] + "', '" + arrayData['param_team']['typeRegister'] + "' )" );
    }
    else{
        $('#button_join_team_window_team').css( 'display', 'none' );
        $('#button_join_team_window_team').attr( "onClick", "joinTeamStart( 0, 0, 'closed' )" );
    }

    $('#minTeamSizeAllWindow').text( arrayData['param_tournaments']['teamSize'] );
    $('#maxTeamSizeAllWindow').text( arrayData['param_tournaments']['maxTeamSize'] );

    if ( arrayData.myRole != 'captain' ){
        $('#button_dissolution_team').css('display','none');
        $('#button_confirmed_team').css('display','none');

        if( arrayData.myRole == 'member' && arrayData['param_team']['confirmed'] != 1 ){
            $("#button_live_team").attr("onClick","liveTeam('"+arrayData['param_tournaments']['tournamentID']+"', '"+arrayData['teamID']+"' )");
            $('#button_live_team').css('display','');
        }
    }
    else if( arrayData.myRole == 'captain' ){
        $('#button_live_team').css('display','none');
        $('#button_dissolution_team').css('display','');

        if(USER_ID == arrayData.userID){
            $("#button_dissolution_team").attr("onClick","disbandTeam('"+arrayData['param_tournaments']['tournamentID']+"', '"+arrayData['param_team']['id_team']+"')")
        }
        else{
            $("#button_dissolution_team").attr("onClick","delUserTeam('"+arrayData['param_tournaments']['tournamentID']+"', '"+arrayData['param_team']['id_team']+", "+arrayData.userID+"')")
        }
        if( arrayData['users_team'].length >=  arrayData['param_tournaments']['minTeamSize'] &&
            arrayData['users_team'].length <=  arrayData['param_tournaments']['maxTeamSize'] ){
            $("#button_confirmed_team").attr("onClick","GetConfarmationTournament('"+arrayData['param_tournaments']['tournamentID']+"', '"+arrayData['param_tournaments']['tournamentName']+"', '"+arrayData['teamID']+"' )")
            $('#button_confirmed_team').css('display','');
        }
        if( arrayData.param_team.confirmed == true ){
            $('#button_confirmed_team').attr("disabled", "disabled");
            $('#button_confirmed_team').text(LANG_JS.confirmed);
            $("#button_confirmed_team").attr("onClick","GetConfarmationTournament('"+arrayData['param_tournaments']['tournamentID']+"', '"+arrayData['param_tournaments']['tournamentName']+"', '"+arrayData['teamID']+"' )")
        }
    }


    if( typeof arrayData['users_team'] != 'undefined' && arrayData['users_team'].length > 0 ) {
        arrayData['users_team'].forEach(function (user_info) {
            if( arrayData.myUserID == user_info.userID || arrayData.myRole != 'captain' ){
                var new_style = 'style="display: none"';
            }
            else{
                var new_style = '';
            }
            if( user_info.role == "captain" ){
                var icon = '<span class="glyphicon glyphicon-star"></span>'
            }
            else{
                var icon = ''
            }
            $(' <tr>\
                      <td class="text-center"><img src="//static-tss.warthunder.com/images/pilot_icon/0.png" width="50px"/></td>\
                      <td class="text-left">'+icon+' '+user_info.nick+'</td>\
                      <td class="text-center">'+user_info.pvp_ratio+'</td>\
                      <td class="text-center">\
                      <button '+new_style+' type="button" class="btn btn-danger btn-lg" style="width: auto;" onclick="delUserTeam( '+arrayData.param_tournaments.tournamentID+', '+user_info.teamID+', '+user_info.userID+' )" ><span class="glyphicon glyphicon-remove"></span></button>\
                      <button style="display: none" '+new_style+' type="button" class="btn btn-warning btn-lg" ><span class="glyphicon glyphicon-arrow-up"></span> ПОВЫСИТЬ</button>\
                      </td>\
                  </tr>').appendTo('#table_my_teams');

            if( arrayData['gm'] == true ){
                $('#button_dissolution_team').css('display','');
                $("#button_dissolution_team").attr("onClick","disbandTeam('"+arrayData['param_tournaments']['tournamentID']+"', '"+arrayData['param_team']['id_team']+"')")
            }
        });
    }


    $(".loading_img").css("display","none");
    $('#my_team_info').css('display','');

    $('#registration_window').modal('hide');
    $(".teamADDerror").css("display", "none");
    $(".teamADDerror").empty();
    $('#info_my_team_window').modal();
}


function addNewTeam( tournamentID, needKey ){

    var btn = $('.button_reg_team');
    btn.attr('disabled', 'disabled');

    // $("#teamADDerror").css("display", "none");
    // $('#teamName').blur();
    // $('#contactsTeamCaptain').blur();
    // $('#descriptionTeam').blur();

    var teamName = $('[form-block=teamName]').val();
    var contactsTeamCaptain = $('[form-block=contactsTeamCaptain]').val();
    var descriptionTeam = $('[form-block=descriptionTeam]').val();
    var passwordTeam = $('[form-block=passwordTeam]').val();

    // if( needKey == true ){
    //     $('#keyAccess').blur();
    //     var keyAccess = $('#keyAccess').val();
    // }
    // else{
    //     $("#keyAccess").attr( 'class', "input_valid" )
    // }

    if(passwordTeam == ""){
        var passwordTeamStatus = false;
        var passwordTeam = '';
    }
    else{
        var passwordTeamStatus = true;
    }
    // if( $('#passwordTeamStatus').prop('checked') == true ){
    //     var passwordTeamStatus = true;
    //     $('#passwordTeam').blur();
    //     var passwordTeam = $('#passwordTeam').val();
    // }
    // else{
    //     var passwordTeamStatus = false;
    //     var passwordTeam = '';
    //     $("#passwordTeam").attr( 'class', "input_valid" )
    // }

    if(true)
        {

        $("#create_team").css("display","none");
        $("#loading_img").css("display","");
        $(".link_team").css("display","none");

        var settings = {
            "async": true,
            "crossDomain": true,
            "url": "functions.php",
            "method": "POST",
            "headers": {
                "content-type": "application/x-www-form-urlencoded"
            },
            "data": {
                "tournamentID": tournamentID,
                "action": "addNewTeam",
                "teamName": teamName,
                "contactsTeamCaptain": contactsTeamCaptain,
                "descriptionTeam": descriptionTeam,
                "passwordTeamStatus": passwordTeamStatus,
                "passwordTeam": passwordTeam,
                "keyAccess": needKey
            }
        };

        $.ajax( settings ).done(function ( response ) {
            var arrayData = $.parseJSON(response);

            if( arrayData.status == 'OK' ) {
                $("#button_my_team_"+tournamentID).attr('onclick', 'myTeam( '+arrayData['teamID']+', '+tournamentID+' )');
                $('#info_my_team_window').css('z-index', '1070');
                $('#modal_body_registration_window').modal('hide');
                // $("#button_my_team_"+tournamentID).trigger('click');

                $("#loading_img").css("display", "none");
                $(".link_team").css("display", "");
                $("#teamADDsuccessful").css("display", "");
                // $("#createTeam").css("display", "none");
                $("#myTeam").css("display", "");
                $("#"+tournamentID).trigger('click', {'id':tournamentID});

                $("#button_my_team_"+tournamentID).css("display","");
                $("#button_team_join_"+tournamentID).css("display","none");
                // myTeam( arrayData['teamID'], tournamentID );

                $('[name-buttom=reg_in_teams_block]').css('display', 'none');
                $('[name-buttom=my_team_button_block]').css('display', '');
                $('[name-buttom=my_team_button]').attr('onclick', "$('.link_other_news').removeClass('active');$(this).addClass('active');$('#about_info').css('display', 'none');$('#regulation_info').css('display', 'none');$('#all_teams').css('display', 'none');$('#reg_in_teams').css('display', '');$('#result_tournaments').css('display', 'none');$('#bracket').css('display', 'none');render_team_page("+arrayData['teamID']+", "+tournamentID+");");

                localStorage.removeItem('all_tournaments');
                localStorage.removeItem('all_teams_'+tournamentID);
                localStorage.removeItem('my_team_'+tournamentID);
                request_server({"tournamentID": tournamentID,"action": "GetListAllTeam","type":"pro"}, "add_teams_storage", 'all_teams_'+tournamentID);
                var my_team_arr = {};
                my_team_arr['time_del'] = 86400*7;
                my_team_arr['teamID'] = arrayData['teamID'];
                var serialObj_ = JSON.stringify(my_team_arr);
                set_item_local_storage('my_team_'+tournamentID, serialObj_);
                $("#ok_reg_new_team").css("display", "");
                render_team_page(arrayData['teamID'], tournamentID)
                $("#reg_in_teams").css("display", "none");
                btn.removeAttr('disabled');
            }
            else{
                $("#error_reg_new_team").css("display", "");
                $("[block-info=error_reg_new_team]").text(arrayData.data);
                // $("#loading_img").css("display", "none");
                // $(".link_team").css("display", "");
                // $(".teamADDerror").css("display", "");
                // $(".teamADDerror").text(arrayData.data);
                // $("#create_team").css("display","");
                btn.removeAttr('disabled');
            }

        });




    }


}

function searchTeam( tournamentID ) {
    // $('#my_team_info').css('display','none');
    // $("#search_team").css("display","none");
    // $("#create_team").css("display","none");
    //
    // $('#table_teams_tournament').empty();
    //
    // $("#loading_img").css("display", "");

    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "functions.php",
        "method": "POST",
        "headers": {
            "content-type": "application/x-www-form-urlencoded"
        },
        "data": {
            "tournamentID": tournamentID,
            "action": "searchAllTeam"
        }
    }
    $('#open_teams_1').empty();
    $('#open_teams_2').empty();
    $.ajax( settings ).done(function ( response ) {
        var arrayData = $.parseJSON(response);

        var column_to_append = 1;
        var i = 0;
        for( var users_team in arrayData['listTeams'] ) {
            renderTemplate("card_team_join_tpl", arrayData['listTeams'][users_team],
                function (cloned, params) {
                    cloned.find("[name=nameTeam]").text(params["realName"]);
                    cloned.find("[name=nameTeamCaptain]").text(params["nickCaptain"]);
                    cloned.find("[name=countUsers]").text(params["usersCount"]+'/'+params["maxTeamSize"]);
                    cloned.find("[name=passwordTeamJoin]").attr('password_team_join', params["id_team"]);
                    cloned.find("[name=buttom_join_team]").attr('onclick', 'joinToTeam( '+tournamentID+', '+params["id_team"]+', "" )');
                    if(params["needPassword"] != true){
                        cloned.find("[name=passwordTeam]").css("display", 'none');
                    }

                    if (i % 2 == 0 ){
                        column_to_append = 1;
                    }
                    else{
                        column_to_append = 2;
                    }
                    i += 1;

                }).appendTo('#open_teams_'+column_to_append);
        }
        return;

        if( typeof arrayData['listTeams'] != 'undefined' ) {
            arrayData['listTeams'].forEach(function (team_info) {

                var text_button = LANG_JS['join'];

                if (arrayData['userInTournament'] == false) {
                    var style_button = 'btn-success';
                    var _onclick = 'onclick="joinTeamStart( ' + tournamentID + ', ' + team_info.id_team + ', \'' + team_info.typeRegister + '\' )"'
                }
                else {
                    if (arrayData['userInTournament']['teamID'] == team_info.id_team && arrayData['userInTournament']['role'] == 'member') {
                        var style_button = 'btn-danger';
                        var text_button = '<span class="glyphicon glyphicon-remove"></span> '+LANG_JS['leave'];
                        var _onclick = 'onclick="liveTeam( ' + tournamentID + ', ' + team_info.id_team + ' )"'
                    }
                    else if (arrayData['userInTournament']['teamID'] == team_info.id_team && arrayData['userInTournament']['role'] == 'captain') {
                        var style_button = 'btn-warning';
                        var text_button = 'РАСПУСТИТЬ';
                        var _onclick = 'onclick="disbandTeam( ' + tournamentID + ', ' + team_info.id_team + ' )"'
                    }
                    else {
                        var style_button = 'btn-success disabled';
                    }
                }

                if (team_info.typeRegister == 'closed') {
                    var glyphicon_btton = '<span class="glyphicon glyphicon-lock"></span>';
                }
                else {
                    var glyphicon_btton = '';
                }
                // team_info.contactsShort
                $(' <tr>\
                      <td>' + team_info.realName + ' </td>\
                      <td>' + team_info.contactsShort + ' <span class="glyphicon glyphicon-eye-open pull-right-line"  style="cursor: pointer" data-container="body" data-toggle="popover" data-placement="left" data-content="'+team_info.contactsTeamCaptain+'" data-original-title="" title="" ></span> </td>\
                      <td class="text-center">' + team_info.usersCount + '/' + team_info.maxTeamSize + '</td>\
                      <td><button id="button_join_team_' + team_info.id_team + '" type="button" class="btn ' + style_button + ' btn-lg" ' + _onclick + '>' + glyphicon_btton + ' ' + text_button + '</button>\
                      <button style="display: none" id="button_cancel_join_' + team_info.id_team + '" type="button" class="btn btn-success btn-lg" onclick="cancelJoinTeam(' + team_info.id_team + ')">'+LANG_JS.cancel_1+'</button></td>\
                      </tr>\
                      <tr id="reg_pass_' + team_info.id_team + '" style="display:none">\
                      <td colspan="3"><input title="" maxlength="30" id="password_' + team_info.id_team + '" class="input_1" name="password" placeholder="'+LANG_JS.password_in_team+'" type="password"></td>\
                      <td><button type="button" class="btn btn-success btn-lg" data-loading-text="LOADING..." onclick="joinToTeam( ' + tournamentID + ', ' + team_info.id_team + ', \'\' )" >'+LANG_JS.confirm_1+'</button></td>\
                      </tr>').appendTo('#table_teams_tournament');

            });
            $(document).ready(function(){
                $('[data-toggle="popover"]').popover();
            });
        }
        else{
            $('<tr><td td colspan="4">'+LANG_JS.team_not_found+'</td></tr>').appendTo('#table_teams_tournament');
        }



        $("#search_team").css("display","");
        $("#loading_img").css("display", "none");
    });

}

function joinToTeam( tournamentID, teamID, password ){
    var btn = $('.link_other_news_green');
    btn.attr('disabled', 'disabled');

    var pass;
    if( password == '' ){
        pass = $('[password_team_join='+teamID+']').val();
    }
    else{
        pass = password;
    }

    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "functions.php",
        "method": "POST",
        "headers": {
            "content-type": "application/x-www-form-urlencoded"
        },
        "data": {
            "tournamentID": tournamentID,
            "teamID": teamID,
            "password": pass,
            "action": "joinToTeam"
        }
    }

    $.ajax( settings ).done(function ( response ) {
        var arrayData = $.parseJSON(response);

        if( arrayData.status == 'ERROR' ){
            // $(".teamADDerror").css("display", "");
            // $(".teamADDerror").text(arrayData.data);
            $("#error_reg_new_team").css("display", "");
            $("[block-info=error_reg_new_team]").text(arrayData.data);
        }
        else {
            // searchTeam(tournamentID);
            localStorage.removeItem('all_tournaments');
            localStorage.removeItem('all_teams_'+tournamentID);
            localStorage.removeItem('my_team_'+tournamentID);

            var my_team_arr = {};
            my_team_arr['time_del'] = time() + (86400*14);
            my_team_arr['teamID'] = arrayData['teamID'];
            var serialObj_ = JSON.stringify(my_team_arr);
            set_item_local_storage('my_team_'+tournamentID, serialObj_);
            // myTeam( teamID, tournamentID );

            $('[name-buttom=reg_in_teams_block]').css('display', 'none');
            $('[name-buttom=my_team_button_block]').css('display', '');
            $('[name-buttom=my_team_button]').attr('onclick', "$('.link_other_news').removeClass('active');$(this).addClass('active');$('#about_info').css('display', 'none');$('#regulation_info').css('display', 'none');$('#all_teams').css('display', 'none');$('#reg_in_teams').css('display', '');$('#result_tournaments').css('display', 'none');$('#bracket').css('display', 'none');render_team_page("+arrayData['teamID']+", "+tournamentID+");")


            $("#button_my_team_"+tournamentID).css("display","")
            $("#button_team_join_"+tournamentID).css("display","none")
            request_server({"tournamentID": tournamentID,"action": "GetListAllTeam","type":"pro"}, "add_teams_storage", 'all_teams_'+tournamentID);
            render_team_page(arrayData['teamID'], tournamentID)
            $("#ok_reg_new_team").css("display", "");
        }
        btn.removeAttr('disabled');
    });

}

function GetStatsTournamentShort( tournamentID ) {

    if(LOAD_STATS_TOURNAMENT == true){
        return;
    }

    $('#linkLoadTournaments').css( 'display', 'none' );
    $(".loading_img").css("display", "");
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "functions.php",
        "method": "POST",
        "headers": {
            "content-type": "application/x-www-form-urlencoded"
        },
        "data": {
            "action":"GetStatsTournamentShort",
            "tournamentID": tournamentID
        }
    };

    $.ajax( settings ).done(function ( response ) {

        var tournamentStats = $.parseJSON(response);

        if( tournamentStats['status'] == 'OK' && tournamentStats['allUserStats'].length > 0){
            $('#stats_team_place').empty();
            $('#stats_top_users_tournament').empty();
            $('#all_stats_users_table').empty();

            for( var key in tournamentStats['readyTopTeamsTournament'] ) {
                renderTemplate("rewards_stats_tpl", tournamentStats['readyTopTeamsTournament'][key],
                    function (cloned, param) {
                        var next_step = false;
                        if(Number(tournamentStats['readyTopTeamsTournament'][key]['place']) == 1){
                            cloned.find("[name=reward_place]").text(LANG_JS.one_place);
                            cloned.find("[name=reward_place]").addClass("place_text_header gold");
                            cloned.find("[name=left_livery]").addClass("sprite_main first_place_left");
                            cloned.find("[name=right_livery]").addClass("sprite_main first_place_right");
                            next_step = true;
                        }
                        else if(Number(tournamentStats['readyTopTeamsTournament'][key]['place']) == 2){
                            cloned.find("[name=reward_place]").text(LANG_JS.two_place);
                            cloned.find("[name=reward_place]").addClass("place_text_header silver");
                            cloned.find("[name=left_livery]").addClass("sprite_main silver_place_left");
                            cloned.find("[name=right_livery]").addClass("sprite_main silver_place_right");
                            next_step = true;
                        }
                        else if(Number(tournamentStats['readyTopTeamsTournament'][key]['place']) == 3){
                            cloned.find("[name=reward_place]").text(LANG_JS.third_place);
                            cloned.find("[name=reward_place]").addClass("place_text_header bronze");
                            cloned.find("[name=left_livery]").addClass("sprite_main bronze_place_left");
                            cloned.find("[name=right_livery]").addClass("sprite_main bronze_place_right");
                            next_step = true;
                        }
                        else{
                            cloned.find("[name=reward_place]").text(tournamentStats['readyTopTeamsTournament'][key]['place']+" "+LANG_JS.place);
                            cloned.find("[name=reward_place]").addClass("place_text_header other");
                            cloned.find("[name=left_livery]").removeClass("sprite_main");
                            cloned.find("[name=right_livery]").removeClass("sprite_main");
                        }
                        cloned.find("[name=team_name]").text(param['realName']);




                    }).appendTo('#table_my_reward_stats');
            }

            for( var key in tournamentStats['topUsers'] ) {
                renderTemplate("very_player_stats_tpl", tournamentStats['topUsers'][key],
                    function (cloned, param) {
                        cloned.find("[name=stats_ico]").addClass(key);
                        cloned.find("[name=name_param]").text(LANG_JS[key]);
                        cloned.find("[name=stats_user_name]").text(tournamentStats['topUsers'][key]['nick']);
                        cloned.find("[name=stats_value]").text(tournamentStats['topUsers'][key][key]);

                    }).appendTo('#very_player_stats');
            }

            renderTemplate("header_all_stats_users", tournamentStats['topUsers'][0],
                function (cloned, params) {}).appendTo('#all_stats_users_table');
            for( var key in tournamentStats['allUserStats'] ) {
                renderTemplate("value_all_stats_users", tournamentStats['allUserStats'][key],
                    function (cloned, param) {
                        var text_tmp = '<div class="text_nick_stats_user">'+param['nick']+'</div><div class="text_team_name"><span class="sprite_main team_name_icon_off"></span> '+param['realName']+'</div>'
                        cloned.find("[name=nick]").html(text_tmp);

                        cloned.find("[name=EXP_HIT]").text(Math.round(param['EXP_HIT'] * 100) / 100);
                        cloned.find("[name=FRAG]").text(Math.round(param['FRAG'] * 100) / 100);
                        cloned.find("[name=DEATH]").text(Math.round(param['DEATH'] * 100) / 100);
                        cloned.find("[name=EXP_CAPTURE_ZONE]").text(Math.round(param['EXP_CAPTURE_ZONE'] * 100) / 100);
                        cloned.find("[name=EXP_CRITICAL_HIT]").text(Math.round(param['EXP_CRITICAL_HIT'] * 100) / 100);
                        cloned.find("[name=EXP_ASSIST]").text(Math.round(param['EXP_ASSIST'] * 100) / 100);
                    }).appendTo('#all_stats_users_table');
            }
            $('#block_all_users_stats').css('display', '');
        }
        $(".loading_img").css("display", "none");
    });
    LOAD_STATS_TOURNAMENT = true;
}

function sort(element, type) {
    var col_sort = element.innerHTML;
    var tr = element.parentNode;
    var table = tr.parentNode;
    var td, arrow, col_sort_num;

    for (var i=0; (td = tr.getElementsByTagName("td").item(i)); i++) {
        if (td.innerHTML == col_sort) {
            col_sort_num = i;
            if (td.prevsort == "y"){
                arrow = td.firstChild;
                element.up = Number(!element.up);
            }else{
                td.prevsort = "y";
                // arrow = td.insertBefore(document.createElement("span"),td.firstChild);
                arrow = td.firstChild;
                element.up = 0;
            }
            arrow.innerHTML = element.up?"<span class=\"glyphicon glyphicon-arrow-up\"></span> ":"<span class=\"glyphicon glyphicon-arrow-down\"></span> ";
        }else{
            if (td.prevsort == "y"){
                td.prevsort = "n";
                var theSpan = document.createElement('span');
                var theSpanDefault = document.createElement('span');
                theSpanDefault.setAttribute('class', 'glyphicon glyphicon-sort');
                theSpan.appendChild( theSpanDefault )
                if (td.firstChild) td.replaceChild( theSpan ,td.firstChild);
            }
        }
    }

    var a = new Array();

    for(i=1; i < table.rows.length; i++) {
        a[i-1] = new Array();
        a[i-1][0]=table.rows[i].getElementsByTagName("td").item(col_sort_num).innerHTML;
        a[i-1][1]=table.rows[i];
    }

    if( type == 'float' ){
        a.sort(function(a,b) {
            return Number(a[0]) - Number(b[0]);
        });
    }
    else{
        a.sort();
    }
    if(element.up) a.reverse();

    for(i=0; i < a.length; i++)
        table.appendChild(a[i][1]);
}


function checkBracket( action, statusOne, short ) {
    $('#btn_group').attr('class','');
    $('#btn_bracket').attr('class','');
    $('#btn_my_group').attr('class','');
    if( action == 'bracket' || action == 'bracket_youtube' ){
        if( statusOne != 0 ){
            GetBracket( TOURNAMENT_ID, short );
            $('#btn_bracket').attr('onclick', 'checkBracket( \'bracket\', 0, \''+short+'\' )');
        }
        $('[id-tss=refresh_bracket]').attr('onclick','viewerBlock( "info_bracket", 1813, 0 );checkBracket( "bracket", 1 )');
        $('#GetNewBracketGroupButton').attr('onclick', 'GetBracket( '+TOURNAMENT_ID+', \''+short+'\' )');
        $('#btn_group').attr('class','btn btn-default button_border');
        $('#btn_bracket').attr('class','btn btn-default button_border active');
        $('#btn_my_group').attr('class','btn btn-default button_border');

        $('#group_bracket_block').css('display','none');
        $('#tournament_bracket_block').css('display','');
        $('#my_group_block').css('display','none');
    }
    else if( action == 'group' ){
        if( statusOne != 0 ){
            GetNewBracketGroup( ID_GROUP, TOURNAMENT_ID, short );
            $('#btn_group').attr('onclick', 'checkBracket( \"group\", 0 )');
            $('#btn_my_group').attr('onclick', 'checkBracket( \"my_group\", 0 )');
        }
        $('#GetNewBracketGroupButton').attr('onclick', 'GetNewBracketGroup( '+ID_GROUP+', '+TOURNAMENT_ID+', \''+short+'\' )');
        $('#btn_group').attr('class','btn btn-default button_border active');
        $('#btn_bracket').attr('class','btn btn-default button_border');
        $('#btn_my_group').attr('class','btn btn-default button_border');

        $('#group_bracket_block').css('display','');
        $('#my_group_block').css('display','none');
        $('#tournament_bracket_block').css('display','none');
    }
    else if( action == 'my_group' ){
        if( statusOne != 0 ){
            GetNewBracketGroup( ID_GROUP, TOURNAMENT_ID, short );
            $('#btn_group').attr('onclick', 'checkBracket( \"group\", 0 )');
            $('#btn_my_group').attr('onclick', 'checkBracket( \"my_group\", 0 )');
        }
        $('#GetNewBracketGroupButton').attr('onclick', 'GetNewBracketGroup( '+ID_GROUP+', '+TOURNAMENT_ID+', \''+short+'\' )');
        $('#btn_group').attr('class','btn btn-default button_border');
        $('#btn_bracket').attr('class','btn btn-default button_border');
        $('#btn_my_group').attr('class','btn btn-default button_border active');

        $('#group_bracket_block').css('display','none');
        $('#my_group_block').css('display','');
        $('#tournament_bracket_block').css('display','none');
    }
    else if (action == 'bracket_swiss'){
        $(".loading_img").css("display", "");
        GetNewBracketSwiss( 1, TOURNAMENT_ID, 'short' );
        $('[id-tss=refresh_bracket]').attr('onclick','viewerBlock( "info_bracket", 1813, 0 );checkBracket( "bracket_swiss", 1 )');
        $('#btn_group').attr('onclick', 'checkBracket( \"bracket_swiss\", 0 )');
        $('#btn_my_group').attr('onclick', 'checkBracket( \"bracket_swiss\", 0 )');
        $('#GetNewBracketGroupButton').attr('onclick', 'GetNewBracketSwiss( '+ID_GROUP+', '+TOURNAMENT_ID+', \''+short+'\' )');
        $('#btn_group').attr('class','btn btn-default button_border active');
        $('#btn_my_group').attr('class','btn btn-default button_border active');
        $('#btn_bracket').attr('class','btn btn-default button_border');

        $('#group_bracket_block').css('display','');
        $('#my_group_block').css('display','none');
        $('#tournament_bracket_block').css('display','none');
    }
}

function GetBracket( tournamentID, short ){

    $('#GetNewBracketGroupButton').css('display', 'none');
    $('.div_opacity').css('opacity', '0.1');

    var action = 'GetArrayBracketData';
    if( short == 'short' ){
        action = 'GetArrayBracketDataShort';
    }

    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "functions.php",
        "method": "POST",
        "headers": {
            "content-type": "application/x-www-form-urlencoded"
        },
        "data": {
            "tournamentID": tournamentID,
            "action": action
        }
    };

    $.ajax( settings ).done(function ( response ) {
        var status = $.parseJSON(response)
        // GROUP = status['data'];
        BRACKET = status['data'];
        if ( status['status'] == 'OK' ){
            if(BRACKET['bracket']['loser']['Looser'] != null){
                $('[menu-tss=group_block_loser_h]').css('display', '');
            }
            if(BRACKET['bracket']['winner']['Winner'] != null){
                GetArrayBracketData( tournamentID, BRACKET['bracket'], BRACKET['countRoundWinner'], BRACKET['countRoundLooser'], status['creator'] );
                $('#GetNewBracketGroupButton').css('display', '');
                $('.div_opacity').css('opacity', '1');
                $('[menu-tss=group_block_winner_h]').css('display', '').addClass('active');
                $('[menu-tss=group_block_winner]').addClass('active');
            }


        }
        else if ( status['status'] == 'NotBracket' ){
            // var html_add = '<div class="alert alert-warning" style="background-color: #1d1e1f">\
            //             <h4><span class="glyphicon glyphicon-info-sign" style="color: brown;"></span> <strong>'+LANG_JS.too_large_bracket+'</strong></h4>\
            //           </div>';
            // $('#tournament_bracket_block_ID').html(html_add);
            // $('#GetNewBracketGroupButton').css('display', '');
            // $('.div_opacity').css('opacity', '1');
            // $('#load_img_bracket').remove();
            $('[menu-tss=group_block_loser]').css('display', 'none');
        }

        if( ID_MY_TEAM > 0 ){
            $("[data-resultid="+ID_MY_TEAM+"]").removeClass();
            $("[data-resultid="+ID_MY_TEAM+"]").addClass('my_team_container');
        }

    });

}

function GetArrayBracketData( tournamentID, bracket, countRoundWinner, countRoundLooser, creator ) {

    $('#tournament_bracket_block_ID').empty();
    $('#tournament_bracket_block_ID_body').empty();
    $('#tournament_bracket_block_ID_loser').empty();
    $('#tournament_bracket_block_ID_body_loser').empty();

    RenderBracket( JSON.parse(JSON.stringify(bracket['winner'])), tournamentID, '', bracket, countRoundWinner, creator );
    if( bracket['loser'] != undefined && bracket['loser'] != null ){
        if( bracket['loser']['Looser'] != undefined && bracket['loser']['Looser'] != null ){

            $('#line_bracketWL').css( 'display', '' );
            RenderBracket(JSON.parse(JSON.stringify( bracket['loser'])), tournamentID, '_loser', bracket, countRoundLooser + 1, creator );
        }
    }

    $(document).ready(function(){$(".team_container").hover(function () {
        $('[data-toggle="tooltip"]').tooltip();
        $('[data-toggle="popover"]').popover();

        var className = $(this).attr("data-resultid");

        $('[data-resultid=' + className + ']').addClass("highlight");
    }, function () {
        $('.team_container').removeClass("highlight");
    });
    });

    $('#load_img_bracket').remove();
    $(document).ready(function(){
        $('[data-toggle="tooltip"]').tooltip();
    });

}

function load_next_bracket(value, tournamentID) {
    SLICE_BRACKET += value;

    GetArrayBracketData( tournamentID, BRACKET['bracket'], BRACKET['countRoundWinner'], BRACKET['countRoundLooser'], "" )
    // GetBracket( tournamentID, '' )
}

function RenderBracket( responseBracket, tournamentID, typeBracket, bracket, countRoundBefore, creator ){
    var next_step = SLICE_BRACKET;

    if (typeBracket == '_loser')
    {

        responseBracket['Looser'].push(responseBracket['LooserFinal'][0])
        responseBracket['Looser'].push(responseBracket['Semifinal'][0])

        responseBracket['Looser'] = responseBracket['Looser'].slice(next_step);

        delete responseBracket['LooserFinal'];
        delete responseBracket['Semifinal'];


        var count_bracket = (Object.keys(BRACKET['bracket']['loser']).length - 1) + BRACKET['bracket']['loser']['Looser'].length;
    }
    else{

        if(responseBracket['Winner'].length > 3){
            responseBracket['Winner'] = responseBracket['Winner'].slice(next_step);
            var count_bracket = (Object.keys(BRACKET['bracket']['winner']).length - 1) + BRACKET['bracket']['winner']['Winner'].length;
        }
        else{
            count_bracket = (Object.keys(BRACKET['bracket']['winner']).length - 1) + BRACKET['bracket']['winner']['Winner'].length;
        }

    }

    var i = 1;
    for( var typeRound in responseBracket ) {
        for( var round in responseBracket[typeRound] ) {

            if (i > 4){
                break;
            }

            renderTemplate("bracket_block_header_tpl", responseBracket[typeRound],
                function (cloned, params) {

                    if(i == 1 && SLICE_BRACKET > 0){
                        cloned.find("[name=minus_bracket]").css('display', '').attr('onclick', 'load_next_bracket(-1, '+tournamentID+')');
                    }
                    if(i == 4 && count_bracket > (4 + SLICE_BRACKET)){
                        cloned.find("[name=plus_bracket]").css('display', '').attr('onclick', 'load_next_bracket(1, '+tournamentID+')');
                    }

                    if(responseBracket[typeRound][round][0]["typeBracket"] == 'Final'){
                        cloned.find("[name=number_round_name]").text('FINAL');
                    }
                    else if(responseBracket[typeRound][round][0]["typeBracket"] == 'LooserFinal'){
                        cloned.find("[name=number_round_name]").text('Loser Final');
                    }
                    else if(responseBracket[typeRound][round][0]["typeBracket"] == 'Semifinal'){
                        cloned.find("[name=number_round_name]").text('Semifinal');
                    }

                    else{
                        cloned.find("[name=number_round_name]").text('ROUND №'+(Number(responseBracket[typeRound][round][0]["round"])+1));
                    }



                    // if( typeRound != 'Final' && typeof responseBracket[typeRound][round][0]["nameRound"] == "undefined" ){
                    //     cloned.find("[name=number_round_name]").text("ROUND "+(Number(i) + Number(countRoundBefore)));
                    // }
                    // else if( typeof responseBracket[typeRound][round][0]["nameRound"] != "undefined" ){
                    //     cloned.find("[name=number_round_name]").text(responseBracket[typeRound][round][0]["nameRound"]);
                    // }
                    // else{
                    //     cloned.find("[name=number_round_name]").text("FINAL");
                    // }

                }

            ).appendTo('#tournament_bracket_block_ID'+typeBracket);
            i = i + 1;
        }
    }



    var iNameBattle = 1;
    if( typeBracket == "" ){var symbol = "A"; var arrType = 'winner'; }
    else{var symbol = "B"; var arrType = 'loser';}


    var i_ = 1;

    $('#tournament_bracket_block_'+typeBracket).empty();

    if( typeBracket=='' ){
        var count_one_round = responseBracket['Winner'][0].length;
    }
    else{
        var count_one_round = responseBracket['Looser'][0].length;
    }
    var count_start_for = 0;

    function count_margin(stage){
        var block_2_elements = 220;
        var match_size = 90;
        return ((block_2_elements*stage)-match_size) / 2
    }

    if(typeof responseBracket['Final'] !== "undefined"){
        responseBracket['Winner'][Object.keys(responseBracket['Winner']).length] = responseBracket['Final'][0]
        delete responseBracket['Final'];
    }


    for( var typeRound in responseBracket ) {
        for( var round in responseBracket[typeRound] ) {

            if (i_ > 4){
                break;
            }

            $('<div class="col-lg-3" id="tournament_bracket_block_ID_body_'+round+typeRound+'"></div>').appendTo('#tournament_bracket_block_'+typeBracket);
            count_start_for = 0;
            for( var match in responseBracket[typeRound][round] ) {
                renderTemplate("bracket_block_match_tpl", responseBracket[typeRound][round][match],
                    function (cloned, params) {


                        if(Number(round) == 0){
                            cloned.find("[name=block_team]").css("margin-top", '20px');
                        }
                        else if(responseBracket[typeRound][round-1].length == responseBracket[typeRound][round].length && responseBracket[typeRound][round-2] != undefined){
                            if(count_start_for == 0){
                                var margin_size = count_margin(count_one_round / responseBracket[typeRound][round-2].length) + 10;
                                cloned.find("[name=block_team]").css("margin-top", margin_size+'px');
                                count_start_for += 1
                            }
                            else{
                                var margin_size = count_margin(count_one_round / responseBracket[typeRound][round-2].length) *2;
                                cloned.find("[name=block_team]").css("margin-top", margin_size+'px');
                            }
                        }
                        else if(responseBracket[typeRound][round-1].length == responseBracket[typeRound][round].length && responseBracket[typeRound][round-2] == undefined){
                            cloned.find("[name=block_team]").css("margin-top", '20px');
                        }
                        else{

                            if(count_start_for == 0){
                                var margin_size = count_margin(count_one_round / responseBracket[typeRound][round-1].length) + 10;
                                cloned.find("[name=block_team]").css("margin-top", margin_size+'px');
                                count_start_for += 1
                            }
                            else{
                                var margin_size = count_margin(count_one_round / responseBracket[typeRound][round-1].length) *2;
                                cloned.find("[name=block_team]").css("margin-top", margin_size+'px');
                            }

                        }

                        if( typeRound != 'Final' ){//? FIXME

                            responseBracket[typeRound][round][match]['nameBattle'] = symbol+iNameBattle;
                            cloned.find("[name=name_round]").text(symbol+iNameBattle);
                            iNameBattle = iNameBattle +1;
                        }
                        else{
                            cloned.find("[name=name_round]").text('Final');
                        }
                        cloned.find("[name=name_team_a]").text('Final');
                        cloned.find("[name=point_team_a]").text('Final');
                        cloned.find("[name=name_team_a]").text('Final');
                        cloned.find("[name=point_team_a]").text('Final');




                        if( params['matchResult'] == true ){
                            cloned.find("[name=statsStatusTrue]").attr("onclick", "allUserTopBattle(" + params['id'] + "," + tournamentID + ", '"+typeRound+"' )");
                            cloned.find("[name=statsStatusTrue]").css( 'display', '' );
                            cloned.find("[name=statsStatusFalse]").remove();
                        }
                        else{
                            cloned.find("[name=statsStatusTrue]").remove();
                            cloned.find("[name=statsStatusFalse]").css( 'display', '' );
                        }

                        if( CREATOR == true ){
                            cloned.find("[name=editTimeTrue]").attr("onclick", "loadEditBattle(" + params['id'] + "," + tournamentID + ", \"Winner\" )");
                            cloned.find("[name=editTimeTrue]").css( 'display', '' );
                            cloned.find("[name=editTimeFalse]").remove();
                        }
                        else{
                            cloned.find("[name=editTimeTrue]").remove();
                            cloned.find("[name=editTimeFalse]").css( 'display', '' );
                        }

                        cloned.find("[name=stage_header_replay]").attr("onclick", "viewReplays(" + tournamentID + "," + params['id'] + ", 'Winner')");
                        cloned.find("[name=stage_header_view]").attr("onclick", "matchInfo(" + tournamentID + "," + params['id'] + ", \""+params['nameBattle']+"\")");

                        var divA, divB;
                        if( params['winner'] == '' || params['winner'] == ' ' ){
                            divB = '  ';
                            divA = '  ';
                        }
                        else{
                            if( params['winner'] == params['teamA'] || ( params['teamB'] == ' ' && params['teamA'] != ' ' ) ){
                                divA = ' win ';
                                divB = ' lose ';
                            }
                            else if( params['winner'] == params['teamB'] || ( params['teamA'] == ' ' && params['teamB'] != ' ' ) ){
                                divB = ' win ';
                                divA = ' lose ';
                            }
                        }
                        cloned.find("[name=match_info]").attr( "onclick", "matchInfo( " + tournamentID + ", " + params['id'] + ", '"+typeRound+"' )" );
                        if( params['realNameA'] != '' && params['realNameA'] != ' ' ){
                            cloned.find("[name=teamAClass]").attr( "data-resultid", params["idTeamA"] );
                            cloned.find("[name=teamAClass]").attr( "onclick", "infoTeam(" + params['idTeamA'] + "," + tournamentID +")");
                            if( params['realNameA'] == params['teamA'] && params['teamA'] != '' && params['teamA'] != ' ' ){
                                params['realNameA'] = emptyNameTeam( params['teamA'], bracket )
                                cloned.find("[name=teamAClass]").attr( "data-resultid", " " );
                                cloned.find("[name=teamAClass]").attr( "onclick", "");
                                divA = ' none ';
                            }
                        }
                        else{
                            params['realNameA'] = params['teamA'];
                            divA = ' none ';
                        }

                        if( params['realNameB'] != '' && params['realNameB'] != ' ' ){
                            cloned.find("[name=teamBClass]").attr( "data-resultid", params["idTeamB"] );
                            cloned.find("[name=teamBClass]").attr( "onclick", "infoTeam(" + params['idTeamB'] + "," + tournamentID +")");
                            if( params['realNameB'] == params['teamB'] && params['teamB'] != '' && params['teamB'] != ' ' ){
                                params['realNameB'] = emptyNameTeam( params['teamB'], bracket )
                                cloned.find("[name=teamBClass]").attr( "data-resultid", " " );
                                cloned.find("[name=teamBClass]").attr( "onclick", "");
                                divB = ' none ';
                            }
                        }
                        else{
                            params['realNameB'] = params['teamB'];
                            divB = ' none ';
                        }

                        if( params['realNameA'] == '' || params['realNameB'] == '' || params['realNameA'] == ' ' || params['realNameB'] == ' ' ){
                            params['scoreA'] = "&nbsp";
                            params['scoreB'] = "&nbsp";
                        }

                        if( params['countryA'] != 0 && params['realNameA'] != "" ){
                            params['realNameA'] = '<span class="ico_flag '+params['countryA']+'"></span>'+params['realNameA'];
                        }
                        if( params['countryB'] != 0 && params['realNameB'] != "" ){
                            params['realNameB'] = '<span class="ico_flag '+params['countryB']+'"></span>'+params['realNameB'];
                        }


                        cloned.find("[name=teamAClass]").addClass(divA);
                        cloned.find("[name=teamAName]").html(params['realNameA']);
                        cloned.find("[name=teamAScore]").html(params['scoreA']);

                        cloned.find("[name=teamBClass]").addClass(divB);
                        cloned.find("[name=teamBName]").html(params['realNameB']);
                        cloned.find("[name=teamBScore]").html(params['scoreB']);
                    }
                ).appendTo('#tournament_bracket_block_ID_body_'+round+typeRound);

            }
            i_ = i_ + 1;
        }
    }
}


function GetNewBracketGroup( id_group, tournamentID, short ) {
    //$(".loading_img").css("display", "");
    $('#GetNewBracketGroupButton').css('display', 'none');
    $('.div_opacity').css('opacity', '0.1');

    var action = 'GetArrayGroupData';
    if( short == 'short' ){
        action = 'GetArrayGroupDataShort';
    }

    var settings = {
        "async": true,
        "dataType":"json",
        "crossDomain": true,
        "url": "functions.php",
        "method": "POST",
        "headers": {
            "content-type": "application/x-www-form-urlencoded"
        },
        "data": {
            "tournamentID": tournamentID,
            "action": action,
            "id_group":id_group
        }
    };

    $.ajax( settings ).done(function ( response ) {
        // var x = JSON.parse("{}");
        var bracketTimer = Date.now();
        GROUP = response.data;

        if( GROUP['GroupStage'] != null ){
            if( GROUP['GroupStage'].length > 0 ){
                updateBracketGroup( id_group, tournamentID );
                $('[menu-tss=group_block_h]').css('display', '')
                // updateBracketAllGroup( id_group );
                // $('#number_group').attr( 'value', id_group );
            }

        }

        //$(".loading_img").css("display", "none");
        // $('#GetNewBracketGroupButton').css('display', '');
        // $('.div_opacity').css('opacity', '1');
        console.error("bracketTimer: ", Date.now() - bracketTimer );
    });
}

function updateBracketGroup( id_group ){
    var id_group_txt = id_group;
    var id_group_arr = id_group - 1;
    $('#show_match_group').empty();
    $('.div_opacity').css('opacity', '0.1');

    $('[name=group_nav]').css('display', '');
    $('[name=group_table]').css('display', '');



    if( Number(id_group_arr) == 0 ){
        $('[id-tss=minus_group]').css('display', 'none');
    }
    else{
        $('[id-tss=minus_group]').css('display', '');
    }

    if( Number(id_group_arr) == (GROUP['GroupStage'].length - 1) ){
        $('[id-tss=plus_group]').css('display', 'none');
    }
    else{
        $('[id-tss=plus_group]').css('display', '');
    }

    if( id_group_arr in GROUP['GroupStage'] ){
        $('#table_group_bracket').empty();
        $('#number_group_error_message_input').empty();
        $('#number_group').removeClass('input_error');

        $('#group_id_txt').text( id_group_txt );
        $('#number_group').attr( 'value', id_group );


        $('#table_group').empty();

        GROUP['GroupStage'][id_group_arr].sort(function (a, b) {
            if (a.points > b.points) {
                return -1;
            }
            if (a.points < b.points) {
                return 1;
            }
            if( a.points == b.points ){
                if( a.frag > b.frag ){
                    return -1;
                }
                if( a.frag < b.frag ){
                    return 1;
                }
                if( a.frag == b.frag ){
                    if( a.death < b.death ){
                        return -1;
                    }
                    if( a.death > b.death ){
                        return 1;
                    }
                    if( a.death == b.death ){
                        if( a.critical > b.critical ){
                            return -1;
                        }
                        if( a.critical < b.critical ){
                            return 1;
                        }
                        if( a.critical == b.critical ){
                            if( a.assist > b.assist ){
                                return -1;
                            }
                            if( a.assist < b.assist ){
                                return 1;
                            }
                            if( a.assist == b.assist ){
                                if( a.hit > b.hit ){
                                    return -1;
                                }
                                if( a.hit < b.hit ){
                                    return 1;
                                }
                                if( a.hit == b.hit ){
                                    if( a.capture_zone > b.capture_zone ){
                                        return -1;
                                    }
                                    if( a.capture_zone < b.capture_zone ){
                                        return 1;
                                    }
                                }
                            }
                        }
                    }

                }
            }
            return 0;
        });

        for (var i_ in GROUP['GroupStage'][id_group_arr]){
            renderTemplate("group_team_bracket_tpl", GROUP['GroupStage'][id_group_arr][i_],
                function (cloned, params) {

                    var total_matches =  Number(GROUP['GroupStage'][id_group_arr][i_]['won']) + Number(GROUP['GroupStage'][id_group_arr][i_]['draw']) + Number(GROUP['GroupStage'][id_group_arr][i_]['defeats']);

                    cloned.find("[name=place]").text(Number(i_)+1);
                    cloned.find("[name=nick]").text(GROUP['GroupStage'][id_group_arr][i_]['realName']);
                    cloned.find("[name=points]").text(GROUP['GroupStage'][id_group_arr][i_]['points']);
                    cloned.find("[name=matches]").text(total_matches);

                    cloned.find("[name=win]").text(Number(GROUP['GroupStage'][id_group_arr][i_]['won']));
                    cloned.find("[name=drow]").text(Number(GROUP['GroupStage'][id_group_arr][i_]['draw']));
                    cloned.find("[name=los]").text(Number(GROUP['GroupStage'][id_group_arr][i_]['defeats']));
                }

            ).appendTo('#table_group');
        }

    }
    else{
        $('#number_group_error_message_input').text(LANG_JS.groups+' #'+id_group_txt+' '+LANG_JS.not_fount);
        $('#number_group').addClass('input_error');
    }


    $('#block_sheduler_group_battle').empty();
    if( GROUP['GroupMatch'] != null ) {
        var i = 0;
        for (var round in GROUP['GroupMatch'][id_group_arr]) {

            i = i + 1;
            var dateStart = GetViewTime(round);
            // $('<div class="block_time_header">'+LANG_JS.round+' #' + i + ' (' + dateStart + ')</div><div id="range_group_' + i + '" class="row block_time"></div>').appendTo('#show_match_group');

            for (var key in GROUP['GroupMatch'][id_group_arr][round]) {

                var pair = GROUP['GroupMatch'][id_group_arr][round][key];

                renderTemplate("group_block_match_tpl", pair,
                    function (cloned, params) {
                        cloned.find("[name=name_round]").text(LANG_JS.round + ' #'+i+ ' ('+GetViewTime(round)+ ')');
                        cloned.find("[name=teamAName]").text(pair['realNameA']);
                        cloned.find("[name=teamAScore]").text(pair['scoreA']);
                        cloned.find("[name=teamBName]").text(pair['realNameB']);
                        cloned.find("[name=teamBScore]").text(pair['scoreB']);
                        cloned.find("[name=match_info]").attr( "onclick", "matchInfo( " + TOURNAMENT_ID + ", " + pair.id + ", 'Group' )" );

                    }

                ).appendTo('#block_sheduler_group_battle');

                var style;
                if (pair.totalMatches == 0) {

                    if (pair.scoreA > pair.scoreB) {
                        style = {'teamA': 'win', 'teamB': 'lose'}
                    }
                    else if(pair.scoreB > pair.scoreA) {
                        style = {'teamA': 'lose', 'teamB': 'win'}
                    }
                    else{
                        style = {'teamA': 'lose', 'teamB': 'lose'}
                    }

                }
                else {
                    style = {'teamA': 'none', 'teamB': 'none'}
                }

                var a = '<div style="margin-bottom: 5px;" class="col-lg-3">' +
                    '<div class="stage_container container_team_big">' +
                    '<div class="stage_header">' +
                    '<div class="stage_header name"></div>' +
                    '<div class="stage_header stats"></div>';

                if( CREATOR == true ){
                    a = a + '<div class="stage_header stats"><span class="glyphicon glyphicon-edit" onclick="loadEditBattle( ' + pair.id  + ', ' + TOURNAMENT_ID + ', \'Group\' )"></span></div>'
                }
                else{
                    a = a + '<div class="stage_header stats"></span></div>'
                }
                a = a + '<div class="stage_header replay" onclick="viewReplays( ' + TOURNAMENT_ID + ', ' + pair.id + ', \'Group\' )"><span class="glyphicon glyphicon-facetime-video"></span></div>' +
                    '<div class="stage_header view" onclick="matchInfo( ' + TOURNAMENT_ID + ', ' + pair.id + ', \'Group\' )"><span class="glyphicon glyphicon-info-sign"></span></div></div>' +
                    '<div class="team_container default ' + style.teamA + '" data-resultid="' + pair.idTeamA + '" onclick="infoTeam( ' + pair.idTeamA + ', ' + TOURNAMENT_ID + ' )"><div class="team_container name">' + pair.realNameA + '</div><div class="team_container score">' + pair.scoreA + '</div></div>' +
                    '<div class="team_container default ' + style.teamB + '" data-resultid="' + pair.idTeamB + '" onclick="infoTeam( ' + pair.idTeamB + ' , ' + TOURNAMENT_ID + ' )"><div class="team_container name">' + pair.realNameB + '</div><div class="team_container score">' + pair.scoreB + '</div></div>' +
                    '</div></div>';

                $(a).appendTo('#range_group_' + i);
            }

        }
    }


    $(document).ready(function(){$(".team_container").hover(function () {
        $('[data-toggle="tooltip"]').tooltip();
        $('[data-toggle="popover"]').popover();

        var className = $(this).attr("data-resultid");

        $('[data-resultid=' + className + ']').addClass("highlight");
    }, function () {
        $('.team_container').removeClass("highlight");
    });
    });


    $('.div_opacity').css('opacity', '1')

}

function GetNewBracketSwiss( id_group, tournamentID, short ) {
    //$(".loading_img").css("display", "");
    $('#GetNewBracketGroupButton').css('display', 'none');
    $('.div_opacity').css('opacity', '0.1');

    var action = 'GetArraySwissData';

    var settings = {
        "async": true,
        "dataType":"json",
        "crossDomain": true,
        "url": "functions.php",
        "method": "POST",
        "headers": {
            "content-type": "application/x-www-form-urlencoded"
        },
        "data": {
            "tournamentID": tournamentID,
            "action": action,
            "id_group":id_group
        }
    };

    $.ajax( settings ).done(function ( response ) {
        // var x = JSON.parse("{}");
        var bracketTimer = Date.now();
        GROUP = response.data;
        if( GROUP['GroupStage'] != null ){
            updateBracketSwiss( id_group, tournamentID );

            $('#number_group').attr( 'value', id_group );
        }

        $(".loading_img").css("display", "none");
        $("#my_group_block").css("display", "");
        $("#header_group_number").css("display", "none");
        $('#GetNewBracketGroupButton').css('display', '');
        $('.div_opacity').css('opacity', '1');
        // console.error("bracketTimer: ", Date.now() - bracketTimer );
    });
}

function updateBracketSwiss( id_group, tournamentID ){
    var id_group_txt = 1;
    var id_group_arr = 0;
    $('#show_match_group').empty();
    $('.div_opacity').css('opacity', '0.1');



    if( id_group_arr in GROUP['GroupStage'] ){

        $('#table_group_bracket').empty();
        $('#number_group_error_message_input').empty();
        $('#number_group').removeClass('input_error');

        $('#group_id_txt').text( id_group_txt );
        $('#number_group').attr( 'value', id_group );

        GROUP['GroupStage'][id_group_arr].sort(function (a, b) {

            if (a.points > b.points) {
                return -1;
            }
            if (a.points < b.points) {
                return 1;
            }
            if( a.points == b.points ) {
                if (a.buchholz_points > b.buchholz_points) {
                    return -1;
                }
                if (a.buchholz_points < b.buchholz_points) {
                    return 1;
                }
                if (a.buchholz_points == b.buchholz_points) {

                    if (a.KD > b.KD) {
                        return -1;
                    }
                    if (a.KD < b.KD) {
                        return 1;
                    }
                    if (a.KD == b.KD) {
                        if (a.frag > b.frag) {
                            return -1;
                        }
                        if (a.frag < b.frag) {
                            return 1;
                        }
                        if (a.frag == b.frag) {
                            if (a.death < b.death) {
                                return -1;
                            }
                            if (a.death > b.death) {
                                return 1;
                            }
                            if (a.death == b.death) {
                                if (a.critical > b.critical) {
                                    return -1;
                                }
                                if (a.critical < b.critical) {
                                    return 1;
                                }
                                if (a.critical == b.critical) {
                                    if (a.assist > b.assist) {
                                        return -1;
                                    }
                                    if (a.assist < b.assist) {
                                        return 1;
                                    }
                                    if (a.assist == b.assist) {
                                        if (a.hit > b.hit) {
                                            return -1;
                                        }
                                        if (a.hit < b.hit) {
                                            return 1;
                                        }
                                        if (a.hit == b.hit) {
                                            if (a.capture_zone > b.capture_zone) {
                                                return -1;
                                            }
                                            if (a.capture_zone < b.capture_zone) {
                                                return 1;
                                            }
                                        }
                                    }
                                }
                            }

                        }
                    }
                }
            }
            return 0;
        });

        for (var i_ in GROUP['GroupStage'][id_group_arr]){

            renderTemplate("swiss_team_bracket_tpl", GROUP['GroupStage'][id_group_arr][i_],
                function (cloned, params) {

                    var total_matches =  Number(GROUP['GroupStage'][id_group_arr][i_]['won']) + Number(GROUP['GroupStage'][id_group_arr][i_]['draw']) + Number(GROUP['GroupStage'][id_group_arr][i_]['defeats']);

                    var kd = '0';
                    if( GROUP['GroupStage'][id_group_arr][i_]["KD"] != 0 ){
                        kd = (Math.floor(GROUP['GroupStage'][id_group_arr][i_]["KD"] * 100) / 100)
                    }
                    cloned.find("[name=place]").text(Number(i_)+1);
                    cloned.find("[name=team]").text(GROUP['GroupStage'][id_group_arr][i_]['realName']);
                    cloned.find("[name=points]").text(GROUP['GroupStage'][id_group_arr][i_]['points']);
                    cloned.find("[name=matches]").text(total_matches);
                    cloned.find("[name=buhgolts]").text(Number(GROUP['GroupStage'][id_group_arr][i_]['buchholz_points']));
                    cloned.find("[name=kd]").text(kd);
                    cloned.find("[name=victory]").text(Number(GROUP['GroupStage'][id_group_arr][i_]['won']));
                    cloned.find("[name=draws]").text(Number(GROUP['GroupStage'][id_group_arr][i_]['draw']));
                    cloned.find("[name=losses]").text(Number(GROUP['GroupStage'][id_group_arr][i_]['defeats']));
                }

            ).appendTo('#table_swiss');
        }
        $('[name=swiss_table]').css('display', '');
        var points = 0;
        var color = '#151414';
        var lis_color = ['#0a0a0a', '#171616', '#272626', '#3a3737', '#5a5757'];
        var counter = 0;
        GROUP['GroupStage'][id_group_arr].forEach(function(item, i) {
            if( item["points"] != points ){
                if( typeof lis_color[counter] !== "undefined" ){
                    color = lis_color[counter]
                    var color_tmp = lis_color[counter]

                    points = item["points"];
                    counter += 1;
                }
                else{
                    color = '#151414'
                }
            }
            if( ID_MY_TEAM == item["id_team"] ){
                color = '#292004'
            }
            var buchholz_points = "";
            var kd = "";
            if( item["buchholz_points"] != 0 ){
                buchholz_points = ' <span data-toggle="tooltip" data-placement="bottom" title="Коэффициент Бухгольца" data-original-title="Коэффициент Бухгольца">('+item["buchholz_points"]/100+')</span>'
            }

            if( item["KD"] != 0 ){
                kd = ' <span data-toggle="tooltip" data-placement="bottom" title="K/D" data-original-title="K/D">('+(Math.floor(item["KD"] * 100) / 100)+')</span>'
            }
            $('<tr style="background-color: '+color+';">\
          <td>'+(i+1)+'</td>\
          <td style="text-transform: none;" class="link_team" onclick="infoTeam( '+item["id_team"]+', '+TOURNAMENT_ID+')">'+item["realName"]+'</td>\
          <td>'+( item["won"]+item["draw"]+item["defeats"] )+'</td>\
          <td>'+item["won"]+'</td>\
          <td>'+item["draw"]+'</td>\
          <td>'+item["defeats"]+'</td>\
          <td><b>'+item["points"]+buchholz_points+'</b></td>\
          <td>'+item["frag"]+kd+'</td>\
          <td>'+item["death"]+'</td>\
        </tr>').appendTo('#table_group_bracket');

            if( ID_MY_TEAM == item["id_team"] ){
                color = color_tmp
            }
        });
    }
    else{
        $('#number_group_error_message_input').text(LANG_JS.groups+' #'+id_group_txt+' '+LANG_JS.not_fount);
        $('#number_group').addClass('input_error');
    }

    if( GROUP['GroupMatch'] != null ) {
        var i = 0;
        for (var round in GROUP['GroupMatch'][id_group_arr]) {
            i = i + 1;
            var dateStart = GetViewTime(round);
            $('<div class="block_time_header">'+LANG_JS.round+' #' + i + ' (' + dateStart + ')</div><div id="range_group_' + i + '" class="row block_time"></div>').appendTo('#show_match_group');

            for (var key in GROUP['GroupMatch'][id_group_arr][round]) {

                var pair = GROUP['GroupMatch'][id_group_arr][round][key];

                renderTemplate("group_block_match_tpl", pair,
                    function (cloned, params) {
                        cloned.find("[name=name_round]").text(LANG_JS.round + ' #'+i+ ' ('+GetViewTime(round)+ ')');
                        cloned.find("[name=teamAName]").text(pair['realNameA']);
                        cloned.find("[name=teamAScore]").text(pair['scoreA']);
                        cloned.find("[name=teamBName]").text(pair['realNameB']);
                        cloned.find("[name=teamBScore]").text(pair['scoreB']);
                        cloned.find("[name=match_info]").attr( "onclick", "matchInfo( " + TOURNAMENT_ID + ", " + pair.id + ", 'Swiss' )" );
                    }

                ).appendTo('#block_sheduler_group_battle');

                var style;
                if (pair.totalMatches == 0) {

                    if (pair.scoreA > pair.scoreB) {
                        style = {'teamA': 'win', 'teamB': 'lose'}
                    }
                    else if(pair.scoreB > pair.scoreA) {
                        style = {'teamA': 'lose', 'teamB': 'win'}
                    }
                    else{
                        style = {'teamA': 'lose', 'teamB': 'lose'}
                    }

                }
                else {
                    style = {'teamA': 'none', 'teamB': 'none'}
                }


                var a = '<div style="margin-bottom: 5px;" class="col-lg-3">' +
                    '<div class="stage_container container_team_big">' +
                    '<div class="stage_header">' +
                    '<div class="stage_header name"></div>' +
                    '<div class="stage_header stats"></div>';

                if( CREATOR == true ){
                    a = a + '<div class="stage_header stats"><span class="glyphicon glyphicon-edit" onclick="loadEditBattle( ' + pair.id  + ', ' + TOURNAMENT_ID + ', \''+pair.typeGroup+'\' )"></span></div>'
                }
                if (pair['statsStatus'] != false) {
                    a = a + '<div class="stage_header stats"><span class="glyphicon glyphicon-stats" onclick="allUserTopBattle( ' + pair.id  + ', ' + TOURNAMENT_ID + ', \''+pair.typeGroup+'\' )"></span></div>'
                }


                var class_team_a = 'team_container default ';
                var class_team_b = 'team_container default ';

                if( ID_MY_TEAM == pair.idTeamA ){
                    class_team_a = 'my_team_container highlight'
                }
                if( ID_MY_TEAM == pair.idTeamB ){
                    class_team_b = 'my_team_container highlight'
                }

                a = a + '<div class="stage_header replay" onclick="viewReplays( ' + TOURNAMENT_ID + ', ' + pair.id + ', \''+pair.typeGroup+'\' )"><span class="glyphicon glyphicon-facetime-video"></span></div>' +
                    '<div class="stage_header view" onclick="matchInfo( ' + TOURNAMENT_ID + ', ' + pair.id + ', \''+pair.typeGroup+'\'  )"><span class="glyphicon glyphicon-info-sign"></span></div></div>' +
                    '<div class=" ' + class_team_a + style.teamA + '" data-resultid="' + pair.idTeamA + '" onclick="infoTeam( ' + pair.idTeamA + ', ' + TOURNAMENT_ID + ' )"><div class="team_container name">' + pair.realNameA + '</div><div class="team_container score">' + pair.scoreA + '</div></div>' +
                    '<div class=" ' + class_team_b + style.teamB + '" data-resultid="' + pair.idTeamB + '" onclick="infoTeam( ' + pair.idTeamB + ' , ' + TOURNAMENT_ID + ' )"><div class="team_container name">' + pair.realNameB + '</div><div class="team_container score">' + pair.scoreB + '</div></div>' +
                    '</div></div>';

                $(a).appendTo('#range_group_' + i);
            }




        }
    }


    $(document).ready(function(){$(".team_container").hover(function () {
        $('[data-toggle="tooltip"]').tooltip();
        $('[data-toggle="popover"]').popover();

        var className = $(this).attr("data-resultid");

        $('[data-resultid=' + className + ']').addClass("highlight");
    }, function () {
        $('.team_container').removeClass("highlight");
    });
    });


    $('.div_opacity').css('opacity', '1')



}

function delUserTeam( tournamentID, teamID, userID ){

    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "functions.php",
        "method": "POST",
        "headers": {
            "content-type": "application/x-www-form-urlencoded"
        },
        "data": {
            "tournamentID": tournamentID,
            "action": "delUserTeam",
            "teamID": teamID,
            "userID": userID,
        }
    }

    $.ajax( settings ).done(function ( response ) {
        var arrayData = $.parseJSON(response);

        $("#button_my_team_"+tournamentID).css("display","none")
        $("#button_team_join_"+tournamentID).css("display","")
        localStorage.removeItem('my_team_'+tournamentID);
        localStorage.removeItem('all_tournaments');
        localStorage.removeItem('all_teams_'+tournamentID);

    });

}

function liveTeam( tournamentID, teamID ) {

    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "functions.php",
        "method": "POST",
        "headers": {
            "content-type": "application/x-www-form-urlencoded"
        },
        "data": {
            "tournamentID": tournamentID,
            "teamID": teamID,
            "password": '',
            "action": "liveTeam"
        }
    }

    $.ajax( settings ).done(function ( response ) {
        var arrayData = $.parseJSON(response);

        $("#button_my_team_"+tournamentID).css("display","none")
        $("#button_team_join_"+tournamentID).css("display","")

        // searchTeam(tournamentID);
        if(arrayData['status'] == "OK")
        {
            localStorage.removeItem('my_team_'+tournamentID);

            $("[name-buttom=my_team_button_block]").css("display","none")
            $("[name-buttom=reg_in_teams_block]").css("display","")
            localStorage.removeItem('my_team_'+tournamentID);
            localStorage.removeItem('all_tournaments');
            localStorage.removeItem('all_teams_'+tournamentID);
            // request_server({"tournamentID": tournamentID,"action": "GetListAllTeam","type":"pro"}, "add_teams_storage", 'all_teams_'+tournamentID);



            main_menu_tournament("reg_in_teams", "")
        }
        localStorage.removeItem('all_tournaments');
        localStorage.removeItem('all_teams_'+tournamentID);

    });
}

function GetMyTournamentsList( count, test, status_tournament ) {
    $('#linkLoadTournaments').css( 'display', 'none' );
    $('#imgLoadTournaments').css( 'display', '' );

    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "functions.php",
        "method": "POST",
        "headers": {
            "content-type": "application/x-www-form-urlencoded"
        },
        "data": {
            "countCard": count,
            "action": "GetActiveMyTournaments"
        }
    };

    $.ajax( settings ).done(function ( response ) {



        var tournaments = $.parseJSON(response);


        viewCardTournament(tournaments['data'], {}, status_tournament);

        if( tournaments['data'].length < Number(tournaments['countViewTournament']) ){
            tournaments['viewLink'] = false;
        }
        else{
            tournaments['viewLink'] = true;
        }

        if( tournaments['viewLink'] == false ){
            $('#linkLoadTournaments').css( 'display', 'none' );
        }
        else{
            $('#linkLoadTournaments').css( 'display', '' );
        }

        $('#imgLoadTournaments').css( 'display', 'none' );
    });
}

function windowTrainingRoom( tournamentID, teamID, status, preset_type ) {
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "functions.php",
        "method": "POST",
        "headers": {
            "content-type": "application/x-www-form-urlencoded"
        },
        "data": {
            "tournamentID": tournamentID,
            "teamID": teamID,
            "action": "GetArrayMissionTournamentAndTestBattle"
        }
    };

    $.ajax( settings ).done(function ( response ) {

        var answer = $.parseJSON(response);


        if( status != 'empty' ){
            $('#status_create_training_room').empty();
        }

        $('#createRoomTrainID').attr( 'onclick', 'CreateTrainingRoom( '+tournamentID+', '+teamID+', $("#mission_select_train_room").val(), $("#preset_select_train_room").val() )' );


        if( answer['status'] == 'OK' ){
            if( answer['data']['captain'] == true ){
                renderingCreateMission(answer)



                $('#create_training_room_header').css('display', '');
            }
            else{
                $('#create_training_room_header').css('display', 'none');
            }

            renderingAllMissions(answer)
        };




    });



    $('#createTrainingRoom').modal();

}
function renderingCreateMission(answer){
    $('#mission_select_train_room').empty();
    $('#preset_select_train_room').empty();
    for ( var missionID in answer['data']['allMission']){
        $( '<option value="'+missionID+'">'+answer['data']['allMission'][missionID][0]['name']+'</option>' ).appendTo('#mission_select_train_room');
    }
    if(Object.keys(answer['data']['presets_tournament']).length !== 0)
    {
        for ( var preset_id in answer['data']['presets_tournament']){
            $( '<option value="'+answer['data']['presets_tournament'][preset_id]['preset_id']+'">'+answer['data']['presets_tournament'][preset_id]['name'+LANG]+'</option>' ).appendTo('#preset_select_train_room');
        }
        $('#preset_select_train_room').css('display', '')
    }
    else
    {
        $('#preset_select_train_room').css('display', 'none')
    }

}
function renderingAllMissions(answer) {
    $('#train_all_battle').empty();
    for( var battle in answer['data']['allBattleTrain'] ) {
        renderTemplate("create_train_room_td", answer['data']['allBattleTrain'][battle],
            function (cloned, params) {

                if( params['active'] == 1 ){

                    var timeUnlock = Number(params['dateEnd']) - 3540;
                    if(timeUnlock > time())
                    {
                        cloned.find("[name-battle=button_join_room]").attr( 'onclick', 'joinRoom("'+params["battleID"]+'")' );
                        cloned.find("[name=button_join_room_train]").attr( 'disabled', true );

                        function interval_train_battle() {
                            if(timeUnlock < time())
                            {
                                $("[name=button_join_room_train]").attr('disabled', false);
                                $("[name=timer_train_battle]").text("");
                                clearTimeout(timerId);
                            }
                            else
                            {
                                $("[name=timer_train_battle]").text(timeUnlock - time());
                            }

                        }
                        var timerId = setInterval(interval_train_battle,1000);

                    }
                    else
                    {
                        cloned.find("[name-battle=button_join_room]").attr( 'onclick', 'joinRoom("'+params["battleID"]+'")' );
                    }

                }
                else{
                    cloned.find("[name-battle=button_join_room]").css( 'display', 'none' );
                }
                cloned.find("[name-battle=link_battle]").attr('value', params['url']);



            }).appendTo('#train_all_battle');

    }
}

function CreateTrainingRoom( tournamentID, teamID, idMission, preset_id ) {
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "functions.php",
        "method": "POST",
        "headers": {
            "content-type": "application/x-www-form-urlencoded"
        },
        "data": {
            "tournamentID": tournamentID,
            "teamID": teamID,
            "idMission": idMission,
            "preset_id": preset_id,
            "action": "GetResultCreateTrainingRoom"
        }
    };

    $.ajax( settings ).done(function ( response ) {

        $('#status_create_training_room').empty();

        var answer = $.parseJSON(response);

        renderTemplate("status_create_room", answer,
            function (cloned, params) {
                cloned.find("[name-create_room=type_warning]").addClass(params['type_warning']);
                cloned.find("[name-create_room=header]").text(params['header']);
                cloned.find("[name-create_room=text]").text(params['text']);
            }).appendTo('#status_create_training_room');

        if( answer['status'] == 'OK' ){
            windowTrainingRoom( tournamentID, teamID, 'empty' )
        }

    });


}

function $_GET(key) {
    var s = window.location.search;
    s = s.match(new RegExp(key + '=([^&=]+)'));
    return s ? s[1] : false;
}

function joinRoom(battleID){
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "functions.php",
        "method": "GET",
        "headers": {
            "content-type": "application/x-www-form-urlencoded"
        },
        "data": {
            "battleId": battleID,
            "action": "join_room",
            "userID": getCookie('tss_identity_id'),
            "token": getCookie('tss_identity_token')
        }
    };

    $.ajax(settings).done(function (response) {
        resultJoinInRoom( response );
    });
}
//FIXME написать правильные ошибки
function resultJoinInRoom( answer ){

    var arrayData = $.parseJSON(answer);

    $("#window_result_join_room_header").empty();
    $("#window_result_join_room_txt").empty();

    if( arrayData['status'] == 'ERROR' ){

        $('<div class="stage-name"><h1>ERROR!<h1></div>').appendTo('#window_result_join_room_header');

        if( arrayData['answer'] == 'SERVER_ERROR_PEER_NOT_EXISTS' ){//Ошибка соединения с клиентом, игра не запущена, либо не тот логин

            $('<div class="error_message_pop-up">'+LANG_JS.error_client+'</div>').appendTo('#window_result_join_room_txt');
            $('<div class="message_pop-up ">'+LANG_JS.error_client_message+'</div>').appendTo('#window_result_join_room_txt');

        }
        else{//на пока неизвестные ошибки

            $('<div class="error_message_pop-up">'+LANG_JS.error_join_room+'</div>').appendTo('#window_result_join_room_txt');
            $('<div class="message_pop-up ">'+LANG_JS.error_join_room_message+'</div>').appendTo('#window_result_join_room_txt');

        }

    }
    else{

        $('<div class="stage-name"><h1>SUCCESSFUL</h1></div>').appendTo('#window_result_join_room_header');
        $('<div class="successful_message_pop-up ">'+LANG_JS.success_join_room+'</div>').appendTo('#window_result_join_room_txt');
        $('<div class="message_pop-up ">'+LANG_JS.success_join_room_message+'</div>').appendTo('#window_result_join_room_txt');

    }

    $('#window_result_join_room').css('z-index', '20000')
    $('#window_result_join_room').modal()

}

function pad (str, max) {
    str = str.toString();
    return str.length < max ? pad("0" + str, max) : str;
}
function timeConversion(seconds) {
    var minutes = Math.floor(seconds/60);
    var hours = Math.floor(minutes/60);
    var days = Math.floor(hours/24);

    hours = hours-(days*24);
    minutes = minutes-(days*24*60)-(hours*60);
    seconds = seconds-(days*24*60*60)-(hours*60*60)-(minutes*60);
    if(days == 0){
        return pad(hours, 2) + ":" + pad(minutes, 2) + ":" + pad(seconds, 2)
    }
    return days + " day " + pad(hours, 2) + ":" + pad(minutes, 2) + ":" + pad(seconds, 2)
}


function matchInfo( tournamentID, idMatch, nameMatch ){

    $("#loading_img_infoMatchContentView").css("display", "");
    $("#infoMatchContentView").css("display", "none");
    $('#matchInfo').modal();

    $.get("functions.php?tournamentID="+tournamentID+"&idMatch="+idMatch+"&action=getInfoMatch&typeMatch="+nameMatch, {}, function(data){

        var arrayData = $.parseJSON(data);
        var dataMatch = arrayData.data;

        $("#matchInfo_Top_Info").empty();
        $("#matchInfo_battle_shedule").empty();
        $("#matchInfo_all_Team").empty();
        $("#matchInfo_all_allowed_crafts_header").css("display","none");
        $("#matchInfo_all_allowed_crafts").empty();
        $("#matchInfo_all_match_param").empty();

        $("#createTrainingRoom").attr("idMatch", idMatch);

        // if( arrayData['trainingRoom'] == true ){
        //
        //   $("#matchInfo_create_training_room").css("display","block")
        //   $("#matchInfo_create_training_bottom").css("display","block")
        //
        // }

        if( dataMatch.timeInviteMatch > 1000 ){
            $('<div class="stage-name">'+nameMatch+', Start '+GetViewTime( dataMatch.timeInviteMatch )+'</div>').appendTo('#matchInfo_Top_Info');
        }
        else{
            $('<div class="stage-name">'+nameMatch+'</div>').appendTo('#matchInfo_Top_Info');
        }

        if( dataMatch.iconTeamA != false && dataMatch.iconTeamB != false ){
            var iconTeamA = '<img src="uploads/team_icon/'+dataMatch.iconTeamA+'" style="max-width:200px;"/>';
            var iconTeamB = '<img src="uploads/team_icon/'+dataMatch.iconTeamB+'" style="max-width:200px;"/>';
        }
        else{
            var iconTeamA = '';
            var iconTeamB = '';
        }

        $('[name=teamNameA_info]').text(dataMatch.teamAName)
        $('[name=teamNameB_info]').text(dataMatch.teamBName)
        $('[name=teamACounter_block_info]').text(dataMatch.scoreA)
        $('[name=teamBCounter_block_info]').text(dataMatch.scoreB)
        //
        // if( dataMatch.teamAName != null && dataMatch.teamBName != null ){
        //
        //     $('<table width="100%">\
        //         <tbody>\
        //               <tr><td width="50%" align="center">'+iconTeamA+'</td>\
        //                     <td width="67px" rowspan="3"><img src="//static-tss.warthunder.com/images/bg-vs.png"></td>\
        //                    <td width="50%" align="center">'+iconTeamB+'</td>\
        //               </tr>\
        //               <tr><td width="50%" class="header-name-team a"><b>'+dataMatch.teamAName+'</b></td>\
        //                    <td width="50%" class="header-name-team b"><b>'+dataMatch.teamBName+'</b></td>\
        //                 </tr>\
        //                 <tr><td width="50%" class="header-name-team a"><b>'+dataMatch.scoreA+'</b></td>\
        //                    <td width="50%" class="header-name-team b"><b>'+dataMatch.scoreB+'</b></td>\
        //                 </tr>\
        //                 <tr><td width="50%"><div id="teamA_uerList"></div></td>\
        //                    <td width="67px">&nbsp</td>\
        //                    <td width="50%"><div id="teamB_uerList"></div></td>\
        //                 </tr>\
        //         </tbody></table>').appendTo('#matchInfo_all_Team');
        //
        // }



        $('<table width="100%" class="param_match_text">\
              <tbody><tr><td width="20%"><b>'+LANG_JS.Weather+':</b></td>\
                         <td width="20%">'+dataMatch.matchParametrs.weather+'</td>\
                         <td width="60%" rowspan="5" align="center"><img width="420" src="//static-tss.warthunder.com/images/locations/'+dataMatch["matchParametrs"]["mission"][0]["image"]+'.jpg" align="center" /></td>\
                      </tr>\
                      <tr><td><b>'+LANG_JS.Daytime+':</b></td>\
                         <td>'+dataMatch.matchParametrs.daytime+'</td>\
                      </tr>\
                      <tr><td><b>'+LANG_JS.Difficulty+':</b></td>\
                         <td>'+dataMatch.matchParametrs.difficulty+'</td>\
                      </tr>\
                      <tr><td><b>'+LANG_JS.Mission+':</b></td>\
                         <td >'+dataMatch["matchParametrs"]["mission"][0]["name"]+'</td>\
                      </tr>\
                      <tr><td><b>'+LANG_JS.TimeLimit+':</b></td>\
                         <td>'+dataMatch.matchParametrs.timeLimit+'</td>\
                      </tr>\
              </tbody></table>').appendTo('#matchInfo_all_match_param');

        dataMatch.allBattleTime.forEach(function(item) {
            $('<tr><td>'+(item["number"]+1)+'</td><td>'+GetViewTime( item["inviteTime"] )+'</td><td>'+GetViewTime( item["timeStart"] )+'</td></tr>').appendTo('#matchInfo_battle_shedule');
        });
        $("#loading_img_infoMatchContentView").css("display", "none");
        $("#infoMatchContentView").css("display", "");
    });

}


function setCookie_lang( lang ){

    var date = new Date(new Date().getTime() + 864000 * 1000 * 30);
    document.cookie = "lang="+lang+"; path=/; expires=" + date.toUTCString();


}


function setCookie_tpl( tpl ){

    var date = new Date(new Date().getTime() + 864000 * 1000  * 30);
    document.cookie = "tpl="+tpl+"; path=/; expires=" + date.toUTCString();


}



$(document).ready(function() {

    var local_main_param = localStorage.getItem("next_check");
    var time_ = time();
    if (time_ > Number(local_main_param)) {
        for (var key_ in localStorage) {
            var arrayData = $.parseJSON(localStorage.getItem(key_));
            console.log("DELLL!")
            if (key_ == 'about_info_10489' || key_ == 'about_info_10491' || key_ == 'about_info_10493' ) {
                if (typeof(arrayData) === typeof({}) && arrayData != null) {
                    if ("time_create" in arrayData) {
                        if (Number(arrayData['time_create']) < 1577292982) {
                            console.log("DELLL")
                            localStorage.removeItem(key_);
                            console.log('clear ' + key_)
                        }

                    }
                }
            }

            if (typeof(arrayData) === typeof({}) && arrayData != null) {
                if ("time_del" in arrayData) {
                    if (time_ + 8640000 > Number(arrayData['time_del'])) {
                        localStorage.removeItem(key_);
                        console.log('clear ' + key_)
                    }

                }
            }
        }
        localStorage.setItem("next_check", time() + 3600 * 5);
    }
});