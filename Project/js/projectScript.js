"use strict"

/******** Hamburger nav-bar functionality *********/

$(function() {
    $(".toggle").on("click", function() {
        if($(".item").hasClass("active")) {
            $(".item").removeClass("active");
        }
        else {
            $(".item").addClass("active");
        }
    })
});
