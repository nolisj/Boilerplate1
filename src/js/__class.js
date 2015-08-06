/// <reference path="__wizardsgroup.js" />
/// <reference path="__ajax.js" />

function Url(area, controller, action) {

    this.area = area;
    this.controller = controller;
    this.action = action;

    if (!_.isUndefined(area) && _.isUndefined(controller)) {

        var uri = area.replace(/^\/|\/$/g, '').split('/');

        if (uri.length > 1) {

            var index = _.isEmpty(uri[0]) ? 1 : 0;

            this.area = uri[index] || '';

            this.controller = uri[++index] || '';

            this.action = uri[++index] || '';
        }
    }

    Object.defineProperty(this, 'path', {
        get: function () {
            return '/' + (this.area || '') + '/' + (this.controller || '') + '/' + (this.action || '');
            //return '/' + (this.area.IsNullOrEmpty() ? '' : this.area + '/') + (this.controller.IsNullOrEmpty() ? '' : this.controller + '/') + (this.action.IsNullOrEmpty() ? '' : this.action);
        }
    });

    return this;
}

function Form(selector) {

    this.jQuery = $(selector);
    this.event = new Evt();
    this.context;

    return this;
}

Form.prototype.kendo = function () {
    this.jQuery.kendo();
    return this;
}

Form.prototype.submit = function (context) {
    this.context = context;
    wizardsgroup.ajax(this).submit(this)
        .then(function (e, data) {
            wizardsgroup.trigger('form-' + this.jQuery.attr('name'), context);
            wizardsgroup.trigger('form-' + this.jQuery.attr('name') + '-submit', { context: context, data: data });
            $(this.context).trigger(this.event.then, data);
            $(this.context).unbind(this.event.then);
        })
        .success(function (e, data) {
            wizardsgroup.trigger('form-' + this.jQuery.attr('name') + '-success', { context: context, data: data });
            $(this.context).trigger(this.event.success, data);
            $(this.context).unbind(this.event.success);
        })
        .error(function (e, data) {
            wizardsgroup.trigger('form-' + this.jQuery.attr('name') + '-error', { context: context, data: data });
            $(this.context).trigger(this.event.error, data);
            $(this.context).unbind(this.event.error);
        })
        .warning(function (e, data) {
            wizardsgroup.trigger('form-' + this.jQuery.attr('name') + '-warning', { context: context, data: data });
            $(this.context).trigger(this.event.warning, data);
            $(this.context).unbind(this.event.warning);
        })
        .failed(function (e, data) {
            wizardsgroup.trigger('form-' + this.jQuery.attr('name') + '-failed', { context: context, data: data });
            $(this.context).trigger(this.event.failed, data);
            $(this.context).unbind(this.event.failed);
        });
    return this;
}

Form.prototype.then = function (fn) {
    if (_.isFunction(fn)) {
        this.event.then = wizardsgroup.random;
        $(this.context).on(this.event.then, fn);
    }
    return this;
}

Form.prototype.error = function (fn) {
    if (_.isFunction(fn)) {
        this.event.error = wizardsgroup.random;
        $(this.context).on(this.event.error, fn);
    }
    return this;
}

Form.prototype.success = function (fn) {
    if (_.isFunction(fn)) {
        this.event.success = wizardsgroup.random;
        $(this.context).on(this.event.success, fn);
    }
    return this;
}

Form.prototype.warning = function (fn) {
    if (_.isFunction(fn)) {
        this.event.warning = wizardsgroup.random;
        $(this.context).on(this.event.warning, fn);
    }
    return this;
}

Form.prototype.failed = function (fn) {
    if (_.isFunction(fn)) {
        this.event.failed = wizardsgroup.random;
        $(this.context).on(this.event.failed, fn);
    }
    return this;
}