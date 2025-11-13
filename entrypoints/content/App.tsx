import "./App.css";
import { useState, useRef } from "react";
import { BatteryDial } from "./BatteryDial";

function App() {
  const [tool, setTool] = useState("cursor");
  const [isFlashlightOn, setIsFlashlightOn] = useState(false);

  const [mousePosition, setMousePosition] = useState<[number, number]>([0, 0]);

  const [battery, setBattery] = useState(100);
  const batteryIntervalRef = useRef<null | NodeJS.Timeout>(null);

  useEffect(() => {
    const onMouseMove = (ev: MouseEvent) => {
      setMousePosition([ev.clientX, ev.clientY]);
    };

    // on mount
    window.addEventListener("mousemove", onMouseMove);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  useEffect(() => {
    if (isFlashlightOn) {
      batteryIntervalRef.current = setInterval(() => {
        setBattery((prevBattery) => {
          if (prevBattery === 0) return 0;
          return prevBattery - 1;
        });
      }, 100);
    } else {
      if (!!batteryIntervalRef.current) {
        clearInterval(batteryIntervalRef.current);
      }
    }
  }, [isFlashlightOn]);

  const adjustment = Math.max(
    window.innerWidth * 1.5,
    window.innerHeight * 1.5,
  );

  const flashlightSize = battery / 10;

  let batteryColor = "lime";
  if (battery < 33) {
    batteryColor = "red";
  } else if (battery < 66) {
    batteryColor = "yellow";
  }

  const shouldShowLight = tool === "flashlight" && isFlashlightOn;

  return (
    <>
      <div id="knob-container">
        <BatteryDial
          onStepTurn={(batteryAmount) => {
            setBattery((prevBattery) => {
              if (prevBattery === 100) {
                return prevBattery;
              }

              const gainAmount = Math.abs(batteryAmount) / 4;

              return Math.min(prevBattery + gainAmount, 100);
            });
          }}
        />
      </div>
      <div id="battery-container">
        <div
          style={{
            background: batteryColor,
            width: battery,
            height: "2rem",
            borderRadius: 16,
          }}
        />
      </div>
      <div
        id="black-screen"
        data-tool={tool}
        style={{
          color: "red",
          maskImage: shouldShowLight
            ? `url('data:image/svg+xml;utf8,<svg style="overflow: visible;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" preserveAspectRatio="none"><circle r="${flashlightSize}" cx="95" cy="95" fill="black"/></svg>'), linear-gradient(#fff, #fff)`
            : undefined,
          maskComposite: "exclude",
          // maskPosition: `${mousePosition[0] - 200}px ${mousePosition[1] - 200}px`,
          maskPosition: "50% 50%",
          maskRepeat: "no-repeat",
          translate: `${mousePosition[0] - adjustment - 10}px ${mousePosition[1] - adjustment - 10}px`,
        }}
        onClick={() => {
          if (tool === "flashlight") {
            setIsFlashlightOn((prevValue) => !prevValue);
          }
        }}
      />
      <button
        id="tool-switcher"
        onClick={() => {
          setTool((prevTool) => {
            if (tool === "cursor") {
              setIsFlashlightOn(true);

              return "flashlight";
            }
            if (tool === "flashlight") {
              setIsFlashlightOn(false);

              return "cursor";
            }
            return prevTool;
          });
        }}
      >
        Switch to {tool === "flashlight" ? "Cursor" : "Flashlight"}
      </button>
    </>
  );
}

export default App;
