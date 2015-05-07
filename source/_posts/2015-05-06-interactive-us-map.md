---
layout: post
title: Interactive maps of the US with the US Map library and Drupal
tags:
    - us map
    - raphaël
    - jquery
    - drupal
    - svg
categories:
    - frontend
    - data visualization
    - interactive

---

<script type="text/javascript" src="http://concussion.opfact.com/sites/all/libraries/us_map/lib/raphael.js?nnn182"></script>
<script type="text/javascript" src="http://concussion.opfact.com/sites/all/libraries/us_map/jquery.usmap.js?nnn182"></script>
<script type="text/javascript" src="http://concussion.opfact.com/sites/all/modules/us_map/us_map.js?nnn182"></script>


I just created a cool interactive map using the [US Map][1] library, which is built on [jQuery][2] and the [Raphaël SVG library][3].

It's super easy to use, and in order to integrate it with Drupal, all I had to do was

 - Write a little utility module to implement hook_libraries_info() to declare the library.
 - Create a content type to provide the map data, since I wanted custom data for each state. There's one field for each state.
 - Create a custom js file in my module's directory to hold map configuration data.
 - Create a template for my custom content type that provided target divs for the map and the state data display.

Originally I thought I'd have to create a [field formatter][4] to display a field collection that would have a state name/data value pair for each state. But in fact the reality was much simpler.

Additionally, for users who have javascript turned off, the map simply doesn't render, and instead the user can read the list of all the state data in plain text. This makes all the important data still accessible even when the visual map is not able to be rendered.

Two customizations I had to make for my map that were not part of the default US Map library's behavior were

 - making the map responsive to the width of the screen
 - "stickying" the hover state when a state was clicked
 - custom state-by-state colors according to which states had data entered for them

Making the map responsive to the width of the screen (If you test this out, reload. I didn't bother making it scale on resize, only on pageload.) was easy since the markup in the template supports using percent widths as well as pixel values. However, the height couldn't be specified in percentages, and the map requires a fixed height to render. To solve that, I calculated the aspect ratio of the map, which shouldn't really change ever, and added a few lines to my custom js file that detected the width of the map's target render element and set its height to the appropriate fraction of the width.

The "stickying" seemed a lot harder than it ended up being, but the solution was a bit hard to find. For whatever reason (I didn't read through every line of code in the library to find out) US Map essentially renders two separate, identical SVG maps, one on top of the other. The top one is hidden by having its opacity default to zero, so the only map you see is the bottom one. The SVG path elements of the top one are labeled with a "name" attribute that indicates which state they are, while the bottom map does not. So my solution for "stickying" the most recently clicked state involved adding some code to the click event which checks every SVG path element in the whole map and does the following:

 - When it finds the element whose name matches the data attribute for the state clicked, it changes the opacity from 0 to 1.
 - It also searches for all other svg elements that have a name set for them, and makes sure their opacity is back to zero.
 - The SVG elements that have no "name" attribute are left alone.

Seems simple enough, but the documentation was sparse and the two-layer-invisible-map thing was a bit weird to wade through.

The last thing on the list, custom state-by-state colors (or hover colors) depending on whether the field had data in it, required a patch to be applied. There's a pull request open in the repo with the title [Mutable Properties][5] that allows the attributes to be updated prior to rendering the map but after loading the DOM. I did a simple check through all the fields, which was easy because I made sure to give them consistent names so they all followed the pattern, "field-name-field-{state}". I used .text() to check each one for content, and if it existed I set the color attribute to be something different than the others, so the users could see at a glance which states had data provided.

The whole thing looked something like this:

<div class="background-bubble">
     <h5 class="clicked-title">State-by-state data</h5>
    <div id="clicked-body" style="min-height: 2em;">State-specific info goes here.</div>
</div>
<div class="background-bubble">
  <h2 class="clicked-title">USA</h2>
  <div id="map" style="width: 100%; height: 250px;"></div>
</div>
<div class="field field-name-field-alabama">
    <div class="field-label">Alabama</div>
    <div class="field-items">
        <div class="field-item"> This is some info about Alabama</div>
    </div>
</div>
<div class="field field-name-field-arkansas">
    <div class="field-label">Arkansas</div>
    <div class="field-items">
        <div class="field-item"> This is some info about Arkansas</div>
    </div>
</div>
<div class="field field-name-field-ohio">
    <div class="field-label">Ohio</div>
    <div class="field-items">
        <div class="field-item"> This is some info about Ohio</div>
    </div>
</div>
<div class="field field-name-field-new-jersey">
    <div class="field-label">New Jersey</div>
    <div class="field-items">
        <div class="field-item"> This is some info about New Jersey</div>
    </div>
</div>
<div class="field field-name-field-nevada">
    <div class="field-label">Nevada</div>
    <div class="field-items">
        <div class="field-item"> This is some info about Nevada</div>
    </div>
</div>

[1]: http://newsignature.github.io/us-map/
[2]: https://jquery.com/
[3]: http://raphaeljs.com/
[4]: https://api.drupal.org/api/drupal/modules!field!field.api.php/group/field_formatter/7
[5]: https://github.com/NewSignature/us-map/pull/18