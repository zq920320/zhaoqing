/* ===========================================================
 * jquery-onepage-scroll.js v1.2.1
 * ===========================================================
 * Copyright 2013 Pete Rojwongsuriya.
 * http://www.thepetedesign.com
 *
 * Create an Apple-like website that let user scroll
 * one page at a time
 *
 * Credit: Eike Send for the awesome swipe event
 * https://github.com/peachananr/onepage-scroll
 * 
 * License: GPL v3
 *
 * ========================================================== */

!function($){
  
  var defaults = {
    sectionContainer: "section",
    easing: "ease",
    animationTime: 1000,
    pagination: true,
    updateURL: false,
    keyboard: true,
    beforeMove: null,
    afterMove: null,
    loop: false,
    responsiveFallback: false
	};
	
	/*------------------------------------------------*/
	/*  Credit: Eike Send for the awesome swipe event */    
	/*------------------------------------------------*/
	
	$.fn.swipeEvents = function() {
      return this.each(function() {

        var startX,
            startY,
            $this = $(this);

        $this.bind('touchstart', touchstart);

        function touchstart(event) {
          var touches = event.originalEvent.touches;
          if (touches && touches.length) {
            startX = touches[0].pageX;
            startY = touches[0].pageY;
            $this.bind('touchmove', touchmove);
          }
        }

        function touchmove(event) {
          var touches = event.originalEvent.touches;
          if (touches && touches.length) {
            var deltaX = startX - touches[0].pageX;
            var deltaY = startY - touches[0].pageY;

            if (deltaX >= 50) {
              $this.trigger("swipeLeft");
            }
            if (deltaX <= -50) {
              $this.trigger("swipeRight");
            }
            if (deltaY >= 50) {
              $this.trigger("swipeUp");
            }
            if (deltaY <= -50) {
              $this.trigger("swipeDown");
            }
            if (Math.abs(deltaX) >= 50 || Math.abs(deltaY) >= 50) {
              $this.unbind('touchmove', touchmove);
            }
          }
        }

      });
    };
	

  $.fn.onepage_scroll = function(options){
    var settings = $.extend({}, defaults, options),
        el = $(this),
        sections = $(settings.sectionContainer)
        total = sections.length,
        status = "off",
        topPos = 0,
        lastAnimation = 0,
        quietPeriod = 500,
        paginationList = "";
    
    $.fn.transformPage = function(settings, pos, index, next_el) {
      if (typeof settings.beforeMove == 'function') settings.beforeMove(index, next_el);
      $(this).css({
        "-webkit-transform": "translate3d(0, " + pos + "%, 0)", 
        "-webkit-transition": "-webkit-transform " + settings.animationTime + "ms " + settings.easing,
        "-moz-transform": "translate3d(0, " + pos + "%, 0)", 
        "-moz-transition": "-moz-transform " + settings.animationTime + "ms " + settings.easing,
        "-ms-transform": "translate3d(0, " + pos + "%, 0)", 
        "-ms-transition": "-ms-transform " + settings.animationTime + "ms " + settings.easing,
        "transform": "translate3d(0, " + pos + "%, 0)", 
        "transition": "transform " + settings.animationTime + "ms " + settings.easing
      });
      $(this).one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(e) {
        if (typeof settings.afterMove == 'function') settings.afterMove(index, next_el);
      });
    }
    
    $.fn.moveDown = function() {
      var el = $(this)
      index = $(settings.sectionContainer +".active").data("index");
      current = $(settings.sectionContainer + "[data-index='" + index + "']");
      next = $(settings.sectionContainer + "[data-index='" + (index + 1) + "']");
      if(next.length < 1) {
        if (settings.loop == true) {
          pos = 0;
          next = $(settings.sectionContainer + "[data-index='1']");
        } else {
          return
        }
        
      }else {
        pos = (index * 100) * -1;
      }
      current.removeClass("active")
      next.addClass("active");
      if(settings.pagination == true) {
        $(".onepage-pagination li a" + "[data-index='" + index + "']").removeClass("active");
        $(".onepage-pagination li a" + "[data-index='" + next.data("index") + "']").addClass("active");
      }
      
      $("body")[0].className = $("body")[0].className.replace(/\bviewing-page-\d.*?\b/g, '');
      $("body").addClass("viewing-page-"+next.data("index"))
      
      if (history.replaceState && settings.updateURL == true) {
        var href = window.location.href.substr(0,window.location.href.indexOf('#')) + "#" + (index + 1);
        history.pushState( {}, document.title, href );
      }   
      el.transformPage(settings, pos, next.data("index"), next);
    }
    
    $.fn.moveUp = function() {
      var el = $(this)
      index = $(settings.sectionContainer +".active").data("index");
      current = $(settings.sectionContainer + "[data-index='" + index + "']");
      next = $(settings.sectionContainer + "[data-index='" + (index - 1) + "']");
      
      if(next.length < 1) {
        if (settings.loop == true) {
          pos = ((total - 1) * 100) * -1;
          next = $(settings.sectionContainer + "[data-index='"+total+"']");
        }
        else {
          return
        }
      }else {
        pos = ((next.data("index") - 1) * 100) * -1;
      }
      current.removeClass("active")
      next.addClass("active")
      if(settings.pagination == true) {
        $(".onepage-pagination li a" + "[data-index='" + index + "']").removeClass("active");
        $(".onepage-pagination li a" + "[data-index='" + next.data("index") + "']").addClass("active");
      }
      $("body")[0].className = $("body")[0].className.replace(/\bviewing-page-\d.*?\b/g, '');
      $("body").addClass("viewing-page-"+next.data("index"))
      
      if (history.replaceState && settings.updateURL == true) {
        var href = window.location.href.substr(0,window.location.href.indexOf('#')) + "#" + (index - 1);
        history.pushState( {}, document.title, href );
      }
      el.transformPage(settings, pos, next.data("index"), next);
    }
    
    $.fn.moveTo = function(page_index) {
      current = $(settings.sectionContainer + ".active")
      next = $(settings.sectionContainer + "[data-index='" + (page_index) + "']");
      if(next.length > 0) {
        current.removeClass("active")
        next.addClass("active")
        $(".onepage-pagination li a" + ".active").removeClass("active");
        $(".onepage-pagination li a" + "[data-index='" + (page_index) + "']").addClass("active");
        $("body")[0].className = $("body")[0].className.replace(/\bviewing-page-\d.*?\b/g, '');
        $("body").addClass("viewing-page-"+next.data("index"))
        
        pos = ((page_index - 1) * 100) * -1;
        
        if (history.replaceState && settings.updateURL == true) {
            var href = window.location.href.substr(0,window.location.href.indexOf('#')) + "#" + (page_index - 1);
            history.pushState( {}, document.title, href );
        }
        el.transformPage(settings, pos, page_index, next);
      }
    }
    
    function responsive() {
      if ($(window).width() < settings.responsiveFallback) {
        $("body").addClass("disabled-onepage-scroll");
        $(document).unbind('mousewheel DOMMouseScroll');
        el.swipeEvents().unbind("swipeDown swipeUp");
      } else {
        if($("body").hasClass("disabled-onepage-scroll")) {
          $("body").removeClass("disabled-onepage-scroll");
          $("html, body, .wrapper").animate({ scrollTop: 0 }, "fast");
        }
        
        
        el.swipeEvents().bind("swipeDown",  function(event){ 
          if (!$("body").hasClass("disabled-onepage-scroll")) event.preventDefault();
          el.moveUp();
        }).bind("swipeUp", function(event){ 
          if (!$("body").hasClass("disabled-onepage-scroll")) event.preventDefault();
          el.moveDown();
        });
        
        $(document).bind('mousewheel DOMMouseScroll', function(event) {
          event.preventDefault();
          var delta = event.originalEvent.wheelDelta || -event.originalEvent.detail;
          init_scroll(event, delta);
        });
      }
    }
    
    
    function init_scroll(event, delta) {
        var deltaOfInterest = delta,
            timeNow = new Date().getTime();
        // Cancel scroll if currently animating or within quiet period
        if(timeNow - lastAnimation < quietPeriod + settings.animationTime) {
            event.preventDefault();
            return;
        }

        if (deltaOfInterest < 0) {
          el.moveDown()
        } else {
          el.moveUp()
        }
        lastAnimation = timeNow;
    }
    
    // Prepare everything before binding wheel scroll
    
    el.addClass("onepage-wrapper").css("position","relative");
    $.each( sections, function(i) {
      $(this).addClass("ops-section").attr("data-index", i+1);
      topPos = topPos + 100;
      if(settings.pagination == true) {
        paginationList += "<li><a data-index='"+(i+1)+"' href='#" + (i+1) + "'></a></li>"
      }
    });
    
    el.swipeEvents().bind("swipeDown",  function(event){ 
      if (!$("body").hasClass("disabled-onepage-scroll")) event.preventDefault();
      el.moveUp();
    }).bind("swipeUp", function(event){ 
      if (!$("body").hasClass("disabled-onepage-scroll")) event.preventDefault();
      el.moveDown(); 
    });
    
    // Create Pagination and Display Them
    if(settings.pagination == true) {
      $("<ul class='onepage-pagination'>" + paginationList + "</ul>").prependTo("body");
      posTop = (el.find(".onepage-pagination").height() / 2) * -1;
      el.find(".onepage-pagination").css("margin-top", posTop);
    }
    
    if(window.location.hash != "" && window.location.hash != "#1") {
      init_index =  window.location.hash.replace("#", "")
      $(settings.sectionContainer + "[data-index='" + init_index + "']").addClass("active")
      $("body").addClass("viewing-page-"+ init_index)
      if(settings.pagination == true) $(".onepage-pagination li a" + "[data-index='" + init_index + "']").addClass("active");
      
      next = $(settings.sectionContainer + "[data-index='" + (init_index) + "']");
      if(next) {
        next.addClass("active")
        if(settings.pagination == true) $(".onepage-pagination li a" + "[data-index='" + (init_index) + "']").addClass("active");
        $("body")[0].className = $("body")[0].className.replace(/\bviewing-page-\d.*?\b/g, '');
        $("body").addClass("viewing-page-"+next.data("index"))
        if (history.replaceState && settings.updateURL == true) {
          var href = window.location.href.substr(0,window.location.href.indexOf('#')) + "#" + (init_index);
          history.pushState( {}, document.title, href );
        }
      }
      pos = ((init_index - 1) * 100) * -1;
      el.transformPage(settings, pos, init_index);
      
    }else{
      $(settings.sectionContainer + "[data-index='1']").addClass("active")
      $("body").addClass("viewing-page-1")
      if(settings.pagination == true) $(".onepage-pagination li a" + "[data-index='1']").addClass("active");
    }
    if(settings.pagination == true)  {
      $(".onepage-pagination li a").click(function (){
        var page_index = $(this).data("index");
        el.moveTo(page_index);
      });
    }
    
    
    $(document).bind('mousewheel DOMMouseScroll', function(event) {
      event.preventDefault();
      var delta = event.originalEvent.wheelDelta || -event.originalEvent.detail;
      if(!$("body").hasClass("disabled-onepage-scroll")) init_scroll(event, delta);
    });
    
    
    if(settings.responsiveFallback != false) {
      $(window).resize(function() {
        responsive();
      });
      
      responsive();
    }
    
    if(settings.keyboard == true) {
      $(document).keydown(function(e) {
        var tag = e.target.tagName.toLowerCase();
        
        if (!$("body").hasClass("disabled-onepage-scroll")) {
          switch(e.which) {
            case 38:
              if (tag != 'input' && tag != 'textarea') el.moveUp()
            break;
            case 40:
              if (tag != 'input' && tag != 'textarea') el.moveDown()
            break;
            default: return;
          }
        }
        
      });
    }
    return false;
  }
  
  
}(window.jQuery);


