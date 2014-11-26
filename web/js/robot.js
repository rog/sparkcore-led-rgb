/** jQuery is too mainstream **/
var has_class = function ( el, cls ) {
    return el.className.match( new RegExp('(\\s|^)' + cls + '(\\s|$)') );
}
var add_class = function ( el, cls ) {
    if ( !this.has_class( el, cls ) ) el.className += " " + cls;
}

var remove_class = function ( el, cls ) {
    if ( has_class( el, cls ) ) {
        var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
        el.className = el.className.replace( reg, ' ' );
    }
}

/** SparkCore stuff **/
var spark_core = {
    'id': 'YOUR_SPARK_CORE_ID',
    'token': 'YOUR_SPARK_CORE_ACCESS_TOKEN'
};

var led_colors = {
    'led_r': 0,
    'led_g': 0,
    'led_b': 0
};
var send_colors = document.getElementById('send_colors');
send_colors.addEventListener('click', function( e ) {
    e.preventDefault();
    if( !has_class( send_colors, 'disabled') ){
        add_class( send_colors, 'disabled');
        send_colors.childNodes[0].nodeValue = 'Sending';
        var http = new XMLHttpRequest();
        var data = 'access_token=' + spark_core['token'] + '&params=[' + JSON.stringify( led_colors ) +']';
        http.open('POST', 'https://api.spark.io/v1/devices/' + spark_core['id'] + '/led', true);
        http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        http.onreadystatechange = function() {
            if ( http.readyState == 4 && http.status == 200 ) {
                console.log( http.responseText );
                remove_class( send_colors, 'disabled' );
                send_colors.childNodes[0].nodeValue = 'Send';
            }
        }
        http.send(data);
    }
}, false);

/** ColorPicker stuff **/
var led_anode_red = document.getElementById('led_anode_red'),
    led_anode_green = document.getElementById('led_anode_green'),
    led_anode_blue = document.getElementById('led_anode_blue'),
    led_color = document.querySelectorAll('.led_color');

var color_red = document.getElementById('color_red'),
    color_green = document.getElementById('color_green'),
    color_blue = document.getElementById('color_blue');

ColorPicker(
    document.getElementById('color-picker'),
    function(hex, hsv, rgb) {
        led_anode_red.style.stroke   = 'rgb(' + rgb.r + ',0,0)';
        color_red.value = rgb.r;
        led_colors.led_r = 255 - rgb.r;

        led_anode_green.style.stroke = 'rgb(0,' + rgb.g + ',0)';
        color_green.value = rgb.g;
        led_colors.led_g = 255 - rgb.g;

        led_anode_blue.style.stroke  = 'rgb(0,0,' + rgb.b + ')';
        color_blue.value = rgb.b;
        led_colors.led_b = 255 - rgb.b;

        for(var i = 0; i < led_color.length; i++ )
            led_color[i].style.fill  = hex;
    }
).setHex('#eeeeee');