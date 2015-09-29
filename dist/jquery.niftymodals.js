/*!
 * jquery.niftymodals v1.1.0 (https://github.com/foxythemes/jquery-niftymodals)
 * Copyright 2015 Foxy Themes 
 * Licensed under MIT license 
 */

;(function($) {
  'use strict';

  $.fn.niftyModal = function(method) {

    var defaults = {
      overlaySelector: '.md-overlay',
      closeSelector: '.md-close',
      classAddAfterOpen: 'md-show',
      modalAttr: 'data-modal',
      perspectiveClass: 'md-perspective',
      perspectiveSetClass: 'md-setperspective',
      data: false,
      buttons: false,
      beforeOpen: false,
      afterOpen: false,
      beforeClose: false,
      afterClose: false
    };

    var config = {};
    var modal = {};
    var methods = {

      init : function( options ) {

        return this.each(function() {
          config = $.extend({}, defaults, options);

          modal.modalEl = this;

          if( config.data !== false ){
            modal.data = options.data;
          }

          //Show modal
          helpers.showModal( this );
        });

      },
      toggle: function(options) {
        return this.each(function() {
          config = $.extend({}, defaults, options);
          var modal = $(this);
          if(modal.hasClass(config.classAddAfterOpen)){
            helpers.removeModal(modal);
          }else{
            helpers.showModal(modal);
          }
        });
      },
      show: function(options) {
        config = $.extend({}, defaults, options);
        return this.each(function() {

          var mod = $( this );

          //Show the modal
          helpers.showModal( mod );
          
        });
      },
      hide: function(options) {
        config = $.extend({}, defaults, options);
        return this.each(function() {
          helpers.removeModal($(this));  
        });            
      }
    };

    var helpers = {

      removeModal: function( m ) {
        var mod = $( m );
        mod.removeClass( config.classAddAfterOpen );
        mod.css({'perspective':'1300px'});
        mod.trigger('hide');
      },    
      showModal: function( m ){
        var mod = $(m);
        var overlay = $(config.overlaySelector);
        var close = $(config.closeSelector, m);

        //beforeOpen event
        if( typeof config.beforeOpen === 'function' ){
          if( config.beforeOpen( modal ) === false){
            return false;
          }
        }

        //Make the modal visible
        mod.addClass(config.classAddAfterOpen, function( m ){
          
          //After open event
          if( typeof config.afterOpen === 'function' ){
            config.afterOpen( modal );
          }
        });
        
        //Overlay Click Event
        overlay.on('click', function ( e ) {

          modal.closeEl = overlay.get( 0 );

          //Before close event
          if( typeof config.beforeClose === 'function' ){
            if( config.beforeClose(modal, e) === false ){
              return false;
            }
          }
          
          helpers.removeModal(m);
          overlay.off('click');

          //After close event
          if( typeof config.afterClose === 'function' ){
            config.afterClose(modal, e);
          }

        });

        setTimeout( function() {
          mod.css({'perspective':'none'});
          
          //3D Blur Bug Fix
          if( mod.height() % 2 !== 0){
            mod.css({ 'height' : mod.height() + 1 });
          }

        }, 500 ); 
        
        //Close Event
        close.on( 'click', function( ev ) {
          
          modal.closeEl = close.get( 0 );

          //Before close event
          if( typeof config.beforeClose === 'function' ){
            if( config.beforeClose(modal, ev) === false ){
              return false;
            }
          }  

          //Buttons callback
          if( config.buttons && $.isArray( config.buttons ) ){
            var cancel = true;
            
            $.each(config.buttons, function( i, v){
              if( close.hasClass( v.class ) && typeof v.callback !== undefined && typeof v.callback === 'function' ){
                cancel = v.callback( close.get( 0 ), modal, ev);
              }
            });

            if( !cancel ){
              return false;
            }
          }  
        
          helpers.removeModal( m );
          close.off('click');

          //After close event
          if( typeof config.afterClose === 'function' ){
            config.afterClose( modal, ev);
          }

          ev.stopPropagation();
        });
        
        mod.trigger('show');
      }

    };

    if (methods[method]) {
        return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
    } else if (typeof method === 'object' || !method) {
        return methods.init.apply(this, arguments);
    } else {
        $.error( 'Method "' +  method + '" does not exist in niftyModal plugin!');
    }

  };

})(jQuery);