---
layout: post
title: Journey to the center of the repo
tags:
    - HTTP headers
    - pull request
    - contributing

categories:
    - symfony
    - open source

---

This week I got a [little bit of code][1] into the [Symfony][2] repo.

I was trying to set multiple vary headers and running into issues. I checked [the official docs][3] to make sure that multiple headers were supported, and that I was doing it right. There was a code example provided and everything, but it just wasn't working.

How to set vary headers according to the docs:

~~~php
// set one vary header
$response->setVary('Accept-Encoding');

// set multiple vary headers
$response->setVary(array('Accept-Encoding', 'User-Agent'));
~~~

I had written a failing PHPunit test to check that multiple vary headers were indeed being set and I couldn't find out why it was failing.

~~~php
$response = new Response();
$vary = array(
    'Accept-Language',
    'User-Agent',
    'X-foo',
);
$response->headers->set('Vary', $vary);
$this->assertEquals($response->headers->get('Vary', NULL, FALSE) , $response->getVary(), '->getVary() parses multiple header name values in arrays');
~~~

I did this because I was in a dev environment that didn't have the Varnish setup that was being used in production, which is where the headers would normally have been set for this site, and I wanted to prove to the client that setting multiple headers would work. But according to my test, they didn't?

Turned out, the vary headers were being <em>set</em> just fine. The problem was that when <em>get</em>ting them, only the first was taken into account. Furthermore, there was this test that made me think there was some confusion somewhere about how getVary() was supposed to work:

~~~php
$this->assertEquals(array('Accept-Language', 'User-Agent'), $response->getVary(), '->setVary() doesn\'t change the Vary header if replace is set to false');
~~~

So I fixed the test to actually replace when replace is set to false, as well as adding some tests to verify that multiple headers were retrieved faithfully. Then I fixed the getVary() code itself to return an array when appropriate.

Next I had to navigate Symfony's somewhat byzantine [pull request instructions][4]. The instructions are titled, somewhat misleadingly, "Submitting a Patch". Turns out you're not really supposed to submit a patch. To me it seems like there's an overwhelming amount of unnecessary instructions telling the would-be contributor to create patches, create a fork, rebase your patches onto a branch of your fork, etc.

In the end, the rebasing and patch-formatting and whatnot seem to be pretty unnecessary. Unless you did something weird or fancy, a normal pull request on a properly-named branch of a fork of the project would be fine.

I was also somewhat confused by the requirement to submit the PR to the "the oldest but still maintained version of Symfony where the bug happens". There doesn't seem to be an obvious place to figure out which version that might be, but I just submitted against 2.3 and that seemed to be fine.

I also made the mistake of submitting a PR with multiple commits (I make a habit of committing tests separately from actual code changes). They closed my PR without merging and instead squashed my commits into one before applying them to the 2.3 branch.

I also added extra spaces to the info table they ask you to create, not realizing that even though that made it look fine in Github, it looked all weird in the Git log. And I don't think it was even necessary to make it look nice in Github.

The maintainers seem nice though. I got a thumbs up emoji in my PR from [cordoval][5] which pretty much made my day.

Anyway, that's the journey of my little bit of code upon the river of the Symfony PR process, into the heart of the 2.3 branch.

[1]: https://github.com/symfony/symfony/commit/3a4a3cbe303cfe71f40c1d3425882e1426a6bcfc
[2]: http://symfony.com/
[3]: http://symfony.com/doc/current/book/http_cache.html
[4]: http://symfony.com/doc/current/contributing/code/patches.html
[5]: https://github.com/cordoval