/*
 * jQuery Easing v1.3 - http://gsgd.co.uk/sandbox/jquery/easing/
 *
 * Uses the built in easing capabilities added In jQuery 1.1
 * to offer multiple easing options
 *
 * TERMS OF USE - jQuery Easing
 * 
 * Open source under the BSD License. 
 * 
 * Copyright © 2008 George McGinley Smith
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without modification, 
 * are permitted provided that the following conditions are met:
 * 
 * Redistributions of source code must retain the above copyright notice, this list of 
 * conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list 
 * of conditions and the following disclaimer in the documentation and/or other materials 
 * provided with the distribution.
 * 
 * Neither the name of the author nor the names of contributors may be used to endorse 
 * or promote products derived from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY 
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 *  COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 *  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED 
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 *  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED 
 * OF THE POSSIBILITY OF SUCH DAMAGE. 
 *
*/
jQuery.easing["jswing"]=jQuery.easing["swing"];jQuery.extend(jQuery.easing,{def:"easeOutQuad",swing:function(a,b,c,d,e){return jQuery.easing[jQuery.easing.def](a,b,c,d,e)},easeInQuad:function(a,b,c,d,e){return d*(b/=e)*b+c},easeOutQuad:function(a,b,c,d,e){return-d*(b/=e)*(b-2)+c},easeInOutQuad:function(a,b,c,d,e){if((b/=e/2)<1)return d/2*b*b+c;return-d/2*(--b*(b-2)-1)+c},easeInCubic:function(a,b,c,d,e){return d*(b/=e)*b*b+c},easeOutCubic:function(a,b,c,d,e){return d*((b=b/e-1)*b*b+1)+c},easeInOutCubic:function(a,b,c,d,e){if((b/=e/2)<1)return d/2*b*b*b+c;return d/2*((b-=2)*b*b+2)+c},easeInQuart:function(a,b,c,d,e){return d*(b/=e)*b*b*b+c},easeOutQuart:function(a,b,c,d,e){return-d*((b=b/e-1)*b*b*b-1)+c},easeInOutQuart:function(a,b,c,d,e){if((b/=e/2)<1)return d/2*b*b*b*b+c;return-d/2*((b-=2)*b*b*b-2)+c},easeInQuint:function(a,b,c,d,e){return d*(b/=e)*b*b*b*b+c},easeOutQuint:function(a,b,c,d,e){return d*((b=b/e-1)*b*b*b*b+1)+c},easeInOutQuint:function(a,b,c,d,e){if((b/=e/2)<1)return d/2*b*b*b*b*b+c;return d/2*((b-=2)*b*b*b*b+2)+c},easeInSine:function(a,b,c,d,e){return-d*Math.cos(b/e*(Math.PI/2))+d+c},easeOutSine:function(a,b,c,d,e){return d*Math.sin(b/e*(Math.PI/2))+c},easeInOutSine:function(a,b,c,d,e){return-d/2*(Math.cos(Math.PI*b/e)-1)+c},easeInExpo:function(a,b,c,d,e){return b==0?c:d*Math.pow(2,10*(b/e-1))+c},easeOutExpo:function(a,b,c,d,e){return b==e?c+d:d*(-Math.pow(2,-10*b/e)+1)+c},easeInOutExpo:function(a,b,c,d,e){if(b==0)return c;if(b==e)return c+d;if((b/=e/2)<1)return d/2*Math.pow(2,10*(b-1))+c;return d/2*(-Math.pow(2,-10*--b)+2)+c},easeInCirc:function(a,b,c,d,e){return-d*(Math.sqrt(1-(b/=e)*b)-1)+c},easeOutCirc:function(a,b,c,d,e){return d*Math.sqrt(1-(b=b/e-1)*b)+c},easeInOutCirc:function(a,b,c,d,e){if((b/=e/2)<1)return-d/2*(Math.sqrt(1-b*b)-1)+c;return d/2*(Math.sqrt(1-(b-=2)*b)+1)+c},easeInElastic:function(a,b,c,d,e){var f=1.70158;var g=0;var h=d;if(b==0)return c;if((b/=e)==1)return c+d;if(!g)g=e*.3;if(h<Math.abs(d)){h=d;var f=g/4}else var f=g/(2*Math.PI)*Math.asin(d/h);return-(h*Math.pow(2,10*(b-=1))*Math.sin((b*e-f)*2*Math.PI/g))+c},easeOutElastic:function(a,b,c,d,e){var f=1.70158;var g=0;var h=d;if(b==0)return c;if((b/=e)==1)return c+d;if(!g)g=e*.3;if(h<Math.abs(d)){h=d;var f=g/4}else var f=g/(2*Math.PI)*Math.asin(d/h);return h*Math.pow(2,-10*b)*Math.sin((b*e-f)*2*Math.PI/g)+d+c},easeInOutElastic:function(a,b,c,d,e){var f=1.70158;var g=0;var h=d;if(b==0)return c;if((b/=e/2)==2)return c+d;if(!g)g=e*.3*1.5;if(h<Math.abs(d)){h=d;var f=g/4}else var f=g/(2*Math.PI)*Math.asin(d/h);if(b<1)return-.5*h*Math.pow(2,10*(b-=1))*Math.sin((b*e-f)*2*Math.PI/g)+c;return h*Math.pow(2,-10*(b-=1))*Math.sin((b*e-f)*2*Math.PI/g)*.5+d+c},easeInBack:function(a,b,c,d,e,f){if(f==undefined)f=1.70158;return d*(b/=e)*b*((f+1)*b-f)+c},easeOutBack:function(a,b,c,d,e,f){if(f==undefined)f=1.70158;return d*((b=b/e-1)*b*((f+1)*b+f)+1)+c},easeInOutBack:function(a,b,c,d,e,f){if(f==undefined)f=1.70158;if((b/=e/2)<1)return d/2*b*b*(((f*=1.525)+1)*b-f)+c;return d/2*((b-=2)*b*(((f*=1.525)+1)*b+f)+2)+c},easeInBounce:function(a,b,c,d,e){return d-jQuery.easing.easeOutBounce(a,e-b,0,d,e)+c},easeOutBounce:function(a,b,c,d,e){if((b/=e)<1/2.75){return d*7.5625*b*b+c}else if(b<2/2.75){return d*(7.5625*(b-=1.5/2.75)*b+.75)+c}else if(b<2.5/2.75){return d*(7.5625*(b-=2.25/2.75)*b+.9375)+c}else{return d*(7.5625*(b-=2.625/2.75)*b+.984375)+c}},easeInOutBounce:function(a,b,c,d,e){if(b<e/2)return jQuery.easing.easeInBounce(a,b*2,0,d,e)*.5+c;return jQuery.easing.easeOutBounce(a,b*2-e,0,d,e)*.5+d*.5+c}})
/*
 *
 * TERMS OF USE - EASING EQUATIONS
 * 
 * Open source under the BSD License. 
 * 
 * Copyright © 2001 Robert Penner
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without modification, 
 * are permitted provided that the following conditions are met:
 * 
 * Redistributions of source code must retain the above copyright notice, this list of 
 * conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list 
 * of conditions and the following disclaimer in the documentation and/or other materials 
 * provided with the distribution.
 * 
 * Neither the name of the author nor the names of contributors may be used to endorse 
 * or promote products derived from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY 
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 *  COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 *  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED 
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 *  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED 
 * OF THE POSSIBILITY OF SUCH DAMAGE. 
 *
 */
