export const drawCurveRecursive = (ctx, x, y, depth, length, rotation) => {
    if (depth < 0) throw 'Depth cannot be a negative number.';
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
