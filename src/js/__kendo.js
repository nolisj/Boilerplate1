/// <reference path="__wizardsgroup.js" />

function source(url) {
    return new kendo.data.DataSource({
        type: 'aspnetmvc-ajax',
        serverPaging: true,
        serverSorting: true,
        serverFiltering: true,
        pageSize: 10,
        transport: {
            read: {
                type: "POST",
                url: url,
                dataType: "json"
            }
        }
    });
}

function WizardsGrid(selector) {

    this.jQuery = $(selector);
    this.kendo = this.jQuery.data("kendoGrid");

    return this;
}

WizardsGrid.prototype.load = function () {

    var gridname = this.jQuery.attr('id');

    this.config = wizardsgroup.config.grid.options;

    this.config.dataBound = function (e) {
        wizardsgroup.trigger('grid-' + gridname + '-load', this);
    }

    this.config = $.extend(this.config);

    wizardsgroup.ajax(this).url('/Json/' + gridname + 'Setting.json').then(function (e, data) {
        var config = wizardsgroup.config.grid.options;
        config.dataSource = source(this.jQuery.attr('data-url'));
        config.columns = data.columns;
        this.jQuery.kendoGrid(config);
    });
}

function Calendar(selector) {
    this.jQuery = $(selector);
    this.kendo = this.jQuery.data('kendoCalendar');
}

function WizardsKendo() {

    function Kendo(type) {

        this.jQuery;
        var kendo = type;

        Object.defineProperty(this, 'kendo', {
            get: function () {
                return this.jQuery.data(kendo);
            }
        });
    }

    Kendo.prototype.value = function (value) {
        if (_.isUndefined(value)) {
            if (_.isUndefined(this.kendo)) {
                return this.jQuery.val();
            }
            return this.kendo.value();
        } else {
            if (_.isUndefined(this.kendo)) {
                this.jQuery.val(value);
                return this;
            }
            this.kendo.value(value);
        }
        return this;
    }

    Kendo.prototype.text = function () {
        if (_.isUndefined(this.kendo)) {
            return '';
        } else {
            return this.kendo.text();
        }
    }

    Kendo.prototype.change = function (fn) {
        if (_.isUndefined(this.kendo)) {
            this.jQuery.bind('change', fn);
        } else {
            this.kendo.bind('change', fn);
        }
        return this;
    }

    function Combobox(selector) {

        this.jQuery = $(selector);
        return this;
    }

    Combobox.prototype = Object.create(new Kendo('kendoComboBox'));

    this.combobox = function (selector) {
        return new Combobox(selector);
    }

    function TextBox(selector) {

        this.jQuery = $(selector);
        this.kendo = 'kendoAutoComplete';

        return this;
    }

    this.textbox = function (selector) {
        return new TextBox(selector);
    }

    function Grid(selector) {

        this.jQuery = $(selector);
        this.kendo = this.jQuery.data("kendoGrid");

        return this;
    }

    Grid.prototype.refresh = function () {

        this.kendo = this.jQuery.data("kendoGrid");
        this.kendo.dataSource.read();
    }

    this.grid = function (selector) {
        return new Grid(selector);
    }
}