const fs = require('fs');
const dedent = require('dedent-js');

var app = {
    params : [],
    /* -------- APP METHOD -------- */
    // Compiling python script
    compileScript: function() {
        var check = params.check;
        var restrictTag = app.restrictTags(check.restrictTags_on);
        var restrictUser = app.restrictUsers(check.restrictUsers_on);
        var fFollowers = app.fFollowers(check.fFollowers_on);
        console.log(restrictTag);
        console.log(restrictUser);
        console.log(fFollowers);

        // Python script template
        var content = dedent(`
                                from instapy import InstaPy
                                \nsession = InstaPy(username='', password='')
                                \nsession.login()
                                ${restrictTag} ${restrictUser}
                                ${fFollowers}
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
        var parsed = "'" + input.split(', ').join("', '") + "'";

        console.log(parsed);
        return parsed;
    },
    // Updating checkboxes value
    updateParams: function() {
        for (var i in params.check) {
            params.check[i] = $('#'+i).is(':checked');
            console.log(params.check[i]);
        }
    },
    /* --------- INPUT PROCESSING --------- */
    restrictTags: function(on) {
        var content;

        if (on) {
            params.restrictTags = this.parser($('#restrictTags').val());
            content = `\nsession.set_dont_like([${params.restrictTags}])`;
        } else {
            content = ``;
        }

        // console.log(content);
        return content;
    },
    restrictUsers: function(on) {
        var content;

        if (on) {
            params.restrictUsers = this.parser($('#restrictUsers').val());
            content = `\nsession.set_ignore_users([${params.restrictUsers}])`;
        } else {
            content = ``;
        }
        // console.log(content)
        return content;
    },
    excludeFriends: function(on) {
        var content;

        if (on) {
            params.excludeFriends = this.parser($('#excludeFriends').val());
            content = `\nsession.set_dont_include([${params.excludeFriends}])`;
        } else {
            content = ``;
        }
        // console.log(content)
        return content;
    },
    ignoreRestrict: function(on) {
        var content;

        if (on) {
            params.ignoreRestrict = this.parser($('#ignoreRestrict').val());
            content = `\nsession.set_ignore_if_contains([${params.IgnoreRestrict}])`;
        } else {
            content = ``;
        }
        // console.log(content)
        return content;
    },
    interact: function(on) {
        
    },
    fLiked: function(on) {
        var content;

        if (on) {
            params.fLikedPercent = $('#fLikedPercent').val();
            params.fLikedTimes = $('#fLikedTimes').val();
            content = `\nset_do_follow(enabled=True, percentage=${params.fLikedPercent}, times=${params.fLikedTimes})`;
        } else {
            content = ``;
        }

        return content;
    },
    comments: function(on){
        var content;

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
        } else {
            content = ``;
        }
        console.log(content);
        return content;
    },
    followCount: function(on) {
        var content;

        if (on) {
            params.upperCount = $('#upperCount').val();
            params.lowerCount = $('#lowerCount').val();
            content = `\nsession.set_upper_follower_count(limit = ${params.upperCount})\nsession.set_lower_follower_count(limit = ${params.lowerCount})`;
        } else {
            content = ``;
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
        // console.log(content)
        return content;
    },
    fFollowing: function(on) {
        var content;
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
            content = `\nsession.follow_user_followers([${params.fFollowingUsers}], amount=${params.fFollowingAmount}, delay=${params.fFollowingDelay}, random=${params.fFollowingRandom}), interact=${interact}`;
        } else {
            content = ``;
        }
        // console.log(content)
        return content;
    },
    fUsers: function(on) {
        var content;

        if (on) {
            params.fUsers = this.parser($('#fUsers').val());
            content = `\nsession.follow_by_list([${params.fUsers}]], times=1)`
        } else {
            content = ``;
        }
        return content;
    },
    unfollowUsers: function(on) {
        var content;

        if (on) {
            params.unfollowUsers = this.parser($('#fUsers').val());
            content = `\nsession.follow_by_list([${params.unfollowUsers}]], times=1)`;
        } else {
            content = ``;
        }
        return content;
    },
    byTags: function(on) {
        var content;

        if (on) {
            params.byTagsTags = this.parser($('#byTagsTags').val());
            params.byTagsAmount = $('#byTagsAmount').val();

            if($('#byTagsMedia').val() === 1) {
                params.byTagsMedia = "'Photo'";
            } else if ($('#byTagsMedia').val() === 2) {
                params.byTagsMedia = "'Video'";
            } else {
                params.byTagsMedia = "Null";
            }
            content = `\nsession.like_by_tags([${params.byTagsTags}], amount=${params.byTagsAmount}, media='${params.byTagsMedia}')`;
        } else {
            content = ``;
        }
        return content;
    },
    byImages: function(on) {
        var content;

        if (on) {
            params.byImgUrl = $('#byImgUrl').val();
            params.byImgAmount = $('#byImgAmount').val();

            if($('#byImgMedia').val() === 1) {
                params.byImgMedia = "'Photo'";
            } else if ($('#byImgMedia').val() === 2) {
                params.byImgMedia = "'Video'";
            } else {
                params.byImgMedia = "Null";
            }
            content = `\nsession.like_from_image([${params.byImgUrl}], amount=${params.byImgAmount}, media='${params.byImgMedia}')`;
        } else {
            content = ``;
        }
        return content;
    },
    byLocation: function(on) {
        var content;

        if (on) {
            params.byLocUrl = this.parser($('#byLocUrl').val());
            params.byLocAmount = $('#byLocAmount').val();

            if($('#byLocMedia').val() === 1) {
                params.byLocMedia = "'Photo'";
            } else if ($('#byLocMedia').val() === 2) {
                params.byLocMedia = "'Video'";
            } else {
                params.byLocMedia = "Null";
            }
            content = `\nsession.like_by_locations([${params.byLocUrl}], amount=${params.byLocAmount}, media='${params.byLocMedia}')`;
        } else {
            content = ``;
        }
        return content;
    }
};

var params = {
    check: {
        restrictTags_on: '',
        restrictUsers_on: '',
        excludeFriend_on: '',
        ignoreRestrict_on: '',
        interact_on: '',
        fLiked_on: '',
        comment_on: '',
        followCount_on: '',
        byTags_on: '',
        byImg_on: '',
        byLoc_on: '',
        fUsers_on: '',
        fFollowers_on: '',
        fFollowing_on: '',
        unfollow_on: ''
    },
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

// Interface interaction handler
var handler = {
    submit: function() {
        app.updateParams();
        app.createScript(app.compileScript());
        console.log('Write files succeed!');

        // update content
        // console.log('here it is');
    }
};

$(document).ready(function() {
    // Run button event listener
    $('#fireButton').click(function() {
        app.comments(true);
        // handler.submit();
    });
    // input parameter
    // generate file
    // 1. create .py script
    // 2. check if param selected
    // 3. validate
    // execute script
    // show console
});



