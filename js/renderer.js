// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
function restrict() {
  if ($('#restrictTags_on').is(':checked') || $('#excludeFriends_on').is(':checked') || $('#ignoreRestrict_on').is(':checked') || $('#restrictUsers_on').is(':checked') ) {
    $('#settings').addClass('selected');
  } else {
    $('#settings').removeClass('selected');
  }
};

$('.ui.checkbox').checkbox(); 
    $(document).ready(function() {
      //  Restriction Section
      $('#restrictionHeader').checkbox({
        onChange: function() {
          $('#restriction').slideToggle("fast");
        }
      });
      $('#restrictTags_on').parent().checkbox().first().checkbox({
        onChange: function() {
          $('#restrictTags').parent().toggleClass('disabled');
          console.log($('#restrictTags_on').is(':checked'));
          restrict();
        }
      });
      $('#excludeFriends_on').parent().checkbox().first().checkbox({
        onChange: function() {
          $('#excludeFriends').parent().toggleClass('disabled');
          restrict();
        }
      });
      $('#ignoreRestrict_on').parent().checkbox().first().checkbox({
        onChange: function() {
          $('#ignoreRestrict').parent().toggleClass('disabled');
          restrict();
        }
      });
      $('#restrictUsers_on').parent().checkbox().first().checkbox({
        onChange: function() {
          $('#restrictUsers').parent().toggleClass('disabled');
          restrict();
        }
      });

      // Like Uitlity
      $('#likeUtilHeader').checkbox({
        onChange: function() {
          $('#likeUtil').slideToggle("fast");
        }
      });
                   
      $("#byTags_on").parent().checkbox({
        onChange: function() {
        $('#byTags').slideToggle("fast").toggleClass('disabled');
        $(this).closest('.ui.message').toggleClass('selected');
        }
      });
      $('#byImg_on').parent().checkbox().first().checkbox({
        onChange: function() {
          $('#byImg').slideToggle("fast").toggleClass('disabled');
          $(this).closest('.ui.message').toggleClass('selected');
        }
      });
      $('#byLoc_on').parent().checkbox().first().checkbox({
        onChange: function() {
          $('#byLoc').slideToggle("fast").toggleClass('disabled');
          $(this).closest('.ui.message').toggleClass('selected');
        }
      });

      // Like Interaction
      $('#fLiked_on').parent().checkbox().first().checkbox({
        onChange: function() {
          $('#fLiked').toggleClass('disabled');
          $(this).closest('.ui.message').toggleClass('selected');
        }
      });
      $('#comments_on').parent().checkbox().first().checkbox({
        onChange: function() {
          $('#commenting').toggleClass('disabled');
          $(this).closest('.ui.message').toggleClass('selected');
        }
      });
      $('#followCount_on').parent().checkbox().first().checkbox({
        onChange: function() {
          $('#followCount').toggleClass('disabled');
          $(this).closest('.ui.message').toggleClass('selected');
        }
      });

      // Following Utility
      $('#followUtilHeader').checkbox({
        onChange: function() {
          $('#followUtil').slideToggle("fast");
        }
      });
      $('#fUsers_on').parent().checkbox().first().checkbox({
        onChange: function() {
          $('#fUsers').slideToggle("fast").toggleClass('disabled');
          $(this).closest('.ui.message').toggleClass('selected');
        }
      });
      $('#fFollowers_on').parent().checkbox().first().checkbox({
        onChange: function() {
          $('#fFollowers').slideToggle("fast").toggleClass('disabled');
          $(this).closest('.ui.message').toggleClass('selected');
        }
      });
      $('#fFollowing_on').parent().checkbox().first().checkbox({
        onChange: function() {
          $('#fFollowing').slideToggle("fast").toggleClass('disabled');
          $(this).closest('.ui.message').toggleClass('selected');
        }
      });
      $('#unfollowUsers_on').parent().checkbox().first().checkbox({
        onChange: function() {
          $('#unfollowUser').slideToggle("fast").toggleClass('disabled');
          $(this).closest('.ui.message').toggleClass('selected');
        }
      });

      // Following Interactions
      $('#interact_on').parent().checkbox().first().checkbox({
        onChange: function() {
          $('#interact').slideToggle("fast").toggleClass('disabled');
          $(this).closest('.ui.message').toggleClass('selected');
        }
      });
    });