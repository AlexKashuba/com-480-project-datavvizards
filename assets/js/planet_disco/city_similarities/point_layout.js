
export class PointsLayout {
    constructor(ctx, transform) {
        this.ctx = ctx;
        this.transform = transform;
    }

    atScale = (currentK) => {
        this.currentK = currentK;
        return this
    }

    drawGlow = (d) => {
        const radiusScale = 1.5;
        if (d.highlight || d.selected) {
            this.ctx.save()
            this.ctx.fillStyle = 'white';
            this.drawPoint(d, this.ctx, radiusScale)
            this.ctx.restore()
        }
    }

    drawPoint = (d, context, radiusScale = 1) => {
        context.beginPath();
        context.arc(d.cx, d.cy, radiusScale * d.radius / this.currentK, 0, 2 * Math.PI);
        context.fill();
    }

    drawWithGlow = (d) => {
        this.drawGlow(d)
        this.drawPoint(d, this.ctx)
    }

    drawPoints = (visible) => {
        let prevColor = null
        visible.sort(d => d.highlight).sort((d) => d.color).forEach(d => {
            if (d.color != prevColor) { //sort by color to make few state updates to the canvas
                this.ctx.fillStyle = d.color;
                prevColor = d.color;
            }
            this.drawWithGlow(d)
        })
    }
}