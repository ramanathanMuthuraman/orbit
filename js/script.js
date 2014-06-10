$(document).ready(function () {

    var el = $("#outerRing");
    var outerRing = {
        width: Math.floor(el.width()),
        height: Math.floor(el.height())

    };

    var section = {
        width: 32,
        height: 32

    };
    var startAngle = 30,
        endAngle = -40;
    var padX = 30,
        padY = 10;
    var left, top;



    var bezier = function (val) {


        var position = $("#" + val).position();


        if (position.left <= outerRing.width * 0.5 && position.top > 0) {
            /*trnsition from bottom center to middle end*/
            left = outerRing.width - section.width - padX;
            top = (outerRing.height * 0.5) - section.height * 0.5 - padY



        }

        if (position.left > outerRing.width * 0.5) {
            /*trnsition from middle end to top centre*/
            left = outerRing.width * 0.5 - section.width * 0.5;
            top = -section.height * 0.5
        }
        if (position.top <= 0) {
            /*trnsition from top centre to middle start*/


            left = padX;
            top = outerRing.height * 0.5 - section.height * 0.5 - padY
        }
        if (position.left <= padX) {

            /*trnsition from middle start to bottom center*/
            left = (outerRing.width * 0.5) - (section.width * 0.5);
            top = outerRing.height - section.height - padY
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
        $("#" + param).removeClass("zindexHigh").addClass("zindexLow");
          /*move the section along the orbit*/
        $("#" + param).stop(true, false).animate({
            path: bezier(param)
        }, 3000, function () {
            /*recursively call the function to loop*/
            run(param);
        });



    };
    var jumpInto = function (position) {
        /*define the initial bezier config values*/
       
        return new $.path.bezier({
            start: {
                x: position.left,
                y: position.top,
                angle: 360
            },
            end: {
                x: position.left,
                y: outerRing.height - section.height - padY,
                angle: 360
            }

        });
    }
    var createSection = function (param) {
        /*show the section*/
        $("#" + param).show();
        /*get the co-ordinate of the section*/
        var coordinates = $("#" + param).position();
        /*
        make the section popup from cap*/
        $("#" + param).animate({
            path: jumpInto(coordinates)
        }, 3000, function () {
          
            /*move the section along the orbit*/
            run($("#" + param).attr("id"));
            /*create the other sections recursively*/
            if($("#" + param).next(".section").attr("id"))
            {
                createSection($("#" + param).next(".section").attr("id"))
            }
                


        });

    }
    var init = function () {
        /*
        position the sections at the centre of the ring
        */
         var hatTop = $(".hat").position().top;
        $(".section").css({
            "top": hatTop,
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