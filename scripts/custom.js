// (function() {
//     // Toggle State Function.
//     var toggleState = function(el, a, b) {
//         var elem = document.querySelector(el);
//         elem.setAttribute('data-state', elem.getAttribute('data-state')===a?b:a);
//     };
//     // Add Trigger.
//     var trigger = document.querySelector('.trigger');
//     // On Click Run Toggle Function.
//     trigger.onclick = function(e) {
//         toggleState('nav', 'close', 'open');
//         toggleState('.icon-menu', 'close', 'open');
//         e.preventDefault();
//     };
// })();