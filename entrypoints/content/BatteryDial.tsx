import { useRef } from "react";
import Hammer from "hammerjs";

export function BatteryDial({
  onStepTurn,
}: {
  onStepTurn: (change: number) => void;
}) {
  const virtualKnobRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const virtualKnob = virtualKnobRef.current;
    if (!virtualKnob) return;

    var prevAngle = -1;
    var mc = new Hammer(virtualKnob);

    mc.on("pan panstart panend tap", function (event) {
      if (event.type === "panstart") {
        prevAngle = -90;
      } else if (event.type === "panend" || event.type === "tap") {
        virtualKnob.style.transform =
          "translateX(-50%) translateY(-50%) rotate(0deg)";
        virtualKnob.style.webkitTransform =
          "translateX(-50%) translateY(-50%) rotate(0deg)";
      }
      if (Math.abs(prevAngle - event.angle) > 300) prevAngle = -prevAngle;
      var a1 = Math.floor(event.angle / 30);
      var a2 = Math.floor(prevAngle / 30);
      if (a1 != a2) {
        onStepTurn(a1 - a2);
      } else {
        onStepTurn(1);
      }

      if (event.type !== "panend" && event.type !== "tap") {
        virtualKnob.style.transform =
          "translateX(-50%) translateY(-50%) rotate(" +
          (event.angle + 90) +
          "deg)";
        virtualKnob.style.webkitTransform =
          "translateX(-50%) translateY(-50%) rotate(" +
          (event.angle + 90) +
          "deg)";
      }
      prevAngle = event.angle;
    });
  }, []);

  return (
    <div id="virtual_knob" ref={virtualKnobRef}>
      <div id="knob"></div>
      <div id="dial"></div>
    </div>
  );
}
