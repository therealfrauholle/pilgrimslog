import * as L from 'leaflet';
import morphdom from 'morphdom';
import { ReactNode } from 'react';
import { renderToString } from 'react-dom/server';

export class ReactIcon extends L.DivIcon {
    children: ReactNode;

    constructor(options: L.DivIconOptions, children: ReactNode) {
        options.html = '<div></div>';
        super(options);
        this.children = children;
    }

    createIcon(oldIcon?: HTMLElement): HTMLElement {
        if (oldIcon == null) {
            oldIcon = super.createIcon(oldIcon);
        }

        oldIcon.style.background = 'none';
        oldIcon.style.border = 'none';

        morphdom(oldIcon.children.item(0)!, renderToString(this.children));

        return oldIcon;
    }
}
