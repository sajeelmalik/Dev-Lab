$(function () {
    var userID = 1;
    var loggedIn = true;
    var userContentArray = [];
    $.get(`/api/users/${userID}`, function (err, data) {
        if (err) throw err;
    }).then(resp => {
        resp.savedLinks.forEach(elem => {
            userContentArray.push(elem.id)
        })
        console.log(userContentArray);
    })

    $.get('/api/contents', function (err, data) {
            if (err) throw err;
            console.log(data);
        }).then(data => {
            //POPULATES CONCEPT CATEGORIES

            data.forEach(function (concept) {
                var newDiv = $("<div class= 'concept-category'>");
                var linkTitle = $(`<h4>`);
                var dropdownOption = $(`<option value= ${concept.conceptTitle}>`)
                newDiv.data('id', concept.id)
                newDiv.attr('id', 'category-' + concept.conceptTitle)
                linkTitle.text(concept.conceptTitle);
                newDiv.append(linkTitle);
                $(".concept-container").append(newDiv);
                dropdownOption.text(concept.conceptTitle);
                $('#new-concept').append(dropdownOption);

            });
        })
        .catch(err => console.log(err))



    //PAGE LOGIN
    $("#submit-login").on('click', function (e) {
        e.preventDefault();
        var username = $("#login").val();
        var password = $("#password").val();

        $.post('/login', {
            username,
            password
        }, function (data) {
            //data should container userID
            if (data) {
                userID = data;
                loggedIn = true;
            } else {
                //incorrect password
            }
        })
    })
    //ON CLICK OF CONCEPTS, POPULATE CONTENT-ITEMS CONTAINER
    $(document).on('click', ".concept-category", function (e) {
        $(".content-item-container").empty();
        var category = $(this).attr('id');
        category = category.slice(category.indexOf('-') + 1);
        console.log(category);
        $.get('/api/contents/' + category, function (err, data) {
            if (err) throw err;
        }).then(data => {
            //CREATE INDIVIDUAL CONTENT ITEM DIV
            //Items come in an array of objects and come in Most saves, DESC
            var newAccordion = $("<ul uk-accordion>");
            data.forEach(function (item) {
                var newItem = $("<li class=content-item>")
                var linkTitle = $(`<a class="uk-accordion-title" href="#">`); //${item.links}
                var starNumber = $("<span class = star-number>");
                var starImage = $(`<i data-value='${item.saves}' class='fas fa-star star-image'></i>`);
                var newDiv = $("<div class=uk-accordion-content>");
                if (userContentArray.includes(item.id)) starImage.addClass('saved');
                starNumber.text(item.saves);
                starImage.data('id', item.id);
                starNumber.attr('id', 'content-item' + item.id);
                starNumber.append(starImage);
                linkTitle.text(item.contentTitle);
                linkTitle.append(starNumber);
                starNumber.addClass("uk-align-right");

                newItem.append(linkTitle, newDiv);
                newAccordion.append(newItem);
                $(".content-item-container").prepend(newAccordion);
            })
        })
    })

    //ON CLICK LISTENER FOR SAVING CONTENT
    $(document).on('click', ".star-image", function (e) {
        console.log(this);
        var starID = $(this).data('id');
        //IF CONTENT IS BEING UNSAVED
        if ($(this).hasClass('saved')) {
            $(this).removeClass('saved');
            this.previousSibling.nodeValue--;
            $.ajax(`/api/delete/${userID}/${starID}`, {
                method: 'DELETE'
            })

        } else {
            this.previousSibling.nodeValue++;
            //IF CONTENT IS BEING SAVED
            $(this).addClass('saved')
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
        var createObj = {
            content: $("#new-link").val(),
            title: $("#new-name").val(),
            category: $("#new-concept").val(),

        }
        $.post('/api/concept/new', createObj, function () {
            //modal pop up - successfully submitted
        })

    })


    if (loggedIn) {
        $("#user-library-link").on('click', function () {
            if (!$(this).hasClass('active')) {
                $(this).toggleClass('active');
                $("#landing").hide();
                $(".uk-button-danger").hide();
                $(".uk-divider-icon").hide();
                $("#full-library-link").toggleClass('active');
                $(".library-container").hide();
                $(".add-content").hide();
                $(".user-library-container").css('display', 'block');
                $.get(`/api/users/${userID}`, function (err, data) {
                    if (err) throw err;

                }).then(data => {
                    console.log('data', data);
                    data.savedLinks.forEach(elem => {
                        var dropdownOption = $(`<option value=${elem.conceptTitle}>`)
                        dropdownOption.text(`${elem.conceptTitle}`)
                        $("#user-category-dropdown").append(dropdownOption);
                        var userMain = $("<div class='user-main'>");
                        var userSaves = $(`<span class='star-number'>${elem.saves}</span>`);
                        var userDate = $("<div class='user-date'>");
                        var userImage = $(`<i data-value='${elem.saves}'class='fas fa-star star-image'></i>`);
                        if (userContentArray.includes(elem.id)) userImage.addClass('saved');
                        userMain.text(elem.contentTitle)
                        userImage.data('id', elem.id)
                        userSaves.append(userImage)
                        userDate.text(elem.createdAt)
                        $(".user-library-container").append(userMain, userSaves, userDate);
                    })


                })
            }
        })
    }
    $("#full-library-link").on('click', function () {
        if (!$(this).hasClass('active')) {
            $(this).toggleClass('active')
            $(".user-library-container").empty();
            $("#user-category-dropdown").empty();
            $("#landing").show();
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
    })
    $("#sign-up-cancel").on('click', function (e) {
        $(".sign-up-modal").css('display', 'none');
        $(".screen-overlay").css('display', 'none');
    })
    $("#sign-up-submit").on('click', function (e) {
        e.preventDefault();
        var newUser = {
            userName: $("input[name=userName]").val(),
            userPassword: $("input[name=userPassword]").val(),
            userEmail: $("input[name=userEmail]").val()
        }
        $.post('/api/new/users', newUser, function (resp) {
            console.log(resp);
            $("#sign-up-submit").css('display', 'none')
            $(".sign-up-modal").html(
                `Thank you ${resp.userName}! You've successfully signed up for DevLab. Please log in with your email ${resp.userEmail}`
            )
            $(document).on("click", ".sign-up-modal", () => {
                $(".sign-up-modal").css('display', 'none');
                $(".screen-overlay").css('display', 'none');

            })
        })


        console.log(newUser);
    })


})