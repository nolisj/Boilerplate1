/// <reference path="jquery-1.10.2.js" />
/// <reference path="underscore.min.js" />

// WIZARDSGROUP
(function ($) {
    var wizardsgroup = function(arg) {
        if (!(this instanceof wizardsgroup))
            return new wizardsgroup(arg);

        if (arg instanceof jQuery) {
            this.context = arg;
        } else if (_.isElement(arg)) {
            this.context = $(arg);
        } else if (_.isString(arg)) {
            this.context = $($(arg)[0]);
        } else {
            this.context = arg || $(document);
        }
    };

    wizardsgroup.fn = wizardsgroup.prototype = {};
    window.console.log('wizardsgroup initialized; ' + window.location.href);
    window.wizardsgroup = wizardsgroup;

})(jQuery);

(function ($) {
    $.fn.wg = function (str, data) {
        str = 'wg-' + str;
        if (_.isUndefined(data)) {
            return $(this).data(str);
        }
        else {
            $(this).data(str, data);
        }
    };
})(jQuery);

// JQUERY EXT.
(function ($) {
    var delay = (function () {
        var timer = 0;
        return function (callback, ms) {
            clearTimeout(timer);
            timer = setTimeout(callback, ms);
        };
    })();

    $.fn.filterByText = function (textBox, timeout) {
        return this.each(function () {
            var select = this;
            $(textBox).bind('change keyup', function () {
                var options = [];
                $(select).find('option').each(function () {
                    options.push({ value: $(this).val(), text: $(this).text() });
                });
                delay(function () {
                    var search = $.trim($(textBox).val());
                    var regex = new RegExp(search, 'gi');

                    $.each(options, function (i) {
                        if (options[i].text.match(regex) === null) {
                            $(select).find($('option[value="' + options[i].value + '"]')).hide();
                        } else {
                            $(select).find($('option[value="' + options[i].value + '"]')).show();
                        }
                    });

                }, timeout);
            });
        });
    };

    $.fn.isVisible = function () {
        return !($(this).css('visibility') == 'hidden' || $(this).css('display') == 'none');
    };

    $.fn.sortOptions = function () {
        return this.each(function () {
            $(this).append($(this).find('option').remove().sort(function (a, b) {
                var at = $(a).text(), bt = $(b).text();
                return (at > bt) ? 1 : ((at < bt) ? -1 : 0);
            }));
        });
    };

    $.fn.center = function () {
        this.css("position", "absolute");
        this.css("top", (this.parent().height() - this.height()) / 2 + $(window).scrollTop() + "px");
        this.css("left", (this.parent().width() - this.width()) / 2 + $(window).scrollLeft() + "px");
        return this;
    };

})(jQuery);

// CONFIG
(function (wg, $) {

    wg.fn.config = {
        button: {
            primary: 'btn btn-primary'
        },
        random: {
            length: 20
        },
        menu: {
            id: '#wgMenu'
        },
        modal: {
            id: '#wgModal',
            title: 'Medicard'
        },
        confirm: {
            id: '#wgConfirm',
            title: 'Confirm Message'
        },
        alert: {
            id: '#wgAlert',
            title: 'Alert'
        },
        grid: {
            id: '#wgGrid'
        },
        list: {
            id: '#wgList'
        },
        tab: {
            id: '#wgTab'
        },
        notification: {
            id: '#wgNotification',
            color: {
                green: '#5cb85c',
                blue: '#5bc0de',
                orange: '#f0ad4e',
                red: '#d9534f'
            }
        },
        kendo: {
            textbox: 'kendoAutoComplete',
            combobox: 'kendoComboBox',
            date: 'kendoDatePicker',
            datetime: 'kendoDateTimePicker',
            time: 'kendoTimePicker',
            tabstrip: 'kendoTabStrip',
            number: 'kendoNumericTextBox',
            multiselect: 'kendoMultiSelect',
            masked: 'kendoMaskedTextBox',
            grid: 'kendoGrid',
            panelbar: 'kendoPanelBar'
        }
    };

    wg.fn.message = {
        modal: {
            cancel: {
                warning: 'Are you sure you want to exit without saving?'
            },
            recordSaved: '',
            recordUpdated: ''
        },
        grid: {
            setting: {
                notFound: 'Error: grid setting not found!'
            }
        }
    };

    wg.fn.status = {
        success: 'Success',
        info: 'Info',
        warning: 'Warning',
        failed: 'Failed',
        error: 'Error'
    };

    wg.fn.random = function (int) {
        int = int || wg().config.random.length;
        var text = "wg";
        var letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (var i = 0; i < int; i++) {
            text += letters.charAt(Math.floor(Math.random() * letters.length));
        }
        return text;
    };

    wg.fn.run = function (fn, args) {
        if (_.isFunction(fn)) {
            fn.call((this.context || this), args);
        }
    };

    wg.fn.ready = function (fn) {
        wg().bind('wizardsgroup-ready', fn);
    };

    wg.fn.app = function (fn) {
        wg().bind('wizardsgroup-app', fn);
    };

})(wizardsgroup, jQuery);

// SOURCE
(function (wg, $) {

    wg.fn.source = function (url, options) {
        var _jquery = this.context;

        options = $.extend({},
            {
                transport: {
                    read: {
                        url: url,
                        dataType: 'json'
                    }
                }
            },
            options);
        return new kendo.data.DataSource(options);
    };

})(wizardsgroup, jQuery);

