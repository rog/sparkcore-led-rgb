#include "jsmnSpark.h"
#define DIM(array)  (sizeof(array) / sizeof(array[0]))

int red_brightness = 0, blue_brightness = 0, green_brightness = 0;
static const struct {
    const char *object_name;
    const int  pin;
    int        *brightness;
    const char *label;
} led_options[] = {
    { "led_r", A7, &red_brightness,   " RED: "   },
    { "led_g", A6, &green_brightness, " GREEN: " },
    { "led_b", A5, &blue_brightness,  " BLUE: "  },
};

void setup(){
    int i;
    // Register the Spark function to control the LED
    Spark.function( "led", led_control );
    for ( i = 0; i < DIM( led_options ); i++ )
      pinMode( led_options[i].pin, OUTPUT );

    Serial.begin( 9600 );
}


int led_control( String command ){
    int i, j, r, color_count = 0;
    const char *json_str;
    char obj[5];
    jsmn_parser p;
    jsmntok_t tok[7];

    json_str = command.c_str();
    Serial.println( json_str );
    jsmn_init(&p);
    r = jsmn_parse(&p, json_str, tok, 10);
    if (r != JSMN_SUCCESS){
      Serial.println("Error: Parse failed.");
      return -1;
    }

    for (i = 2; i < (tok[1].size + 2); i++) {
      if (tok[i].type != JSMN_STRING){
        Serial.println("Error: Expected string.");
        return -1;
      } else {
        strlcpy(obj, &json_str[tok[i].start], (tok[i].end - tok[i].start + 1) );
        for ( j = 0; j < DIM( led_options ); j++ ) {
            if( !strcmp( obj, led_options[j].object_name ) ){
                i++;
                strlcpy( obj, &json_str[tok[i].start], ( tok[i].end - tok[i].start + 1 ) );
                *led_options[j].brightness = atoi( obj );
                Serial.print( led_options[j].label );
                Serial.println( *led_options[j].brightness );
                color_count++;
            }
        }
      }
    }

    if( color_count != 3 ){
      Serial.println("Error: Too few objects. Expected 3.");
      return -1;
    }

    for ( j = 0; j < DIM( led_options ); j++ )
      analogWrite( led_options[j].pin, *led_options[j].brightness );

    return 1;
}
