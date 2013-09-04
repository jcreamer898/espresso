(function() {
    var espresso = espresso || {
        converters: {}
    };

    espresso._setupEvents = function() {
    };

    espresso.parse = function() {
        espresso._setupEvents();
        $( "pre" ).each(function() {
            espresso.processElement( this );
        });
    };

    espresso.processElement = function( el ) {
        var $el = $( el ),
            $btn = $("<button />", {
                text: "JavaScript",
                "class": "convert-btn",
                "style": "position: absolute",
            }).hide(),
            content;

        $btn.data( "el", $el );

        if ( content = espresso.convert($el) ) {
            $el.before( $btn );

            $el.mouseover(function(e) {
                $btn.show();
            }).mouseleave(function(e) {
                if (e.relatedTarget && e.relatedTarget !== $btn[0]) { 
                    $btn.hide();
                }
            });

            $btn.css({
                top: $el.position().top + 5,
                left: $el.position().left + $el.outerWidth() - $btn.outerWidth() - 5
            });

            if ( !$el.data("processed") ) {
                $el.data( "contentOrig", $el.text() );
                
                $el.data({ 
                    "contentConverted": content,
                    "processed": true
                });

                $btn.on('click', function() {
                    $el.text( $el.data("isConverted") ? $el.data("contentOrig") : $el.data("contentConverted") );
                    $el.data("isConverted", !$el.data("isConverted"))
                        .removeClass("javascript coffeescript")
                        .addClass(!$el.data("isConverted") ? "coffeescript" : "javascript");
                    
                    $(this).text(!$el.data("isConverted") ? "JavaScript" : "Coffee");

                    hljs.highlightBlock($el[0]);
                });
            }
        }
    };

    espresso.convert = function( el ) {
        var $el = $(el),
            converter = espresso.converters.coffee2js,
            content;
        
        try {
            content = converter($el.text());
        }
        catch(e) {
            console.warn('code is not CoffeeScript');
        }

        return content;
    };

    espresso.register = function( name, fn ) {
        this.converters[ name ] = fn;
    };

    espresso.register( "coffee2js", CoffeeScript.compile );
    // espresso.register( "js2coffee", Js2coffee.build );

    espresso.parse();
}());
