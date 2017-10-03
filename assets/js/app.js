const fs = require('fs');
const dedent = require('dedent-js');


var params = {
    check: {
        restrictTags_on: true,
        restrictUsers_on: '',
        excludeFriends_on: '',
        ignoreRestrict_on: '',
        interact_on: '',
        fLiked_on: '',
        comments_on: '',
        followCount_on: '',
        byTags_on: '',
        byImg_on: '',
        byLoc_on: '',
        fUsers_on: '',
        fFollowers_on: '',
        fFollowing_on: '',
        unfollowUsers_on: ''
    },
    username: '',
    password: '',
    restrictTags: '',
    restrictUsers: '',
    excludeFriends: '',
    ignoreRestrict: '',
    fLikedPercent: '',
    fLikedTimes: '',
    commentPercent: '',
    comments: '',
    commentsMedia: '',
    commentsEmoji: '',
    upperCount: '',
    lowerCount: '',
    byTagsTags: '',
    byTagsAmount: '',
    byTagsMedia: '',
    byImgUrl: '',
    byImgAmount: '',
    byImgMedia: '',
    byLocUrl: '',
    byLocAmount: '',
    byLocMedia: '',
    fUsersLists: '',
    fFollowersUsers: '',
    fFollowersAmount: '',
    fFollowersDelay: '',
    fFollowersRandom: '',
    fFollowingUsers: '',
    fFollowingAmount: '',
    fFollowingDelay: '',
    fFollowingRandom: '',
    unfollowUsers: '',
    interactRandom: '',
    interactAmount: '',
    interactPercent: ''
};

