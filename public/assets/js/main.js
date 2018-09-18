$(function () {
    var userID;
    var loggedIn = true;
    var userContentArray = [];
    $.get('/api/users/1', function (err, data) {
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
                $('select').append(dropdownOption);
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
                var starImage = $("<i class='fas fa-star star-image'></i>");
                var newDiv = $("<div class=uk-accordion-content>");

                if (userContentArray.includes(item.id)) starImage.addClass('saved');
                starNumber.text(item.saves);
                linkTitle.data('id', item.id);
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
        var starID = $(this).parent().data('id');
        var temp = $(`#content-item${starID}`).text()
        temp = parseInt(temp);
        //IF CONTENT IS BEING UNSAVED
        if ($(this).hasClass('saved')) {
            $(this).removeClass('saved');
            $(`#content-item${starID}`).text(temp - 1)
            $.ajax(`/api/delete/${userID}/${starID}`, {
                method: 'DELETE'
            })
            $.post('/user/resources/new/' + starID)

        } else {
            $(`#content-item${starID}`).text(temp + 1)
            //IF CONTENT IS BEING SAVED
            $(this).addClass('saved')
            $.ajax(`/api/save/${userID}/${starID}`, {
                method: 'POST'
            })
        }

    })

    //ADD NEW CONTENT
    $("#submit-content").on('click', function (e) {
        e.preventDefault();
        var createObj = {
            content: $("#new-link").val(),
            title: $("#new-name").val(),
            category: $("select").val(),

        }
        $.post('/api/concept/new', createObj, function () {
            //modal pop up - successfully submitted
        })

    })


    if (loggedIn) {
        $("#user-library-link").on('click', function () {
            if (!$(this).hasClass('active')) {
                $(this).toggleClass('active');
                $("#full-library-link").toggleClass('active');
                $(".library-container").hide();
                $(".add-content").hide();
                $(".user-library-container").css('display', 'block')
                $.get(`/api/${userID}`, function (err, data) {
                    if (err) throw err;
                    //generate library div populated with 
                })
            }
        })
    }
    $("#full-library-link").on('click', function () {
        if (!$(this).hasClass('active')) {
            $(this).toggleClass('active')
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