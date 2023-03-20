---
layout: post-layout
title: "Walk Animation Demo"
tags: pixels snes
---

Some sprites I have been working on as an exercise. The goal was to create an animation cycle from all directions from a [3/4 perspective](https://en.wikipedia.org/wiki/2.5D/), and to fit everything into a 16-colour (15 plus transparency) palette.

Use the arrow keys to move around.

<script src="/js/walk-animation-demo-viewer.js">
</script>

The process was very low-tech. I just sketched each direction square on, then projected them to a 45-degree view angle. Using the sketches as a reference, I drew the pixels and played with the highlight and shadow. Based on the static pose, I keyframed the steps of the walking animation and in-betweened them.

![alt text](/img/walk-animation-demo-sketch.png "Hand sketches of orthogonal and perspective views.")

The character is based on the concept art for Henry from *Firewatch*. As you can see in the sketches, Henry has an external-frame backpack, but I couldn't get it to show well at 24 pixels high, so simplified the shapes a little bit.
