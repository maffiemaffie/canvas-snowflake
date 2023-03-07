import { Blizzard } from "./Blizzard.js";

const height = 480;
const width = 720;

let ctx;
let blizzard;

(() => {
    const canvas = document.querySelector('canvas');
    ctx = canvas.getContext('2d');

    canvas.width = width;
    canvas.height = height;

    blizzard = new Blizzard(ctx, width, height, 100);
    blizzard.FLAKE_SCALE = 20;
    requestAnimationFrame(snow);
})();

function snow(timestamp) {
    blizzard.update(timestamp);
    blizzard.draw(timestamp);
    requestAnimationFrame(snow);
}