// KENDO
(function (wg, $) {

    var _kendo = wg().config.kendo;

    function Label(j, c) {
        this.element = $(c.find('label[for="' + j.attr('id') + '"]')[0]);
    }

    Label.prototype.show = function () {
        this.element.removeClass('hide');
        return this;
    };

    Label.prototype.hide = function () {
        this.element.addClass('hide');
        return this;
    };

    Label.prototype.text = function (str) {
        if (_.isString(str)) {
            this.element.text(str);
            return this;
        }
        else {
            return this.element.text();
        }
    };

    function Kendo() {
        this.jquery;
        this.type;
        this.container;
        Object.defineProperty(this, 'kendo', {
            get: function () {
                return this.jquery.data(this.type);
            }
        });
        Object.defineProperty(this, 'label', {
            get: function () {
                return new Label(this.jquery, this.container);
            }
        });
    }

    Kendo.prototype.value = function (value) {
        if (_.isUndefined(value)) {
            return this.kendo.value();
        }
        else {
            this.kendo.value(value);
        }
        return this;
    };

    Kendo.prototype.text = function (text) {
        if (_.isUndefined(text)) {
            return this.kendo.text();
        }
        else {
            this.kendo.text(text);
        }
        return this;
    };

    Kendo.prototype.change = function (func) {
        if (_.isFunction(func)) {
            this.kendo.bind('change', func);
        }
        return this;
    };

    Kendo.prototype.hide = function () {
        this.jquery.parents('.k-widget').addClass('hide');
        return this;
    };

    Kendo.prototype.show = function () {
        this.jquery.parents('.k-widget').removeClass('hide');
        return this;
    };

    Kendo.prototype.read = function () {
        this.kendo.dataSource.read();
        return this;
    };

    Kendo.prototype.readonly = function (bool) {
        this.kendo.readonly(bool);
        return this;
    };

    function Combobox(jquery, container) {
        this.jquery = jquery;
        this.type = _kendo.combobox;
        this.container = container || jquery.parents('[data-container]');
        Object.defineProperty(this, 'input', {
            get: function () {
                return this.kendo.input;
            }
        });
    }

    Combobox.prototype = Object.create(new Kendo());

    Combobox.prototype.reset = function () {
        this.kendo.select(-1);
        return this;
    };

    Combobox.prototype.error = function (bool) {
        if (bool == false) {
            this.jquery.parents('.k-widget').find('.k-dropdown-wrap').removeClass('error-field');
        }
        else {
            this.jquery.parents('.k-widget').find('.k-dropdown-wrap').addClass('error-field');
        }
        return this;
    };

    Combobox.prototype.data = function (obj) {
        if (_.isUndefined(obj)) {
            return this.kendo.dataSource._data;
        }
        else {
            this.kendo.setDataSource(new kendo.data.DataSource({
                data: obj
            }));
        }
    };

    wg.fn.combobox = function (options) {
        var _jquery = this.context;
        if (!_.isUndefined(_jquery.wg('kendo'))) {
            return _jquery.wg('kendo');
        }

        var _container = _jquery.parents('[data-container]');
        var _parent = _container.find('#' + _jquery.data('cascadefrom'));

        var combobox = new Combobox(_jquery, _container);
        _jquery.wg('kendo', combobox);

        options = $.extend({},
            {
                index: -1,
                dataTextField: 'Text',
                dataValueField: 'Value'
            }, options);

        options.autoBind = (_jquery.attr('data-autobind') == 'true' ? true : false);

        if (!_.isUndefined(_jquery.data('url'))) {
            options.dataSource = {
                type: 'json',
                transport: {
                    read: wg().url(_jquery.data('url'))
                }
            };
            if (!_.isUndefined(_jquery.data('cascadefrom'))) {
                if (!_.isUndefined(_jquery.data('serverfilter')) && _jquery.data('serverfilter') == false) {
                    // TODO: client side cascading
                }
                else {
                    options.dataSource.transport.parameterMap = function () {
                        return {
                            cascadeFromValue: _container.find('#' + _jquery.data('cascadefrom')).val(),
                            filter: _jquery.data('filter')
                        };
                    };
                    if (_parent.data('wgkendo') == _kendo.combobox) {
                        var parent = _parent.data(_kendo.combobox);
                        if (parent) {
                            parent.bind('cascade', function () {
                                var list = _.filter(parent.dataSource._data, function (item) {
                                    return item.Text == wg(_parent).combobox().text();
                                });
                                if (list.length > 0) {
                                    wg(_jquery).combobox().reset().read();
                                }
                            });
                        }
                    }
                    else {
                        var parent = _parent.data(_parent.data('wgkendo'));
                        parent.bind('change', function () {
                            wg(_jquery).combobox().reset().read();
                        });
                    }
                }
            }
            else {
                options.dataSource.transport.parameterMap = function () {
                    return {
                        filter: _jquery.data('filter')
                    };
                };
            }
        }

        if (!_.isEmpty(_jquery.val()) && !_.isEmpty(_container.find('#' + _jquery.attr('data-cascadefrom')).val())) {
            options.value = _jquery.val();
            options.autoBind = true;
        }
        else {
            if (options.autoBind == false) {
                _jquery.val('');
            }
        }

        options.change = function () {
            var k = _jquery.data(_kendo.combobox);
            var w = wg(_jquery).combobox();
            var text = w.text();
            var list = _.filter(k.dataSource._data, function (item) {
                return item.Text == text;
            });
            if (list.length > 0) {

            } else {
                w.reset();
            }
            w.error(false);
        };
        _jquery.kendoComboBox(options);

        //if (_jquery.attr('data-keyboard') != 'true') {
        //    wg(_jquery).combobox().input.on('keydown', function (e) {
        //        if (e.keyCode != 9) {
        //            e.preventDefault();
        //            wg(_jquery).combobox().open();
        //            return;
        //        }
        //    }).on('contextmenu', function (e) {
        //        e.preventDefault();
        //        return false;
        //    });
        //}

        return combobox;
    };

    function Textbox(jquery, container) {
        this.jquery = jquery;
        this.type = _kendo.textbox;
        this.container = container || jquery.parents('[data-container]');
        Object.defineProperty(this, 'input', {
            get: function () {
                return j;
            }
        });
    }

    Textbox.prototype = Object.create(new Kendo());

    Textbox.prototype.error = function (bool) {
        if (bool == false) {
            this.jquery.parents('.k-widget').removeClass('error-field');
        }
        else {
            this.jquery.parents('.k-widget').addClass('error-field');
        }
        return this;
    };

    function Tabstrip(j) {
        var _index = 0;
        this.add = function (title, url, key, bool) {
            var _kendo = j.data(wg().config.kendo.tabstrip);
            if (j.find('li[data-key="' + key + '"]').length > 0) {
                this.activate(key);
                return;
            }
            _kendo.append(
                    [{
                        text: title + ((bool === false) ? '' : '<span class="ui-icon-close glyphicon glyphicon-remove"></span>'),
                        encoded: false,
                        contentUrl: url
                    }],
                    _kendo.tabGroup.children().eq(0)
                );

            var index = parseInt(j.find('li.k-item').length - 1);
            _kendo.select(index);
            j.find('.k-tabstrip-items li:last-child').attr({ 'data-key': key, 'data-tabindex': _index++ }).find('.k-link span').attr('data-key', key);
            return this;
        };
        this.activate = function (key) {
            var _kendo = j.data(wg().config.kendo.tabstrip);
            var index = 0;
            j.find('li.k-item').each(function (i) {
                if ($(this).data('key') == key) {
                    index = i;
                }
            });
            _kendo.select(index);
            j.find('.k-tabstrip-items .k-state-active').attr('data-tabindex', _index++);
        };
    }

    wg.fn.tabstrip = function (options) {
        var _jquery = this.context;
        if (!_.isUndefined(_jquery.wg('kendo'))) {
            return _jquery.wg('kendo');
        }

        var tabstrip = new Tabstrip(_jquery);
        _jquery.wg('kendo', tabstrip);

        options = $.extend({},
            {
                contentLoad: function (e) {
                    $($(e.contentElement).children()[0]).wrap('<div data-container="tab"></div>');
                    wg(e.contentElement).kendo();
                    $(e.contentElement).find('div[data-wgkendo="grid"]').each(function () {
                        wg(this).grid().load();
                    });
                    wg(_jquery).trigger('tabstrip-' + ($(e.item).text()) + '-load', e.contentElement);
                },
                animation: false
            },
            {

            }, options);

        _jquery.kendoTabStrip(options);

        var _kendo = _jquery.data(wg().config.kendo.tabstrip);
        _jquery.on('click', '.ui-icon-close', function (e) {
            wg().trigger('tabstrip-' + _jquery.attr('id') + '-removed', $(this).parents('li[role="tab"]').data('key'));
            _kendo.remove($(this).parents('li[role="tab"]'));
            var index = 0;
            _jquery.find('li.k-item').each(function () {
                if (index < parseInt($(this).attr('data-tabindex'))) {
                    index = parseInt($(this).attr('data-tabindex'));
                }
            });
            tabstrip.activate(_jquery.find('li[data-tabindex="' + index + '"]').data('key'));
        });

        return tabstrip;
    };

    function PanelBar() {

    }

    wg.fn.panelbar = function (options) {
        var _jquery = this.context;
        if (!_.isUndefined(_jquery.wg('kendo'))) {
            return _jquery.wg('kendo');
        }

        _jquery.wg('kendo', new PanelBar(_jquery));

        var urls = [];
        _jquery.find('li').each(function () {
            urls.push($(this).data('url'));
        });

        options = $.extend({},
            {
                contentLoad: function (e) {
                    wg(e.item).kendo();
                    $(e.item).find('div[data-wgkendo="grid"]').each(function () {
                        wg(this).grid().load();
                    });
                    wg(_jquery).trigger('panelbar-' + ($(e.item).text()) + '-load', e.item);
                },
                animation: true,
                contentUrls: urls,
                collapse: function () {
                    _.delay(function () {
                        wg().iframe().resize();
                    }, 500);
                },
                expand: function () {
                    _.delay(function () {
                        wg().iframe().resize();
                    }, 500);
                }
            },
            {
                expandMode: _jquery.data('expandmode')
            }, options);

        _jquery.kendoPanelBar(options);

        var panel = _jquery.data(_kendo.panelbar);
        panel.expand($('li[data-expanded="true"]'));
    };

    wg.fn.textbox = function (options) {
        var _jquery = this.context;
        if (!_.isUndefined(_jquery.wg('kendo'))) {
            return _jquery.wg('kendo');
        }

        var textbox = new Textbox(this.context);
        _jquery.wg('kendo', textbox);

        options = $.extend({},
            {
                minLength: 1000,
                change: function () {
                    wg(_jquery).textbox().error(false);
                }
            },
            {

            },
            options);

        _jquery.kendoAutoComplete(options);

        return textbox;
    };

    function Masked(jquery, container) {
        this.jquery = jquery;
        this.type = _kendo.masked;
        this.container = container || jquery.parents('[data-container]');
        Object.defineProperty(this, 'input', {
            get: function () {
                return j;
            }
        });
    }

    Masked.prototype.error = function (bool) {
        if (bool == false) {
            this.jquery.parents('.k-widget').removeClass('error-field');
        }
        else {
            this.jquery.parents('.k-widget').addClass('error-field');
        }
        return this;
    };
    wg.fn.masked = function (options) {

        var _jquery = this.context;
        if (!_.isUndefined(_jquery.wg('kendo'))) {
            return _jquery.wg('kendo');
        }

        var masked = new Masked(_jquery);
        _jquery.wg('kendo', masked);

        options = $.extend({},
        {
            change: function () {
                wg(_jquery).masked().error(false);
            }
        },
        {
            mask: _jquery.data('format')
        },
            
        options);

        _jquery.kendoMaskedTextBox(options);
        _jquery.css('width', '100%');

        return masked;
    };

    function Numeric(jquery, container) {
        this.jquery = jquery;
        this.type = _kendo.number;
        this.container = container || jquery.parents('[data-container]');
        Object.defineProperty(this, 'input', {
            get: function () {
                return j;
            }
        });
    }

    Numeric.prototype = Object.create(new Kendo());

    Numeric.prototype.error = function (bool) {
        if (bool == false) {
            this.jquery.parents('.k-numeric-wrap').removeClass('error-field');
        } else {
            this.jquery.parents('.k-numeric-wrap').addClass('error-field');
        }
        return this;
    };

    wg.fn.number = function (options) {

        var _jquery = this.context;
        if (!_.isUndefined(_jquery.wg('kendo'))) {
            return _jquery.wg('kendo');
        }

        var _container = _jquery.parents('[data-container]');
        var _parent = _container.find('#' + _jquery.data('cascadefrom'));

        var number = new Numeric(_jquery, _container);
        _jquery.wg('kendo', number);

        options = $.extend({},
        {
            format: '#,###',
            spinners: true,
            min: 0,
            decimals: 2,
            change: function () {
                wg(_jquery).number().error(false);
            }
        },
        {
            format: _jquery.data('format'),
            spinners: (_jquery.data('spinner') == 'False' || _jquery.data('spinner') == false) ? false : true,
            min: _jquery.data('min'),
            max: _jquery.data('max'),
            decimals: _jquery.data('decimals')
        },
        options);

        if (options.decimals > 0) {
            options.format = options.format + '.';
            _.times(options.decimals, function () {
                options.format = options.format + '0';
            });
        }

        _jquery.kendoNumericTextBox(options);

        return number;
    };

    function Calendar(jquery, container) {
        this.jquery = jquery;
        this.type = _kendo.date;
        this.container = container || jquery.parents('[data-container]');
    }

    Calendar.prototype = Object.create(new Kendo());

    Calendar.prototype.error = function (bool) {
        if (bool == false) {
            this.jquery.parents('.k-picker-wrap').removeClass('error-field');
        } else {
            this.jquery.parents('.k-picker-wrap').addClass('error-field');
        }
        return this;
    };

    Calendar.prototype.min = function (date) {
        this.kendo.min(date);
        return this;
    };

    Calendar.prototype.max = function (date) {
        this.kendo.max(date);
        return this;
    };

    wg.fn.date = function (options) {

        var _jquery = this.context;
        if (!_.isUndefined(_jquery.wg('kendo'))) {
            return _jquery.wg('kendo');
        }

        _jquery.attr('maxlength', 10);
        var _container = _jquery.parents('[data-container]');
        var _parent = _container.find('#' + _jquery.data('cascadefrom'));

        options = $.extend({},
        {
            animation: false,
            format: 'MM/dd/yyyy',
            parseFormats: ['MM/dd/yy'],
            change: function () {
                wg(_jquery).date().error(false);
            }
        },
        {
            format: _jquery.data('format'),
            parseFormats: _jquery.data('parseformats')
        },
        options);

        if (!_.isUndefined(_jquery.data('cascadefrom'))) {
            var parent = wg($(_parent[0])).date();
            if (!_.isNull(parent)) {
                parent.change(function () {
                    var value = parent.value();
                    if (_.isDate(new Date(value))) {
                        var kendo = _jquery.data(_kendo.date);
                        value.setDate(value.getDate() + 1);
                        kendo.min(value);
                        if (new Date(value) >= new Date(kendo.value())) {
                            kendo.value('');
                        }
                    }
                });
            }
        }

        _jquery.kendoDatePicker(options);

        var calendar = new Calendar(_jquery, _container);
        _jquery.wg('kendo', calendar);

        return calendar;
    };

    function Datetime(jquery, container) {
        this.jquery = jquery;
        this.type = _kendo.datetime;
        this.container = container || jquery.parents('[data-container]');
    }

    Datetime.prototype = Object.create(new Kendo());

    Datetime.prototype.error = function (bool) {
        if (bool == false) {
            this.jquery.parents('.k-picker-wrap').removeClass('error-field');
        } else {
            this.jquery.parents('.k-picker-wrap').addClass('error-field');
        }
        return this;
    };

    Datetime.prototype.min = function (date) {
        this.kendo.min(date);
        return this;
    };

    Datetime.prototype.max = function (date) {
        this.kendo.max(date);
        return this;
    };

    wg.fn.datetime = function (options) {

        var _jquery = this.context;
        if (!_.isUndefined(_jquery.wg('kendo'))) {
            return _jquery.wg('kendo');
        }

        _jquery.attr('maxlength', 10);
        var _container = _jquery.parents('[data-container]');
        var _parent = _container.find('#' + _jquery.data('cascadefrom'));

        options = $.extend({},
        {
            animation: false,
            format: 'MM/dd/yyyy HH:mm',
            parseFormats: ['MM/dd/yy HH:mm'],
            change: function () {
                wg(_jquery).datetime().error(false);
            }
        },
        {
            format: _jquery.data('format'),
            parseFormats: _jquery.data('parseformats')
        },
        options);

        if (!_.isUndefined(_jquery.data('cascadefrom'))) {
            var parent = wg($(_parent[0])).datetime();
            parent.change(function () {
                var value = parent.value();
                if (_.isDate(new Date(value))) {
                    var kendo = _jquery.data(_kendo.datetime);
                    value.setDate(value.getDate() + 1);
                    kendo.min(value);
                    if (new Date(value) >= new Date(kendo.value())) {
                        kendo.value('');
                    }
                }
            });
        }

        _jquery.kendoDateTimePicker(options);

        var datetime = new Datetime(_jquery, _container);
        _jquery.wg('kendo', datetime);

        return datetime;
    };

    function Time(jquery, container) {
        this.jquery = jquery;
        this.type = _kendo.time;
        this.container = container || jquery.parents('[data-container]');
    }

    Time.prototype = Object.create(new Kendo());

    Time.prototype.error = function (bool) {
        if (bool == false) {
            this.jquery.parents('.k-picker-wrap').removeClass('error-field');
        } else {
            this.jquery.parents('.k-picker-wrap').addClass('error-field');
        }
        return this;
    };

    Time.prototype.min = function (time) {
        this.kendo.min(time);
        return this;
    };

    Time.prototype.max = function (time) {
        this.kendo.max(time);
        return this;
    };

    wg.fn.time = function (options) {
        
        var _jquery = this.context;
        if (!_.isUndefined(_jquery.wg('kendo'))) {
            return _jquery.wg('kendo');
        }

        _jquery.attr('maxlength', 10);
        var _container = _jquery.parents('[data-container]');
        var _parent = _container.find('#' + _jquery.data('cascadefrom'));

        options = $.extend({},
        {
            animation: false,
            format: 'hh:mm tt',
            change: function () {
                wg(_jquery).time().error(false);
            },
            interval: 60
        },
        {
            format: _jquery.data('format'),
            interval: _jquery.data('interval')
        },
        options);

        if (!_.isUndefined(_jquery.data('cascadefrom'))) {
            var parent = wg($(_parent[0])).time();
            parent.change(function () {
                var value = new Date(parent.value());
                var fromDate = new Date(value);
                if (_.isDate(new Date(value))) {
                    var kendo = _jquery.data(_kendo.time);
                    var toDate = new Date(kendo.value());
                    value.setDate(value.getDate() + 1);
                    kendo.min(value);
                    if (parseInt(fromDate.getHours() * 60 + fromDate.getMinutes()) >= toDate.getHours() * 60 + toDate.getMinutes()) {
                        kendo.value('');
                    }
                }
            });
        }

        _jquery.kendoTimePicker(options);

        var time = new Time(_jquery, _container);
        _jquery.wg('kendo', time);

        return time;
    };

    function Multiselect(jquery, container) {
        this.jquery = jquery;
        this.type = _kendo.multiselect;
        this.container = container || jquery.parents('[data-container]');
    }

    Multiselect.prototype = Object.create(new Kendo());

    Multiselect.prototype.error = function (bool) {
        if (bool == false) {
            this.jquery.parents('.k-widget').removeClass('error-field');
        } else {
            this.parents('.k-widget').addClass('error-field');
        }
        return this;
    };

    wg.fn.multiselect = function (options) {

        var _jquery = this.context;

        if (!_.isUndefined(_jquery.wg('kendo'))) {
            return _jquery.wg('kendo');
        }

        var multiselect = new Multiselect(_jquery);
        _jquery.wg('kendo', multiselect);

        var _container = _jquery.parents('[data-container]');

        options = $.extend({},
        {
            index: -1,
            dataTextField: 'Text',
            dataValueField: 'Value',
            autoBind: true,
            dataSource: {
                type: 'json',
                transport: {
                    read: wg().url(_jquery.data('url'))
                }
            },
            change: function () {
                wg(_jquery).multiselect().error(false);
            },
            value: _.map(_jquery.find('option'), function (ele, i) {
                return $(ele).attr('value');
            })
        },
        {
            autoBind: _jquery.data('autobind')
        },
        options);

        if (!_.isUndefined(_jquery.data('value')) && !_.isEmpty(_container.find('#' + _jquery.attr('data-cascadefrom')).val())) {
            options.autoBind = true;
        }

        if (!_.isUndefined(_jquery.data('cascadefrom'))) {

            var _parent = _container.find('#' + _jquery.data('cascadefrom'));

            if (_parent.data('wgkendo') == _kendo.combobox) {
                var parent = _parent.data(_kendo.combobox);
                if (parent) {
                    parent.bind('cascade', function () {
                        wg(_jquery).multiselect().read();
                    });
                }
            }
            else {
                var parent = _parent.data(_parent.data('wgkendo'));
                parent.bind('change', function () {
                    wg(_jquery).combobox().reset().read();
                });
            }

            options.dataSource.transport.parameterMap = function () {
                return {
                    cascadeFromValue: _container.find('#' + _jquery.data('cascadefrom')).val(),
                    filter: _jquery.data('filter')
                };
            };
        }
        


        _jquery.kendoMultiSelect(options);

        return multiselect;
    };

    wg.fn.kendo = function (fn) {
        var _jquery = this.context;
        _jquery.find('[data-wgkendo="' + _kendo.combobox + '"]').each(function () {
            wg($(this)).combobox();
        });
        _jquery.find('[data-wgkendo="' + _kendo.textbox + '"]').each(function () {
            if ($(this).attr('type') == 'password') {
                wg(this).textbox();
                $(this).attr('type', 'password');
            } else {
                wg(this).textbox();
            }
        });
        _jquery.find('[data-wgkendo="' + _kendo.number + '"]').each(function () {
            wg(this).number();
        });
        _jquery.find('[data-wgkendo="' + _kendo.date + '"]').each(function () {
            wg(this).date();
        });
        _jquery.find('[data-wgkendo="' + _kendo.datetime + '"]').each(function () {
            wg(this).datetime();
        });
        _jquery.find('[data-wgkendo="' + _kendo.time + '"]').each(function () {
            wg(this).time();
        });
        _jquery.find('[data-wgkendo="' + _kendo.multiselect + '"]').each(function () {
            wg(this).multiselect();
        });
        _jquery.find('[data-wgkendo="' + _kendo.masked + '"]').each(function () {
            wg(this).masked();
        });

        _jquery.find('[data-wgbootstrap="dualListBox"]').each(function () {
            wg(this).dualListBox();
        });
        _jquery.find('[data-wgkendo="' + _kendo.panelbar + '"]').each(function () {
            wg(this).panelbar();
        });
        
        wg(_jquery).run(fn);

        if (!_.isUndefined(_jquery.attr('name'))) {
            wg().trigger('kendo-' + _jquery.attr('name') + '-ready');
        }
        else {
            if (_jquery.find('form').length > 0) {
                wg().trigger('kendo-' + _jquery.find('form').attr('name') + '-ready');
            }
        }
    };

})(wizardsgroup, jQuery);