;(function($){
	$.extend( jQuery.easing ,{
		flyFastSlow: function (x, t, b, c, d) {
			return -c * ((t=t/d-1)*t*t*t  - 1) + b;
		}
	});
	
	$.fn.coffee = function(option){
		var $coffee = $(this);
		var opts = $.extend({},$.fn.coffee.defaults,option);
		var coffeeWidth = $coffee.width() + opts.coffeeHandleWidth  - 100 ;
		$coffee.append('<div class="coffee-steam-box" style="height:'+ opts.steamTopMax+'px; width:'+ (coffeeWidth) +'px; left:0px;top:-'+ opts.steamTopMax+'px;position:absolute;overflow:hidden;z-index:0;"></div>');
		var $coffeeSteamBox = $coffee.find('div.coffee-steam-box');
		var coffeeSteamBoxWidth = $coffeeSteamBox.width();
		
		setInterval(function(){
			steam();
		}, rand( opts.makeSteamInterval / 2 , opts.makeSteamInterval * 2 ) );
		wind();
		return $coffee ;
		
		function steam(){	
			coffeeSteamBoxWidth = $coffeeSteamBox.width();		
			var fontSize = rand( 8 , opts.steamMaxSize  ) ;
			var xPos = rand( coffeeSteamBoxWidth - coffeeWidth , coffeeSteamBoxWidth - opts.coffeeHandleWidth - fontSize );
			var rotate = rand(-5,5);
			var rotateStyle = ' -moz-transform:rotate('+rotate+'deg);-webkit-transform:rotate('+rotate+'deg);-o-transform:rotate('+rotate+'deg);transform:rotate('+rotate+'deg);';
			var color = '#'+ randoms(6 , '0123456789ABCDEF' );
			var steamsFontFamily = randoms( 1, opts.steamsFontFamily )
			var html = '<span class="coffee-steam" style="position:absolute;left:'+xPos+'px;top: '+opts.steamTopMax+'px;font-size:'+fontSize+'px;color:'+ color +';font-family:'+steamsFontFamily +';'+rotateStyle+';-webkit-text-size-adjust:none;display:block; ">'+ randoms( 1, opts.steams ) +'</span>';			
			var $fly = $(html);
			var left = rand( 0 , coffeeSteamBoxWidth - opts.coffeeHandleWidth - fontSize );
			if( left > xPos )
				left = rand( 0 , xPos );
			$fly.appendTo($coffeeSteamBox).animate({
				top		: rand( opts.steamTopMax / 2 , 0 ),
				left	: left  ,
				opacity	: 0
			} , rand( opts.steamFlyTime / 2 , opts.steamFlyTime * 1.2 ) , 'flyFastSlow' ,  function(){
				$fly.remove();
				$fly = null;			
			});
		};
		
		function wind(){
			var left = rand( - coffeeWidth + opts.coffeeHandleWidth , 0 );
			$coffeeSteamBox.animate({
				width : Math.abs(left) + coffeeWidth ,
				left	: left 
			} , rand( 1000 , 3000) , rand( 1 , ['flyFastSlow' ]),  function(){
				 setTimeout(function(){
					wind();	
				}, rand( 100 , 3000 ) ) ;
			});
		};
		
		function randoms( length , chars ) {
			length = length || 1 ;
			var hash = '';
			var maxNum = chars.length - 1;
			var num = 0;
			for( i = 0; i < length; i++ ) {
				num = rand( 0 , maxNum - 1  );
				hash += chars.slice( num , num + 1 );
			}
			return hash;
		};		
		function rand(mi,ma){   
			var range = ma - mi;
			var out = mi + Math.round( Math.random() * range) ;	
			return parseInt(out);
		};		
	};

	$.fn.coffee.defaults = {
		steams				: ['jQuery','HTML5','$.fn()','var','CODING','THINKING','DREAMING','Python','CoffeeScript','Git','Yoeman','Grunt','Bower','Markdown','Evernote','MongoDB','Redis','MySQL','Tornado','WebPy','Scrapy','$.find();','AngularJS','$.ajax()','NodeJS','Sencha','Supervisor','Highcharts','Highstock','Datatables','Bootstrap','Tor','apkTools','UpYun','Jekyll','Pygments','Nose','Mako','Getui','Jasmine','Express' ,'Koa' ,'Passport' ,'AceTemplate' ,'KISSY','SeaJs'], 
		steamsFontFamily	: ['Verdana','Geneva','Comic Sans MS','MS Serif','Lucida Sans Unicode','Times New Roman','Trebuchet MS','Arial','Courier New','Georgia'],
		steamFlyTime		: 18000 , /*Steam飞行的时间,单位 ms 。（决定steam飞行速度的快慢）*/
		makeSteamInterval	: 800 , /*制造Steam时间间隔,单位 ms.*/
		steamMaxSize		: 30 ,/*制造Steam时间间隔,单位 ms.*/
		steamTopMax			: 600,
		coffeeHandleWidth	: 600 
	};
	$.coffee = {}
	$.coffee.version = '1.0.0';
})(jQuery);
var CV = {
    random: function(e, t) {
        return Math.floor(Math.random() * (t - e + 1) + e)
    },
    drawSkillsArc: function() {
        function o(e, t) {
            t.node["on" + e] = function() {
                for (var n = 0,
                r = t.events.length; n < r; n++) t.events[n].name == e && t.events[n].f.call(t)
            }
        }
        function l() {
            var t = {
                fill: "#228fbd",
                stroke: "none",
                transform: "t615 180"
            },
            n = e.path("M86.112,80.5 86.892,81.191 87.847,80.774 88.374,81.673 89.411,81.572 89.635,82.589 90.653,82.813 90.551,83.851 91.45,84.378 91.033,85.333 91.725,86.112 91.033,86.892 91.45,87.847 90.551,88.374 90.653,89.411 89.635,89.635 89.411,90.653 88.374,90.551 87.847,91.45 86.892,91.033 86.112,91.725 85.333,91.033 84.378,91.45 83.851,90.551 82.813,90.653 82.589,89.635 81.572,89.411 81.673,88.374 80.774,87.847 81.191,86.892 80.5,86.112 81.191,85.333 80.774,84.378 81.673,83.851 81.572,82.813 82.589,82.589 82.813,81.572 83.851,81.673 84.378,80.774 85.333,81.191 z").attr(t).animate({
                path: "M86.112,0 98.071,10.609 112.723,4.214 120.818,18 136.728,16.446 140.167,32.057 155.778,35.497 154.224,51.406 168.011,59.501 161.616,74.154 172.225,86.112 161.616,98.071 168.011,112.723 154.224,120.818 155.778,136.728 140.167,140.167 136.728,155.778 120.818,154.224 112.723,168.011 98.071,161.616 86.112,172.225 74.154,161.616 59.501,168.011 51.406,154.224 35.497,155.778 32.057,140.167 16.446,136.728 18,120.818 4.214,112.723 10.609,98.071 0,86.112 10.609,74.154 4.214,59.501 18,51.406 16.446,35.497 32.057,32.057 35.497,16.446 51.406,18 59.501,4.214 74.154,10.609 z"
            },
            2e3, "bounce").hover(function() {
                this.animate({
                    fill: "#005687",
                    path: "M86.112,-16 100.293,-3.42 117.667,-11.003 127.267,5.345 146.132,3.502 150.211,22.014 168.723,26.093 166.879,44.958 183.228,54.557 175.645,71.932 188.225,86.112 175.645,100.293 183.228,117.667 166.879,127.267 168.723,146.132 150.211,150.211 146.132,168.723 127.267,166.879 117.667,183.228 100.293,175.645 86.112,188.225 71.932,175.645 54.557,183.228 44.958,166.879 26.093,168.723 22.014,150.211 3.502,146.132 5.345,127.267 -11.003,117.667 -3.42,100.293 -16,86.112 -3.42,71.932 -11.003,54.557 5.345,44.958 3.502,26.093 22.014,22.014 26.093,3.502 44.958,5.345 54.557,-11.003 71.932,-3.42"
                },
                1e3, "bounce")
            },
            function() {
                this.animate({
                    fill: "#228fbd",
                    path: "M86.112,0 98.071,10.609 112.723,4.214 120.818,18 136.728,16.446 140.167,32.057 155.778,35.497 154.224,51.406 168.011,59.501 161.616,74.154 172.225,86.112 161.616,98.071 168.011,112.723 154.224,120.818 155.778,136.728 140.167,140.167 136.728,155.778 120.818,154.224 112.723,168.011 98.071,161.616 86.112,172.225 74.154,161.616 59.501,168.011 51.406,154.224 35.497,155.778 32.057,140.167 16.446,136.728 18,120.818 4.214,112.723 10.609,98.071 0,86.112 10.609,74.154 4.214,59.501 18,51.406 16.446,35.497 32.057,32.057 35.497,16.446 51.406,18 59.501,4.214 74.154,10.609 z"
                },
                1e3, "bounce")
            });
            f.push(n),
            setTimeout(function() {
                var t = e.text(703, 250, "生命不息\n学习不止").attr({
                    "font-size": 22,
                    fill: "#fff",
                    "font-family": s
                });
                f.push(t)
            },
            1e3)
        }
        var e = Raphael("skillsArc", 830, 500),
        t = 73,
        n = "Skills",
        r = 250;
        e.circle(250, 250, 5).attr({
            stroke: "none",
            fill: "#193340"
        }).animate({
            r: 85
        },
        1e3, ">");
        var i = e.text(250, 250, n).attr({
            font: "20px Hiragino Sans GB, Microsoft YaHei, sans-serif",
            fill: "#fff"
        }).toFront(),
        s = "Hiragino Sans GB, Microsoft YaHei, sans-serif";
        e.customAttributes.arc = function(e, t, n) {
            var r = 3.6 * e,
            i = r == 360 ? 359.99 : r,
            s = (90 - i) * Math.PI / 180,
            o = 250 + n * Math.cos(s),
            u = 250 - n * Math.sin(s),
            a = [["M", 250, 250 - n], ["A", n, n, 0, +(i > 180), 1, o, u]];
            return {
                path: a,
                stroke: t
            }
        };
        var u = e.circle(702, 20, 5).attr({
            stroke: "none",
            fill: "#228fbd"
        }),
        a = e.path("M 702 20 L 702 20").attr({
            fill: "none",
            stroke: "#228fbd",
            "stroke-width": 1
        }).animate({
            path: "M702 20 L 702 180"
        },
        1e3, ">", l),
        f = e.set();
        f.push(u),
        f.push(a);
        var c = [{
            kind: "Python",
            score: "80",
            color: "#97BE0D"
        },
        {
            kind: "WebFront",
            score: "55",
            color: "#D84F5F"
        },
        {
            kind: "Database",
            score: "70",
            color: "#88B8E6"
        },
        {
            kind: "Others",
            score: "65",
            color: "#998566"
        }],
        h = e.set(),
        p = {
            "arc-python": [[250, "Tonado"], [200, "Web.py"],  [300, "Scrapy"]],
            "arc-database": [[300, "MongoDB"], [250, "Reids"], [150, "MySQL"],[150,"Oracle"],[150,"SQLite"]],
            "arc-webfront": [[200, "Coffeescript"], [130, "JavaScript"], [100, "NodeJS"], [110, "Grunt"], [170, "Bower"]],
            "arc-others": [[200, "Git"], [210, "Yoeman"], [280, "Markdown"], [260, "Evernote"],[300,"Java"]]
        },
        d = 30,
        v = 550,
        m = 150,
        g = v + 10;
        setTimeout(function() {
            for (var u = 0; u < c.length; u++) {
                var a = c[u],
                l = a.color,
                y = a.score,
                b = a.kind,
                w = "arc-" + b.toLowerCase().replace("&", "_");
                t += 30;
                var E = e.path().attr({
                    arc: [y, l, t],
                    "stroke-width": 26
                });
                E.node.id = w,
                function(t, u, a) {
                    o("mouseover", E),
                    o("mouseout", E),
                    E.mouseover(function() {
                        this.animate({
                            "stroke-width": 50,
                            opacity: .75
                        },
                        1e3, "elastic"),
                        Raphael.type != "VML" && this.toFront(),
                        i.stop().animate({
                            opacity: 0
                        },
                        r, ">",
                        function() {
                            this.attr({
                                text: a + "\n" + u + "%"
                            }).animate({
                                opacity: 1
                            },
                            r, "<")
                        });
                        var n = this.node.id;
                        for (var o = 0,
                        l = p[n]; o < l.length; o++) {
                            var c = d + 10,
                            y = e.rect(v, m + c * o, 1, d).attr({
                                fill: t,
                                stroke: "none"
                            }).animate({
                                width: l[o][0]
                            },
                            2e3 * Math.random(), "bounce"),
                            b = e.text(g, c * o + m + d / 2, l[o][1]).attr({
                                "font-size": 20,
                                fill: "#fff",
                                "font-family": s,
                                "text-anchor": "start"
                            });
                            h.push(y),
                            h.push(b)
                        }
                        f.forEach(function(e) {
                            var t = Raphael.animation({
                                opacity: 0
                            },
                            500, ">");
                            e.stop().animate(t)
                        })
                    }).mouseout(function() {
                        this.stop().animate({
                            "stroke-width": 26,
                            opacity: 1
                        },
                        r * 4, "elastic"),
                        i.stop().animate({
                            opacity: 0
                        },
                        r, ">",
                        function() {
                            i.attr({
                                text: n
                            }).animate({
                                opacity: 1
                            },
                            r, "<")
                        }),
                        console.log(h.length),
                        h.length > 0 && (h.forEach(function(e) {
                            e.remove()
                        }), h.clear()),
                        f.forEach(function(e) {
                            var t = Raphael.animation({
                                opacity: 1
                            },
                            1e3, ">");
                            e.stop().animate(t)
                        })
                    })
                } (l, y, b)
            }
        },
        1500)
    },
    drawIcons: function() {
        var e = {
            fill: "#285AA9",
            "stroke-width": 0,
            opacity: .5
        },
        t = "t-240,-240s0.07",
        n = Raphael("icon_mobile", 35, 35),
        r = "M22.065,18.53c-0.467-0.29-1.167-0.21-1.556,0.179l-3.093,3.092c-0.389,0.389-1.025,0.389-1.414,0L9.05,14.848c-0.389-0.389-0.389-1.025,0-1.414l2.913-2.912c0.389-0.389,0.447-1.075,0.131-1.524L6.792,1.485C6.476,1.036,5.863,0.948,5.433,1.29c0,0-4.134,3.281-4.134,6.295c0,12.335,10,22.334,22.334,22.334c3.015,0,5.948-5.533,5.948-5.533c0.258-0.486,0.087-1.122-0.38-1.412L22.065,18.53z";
        n.path(r).attr(e);
        var i = Raphael("icon_email", 35, 35),
        s = "M28.516,7.167H3.482l12.517,7.108L28.516,7.167zM16.74,17.303C16.51,17.434,16.255,17.5,16,17.5s-0.51-0.066-0.741-0.197L2.5,10.06v14.773h27V10.06L16.74,17.303z";
        i.path(s).attr(e);
        var o = Raphael("icon_weibo", 35, 35),
        u = "M231.37,290.319c-2.825-1.122-6.355,0.234-8.011,3.012c-1.607,2.793-0.721,5.971,2.109,7.135c2.879,1.186,6.553-0.182,8.214-3.022C235.269,294.581,234.238,291.366,231.37,290.319zM219.894,240.975c-47.513,4.699-83.544,33.788-80.457,64.981c3.086,31.197,44.105,52.677,91.624,47.987c47.523-4.699,83.538-33.793,80.457-65.002C308.437,257.754,267.417,236.275,219.894,240.975z M261.586,314.548c-9.698,21.933-37.591,33.629-61.254,25.997c-22.846-7.375-32.517-29.933-22.515-50.253c9.821-19.924,35.379-31.192,57.99-25.308C259.209,271.03,271.151,293.106,261.586,314.548zM213.235,297.838c-7.359-3.087-16.87,0.086-21.409,7.204c-4.598,7.151-2.441,15.669,4.865,18.996c7.413,3.386,17.254,0.171,21.853-7.162C223.055,309.47,220.679,301.011,213.235,297.838zM256.417,50c-113.771,0-206,92.229-206,206c0,113.771,92.229,206,206,206c113.771,0,205.999-92.229,205.999-206C462.416,142.229,370.188,50,256.417,50zM230.901,370.958c-59.55,0-120.419-28.859-120.419-76.324c0-24.816,15.722-53.515,42.797-80.596c36.154-36.144,78.316-52.608,94.171-36.742c6.997,6.985,7.674,19.091,3.178,33.542c-2.344,7.279,6.831,3.247,6.831,3.263c29.222-12.234,54.717-12.955,64.035,0.358c4.973,7.097,4.497,17.046-0.085,28.576c-2.12,5.314,0.651,6.136,4.694,7.348c16.464,5.105,34.792,17.452,34.792,39.209C360.895,325.603,308.965,370.958,230.901,370.958zM338.705,220.029c1.928-5.949,0.722-12.731-3.771-17.708c-4.485-4.967-11.112-6.852-17.228-5.56v-0.011c-5.1,1.111-10.125-2.163-11.22-7.257c-1.095-5.116,2.163-10.147,7.273-11.236c12.507-2.66,26.056,1.207,35.23,11.385c9.195,10.179,11.652,24.042,7.722,36.208c-1.603,4.978-6.937,7.69-11.909,6.099c-4.972-1.613-7.689-6.953-6.088-11.92H338.705zM393.839,237.834c-0.006,0.011-0.006,0.032-0.006,0.043c-1.868,5.768-8.068,8.929-13.836,7.06c-5.789-1.869-8.951-8.053-7.082-13.837l-0.005-0.005c5.735-17.751,2.099-38.002-11.289-52.848c-13.404-14.846-33.164-20.518-51.423-16.641c-5.938,1.266-11.78-2.526-13.046-8.459c-1.271-5.928,2.516-11.771,8.454-13.041h0.01c25.666-5.458,53.473,2.51,72.324,23.412C396.798,184.399,401.887,212.863,393.839,237.834z";
        o.path(u).transform(t).attr(e)
    },
    drawExperienceTimeLine: function() {
        function i() {
            e.path("M300 130 L 300 130").attr({
                fill: "none",
                "stroke-dasharray": "- ",
                stroke: "#000",
                "stroke-width": 1
            }).animate({
                path: "M300 130 L 300 600 l 300 600"
            },
            1e3, "backOut");
            for (var n = 0; n < t.length; n++) {
                var i = t[n][1]; (function(r) {
                    e.circle(300, 1500, r).attr({
                        stroke: "none",
                        fill: t[n][2]
                    }).animate({
                        cy: t[n][0]
                    },
                    1e3 + 1e3 * Math.random(), "backOut").hover(function() {
                        this.animate({
                            r: r * 1.5
                        },
                        500, "bounce")
                    },
                    function() {
                        this.animate({
                            r: r
                        },
                        500, "bounce")
                    })
                })(i),
                e.text(360, 1500, t[n][3]).attr({
                    "font-size": 14,
                    fill: "#649996",
                    "font-family": r,
                    "text-anchor": "start"
                }).animate(Raphael.animation({
                    y: t[n][0]
                },
                1e3, "backOut").delay(1e3)),
                e.text(360, 1500, t[n][4]).attr({
                    "font-size": 16,
                    fill: "#898989",
                    "font-family": r,
                    "text-anchor": "start"
                }).animate(Raphael.animation({
                    y: t[n][0] + 25
                },
                1e3, "backOut").delay(1e3)),
                e.text(360, 1500, t[n][5]).attr({
                    "font-size": 14,
                    fill: "#898989",
                    "font-family": r,
                    "text-anchor": "start"
                }).animate(Raphael.animation({
                    y: t[n][0] + 50
                },
                1e3, "backOut").delay(1e3))
            }
        }
        var e = new Raphael("experienceTimeLine", 900, 680),
        t = [
                [200, 15, "#97BE0D", "2010.09 - 2014.07，哈尔滨", "东北林业大学 本科", "软件工程"], 
                [300, 10, "#88B8E6", "2013.01 - 2013.02，哈尔滨", "百脑汇", "笔记本销售"], 
                [400, 20, "#88B8E6", "2013.03 - 2013.08，哈尔滨", "鑫联华软件技术有限公司", "研发实习生"], 
                [500, 23, "#88B8E6", "2013.10 - 至今，哈尔滨", "宝利明威", "Python&&测试"]
            ],
        n = [["#97BE0D", 400, "学习"], ["#88B8E6", 530, "工作经历"]],
        r = "Hiragino Sans GB, Microsoft YaHei, sans-serif";
        e.text(0, 95, "1992年3月，出生").attr({
            "font-size": 16,
            fill: "#898989",
            "font-family": r,
            "text-anchor": "start"
        }),
        e.path("M 130 95 L 170 95 176 95 182 95 188 95 260 95 300 95 385 95").attr({
            fill: "none",
            "stroke-dasharray": "- ",
            stroke: "#000",
            "stroke-width": 1
        }).animate({
            path: "M 130 95 L 170 95 176 88 182 105 188 95 260 95 300 130 385 45"
        },
        1e3, "bounce", i);
        for (icategory = 0; icategory < n.length; icategory++) e.circle(n[icategory][1], 30, 10).attr({
            stroke: "none",
            fill: n[icategory][0]
        }),
        e.text(n[icategory][1] + 25, 30, n[icategory][2]).attr({
            "font-size": 16,
            fill: "#898989",
            "font-family": r,
            "text-anchor": "start"
        })
    },
    drawProjectsGallery: function() {
        var e = "M28.936,2.099H2.046c-0.506,0-0.919,0.414-0.919,0.92v21.097c0,0.506,0.413,0.919,0.919,0.919h17.062v-0.003h9.828c0.506,0,0.92-0.413,0.92-0.921V3.019C29.854,2.513,29.439,2.099,28.936,2.099zM28.562,20.062c0,0.412-0.338,0.75-0.75,0.75H3.062c-0.413,0-0.75-0.338-0.75-0.75v-16c0-0.413,0.337-0.75,0.75-0.75h24.75c0.412,0,0.75,0.337,0.75,0.75V20.062zM20.518,28.4c-0.033-0.035-0.062-0.055-0.068-0.062l-0.01-0.004l-0.008-0.004c0,0-0.046-0.021-0.119-0.062c-0.108-0.056-0.283-0.144-0.445-0.237c-0.162-0.097-0.32-0.199-0.393-0.271c-0.008-0.014-0.035-0.079-0.058-0.17c-0.083-0.32-0.161-0.95-0.22-1.539h-7.5c-0.023,0.23-0.048,0.467-0.076,0.691c-0.035,0.272-0.073,0.524-0.113,0.716c-0.02,0.096-0.039,0.175-0.059,0.23c-0.009,0.025-0.018,0.05-0.024,0.062c-0.003,0.006-0.005,0.01-0.007,0.013c-0.094,0.096-0.34,0.246-0.553,0.36c-0.107,0.062-0.209,0.11-0.283,0.146c-0.074,0.037-0.119,0.062-0.119,0.062l-0.007,0.004l-0.008,0.004c-0.01,0.009-0.038,0.022-0.07,0.062c-0.031,0.037-0.067,0.103-0.067,0.185c0.002,0.002-0.004,0.037-0.006,0.088c0,0.043,0.007,0.118,0.068,0.185c0.061,0.062,0.143,0.08,0.217,0.08h9.716c0.073,0,0.153-0.021,0.215-0.08c0.062-0.063,0.068-0.142,0.068-0.185c-0.001-0.051-0.008-0.086-0.007-0.088C20.583,28.503,20.548,28.439,20.518,28.4z",
        t = ["#005687", "#7bbfea", "#646993", "#88B8E6", "#BEDBE9", "#566A76", "#8CAFB8"],
        n = {
            fill: "#005687",
            "stroke-width": 0
        },
        r = new Raphael("projectsGallery", 980, 605),
        s = [737, 919, 1111, 332, 609, 558],
        o = "/media/thumb2/",
        u = r.image(o + i[0], 278, 26, 473, 315).attr({
            "clip-rect": "278, 26, 473, 315",
            opacity: 1
        }),
        a = 0,
        f = r.path(e).attr(n).translate(500, 230).scale(18);
        Raphael.type == "VML" && f.translate(1.4, 1.4);
        var l = r.path("M6.73,45.2 0,38.47 15.868,22.601 0,6.731 6.73,0 29.332,22.601 z").attr({
            cursor: "pointer",
            fill: "#005687",
            opacity: 0,
            stroke: "none"
        }).transform("t900 300").animate({
            opacity: 1
        },
        500, "bouce"),
        c = r.path("M22.702,0 29.332,6.73 13.464,22.6 29.332,38.469 22.702,45.2 0,22.6 z").attr({
            cursor: "pointer",
            fill: "#005687",
            opacity: 0,
            stroke: "none",
            zIndex: 999
        }).transform("t0 300").animate({
            opacity: 1
        },
        500, "bouce");
        c.translate(40, 200),
        l.translate(40, 200),
        l.click(function() {
            $("#projectIntro table").eq(a).fadeOut(1e3),
            a++,
            a > i.length - 1 && (a = 0);
            var e = t[a % t.length],
            n = t[(a + 1) % t.length];
            f.animate({
                fill: e
            },
            1e3, "bouce"),
            l.animate({
                fill: e
            },
            1e3, "bouce"),
            c.animate({
                fill: e
            },
            1e3, "bouce"),
            u.animate({
                opacity: 0
            },
            3e3, "bouce").attr({
                src: o + i[a],
                opacity: 0
            }).animate({
                opacity: 1
            },
            3e3, "bouce"),
            $("#projectIntro table").eq(a).fadeIn(1e3),
            $("#galleryCursor .cursor").text(a + 1).css({
                color: e
            }),
            $("#galleryCursor .total").css({
                color: n
            })
        }),
        c.click(function() {
            $("#projectIntro table").eq(a).fadeOut(1e3),
            a--,
            a < 0 && (a = i.length - 1);
            var e = t[a % t.length],
            n = t[(a + 1) % t.length];
            f.animate({
                fill: e
            },
            1e3, "bouce"),
            l.animate({
                fill: e
            },
            1e3, "bouce"),
            c.animate({
                fill: e
            },
            1e3, "bouce"),
            u.animate({
                opacity: 0
            },
            3e3, "bouce").attr({
                src: o + i[a],
                opacity: 0
            }).animate({
                opacity: 1
            },
            3e3, "bouce"),
            $("#projectIntro table").eq(a).fadeIn(1e3),
            $("#galleryCursor .cursor").text(a + 1).css({
                color: e
            }),
            $("#galleryCursor .total").css({
                color: n
            })
        }),
        $("#galleryCursor .cursor").text(1).css({
            color: t[0]
        }),
        $("#galleryCursor .total").text(i.length).css({
            color: t[1]
        }),
        $("#galleryCursor").fadeIn(2e3)
    }
};
$(document).ready(function(){

setInterval(function(){


$("#head").css("-webkit-transform","rotate(-10deg)");
$("#head").css("-o-transform","rotate(-10deg)");
$("#head").css("-moz-transform","rotate(-10deg)");
setTimeout(function(){


$("#head").css("-webkit-transform","rotate(10deg)");
$("#head").css("-o-transform","rotate(10deg)");
$("#head").css("-moz-transform","rotate(10deg)");

},1000);

},2000);






});

