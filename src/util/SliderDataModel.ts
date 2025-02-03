export type SliderActionType = 'release' | 'change' | 'zoom';
export type UiAction = {
    type: SliderActionType;
    value?: number;
};

export function reducer(oldModel: UiModel, action: UiAction): UiModel {
    function warn(text: string) {
        console.warn('Inconsistent model: ' + text);
    }
    const model: UiModel = {
        slider: new SliderModel(
            oldModel.slider.hovered,
            oldModel.slider.total,
            oldModel.slider.currentCenter,
            oldModel.slider.normalSize,
            oldModel.slider.zoomedSize,
        ),
        zoomed: oldModel.zoomed,
    };
    switch (action.type) {
        case 'zoom':
            console.log('zooming');
            if (model.zoomed) {
                warn('Trying to zoom but already zoomed');
            }
            model.zoomed = true;
            if (action.value != null) {
                model.slider.hovered = action.value;
            }
            model.slider.alignHovered();
            break;
        case 'change':
            if (!model.zoomed) {
                warn('changing when not zoomed');
            }
            model.slider.hovered = action.value!;
            model.slider.currentCenter = model.slider.newCenter();
            console.log('new center', model.slider.currentCenter);
            break;
        case 'release':
            console.log('releasing');
            if (!model.zoomed) {
                warn('trying to release when not zoomed');
            }
            model.zoomed = false;
            break;
    }
    return model;
}

export class UiModel {
    slider: SliderModel;
    zoomed: boolean;

    constructor(
        total: number,
        currentCenter: number,
        normalSize: number,
        zoomedSize: number,
    ) {
        this.zoomed = false;
        this.slider = new SliderModel(
            currentCenter,
            total,
            currentCenter,
            normalSize,
            zoomedSize,
        );
    }
}

export class SliderModel {
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

    alignHovered(): void {
        const offsetToCenter = this.hovered - this.absoluteCenter();
        const scaledOffset = offsetToCenter * this.zoomFactor();
        const calculatedCenter = this.hovered - scaledOffset;

        this.currentCenter = calculatedCenter;
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