// DUAL LISTBOX
(function (wg, $) {

    function _bind(options, data) {
        data = data || options.source.data();
        var selected = _.map(options.parent.find('select.right-box option'), function (k, i) {
            return { Text: $(k).text(), Value: $(k).attr('value') };
        });
        options.parent.find('select.left-box').html('');
        $.each(data, function (key, item) {
            if (selected.some(function (e) { return e[options.value] === item[options.value] }) === true) {
                if (!options.parent.find('select.right-box option[value="' + item[options.value] + '"]').length > 0) {
                    $('<option>', {
                        value: item[options.value],
                        text: item[options.value]
                    }).appendTo(options.parent.find('select.right-box'));
                }
            }
            else {
                $('<option>', {
                    value: item[options.value],
                    text: item[options.text]
                }).appendTo(options.parent.find('select.left-box'));
            }
        });
    }

    function DualListBox(options) {
        this.load = function (fn) {
            options.source = wg().source(options.url, {
                type: 'json',
                transport: {
                    parameterMap: options.parameterMap,
                    read: {
                        url: wg().url(options.url),
                        dataType: 'json'
                    }
                },
                change: function () {
                    _bind(options, this.data());
                }
            });
            options.source.fetch(function () {
                _bind(options);
                _toggleButtons(options);
                $('#' + options.id).wg('dualListBox', new _dualListBox(options));
                wg().trigger('duallistbox-' + options.parent.find('.right-box').prop('name') + '-load');
                wg().run(fn);
                wg().iframe().resize();
            });
        };

        this.move = function (num) {
            var data = [];
            if (num == 4 || num == 3) {
                if (num == 4) {
                    //options.parent.find('select.right-box option:visible').remove();
                    options.parent.find('select.right-box option:visible').each(function () {
                        data.push({ Text: $(this).text(), Value: $(this).attr('value') });
                        $(this).remove();
                    });
                }
                else {
                    //options.parent.find('select.right-box option:selected').remove();
                    options.parent.find('select.right-box option:selected').each(function () {
                        data.push({ Text: $(this).text(), Value: $(this).attr('value') });
                        $(this).remove();
                    });
                }
                var list = _.map(options.parent.find('select.right-box option'), function (k, i) {
                    return { Text: $(k).text(), Value: $(k).attr('value') };
                });
                options.parent.find('select.left-box option').remove();
                $.each(options.source.data(), function (key, item) {
                    if (list.some(function (e) { return e['Value'] === item['Value'] }) !== true) {
                        $('<option>', {
                            value: item['Value'],
                            text: item['Text']
                        }).appendTo(options.parent.find('select.left-box'));
                    }
                });
                if (!options.parent.find('select.right-box option:visible').length > 0) {
                    options.parent.find('.filter-selected').val('').trigger('change');
                }
                wg().trigger('duallistbox-' + options.parent.find('.right-box').prop('name') + '-right', data);
            }
            else {
                if (num == 2) {
                    //options.parent.find('select.left-box option:selected').remove()
                    //    .appendTo($(options.parent.find('select.right-box')));
                    options.parent.find('select.left-box option:selected').each(function () {
                        data.push({ Text: $(this).text(), Value: $(this).attr('value') });
                        $(this).remove().appendTo($(options.parent.find('select.right-box')));
                    });
                }
                else {
                    //options.parent.find('select.left-box option:visible').remove()
                    //    .appendTo($(options.parent.find('select.right-box')));
                    options.parent.find('select.left-box option:visible').each(function () {
                        data.push({ Text: $(this).text(), Value: $(this).attr('value') });
                        $(this).remove().appendTo($(options.parent.find('select.right-box')));
                    });
                }
                if (!options.parent.find('select.left-box option:visible').length > 0) {
                    options.parent.find('.filter-unselected').val('').trigger('change');
                }
                wg().trigger('duallistbox-' + options.parent.find('.right-box').prop('name') + '-left', data);
            }

            _toggleButtons(options);
        };
    }

    function _dualListBox(options) {
        this.read = function () {
            options.source.read();
        };
    }

    function _toggleButtons(options) {
        options.parent.find('button[data-action]').prop('disabled', true);
        if (options.parent.find('select.right-box option').length > 0) {
            if (options.parent.find('select.right-box option:selected').length > 0) {
                options.parent.find('button[data-action="3"]').prop('disabled', false);
            }
            options.parent.find('button[data-action="4"]').prop('disabled', false);
        }
        if (options.parent.find('select.left-box option').length > 0) {
            if (options.parent.find('select.left-box option:selected').length > 0) {
                options.parent.find('button[data-action="2"]').prop('disabled', false);
            }
            options.parent.find('button[data-action="1"]').prop('disabled', false);
        }
    }

    wg.fn.dualListBox = function (options) {
        var _jquery = this.context;

        if (!_.isUndefined(_jquery.wg('dualListBox'))) {
            return _jquery.wg('dualListBox');
        }

        options = $.extend({}, {
            height: 200,
            titleLeft: 'Record(s) to be assigned',
            titleRight: 'Assigned record(s)',
            timeout: 100,
            text: 'Text',
            value: 'Value'
        }, {
            id: _jquery.attr('id') || _jquery.prop('name'),
            height: _jquery.data('height'),
            url: _jquery.data('url'),
            titleLeft: _jquery.attr('title-left'),
            titleRight: _jquery.attr('title-right'),
            Text: _jquery.data('text'),
            Value: _jquery.data('value')
        }, options);

        options.right = _jquery;
        options.left = $('<select>', {
            class: 'left-box',
            style: 'height:' + (options.height) + 'px; width: 100%',
            multiple: ''
        });
        options.right
            .addClass('right-box')
            .css({ 'height': options.height + 'px', 'width': '100%' }).attr({ 'multiple': '', 'id': options.id });

        var box = new DualListBox(options);

        options.parent = $('<div>', {
            'data-wg': 'dualListBox',
            'class': 'row'
        }).appendTo(_jquery.parent()).append(
            '<div class="col-md-5" style="padding-right:0">' +
            '    <p class="bg-primary" style="padding:10px">' +
            '        <span class="left-title">' + options.titleLeft + '</span>' +
            '    </p>' +
            '    <div class="input-group" style="margin-bottom:5px">' +
            '        <input class="filter form-control filter-unselected" type="text" placeholder="Filter">' +
            '        <div class="input-group-addon"><span class="glyphicon glyphicon-remove cursor-pointer clear-filter"></span></div>' +
            '    </div>' +
                options.left.wrap('<div></div>').parent().html() +
            '</div>' +
            _buttons(options) +
            '<div class="col-md-5" style="padding-left:0">' +
            '    <p class="bg-primary" style="padding:10px">' +
            '        <span class="left-title">' + options.titleRight + '</span>' +
            '    </p>' +
            '    <div class="input-group" style="margin-bottom:5px">' +
            '        <input class="filter form-control filter-selected" type="text" placeholder="Filter">' +
            '        <div class="input-group-addon"><span class="glyphicon glyphicon-remove cursor-pointer clear-filter"></span></div>' +
            '    </div>' +
                options.right.wrap('<div></div>').parent().html() +
            '</div>'
            );

        if (!_.isUndefined(_jquery.data('cascadefrom'))) {
            var parent = $('#' + _jquery.data('cascadefrom'));
            options.parameterMap = parameterMap = function () {
                return {
                    cascadeFromValue: parent.val()
                };
            };
            if (parent.data('wgkendo') == wg().config.kendo.combobox) {
                wg(parent).combobox().change(function () {
                    $('#' + options.id).wg('dualListBox').read();
                });
            }
            else {
                var parent = _parent.data(_parent.data('wgkendo'));
                parent.bind('change', function () {
                    $('#' + options.id).wg('dualListBox').read();
                });
            }
        }
        else {
            options.parameterMap = function () { };
        }

        box.load(function () {
            options.parent.find('select.right-box')
                .filterByText(options.parent.find('.filter-selected'), options.timeout)
                .scrollTop(0)
                .sortOptions();
            options.parent.find('select.left-box')
                .filterByText(options.parent.find('.filter-unselected'), options.timeout)
                .scrollTop(0)
                .sortOptions();
            options.parent.find('.clear-filter').click(function () {
                $(this).parents('.input-group').find('input').val('').trigger('change');
            });
        });

        options.parent.find('button[data-action]').click(function (e) {
            e.preventDefault();
            box.move($(this).data('action'));
        });
        options.parent.on('change', 'select', function () {
            if ($(this).hasClass('right-box')) {
                options.parent.find('button[data-action="3"]').prop('disabled', false);
            }
            else {
                options.parent.find('button[data-action="2"]').prop('disabled', false);
            }
        });

        _jquery.remove();
    };

    function _buttons(options) {
        var div = $('<div>', {
            'class': 'col-md-2 center-block',
            'style': 'margin-top: 90px; padding:0'
        });
        $('<button>', {
            'class': 'btn btn-primary col-md-6 col-md-offset-3',
            'text': '',
            'style': 'margin-bottom: 10px',
            'data-action': '1'
        }).append('<span class="glyphicon glyphicon-forward"></span>').appendTo(div);
        $('<button>', {
            'class': 'btn btn-primary col-md-6 col-md-offset-3',
            'text': '',
            'style': 'margin-bottom: 20px',
            'data-action': '2'
        }).append('<span class="glyphicon glyphicon-triangle-right"></span>').appendTo(div);
        $('<button>', {
            'class': 'btn btn-primary col-md-6 col-md-offset-3',
            'text': '',
            'style': 'margin-bottom: 10px',
            'data-action': '3'
        }).append('<span class="glyphicon glyphicon-triangle-left"></span>').appendTo(div);
        $('<button>', {
            'class': 'btn btn-primary col-md-6 col-md-offset-3',
            'text': '',
            'style': 'margin-bottom: 10px',
            'data-action': '4'
        }).append('<span class="glyphicon glyphicon-backward"></span>').appendTo(div);

        return div.wrap('<div></div>').parent().html();
    }

})(wizardsgroup, jQuery);

