import { drawSnowflakeRecursive } from "./snowflake.js";
import { OctaveNoise } from "./Noise/ValueNoise.js";

class Blizzard {
    snowflakes = [];
    width;
    height;
    ctx;
    depth = 1;
    noise;

    static #CLOSEST = 1.5;
    static #FARTHEST = 0.25;
    TIME_SCALE = 0.001;
    NOISE_SCALE = 1;

    #previous;

    constructor(ctx, width, height, count = 25) {
        this.ctx = ctx;
        this.width = width;
        this.height = height;

        for (let i = 0; i < count; i++) {
            this.snowflakes.push(this.#createSnowflake());
        }

        this.noise = new OctaveNoise(1, 2, 3);
    }

    #createSnowflake() {
        return new BlizzardFlake(
            Math.random() * this.width,
            -20,
            Math.random()**3 * (Blizzard.#CLOSEST - Blizzard.#FARTHEST) + Blizzard.#FARTHEST
        );
    }

    draw(timestamp) {
        this.ctx.save();

        this.ctx.fillStyle = 'black';
        this.ctx.strokeStyle = 'white';
        this.ctx.lineWidth = 5;

        this.ctx.fillRect(0, 0, this.width, this.height);

        for (let i = 0; i < this.snowflakes.length; i++) {
            this.snowflakes[i].draw(this.ctx, this.depth, this.NOISE_SCALE * this.noise.get(timestamp * this.TIME_SCALE + i));
        }

        this.ctx.restore();
    }

    update(timestamp) {
        if (this.#previous === undefined) {
            this.#previous = timestamp;
            return;
        }

        const deltaTime = timestamp - this.#previous;
        for (let flake of this.snowflakes) {
            flake.update(deltaTime);
            if (flake.y > this.height) {
                flake.x = Math.random() * this.width;
                flake.y = -20;
            }
        }
        this.#previous = timestamp;
    }
}

class BlizzardFlake {
    x;
    y;
    z;

    static FALL_SPEED = 0.15; 

    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    draw(ctx, depth, rotation) {
        ctx.save();

        ctx.translate(this.x, this.y);
        ctx.rotate(rotation);

        drawSnowflakeRecursive(ctx, 0, 0, depth, this.z * 10, rotation);

        ctx.restore();
    }

    update(deltaTime) {
        this.y += deltaTime * this.z * BlizzardFlake.FALL_SPEED;
    }
}

export { Blizzard };