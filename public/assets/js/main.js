$(function () {

    var userID = Cookies.get('userid');
    var userContentArray = [];
    getCurrentSaves();

    if (userID) {
        $("#background-overlay").hide();
        $("#landing").hide()
        //Create Logout Button
        $("#login-link").hide();
        $("#sign-up-nav-button").hide();
        var logoutLink = $("<a class='uk-button' href='/signout' id='logout-link' uk-scroll>Logout</a>");
        $("#nav-right").html(logoutLink);

    } else {
        $("#navbar").attr('uk-sticky', 'cls-inactive: uk-hidden; top: 300')
        $('#add-content-button').prop('disabled', true);
        $("#login-link").show();
        $("#sign-up-nav-button").show();
        $("#logout-link").hide();

        $("#add-content-button").hover(function () {
            console.log("test");
            $("#add-content-button").text("Login to DevLab to add your favorite resources!");
        })
    }

    //PAGE LOGIN
    $("#submit-login").on('click', function (e) {
        e.preventDefault();
        var email = $("#username").val();
        var password = $("#password").val();
        console.log("sign in" + email);
        $.ajax({
            type: "POST",
            url: '/signin', 
            data: {
            email: email,
            password: password
            },
            success: function() {   
                location.reload();  
            }
        })
    })

    $(document).on("click", "#logout-link", function(e){
        $.ajax({
            type: "GET",
            url: "/signout",
            success: function(){
                location.reload();
            }
        })
    })

    //POPULATES CONCEPT CATEGORIES
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
                }).then(data => {
                    userContentArray = [];
                    data.savedLinks.forEach(elem => {
                        userContentArray.push(elem.id);
                        var dropdownOption = $(`<option value=${elem.conceptTitle}>`);
                        dropdownOption.text(`${elem.conceptTitle}`);
                        $("#user-category-dropdown").append(dropdownOption);
                        var userContainer = $("<div class='user-content-container'>");
                        var userTitle = $("<div class='user-title'>");
                        var userSaves = $(`<span class='star-number'>${elem.saves}</span>`);
                        var userDate = $("<div class='user-date'>");
                        var userImage = $(`<i data-id='${elem.id}' data-value='${elem.saves}'class='fas fa-star star-image'></i>`);
                        if (userContentArray.includes(elem.id)) userImage.addClass('saved');
                        userTitle.text(elem.contentTitle);
                        userSaves.append(userImage);
                        var createdDate = elem.createdAt;
                        userDate.append(moment(createdDate).format('MM DD YYYY'))
                        $(userContainer).append(userTitle, userSaves, userDate);
                        $(".user-library").append(userContainer);
                    })


                })
            }
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

    $("#sign-up-button").on('click', function (e) {
        $(".sign-up-modal").css('display', 'flex');
        $(".screen-overlay").css('display', 'flex');
    });
    $("#sign-up-cancel").on('click', function (e) {
        $(".sign-up-modal").css('display', 'none');
        $(".screen-overlay").css('display', 'none');
    });
    $("#sign-up-submit").on('click', function (e) {
        e.preventDefault();
        var newUser = {
            name: $("input[name=userName]").val(),
            password: $("input[name=userPassword]").val(),
            email: $("input[name=userEmail]").val()
        }
        $.ajax({
            type: "POST",
            url: '/signup', 
            data: newUser,
            success: function() {   
                location.reload();  
            }
        })


        console.log(newUser);
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