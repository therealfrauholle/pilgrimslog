import { JSX, useRef, useState } from "react";

export default function Slider() {

    const [isDragging, setDragging] = useState(false);
    const [x, setX] = useState(0);
    const parentRef = useRef<HTMLDivElement>(null)
    const childRef = useRef<HTMLDivElement>(null)

    return (
        <div className="relative z-50 w-full h-[50px]"
            ref={parentRef}
            onPointerMove={(pos) => {
                if (isDragging) {
                    console.log("client", pos.pageX, parentRef.current?.getBoundingClientRect().x, childRef.current?.getBoundingClientRect().x, pos.clientX -parentRef.current!.getBoundingClientRect().x)
                    setX(pos.clientX -parentRef.current!.getBoundingClientRect().x) //TODO: fix behavior on PointerDown, change in regards to boundingRect of child 
                }
            }}
            onPointerUp={() =>
                setDragging(false)
            }
            
        >
            <div className="absolute bg-red-300 h-[6px] mt-[7px] w-full"

            >

            </div>
            <div className="absolute bg-green-300 w-[40px] h-[25px] top-0 z-40 "
                ref = {childRef}
                style={{ left: x }}
                onPointerDown={() => {
                    setDragging(true)
                }}


            ></div>
        </div>
    );
}
