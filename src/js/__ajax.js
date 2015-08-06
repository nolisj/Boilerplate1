/// <reference path="__wizardsgroup.js" />

function Ajax(context) {

    this.context = context;
    this.event = new Evt();

    return this;
}

Ajax.prototype.json = function (url, data, options) {

    if (!(url instanceof Url)) {
        return;
    }

    options = $.extend(wizardsgroup.config.ajax, options);

    options.type = "GET";
    options.url = url.path;
    options.data = data;
    options.context = this;
    options.datatype = "json";

    var request = $.ajax(options);

    request.done(this.result);

    request.error(function () {
        $(this.context).trigger(this.event.error, data);
    });

    return this;
}

Ajax.prototype.url = function (url, data, options) {

    options = $.extend(wizardsgroup.config.ajax, options);

    options.type = "GET";
    options.url = url;
    options.data = data;
    options.context = this;
    options.datatype = "json";

    var request = $.ajax(options);

    request.done(this.result);

    request.error(function () {
        $(this.context).trigger(this.event.error, data);
    });

    return this;
}

Ajax.prototype.html = function (url, data, options) {

    if (!(url instanceof Url)) {
        return;
    }

    options = $.extend(wizardsgroup.config.ajax, options);

    options.type = "GET";
    options.url = url.path;
    options.data = data;
    options.context = this;

    var request = $.ajax(options);

    request.done(this.result);

    request.error(function () {
        $(this.context).trigger(this.event.error, data);
    });

    return this;
}

Ajax.prototype.submit = function (form, options) {

    options = $.extend(wizardsgroup.config.ajax, options);

    var url = wizardsgroup.url(form.jQuery.attr('action'));

    options.type = "POST";
    options.url = url.path;
    options.data = form.jQuery.serialize();
    options.context = this;

    var request = $.ajax(options);

    request.done(this.result);

    request.error(function (data) {
        $(this.context).trigger(this.event.error, data);
        $(this.context).unbind(this.event.error);
    });

    return this;
}

Ajax.prototype.post = function (url, data, options) {

    if (!(url instanceof Url)) {
        return;
    }

    options = $.extend(wizardsgroup.config.ajax, options);

    options.type = "POST";
    options.url = url.path;
    options.data = data;
    options.context = this;

    var request = $.ajax(options);

    request.done(this.result);

    request.error(function () {
        $(this.context).trigger(this.event.error, data);
    });

    return this;
}

Ajax.prototype.result = function (data) {
    $(this.context).trigger(this.event.then, data);
    $(this.context).unbind(this.event.then);
    if (data.hasOwnProperty(wizardsgroup.status.success)) {
        $(this.context).trigger(this.event.success, data);
        $(this.context).unbind(this.event.success);
    } else if (data.hasOwnProperty(wizardsgroup.status.warning)) {
        $(this.context).trigger(this.event.warning, data);
        $(this.context).unbind(this.event.warning);
    } else if (data.hasOwnProperty(wizardsgroup.status.failed)) {
        $(this.context).trigger(this.event.failed, data);
        $(this.context).unbind(this.event.warning);
    }
}

Ajax.prototype.then = function (fn) {
    if (_.isFunction(fn)) {
        this.event.then = wizardsgroup.random;
        $(this.context).on(this.event.then, fn);
    }
    return this;
}

Ajax.prototype.error = function (fn) {
    if (_.isFunction(fn)) {
        this.event.error = wizardsgroup.random;
        $(this.context).on(this.event.error, fn);
    }
    return this;
}

Ajax.prototype.success = function (fn) {
    if (_.isFunction(fn)) {
        this.event.success = wizardsgroup.random;
        $(this.context).on(this.event.success, fn);
    }
    return this;
}

Ajax.prototype.failed = function (fn) {
    if (_.isFunction(fn)) {
        this.event.failed = wizardsgroup.random;
        $(this.context).on(this.event.failed, fn);
    }
    return this;
}

Ajax.prototype.warning = function (fn) {
    if (_.isFunction(fn)) {
        this.event.warning = wizardsgroup.random;
        $(this.context).on(this.event.warning, fn);
    }
    return this;
}