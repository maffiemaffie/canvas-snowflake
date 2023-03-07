/**
 * Draws a single Koch fractal curve.
 * @param {CanvasRenderingContext2D} ctx The rendering context for the desired canvas. 
 * @param {Number} x The x coordinate start of the curve.
 * @param {Number} y The y coordinate start of the curve.
 * @param {Number} depth The number of recursions deep to draw the curve. Must be at least 0.
 * @param {Number} length The displacement from beginning to end of the curve.
 * @param {Number} rotation The angle in radians at which the curve will be drawn.
 * @returns 
 */
const drawCurveRecursive = (ctx, x, y, depth, length, rotation) => {
    if (depth < 0) throw `Depth cannot be a negative number. (Received ${depth})`;
    if (depth == 0) {
        const endX = x + Math.cos(rotation) * length;
        const endY = y + Math.sin(rotation) * length;

        ctx.save();

        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(endX, endY);
        ctx.stroke();
        ctx.closePath();

        ctx.restore();
        return {'x': endX, 'y': endY};
    }
    
    let drawPosition = {'x': x, 'y': y};
    drawPosition = drawCurveRecursive(ctx, x, y, depth - 1, length / 3, rotation);
    drawPosition = drawCurveRecursive(ctx, drawPosition.x, drawPosition.y, depth - 1, length / 3, rotation - Math.PI / 3);
    drawPosition = drawCurveRecursive(ctx, drawPosition.x, drawPosition.y, depth - 1, length / 3, rotation + Math.PI / 3);
    drawPosition = drawCurveRecursive(ctx, drawPosition.x, drawPosition.y, depth - 1, length / 3, rotation);
    return drawPosition;
}

/**
 * 
 * @param {CanvasRenderingContext2D} ctx The rendering context for the desired canvas.
 * @param {Number} x The x coordinate center of the snowflake.
 * @param {Number} y The y coordinate center of the snowflake.
 * @param {Number} depth The number of recursions deep to draw the curve. Must be at least 0.
 * @param {Number} radius The greatest radius from the center of the snowflake.
 * @param {Number} rotation The rotation in rdaians of the snowflake.
 */
export const drawSnowflakeRecursive = (ctx, x, y, depth, radius, rotation = 0) => {
    const length = radius * Math.sqrt(3);
    let drawPosition = {
        'x': x - radius * Math.cos(Math.PI / 6 + rotation),
        'y': y - radius * Math.sin(Math.PI / 6 + rotation)
    };

    drawPosition = drawCurveRecursive(ctx, drawPosition.x, drawPosition.y, depth, length, rotation);
    drawPosition = drawCurveRecursive(ctx, drawPosition.x, drawPosition.y, depth, length, rotation + 2 * Math.PI / 3);
    drawPosition = drawCurveRecursive(ctx, drawPosition.x, drawPosition.y, depth, length, rotation - 2 * Math.PI / 3);
}
