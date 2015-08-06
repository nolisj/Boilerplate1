/// <reference path="__wizardsgroup.js" />

function Tab()
{

    this.ul = $(wizardsgroup.config.tab).find('ul[role="tablist"]');
    this.container = $(wizardsgroup.config.tab).find('div.tab-content');
    this.tab = null;
    this.button = null;
    this.content = null;
    this.iframe = null;
    this.title;
    this.url;

    this.Active = function (title) {

        this.ul.find('li a[aria-controls="' + title + '"]').tab('show');

        if (_.isUndefined(wizardsgroup.data.tabs)) {
            wizardsgroup.set('tabs', []);
        }

        var data = wizardsgroup.data.tabs;

        var index = data.indexOf(title);
        if (index != -1) {
            data.splice(index, 1);
        }
        data.push(title);
        wizardsgroup.set('tabs', data);
    }

    this.Remove = function (title) {
        $('li a[aria-controls="' + title + '"]').remove();
        $('div.tab-content' + ' #' + title).remove();

        var data = wizardsgroup.data.tabs;
        data.splice(data.indexOf(title), 1);
        this.Active(data[data.length - 1]);
        wizardsgroup.set('tabs', data);
    }

    this.Add = function (title, url, close_bool) {

        if (this.ul.find('li a[aria-controls="' + title + '"]').length > 0) {
            this.Active(title);
            this.tab = this.ul.find('li[role="presentation"]');
            this.button = this.tab.find('button[class="close"]');
            this.content = this.container.find('.tab-pane[id="' + title + '"]');
            this.iframe = this.content.find('iframe[id="' + title + '"]');
            return this;
        }

        if (close_bool !== false) {
            this.button = $('<button>&nbsp;&nbsp;</button>')
                .append($('<span>&times;</span>'))
                .attr({ 'type': 'button', 'class': 'close', 'aria-label': 'Close' });

            this.button.click(this, function (e) {
                e.data.Remove.call(e.data, title);
            });
        }

        this.tab = $('<li></li>')
            .append($('<a></a>')
                .text(title)
                .append(this.button)
                .attr({ 'href': '#' + title, 'aria-controls': title, 'role': 'tab', 'data-toggle': 'tab' }))
            .attr({ role: 'presentation' });

        this.ul.append(this.tab);

        this.iframe = $('<div></div>').append($('<iframe></iframe>').attr({
            name: title,
            frameborder: 0,
            scrolling: 'auto',
            width: '100%',
            height: wizardsgroup.config.iframe.height,
            src: url.path,
            //onload: 'iFrame(this)'
        }));

        this.content = $('<div></div>')
            .append(this.iframe)
            .attr({ 'role': 'tabpanel', 'class': 'tab-pane', 'id': title });

        this.container.append(this.content);

        this.tab.find('a').click(this, function (e) {

            var title = $(this).attr('aria-controls');

            var data = wizardsgroup.data.tabs;
            var index = data.indexOf(title);
            if (index != -1) {
                data.splice(index, 1);
            }
            data.push(title);
            wizardsgroup.set('tabs', data);
        });

        this.Active(title);

        return this;
    }

    this.Insert = function (title, url, closeButton) {
        
        Add.call(this, title, url, closeButton);
    }

    function Add(title, url, closeButton) {

        if (this.ul.find('li a[aria-controls="' + title + '"]').length > 0) {
            this.Active(title);
            this.tab = this.ul.find('li[role="presentation"]');
            this.button = this.tab.find('button[class="close"]');
            this.content = this.container.find('.tab-pane[id="' + title + '"]');
            this.iframe = this.content.find('iframe[id="' + title + '"]');
            return this;
        }

        if (closeButton !== false) {

            this.button = $('<button>&nbsp;&nbsp;</button>')
                .append($('<span>&times;</span>'))
                .attr({ 'type': 'button', 'class': 'close', 'aria-label': 'Close' });

            this.button.click(this, function (e) {
                e.data.Remove.call(e.data, title);
            });
        }

        this.tab = $('<li></li>')
            .append($('<a></a>')
                .text(title)
                .append(this.button)
                .attr({ 'href': '#' + title, 'aria-controls': title, 'role': 'tab', 'data-toggle': 'tab' }))
            .attr({ role: 'presentation' });

        this.ul.append(this.tab);

        this.iframe = $('<div></div>').append($('<iframe></iframe>').attr({
            name: title,
            frameborder: 0,
            scrolling: 'auto',
            width: '100%',
            height: '400px',
            src: url.path,
            //onload: 'iFrame(this)'
        }));

        this.content = $('<div></div>')
            .append(this.iframe)
            .attr({ 'role': 'tabpanel', 'class': 'tab-pane', 'id': title });

        this.container.append(this.content);

        this.tab.find('a').click(this, function (e) {

            var title = $(this).attr('aria-controls');

            var data = wizardsgroup.data.tabs;
            var index = data.indexOf(title);
            if (index != -1) {
                data.splice(index, 1);
            }
            data.push(title);
            wizardsgroup.set('tabs', data);
        });

        this.Active(title);
    }

    return this;
}