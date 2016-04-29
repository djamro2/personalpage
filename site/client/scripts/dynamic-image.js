/**
 * Created by djamr on 4/28/2016.
 * This file will enlarge the specific project-item on hover and show extra info
 */

$(document).ready(function(){

    // global variables for this session
    var z_index_counter = 1;
    var currently_busy = 0;
    var currentExpandingId = null;

    // dimension values
    var original_width = -1;
    var original_height = -1;

    // helper function to change the absolute values
    var set_position_bounds_change = function(myImage, container, bound_a, bound_b) {

        // the black transparent layer over the image
        var black_overlay = $(container).children()[1];

        var bound_a_op = bound_a === 'top' ? 'bottom' : 'top';
        var bound_b_op = bound_b === 'left' ? 'right' : 'left';

        // change position of image
        $(myImage).css(bound_a, '0');
        $(myImage).css(bound_b, '0');

        // change the position of everything else
        $(black_overlay).css(bound_a_op, 'inherit');
        $(black_overlay).css(bound_b_op, 'inherit');
        $(black_overlay).css(bound_a, 0);
        $(black_overlay).css(bound_b, 0);

    };

    // see what class is on the container, set the 'top' 'left' values for absolute elements
    var set_position_bounds = function(myImage, container) {

        if ( $(container).hasClass('expand-to-bottom-right') ) {

            set_position_bounds_change(myImage, container, 'top', 'left');

        } else if ( $(container).hasClass('expand-to-top-right') ) {

            set_position_bounds_change(myImage, container, 'bottom', 'left');

        } else if ( $(container).hasClass('expand-to-bottom-left') ) {

            set_position_bounds_change(myImage, container, 'top', 'right');

        } else if ( $(container).hasClass('expand-to-top-left') ) {

            set_position_bounds_change(myImage, container, 'bottom', 'right');

        }

    };

    // set the default values for the black overlay
    var set_overlay_values = function(container, width, height) {

        var black_overlay = $(container).children()[1];

        $(black_overlay).css('max-width', ((width*2) + 28) + 'px');
        $(black_overlay).css('max-height', ((height*2) + 14) + 'px');
        
    };

    // will convert the image to be absolute and still look the same
    var change_img_to_abs = function(img, container) {

        var myImage = $(img)[0];

        // update z-index values for this item
        $( $(container).children()[0] ).css('z-index', ++z_index_counter);
        $( $(container).children()[1] ).css('z-index', ++z_index_counter);
        $( $(container).children()[2] ).css('z-index', ++z_index_counter);

        // no-op if already changed
        if ( $(myImage).css('position') === 'absolute') {
            return;
        }

        // get the original width and height
        original_width = +myImage.offsetWidth;
        original_height = +myImage.offsetHeight;

        // need to first set the container properties
        $(container).css('width', original_width + 'px');
        $(container).css('height', original_height + 'px');

        // change to absolute, change width and height
        $(myImage).css('position', 'absolute');
        $(myImage).css('width', original_width + 'px');
        $(myImage).css('height', original_height + 'px');
        $(myImage).css('max-width', ((original_width * 2) + 28) + 'px');
        $(myImage).css('max-height', ((original_height * 2) +14) + 'px');
        $(myImage).css('min-width', (original_width) + 'px');
        $(myImage).css('min-height', (original_height) + 'px');

        // position the absolute elements based on how they should expand
        set_position_bounds(myImage, container);

        // set initial values for black overlay
        set_overlay_values(container, original_width, original_height);

    };

    // change the dimension and other info
    var start_animation = function(container) {

        var myImage = $( $(container).children()[0] )[0];

        // add class to show that is in dynamic_mode
        $(myImage).addClass('dynamic_mode');
        currentExpandingId = $(container).attr('id');

        var final_width = ((original_width*2) + 28) + 'px';
        var final_height = ((original_height*2) + 14) + 'px';

        // change size of image
        $(myImage).animate({
            'width': final_width,
            'height': final_height
        }, 300, function(){
            currently_busy = 0;
            currentExpandingId = null;
        });

        // change size of black-overlay
        var black_overlay = $(container).children()[1]
        $(black_overlay).animate({
            'width': final_width,
            'height': final_height
        }, 300);

    };

    var reverse_animation = function(container) {

        var myImage = $( $(container).children()[0] )[0];
        var black_overlay = $(container).children()[1]
        var thisImageId = $(container).attr('id');

        // if this id is the same as the currentExpandingId, stop the animation on those things
        if (currentExpandingId && thisImageId === currentExpandingId) {
            $(myImage).stop();
            $(black_overlay).stop();
        }

        // remove class, or don't do anything if it is not there
        if ( $(myImage).hasClass('dynamic_mode') ) {
            $(myImage).removeClass('dynamic_mode');
        } else {
            currently_busy = 0;
            return;
        }

        var final_width = original_width + 'px';
        var final_height = original_height + 'px';

        // change size of image
        $(myImage).animate({
            'width': final_width,
            'height': final_height
        }, 300, function() {
           currently_busy = 0;
        });

        // change size of black-overlay
        $(black_overlay).animate({
            'width': final_width,
            'height': final_height
        }, 300);

    };

    // hover over image, change image to be absolute with same width and height
    // then start the animation
    var hover_into_image = function() {

        if (currently_busy) {
            return;
        }
        currently_busy = 1;

        change_img_to_abs($(this).children()[0], this);
        start_animation(this);
    };

    var hover_out_of_image = function() {

        if (currently_busy) {
            
            // check to see if this the handler going out of the 'busy' image expanding
            var thisId = $(this).attr('id');

            if (!currentExpandingId || thisId != currentExpandingId) {
                return;
            }

        }
        currently_busy = 1;

        reverse_animation(this);
    };

    // on hover set handlers
    $(".project-item").hover(hover_into_image, hover_out_of_image);

});


