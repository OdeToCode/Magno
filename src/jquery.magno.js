//
// magno 0.0.1
// Copyright (c) 2011 K. Scott Allen OdeToCode LLC
// Freely distributable under the MIT license.
// http://www.opensource.org/licenses/MIT
//
// requires: jQuery
//           Underscore
//           jQuery.backgroundPosition

if(!jQuery) {
    throw "jQuery required";
}

if(!_) {
    throw "Underscore.js required";
}

if (!$.fx.step.backgroundPosition) {
    throw "jQuery.backgroudPosition required";
}

(function ($) {

    $.fn.magno = function (options) {

        var img = $(this);
        var magnifier = null;
        var settings = {
            opacity: 0.8,
            scale: 0.8,
            size: 200,
            src: null
        };        

        function onLoad() {
            img.css({
                opacity: settings.opacity,
                width: img.width() * settings.scale,
                height: img.height() * settings.scale
            });
            makeMagnifier();
            makeEventSource();
        }
        
        function makeMagnifier() {
            var src = settings.src || img.attr("src");
            magnifier = makeEmptyDiv();
            magnifier.css({
                position: "absolute",
                padding: 0, margin: 0, border: 0,
                left: img.offset().left,
                top: img.offset().right,
                opacity: 0,
                width: settings.size,
                height: settings.size,
                "background-image": "url(" + src + ")",
                "background-repeat": "no-repeat",
                "z-index": 998
            });
        }
        
        function makeEventSource() {
            var eventSource = makeEmptyDiv();
            eventSource.css({
                position: "absolute",
                left: img.offset().left,
                top: img.offset().top,
                "z-index": 999,
                width: img.width(),
                height: img.height()
            });
            eventSource.mouseenter(showMagnifier)
                       .mouseleave(hideMagnifier)
                       .mousemove(_.debounce(position, 200));
        }
        
        function showMagnifier(e) {
            magnifier.css({ left: e.pageX, top: e.pageY });
            magnifier.animate({ opacity: 1 });
        }
        
        function hideMagnifier() {
            magnifier.animate({ opacity: 0 });   
        }
               
        function position(e) {
            var offset = img.offset();
            var percentageLeft = Math.floor(100 * (e.pageX - offset.left) / img.width());
            var percentageTop = Math.floor(100 * (e.pageY - offset.top) / img.height());
            magnifier.animate({
                left: e.pageX - (settings.size/2),
                top: e.pageY - (settings.size/2),
                "backgroundPosition": percentageLeft + "% " + percentageTop + "%"
            });
        }
        
        function makeEmptyDiv() {
            var div = $("<div><!-- --></div>");
            $("body").append(div);
            return div;
        }
                
        $.extend(settings, options);
        
        return this.each(function () {            
            img.load(onLoad);
        });
    };
    
})(jQuery);