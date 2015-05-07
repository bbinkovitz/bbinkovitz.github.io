<p><script type="text/javascript" src="/js/us_map/lib/raphael.js?nnn182"></script>
<script type="text/javascript" src="/js/us_map/jquery.usmap.js?nnn182"></script>
<script type="text/javascript" src="/js/us_map.js?nnn182"></script></p>

<hr />

<p>layout: post
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
    - interactive</p>

<hr />

<p>I just created a cool interactive map using the <a href="http://newsignature.github.io/us-map/">US Map</a> library, which is built on <a href="https://jquery.com/">jQuery</a> and the <a href="http://raphaeljs.com/">Raphaël SVG library</a>.</p>

<p>It's super easy to use, and in order to integrate it with Drupal, all I had to do was</p>

<ul>
<li>Write a little utility module to implement hook_libraries_info() to declare the library.</li>
<li>Create a content type to provide the map data, since I wanted custom data for each state. There's one field for each state.</li>
<li>Create a custom js file in my module's directory to hold map configuration data.</li>
<li>Create a template for my custom content type that provided target divs for the map and the state data display.</li>
</ul>

<p>Originally I thought I'd have to create a <a href="https://api.drupal.org/api/drupal/modules!field!field.api.php/group/field_formatter/7">field formatter</a> to display a field collection that would have a state name/data value pair for each state. But in fact the reality was much simpler.</p>

<p>Additionally, for users who have javascript turned off, the map simply doesn't render, and instead the user can read the list of all the state data in plain text. This makes all the important data still accessible even when the visual map is not able to be rendered.</p>

<p>Two customizations I had to make for my map that were not part of the default US Map library's behavior were</p>

<ul>
<li>making the map responsive to the width of the screen</li>
<li>"stickying" the hover state when a state was clicked</li>
<li>custom state-by-state colors according to which states had data entered for them</li>
</ul>

<p>Making the map responsive to the width of the screen was easy since the markup in the template supports using percent widths as well as pixel values. However, the height couldn't be specified in percentages, and the map requires a fixed height to render. To solve that, I calculated the aspect ratio of the map, which shouldn't really change ever, and added a few lines to my custom js file that detected the width of the map's target render element and set its height to the appropriate fraction of the width.</p>

<p>The "stickying" seemed a lot harder than it ended up being, but the solution was a bit hard to find. For whatever reason (I didn't read through every line of code in the library to find out) US Map essentially renders two separate, identical SVG maps, one on top of the other. The top one is hidden by having its opacity default to zero, so the only map you see is the bottom one. The SVG path elements of the top one are labeled with a "name" attribute that indicates which state they are, while the bottom map does not. So my solution for "stickying" the most recently clicked state involved adding some code to the click event which checks every SVG path element in the whole map and does the following:</p>

<ul>
<li>When it finds the element whose name matches the data attribute for the state clicked, it changes the opacity from 0 to 1.</li>
<li>It also searches for all other svg elements that have a name set for them, and makes sure their opacity is back to zero.</li>
<li>The SVG elements that have no "name" attribute are left alone.</li>
</ul>

<p>Seems simple enough, but the documentation was sparse and the two-layer-invisible-map thing was a bit weird to wade through.</p>

<p>The last thing on the list, custom state-by-state colors (or hover colors) depending on whether the field had data in it, required a patch to be applied. There's a pull request open in the repo with the title <a href="https://github.com/NewSignature/us-map/pull/18">Mutable Properties</a> that allows the attributes to be updated prior to rendering the map but after loading the DOM. I did a simple check through all the fields, which was easy because I made sure to give them consistent names so they all followed the pattern, "field-name-field-{state}". I used .text() to check each one for content, and if it existed I set the color attribute to be something different than the others, so the users could see at a glance which states had data provided.</p>

<p>The whole thing looked something like this:</p>

<div class="background-bubble">
  <h2 class="clicked-title">USA</h2>
  <div id="map" style="width: 100%; height: 250px;"></div>
</div>

<div class="background-bubble">
     <h5 class="clicked-title">State-by-state data</h5>
    <div id="clicked-body"></div>
</div>
