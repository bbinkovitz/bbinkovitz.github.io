---
layout: post
title: Responsive Multi-Level Menu with Drupal's hierarchical pages.
tags:
    - codrops
    - responsive multi-level menu
    - jQuery
categories:
    - information architecture
    - front-end
    - responsive design

---
Today [my pull request][1] to the [Responsive Multi-Level Menu][2] [Github repo][3] was merged. Exciting! It doesn't look like much (besides removing extra whitespace) but here's why the tiny new option I added was powerful.

Responsive Multi-Level Menu (RMLM) is a great little library that allows you to navigate through nested hierarchical menu trees without flyouts or page refreshes. It's great for mobile, and it's great for sidebars. However, it wasn't great for Drupal.

The reason for this lies in Drupal's default menu-making behavior and its divergence from the RMLM paradigm of menus.

Imagine that you have a structure like this:

- Parent Item One
 - Child Item One-A
 - Child Item One-B
  - Grandchild Item One-A-i
  - Grandchild Item One-A-ii
- Parent Item Two
 - Child Item Two-A

RMLM assumes that this means the pages (nodes/entities/what-have-you) that exist are like so:

- Parent Item One
  - Child Item One-A*
  - Child Item One-B
    - Grandchild Item One-A-i*
    - Grandchild Item One-A-ii*
- Parent Item Two
  - Child Item Two-A*

Where "*" indicates an actual page that you can navigate to. The rest are just some kind of bucket or placeholder. They can't be navigable links, because if you click on the item, it has to take you to the child items list, not to a page. To do both would be impossible.

Unfortunately, this is not how Drupal and most other popular CMSs work. They tend to create something like this:

- Parent Item One*
  - Child Item One-A*
  - Child Item One-B*
    - Grandchild Item One-A-i*
    - Grandchild Item One-A-ii*
- Parent Item Two*
  - Child Item Two-A*

where **every single menu parent item** also represents a page (node/entity/whathaveyou) unto itself.

That means that if you were to use the RMLM library with Drupal's menu structure, you'd end up with

- Parent Item One†
 - Child Item One-A
 - Child Item One-B†
  - Grandchild Item One-A-i
  - Grandchild Item One-A-ii
- Parent Item Two†
 - Child Item Two-A†

where "†" represents a page that exists, but cannot be navigated to with the RMLM-enhanced menu.

My pull request fixes that.

Instead of assuming that parent items will never represent content unto themselves, the setting I added permits the inclusion of a link to the parent item's content at the top of the list of child items.

The first thing you would see upon perusing the menu structure above with RMLM would be:

- Parent Item One >
- Parent Item Two >

with ">" indicating the existence of child items.

Clicking (or tapping) "Parent Item One >" with the stock RMLM configuration would show you

- < Back
- Child Item One-A >
- Child Item One-B

But with my new setting enabled, instead we'd get:

- Parent Item One
- < Back
- Child Item One-A >
- Child Item One-B

where the new "Parent Item One" link at the top would take us to, say, example.com/parent-item-one-page instead of just showing the menu for the parent items again.

With this modification, using Responsive Multi-Level Menu on Drupal-generated menus becomes as easy as theme_preprocessing your menu items to have the classes the RMLM library expects, and turning on the new setting I provided.

[1]: https://github.com/codrops/ResponsiveMultiLevelMenu/commit/bd7502e399bce3c92561f19ada52ddbfac8a27e6
[2]: http://tympanus.net/codrops/2013/04/19/responsive-multi-level-menu/
[3]: https://github.com/codrops/ResponsiveMultiLevelMenu