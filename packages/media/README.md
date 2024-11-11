# Nodejs Loaders: Media

<img src="../../logo.svg" height="100" width="100" alt="" />

[![npm version](https://img.shields.io/npm/v/nodejs-loaders/media.svg)](https://www.npmjs.com/package/nodejs-loaders/media)
![size](https://img.shields.io/github/languages/code-size/JakobJingleheimer/nodejs-loaders/media)

**Environment**: test

This loader returns the specifier (truncated from project root / current working directory) as the default export:

```js
import photo from './team.jpg'; // photo = '[…]/team.jpg'
```

This ensures snapshots are unaffected by the file system on which the test is run.

<details>
<summary>Supported file extensions</summary>

Audio/Video:
* `.av1`
* `.mp3`
* `.mp3`
* `.mp4`
* `.ogg`
* `.webm`

Images:

* `.avif`
* `.gif`
* `.ico`
* `.jpeg`
* `.jpg`
* `.png`
* `.webp`
</details>
