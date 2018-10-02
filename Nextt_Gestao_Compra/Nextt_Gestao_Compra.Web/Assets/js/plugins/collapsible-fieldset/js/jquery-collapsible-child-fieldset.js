(function ($, window, undefined) {
    function hideFieldsetContent(obj, options) {
        if (options.animation) {
            obj.children("*:not('legend')").slideUp(options.speed, function () {
                obj.trigger("update");
            });
        }
        else {
            obj.children("*:not('legend')").hide();
        }
        obj.removeClass("expanded").addClass("collapsed");
        obj.children("*:not('legend')").attr("aria-expanded", "false");

        if (!options.animation) {
            obj.trigger("update");
        }
    }

    function showFieldsetContent(obj, options) {
        if (options.animation) {
            obj.children("*:not('legend')").slideDown(options.speed, function () {
                obj.trigger("update");
            });
        }
        else {
            obj.children("*:not('legend')").show();
        }

        obj.removeClass("collapsed").addClass("expanded");
        obj.children("*:not('legend')").attr("aria-expanded", "true");
        if (!options.animation) {
            obj.trigger("update");
        }
    }

    function doToggle(fieldset, setting) {
        if (fieldset.hasClass('collapsed')) {
            showFieldsetContent(fieldset, setting);
        }
        else if (fieldset.hasClass('expanded')) {
            hideFieldsetContent(fieldset, setting);
        }
    }

    $.fn.coolfieldset = function (options) {
        var setting = { collapsed: false, animation: true, speed: 'medium' };
        $.extend(setting, options);

        return this.each(function () {
            var fieldset = $(this);
            var legend = fieldset.children('legend');

            var content = fieldset.children("*:not('legend')")
            content.wrapAll('<div class="wrapperFieldSet"></div>');

            if (setting.collapsed) {
                hideFieldsetContent(fieldset, { animation: false });
            }
            else {
                fieldset.addClass("expanded");
            }

            legend.bind("click", function () { doToggle(fieldset, setting) });

            return fieldset;
        });
    }
})(jQuery, window);