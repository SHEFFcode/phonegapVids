$(document).ready(function () {
  document.addEventListener('deviceready', onDeviceReady, false);

  function onDeviceReady () {
    var channel1 = 'TechGuyLabs';
    getPlaylist(channel1);
    $(document).on('click', '#vidlist li', function () {
      var id =$(this).attr('videoid');
      showVideo(id);
    });
  }

  function getPlaylist (channel) {
    $('#vidlist').html('');
    $.get('https://www.googleapis.com/youtube/v3/channels', {
      part: 'contentDetails',
      forUsername: channel,
      key: 'AIzaSyC---MBCoA3UKFartfXoQnPIv2YfKQmNSM'
    },
    function (data) {
      $.each(data.items, function (i, item) {
        console.log(item);
        var playlistId = item.contentDetails.relatedPlaylists.uploads;
        getVideos(playlistId, 10);
      });
    });
  }

  function getVideos(playlistid, maxResults) {
    $.get('https://www.googleapis.com/youtube/v3/playlistItems', {
      part: 'snippet',
      maxResults: maxResults,
      playlistId: playlistid,
      key: 'AIzaSyC---MBCoA3UKFartfXoQnPIv2YfKQmNSM'
    }, function (data) {
      var output;
      $.each(data.items, function (i, items) {
        var id = items.snippet.resourceId.videoId;
        var title = items.snippet.title;
        var thumb = items.snippet.thumbnails.default.url;
        $('#vidlist').append('<li videoid="'+ id +'"><img src="'+ thumb +'" alt="thumbnail"><h3>'+ title +'</h3></li>').listview('refresh');
      })
    });
  }

  function showVideo (id) {
    console.log('showing video' + id);
    $('#logo').hide();
    var output = '<iframe width="100%" height="250" src="https://www.youtube.com/embed/' + id + '" frameborder="0" allowfullscreen></iframe>';
    $('#showVideo').html(output);
  }
});