var app = {
    params : [],
    /* -------- APP METHOD -------- */
    // Compiling python script
    compileScript: function() {
        var check = params.check;
        var identity = app.identity()
        var restrictTag = app.restrictTags(check.restrictTags_on);
        var restrictUser = app.restrictUsers(check.restrictUsers_on);
        var excludeFriends = app.excludeFriends(check.excludeFriends_on);
        var ignoreRestrict = app.ignoreRestrict(check.ignoreRestrict_on);
        var interact = app.interact(check.interact_on);
        var fLiked = app.fLiked(check.fLiked_on);
        var comments = app.comments(check.comments_on);
        var followCount = app.followCount(check.followCount_on);
        var fFollowers = app.fFollowers(check.fFollowers_on);
        var fFollowing = app.fFollowing(check.fFollowing_on);
        var fUsers = app.fUsers(check.fUsers_on);
        var unfollowUsers = app.unfollowUsers(check.unfollowUsers_on);
        var byTags = app.byTags(check.byTags_on);
        var byImages = app.byImages(check.byImg_on);
        var byLocations = app.byLocations(check.byLoc_on);

        // Python script template
        var content = dedent(`
            from instapy import InstaPy
            ${identity}
            \nsession.login()
            ${restrictTag}${restrictUser}${excludeFriends}${ignoreRestrict}${fLiked}${comments}${followCount}${interact}${byTags}${byImages}${byLocations}${fFollowers}${fFollowing}${fUsers}${unfollowUsers}
            \nsession.end()
        `);
        console.log(content);
        return content;
    },
    // Write and save Script to local storage
    createScript: function(content) {
        fs.writeFile('quickstart.py', content, (err) => {
            if (err) throw err;
            console.log('The file has been saved!');
        });
        // console.log(content);
    },
    // format input string to match python script syntax
    parser: function(input) {
        var parsed = "'" + input.replace(/\s+/g, '').split(',').join("', '") + "'";

        return parsed;
    },
    // Updating checkboxes value
    updateParams: function() {
        for (var i in params.check) {
            params.check[i] = $('#'+i).is(':checked');
        }
    },
    /* --------- INPUT PROCESSING --------- */
    identity: function() {
        params.username = $('#username').val();
        params.password = $('#password').val();
        var content = `\nsession = InstaPy(username='${params.username}', password='${params.password}')`;
        return content;
    },
    restrictTags: function(on) {
        var content = ``;

        if (on) {
            params.restrictTags = this.parser($('#restrictTags').val());
            content = `\nsession.set_dont_like([${params.restrictTags}])`;
        }

        return content;
    },
    restrictUsers: function(on) {
        var content = ``;

        if (on) {
            params.restrictUsers = this.parser($('#restrictUsers').val());
            content = `\nsession.set_ignore_users([${params.restrictUsers}])`;
        }

        return content;
    },
    excludeFriends: function(on) {
        var content = ``;

        if (on) {
            params.excludeFriends = this.parser($('#excludeFriends').val());
            content = `\nsession.set_dont_include([${params.excludeFriends}])`;
        } 

        return content;
    },
    ignoreRestrict: function(on) {
        var content = ``;

        if (on) {
            params.ignoreRestrict = this.parser($('#ignoreRestrict').val());
            content = `\nsession.set_ignore_if_contains([${params.ignoreRestrict}])\n`;
        }

        return content;
    },
    interact: function(on) {
        var content = ``;

        if (on) {
            params.interactAmount = $('#fLikedPercent').val();
            params.interactPercent = $('#fLikedTimes').val();
            if ($('#interactRandom').val()) {
                params.interactRandom = 'True';
            } else {
                params.interactRandom = 'False';
            }
            content = `\nsession.set_user_interact(amount=${params.interactAmount}, random=${params.interactRandom}, percentage=${params.interactPercent})\n`;
        } 

        return content;
    },
    fLiked: function(on) {
        var content = ``;

        if (on) {
            params.fLikedPercent = $('#fLikedPercent').val();
            params.fLikedTimes = $('#fLikedTimes').val();
            content = `\nsession.set_do_follow(enabled=True, percentage=${params.fLikedPercent}, times=${params.fLikedTimes})`;
        } 

        return content;
    },
    comments: function(on){
        var content = ``;

        if (on) {
            params.comments = this.parser($('#comments').val());
            params.commentsPercent = $('#commentsPercent').val();

            if($('#byImgMedia').val() === 1) {
                params.commentsMedia = "'Photo'";
            } else if ($('#commentsMedia').val() === 2) {
                params.commentsMedia = "'Video'";
            } else {
                params.commentsMedia = "Null";
            }
            content = `\nsession.set_do_comment(enabled=True, percentage=${params.commentsPercent})\nsession.set_comments([${params.comments}], media=${params.commentsMedia})`;
        }

        return content;
    },
    followCount: function(on) {
        var content = ``;

        if (on) {
            params.upperCount = $('#upperCount').val();
            params.lowerCount = $('#lowerCount').val();
            content = `\nsession.set_upper_follower_count(limit = ${params.upperCount})\nsession.set_lower_follower_count(limit = ${params.lowerCount})`;
        }

        return content;
    },
    fFollowers: function(on) {
        var content = ``;
        var interact = 'False';

        if (on) {
            params.fFollowersUsers = this.parser($('#fFollowersUsers').val());
            params.fFollowersAmount = $('#fFollowersAmount').val();
            params.fFollowersDelay = $('#fFollowersDelay').val();

            if ($('#fFollowersRandom').checked) {
                params.fFollowersRandom = 'True';
            } else {
                params.fFollowersRandom = 'False';
            }
            if (params.check.interact_on) {
                interact = 'True';
            }
            content = `\nsession.follow_user_followers([${params.fFollowersUsers}], amount=${params.fFollowersAmount}, delay=${params.fFollowersDelay}, random=${params.fFollowersRandom}, interact=${interact})`;
        }

        return content;
    },
    fFollowing: function(on) {
        var content = ``;
        var interact = 'False';

        if (on) {
            params.fFollowingUsers = this.parser($('#fFollowingUsers').val());
            params.fFollowingAmount = $('#fFollowingAmount').val();
            params.fFollowingDelay = $('#fFollowingDelay').val();

            if ($('#fFollowersRandom').checked) {
                params.fFollowingRandom = 'True';
            } else {
                params.fFollowingRandom = 'False';
            }
            if (params.check.interact_on) {
                interact = 'True';
            }
            content = `\nsession.follow_user_following([${params.fFollowingUsers}], amount=${params.fFollowingAmount}, delay=${params.fFollowingDelay}, random=${params.fFollowingRandom}, interact=${interact})`;
        }

        return content;
    },
    fUsers: function(on) {
        var content = ``;

        if (on) {
            params.fUsers = this.parser($('#fUsersLists').val());
            content = `\nsession.follow_by_list([${params.fUsers}], times=1)`
        }

        return content;
    },
    unfollowUsers: function(on) {
        var content = ``;

        if (on) {
            params.unfollowAmount = $('#unfollowAmount').val();
            content = `\nsession.unfollow_users(amount=${params.unfollowAmount})`;
        }

        return content;
    },
    byTags: function(on) {
        var content = ``;

        if (on) {
            params.byTagsTags = this.parser($('#byTagsTags').val());
            params.byTagsAmount = $('#byTagsAmount').val();

            if($('input[name=byTagsMedia]:checked').val() === '1') {
                params.byTagsMedia = "'Photo'";
            } else if ($('input[name=byTagsMedia]:checked').val() === '2') {
                params.byTagsMedia = "'Video'";
            } else {
                params.byTagsMedia = "Null";
            }
            content = `\nsession.like_by_tags([${params.byTagsTags}], amount=${params.byTagsAmount}, media=${params.byTagsMedia})`;
        }

        return content;
    },
    byImages: function(on) {
        var content = ``;

        if (on) {
            params.byImgUrl = this.parser($('#byImgUrl').val());
            params.byImgAmount = $('#byImgAmount').val();

            if($('input[name=byImgMedia]:checked').val() === '1') {
                params.byImgMedia = "'Photo'";
            } else if ($('input[name=byImgMedia]:checked').val() === '2') {
                params.byImgMedia = "'Video'";
            } else {
                params.byImgMedia = "Null";
            }
            content = `\nsession.like_from_image([${params.byImgUrl}], amount=${params.byImgAmount}, media=${params.byImgMedia})`;
        }

        return content;
    },
    byLocations: function(on) {
        var content = ``;

        if (on) {
            params.byLocUrl = this.parser($('#byLocUrl').val());
            params.byLocAmount = $('#byLocAmount').val();

            if($('input[name=byLocMedia]:checked').val() === '1') {
                params.byLocMedia = "'Photo'";
            } else if ($('input[name=byLocMedia]:checked').val() === '2') {
                params.byLocMedia = "'Video'";
            } else {
                params.byLocMedia = "Null";
            }
            content = `\nsession.like_by_locations([${params.byLocUrl}], amount=${params.byLocAmount}, media=${params.byLocMedia})\n`;
        }

        return content;
    }
};

// Interface interaction handler
var handler = {
    submit: function() {
        app.updateParams();
        app.createScript(app.compileScript());
        console.log('Write files succeed!');
    }
};

$(document).ready(function() {
    $("#myform").submit(function(e) {
        e.preventDefault();
        if( $('#myform').form('is valid') && oneCheck()) {
            handler.submit();
        } else {
            console.log('at least place a tag!');
        }
    });
});

