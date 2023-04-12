import { drawSnowflakeRecursive } from "./snowflake.js";
import { OctaveNoise } from "./noise.min.js";

/**
 * Contains methods for animating a blizzard of snowflakes on the canvas.
 */
class Blizzard {
    snowflakes = [];
    width;
    height;
    ctx;
    MAX_DEPTH = 3;
    noise;

    static #CLOSEST = 1.5;
    static #FARTHEST = 0.25;
    static #MIN_EDGE_LENGTH = 5;

    #FLAKE_SCALE = 10;
    TIME_SCALE = 0.001;
    NOISE_SCALE = 1;

    set FLAKE_SCALE(value) {
        this.#FLAKE_SCALE = value;
        this.#calculateDepthMap();
    }

    depthMap = [];
    #previous;

    /**
     * Initializes a new instance of the Blizzard class.
     * @param {CanvasRenderingContext2D} ctx The rendering context of the desired canvas.
     * @param {Number} width The width of the desired canvas.
     * @param {Number} height The height of the desired canvas.
     * @param {Number} count The number of snowflakes on the screen at a time.
     */
    constructor(ctx, width, height, count = width * height * 0.001) {
        this.ctx = ctx;
        this.width = width;
        this.height = height;

        for (let i = 0; i < count; i++) {
            this.snowflakes.push(this.#createSnowflake());
        }

        this.noise = new OctaveNoise(1, 2, 3);
        this.#calculateDepthMap();
    }

    /**
     * Draws the snowflakes to the canvas.
     * @param {DOMHighResTimeStamp} timestamp The current time when the method was called.
     */
    draw(timestamp) {
        this.ctx.save();

        this.ctx.fillStyle = 'black';
        this.ctx.strokeStyle = 'white';
        this.ctx.lineWidth = 4;

        this.ctx.fillRect(0, 0, this.width, this.height);

        for (let i = 0; i < this.snowflakes.length; i++) {
            const depth = Math.min(this.MAX_DEPTH, this.#getDepthAt(this.snowflakes[i].z));
            this.snowflakes[i].draw(this.ctx, depth, this.NOISE_SCALE * this.noise.get(timestamp * this.TIME_SCALE + i), this.#FLAKE_SCALE);
        }

        this.ctx.restore();
    }

    /**
     * Updates the location and rotation of the snowflakes.
     * @param {DOMHighResTimeStamp} timestamp The current time when the method was called. 
     */
    update(timestamp) {
        if (this.#previous === undefined) {
            this.#previous = timestamp;
            return;
        }

        const deltaTime = timestamp - this.#previous;
        for (let flake of this.snowflakes) {
            flake.update(deltaTime);
            if (flake.y > this.height + 20) {
                const newFlake = this.#createSnowflake();
                flake.x = newFlake.x;
                flake.y = newFlake.y
            }
        }
        this.#previous = timestamp;
    }

    /**
     * Creates a new instance of the BlizzardFlake class at the top of the canvas with a randomized x and z position.
     * @returns The BlizzardFlake.
     */
    #createSnowflake() {
        return new BlizzardFlake(
            Math.random() * this.width,
            Math.random() * this.height - this.height - 20,
            Math.random()**3 * (Blizzard.#CLOSEST - Blizzard.#FARTHEST) + Blizzard.#FARTHEST
        );
    }

    /**
     * Calculates each z value at which the depth should increase to optimize detail rendering.
     */
    #calculateDepthMap() {
        const baseLength = Blizzard.#MIN_EDGE_LENGTH / (this.#FLAKE_SCALE * Math.sqrt(3));
        this.depthMap = [baseLength];
        for (let z = this.depthMap[0]; z <= Blizzard.#CLOSEST; z*=3, this.depthMap.push(z));
    }

    /**
     * Returns the depth that a given BlizzardFlake should be rendered with.
     * @param {Number} z The z coordinate of a given BlizzardFlake.
     * @returns The depth.
     */
    #getDepthAt(z) {
        return this.depthMap.findIndex(thisZ => z <= thisZ);
    }
}

/**
 * Contains methods to render snowflakes on the canvas.
 */
class BlizzardFlake {
    x;
    y;
    z;

    static FALL_SPEED = 0.15; 

    /**
     * Initializes a new instance of the BlizzardFlake class.
     * @param {Number} x The initial x position.
     * @param {Number} y The initial y position.
     * @param {Number} z The initial z position.
     */
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    /**
     * 
     * @param {CanvasRenderingContext2D} ctx The rendering context of the desired canvas.
     * @param {Number} depth The depth at which to render the fractal.
     * @param {Number} rotation The angle in radians at which the snowflake will be rendered at.
     * @param {Number} scale Multiplier adjusts the size that the snowflake will be rendered at.
     */
    draw(ctx, depth, rotation, scale) {
        ctx.save();

        ctx.translate(this.x, this.y);
        ctx.rotate(rotation);

        drawSnowflakeRecursive(ctx, 0, 0, depth, this.z * scale, rotation);

        ctx.restore();
    }

    /**
     * Updates the location of the snowflake.
     * @param {Number} deltaTime The time passed since the last update.
     */
    update(deltaTime) {
        this.y += deltaTime * this.z * BlizzardFlake.FALL_SPEED;
    }
}

export { Blizzard };
