import React from "react";

const SIGNS = [
  { id: "hello", name: "Hello", desc: "Wave hand near forehead outward." },
  { id: "thank_you", name: "Thank you", desc: "Flat hand from chin outward." },
  // add at least 10 signs...
];

export default function LearnPage() {
  const [selected, setSelected] = React.useState(SIGNS[0]);
  return (
    <div>
      <h2>Learn Signs</h2>
      <div className="learn-grid">
        <aside>
          {SIGNS.map((s) => (
            <button key={s.id} onClick={() => setSelected(s)}>{s.name}</button>
          ))}
        </aside>
        <section>
          <h3>{selected.name}</h3>
          <p>{selected.desc}</p>
          <video controls src={`/assets/${selected.id}.mp4`} width="400" />
          <p>Step-by-step:</p>
          <ol>
            <li>Hold your hand flat.</li>
            <li>Raise near forehead.</li>
            <li>Move outward with small wave.</li>
          </ol>
        </section>
      </div>
    </div>
  );
}
