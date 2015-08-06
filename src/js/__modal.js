/// <reference path="__wizardsgroup.js" />
/// <reference path="__class.js" />

function WizardsModal(title, options) {

    this.jQuery = $(wizardsgroup.config.modal);
    this.content = this.jQuery.find('.modal-content');
    this.title = this.jQuery.find('.modal-title');
    this.body = this.jQuery.find('.modal-body');
    this.footer = this.jQuery.find('.modal-footer');
    this.options = $.extend(
        {
            backdrop: 'static',
            keyboard: false
        }
    , options);

    this.title.html(title);
    this.body.html('');
    this.footer.html('');
    this.jQuery.find('.modal-dialog').removeClass('modal-md').removeClass('modal-sm').addClass('modal-lg').removeAttr('style');

    return this;
}

WizardsModal.prototype.button = function (text, attributes, fn) {

    if (_.isFunction(attributes)) {
        fn = attributes;
        attributes = {};
    }

    attributes = $.extend(
        {
            class: 'btn btn-primary'
        }
    , attributes);

    var button = $('<button></button>').text(text).attr(attributes);

    if (text.toLowerCase() == 'close' || text.toLowerCase() == 'cancel') {
        button.attr({ 'data-dismiss': 'modal' });
    } else {
        if (_.isFunction(fn)) {
            button.click($.proxy(fn, this));
        }
    }

    button.appendTo(this.footer);
    return this;
}

WizardsModal.prototype.html = function (content) {
    this.body.html(content);
    wizardsgroup.trigger('modal-' + this.title.text() + '-ready', this);
    return this;
}

WizardsModal.prototype.form = function () {
    return new Form(this.jQuery.find('form'));
}

WizardsModal.prototype.open = function (fn) {
    this.jQuery.modal(this.options);
    if (_.isFunction(fn)) {
        fn.call(this);
    }
    wizardsgroup.trigger('modal-' + this.title.text() + '-open', this);
    return this;
}

WizardsModal.prototype.close = function (fn) {
    this.jQuery.modal('hide');
    if (_.isFunction(fn)) {
        fn.call(this);
    }
    wizardsgroup.trigger('modal-' + this.title.text() + '-close', this);
}

WizardsModal.prototype.small = function () {
    this.jQuery.find('.modal-dialog').removeClass('modal-lg').removeClass('modal-md').addClass('modal-sm');
    return this;
}

WizardsModal.prototype.medium = function () {
    this.jQuery.find('.modal-dialog').removeClass('modal-lg').removeClass('modal-sm').addClass('modal-md');
    return this;
}

WizardsModal.prototype.large = function () {
    this.jQuery.find('.modal-dialog').removeClass('modal-md').removeClass('modal-sm').addClass('modal-lg');
    return this;
}

WizardsModal.prototype.width = function (width) {
    this.jQuery.find('.modal-dialog').css({ 'width': width });
    return this;
}

WizardsModal.prototype.height = function (height) {
    this.jQuery.find('.modal-body').css({ 'height': height });
    return this;
}

WizardsModal.prototype.kendo = function () {
    this.jQuery.find('form').kendo();
    return this;
}

WizardsModal.prototype.preloader = function (bool) {
    if (bool !== false) {
        this.footer.find('.btn').addClass('disabled');
    } else {
        this.footer.find('.btn').removeClass('disabled');
    }
    return this;
}


function WizardsConfirm(title, msg, fn) {

    this.jQuery = $(wizardsgroup.config.confirm);
    this.content = this.jQuery.find('.modal-content');
    this.title = this.jQuery.find('.modal-title');
    this.body = this.jQuery.find('.modal-body');
    this.footer = this.jQuery.find('.modal-footer');

    this.title.html(title);
    this.body.html(msg);
    this.footer.html('');

    this.footer
        .append($('<button></button>')
            .text('Ok')
            .addClass('btn btn-primary')
            .click(function () {
                $(wizardsgroup.config.confirm).modal('hide');
                fn.call(this, true);
            })
        )
        .append($('<button></button>')
            .text('Cancel')
            .addClass('btn btn-primary')
            .click(function () {
                $(wizardsgroup.config.confirm).modal('hide');
                fn.call(this, false);
            })
        );

    this.jQuery.modal({
        backdrop: 'static',
        keyboard: false
    });

    return this;
}

function WizardsAlert(title, msg, fn) {

    this.jQuery = $(wizardsgroup.config.alert);
    this.content = this.jQuery.find('.modal-content');
    this.title = this.jQuery.find('.modal-title');
    this.body = this.jQuery.find('.modal-body');
    this.footer = this.jQuery.find('.modal-footer');

    this.title.html(title);
    this.body.html(msg);
    this.footer.html('');

    this.footer
        .append($('<button></button>')
            .text('Close')
            .addClass('btn btn-primary')
            .click(function () {
                $(wizardsgroup.config.alert).modal('hide');
                fn.call(this, false);
            })
        );

    this.jQuery.modal({
        backdrop: 'static',
        keyboard: false
    });

    return this;
}