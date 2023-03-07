import { Blizzard } from "./Blizzard.js";

const height = 200;
const width = 200;

let ctx;
let blizzard;

(() => {
    const canvas = document.querySelector('canvas');
    ctx = canvas.getContext('2d');

    canvas.width = width;
    canvas.height = height;

    blizzard = new Blizzard(ctx, width, height);
    requestAnimationFrame(snow);
})();

function snow(timestamp) {
    blizzard.update(timestamp);
    blizzard.draw(timestamp);
    requestAnimationFrame(snow);
}