/*
 * demo-slide.js
 * Copyright (C) 2015 KuoE0 <kuoe0.tw@gmail.com>
 *
 * Distributed under terms of the MIT license.
 */

function debug(msg) {
	var txt = document.getElementById('log').value;
	document.getElementById('log').value = msg + '\n' + txt;
}

(function(exports) {
  'use strict';

	function Slide(presentation) {
    this._presentation = presentation;
  }

	var proto = Slide.prototype;

	proto.init = function () {
    this._presentation.receiver.getConnection().then(
      this._initConnection.bind(this)
    );

    this._presentation.receiver.onconnectionavailable = (e) => {
      this._presentation.receiver.getConnection().then(
        this._initConnection.bind(this)
      );
    };
  };

  proto._initConnection = function (connection) {

    if (!this._presentation) {
      throw new Error('Init connection without the presentation object.');
    }

    this._connection = connection;
    this._connection.addEventListener('message', this);
  };

  proto.handleEvent = function (evt) {
    debug('event type: ' + evt.type);
    switch(evt.type) {
      case 'message':
        var msg = JSON.parse(evt.data);
        debug(JSON.stringify(msg));

        if (msg.type == 'prev') {
          debug('prev slide');
          Reveal.prev();
          this._connection.send(JSON.stringify({'type': 'ack', 'command': 'prev'}));
        }
        else if (msg.type == 'next') {
          debug('next slide');
          Reveal.next();
          this._connection.send(JSON.stringify({'type': 'ack', 'command': 'next'}));
        }
        break;
    }
  };

  exports.Slide = Slide;

  window.onload = function() {

    setTimeout(() => {
      window.slide = new Slide(navigator.presentation);
      window.slide.init();
      swal({
        title: "Presentation is ready!",
        type: "success",
        timer: 2000,
        showCancelButton: false,
        showConfirmButton: false
      });
    }, 1000);

    Reveal.initialize({
      // Display controls in the bottom right corner
      controls: true,

      // Display a presentation progress bar
      progress: true,

      // Display the page number of the current slide
      slideNumber: false,

      // Push each slide change to the browser history
      history: false,

      // Enable keyboard shortcuts for navigation
      keyboard: true,

      // Enable the slide overview mode
      overview: true,

      // Vertical centering of slides
      center: true,

      // Enables touch navigation on devices with touch input
      touch: true,

      // Loop the presentation
      loop: false,

      // Change the presentation direction to be RTL
      rtl: false,

      // Turns fragments on and off globally
      fragments: true,

      // Flags if the presentation is running in an embedded mode,
      // i.e. contained within a limited portion of the screen
      embedded: false,

      // Flags if we should show a help overlay when the questionmark
      // key is pressed
      help: true,

      // Flags if speaker notes should be visible to all viewers
      showNotes: false,

      // Number of milliseconds between automatically proceeding to the
      // next slide, disabled when set to 0, this value can be overwritten
      // by using a data-autoslide attribute on your slides
      autoSlide: 0,

      // Stop auto-sliding after user input
      autoSlideStoppable: true,

      // Enable slide navigation via mouse wheel
      mouseWheel: false,

      // Hides the address bar on mobile devices
      hideAddressBar: true,

      // Opens links in an iframe preview overlay
      previewLinks: false,

      // Transition style
      transition: 'default', // none/fade/slide/convex/concave/zoom

      // Transition speed
      transitionSpeed: 'default', // default/fast/slow

      // Transition style for full page slide backgrounds
      backgroundTransition: 'default', // none/fade/slide/convex/concave/zoom

      // Number of slides away from the current that are visible
      viewDistance: 3,

      // Parallax background image
      parallaxBackgroundImage: '', // e.g. "'https://s3.amazonaws.com/hakim-static/reveal-js/reveal-parallax-1.jpg'"

      // Parallax background size
      parallaxBackgroundSize: '', // CSS syntax, e.g. "2100px 900px"

      // Number of pixels to move the parallax background per slide
      // - Calculated automatically unless specified
      // - Set to 0 to disable movement along an axis
      parallaxBackgroundHorizontal: null,
      parallaxBackgroundVertical: null
    });
  };

})(window);

