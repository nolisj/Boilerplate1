function WizardsNotification() {

    var time;
    var jQuery = $(wizardsgroup.config.notification);

    jQuery.click(function () {
        clearTimeout(time);
        $(this).slideUp();
    });

    this.success = function (msg) {
        notify(wizardsgroup.status.success, msg);
    }

    this.error = function (msg) {
        notify(wizardsgroup.status.error, 'Error: ' + msg);
    }

    this.warning = function (msg) {
        notify(wizardsgroup.status.warning, 'Warning: ' + msg);
    }

    this.failed = function (msg) {
        notify(wizardsgroup.status.failed, 'Failed: '+ msg);
    }

    this.result = function (result) {

    }

    function notify(type, msg) {

        clearTimeout(time);

        jQuery.slideUp(function () {

            setTimeout(function () {

                if (type == wizardsgroup.status.success) {
                    jQuery.css({ 'background-color': 'green' });
                } else if (type == wizardsgroup.status.warning) {
                    jQuery.css({ 'background-color': 'orange' });
                } else if (type == wizardsgroup.status.failed) {
                    jQuery.css({ 'background-color': 'orange' });
                } else if (type == wizardsgroup.status.error) {
                    jQuery.css({ 'background-color': 'red' });
                }

                jQuery.text(msg).slideDown();
                
            }, 300);
        });

        time = setTimeout(function () {
            jQuery.slideUp();
        }, 10000);
    }

    return this;
}