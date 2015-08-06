/// <reference path="__wizardsgroup.js" />

wizardsgroup().app(function () {
    (function (wg) {
        wg().iframe().resize();

        if ($('input[data-wgparentid]').length > 0) {
            wg().parentID($('input[data-wgparentid]').attr('data-wgparentid'));
        }

        $(document).ajaxSend(function (evt, xhr, opt) {
            console.log(opt);
            //xhr.abort();
        }).ajaxComplete(function () {
            //console.log(arguments);
        });

        //$(document).on('click', 'tr td[role="gridcell"]', function () {
        //    $(this).parents('table').find('tr').removeAttr('style');
        //    $(this).parent('tr').css({ 'background-color': 'yellow', 'color': 'red' });
        //});

        // TOOLTIP
        $(document)
            .on('focus', '.k-widget input, input.k-textbox', function () {
                if ($(this).hasClass('k-formatted-value')) {
                    return;
                }
                if ($(this).hasClass('k-textbox')) {
                    if ($(this).prev('div[data-wgbootstrap="tooltip"]').length > 0) {
                        $(this).prev('div[data-wgbootstrap="tooltip"]').tooltip('show');
                    }
                    else if ($(this).next('div[data-wgbootstrap="tooltip"]').length > 0) {
                        $(this).next('div[data-wgbootstrap="tooltip"]').tooltip('show');
                    }
                    return;
                }
                if ($(this).parents('.k-widget').prev('div[data-wgbootstrap="tooltip"]').length > 0) {
                    $(this).parents('.k-widget').prev('div[data-wgbootstrap="tooltip"]').tooltip('show');
                }
                else if ($(this).parents('.k-widget').next('div[data-wgbootstrap="tooltip"]').length > 0) {
                    $(this).parents('.k-widget').next('div[data-wgbootstrap="tooltip"]').tooltip('show');
                }
            })
            .on('focusout', '.k-widget input, input.k-textbox', function () {
                if ($(this).hasClass('k-formatted-value')) {
                    return;
                }
                if ($(this).hasClass('k-textbox')) {
                    if ($(this).prev('div[data-wgbootstrap="tooltip"]').length > 0) {
                        $(this).prev('div[data-wgbootstrap="tooltip"]').tooltip('hide');
                    }
                    else if ($(this).next('div[data-wgbootstrap="tooltip"]').length > 0) {
                        $(this).next('div[data-wgbootstrap="tooltip"]').tooltip('hide');
                    }
                    return;
                }
                if ($(this).parents('.k-widget').prev('div[data-wgbootstrap="tooltip"]').length > 0) {
                    $(this).parents('.k-widget').prev('div[data-wgbootstrap="tooltip"]').tooltip('hide');
                }
                else if ($(this).parents('.k-widget').next('div[data-wgbootstrap="tooltip"]').length > 0) {
                    $(this).parents('.k-widget').next('div[data-wgbootstrap="tooltip"]').tooltip('hide');
                }
            });

        // DOWNLOAD
        $(document).on('click', '*[data-action="download"]', function (e) {
            e.preventDefault();
            wg().download(wg().url($(this).data('url')));
        });

        // TABLIST
        (function () {
            var list = $('.wg-tablist .list-group');
            list.find('.list-group-item').on('click', function () {
                list.find('a.list-group-item').removeClass('active');
                var jquery = $(this);
                jquery.addClass('active');
                if (!_.isUndefined(jquery.attr('data-view'))) {
                    wg().ajax().html(wg().url(jquery.data('view'))).then(function (data) {
                        wg(jquery.attr('href')).html(data, function () {
                            wg().trigger('tablist-' + jquery.attr('href') + '-load');
                            jquery.removeAttr('data-view');
                            wg().iframe().resize();
                        });
                    });
                }
            });
        })();

        // TAB
        $(document).on('click', 'a[data-wgkendo="tab"]', function () {
            if (_.isEmpty($(this).data('tabid'))) {
                if (_.isUndefined($(this).data('uid'))) {
                    $(this).attr('data-tabid', wg().random());
                } else {
                    $(this).attr('data-tabid', $(this).data('uid'));
                }
            }
            wg().tab().add($(this).data('title'), wg().url($(this).data('view')), $(this).data('tabid'));
        });

        $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
            wg().iframe().resize();
        });

        // GRID
        (function () {
            $(document).on('click', 'a[data-wgkendo="grid"]', function (e) {
                var gridname, uid, container;
                gridname = $(this).data('grid');
                uid = $(this).data('uid');

                if ($('#' + gridname).data('uid') == uid) {
                    //wg('#' + gridname).grid().refresh();
                    //return;
                }

                container = $(this).parents('div[data-container="grid"]') || $(this).parents('div[data-container]');
                container.nextAll('div[data-container="grid"]').remove();

                wg().ajax().html(wg().url($(this).data('view'))).then(function (data) {
                    if (data.hasOwnProperty('ActionStatus')) {
                        // display notification message instead
                    }
                    else {
                        wg('body').block();
                        var wrapper = $('<div>', { 'data-container': 'grid', 'class': 'hide' }).html(data);
                        wg(wrapper).kendo();
                        $(container).after(wrapper);
                        $('#' + gridname).attr('data-parent', uid);
                        wg().bind().grid(gridname).dataBound(function () {
                            wg().iframe().resize();
                        });
                        wg('#' + gridname).grid().load(function () {
                            _.delay(function () {
                                wg('body').unblock();
                                container.next('div[data-container="grid"]').removeClass('hide');
                                wg().iframe().resize();
                            }, 1000);
                        });
                    }
                });
            });
        })();

        $(document).on('click', 'input[data-action="checkall"]', function () {
            if ($(this).prop('checked')) {
                $(this).parents('div[data-grid]').find('input[type="checkbox"]').prop('checked', true);
            } else {
                $(this).parents('div[data-grid]').find('input[type="checkbox"]').prop('checked', false);
            }
        });

        $(document).on('click', '.k-grid-content input[type="checkbox"]', function () {
            if ($(this).parents('.k-grid-content').find('input[type="checkbox"]').not(':checked').length > 0) {
                $(this).parents('div[data-grid]').find('input[data-action="checkall"]').prop('checked', false);
            }
        });

        // MODAL
        (function () {
            $(document).on('click', 'a[data-wgbootstrap="modal"], button[data-wgbootstrap="modal"]', function (e) {
                var modal = wg().modal();
                if ($(this).attr('data-width') == 'large') {
                    modal.large();
                }
                else if ($(this).attr('data-width') == 'small') {
                    modal.small();
                }
                else {
                    modal.medium();
                }
                if ($(this).data('action') == 'add') {
                    _add($(this), modal);
                }
                else if ($(this).data('action') == 'edit') {
                    _edit($(this), modal);
                }
                else if ($(this).data('action') == 'delete') {
                    _delete($(this), modal);
                }
                else if ($(this).data('action') == 'toggle') {
                    _toggle($(this), modal);
                }
            });

            function _add(j, modal) {
                var url = wg().url(j.data('view'));
                modal
                    .button('Create', function () {
                        wg().confirm('Test', function (bool) {
                            if (bool) {
                                modal.block();
                                modal.form().submit().success(function (data) {
                                    modal.unblock();
                                    modal.close();
                                    wg().notification().success('Record(s) successfully saved!');
                                    var gridname = j.parents('div[data-container="grid"]').find('div[data-grid]').data('grid');
                                    if (gridname) {
                                        $('#' + gridname).wg('kendo').refresh();
                                    }
                                });
                            }
                        });
                    })
                    .button('Cancel', function () {
                        wg().confirm(wg().message.modal.cancel.warning, function (bool) {
                            if (bool) {
                                modal.close();
                            }
                        });
                    })
                    .title(j.data('title'))
                    .open(function () {
                        modal.block();
                        wg().ajax().html(url, { id: j.parents('[data-container="grid"]').find('[data-grid]').data('parent') }).then(function (data) {
                            modal.html(data, function () {
                                modal.unblock();
                            });
                        });
                    });
            }

            function _edit(j, modal) {
                var url = wg().url(j.data('view'));
                modal
                    .button('Save', function () {
                        wg().confirm('Test', function (bool) {
                            if (bool) {
                                modal.block();
                                modal.form().submit().success(function (data) {
                                    modal.unblock();
                                    modal.close();
                                    wg().notification().success('Record(s) successfully saved!');
                                    var gridname = j.parents('div[data-container="grid"]').find('div[data-grid]').data('grid');
                                    if (gridname) {
                                        $('#' + gridname).wg('kendo').refresh();
                                    }
                                });
                            }
                        });
                    })
                    .button('Close', function () {
                        wg().confirm(wg().message.modal.cancel.warning, function (bool) {
                            if (bool) {
                                modal.close();
                            }
                        });
                    })
                    .title(j.data('title'))
                    .open(function () {
                        wg().ajax().html(url).then(function (data) {
                            if (_.has(data, 'ActionStatus')) {
                                _.delay(function () {
                                    modal.close();
                                    wg().notification().result(data);
                                }, 1000);
                            }
                            else {
                                //modal.html(data);
                                //modal.form().kendo(function () {
                                //    _.delay(function () {
                                //        modal.unblock()
                                //    }, 1500);
                                //});
                                _.delay(function () {
                                    modal.block();
                                    _.delay(function () {
                                        modal.html(data, function () {
                                            modal.unblock();
                                        });
                                    }, 1000);
                                }, 200);
                            }
                        });
                    });
            }

            function _delete(j, modal) {
                var gridname = j.parents('div[data-container="grid"]').find('div[data-grid]').data('grid');
                if (gridname) {
                    var records = $('#' + gridname).wg('kendo').checkedRecords();
                    if (records.length > 0) {
                        var url = wg().url(j.data('view'));
                        modal
                            .title(j.data('title') || 'Delete Record' + ((records.length == 1) ? '' : 's'))
                            .button('Delete', function () {
                                modal.block();
                                wg().ajax().post(j.data('url'), { checkedRecords: records, parentId: $('#' + gridname).data('parent') }).success(function (data) {
                                    modal.unblock();
                                    modal.close();
                                    wg().notification().result(data);
                                    wg().trigger('modal-' + gridname + '-' + j.data('action'));
                                    $('#' + gridname).wg('kendo').refresh();
                                });
                            })
                            .button('Cancel', function () {
                                modal.close();
                            })
                            .open(function () {
                                wg().ajax().post(url, { checkedRecords: records, parentId: $('#' + gridname).data('parent') }).then(function (data) {
                                    _.delay(function () {
                                        modal.block();
                                        _.delay(function () {
                                            var columns = _.keys(data[0]);
                                            columns = _.map(columns, function (i) {
                                                return { field: i, title: i.toTitle() };
                                            });
                                            modal.html('<div id="ModalGrid" data-grid="ModalGrid"></div>');
                                            wg('#ModalGrid').grid({ pageable: false }).data(data).columns(columns).load(function () {
                                                wg().iframe().resize($(wg().config.modal.id).find('.modal-dialog').outerHeight() + 80);
                                            });
                                            modal.unblock();
                                        }, 1000);
                                    }, 200);
                                });
                            });
                    }
                    else {
                        wg().notification().warning('Please select a record!');
                    }
                }
            }

            function _toggle(j, modal) {
                var gridname = j.parents('div[data-container="grid"]').find('div[data-grid]').data('grid');
                if (gridname) {
                    var records = $('#' + gridname).wg('kendo').checkedRecords();
                    if (records.length > 0) {
                        var url = wg().url(j.data('view'));
                        modal
                            .title(j.data('title') || 'Toggle Record' + ((records.length == 1) ? '' : 's'))
                            .button('Toggle', function () {
                                modal.block();
                                wg().ajax().post(j.data('url'), { checkedRecords: records, parentId: $('#' + gridname).data('parent') }).success(function (data) {
                                    modal.unblock();
                                    modal.close();
                                    wg().notification().result(data);
                                    wg().trigger('modal-' + gridname + '-' + j.data('action'));
                                    $('#' + gridname).wg('kendo').refresh();
                                });
                            })
                            .button('Cancel', function () {
                                modal.close();
                            })
                            .open(function () {
                                wg().ajax().post(url, { checkedRecords: records, parentId: $('#' + gridname).data('parent') }).then(function (data) {
                                    _.delay(function () {
                                        modal.block();
                                        _.delay(function () {
                                            var columns = _.keys(data[0]);
                                            columns = _.map(columns, function (i) {
                                                return { field: i, title: i.toTitle() };
                                            });
                                            modal.html('<div id="ModalGrid" data-grid="ModalGrid"></div>');
                                            wg('#ModalGrid').grid({ pageable: false }).data(data).columns(columns).load(function () {
                                                wg().iframe().resize($(wg().config.modal.id).find('.modal-dialog').outerHeight() + 80);
                                            });
                                            modal.unblock();
                                        }, 1000);
                                    }, 200);
                                });
                            });
                    }
                    else {
                        wg().notification().warning('Please select a record!');
                    }
                }
            }
        })();

        wg().trigger('wizardsgroup-ready', wg);
        wg().kendo();
        $('div[data-wgkendo="grid"]').each(function () {
            wg(this).grid().load();
        });
    })(wizardsgroup);
});