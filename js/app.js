$(document).ready(function () {
  document.addEventListener('deviceready', onDeviceReady, false);

  function onDeviceReady () {
    //check local storage for channel
    if (!localStorage.channel) {
      //ask user for a channel
      $('#popupdialogue').popup('open');
    } else {
      var channel = localStorage.getItem('channel');
    }
    $('#channelbuttonok').click(function () {
      var channel = $('#channelname').val();
      setChannel(channel);
      getPlaylist(channel);
    });
    $('#saveoptions').click(saveOptions);
    $('#clearchannel').click(clearChannel);
    getPlaylist(localStorage.getItem('channel'));
    $(document).on('click', '#vidlist li', function () {
      var id =$(this).attr('videoid');
      showVideo(id);
    });
  }

  $(document).on('pageinit', '#options', function (e) {
    console.log('Options Page Loaded');
    var channel = localStorage.getItem('channel');
    var maxResults = localStorage.getItem('maxresults');
    $('#channelnameoptions').val(channel);
    $('#maxresultsoptions').val(maxResults);
  });

  function setChannel (channel) {
    localStorage.setItem('channel', channel);
    console.log('Channel Set ' + channel);
  }

  function setMaxResults (results) {
    localStorage.setItem('maxresults', results);
    console.log('Max Results set to ' + results);
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
        var maxResults = localStorage.getItem('maxresults') || 10;
        getVideos(playlistId, maxResults);
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

  function saveOptions () {
    var channel = $('#channelnameoptions').val();
    setChannel(channel);
    var maxResults = $('#maxresultsoptions').val();
    setMaxResults(maxResults);
    $('body').pagecontainer('change', '#main');
    getPlaylist(channel);
  }

  function clearChannel () {
    localStorage.removeItem('channel');
    $('body').pagecontainer('change', '#main');
    //clear list
    $('#vidlist').html('');
    //show popup
    $('#popupdialogue').popup('open');
  }
});