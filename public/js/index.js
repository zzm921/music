$(function () {
    var myPlaylist
    $("#searchBtn").click(function () {
        var keywords = $("#key").val()
        // var keywords = '金玟岐'
        $.get('/musicapi/search', { keywords: keywords }, function (result) {
            console.log(result)
            var data = result.result.songs
            $("#result").html('<thead><tr><th>音乐标题</th><th>歌手</th><th>专辑</th><th>操作</th></tr></thead>')
            $("#result").append("<tbody>")
            for (i = 0; i < data.length; i++) {
                var html = '<tr><td>' + data[i].name + '</td><td>' + data[i].artists[0].name + '</td><td>' + data[i].album.name + '</td><td><a href="javascript:songdetail(' + data[i].id + ')"><span class="fa fa-play-circle"></span></a>   <a href="' + data[i].rUrl + '" target="_blank" download="' + data[i].name + '"><span class="fa fa-download"></span></a><td></tr>'
                $("#result").append(html)
            }
            $("#result").append("</tbody>")
        }, "json");
    })
    initplayer(myPlaylist)
})

function songdetail(id) {
    $.get('/musicapi/SongDetail', { ids: id }, function (data) {
        // $('#' + id).html('')
        // $('#' + id).append('<ul class="list-inline"><li>' + data.songName + '</li><li>' + data.authorName + '</li><li><a href="\\music\\dowmload\\?id=' + data.songId + '&songName=' + data.songName + '" target="_blank"><span class="glyphicon glyphicon-download"></span></a></li>')
        myPlaylist.add({
            title: data.songName,
            artist: data.authorName,
            mp3: data.url,
            poster: data.albumImg
        }, 1)
    }, "json");

}


function initplayer() {
    var playlist = []
    var cssSelector = {
        jPlayer: "#jquery_jplayer",
        cssSelectorAncestor: ".music-player"
    };

    var options = {
        swfPath: "http://cdnjs.cloudflare.com/ajax/libs/jplayer/2.6.4/jquery.jplayer/Jplayer.swf",
        supplied: "ogv, m4v, oga, mp3"
    };
    myPlaylist = new jPlayerPlaylist(cssSelector, playlist, options);

}