// FORM
(function (wg, $) {

    function Form(j) {

        this.submit = function () {
            wg().trigger('form-' + j.attr('name') + '-onsubmit');
            j.find('.filter-selected').val('');
            j.find('select.right-box option').prop('selected', true);
            return wg(j).ajax().submit(wg().url(j.attr('action') || j.data('url')), j.serialize());
        };

        this.kendo = function (fn) {
            wg(j).kendo(fn);
        };
    }

    wg.fn.form = function (name) {
        var _jquery = this.context;

        if (!_.isUndefined(name)) {
            _jquery = $('form[name="' + name + '"]');
        }

        var _form = new Form(_jquery);
        _jquery.wg('form', _form);

        return _form;
    };

})(wizardsgroup, jQuery);

// AJAX
(function (wg, $) {

    function Ajax(options) {

        this.html = function (url, data) {
            var evt = new Evt();
            _ajax($.extend(options, {
                url: url,
                data: data,
                datatype: 'html',
                action: 'html'
            }), evt);
            return evt;
        };

        this.submit = function (url, data) {
            var evt = new Evt();
            _ajax($.extend(options, {
                type: 'POST',
                url: url,
                data: data,
                datatype: 'json',
                action: 'submit'
            }), evt);
            return evt;
        };

        this.json = function (url, data) {
            var evt = new Evt();
            _ajax($.extend(options, {
                url: url,
                data: data,
                datatype: 'json',
                action: 'json'
            }), evt);
            return evt;
        };

        this.get = function (url, data) {
            var evt = new Evt();
            _ajax($.extend(options, {
                type: 'GET',
                url: url,
                data: data,
                action: 'get'
            }), evt);
            return evt;
        };

        this.post = function (url, data) {
            var evt = new Evt();
            _ajax($.extend(options, {
                type: 'POST',
                url: url,
                data: data,
                action: 'post'
            }), evt);
            return evt;
        };

        this.url = function (url, data) {
            var evt = new Evt();
            _ajax($.extend(options, {
                url: url,
                data: data
            }), evt);
            return evt;
        };
    }

    function _ajax(options, evt) {
        var _context = options.context;
        $.ajax(options)
            .done(function (data) {
                if (_context instanceof jQuery) {
                    _context.find('select.selected option').prop('selected', false);
                }

                wg(_context).run(evt._data.then, data);
                if (options.action == 'submit') {
                    wg(options.context).trigger('form-' + options.context.attr('name') + '-submit', data);
                }
                if (data.hasOwnProperty('ActionStatus')) {
                    if (data.ActionStatus == wg().status.success) {
                        wg(_context).run(evt._data.success, data);
                        if (options.action == 'submit') {
                            wg(options.context).trigger('form-' + options.context.attr('name') + '-success', data);
                        }
                    }
                    else if (data.ActionStatus == wg().status.warning) {
                        wg().run(evt._data.warning, data, _context);
                        if (options.action == 'submit') {
                            wg(options.context).trigger('form-' + options.context.attr('name') + '-warning', data);
                        }
                    }
                    else if (data.ActionStatus == wg().status.failed) {
                        wg(_context).run(evt._data.failed, data);
                        if (options.action == 'submit') {
                            wg(options.context).trigger('form-' + options.context.attr('name') + '-failed', data);
                        }
                    }
                }
            })
            .error(function () {
                wg(_context).run(evt._data.error);
                if (options.action == 'submit') {
                    wg(options.context).trigger('form-' + options.context.attr('name') + '-error');
                }
            });
    }

    function Evt() {

        this._data = {
            then: function () { },
            success: function () { },
            warning: function () { },
            failed: function () { },
            error: function () { }
        };

        this.then = function (fn) {
            if (_.isFunction(fn)) {
                this._data.then = fn;
            }
            return this;
        };

        this.success = function (fn) {
            if (_.isFunction(fn)) {
                this._data.success = fn;
            }
            return this;
        };

        this.warning = function (fn) {
            if (_.isFunction(fn)) {
                this._data.warning = fn;
            }
            return this;
        };

        this.failed = function (fn) {
            if (_.isFunction(fn)) {
                this._data.failed = fn;
            }
            return this;
        };

        this.error = function (fn) {
            if (_.isFunction(fn)) {
                this._data.error = fn;
            }
            return this;
        };
    }

    wg.fn.ajax = function (options) {
        return new Ajax($.extend({
            type: 'GET',
            datatype: 'json',
            context: this.context
        }, options));
    };

})(wizardsgroup, jQuery);

