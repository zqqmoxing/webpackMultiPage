const tableRender = require('tpl/table.art');
let EventsList = function(element, options) {
    var $main = $('#wrapper');
    var $list = $main.find('#events-list');
    var $pullDown = $main.find('#pull-down');
    var $pullDownLabel = $main.find('#pull-down-label');
    var $pullUp = $main.find('#pull-up');
    var topOffset = -$pullDown.outerHeight();

    // this.compiler = Handlebars.compile($('#tpi-list-item').html());
    this.prev = this.next = this.start = options.params.start;
    this.total = null;

    this.getURL = function(params) {
        var queries = ['callback=?'];
        for (var key in  params) {
            if (key !== 'start') {
                queries.push(key + '=' + params[key]);
            }
        }
        queries.push('start=');
        return options.api + '?' + queries.join('&');
    };

    this.renderList = function(start, type) {
        var _this = this;
        var $el = $pullDown;

        if (type === 'load') {
            $el = $pullUp;
        }

        $.getJSON(this.URL + start).then(function(data) {
            console.log(data);
            _this.total = data.total;
            var html = tableRender({data:data.events});
            // var html = _this.compiler(data.events);
            if (type === 'refresh') {
                $list.children('li').first().before(html);
            } else if (type === 'load') {
                $list.append(html);
                if(_this.next >= _this.total){
                    $('.pull-up').hide();
                    $('.pull-none').show();
                }
            } else {
                $list.html(html);
                $('.pull-action').show();
                $('.pull-none').hide();
            }

            // refresh iScroll
            setTimeout(function() {
                _this.iScroll.refresh();
            }, 100);
        }, function() {
            console.log('Error...')
        }).always(function() {
            _this.resetLoading($el);
            if (type !== 'load') {
                _this.iScroll.scrollTo(0, topOffset, 800, $.AMUI.iScroll.utils.circular);
            }
        });
    };

    this.setLoading = function($el) {
        $el.addClass('loading');
    };

    this.resetLoading = function($el) {
        $el.removeClass('loading');
    };

    this.init = function() {
        var myScroll = this.iScroll = new $.AMUI.iScroll('#wrapper', {
            click: true
        });
        // myScroll.scrollTo(0, topOffset);
        var _this = this;
        var pullFormTop = false;
        var pullStart;

        this.URL = this.getURL(options.params);
        this.renderList(options.params.start);

        myScroll.on('scrollStart', function() {
            console.log('111');
            console.log(this.y,topOffset);
            if (this.y >= topOffset) {//下拉刷新
                pullFormTop = true;
            }
            pullStart = this.y;
        });

        myScroll.on('scrollEnd', function() {
            console.log('222');
            console.log(this.directionY);
            console.log(pullFormTop);
            console.log(this.y);
            if (pullFormTop && this.directionY === -1) {
                _this.handlePullDown();
            }
            pullFormTop = false;

            // pull up to load more
            if (pullStart === this.y && (this.directionY === 1)) {
                _this.handlePullUp();
            }
        });
    };

    this.handlePullDown = function() {
        console.log('handle pull down');
        if (this.prev > 0) {
            this.setLoading($pullDown);
            this.prev -= options.params.count;
            this.renderList(this.prev, 'refresh');
        } else {
            console.log('别刷了，没有了');
        }
    };

    this.handlePullUp = function() {
        console.log('handle pull up');
        console.log(this.next);

        if (this.next < this.total) {
            this.setLoading($pullUp);
            this.next += options.params.count;
            this.renderList(this.next, 'load');
        } else {
            console.log('别刷了，没有了');
            // this.iScroll.scrollTo(0, topOffset);
        }
    }
};
export {EventsList};