// Generated by CoffeeScript 1.7.1
$(function() {
  $("#intro .text, #intro .contact").fadeIn(2e3);
  $(".main").onepage_scroll({
    sectionContainer: "section",
    easing: "ease",
    animationTime: 1000,
    pagination: true,
    updateURL: false,
    loop: false,
    keyboard: true,
    responsiveFallback: false,
    beforeMove: function(index, next_el) {
      var drawSkills;
      if (index === 2 && next_el.find('h2').attr('class') === "animated") {
        next_el.find('h2').addClass('fadeInLeftBig');
        next_el.find('h3').addClass('fadeInUp');
        next_el.find(".skillsList li").addClass("fadeInLeftBig");
        next_el.find(".skillsList li").hover(function() {
          var e;
          e = "arc-" + $(this).text().toLowerCase();
          $("#" + e).trigger("mouseover");
        }, function() {
          var e;
          e = "arc-" + $(this).text().toLowerCase();
          $("#" + e).trigger("mouseout");
        });
        drawSkills = function() {
          var e;
          e = "arc-" + $(this).text().toLowerCase();
          e = e.replace(/&/, "_");
          $("#" + e).trigger("mouseout");
          CV.drawSkillsArc();
        };
        drawSkills();
      }
      if (index === 3 && next_el.find('h2').attr('class') === "animated") {
        next_el.find("h2").addClass('fadeInLeftBig');
        CV.drawExperienceTimeLine();
      }
      if (index === 4 && next_el.find('h2').attr('class') === "animated") {
        next_el.find("h2").addClass('fadeInLeftBig');
      }
      if (index === 5 && next_el.find("h2").attr('class') === "animated") {
        next_el.find("h2").addClass('fadeInLeftBig');
      }
      if (index === 6 && next_el.find("h2").attr('class') === "animated") {
        next_el.find("h2").addClass('fadeInLeftBig');
      }
      if (index === 7) {
        next_el.find("h1").removeClass('tada');
        setTimeout(function() {
          next_el.find("h1").addClass('tada');
          return console.log(next_el.find("h1").attr("class"));
        }, 500);
      }
    }
  });
  $('div.coffee').coffee();
});