// MODAL
(function (wg, $) {

    var _config = {
        id: wg().config.modal.id,
        setting: {
            title: ''
        }
    };

    function Modal(j) {

        _modal.call(this, j);

        this.button = function (text, fn, attr) {
            if (text === false) {
                j.find('.modal-footer').html('');
                return this;
            }
            if (_.isFunction(fn)) {
                j.find('.modal-footer').append($('<button></button>')
                    .text(text)
                    .attr(attr || {})
                    .addClass(wg().config.button.primary)
                    .click($.proxy(fn, this)));
            } else {
                j.find('.modal-footer').append($('<button></button>')
                    .text(text)
                    .attr({ 'data-dismiss': 'modal' })
                    .addClass(wg().config.button.primary));
            }
            return this;
        };
        this.large = function () {
            j.find('.modal-dialog').addClass('modal-lg').removeClass('modal-md').removeClass('modal-sm');
            return this;
        };
        this.medium = function () {
            j.find('.modal-dialog').addClass('modal-md').removeClass('modal-lg').removeClass('modal-sm');
            return this;
        };
        this.small = function () {
            j.find('.modal-dialog').addClass('modal-sm').removeClass('modal-lg').removeClass('modal-md');
            return this;
        };
    }

    function _modal(j) {
        this.title = function (str) {
            j.find('.modal-title').html(str);
            return this;
        };
        this.open = function (fn, options) {
            j.modal($.extend(
                {
                    backdrop: 'static',
                    keyboard: false
                },
                options));

            wg(this).run(fn);
        };
        this.close = function (fn) {
            j.modal('hide');
            wg(this).run(fn);
        };
        this.form = function (name) {
            return wg(j.find('form')).form(name);
        };
        this.html = function (html, fn) {
            //j.find('.modal-body').append(html);
            //wg(j.find('.modal-body')).html(html, fn);
            wg(j.find('.modal-body')).html(html, fn);
        };
        this.block = function () {
            j.find('.modal-footer button, .modal-header button').attr('disabled', 'disabled');
            $(_config.id + ' .modal-body').block();
        };
        this.unblock = function () {
            j.find('.modal-footer button, .modal-header button').removeAttr('disabled');
            $(_config.id + ' .modal-body').unblock();
        };
    }

    var _jquery = $(_config.id);
    _jquery.find('.modal-body').css({ 'min-height': 200 });
    _jquery.wg('modal', new _modal(_jquery));
    var modal = new Modal(_jquery);

    wg.fn.modal = function () {
        return modal;
    };

    $(_config.id).on('shown.bs.modal', function () {
        wg().trigger('modal-bootstrap-open');
        wg().trigger('modal-' + $(this).find('.modal-title').text() + '-open');
        //wg(_config.id).modal().block();
        wg().iframe().resize();
    }).on('hidden.bs.modal', function () {
        wg().trigger('modal-' + $(this).find('.modal-title').text() + '-close');
        wg().trigger('modal-bootstrap-close');
        $(this).find('.modal-title').text('');
        $(this).find('.modal-body').html('');
        $(this).find('.modal-footer').html('');
        $(this).find('.modal-dialog').removeClass('modal-lg').removeClass('modal-md').removeClass('modal-sm').removeAttr('style');
        wg().iframe().resize();
    });

})(wizardsgroup, jQuery);

