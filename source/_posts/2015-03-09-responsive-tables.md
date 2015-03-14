---
layout: post
title: Responsive Tables for Impatient People
tags:
    - responsive tables
    - mobile first
categories:
    - responsive design
    - sass and css
    - data visualization

---

Responsive websites! We know how to do that! No more table-based layouts! Also no more denim scrunchies! The 90s are over! Tables are gone!

Oh wait, well, except when we have actual tabular data. Then we, ah, well, um, fob it off on a front-end developer or something.

For a long time I was afraid of responsive tables. When working on Agile projects I encouraged clients to de-prioritize stories about responsive-izing their data table, going against everything I believed and advocated about mobile-first development and design. I felt too rushed to play around with something I didn't really understand and had heard from others was complicated and scary.

To make it worse, there's a bunch of ways to do responsive tables. [Like, too many.][1] The sheer number of options was the most intimidating thing about figuring out how to do it. I didn't want to wade through the choices, I just wanted someone to tell me the Best Way™ to do responsive tables. I don't know if there is a Best Way™ but after weighing the options and trying them out, I have a favorite way.

Turn your rows into cards.
---

It only takes a few lines of CSS to turn every table row into a card. It's so easy a cat rolling around on a keyboard could probably do it.

This is the actual SASS that's controlling table row display on [Chicago Vegan Guide][2]:
~~~
@media (max-width: $second_breakpoint) {
    /* Force table to not be like tables anymore */
    table, thead, tbody, th, td, tr {
        display: block;
        margin: .5em 0;
    }

    /* Hide table headers (but not display: none;, for accessibility) */
    thead tr {
        position: absolute;
        top: -9999px;
        left: -9999px;
    }

    td {
        /* Behave  like a "row" */
        border: none;
        position: relative;
    }
}
~~~

That's it. For real. After that, I threw some styling on the field that I wanted to use as a "title" for the "card", and a border around each `<tr>` to make it look more like an actual card.

Here's how a few rows of the table look at wide sizes:
![Tabular data in a table. Many rows, with several columns](/images/responsive-table-wide.png)

And here's how they look as "cards" when the screen narrows:
![The same data now displayed as a series of cards. One column serves as the card title while the others are lower on the card.](/images/responsive-table-narrow.png)

[1]: http://exisweb.net/responsive-table-plugins-and-patterns
[2]: http://vegan-chicago.com