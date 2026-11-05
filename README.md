# Image collection manager

This application is a bunch of utilities I'm making for managing my growing collection of ai-generated and/or ai-modified images. Note that the app itself doesn't use AI and doesn't generate or edit images; and in fact it's agnostic enough it could be used to manage any collection of images, but I'm not bothering with changing the repository name.

This is being built mainly for personal use, and the code is shared in the hope that it might be useful, but no warranty of any kind is provided.

## Getting started

This project is built with Electron, React, and Typescript, and it uses `yarn` as its package manager. While this adds a substantial overhead to the project (mainly from Electron), it works well enough for my needs. Keep in mind that both the dependencies and any pre-built packages can take several hundred megabytes of storage space.

On a fresh clone, start by installing the dependencies by running `yarn` or `yarn install`.

After that, you can run the app with either `yarn start` (preview mode) or `yarn dev` (dev mode).

Scripts for building the app as standalone package are included for a few platforms, and they can be run with `yarn build:linux`, `yarn build:mac`, and `yarn build:win`. Note that you should be running these from the same platform you want to target for best results.

Check `package.json` for other scripts available.
