import { getLeverageValue } from "@/utils/misc";
import { useEffect, useState } from "react";
import {
  Range,
  checkValuesAgainstBoundaries,
  getTrackBackground,
} from "react-range";

const MIN = 1;
const MAX = 11;
const STEP = 1;

export const GraduateSlider = () => {
  const [values, setValues] = useState([2]);
  const [selectedMax, setSelectedMax] = useState(100);
  const [maxOptions] = useState([100, 150, 200, 250, 300]);

  const [selectedMin, setSelectedMin] = useState(0);
  const [minOptions] = useState([0, 15, 20, 25, 30]);

  const [selectedStep, setSelectedStep] = useState(1);
  const [stepOptions] = useState([0.5, 1, 5, 10, 20]);

  useEffect(() => {
    const valuesCopy = [...values].map((value) =>
      checkValuesAgainstBoundaries(value, selectedMin, selectedMax)
    );
    setValues(valuesCopy);
  }, [selectedMin, selectedMax, selectedStep]);

  return (
    <div className="mb-2.5 w-[97%] mx-auto">
      <Range
        values={values}
        step={STEP}
        min={MIN}
        max={MAX}
        rtl={false}
        onChange={(values) => setValues(values)}
        renderMark={({ props, index }) => {
          const leverage = getLeverageValue(index);
          return (
            <div
              {...props}
              key={props.key}
              style={{
                ...props.style,
                display: "flex",
                flexDirection: "column",
                // alignItems: "center",
                marginTop: "-2px",
              }}
            >
              <div
                className="mb-2 p-[2px]"
                style={{
                  height: "7px",
                  width: "7px",
                  borderRadius: "1px",
                  transform: "rotate(45deg)",
                  backgroundColor:
                    index * selectedStep + selectedMin < values[0]
                      ? "#836ef9"
                      : "rgba(70,70,70,1)",
                }}
              >
                {/* <div
                  className={`w-full h-full ${
                    index * selectedStep + selectedMin < values[0]
                      ? "bg-[#548BF4]"
                      : "bg-terciary"
                  }  rounded-[1px]`}
                /> */}
              </div>
              <div className="text-font-80 text-[11px] -ml-1">{leverage}</div>
            </div>
          );
        }}
        renderTrack={({ props, children }) => (
          <div
            onMouseDown={props.onMouseDown}
            onTouchStart={props.onTouchStart}
            style={{
              ...props.style,
              height: "36px",
              display: "flex",
              width: "100%",
            }}
          >
            <div
              ref={props.ref}
              style={{
                height: "3px",
                width: "100%",
                borderRadius: "4px",
                background: getTrackBackground({
                  values,
                  colors: ["#836ef9", "rgba(70,70,70,1)"],
                  min: MIN,
                  max: MAX,
                  rtl: false,
                }),
                alignSelf: "center",
              }}
            >
              {children}
            </div>
          </div>
        )}
        renderThumb={({ props, isDragged }) => (
          <div
            {...props}
            key={props.key}
            style={{
              ...props.style,
              height: "12px",
              width: "12px",
              borderRadius: "100%",
              backgroundColor: "rgba(200,200,200,1)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              //   boxShadow: "0px 2px 6px #AAA",
              padding: "2px",
            }}
          >
            <div
              style={{
                height: "100%",
                width: "100%",
                borderRadius: "100%",
                backgroundColor: "#836ef9",
              }}
            />
          </div>
        )}
      />
    </div>
  );
};