// CONFIRM
(function (wg, $) {

    var _config = wg().config.confirm;
    var _jquery = $(_config.id);

    wg.fn.confirm = function (msg, fn, title) {

        _jquery.find('.modal-title').html(title || _config.title);
        _jquery.find('.modal-body').html(msg);
        _jquery.find('.modal-footer').html('');

        _jquery.find('.modal-footer')
            .append($('<button></button>')
                .text('Yes')
                .addClass('btn btn-primary')
                .click(function () {
                    _jquery.modal('hide');
                    wg(this).run(fn, true);
                })
            )
            .append($('<button></button>')
                .text('No')
                .addClass('btn btn-primary')
                .click(function () {
                    _jquery.modal('hide');
                    wg(this).run(fn, false);
                })
            );

        _jquery.modal({
            backdrop: 'static',
            keyboard: false
        });
    };

    $(_config).on('show.bs.modal', function () {
        $($('.modal-backdrop')[0]).css('opacity', 0);
    }).on('shown.bs.modal', function () {
        $($('.modal-backdrop')[1]).css('z-index', 1050);
    }).on('hide.bs.modal', function () {
        $($('.modal-backdrop')[0]).css('opacity', 0.5);
    }).on('hidden.bs.modal', function () {
        wg().trigger('modal-' + $(this).find('.modal-title').text() + '-close');
        $(this).find('.modal-title').text('');
        $(this).find('.modal-body').html('');
        $(this).find('.modal-footer').html('');
    });

})(wizardsgroup, jQuery);

// ALERT
(function (wg, $) {

    var _config = wg().config.alert;
    var _jquery = $(_config.id);

    wg.fn.alert = function (msg, fn, title) {

        _jquery.find('.modal-title').html(title || _config.title);
        _jquery.find('.modal-body').html(msg);

        _jquery.find('.modal-footer')
            .append($('<button></button>')
                .text('Close')
                .addClass('btn btn-primary')
                .click(function () {
                    _jquery.modal('hide');
                    wg(this).run(fn);
                })
            );

        _jquery.modal({
            backdrop: 'static',
            keyboard: false
        });
    };

    $(_config.id).on('show.bs.modal', function () {
        $($('.modal-backdrop')[0]).css('opacity', 0);
    }).on('shown.bs.modal', function () {
        $($('.modal-backdrop')[1]).css('z-index', 1050);
    }).on('hide.bs.modal', function () {
        $($('.modal-backdrop')[0]).css('opacity', 0.5);
    }).on('hidden.bs.modal', function () {
        wg().trigger('modal-' + $(this).find('.modal-title').text() + '-close');
        $(this).find('.modal-title').text('');
        $(this).find('.modal-body').html('');
        $(this).find('.modal-footer').html('');
    });

})(wizardsgroup, jQuery);

