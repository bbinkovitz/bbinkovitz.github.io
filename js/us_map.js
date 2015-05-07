(function($) {
    colors = function() {
       return {
            defaultfill   : 'lightgray',
            hover         : 'powderblue',
            hoveropposite : 'black',
            highlight     : 'pink',
        };
    }
    states = function() {
    // A list of all the US states and their abbreviations.
    return [
        { name: 'ALABAMA', abbreviation: 'AL'},
        { name: 'ALASKA', abbreviation: 'AK'},
        { name: 'ARIZONA', abbreviation: 'AZ'},
        { name: 'ARKANSAS', abbreviation: 'AR'},
        { name: 'CALIFORNIA', abbreviation: 'CA'},
        { name: 'COLORADO', abbreviation: 'CO'},
        { name: 'CONNECTICUT', abbreviation: 'CT'},
        { name: 'DELAWARE', abbreviation: 'DE'},
        { name: 'DISTRICT OF COLUMBIA', abbreviation: 'DC'},
        { name: 'FLORIDA', abbreviation: 'FL'},
        { name: 'GEORGIA', abbreviation: 'GA'},
        { name: 'HAWAII', abbreviation: 'HI'},
        { name: 'IDAHO', abbreviation: 'ID'},
        { name: 'ILLINOIS', abbreviation: 'IL'},
        { name: 'INDIANA', abbreviation: 'IN'},
        { name: 'IOWA', abbreviation: 'IA'},
        { name: 'KANSAS', abbreviation: 'KS'},
        { name: 'KENTUCKY', abbreviation: 'KY'},
        { name: 'LOUISIANA', abbreviation: 'LA'},
        { name: 'MAINE', abbreviation: 'ME'},
        { name: 'MARYLAND', abbreviation: 'MD'},
        { name: 'MASSACHUSETTS', abbreviation: 'MA'},
        { name: 'MICHIGAN', abbreviation: 'MI'},
        { name: 'MINNESOTA', abbreviation: 'MN'},
        { name: 'MISSISSIPPI', abbreviation: 'MS'},
        { name: 'MISSOURI', abbreviation: 'MO'},
        { name: 'MONTANA', abbreviation: 'MT'},
        { name: 'NEBRASKA', abbreviation: 'NE'},
        { name: 'NEVADA', abbreviation: 'NV'},
        { name: 'NEW HAMPSHIRE', abbreviation: 'NH'},
        { name: 'NEW JERSEY', abbreviation: 'NJ'},
        { name: 'NEW MEXICO', abbreviation: 'NM'},
        { name: 'NEW YORK', abbreviation: 'NY'},
        { name: 'NORTH CAROLINA', abbreviation: 'NC'},
        { name: 'NORTH DAKOTA', abbreviation: 'ND'},
        { name: 'OHIO', abbreviation: 'OH'},
        { name: 'OKLAHOMA', abbreviation: 'OK'},
        { name: 'OREGON', abbreviation: 'OR'},
        { name: 'PENNSYLVANIA', abbreviation: 'PA'},
        { name: 'RHODE ISLAND', abbreviation: 'RI'},
        { name: 'SOUTH CAROLINA', abbreviation: 'SC'},
        { name: 'SOUTH DAKOTA', abbreviation: 'SD'},
        { name: 'TENNESSEE', abbreviation: 'TN'},
        { name: 'TEXAS', abbreviation: 'TX'},
        { name: 'UTAH', abbreviation: 'UT'},
        { name: 'VERMONT', abbreviation: 'VT'},
        { name: 'VIRGINIA', abbreviation: 'VA'},
        { name: 'WASHINGTON', abbreviation: 'WA'},
        { name: 'WEST VIRGINIA', abbreviation: 'WV'},
        { name: 'WISCONSIN', abbreviation: 'WI'},
        { name: 'WYOMING', abbreviation: 'WY' }
    ];
    }
    $(document).ready(function() {
    usStates = states();
    var colorset = colors();
    // Make it full-width & the right aspect ratio.
    var height = $('#map').width() * .7;
    $('#map').height(height);
    $('#map > svg').height(height);
        // Hide the fields we're using as data sources, so we can show them
        // one at a time.
        $('.field').hide();
        var styles = {};
        var hoverstyles = {};
        for (var i=0; i< usStates.length; i++) {
            var field_object = $('.field-name-field-' + usStates[i].name.replace(' ', '-').toLowerCase());
            field_object.css('display:none;');
            // If the state has data, highlight it.
            var newFill = Boolean(field_object.text()) ? 'pink' : 'gray';
            // Fill out style object.
            styles[usStates[i].abbreviation] = {fill: newFill};
        }
        // The interactive stuff.
        $('#map').usmap({
          // The click action
          click: function(event, data) {

              // "Sticky" the hover on the state that was clicked most recently.
              $('path').each(function() {
                // There are two sets of paths, one overtop the other, which
                // I don't completely understand the purpose of. The layer
                // which has the default fill color and all, has no state name
                // as part of the DOM element.
                // But there's also a hidden layer that we can selectively
                // reveal when a state is clicked.
                if($(this).context.dataState == data.name) {
                    $(this).css('opacity', 1);
                    $(this).css('fill', colorset.hover);
                }
                // Each click, hide the states that were highlighted by
                // previous clicks. Don't touch the paths with undefined states!
                // That will erase the whole map, for some reason.
                else if($(this).context.dataState !== undefined) {
                    $(this).css('opacity', 0);
                }
            });

            // Get the state name from its abbreviation.
            for (var i=0; i< usStates.length; i++) {
                if (usStates[i].abbreviation == data.name) {
                    var state = usStates[i].name;
                    styles[data.name] = {fill: colorset.hover, stroke: colorset.hover};
                }
            }
            // Get the field that holds the data for that state.
            var field = '.field-name-field-' + state.replace(' ', '-').toLowerCase();
            var newtext = $(field + ' .field-item').text() ? $(field + ' .field-item').text() : 'No data for this state.';
            $('#clicked-body')
              // Write the information to the area it belongs.
              .text(newtext);
            $('.clicked-title')
              // Replace the title with the title of the state.
              .text(state);
          },
          // Style settings
          stateStyles: {
              fill: colorset.defaultfill,
              stroke: colorset.hover
          },
          stateHoverStyles: {
              stroke: 'white',
              fill: 'white',
          },
          labelBackingHoverStyles: {
              fill: 'darkgray',
            },
          stateSpecificStyles: styles,
          stateHoverAnimation: 250,
        });
    });
})(jQuery);
