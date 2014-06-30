$ ->
   initGalleryScript()
   $("#intro .text, #intro .contact").fadeIn(2e3)
   $(".main").onepage_scroll {
      sectionContainer: "section"     # sectionContainer accepts any kind of selector in case you don't want to use section
      easing: "ease"                  # Easing options accepts the CSS3 easing animation such "ease", "linear", "ease-in", 
      animationTime: 1000             # AnimationTime let you define how long each section takes to animate
      pagination: true                # You can either show or hide the pagination. Toggle true for show, false for hide.
      updateURL: false                # Toggle this true if you want the URL to be updated automatically when the user scroll to each page.
      loop: false                     # You can have the page loop back to the top/bottom when the user navigates at up/down on the first/last page.
      keyboard: true                  # You can activate the keyboard controls
      responsiveFallback: false       # You can fallback to normal page scroll by defining the width of the browser in which
      # beforeMove: ->                  # This option accepts a callback function. The function will be called before the page moves.
      # afterMove: ->                   # This option accepts a callback function. The function will be called after the page moves.
      beforeMove: (index, next_el) ->
         #第二页
         if index is 2 and next_el.find('h2').attr('class') is "animated"
            next_el.find('h2').addClass 'fadeInLeftBig'
            next_el.find('h3').addClass 'fadeInUp'
            next_el.find(".skillsList li").addClass "fadeInLeftBig"
            next_el.find(".skillsList li").hover(->
               e = "arc-" + $(this).text().toLowerCase()
               $("#" + e).trigger("mouseover")
               return
            , ->
               e = "arc-" + $(this).text().toLowerCase()
               $("#" + e).trigger("mouseout")
               return            
            )
            drawSkills = ->
               e = "arc-" + $(this).text().toLowerCase()
               e = e.replace /&/, "_"
               $("#" + e).trigger("mouseout")
               CV.drawSkillsArc()
               return
            drawSkills()
         #第三页
         if index is 3 and next_el.find('h2').attr('class') is "animated"
            next_el.find("h2").addClass 'fadeInLeftBig'
            CV.drawExperienceTimeLine()
         #第四页
         if index is 4 and next_el.find('h2').attr('class') is "animated"
            next_el.find("h2").addClass 'fadeInLeftBig'
         #第五页
         if index is 5 and next_el.find("h2").attr('class') is "animated"
            next_el.find("h2").addClass 'fadeInLeftBig'
         #第六页
         if index is 6 and next_el.find("h2").attr('class') is "animated"
            next_el.find("h2").addClass 'fadeInLeftBig'
         #第七页
         if index is 7
            next_el.find("h1").removeClass 'tada'
            setTimeout ->
               next_el.find("h1").addClass 'tada'
               console.log next_el.find("h1").attr("class")
            , 500
         return

      # afterMove: (index, next_el) ->
   }
   $('div.coffee').coffee()
   return
