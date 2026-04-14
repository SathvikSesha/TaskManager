import { useEffect, useRef } from "react";

const CELL_SIZE = 52;
const COLORS = [
  "rgba(59,130,246,0.13)",
  "rgba(139,92,246,0.13)",
  "rgba(16,185,129,0.11)",
  "rgba(245,158,11,0.11)",
  "rgba(236,72,153,0.10)",
];

function GridBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    function build() {
      const W = window.innerWidth;
      const H = window.innerHeight;
      const cols = Math.ceil(W / CELL_SIZE);
      const rows = Math.ceil(H / CELL_SIZE);
      canvas.style.gridTemplateColumns = `repeat(${cols}, ${CELL_SIZE}px)`;
      canvas.style.gridTemplateRows = `repeat(${rows}, ${CELL_SIZE}px)`;
      canvas.innerHTML = "";

      for (let i = 0; i < cols * rows; i++) {
        const cell = document.createElement("div");
        cell.style.borderRight = "1px solid rgba(0,0,0,0.075)";
        cell.style.borderBottom = "1px solid rgba(0,0,0,0.075)";
        cell.style.transition = "background 0.35s ease";

        cell.addEventListener("mouseenter", () => {
          cell.style.transition = "background 0s";
          cell.style.background =
            COLORS[Math.floor(Math.random() * COLORS.length)];
        });
        cell.addEventListener("mouseleave", () => {
          cell.style.transition = "background 0.7s ease";
          cell.style.background = "transparent";
        });

        canvas.appendChild(cell);
      }
    }

    build();
    let rto;
    const onResize = () => {
      clearTimeout(rto);
      rto = setTimeout(build, 120);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      <div
        ref={canvasRef}
        style={{
          width: "100%",
          height: "100%",
          display: "grid",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}

export default GridBackground;
