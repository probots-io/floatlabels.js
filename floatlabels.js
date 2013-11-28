/**
 * FloatLabels
 * Version: 1.0
 * URL: http://clubdesign.github.io/floatlabels.js/
 * Description: 
 * Author: Marcus Pohorely ( http://www.clubdesign.at )
 * Copyright: Copyright 2013 / 2014 http://www.clubdesign.at
 */

;(function ( $, window, document, undefined ) {

        var pluginName = "floatlabel",
            defaults = {
                slideInput                      : true,
                labelStartTop                   : '20px',
                labelEndTop                     : '10px',
                transitionDuration              : 0.3,
                transitionEasing                : 'ease-in-out',
                labelClass                      : '',
                typeMatches                     : /text|password|email|number|search|url/
            };

        function Plugin ( element, options ) {
            
            this.$element       = $(element);
            this.settings       = $.extend( {}, defaults, options );

            this.init();
        
        }

        Plugin.prototype = {

            init: function () {

                var self = this;
                
                var animationCss = {
                    '-webkit-transition'            : 'all ' + this.settings.transitionDuration + 's ' + this.settings.transitionEasing,
                    '-moz-transition'               : 'all ' + this.settings.transitionDuration + 's ' + this.settings.transitionEasing,
                    '-o-transition'                 : 'all ' + this.settings.transitionDuration + 's ' + this.settings.transitionEasing,
                    '-ms-transition'                : 'all ' + this.settings.transitionDuration + 's ' + this.settings.transitionEasing,
                    'transition'                    : 'all ' + this.settings.transitionDuration + 's ' + this.settings.transitionEasing,
                };

                if( this.$element.prop('tagName').toUpperCase() !== 'INPUT' ) { return; }

                if( !this.settings.typeMatches.test( this.$element.attr('type') ) ) { return; }

                

                var elementID           = this.$element.attr('id');

                if( !elementID ) {
                    elementID = Math.floor( Math.random() * 100 ) + 1;
                    this.$element.attr('id', elementID);
                }

                var placeholderText     = this.$element.attr('placeholder');
                var floatingText        = this.$element.data('label');
                var extraClasses        = this.$element.data('class');

                if( !extraClasses ) { extraClasses = ''; }

                if( !placeholderText || placeholderText === '' ) { placeholderText = "You forgot to add placeholder attribute!"; }
                if( !floatingText || floatingText === '' ) { floatingText = placeholderText; }

                this.inputPaddingTop    = parseFloat( this.$element.css('padding-top') ) + 10;

                this.$element.wrap('<div class="floatlabel-wrapper" style="position:relative"></div>');
                this.$element.before('<label for="' + elementID + '" class="label-floatlabel ' + this.settings.labelClass + ' ' + extraClasses + '">' + floatingText + '</label>');

                this.$label = this.$element.prev('label');
                this.$label.css({
                    'position'                      : 'absolute',
                    'top'                           : this.settings.labelStartTop,
                    'left'                          : this.$element.css('padding-left'),
                    'display'                       : 'none',
                    '-moz-opacity'                  : '0',
                    '-khtml-opacity'                : '0',
                    '-webkit-opacity'               : '0',
                    'opacity'                       : '0'
                });

                if( !this.settings.slideInput ) {
                    
                    this.$element.css({
                        'padding-top'                   : this.inputPaddingTop,
                    });

                }

                this.$element.on('keyup blur change', function( e ) {
                    self.checkValue( e );
                });


                window.setTimeout( function() {

                    self.$label.css( animationCss );
                    self.$element.css( animationCss );

                }, 100);

                this.checkValue();

            },

            checkValue: function( e ) {

                if( e ) {

                    var keyCode         = e.keyCode || e.which;
                    if( keyCode === 9 ) { return; }
                
                }

                var currentFlout    = this.$element.data('flout');
                

                if( this.$element.val() !== "" ) { this.$element.data('flout', '1'); }
                if( this.$element.val() === "" ) { this.$element.data('flout', '0'); }



                if( this.$element.data('flout') === '1' && currentFlout !== '1' ) {
                    this.showLabel();
                }

                if( this.$element.data('flout') === '0' && currentFlout !== '0' ) {
                    this.hideLabel();
                }

            },
            showLabel: function() {

                var self = this;

                self.$label.css({
                    'display'                       : 'block'
                });

                window.setTimeout(function() {

                    self.$label.css({
                        'top'                           : self.settings.labelEndTop,
                        '-moz-opacity'                  : '1',
                        '-khtml-opacity'                : '1',
                        '-webkit-opacity'               : '1',
                        'opacity'                       : '1'
                    });

                    if( self.settings.slideInput ) {

                        self.$element.css({
                            'padding-top'               : self.inputPaddingTop
                        });

                    }

                }, 50);

            },

            hideLabel: function() {

                var self = this;

                self.$label.css({
                    'top'                           : self.settings.labelStartTop,
                    '-moz-opacity'                  : '0',
                    '-khtml-opacity'                : '0',
                    '-webkit-opacity'               : '0',
                    'opacity'                       : '0'
                });

                if( self.settings.slideInput ) {

                    self.$element.css({
                        'padding-top'               : parseFloat( self.inputPaddingTop ) - 10
                    });

                }

                window.setTimeout(function() {
                    self.$label.css({
                        'display'                       : 'none'
                    });
                }, self.settings.transitionDuration * 1000);

            }
        };

        $.fn[ pluginName ] = function ( options ) {
            return this.each(function() {
                if ( !$.data( this, "plugin_" + pluginName ) ) {
                    $.data( this, "plugin_" + pluginName, new Plugin( this, options ) );
                }
            });
        };

})( jQuery, window, document );