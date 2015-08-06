function Bind(evt, fn) {
    if (_.isFunction(fn)) {
        $(document).on(evt.toLowerCase(), fn);
    }
}

function Trigger(evt, context) {
    console.info("wizardsgroup.bind('" + evt.toLowerCase().replace(/\s+/g, '') + "', fn)");
    $(document).trigger(evt.toLowerCase().replace(/\s+/g, ''), context);
}

function Unbind(evt) {
    $(document).unbind(evt.toLowerCase());
}