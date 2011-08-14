(function ($) {

    var settings = {
        opacity: 0.8,
        scale: 0.8,
        size: 200,
        src: null
    };

    function Magno(img, options) {
        this._img = img;
        this._options = options;
        this._img.load($.proxy(this._load, this));
    };

    Magno.prototype = {

        _load: function () {
            this._img.css({
                opacity: this._options.opacity,
                width: this._img.width() * this._options.scale,
                height: this._img.height() * this._options.scale
            });
            this._makeMagnifier();
            this._makeEventSource();
        },

        _position: function (e) {
            var offset = this._img.offset();
            var percentageLeft = Math.round(100 * (e.pageX - offset.left) / this._img.width());
            var percentageTop = Math.round(100 * (e.pageY - offset.top) / this._img.height());
            this._magnifier.animate({
                left: e.pageX,
                top: e.pageY,
                "backgroundPosition": percentageLeft + "% " + percentageTop + "%"
            });
        },

        _showMagnifier: function (e) {
            this._magnifier.css({ left: e.pageX, top: e.pageY });
            this._magnifier.animate({ opacity: 1 });
        },

        _hideMagnifier: function (e) {
            this._magnifier.animate({ opacity: 0 });
        },

        _makeEventSource: function () {
            this._eventSource = this._makeEmptyDiv();
            this._eventSource.css({
                position: "absolute",
                left: this._img.offset().left,
                top: this._img.offset().top,
                "z-index": 999,
                width: this._img.width(),
                height: this._img.height()
            });
            this._eventSource.mouseenter($.proxy(this._showMagnifier, this))
                                     .mouseleave($.proxy(this._hideMagnifier, this))
                                     .mousemove(_.debounce($.proxy(this._position, this), 200));
        },

        _makeMagnifier: function () {
            var src = this._options.src || this._img.attr("src");
            this._magnifier = this._makeEmptyDiv();
            this._magnifier.css({
                position: "absolute",
                padding: 0, margin: 0, border: 0,
                left: this._img.offset().left,
                top: this._img.offset().right,
                opacity: 0,
                width: this._options.size,
                height: this._options.size,
                "background-image": "url(" + src + ")",
                "background-repeat": "no-repeat",
                "z-index": 998
            });
        },

        _makeEmptyDiv: function () {
            var div = $("<div><!-- --></div>");
            $("body").append(div);
            return div;
        }
    };

    $.fn.magno = function (options) {
        options = $.extend({}, settings, options);
        return this.each(function () {
            new Magno($(this), options);
        });
    };
})(jQuery);