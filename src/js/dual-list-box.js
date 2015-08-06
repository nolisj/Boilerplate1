/**
 * jQuery DualListBox plugin with Bootstrap styling v1.0
 * http://www.geodan.nl
 *
 * Copyright (c) 2014 Geodan B.V.
 * Created by: Alex van den Hoogen
 *
 * Usage:
 *   Create a <select> and apply this script to that select via jQuery like so:
 *   $('select').DualListBox(); - the DualListBox will than be created for you.
 *
 *   Options and parameters can be provided through html5 data-* attributes or
 *   via a provided JavaScript object. Optionally already selected items can
 *   also be provided and this script can download the JSON to fill the
 *   DualListBox when a valid URI is provided.
 *
 *   See the default parameters (below) for a complete list of options.
 */

(function($) {
    /** Initializes the DualListBox code as jQuery plugin. */
    $.fn.DualListBox = function (paramOptions, selected) {
        return this.each(function () {
            var defaults = {
                element: $(this).context,    // Select element which creates this dual list box.
                selected: $('<select>', {
                    class: 'selected',
                    style: 'height:' + ($(this).data('height') || 200) + 'px; width: 100%',
                    multiple: ''
                }),
                unselected: $('<select>', {
                    class: 'unselected',
                    style: 'height:' + ($(this).data('height') || 200) + 'px; width: 100%',
                    multiple: ''
                }),
                uri:        '/Common/Combobox/Lookup?service=Broker',       // JSON file that can be opened for the data.
                value:      'Value',               // Value that is assigned to the value field in the option.
                text:       'Text',             // Text that is assigned to the option field.
                title: {
                    left: $(this).attr('title-left') || 'Record(s) to be assigned',
                    right: $(this).attr('title-right') || 'Assigned record(s)'
                },
                json:       true,               // Whether to retrieve the data through JSON.
                timeout:    300,                // Timeout for when a filter search is started.
                horizontal: false,              // Whether to layout the dual list box as horizontal or vertical.
                textLength: 45,                 // Maximum text length that is displayed in the select.
                moveAllBtn: true,               // Whether the append all button is available.
                maxAllBtn:  500,                // Maximum size of list in which the all button works without warning. See below.
                warning:    'Are you sure you want to move this many items? Doing so can cause your browser to become unresponsive.'
            };

            var htmlOptions = {
                element:    $(this).context,
                uri:        $(this).data('source'),
                value:      $(this).data('value'),
                text:       $(this).data('text'),
                json:       $(this).data('json'),
                timeout:    $(this).data('timeout'),
                horizontal: $(this).data('horizontal'),
                textLength: $(this).data('textLength'),
                moveAllBtn: $(this).data('moveAllBtn'),
                maxAllBtn:  $(this).data('maxAllBtn')
            };

            var options = $.extend({}, defaults, htmlOptions, paramOptions);

            $.each(options, function(i, item) {
                if (item === undefined || item === null) { throw 'DualListBox: ' + i + ' is undefined.'; }
            });

            options['parent'] = 'dual-list-box-' + $(this).attr('name');
            options['parentElement'] = '#' + options.parent;

            selected = $.extend([{}], selected);

            if (options.json) {
                addElementsViaJSON(options, selected);
            } else {
                construct(options);
            }
        })
    };

    /** Retrieves all the option elements through a JSON request. */
    function addElementsViaJSON(options, selected) {
        var multipleTextFields = false;

        if (options.text.indexOf(':') > -1) {
            var textToUse = options.text.split(':');

            if (textToUse.length > 1) {
                multipleTextFields = true;
            }
        }

        //$.getJSON(options.uri, function(json) {
        //    $.each(json, function(key, item) {
        //        var text = '';

        //        if (multipleTextFields) {
        //            textToUse.forEach(function (entry) { text += item[entry] + ' '; });
        //        } else {
        //            text = item[options.text];
        //        }
        //        if (selected.some(function (e) { return e[options.value] === item[options.value] }) === true) {
        //            $('<option>', {
        //                value: item[options.value],
        //                text: text
        //            }).appendTo(options.selected);
        //        } else {
        //            $('<option>', {
        //                value: item[options.value],
        //                text: text
        //            }).appendTo(options.unselected);
        //        }
        //    });

        //    construct(options);
        //});

        var dataSource = wizardsgroup().source(options.uri);
        dataSource.fetch(function () {
            options.data = dataSource.data();
            $(options.selected).data('dataSource', options.data);
                $.each(options.data, function(key, item) {
                    var text = '';

                    if (multipleTextFields) {
                        textToUse.forEach(function (entry) { text += item[entry] + ' '; });
                    } else {
                        text = item[options.text];
                    }
                    if (selected.some(function (e) { return e[options.value] === item[options.value] }) === true) {
                        $('<option>', {
                            value: item[options.value],
                            text: text
                        }).appendTo(options.selected);
                    } else {
                        $('<option>', {
                            value: item[options.value],
                            text: text
                        }).appendTo(options.unselected);
                    }
                });
                construct(options);
        });
    }

    function _move(options, selected) {
            //$(options.parentElement + ' .unselected').html('');
            $.each($(options.selected).data('dataSource'), function (key, item) {
                if (selected.some(function (e) { return e[options.value] === item[options.value] }) === true) {
                    $('<option>', {
                        value: item[options.value],
                        text: item[options.text]
                    }).appendTo($(options.parentElement + ' .unselected'));
                } else {
                }
            });
    }

    /** Adds the event listeners to the buttons and filters. */
    function addListeners(options) {
        var unselected = $(options.parentElement + ' .unselected');
        var selected = $(options.parentElement + ' .selected');

        $(options.parentElement).find('button').bind('click', function() {
            var type = $(this).data('type');
            var left = [];
            var right = [];
            var data = _.map($(options.selected).data('dataSource'), function (item, key) {
                return { Text: item.Text, Value: item.Value };
            });
            wizardsgroup().trigger('duallistbox-' + selected.attr('name') + '-moved');
            switch (type) {
                case 'str': /* Selected to the right. */
                    unselected.find('option:selected').each(function () {
                        right.push({ Text: $(this).text(), Value: $(this).attr('value') });
                        $(this).remove().appendTo(selected);
                    });
                    selected.val(1);
                    wizardsgroup().trigger('duallistbox-' + selected.attr('name') + '-right', { data: data, items: right });
                    break;
                case 'atr': /* All to the right. */
                    if (unselected.find('option').length >= options.maxAllBtn && confirm(options.warning) ||
                        unselected.find('option').length < options.maxAllBtn) {
                        unselected.find('option').each(function () {
                            if ($(this).isVisible()) {
                                right.push({ Text: $(this).text(), Value: $(this).attr('value') });
                                $(this).remove().appendTo(selected);
                            }
                        });
                    }
                    wizardsgroup().trigger('duallistbox-' + selected.attr('name') + '-right', { data: data, items: right });
                    break;
                case 'stl': /* Selected to the left. */
                    selected.find('option:selected').each(function () {
                        left.push({ Text: $(this).text(), Value: $(this).attr('value') });
                        $(this).remove();
                    });
                    $(this).prop('disabled', true);
                    wizardsgroup().trigger('duallistbox-' + selected.attr('name') + '-left', { data: data, items: left });
                    break;
                case 'atl': /* All to the left. */
                    if (selected.find('option').length >= options.maxAllBtn && confirm(options.warning) ||
                        selected.find('option').length < options.maxAllBtn) {
                        selected.find('option').each(function () {
                            if ($(this).isVisible()) {
                                left.push({ Text: $(this).text(), Value: $(this).attr('value') });
                                $(this).remove();
                            }
                        });
                    }
                    wizardsgroup().trigger('duallistbox-' + selected.attr('name') + '-left', { data: options.data, items: unselected });
                    break;
                default: break;
            }

            unselected.filterByText($(options.parentElement + ' .filter-unselected'), options.timeout, options.parentElement).scrollTop(0).sortOptions();
            selected.filterByText($(options.parentElement + ' .filter-selected'), options.timeout, options.parentElement).scrollTop(0).sortOptions();

            _move(options, left || right);
            handleMovement(options);
        });

        $(options.parentElement).closest('form').submit(function() {
            selected.find('option').prop('selected', true);
        });

        $(options.parentElement).find('input[type="text"]').keypress(function(e) {
            if (e.which === 13) {
                event.preventDefault();
            }
        });

        selected.filterByText($(options.parentElement + ' .filter-selected'), options.timeout, options.parentElement).scrollTop(0).sortOptions();
        unselected.filterByText($(options.parentElement + ' .filter-unselected'), options.timeout, options.parentElement).scrollTop(0).sortOptions();

        $(options.parentElement).find('.clear-filter').bind('click', function () {
            $(this).parents('.input-group').find('input').val('');
        });
    }

    /** Constructs the jQuery plugin after the elements have been retrieved. */
    function construct(options) {
        createDualListBox(options);
        parseStubListBox(options);
        addListeners(options);
        wizardsgroup().trigger('duallistbox-' + $(options.element).prop('name') + '-load');
    }

    /** Counts the elements per list box/select and shows it. */
    function countElements(parentElement) {
        var countUnselected = 0, countSelected = 0;

        $(parentElement + ' .unselected').find('option').each(function() { if ($(this).isVisible()) { countUnselected++; } });
        $(parentElement + ' .selected').find('option').each(function() { if ($(this).isVisible()) { countSelected++ } });

        $(parentElement + ' .unselected-count').text(countUnselected);
        $(parentElement + ' .selected-count').text(countSelected);

        toggleButtons(parentElement);
    }

    /** Creates a new dual list box with the right buttons and filter. */
    function createDualListBox(options) {
        $(options.element).parent().attr('id', options.parent);

        $(options.parentElement).addClass('row').append(
                (options.horizontal == false ? '   <div class="col-md-5" style="padding:0">' : '   <div class="col-md-6">') +
                '       <p class="bg-primary" style="padding:10px"><span class="unselected-title"></span></p>' +
                '       <div class="input-group" style="margin-bottom:5px">' +
                '           <input class="filter form-control filter-unselected" type="text" placeholder="Filter">' +
                '           <div class="input-group-addon"><span class="glyphicon glyphicon-remove cursor-pointer clear-filter"></span></div>' +
                '       </div>' +
                (options.horizontal == false ? '' : createHorizontalButtons(1, options.moveAllBtn)) +
                        options.unselected.wrap("<span></span>").parent().html() +
                '   </div>' +
                (options.horizontal == false ? createVerticalButtons(options.moveAllBtn) : '') +
                (options.horizontal == false ? '   <div class="col-md-5" style="padding:0">' : '   <div class="col-md-6">') +
                '       <p class="bg-primary" style="padding:10px"><span class="selected-title"></span></p>' +
                '       <div class="input-group" style="margin-bottom:5px">' +
                '           <input class="filter form-control filter-selected" type="text" placeholder="Filter">' +
                '           <div class="input-group-addon"><span class="glyphicon glyphicon-remove cursor-pointer clear-filter"></span></div>' +
                '       </div>' +
                (options.horizontal == false ? '' : createHorizontalButtons(2, options.moveAllBtn)) +
                        options.selected.wrap("<span></span>").parent().html() +
                '   </div>');

        $(options.parentElement + ' .selected').prop('name', $(options.element).prop('name'));
        $(options.parentElement + ' .unselected-title').text(options.title.left);
        $(options.parentElement + ' .selected-title').text(options.title.right);
    }

    /** Creates the buttons when the dual list box is set in horizontal mode. */
    function createHorizontalButtons(number, copyAllBtn) {
        if (number == 1) {
            return (copyAllBtn ? '       <button type="button" class="btn btn-default atr" data-type="atr" style="margin-bottom: 5px;"><span class="glyphicon glyphicon-list"></span> <span class="glyphicon glyphicon-chevron-right"></span></button>': '') +
                '       <button type="button" class="btn btn-default ' + (copyAllBtn ? 'pull-right col-md-6' : 'col-md-12') + ' str" data-type="str" style="margin-bottom: 5px;" disabled><span class="glyphicon glyphicon-chevron-right"></span></button>';
        } else {
            return '       <button type="button" class="btn btn-default ' + (copyAllBtn ? 'col-md-6' : 'col-md-12') + ' stl" data-type="stl" style="margin-bottom: 5px;" disabled><span class="glyphicon glyphicon-chevron-left"></span></button>' +
                (copyAllBtn ? '       <button type="button" class="btn btn-default col-md-6 pull-right atl" data-type="atl" style="margin-bottom: 5px;"><span class="glyphicon glyphicon-chevron-left"></span> <span class="glyphicon glyphicon-list"></span></button>' : '');
        }
    }

    /** Creates the buttons when the dual list box is set in vertical mode. */
    function createVerticalButtons(copyAllBtn) {
        return '   <div class="col-md-2 center-block" style="margin-top: ' + (copyAllBtn ? '80px' : '130px') +'; padding:0">' +
            (copyAllBtn ? '       <button type="button" class="btn btn-primary col-md-6 col-md-offset-3 atr" data-type="atr" style="margin-bottom: 10px;"><span class="glyphicon glyphicon-forward"></span></span></button>' : '') +
            '       <button type="button" class="btn btn-primary col-md-6 col-md-offset-3 str" data-type="str" style="margin-bottom: 20px;" disabled><span class="glyphicon glyphicon-triangle-right"></span></button>' +
            '       <button type="button" class="btn btn-primary col-md-6 col-md-offset-3 stl" data-type="stl" style="margin-bottom: 10px;" disabled><span class="glyphicon glyphicon-triangle-left"></span></button>' +
            (copyAllBtn ? '       <button type="button" class="btn btn-primary col-md-6 col-md-offset-3 atl" data-type="atl" style="margin-bottom: 10px;"><span class="glyphicon glyphicon-backward"></span></span></button>' : '') +
            '   </div>';
    }

    /** Specifically handles the movement when one or more elements are moved. */
    function handleMovement(options) {
        $(options.parentElement + ' .unselected').find('option:selected').prop('selected', false);
        $(options.parentElement + ' .selected').find('option:selected').prop('selected', false);

        $(options.parentElement + ' .filter').val('');
        $(options.parentElement + ' select').find('option').each(function() { $(this).show(); });

        countElements(options.parentElement);
    }

    /** Parses the stub select / list box that is first created. */
    function parseStubListBox(options) {
        var textIsTooLong = false;

        $(options.element).find('option').text(function (i, text) {
            $(this).data('title', text);

            if (text.length > options.textLength) {
                textIsTooLong = true;
                return text.substr(0, options.textLength) + '...';
            }
        }).each(function () {
            if (textIsTooLong) {
                $(this).prop('title', $(this).data('title'));
            }

            if ($(this).is(':selected')) {
                $(this).appendTo(options.parentElement + ' .selected');
            } else {
                $(this).appendTo(options.parentElement + ' .unselected');
            }
        });

        $(options.element).remove();
        handleMovement(options);
    }

    /** Toggles the buttons based on the length of the selects. */
    function toggleButtons(parentElement) {
        $(parentElement + ' .unselected').change(function() {
            $(parentElement + ' .str').prop('disabled', false);
        });

        $(parentElement + ' .selected').change(function() {
            $(parentElement + ' .stl').prop('disabled', false);
        });

        if ($(parentElement + ' .unselected').has('option').length == 0) {
            $(parentElement + ' .atr').prop('disabled', true);
            $(parentElement + ' .str').prop('disabled', true);
        } else {
            $(parentElement + ' .atr').prop('disabled', false);
        }

        if ($(parentElement + ' .selected').has('option').length == 0) {
            $(parentElement + ' .atl').prop('disabled', true);
            $(parentElement + ' .stl').prop('disabled', true);
        } else {
            $(parentElement + ' .atl').prop('disabled', false);
        }
    }

    /**
     * Filters through the select boxes and hides when an element doesn't match.
     *
     * Original source: http://www.lessanvaezi.com/filter-select-list-options/
     */
    $.fn.filterByText = function(textBox, timeout, parentElement) {
        return this.each(function() {
            var select = this;
            var options = [];

            $(select).find('option').each(function() {
                options.push({value: $(this).val(), text: $(this).text()});
            });

            $(select).data('options', options);

            $(textBox).bind('change keyup', function() {
                delay(function() {
                    var options = $(select).data('options');
                    var search = $.trim($(textBox).val());
                    var regex = new RegExp(search,'gi');

                    $.each(options, function(i) {
                        if(options[i].text.match(regex) === null) {
                            $(select).find($('option[value="' + options[i].value + '"]')).hide();
                        } else {
                            $(select).find($('option[value="' + options[i].value + '"]')).show();
                        }
                    });

                    countElements(parentElement);
                }, timeout);
            });
        });
    };

    /** Checks whether or not an element is visible. The default jQuery implementation doesn't work. */
    $.fn.isVisible = function() {
        return !($(this).css('visibility') == 'hidden' || $(this).css('display') == 'none');
    };

    /** Sorts options in a select / list box. */
    $.fn.sortOptions = function() {
        return this.each(function() {
            $(this).append($(this).find('option').remove().sort(function(a, b) {
                var at = $(a).text(), bt = $(b).text();
                return (at > bt) ? 1 : ((at < bt) ? -1 : 0);
            }));
        });
    };

    /** Simple delay function that can wrap around an existing function and provides a callback. */
    var delay = (function() {
        var timer = 0;
        return function (callback, ms) {
            clearTimeout(timer);
            timer = setTimeout(callback, ms);
        };
    })();
})(jQuery);