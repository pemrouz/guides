    'use strict'

    var guides = { version: 0.1 }
    ,   count = 0
    ,   from = false
    ,   to = false
    ,   link = false
    ,   px = function(s){ return +s.substring(0, s.length-2) }

    guides.init = function() {
        if (typeof $ == 'undefined') return setTimeout(guides.init, 100)
        $('head')
            .append('<link rel="stylesheet/less" type="text/css" href="styles.less" />')
            .append('<script type="text/javascript" src="less.js"></script>')

        guides.$dom = $('<div class="guides">').prependTo('html')
        guides.listen()
    }

    guides.toggle = function() {
        guides.$dom.toggleClass('hide')
    }   

    guides.listen = function(){
        $(document).on('mouseup', function(){
            $('.following').removeClass('following')
        })

        $(document).on('mousemove', function(e){
            $('.following').offset({ top: e.pageY, left: e.pageX })
        })

        $(document).on('keyup', function(e){
            console.log(e.which)
            if (link) guides.link(e.which)
            switch (e.which) {
                case 67: guides.clear();           break;  // C
                case 86: guides.add('vertical');   break;  // V
                case 72: guides.add('horizontal'); break;  // H
                case 76: link = true;              break;  // L
                case 27: guides.cancel();          break;  // ESC
            }
        })
    }

    guides.cancel = function() {
        $('.following').remove()
        --count
    }

    guides.clear = function() {
        guides.$dom.empty()
        count = 0
    }

    guides.add = function(orientation) {
        if ($('.following.' + orientation).length) return;
        $('<div class="following">')
            .addClass(orientation)
            .attr('data-index', ++count)
            .append($('<div class="value">').text(count))
            .appendTo(guides.$dom)
    }

    guides.link = function(value){
        if (from === false) { from = value - 48; return} 
        if (to   === false) { to = value - 48}
        
        from = $('[data-index=' + from + ']')
        to = $('[data-index=' + to + ']')

        var orientation = false
        if (from.hasClass('horizontal') && to.hasClass('horizontal')) orientation = 'link-vertical' 
        if (from.hasClass('vertical') && to.hasClass('vertical')) orientation = 'link-horizontal' 

        if (orientation) {
            var top     = (from.offset().top < to.offset().top ? from.offset().top : to.offset().top) + 1
            ,   bottom  = (from.offset().top > to.offset().top ? from.offset().top : to.offset().top)
            ,   height  = bottom - top
            ,   left    = (from.offset().left < to.offset().left ? from.offset().left : to.offset().left) + 1
            ,   right   = (from.offset().left > to.offset().left ? from.offset().left : to.offset().left)
            ,   width   = right - left

            $('<div class="link">')
                .addClass(orientation)
                .css('top', top + 'px')
                .css('height', height + 'px')
                .css('left', left + 'px')
                .css('width', width + 'px')
                .append($('<div class="value">').text(orientation == 'link-vertical' ? height : width))
                .appendTo(guides.$dom)
        }

        from = to = link = false
    }

    guides.init()