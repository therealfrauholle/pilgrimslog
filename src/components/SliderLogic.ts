export class ZoomDimensions {
    hovered: number;
    total: number;
    currentCenter: number;
    normalSize: number;
    zoomedSize: number;

    constructor(
        hovered: number,
        total: number,
        currentCenter: number,
        normalSize: number,
        zoomedSize: number,
    ) {
        this.hovered = hovered;
        this.total = total;
        this.currentCenter = currentCenter;
        this.normalSize = normalSize;
        this.zoomedSize = zoomedSize;
    }

    static generateCenter(
        hovered: number,
        total: number,
        normalSize: number,
        zoomedSize: number,
    ): ZoomDimensions {
        const absoluteCenter = (total - 1) / 2;
        const offsetToCenter = hovered - absoluteCenter;
        const zoomfactor = normalSize / zoomedSize;
        const scaledOffset = offsetToCenter * zoomfactor;
        const calculatedCenter = hovered - scaledOffset;
        return new ZoomDimensions(
            hovered,
            total,
            calculatedCenter,
            normalSize,
            zoomedSize,
        );
    }

    left(): number {
        const newCenter = this.newCenter();
        const maxToPad = (1 - this.zoomFactor()) * (this.total - 1);
        const paddingToCenter = this.absoluteCenter() - newCenter;
        const relativeOffset = paddingToCenter / maxToPad;
        const additionalStretch = this.zoomedSize - this.normalSize;
        return Math.round(relativeOffset * additionalStretch);
    }

    absoluteCenter(): number {
        return (this.total - 1) / 2;
    }

    zoomFactor(): number {
        return this.normalSize / this.zoomedSize;
    }

    newCenter(): number {
        const visibleDays = this.zoomFactor() * this.total;
        const offsetFromCenter = this.hovered - this.currentCenter;
        const halfVisibleDays = Math.round(visibleDays / 2);
        if (offsetFromCenter > halfVisibleDays) {
            return this.currentCenter + (offsetFromCenter - halfVisibleDays);
        } else if (offsetFromCenter < -halfVisibleDays) {
            return this.currentCenter - (-offsetFromCenter - halfVisibleDays);
        } else {
            return this.currentCenter;
        }
    }
}
