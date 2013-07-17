    'use strict'

    var guides = { version: 0.1 }
    ,   count = 0
    ,   from = false
    ,   to = false
    ,   link = false
    ,   px = function(s){ return +s.substring(0, s.length-2) }
    ,   styles = '<style>.guides{width:100%;height:100%;position:absolute;top:0;left:0;color:#EEE;font-family:Tahoma;font-size:11px;text-align:center;opacity:1;-webkit-transition:all .4s}.guides.hide{opacity:0}.guides *{box-sizing:border-box}.guides .horizontal,.guides .vertical{position:absolute;background:red;box-shadow:0 0 10px 0 red}.guides .horizontal{left:0!important;width:100%;height:1px!important}.guides .vertical{top:0!important;height:100%;width:1px!important}.guides .link{position:absolute;background:green;width:100%;height:100%;box-shadow:0 0 10px 0 green}.guides .link-vertical{right:100px;width:1px!important;left:auto!important}.guides .link-horizontal{top:100px!important;height:1px!important}.guides .link-horizontal::after,.guides .link-horizontal::before,.guides .link-vertical::after,.guides .link-vertical::before{content:'';position:absolute;display:block;width:0;height:0;border:5px solid transparent}.guides .link-vertical::before{left:-5px;top:-5px;border-bottom-color:green}.guides .link-vertical::after{left:-5px;bottom:-5px;border-top-color:green}.guides .link-horizontal::before{left:-5px;top:-5px;border-right-color:green}.guides .link-horizontal::after{right:-5px;top:-5px;border-left-color:green}.guides .value{position:absolute;display:block;min-width:20px;min-height:20px;padding:0 5px;background:#000;border-radius:15px;line-height:20px}.guides .vertical .value,.guides .link-vertical .value{left:5px;top:50%}.guides .horizontal .value,.guides .link-horizontal .value{left:50%;top:5px}.guides .value::before{content:'';position:absolute;display:block;width:0;height:0;border:5px solid transparent}.guides .vertical .value::before,.guides .link-vertical .value::before{left:-8px;top:50%;margin-top:-5px;border-right-color:#000}.guides .horizontal .value::before,.guides .link-horizontal .value::before{left:50%;top:-8px;margin-left:-5px;border-bottom-color:#000}</style>'

    guides.init = function() {
        if (typeof $ == 'undefined') return setTimeout(guides.init, 100)
        $('head').get(0).innerHTML += styles
        
        guides.$dom = $('<div class="guides">').prependTo('html')
        guides.listen()
    }

    guides.toggle = function() {
        guides.$dom.toggleClass('hide')
    }   

    guides.update = function() {
        $('.guides .vertical, .guides .horizontal')
            .height($('html').height())
            .width($('width').width())
    }   

    guides.listen = function(){
        $(document).on('mouseup', function(){
            $('.following').removeClass('following')
        })

        $(document).on('mousemove', function(e){
            $('.following').offset({ top: e.pageY, left: e.pageX })
        })

        $(window).resize(guides.update)

        $(document).on('keyup', function(e){
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
        guides.update()
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