// GRID
(function (wg, $) {

    var _config = {
        id: wg().config.grid.id,
        setting: {
            grid: {
                pageable: {
                    pageSize: 2,
                    pageSizes: true,
                    refresh: true
                }
            },
            source: {
                type: 'aspnetmvc-ajax',
                pageSize: 2,
                serverPaging: true,
                serverSorting: true,
                serverFiltering: true,
                schema: { data: "Data", total: "Total" }
            }
        }
    };

    wg.fn.grid = function (options) {
        var _jquery = this.context;
        if (_jquery.data(wg().config.kendo.grid)) {
            return _jquery.wg('kendo');
        }

        options = $.extend({},
            {
                height: 228
            },
            {

            }, options);

        _jquery.wg('kendo', new _grid(_jquery));
        return new Grid(_jquery, options);
    };

    function Grid(j, options) {

        this._data = {};

        this.load = function (func) {
            if (j.parent('[data-wrapper="grid"]').length > 0) {
                j.parent('[data-wrapper="grid"]').wrap('<div data-container="grid"></div>');
            }
            else if (j.parent('[data-container="grid"]').length > 0) {

            } else {
                j.wrap('<div data-container="grid"></div>');
            }

            options = $.extend({}, _config.setting.grid, options);
            if (options.pageable) {
                options.pageable.pageSize = j.data('pagesize') || options.pageable.pageSize;
            }

            if (_.has(this._data, 'data')) {
                options.dataSource = this._data.data;
            }
            else {
                var config = {};
                if (j.data('serverpaging') == false) {
                    config.serverPaging = false;
                    config.serverSorting = false;
                    config.serverFiltering = false;
                }
                if (!_.isUndefined(j.data('pagesize'))) {
                    config.pageSize = j.data('pagesize');
                }
                options.dataSource = this.source(wg(j).url(), $.extend(_config.setting.source, config));
            }
            if (_.has(this._data, 'columns')) {
                if (this._data.columns.length > 0) {
                    options.columns = this._data.columns;
                }
                _load(j, options, func);
            }
            else {
                wg().ajax().url('/Json/Grid/' + j.data('grid') + 'Setting.json').then(function (data) {
                    options.columns = _columns(data);
                    _load(j, options, func);
                }).error(function () {
                    wg().notification().show(wg().message.grid.setting.notFound);
                });
            }
        };

        this.columns = function (obj) {
            if (_.isString(obj)) {
                wg().ajax().url(obj).then(function (data) {
                    this._data.columns = data.columns;
                });
            }
            else {
                this._data.columns = obj;
            }
            return this;
        };

        this.data = function (obj) {
            if (_.isString(obj)) {
                this._data.data = this.source(wg().url(obj));
            }
            else {
                this._data.data = obj;
            }
            return this;
        };

        this.source = function (url, opts) {
            opts = $.extend({}, {
                type: 'aspnetmvc-ajax',
                serverPaging: true,
                serverSorting: true,
                serverFiltering: true,
                transport: {
                    read: {
                        url: url,
                        type: "POST",
                        dataType: "json",
                        data: function () {
                            var param = {};
                            j.parents('div[data-container="grid"]').find('[data-param]').each(function () {
                                param[$(this).data('param')] = $(this).data('val') || $(this).val();
                            });
                            if (!_.isUndefined(j.data('parent'))) {
                                param['Parent'] = j.data('parent');
                            }
                            return {
                                args: param
                            };
                        }
                    }
                },
                parameterMap: function (options) {
                    return JSON.stringify(options);
                }
            }, opts);
            return new kendo.data.DataSource(opts);
        };
    }

    function _grid(j) {
        this.refresh = function () {
            var k = j.data(wg().config.kendo.grid);
            k.dataSource.read();
            if (j.find('input[data-action="checkall"]').length > 0) {
                j.find('input[data-action="checkall"]').prop('checked', false);
            }
            return this;
        };
        this.checkedRecords = function () {
            var records = _.map(j.find('input[type="checkbox"][name="checkedRecords"]:checked'), function (i) {
                return $(i).data('uid');
            });
            return records;
        };
    }

    function _load(j, options, func) {
        j.kendoGrid(options);
        wg(this).run(func);

        wg().trigger('grid-' + j.data('grid') + '-load', this);
        var k = j.data(wg().config.kendo.grid);
        k.bind('dataBound', function () {
            wg().trigger('grid-' + j.data('grid') + '-dataBound', k);
        });
    }

    function _columns(data) {
        data = _.each(data.columns, function (val, key) {
            if (_.isObject(val.template)) {
                val.template = _template(val.template);
            }
            return val;
        });
        return data;
    }

    function _template(data) {
        var attr = _.map(data, function (val, key) {
            return (key == 'tag' || key == 'text' || key == 'href') ? '' : " " + key + "=\"" + val + "\"";
        });
        if (data.tag == 'link' || data.tag == 'a') {
            return '<a href="javascript:void(0)"' + attr.join("") + '>' + data.text + '</a>';
        }
        else if (data.tag == 'input') {
            return '<input' + attr.join("") + '/>';
        }
    }

})(wizardsgroup, jQuery);

// BIND
(function (wg, $) {

    wg.fn.unbind = function (evt, fn) {
        var _jquery = this.context;
        if (_.isFunction(fn)) {
            _jquery.unbind(_trim(evt), fn);
        }
        else {
            _jquery.unbind(_trim(evt));
        }
    };

    wg.fn.trigger = function (evt, data) {
        var _jquery = this.context;
        console.info('wizardsgroup().bind(\'' + _trim(evt) + '\', fn)');
        _jquery.trigger(_trim(evt), data || wg);
    };

    wg.fn.bind = function (evt, fn) {
        var _jquery = this.context;
        if (!_.isUndefined(evt) && _.isFunction(fn)) {
            _jquery.bind(_trim(evt), fn);
        }
        return new Bind(_jquery);
    };

    function Bind(j) {

        this.form = function (name) {
            return {
                onsubmit: function (fn) {
                    _bind(j, 'form', name, 'onsubmit', fn);
                    return this;
                },
                submit: function (fn) {
                    _bind(j, 'form', name, 'submit', fn);
                    return this;
                },
                success: function (fn) {
                    _bind(j, 'form', name, 'success', fn);
                    return this;
                },
                warning: function (fn) {
                    _bind(j, 'form', name, 'warning', fn);
                    return this;
                },
                failed: function (fn) {
                    _bind(j, 'form', name, 'failed', fn);
                    return this;
                },
                error: function (fn) {
                    _bind(j, 'form', name, 'error', fn);
                    return this;
                }
            };
        };

        this.modal = function (name) {
            return {
                open: function (fn) {
                    _bind(j, 'modal', name, 'open', fn);
                },
                close: function (fn) {
                    _bind(j, 'modal', name, 'close', fn);
                }
            };
        };

        this.kendo = function (name) {
            return {
                ready: function (fn) {
                    _bind(j, 'kendo', name, 'ready', fn);
                }
            };
        };

        this.grid = function (name) {
            return {
                load: function (fn) {
                    _bind(j, 'grid', name, 'load', fn);
                },
                dataBound: function (fn) {
                    _bind(j, 'grid', name, 'dataBound', fn);
                }
            };
        };

        this.tab = function (name) {
            return {
                ready: function (fn) {
                    _bind(j, 'tab', name, 'ready', fn);
                }
            };
        };

        this.tablist = function (name) {
            return {
                load: function (fn) {
                    _bind(j, 'tablist', name, 'load', fn);
                }
            };
        };

        this.duallistbox = function (name) {
            return {
                load: function (fn) {
                    _bind(j, 'duallistbox', name, 'load', fn);
                },
                left: function (fn) {
                    _bind(j, 'duallistbox', name, 'left', fn);
                },
                right: function (fn) {
                    _bind(j, 'duallistbox', name, 'right', fn);
                }
            };
        };
    }

    function _bind(j, t, i, e, f) {
        if (_.isUndefined(i)) {
            wg().notification().show('Error: missing parameter!');
            return;
        }
        if (_.isString(i))
            i = i.split(',');

        $.each(i, function (index, value) {
            j.bind(_trim(t + '-' + value + '-' + e), f);
        });
    }

    function _trim(str) {
        str = str.toLowerCase().replace(/\s+/g, '');
        return str.replace(/[^\w\s\-]/gi, '');
    }

})(wizardsgroup, jQuery);

// NOTIFICATION
(function (wg, $) {

    if (self != top) {
        wg.fn.notification = function () {
            return parent.window.notification;
        };
    }
    else {

        var _config = wg().config;
        var _color = _config.notification.color;
        var _status = wg().status;
        var _time;
        var _jquery = $(_config.notification.id);

        _jquery.click(function () {
            clearTimeout(_time);
            $(this).slideUp();
        });

        function Notification() {

            this.success = function (msg) {
                _display(_status.success, msg);
            };

            this.info = function (msg) {
                _display(_status.info, msg);
            };

            this.warning = function (msg) {
                _display(_status.warning, msg);
            };

            this.failed = function (msg) {
                _display(_status.failed, msg);
            };

            this.error = function (msg) {
                _display(_status.error, msg);
            };

            this.show = function (msg) {
                _display('show', msg);
            };
            this.result = function (result) {
                if (_.has(result, 'ActionStatus') && _.has(result, 'Messages')) {
                    if (result.ActionStatus == _status.success) {
                        this.success(result.Messages);
                    }
                    else if (result.ActionStatus == _status.info) {
                        this.info(result.Messages);
                    }
                    else if (result.ActionStatus == _status.warning) {
                        this.warning(result.Messages);
                    }
                    else if (result.ActionStatus == _status.failed) {
                        this.failed(result.Messages);
                    }
                    else if (result.ActionStatus == _status.error) {
                        this.error(result.Messages);
                    }
                }
            };
        }

        function _display(status, msg) {

            clearTimeout(_time);

            _jquery.slideUp(function () {

                setTimeout(function () {

                    if (status == _status.success) {
                        _jquery.css({ 'background-color': _color.green });
                    }
                    else if (status == _status.info) {
                        _jquery.css({ 'background-color': _color.blue });
                    }
                    else if (status == _status.warning) {
                        _jquery.css({ 'background-color': _color.orange });
                    }
                    else if (status == _status.failed) {
                        _jquery.css({ 'background-color': _color.orange });
                    }
                    else if (status == _status.error) {
                        _jquery.css({ 'background-color': _color.red });
                    } else {
                        _jquery.css({ 'background-color': 'violet' });
                    }

                    _jquery.text(msg).slideDown();

                }, 300);
            });

            _time = setTimeout(function () {
                _jquery.slideUp(function () {
                    _jquery.text('');
                });
            }, 10000);
        }

        var notification = new Notification();

        wg.fn.notification = function () {
            _jquery.wg('notification', notification);
            return notification;
        };
    }

})(wizardsgroup, jQuery);

