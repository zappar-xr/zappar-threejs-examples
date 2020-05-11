# Zappar for ThreeJS Examples

This repository contains a set of examples for Zappar for ThreeJS. For more information, check out the package page for [Zappar for ThreeJS](https://www.npmjs.com/package/@zappar/zappar-threejs) (@zappar/zappar-threejs).

The examples are located in the `src` folder. We use `webpack` to compile and bundle the assets and code, and TypeScript to get full auto-complete and compile-time error checking.

## Prerequisites

To get started you'll want to ensure you have:
 - installed Node.js version 10 or later
 - printed out the example target image, `example-tracking-image.png`

## Getting Started

Once you have cloned this repository, open a terminal in the root directory of this project and follow these steps to get started.

Install the dependencies by running:
```
npm install
```

Next, run the project using the following command:
```
npm start
```

The `webpack-dev-server` tool will host the content locally and give you an address you can open on your computer. On the page that loads, tap the different HTML files to try the examples. If you'd like to try on a mobile device, follow these steps:
1. Ensure the device is on the same local network (e.g. Wifi)
2. Find out the IP address of your computer
3. On your mobile device, visit: `https://YOUR-IP-ADDRESS:PORT` replacing both `YOUR-IP-ADDRESS` and `PORT` (the port is the number after the `:` in the address given by `webpack-dev-server`). Note it's important to type `https` at the start of the address to ensure your device connects over HTTP**S**.