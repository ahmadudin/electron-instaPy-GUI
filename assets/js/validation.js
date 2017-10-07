function selectionCheck() {
    var nav = document.getElementsByClassName('omega');
	for (var i = 0, l=nav.length;i<l;i++){
		if(nav[i].firstElementChild.checked) {
            return true;
        }
  }
  alert('Choose one activity at least');
	return false
}

$('#myform').form({
        on: 'blur',
        inline: false,
        fields: {
            username: {
                identifier: 'username',
                rules: [
                {
                    type   : 'empty',
                    prompt : 'Username cannot be empty'
                }
                ]
            },
            password: {
                identifier: 'password',
                rules: [
                {
                    type   : 'empty',
                    prompt : 'Password cannot be empty'
                }
                ]
            },
            byTagsTags: {
                identifier: 'byTagsTags',
                depends: 'byTags_on',
                rules: [
                {
                    type   : 'empty',
                    prompt : 'Tags cannot be empty'
                }
                ]
            },
            byTagsAmount: {
                identifier: 'byTagsAmount',
                depends: 'byTags_on',
                rules: [
                {
                    type   : 'empty',
                    prompt : 'Amount cannot be empty'
                }
                ]
            },
            byImgUrl: {
                identifier: 'byImgUrl',
                depends: 'byImg_on',
                rules: [
                {
                    type   : 'empty',
                    prompt : 'Url cannot be empty'
                }
                ]
            },
            byImgAmount: {
                identifier: 'byImgAmount',
                depends: 'byImg_on',
                rules: [
                {
                    type   : 'empty',
                    prompt : 'Amount cannot be empty'
                }
                ]
            },
            byLocUrl: {
                identifier: 'byLocUrl',
                depends: 'byLoc_on',
                rules: [
                {
                    type   : 'empty',
                    prompt : 'Url cannot be empty'
                }
                ]
            },
            byLocAmount: {
                identifier: 'byLocAmount',
                depends: 'byLoc_on',
                rules: [
                {
                    type   : 'empty',
                    prompt : 'Amount cannot be empty'
                }
                ]
            },
            fLikedPercent: {
                identifier: 'fLikedPercent',
                depends: 'fLiked_on',
                rules: [
                {
                    type   : 'empty',
                    prompt : 'Percent cannot be empty'
                }
                ]
            },
            fLikedTimes: {
                identifier: 'fLikedTimes',
                depends: 'fLiked_on',
                rules: [
                {
                    type   : 'empty',
                    prompt : 'Times cannot be empty'
                }
                ]
            },
            commentsPercent: {
                identifier: 'commentsPercent',
                depends: 'comments_on',
                rules: [
                {
                    type   : 'empty',
                    prompt : 'Percentage cannot be empty'
                }
                ]
            },
            comments: {
                identifier: 'comments',
                depends: 'comments_on',
                rules: [
                {
                    type   : 'empty',
                    prompt : 'Comments cannot be empty'
                }
                ]
            },
            upperCount: {
                identifier: 'upperCount',
                depends: 'followCount_on',
                rules: [
                {
                    type   : 'empty',
                    prompt : 'Follower count cannot be empty'
                }
                ]
            },
            lowerCount: {
                identifier: 'lowerCount',
                depends: 'followCount',
                rules: [
                {
                    type   : 'empty',
                    prompt : 'Follower count cannot be empty'
                }
                ]
            },
            fUsers: {
                identifier: 'fUsersLists',
                depends: 'fUsers_on',
                rules: [
                {
                    type   : 'empty',
                    prompt : 'User list cannot be empty'
                }
                ]
            },
            fFollowersUsers: {
                identifier: 'fFollowersUsers',
                depends: 'fFollowers_on',
                rules: [
                {
                    type   : 'empty',
                    prompt : 'Users cannot be empty'
                }
                ]
            },
            fFollowersAmount: {
                identifier: 'fFollowersAmount',
                depends: 'fFollowers_on',
                rules: [
                {
                    type   : 'empty',
                    prompt : 'Amount cannot be empty'
                }
                ]
            },
            fFollowingUsers: {
                identifier: 'fFollowingUsers',
                depends: 'fFollowing_on',
                rules: [
                {
                    type   : 'empty',
                    prompt : 'Users cannot be empty'
                }
                ]
            },
            fFollowingAmount: {
                identifier: 'fFollowingAmount',
                depends: 'fFollowing_on',
                rules: [
                {
                    type   : 'empty',
                    prompt : 'Amount cannot be empty'
                }
                ]
            },
            unfollowAmount: {
                identifier: 'unfollowAmount',
                depends: 'unfollowUsers_on',
                rules: [
                {
                    type   : 'empty',
                    prompt : 'Amount cannot be empty'
                }
                ]
            },
            interactAmount: {
                identifier: 'interactAmount',
                depends: 'interact_on',
                rules: [
                {
                    type   : 'empty',
                    prompt : 'Amount cannot be empty'
                }
                ]
            },
            interactPercent: {
                identifier: 'interactPercent',
                depends: 'interact_on',
                rules: [
                {
                    type   : 'empty',
                    prompt : 'Percentage cannot be empty'
                }
                ]
            }
        }
    })

