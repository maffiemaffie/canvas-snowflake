import { drawSnowflakeRecursive } from "./snowflake.js";

const height = 200;
const width = 200;

(() => {
    const canvas = document.querySelector('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = width;
    canvas.height = height;

    const rotationSlider = document.querySelector('#rotation-slider');
    rotationSlider.addEventListener('input', (e) => {
        const rotation = rotationSlider.value;
        console.log(rotation);
        ctx.fillRect(0, 0, width, height);
        drawSnowflakeRecursive(ctx, 100, 100, 3, 50, rotation * Math.PI / 180);
    });

    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = 'white';
    ctx.lineWidth = 3;

    drawSnowflakeRecursive(ctx, 100, 100, 1, 100, 0);
})();