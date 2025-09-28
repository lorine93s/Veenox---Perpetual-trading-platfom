import { getLeverageValue } from "@/utils/misc";
import { useAccount } from "@orderly.network/hooks";
import { FC, useEffect, useState } from "react";
import {
  Range,
  checkValuesAgainstBoundaries,
  getTrackBackground,
} from "react-range";
import { getMaxLeverageToValue } from "../../utils";
interface LeverageEditorProps {
  onSave?: (value: { leverage: number }) => Promise<void>;
  maxLeverage?: number;
  leverageLevers: number[];
}

const MIN = 1;
const MAX = 11;
const STEP = 1;

export const LeverageEditor: FC<LeverageEditorProps> = ({
  maxLeverage,
  leverageLevers,
  onSave,
}) => {
  const { state } = useAccount();
  const [values, setValues] = useState<number[]>([MIN]);

  useEffect(() => {
    if (maxLeverage !== undefined) {
      const formatMaxLeverage = getMaxLeverageToValue(maxLeverage);
      setValues([formatMaxLeverage]);
    }
  }, [maxLeverage]);

  useEffect(() => {
    const valuesCopy = values.map((value) =>
      checkValuesAgainstBoundaries(value, MIN, MAX)
    );
    setValues(valuesCopy);
  }, []);

  return (
    <div className="mb-2.5 w-[97%] mx-auto">
      <Range
        step={1}
        min={1}
        max={11}
        disabled={state.status !== 5}
        values={values}
        onChange={(value) => setValues(value)}
        onFinalChange={(value) => {
          const _value = leverageLevers[value[0] - 1];
          try {
            onSave?.({ leverage: _value });
          } catch (err) {}
        }}
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
                marginTop: "-2px",
                marginRight: "-2px",
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
                    index * STEP + MIN < values[0]
                      ? "#836ef9"
                      : "rgba(70,70,70,1)",
                }}
              >
                <div
                  className={`w-full h-full ${
                    index * STEP + MIN < values[0]
                      ? "bg-[#836ef9]"
                      : "bg-borderColor-DARK"
                  }  rounded-[1px]`}
                />
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
                  min: 1,
                  max: 11,
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
