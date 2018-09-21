$(function () {

    var userID = Cookies.get('userid');
    var userContentArray = [];
    getCurrentSaves();

    if (userID) {

        // SHOW WELCOME SCREEN TO USER
        $.get(`/api/users/${userID}`, function (err, data) {
            if (err) throw err;
        }).then(data => {
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
                $("#landing").removeClass("uk-animation-slide-top-small");
                $("#landing").addClass("uk-animation-fade uk-animation-reverse uk-animation-slow");
                $("#background-overlay").addClass("uk-animation-fade uk-animation-reverse uk-animation-slow");
                setTimeout(function () {
                    $("#background-overlay").hide(900);
                    $("#landing").hide(900)
                    $('#add-content-button').prop('disabled', false);

                    //Quick fix to force the page to scroll, allowing the UIKit animations to trigger
                    setTimeout(function () {
                        $(this).scrollTop(20);
                        $(this).scrollTop(0);
                    }, 1100);
                }, 1000);

            }, 5000);

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

        $("#add-content-button").attr("uk-tooltip", "title: Log-In to DevLab to share your favorite resources!; pos: bottom; delay: 200")
        $("#user-library-link").attr("uk-tooltip", "title: Log-In to DevLab to save your favorite resources!; pos: bottom; delay: 200")


    }

    //PAGE LOGIN
    $("#submit-login").on('click', function (e) {
        e.preventDefault();
        var email = $("#username").val();
        var password = $("#password").val();
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
        }, function (data) {
            // console.log(data);
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
                var dropdownOption = $(`<option value= "${concept.conceptTitle}">`)
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


    //ON CLICK OF CONCEPTS CATEGORY, POPULATE CONTENT-ITEMS CONTAINER
    $(document).on('click', ".concept-category", function (e) {
        $(".content-title").removeClass("content-active");
        $(this).children("h4").toggleClass("content-active");

        $(".content-item-container").empty();
        var category = $(this).attr('id');
        category = category.slice(category.indexOf('-') + 1);
        // console.log(category);
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
                if (userContentArray.includes(item.id) && userId) starImage.addClass('saved')
                starNumber.text(item.saves);
                starNumber.attr('id', 'content-item' + item.id);
                starNumber.append(starImage);
                linkTitle.text(item.contentTitle);
                linkTitle.append(starNumber);
                starNumber.addClass("uk-align-right");
                itemLinks.append(item.links);
                itemLinks.attr('href', item.links)
                itemLinks.attr('target', '_blank')
                itemBody.append(item.contentBody);
                newDiv.append(itemLinks, itemBody);
                newItem.append(linkTitle, newDiv);
                newAccordion.append(newItem);
            })
            $(".content-item-container").prepend(newAccordion);
        })
    })

    //ON CLICK LISTENER FOR SAVING CONTENT
    //Also used in the User Library
    $(document).on('click', ".star-image", function () {
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
            if (userID) {
                matchingStars.forEach(node => node.classList.add('saved'))
                this.previousSibling.nodeValue++;
                $.ajax(`/api/users/${userID}`, {
                    method: 'PUT',
                    data: {
                        contentId: starID
                    }
                })
            }
        }

    })

    //ADD NEW CONTENT
    $("#submit-content").on('click', function (e) {
        e.preventDefault();

        if ($("#new-name").val().trim() === "" || $("#new-link").val() === "" || $("#new-desc").val() === "") {
            $("#add-error").show(200);
        } else if (!$("#new-link").val().includes(".")) {
            $("#add-error-URL").show(200);
        } else {
            $("#add-error").hide();
            $("#add-error-URL").hide();
            $("#add-success").show(200);
            // $(this).attr("uk-toggle","target: #add-content-slider");
            // $("#add-content-slider").toggle(300);
            // $("body").removeClass("uk-offcanvas-container");
            // $("body").removeClass("uk-offcanvas-overlay");
        }

        var createObj = {
            conceptTitle: $("#new-concept").val(),
            links: $("#new-link").val(),
            contentTitle: $("#new-name").val(),
            contentBody: $("#new-desc").val(),
            saves: 0

        }
        $.post('/api/new/contents', createObj)

    })

    //GENERATE ALERTS BASED ON USER'S ADD CONTENT INPUT
    $(document).on("change", ".content-input", function () {
        if ($("#new-name").val().trim() !== "" && $("#new-link").val().includes(".") && $("#new-desc").val() !== "") {
            console.log("You're good to go to add content!")
            $("#submit-content").attr("uk-toggle", "target: #add-content-slider");
        }
    });

    //USER LIBRARY
    if (userID) {
        $("#user-library-link").on('click', function () {
            $("#landing").hide();
            $("#background-overlay").hide();
            //Prevents reloading active pages and hides elements on the full library page
            if (!$(this).hasClass('active')) {
                $(this).toggleClass('active');
                $("#landing").hide();
                $(".uk-button-danger").hide();
                $(".uk-divider-icon").hide();
                $("#full-library-link").toggleClass('active');
                $(".library-container").hide();
                $(".add-content").hide();
                $(".user-library-container").css('display', 'flex');

                //Create User Content Divs
                $.get(`/api/users/${userID}`, function (err) {
                    if (err) throw err;
                }).then(data => {
                    userCategoryArray = [];
                    //In order to ensure unique entires, we used an array to filter out repeated categories.
                    data.savedLinks.forEach(item => {
                        if (!userCategoryArray.includes(item.conceptTitle)) {
                            userCategoryArray.push(item.conceptTitle)
                        }

                    })
                    //Adds the ALL selector then popoulates dropdown with user categories
                    var dropdownOption = $(`<option value="ALL">`)
                    dropdownOption.text('ALL');
                    $("#user-category-dropdown").append(dropdownOption)
                    userCategoryArray.forEach((categoryTitle) => {
                        dropdownOption = $(`<option value="${categoryTitle}">`)
                        dropdownOption.text(categoryTitle);
                        $("#user-category-dropdown").append(dropdownOption)
                    })

                    createUserLibrary(data)
                })


            }
        })

    }

    //Toggles class names for ascending and descending
    $(".category-dropdown button").on('click', function () {
        if ($(this).attr('uk-filter-control') === "sort: data-saves; order: asc") {
            $(this).attr('uk-filter-control', "sort: data-saves; order: desc")
        } else {
            $(this).attr('uk-filter-control', "sort: data-saves; order: asc")
        }
    })

    //On selection of user category, populate user-library with selected category
    $("#user-category-dropdown").on('change', function () {
        $.get(`/api/users/${userID}/category/?category=${$(this).val()}`, (err) => {
                if (err) throw err;
            })
            .then(data => {
                if ($(this).val() !== 'ALL') {
                    //Formats return value to fit createUserLibrary function
                    var tempObj = {
                        savedLinks: []
                    }
                    data.forEach(obj => {
                        tempObj.savedLinks.push(obj)
                    })
                    console.log('categories', tempObj);
                    createUserLibrary(tempObj)
                } else {
                    createUserLibrary(data)
                }
            })
    })


    function createUserLibrary(data) {
        $('.user-library').empty()
        $('.user-library-container').attr('uk-filter', "target: .js-filter")
        console.log('SAVED', data);
        userContentArray = [];
        var userAccordion = $("<ul class='js-filter' uk-accordion uk-scrollspy='target: > li ; cls:uk-animation-slide-right-medium; delay: 100'>");
        if (data.savedLinks.length > 0) {
            data.savedLinks.forEach(elem => {
                userContentArray.push(elem.id);
                var createdDate = elem.User_Content.createdAt;
                //Data attributes used by UI-Kit's Sorting function
                var userContainer = $(`<li data-saves='${elem.saves}' data-date='${moment(createdDate).format('YYYY-MM-DD, hh:mm:ss')}'class='user-content-container'>`);
                var userTitle = $("<a class='uk-accordion-title user-title'>");
                var userSaves = $(`<span class='star-number uk-align-right'>${elem.saves} </span>`);
                var userDate = $("<span class='user-date uk-align-right'>");
                var userImage = $(`<i data-id='${elem.id}' data-value='${elem.saves}'class='fas fa-star star-image'></i>`);
                if (userContentArray.includes(elem.id)) userImage.addClass('saved');
                userTitle.text(elem.contentTitle);
                userSaves.append(userImage);
                userDate.append(moment(createdDate).format('MM DD YYYY'))
                var newDiv = $("<div class=uk-accordion-content>");
                var userLinks = $("<a>");
                var userBody = $("<p>");
                userLinks.append(elem.links);
                userLinks.attr('href', elem.links)
                userLinks.attr('target', '_blank')
                userBody.append(elem.contentBody);
                newDiv.append(userLinks, userBody);
                userTitle.append(userSaves, userDate)
                userContainer.append(userTitle, newDiv);
                userAccordion.append(userContainer)
            })
        }
        $(".user-library").append(userAccordion);

    }


    $("#full-library-link").on('click', function () {
        getCurrentSaves();
        if (!$(this).hasClass('active')) {
            userID ? $("#landing").hide() : $("#landing").show();
            $(this).toggleClass('active')
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