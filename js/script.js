$(document).ready(function () {

    var el = $("#ring-top");
    var outerRing = {
        width: Math.floor(el.width()),
        height: Math.floor(el.height() * 2)

    };

    var section = {
        width: 32,
        height: 32

    };
    var startAngle = 10,
        endAngle = -20;
    var padX = 10,
        padY = 10;
    var left, top;



    var bezier = function (val) {


        var position = $("#" + val).position();


        if (position.left <= outerRing.width * 0.5 && position.top > 0) {
            $("#" + val).find("img").removeClass("zindexLowest").addClass("zindexMedium");
            startAngle = 10,
                endAngle = -20;
            /*transition from bottom center to middle end*/
            left = outerRing.width - section.width - padX;
            top = (outerRing.height * 0.5) - (section.height)



        }

        if (position.left > outerRing.width * 0.5) {
            $("#" + val).find("img").removeClass("zindexMedium").addClass("zindexLowest");
            startAngle = 30,
                endAngle = 0;
            /*transition from middle end to top centre*/
            left = outerRing.width * 0.5 - section.width * 0.5;
            top = -section.height;
        }
        if (position.top <= 0) {
            $("#" + val).find("img").removeClass("zindexMedium").addClass("zindexLowest");
            /*transition from top centre to middle start*/
            startAngle = 0,
                endAngle = -30;

            left = padX;
            top = outerRing.height * 0.5 - section.height;
        }
        if (position.left <= padX) {
            $("#" + val).find("img").removeClass("zindexLowest").addClass("zindexMedium");
            startAngle = 20,
                endAngle = -10;

            /*transition from middle start to bottom center*/
            left = (outerRing.width * 0.5) - (section.width * 0.5);
            top = outerRing.height - section.height - padY;
        }

        /*
        bezier param for section orbiting
        */
        return new $.path.bezier({
            start: {
                x: position.left,
                y: position.top,
                angle: startAngle
            },
            end: {
                x: left,
                y: top,
                angle: endAngle
            }

        });

    };
    var run = function (param) {
        /*toggle the zindex class*/
        $("#" + param).find("img").removeClass("zindexHigh").addClass("zindexMedium");
        /*move the section along the orbit*/
        $("#" + param).stop(true, false).animate({
            path: bezier(param)
        }, 3000, function () {
            /*recursively call the function to loop*/
            run(param);
        });



    };
    var jumpInto = function (param, endY) {
        /*define the initial bezier config values*/
        var position = $("#" + param).position();
        return new $.path.bezier({
            start: {
                x: position.left,
                y: position.top,
                angle: 360
            },
            end: {
                x: position.left,
                y: endY,

                angle: 360
            }

        });
    }
    var createSection = function (param) {
        /*show the section*/
        $("#" + param).show();
        /*get the co-ordinate of the section*/

         /*make the section popup from cap*/
        $("#" + param).animate({
            path: jumpInto(param, -100)
        }, 1500, function () {
  

           
            $("#" + param).find("img").removeClass("zindexMedium").addClass("zindexHigh");
            $("#" + param).animate({
                path: jumpInto(param, outerRing.height - section.height - padY)
            }, 1500, function () {
                $("#" + param).find(".title").slideDown("slow");
                /*move the section along the orbit*/
                run($("#" + param).attr("id"));
                /*create the other sections recursively*/
                if ($("#" + param).next(".section").attr("id")) {
                    createSection($("#" + param).next(".section").attr("id"))
                }



            });
        });

    }
    var init = function () {
            /*
        position the sections at the centre of the ring
        */
            $(".title").hide();
            $(".section").css({
                    "top": 0,
                    "left": outerRing.width * 0.5 - section.width * 0.5
                })
                /*
        pass the first section ID
        */
            createSection($(".section").eq(0).attr("id"));
        }
        /*
    start the animation
    */
    init();
}); 