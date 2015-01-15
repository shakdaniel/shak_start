(function() {
    var test = 'working!';
    var opa = 0.7;
    document.body.addEventListener('click', function(e) {
        if (e.target.tagName === 'DIV') {
            var myOverlay = document.createElement('div');
            myOverlay.className = 'overlay';
            document.body.appendChild(myOverlay);

            //set overlay styles
            myOverlay.style.position = 'fixed';
            myOverlay.style.top = '0';
            myOverlay.style.width = '100%';
            myOverlay.style.height = '100%';
            myOverlay.style.background = 'rgba(0,0,0,0'+opa+')';
            myOverlay.style.cursor = 'pointer';


            var elemClass = e.target.className;
            var addClass = elemClass.substr(0, elemClass.length-13);

            console.log(addClass);
        } // target is a div

    }, false); // elem is clicked

})(); // execute function


/*
// - Noel Delgado | @pixelia_me


var nodes  = document.querySelectorAll('li'),
    _nodes = [].slice.call(nodes, 0);

var getDirection = function (ev, obj) {
    var w = obj.offsetWidth,
        h = obj.offsetHeight,
        x = (ev.pageX - obj.offsetLeft - (w / 2) * (w > h ? (h / w) : 1)),
        y = (ev.pageY - obj.offsetTop - (h / 2) * (h > w ? (w / h) : 1)),
        d = Math.round( Math.atan2(y, x) / 1.57079633 + 5 ) % 4;
  
    return d;
};

var addClass = function ( ev, obj, state ) {
    var direction = getDirection( ev, obj ),
        class_suffix = "";
    
    obj.className = "";
    
    switch ( direction ) {
        case 0 : class_suffix = '-top';    break;
        case 1 : class_suffix = '-right';  break;
        case 2 : class_suffix = '-bottom'; break;
        case 3 : class_suffix = '-left';   break;
    }
    
    obj.classList.add( state + class_suffix );
};

// bind events
_nodes.forEach(function (el) {
    el.addEventListener('mouseover', function (ev) {
        addClass( ev, this, 'in' );
    }, false);

    el.addEventListener('mouseout', function (ev) {
        addClass( ev, this, 'out' );
    }, false);
});
*/