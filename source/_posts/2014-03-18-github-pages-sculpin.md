---
layout: post
title: Sculpin + Github Pages = <?3
tags:
    - weird repo nesting
    - strange
    - but hey it's free
categories:
    - sculpin
    - github
    - blogging
    - git

---

So in order to get Sculpin to work, you have to have a certain file structure.

But in order to get Github Pages to work you have to have a certain, <em>other</em>, file structure.

A girl just can't win.

But wait! What's that, you say? Show one face to Github, on the master branch, which is where it requires all your publishable stuff to go, and then show Sculpin a totally different face by using a different branch name for all its stuff?

Brilliant! But wait yet again! There's more, you say? The master branch with all the output stuff should go... <em>inside</em> a file on the sculpin branch?

So, let me get this straight...

<pre>
$ pwd
/Users/binkovitz/bbinkovitz.github.io
$ git branch
* sculpin-source
$ ls
LICENSE		README.md	app		output_prod	publish.sh	s3-publish.sh	s3.conf.dist	sculpin.json	sculpin.lock	source
</pre>

...first I checkout branch sculpin-source and put all my Sculpin-friendly stuff in there and commit it...

<pre>
$ cd output_prod/
$ pwd
/Users/binkovitz/bbinkovitz.github.io/output_prod
$ git branch
* master
$ ls
_posts		about		blog		components	css		favicon.ico	index.html
$
</pre>

...and then after I generate my output, I go into that dir and commit that, and only that, to master?

Okay if you say so.