// TAB
(function (wg, $) {

    if (self != top) {
        wg.fn.tab = function () {
            return parent.window.tab;
        };
    }
    else {
        var _config = {
            id: wg().config.tab.id,
            iframe: {
                name: 'Tab',
                frameborder: 0,
                scrolling: 'no',
                width: '100%',
                height: 650
            },
            close: '<span class="ui-icon-close glyphicon glyphicon-remove"></span>'
        };
        var _jquery = $(_config.id);
        var _index = 0;
        _jquery.kendoTabStrip($.extend({ animation: false }));
        var _kendo = _jquery.data(wg().config.kendo.tabstrip);

        function Tab() {
            this.add = function (title, url, key, bool) {
                if (_jquery.find('li[data-key="' + key + '"]').length > 0) {
                    _active(key);
                    return;
                }

                _kendo.append(
                        [{
                            text: title + ((bool === false) ? '' : _config.close),
                            encoded: false,
                            content: $('<div></div>').append($('<iframe></iframe>')
                                        .attr($.extend(_config.iframe, { name: title, src: url }))
                                        ).html()
                        }],
                        _kendo.tabGroup.children().eq(0)
                    );

                var index = parseInt(_jquery.find('li.k-item').length - 1);
                _kendo.select(index);

                _jquery.find('.k-tabstrip-items .k-state-active').attr({ 'data-key': key, 'data-tabindex': _index++ }).find('.k-link span').attr('data-key', key);
                return this;
            };
        }

        function _active(key) {
            var index = 0;
            _jquery.find('li.k-item').each(function (i) {
                if ($(this).data('key') == key) {
                    index = i;
                }
            });
            _kendo.select(index);
            _jquery.find('.k-tabstrip-items .k-state-active').attr('data-tabindex', _index++);
        }

        function _remove(key) {
            _jquery.find('li.k-item').each(function () {
                if ($(this).data('key') == key) {
                    _kendo.remove($(this));
                }
            });
            var index = 0;
            _jquery.find('li.k-item').each(function () {
                if (index < parseInt($(this).attr('data-tabindex'))) {
                    index = parseInt($(this).attr('data-tabindex'));
                }
            });
            _active(_jquery.find('li[data-tabindex="' + index + '"]').data('key'));
        }
        var tab = new Tab();

        wg.fn.tab = function (options) {
            return tab;
        };

        _jquery.on('click', 'li.k-item', function (e) {
            $(this).attr('data-tabindex', _index++);
        });
        _jquery.on('click', 'li.k-item .k-link span', function () {
            _remove($(this).attr('data-key'));
        });
    }

})(wizardsgroup, jQuery);

// TABLE
(function (wg, $) {

    wg.fn.table = function () {
        var _jquery = this.context;
        if (!_.isUndefined(_jquery.wg('table'))) {
            return _jquery.wg('table');
        }

        var table = new Table(_jquery);
        _jquery.wg('table', table);
        return table;
    };

    function Table(j) {
        var _list = [];

        this.cell = function (row, column) {
            if (!_.isNumber(column)) {
                column = _index(j, column);
            }
            if (_.isNumber(row) && _.isNumber(column)) {
                _list = j.find('tbody tr:eq(' + (row - 1) + ') td:nth-child(' + column + ')');
            }

            return new _each(_list);
        };

        this.row = function (int) {
            if (_.isNumber(int)) {
                _list = j.find('tbody tr:eq(' + (int - 1) + ') td');
            }

            return {
                each: function (fn) {
                    _list.each(function () {
                        fn(new _each($(this)));
                    });
                }
            };
        };

        this.column = function (str) {
            if (!_.isNumber(str)) {
                str = _index(j, str);
            }
            if (parseInt(str) > 0) {
                _list = j.find('tbody tr td:nth-child(' + str + ')');
            }

            return {
                each: function (fn) {
                    _list.each(function () {
                        fn(new _each($(this)));
                    });
                }
            };
        };
    }

    function _index(j, str) {
        var count = 0;
        var index;
        if (j.parents('[data-role="grid"]').length > 0) {
            j = $(j.parents('[data-role="grid"]').find('.k-grid-header table')[0]);
        }

        j.find('thead tr th').each(function () {
            count++;
            if ($(this).text() == str) {
                index = count;
            }
        });
        return index;
    }

    function _each(col) {
        this.blue = function () {
            col.css({ 'color': 'blue' });
        };
        this.red = function () {
            col.css({ 'color': 'red' });
        };
        this.text = function () {
            return col.text();
        };
        this.row = function () {
            return {
                red: function () {
                    col.parent('tr').css({ 'color': 'red' });
                },
                blue: function () {
                    col.parent('tr').css({ 'color': 'blue' });
                }
            };
        };
    }

})(wizardsgroup, jQuery);

// URL
(function (wg, $) {

    wg.fn.url = function (area, controller, action) {
        var _jquery = this.context;
        if (arguments.length == 0) {
            return '/' + (_jquery.data('url') || '').replace(/^\/|\/$/g, '');
        }
        else if (arguments.length == 1) {
            if (!_.isUndefined(arguments[0])) {
                return '/' + arguments[0].replace(/^\/|\/$/g, '');
            }
            return '/';
        }
        else {
            return '/' + ((area || '') + '/' + (controller || '') + '/' + (action || '')).replace(/\/+/g, '/');
        }
    };

})(wizardsgroup, jQuery);

// HTML
(function (wg, $) {
    wg.fn.html = function (html, func) {
        var _jquery = this.context;
        var wrapper = $('<div>');
        wrapper.html(html);
        wg(wrapper).kendo(function () {
            _jquery.html(wrapper.html());
            _jquery.find('div[data-wgkendo="grid"]').each(function () {
                wg(this).grid().load();
            });
            wg().run(func);
        });
    };
})(wizardsgroup, jQuery);

// APPEND
(function (wg, $) {
    wg.fn.append = function (html, fn) {
        var _jquery = this.context;
        var wrapper = $('<div>');
        wrapper.html(html);
        wg(wrapper).kendo(function () {
            _jquery.append(wrapper.html());
            wg().run(func);
        });
    };
})(wizardsgroup, jQuery);

// AFTER
(function (wg, $) {
    wg.fn.after = function (html, func) {
        var _jquery = this.context;
        var wrapper = $('<div>');
        wrapper.html(html);
        wg(wrapper).kendo(function () {
            _jquery.after(wrapper.html());
            wg().run(func);
        });
    };
})(wizardsgroup, jQuery);

// DOWNLOAD
(function (wg, $) {

    wg.fn.download = function (url) {
        window.open(url, '_self');
        return;
    };

})(wizardsgroup, jQuery);

// BLOCK UI
(function (wg, $) {

    wg.fn.block = function (options) {
        var _jquery = this.context;
        _jquery.css({ 'position': 'relative' });
        _jquery.block($.extend(
            {

            }
        , options));
    };

    wg.fn.unblock = function (fn) {
        var _jquery = this.context;
        _jquery.unblock();
        wg().run(fn);
    };

})(wizardsgroup, jQuery);

// IFRAME
(function (wg, $) {

    if (self != top) {
        wg.fn.iframe = function () {
            return parent.window.iframe;
        };
    }
    else {
        wg.fn.iframe = function () {
            return new Iframe();
        };

        function Iframe() {

            this.resize = function (height) {
                var _jquery = $(wg().config.tab.id).find('.k-state-active iframe');
                height = (height > parseInt($(_jquery).contents().height())) ? height : null;
                _jquery.removeAttr('style');
                _jquery.height((height || parseInt($(_jquery).contents().height())) + 20);
            };
        }
    }

})(wizardsgroup, jQuery);

// SCROLL
(function (wg, $) {
    wg.fn.scrollTo = function (target) {
        var _jquery = $(parent.document).find('html');
        _jquery.animate({
            scrollTop: target.offset().top
        }, 1000);
    };

})(wizardsgroup, jQuery);
(function (wg, $) {
    if (self != top) {
        wg.fn.scroll = function () {
            return parent.window.scroll;
        };
    }
    else {
        wg.fn.scroll = function () {
            return new Scroll();
        };

        function Scroll() {
            this.top = function () {
                $('html, body').animate({
                    scrollTop: $(document).height() - $(window).height()
                },
                   1000
                );
            },
            this.bottom = function () {
                $('html, body').animate({
                    scrollTop: $(document).height() - $(window).height()
                },
                   1000
                );
            };
        }
    }
})(wizardsgroup, jQuery);

// PARENT ID
(function (wg, $) {
    wg.fn.parentID = function (id) {
        $.ajaxSetup({
            data: {
                parentId: id
            }
        });
    };
})(wizardsgroup, jQuery);

String.prototype.toTitle = function () {
    var str = this;
    return (str || '').replace('_', ' ').replace(/[A-Z]/g, function (v, i) {
        return i === 0 ? v.toUpperCase() : ((str[i - 1] || '').match(/[a-z]/) ? ' ' : '') + v.toUpperCase();
    });
};