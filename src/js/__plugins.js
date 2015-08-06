(function ($) {

    $.fn.kendo = function () {

        this.find('[kendo="kendoAutoComplete"]').kendoAutoComplete({

        });

        this.find('[kendo="kendoComboBox"]').each(function () {
            $(this).kendoComboBox({
                //dataSource: source($(this).attr('data-url'))
                dataSource: {
                    data: ["One", "Two"]
                }
            });
        });

        this.find('[kendo="kendoMaskedTextBox"]').each(function () {
            $(this).kendoMaskedTextBox({
                mask: $(this).attr('mask')
            });
        });

        this.find('[kendo="kendoNumericTextBox"]').each(function () {
            $(this).kendoNumericTextBox({
                spinners: ($(this).attr('data-spinner') == 'false') ? false : true,
                format: $(this).attr('format')
            });
        });

        if (!_.isUndefined(this.attr('name'))) {
            wizardsgroup.trigger('form-' + this.attr('name') + '-kendo');
        }
        else if (!_.isUndefined(this.attr('id'))) {
            wizardsgroup.trigger('form-' + this.attr('id') + '-kendo');
        }

        return this;
    };

}(jQuery));