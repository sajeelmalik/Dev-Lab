$(function () {

    var userID = Cookies.get('userid');
    var userContentArray = [];
    var visits = 0;
    getCurrentSaves();

    if (userID) {
        // SHOW WELCOME SCREEN TO USER
        $.get(`/api/users/${userID}`, function (err, data) {
            if (err) throw err;
        }).then(data => {
            visits++;
            console.log(visits)
            $("#login").hide();
            // $("#scroller").hide();
            $(".landing-text").css("margin-top", "40px");
            $(".landing-text").css("font-size", "1.5em");
            $(".landing-text").css("overflow", "hidden");
            $(".landing-text").text("Welcome to DevLab, " + data.userName);

            // $("#background-overlay").addClass("uk-animation-kenburns uk-animation-reverse");
            $("#landing").addClass("uk-animation-slide-top-small uk-animation-slow");

            $('#add-content-button').prop('disabled', true);

            setTimeout(function () {
                console.log("here")
                $("#landing").removeClass("uk-animation-slide-top-small");
                $("#landing").addClass("uk-animation-fade uk-animation-reverse uk-animation-slow");
                $("#background-overlay").addClass("uk-animation-fade uk-animation-reverse uk-animation-slow");
                setTimeout(function () {
                    $("#background-overlay").hide(1000);
                    $("#landing").hide(1000)
                    $('#add-content-button').prop('disabled', false);

                    //Quick fix to force the page to scroll, allowing the UIKit animations to trigger
                    setTimeout(function () {
                        $(this).scrollTop(20);
                    }, 1100);
                }, 1000);

            }, 8000);

        });


        //Create Logout Button
        $("#login-link").hide();
        $("#sign-up-nav-button").hide();
        var logoutLink = $("<a class='uk-button' href='/signout' id='logout-link' uk-scroll>Logout</a>");
        $("#nav-right").html(logoutLink);

    } else {
        console.log("Not logged in")
        $("#navbar").attr('uk-sticky', 'cls-inactive: uk-hidden; top: 300')
        //Here, disabling the button made it inaccessible to jQuery DOM manipulation, so we created a more unique solution

        // $('#add-content-button').prop('disabled', true);
        $('#add-content-button').removeAttr('uk-toggle');
        $('#add-content-button').attr('uk-scroll', true);
        $('#add-content-button').attr('href', "#");
        $("#login-link").show();
        $("#sign-up-nav-button").show();
        $("#logout-link").hide();

        //prompt user to log-in to add content - dynamic hover works with the tooltip below
        $('#add-content-button').hover(
            function () {
                var $this = $(this); // caching $(this)
                $this.data('initialText', $this.text());
                $this.text("Wait a minute!");
            },
            function () {
                var $this = $(this); // caching $(this)
                $this.text($this.data('initialText'));
            }
        );


        $("#add-content-button").attr("uk-tooltip","title: Log-In to DevLab to share your favorite resources!; pos: bottom; delay: 200")
        $("#user-library-link").attr("uk-tooltip", "title: Log-In to DevLab to save your favorite resources!; pos: bottom; delay: 200")

    }

    //PAGE LOGIN
    $("#submit-login").on('click', function (e) {
        e.preventDefault();
        var email = $("#username").val();
        var password = $("#password").val();
        console.log("sign in " + email);
        $.ajax({
            type: "POST",
            url: '/signin',
            data: {
                email: email,
                password: password
            },
            success: function () {
                document.location = "/";
            }
        }, function (data){
            console.log(data);
        })
    })

    $(document).on("click", "#logout-link", function (e) {
        $.ajax({
            type: "GET",
            url: "/signout",
            success: function () {
                location.reload();
            }
        })
    })
var userCategoryArray = []
    //POPULATES CONCEPT CATEGORIES ON PAGE LOAD
    $.get('/api/contents', function (err, data) {
            if (err) throw err;
            console.log(data);
        }).then(data => {
            data.forEach(function (concept) {
                var newDiv = $("<div class= 'concept-category'>");
                var linkTitle = $(`<h4 class = content-title>`);
                var dropdownOption = $(`<option value= ${concept.conceptTitle}>`)
                newDiv.attr('id', 'category-' + concept.conceptTitle)
                linkTitle.text(concept.conceptTitle);
                newDiv.append(linkTitle);
                $(".concept-container").append(newDiv);
                dropdownOption.text(concept.conceptTitle);
                $('#new-concept').append(dropdownOption);
                userCategoryArray.push(concept.conceptTitle)

            });
        })
        .catch(err => console.log(err))


    //ON CLICK OF CONCEPTS, POPULATE CONTENT-ITEMS CONTAINER
    $(document).on('click', ".concept-category", function (e) {
        $(".content-title").removeClass("content-active");
        $(this).children("h4").toggleClass("content-active");

        $(".content-item-container").empty();
        var category = $(this).attr('id');
        category = category.slice(category.indexOf('-') + 1);
        console.log(category);
        $.get('/api/contents/' + category, function (err, data) {
            if (err) throw err;
        }).then(data => {
            //CREATE INDIVIDUAL CONTENT ITEM DIV
            //Items come in an array of objects and come in Most saves, DESC
            var newAccordion = $("<ul uk-accordion uk-scrollspy='target: > li ; cls:uk-animation-slide-right-medium; delay: 100'>");
            data.forEach(function (item) {
                var newItem = $("<li class=content-item>")
                var linkTitle = $(`<a class="uk-accordion-title" href="#">`); //${item.links}
                var starNumber = $("<span class = star-number>");
                var starImage = $(`<i data-id='${item.id}' data-value='${item.saves}' class='fas fa-star star-image'></i>`);
                var newDiv = $("<div class=uk-accordion-content>");
                var itemLinks = $("<a>");
                var itemBody = $("<p>");
                if (userContentArray.includes(item.id)) starImage.addClass('saved')
                starNumber.text(item.saves);
                starNumber.attr('id', 'content-item' + item.id);
                starNumber.append(starImage);
                linkTitle.text(item.contentTitle);
                linkTitle.append(starNumber);
                starNumber.addClass("uk-align-right");
                itemLinks.append(item.links);
                itemBody.append(item.contentBody);
                newDiv.append(itemLinks, itemBody);
                newItem.append(linkTitle, newDiv);
                newAccordion.append(newItem);
                $(".content-item-container").prepend(newAccordion);
            })
        })
    })

    //ON CLICK LISTENER FOR SAVING CONTENT
    $(document).on('click', ".star-image", function (e) {
        var starID = $(this).data('id');
        var matchingStars = document.querySelectorAll(`i[data-id='${starID}']`);
        //IF CONTENT IS BEING UNSAVED
        if ($(this).hasClass('saved')) {
            matchingStars.forEach(node => node.classList.remove('saved'))
            this.previousSibling.nodeValue--;
            $.ajax(`/api/delete/${userID}/${starID}`, {
                method: 'DELETE'
            })

        } else {
            //IF CONTENT IS BEING SAVED
            matchingStars.forEach(node => node.classList.add('saved'))
            this.previousSibling.nodeValue++;
            $.ajax(`/api/users/${userID}`, {
                method: 'PUT',
                data: {
                    contentId: starID
                }
            })
        }

    })

    //ADD NEW CONTENT
    $("#submit-content").on('click', function (e) {
        e.preventDefault();
        console.log($("#new-concept").val());
        var createObj = {
            conceptTitle: $("#new-concept").val(),
            links: $("#new-link").val(),
            contentTitle: $("#new-name").val(),
            contentBody: $("#new-desc").val(),
            saves: 0

        }
        $.post('/api/new/contents', createObj, function () {
            //modal pop up - successfully submitted
        })

    })

    //USER LIBRARY
    if (userID) {
        $("#user-library-link").on('click', function () {
            $("#landing").hide();
            $("#background-overlay").hide();
            //Populates user-library category dropdown. Emptied on 'full library' click
            userCategoryArray.forEach(categoryTitle=>{
                var dropdownOption = $(`<option value="${categoryTitle}">`)
                dropdownOption.text(categoryTitle);
                $("#user-category-dropdown").append(dropdownOption)
    
            })
            if (!$(this).hasClass('active')) {
                console.log('working');
                $(this).toggleClass('active');
                $("#landing").hide();
                $(".uk-button-danger").hide();
                $(".uk-divider-icon").hide();
                $("#full-library-link").toggleClass('active');
                $(".library-container").hide();
                $(".add-content").hide();
                $(".user-library-container").css('display', 'flex');

                //CREATE USER CONTENT DIVS
                $.get(`/api/users/${userID}`, function (err, data) {
                    if (err) throw err;
                }).then(data=> createUserLibrary(data))
            }
        })

    }
    $("#user-category-dropdown").on('change', function(){
        $.post(`/api/users/${userID}/`,{
            category: $(this).val(),
            sort: "savesDesc"
        }).then(data=>createUserLibrary(data))
    })

    $("#sort")


    function createUserLibrary(data) {
        $('.user-library').empty()

        userContentArray = [];
        var userAccordion = $("<ul class='js-filter' uk-accordion uk-scrollspy='target: > li ; cls:uk-animation-slide-right-medium; delay: 100'>");
        data.savedLinks.forEach(elem => {
            userContentArray.push(elem.id);
            var userContainer = $(`<li class='user-content-container'>`);
            var userTitle = $("<a class='uk-accordion-title user-title'>");
            var userSaves = $(`<span class='star-number uk-align-right'>${elem.saves} </span>`);
            var userDate = $("<span class='user-date uk-align-right'>");
            var userImage = $(`<i data-id='${elem.id}' data-value='${elem.saves}'class='fas fa-star star-image'></i>`);
            if (userContentArray.includes(elem.id)) userImage.addClass('saved');
            userTitle.text(elem.contentTitle);
            userSaves.append(userImage);
            var createdDate = elem.User_Content.createdAt;
            userDate.append(moment(createdDate).format('MM DD YYYY'))
            var newDiv = $("<div class=uk-accordion-content>");
            var userLinks = $("<a>");
            var userBody = $("<p>");
            userLinks.append(elem.links);
            userBody.append(elem.contentBody);
            newDiv.append(userLinks, userBody);
            userTitle.append(userSaves, userDate)
            userContainer.append(userTitle, newDiv);
            userAccordion.append(userContainer)
            $(".user-library").append(userAccordion);
        })

    }
    $("#full-library-link").on('click', function () {

        getCurrentSaves();
        if (!$(this).hasClass('active')) {
            userID ? $("#landing").hide() : $("#landing").show();

            $(this).toggleClass('active')
            $(".user-library").empty();
            $("#user-category-dropdown").empty();
            $(".uk-button-danger").show();
            $(".uk-divider-icon").show();
            $("#user-library-link").toggleClass('active')
            $(".library-container").show();
            $(".add-content").show();
            $(".user-library-container").css('display', 'none')
        }
    })

    // $("#sign-up-button").on('click', function (e) {
    //     $(".sign-up-modal").css('display', 'flex');
    //     $(".screen-overlay").css('display', 'flex');
    // });
    // $("#sign-up-cancel").on('click', function (e) {
    //     $(".sign-up-modal").css('display', 'none');
    //     $(".screen-overlay").css('display', 'none');
    // });

    $(document).on('click', "#sign-up-submit", function (e) {

        e.preventDefault();

        if ($("input[name=userName]").val().trim() === "" || $("input   [name=userPassword]").val() === "" || $("input[name=userEmail]").val() === "") {
            $("#sign-up-error").show(200);
        } else {
            $("#sign-up-error").hide();
            $("#sign-up-error-email").hide();
            $("#sign-up-success").show(200);

            var newUser = {
                name: $("input[name=userName]").val().trim(),
                password: $("input[name=userPassword]").val(),
                email: $("input[name=userEmail]").val()
            }
            $.ajax({
                type: "POST",
                url: '/signup',
                data: newUser,
                success: function () {
                    document.location = "/";
                }
            })


            console.log(newUser);
        }
    })

    function getCurrentSaves() {
        $.get(`/api/users/${userID}`, function (err, data) {
            if (err) throw err;
        }).then(resp => {
            userContentArray = [];
            resp.savedLinks.forEach(elem => {
                userContentArray.push(elem.id)
            })
        })
    }


})