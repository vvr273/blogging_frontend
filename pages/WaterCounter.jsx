// WaterCounter.jsx
import { updateWater } from "../src/api/auth";
import { useOutletContext } from "react-router-dom";

export default function WaterCounter() {
  const { counter, setCounter } = useOutletContext();

  const changeCounter = async (amt) => {
    try {
      await updateWater(amt);
      setCounter(prev => prev + amt);    // update locally only
    } catch (err) {
      console.error("Error updating water:", err);
    }
  };

  return (
    <div style={{ margin: "2rem 0" }}>
      <h2>Water Glasses: {counter}</h2>

      <button
        onClick={() => changeCounter(1)}
        style={{ background: "#66da96", padding: "0.5rem 1rem", marginRight: "1rem" }}
      >
        ➕
      </button>

      <button
        onClick={() => changeCounter(-1)}
        style={{ background: "#f36f61", padding: "0.5rem 1rem" }}
      >
        ➖
      </button>

      <button
        onClick={() => changeCounter(-counter)}
        style={{ background: "#f1c40f", padding: "0.5rem 1rem", marginLeft: "1rem" }}
      >
        Reset
      </button>
    </div>
  );
}
