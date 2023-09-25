<a href="https://excalidraw.com/" target="_blank" rel="noopener">
  <picture>
    <source media="(prefers-color-scheme: dark)" alt="Excalidraw" srcset="https://excalidraw.nyc3.cdn.digitaloceanspaces.com/github/excalidraw_github_cover_2_dark.png" />
    <img alt="Excalidraw" src="https://excalidraw.nyc3.cdn.digitaloceanspaces.com/github/excalidraw_github_cover_2.png" />
  </picture>
</a>

<h4 align="center">
  <a href="https://excalidraw.com">Excalidraw Editor</a> |
  <a href="https://blog.excalidraw.com">Blog</a> |
  <a href="https://docs.excalidraw.com">Documentation</a> |
  <a href="https://plus.excalidraw.com">Excalidraw+</a>
</h4>

<div align="center">
  <h2>
    An open source virtual hand-drawn style whiteboard. </br>
    Collaborative and end-to-end encrypted. </br>
  <br />
  </h2>
</div>

<br />
<p align="center">
  <a href="https://github.com/excalidraw/excalidraw/blob/master/LICENSE">
    <img alt="Excalidraw is released under the MIT license." src="https://img.shields.io/badge/license-MIT-blue.svg"  />
  </a>
  <a href="https://docs.excalidraw.com/docs/introduction/contributing">
    <img alt="PRs welcome!" src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat"  />
  </a>
  <a href="https://discord.gg/UexuTaE">
    <img alt="Chat on Discord" src="https://img.shields.io/discord/723672430744174682?color=738ad6&label=Chat%20on%20Discord&logo=discord&logoColor=ffffff&widge=false"/>
  </a>
  <a href="https://twitter.com/excalidraw">
    <img alt="Follow Excalidraw on Twitter" src="https://img.shields.io/twitter/follow/excalidraw.svg?label=follow+@excalidraw&style=social&logo=twitter"/>
  </a>
</p>

<div align="center">
  <figure>
    <a href="https://excalidraw.com" target="_blank" rel="noopener">
      <img src="https://excalidraw.nyc3.cdn.digitaloceanspaces.com/github%2Fproduct_showcase.png" alt="Product showcase" />
    </a>
    <figcaption>
      <p align="center">
        Create beautiful hand-drawn like diagrams, wireframes, or whatever you like.
      </p>
    </figcaption>
  </figure>
</div>

## Features

The Excalidraw editor (npm package) supports:

- 💯&nbsp;Free & open-source.
- 🎨&nbsp;Infinite, canvas-based whiteboard.
- ✍️&nbsp;Hand-drawn like style.
- 🌓&nbsp;Dark mode.
- 🏗️&nbsp;Customizable.
- 📷&nbsp;Image support.
- 😀&nbsp;Shape libraries support.
- 👅&nbsp;Localization (i18n) support.
- 🖼️&nbsp;Export to PNG, SVG & clipboard.
- 💾&nbsp;Open format - export drawings as an `.excalidraw` json file.
- ⚒️&nbsp;Wide range of tools - rectangle, circle, diamond, arrow, line, free-draw, eraser...
- ➡️&nbsp;Arrow-binding & labeled arrows.
- 🔙&nbsp;Undo / Redo.
- 🔍&nbsp;Zoom and panning support.

## Mod Features

- Ability to restrict drawings & elements to specific users.
- A DM / GM role that is able to modify everything.
- A simple chat window with commands
- Ability to assign stats to elements on the whiteboard
- Dice rolling, with full stat integration (if you mention a stat in your roll, it will pull it from the elements you have selected)

It's not an exceptionally sophisticated mod, but it did need some tinkering to make the locking per-user specific

![A screenshot of the Excalidraw VTT Mod, showing a selected player in some sort of witch hut with a few rat monsters](https://github.com/TotalTechGeek/excalidraw-d20/assets/2261916/f2448bf2-251a-4304-8a98-72690466351e)


## Instructions

GM / DM creates a session and runs `/claim`, this tells the board who the owner is.

Players can connect and add their own drawings / icons. They will automatically be attached to the user. Alternatively, the GM / DM can use `/give <name>` to assign an element to a user.

## Mod Commands

- `/roll <notation>` Rolls a dice publicly, with notation generally from: <https://dice-roller.github.io/documentation/guide/notation/>
- `/dmroll <notation>` Rolls a dice privately
- `/clear` Clears the chat (locally)
- `/w` or `/whisper` `<user>` `<message>` allows you to whisper to another user
- `/take` Assigns a selected element(s) to the user running the command
- `/give <user>` Assigns the selected element(s) to the user specified by the command
- `/set <attribute> <value>` Assigns an attribute to each of the selected elements
- `/setr <attribute> <notation>`  Allows you to assign attributes to the selected elements, with a roll. It will roll for each element (this makes it easy to roll HP for a few tokens at the same time).
- `/unset <attribute>` Removes an attribute from selected elements
- `/mod <attribute> <notation>` Allows you to modify an attribute by a roll. It will roll for each element (this makes it easy to roll HP for a few tokens at the same time).

When you use `/roll <notation>`, you are able to refer to stats from the elements you have selected, for example,

If I wrote `/roll d20+STR`, as shown in the image, it will pull STR from the selected element, and roll `d20+4`

![An example showing a roll pulling a stat from the element selected](https://github.com/TotalTechGeek/excalidraw-d20/assets/2261916/08559023-f748-4c54-ba7e-327b2faf1172)


If you use `/set name <some-name>`, it will make it easier to refer to the element from the stats, and will show up in the dice roll if you used attributes.

![The name of the element showing up next the roll](https://github.com/TotalTechGeek/excalidraw-d20/assets/2261916/bc6bbcf2-8294-400b-9346-4bed64601f61)


If you reference stats from your rolls, and have multiple elements selected, it will roll the dice for each selected element, making it simpler to run encounters.

![An image showing multiple rat monsters selected, and an attack roll being performed for each with just one command](https://github.com/TotalTechGeek/excalidraw-d20/assets/2261916/f93d279c-25a0-40e9-b2ba-f9976d07709e)


## Excalidraw D20

The app hosted at [excalidraw-d20.netlify.app](https://excalidraw-d20.netlify.app), and supports the same features as mainline Excalidraw:

- 📡&nbsp;PWA support (works offline).
- 🤼&nbsp;Real-time collaboration.
- 🔒&nbsp;End-to-end encryption.
- 💾&nbsp;Local-first support (autosaves to the browser).
- 🔗&nbsp;Shareable links (export to a readonly link you can share with others).

We'll be adding these features as drop-in plugins for the npm package in the future.

## Sponsors & support

If you like the project, support the Excalidraw developers! You can become a sponsor for them at [Open Collective](https://opencollective.com/excalidraw) or use [Excalidraw+](https://plus.excalidraw.com/).
