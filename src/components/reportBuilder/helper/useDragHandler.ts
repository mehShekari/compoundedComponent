import { useEffect, useCallback, useRef } from "react";
import { usePaperContext } from "..";




export default function useDrag({
  parentRefClassName
}: {
  parentRefClassName: string;
}) {
  const resizeArea = 20;
  const fieldPadding = 5;
  const ContainerPadding = 1;

  const isScrubbing = useRef(false);
  const render = useRef<boolean>(false);
  const resize = useRef<boolean>(false);

  const draggedElement = useRef<HTMLElement | null>(null);
  const parentRef = useRef<HTMLDivElement | null>(null)
  const bodyRef = useRef<HTMLElement | null>(document.body);

  const pl = useRef<number>(0);
  const pt = useRef<number>(0);
  const parentRefSize = useRef<{ width: number, height: number, rect: any }>({
    width: 0,
    height: 0,
    rect: DOMRect
  })

  const { dragElementName, setDragElementName } = usePaperContext()


  useEffect(() => {
    parentRef.current = document.querySelector(`.${parentRefClassName}`);
    parentRefSize.current.width = parentRef.current!.offsetWidth;
    parentRefSize.current.height = parentRef.current!.offsetHeight;
    parentRefSize.current.rect = parentRef.current!.getBoundingClientRect();

    window.addEventListener("resize", () => {
      parentRefSize.current.width = parentRef.current!.offsetWidth;
      parentRefSize.current.height = parentRef.current!.offsetHeight;
      parentRefSize.current.rect = parentRef.current!.getBoundingClientRect();
    })
  }, [])

  // add or remove active class from dragged or selected element with click event
  useEffect(() => {
    window.addEventListener("click", (_evt: MouseEvent) => {
      const boxes = document.querySelectorAll('div.active-box');
      boxes.forEach((_item: any) => {
        _item.classList.remove("active-box");
      })

      const target = _evt.target as HTMLElement;
      if (target?.matches(".box")) {
        target.classList.add("active-box")
      }
    })
  }, [])

  const handleMouseMove = useCallback((_evt: MouseEvent) => {
    if(dragElementName.length > 0 && dragElementName !== parentRefClassName) return null
    console.log(dragElementName)
    _evt.preventDefault();
    _evt.stopPropagation();


    isScrubbing.current = (_evt.buttons & 1) == 1;

    // in this part we are simulating mouseDown and mouse in mouseUp
    if (isScrubbing.current) {
      const target = _evt.target as HTMLElement;
      //  mouseDown
      if (target?.matches(".box") && !resize.current) {
        // to save pl and pt just for once in mouseDown
        if (!render.current) {
          draggedElement.current = target;
          let rect = draggedElement.current?.getBoundingClientRect();
          if (
            (rect?.left + rect?.width - resizeArea) <= _evt.clientX &&
            (rect?.top + rect?.height - resizeArea) <= _evt.clientY
          ) {
            resize.current = true;
            return
          }
          resize.current = false;

          draggedElement.current.style.opacity = "0.9";
          draggedElement.current.style.zIndex = "10";
          draggedElement.current.style.transform = `rotate(0deg)`;

          if (bodyRef.current) bodyRef.current.style.cursor = "grabbing";

          pl.current = (_evt.clientX - rect.left) + fieldPadding;
          pt.current = (_evt.clientY - rect.top) + fieldPadding;

          setDragElementName(parentRefClassName)
        }
        render.current = true;
      }
    }

    // mouseUp
    else if (draggedElement.current && !isScrubbing.current) {
      if (bodyRef.current) bodyRef.current.style.cursor = "auto";
      draggedElement.current.style.transform = `rotate(0deg)`;
      draggedElement.current.style.opacity = "1";
      draggedElement.current.style.zIndex = "auto";

      draggedElement.current = null;
      render.current = false;
      resize.current = false;
    }
    // its means we dragged the element here
    if (draggedElement.current && (isScrubbing.current && !resize.current)) {
      const { width, rect, height } = parentRefSize.current;
      const maxXLimitation = (draggedElement.current.offsetWidth - pl.current) + (_evt.clientX - rect.left);
      const minXLimitation = draggedElement.current.offsetWidth;

      const maxYLimitation = (draggedElement.current.offsetHeight - pt.current) + (_evt.clientY - rect.top);
      const minYLimitation = draggedElement.current.offsetHeight;

      const x = Math.max(minXLimitation + ContainerPadding, Math.min(maxXLimitation, width - ContainerPadding))
      const y = Math.max(minYLimitation + ContainerPadding, Math.min(maxYLimitation, height - ContainerPadding))

      draggedElement.current.style.left = `${(x - draggedElement.current.offsetWidth) + rect.left}px`;
      draggedElement.current.style.top = `${(y - draggedElement.current.offsetHeight) + rect.top + window.scrollY}px`;
    }
  }, [dragElementName]);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", () => console.log("d"));
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [])

  return { handleMouseMove }
}