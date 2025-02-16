import {
    createElementObject,
    createOverlayComponent,
} from '@react-leaflet/core';
import { Popup as LeafletPopup, PopupEvent } from 'leaflet';
import { useEffect } from 'react';
import { PopupProps } from 'react-leaflet';
type PopupOpen = {
    open?: boolean;
};
export const Popup: import('react').ForwardRefExoticComponent<
    PopupProps & import('react').RefAttributes<LeafletPopup> & PopupOpen
> = createOverlayComponent(
    function createPopup(props, context) {
        const popup = new LeafletPopup(props, context.overlayContainer);
        return createElementObject(popup, context);
    },
    function usePopupLifecycle(element, context, { position, open }, setOpen) {
        useEffect(
            function addPopup() {
                const { instance } = element;
                function onPopupOpen(event: PopupEvent) {
                    if (event.popup === instance) {
                        instance.update();
                        setOpen(true);
                    }
                }
                function onPopupClose(event: PopupEvent) {
                    if (event.popup === instance) {
                        setOpen(false);
                    }
                }
                context.map.on({
                    popupopen: onPopupOpen,
                    popupclose: onPopupClose,
                });
                if (context.overlayContainer == null) {
                    // Attach to a Map
                    if (position != null) {
                        instance.setLatLng(position);
                    }
                    instance.openOn(context.map);
                } else {
                    // Attach to container component
                    context.overlayContainer.bindPopup(instance);
                }
                return function removePopup() {
                    context.map.off({
                        popupopen: onPopupOpen,
                        popupclose: onPopupClose,
                    });
                    context.overlayContainer?.unbindPopup();
                    context.map.removeLayer(instance);
                };
            },
            [element, context, setOpen, position, open],
        );
    },
);
