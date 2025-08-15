import React, { useState } from "react";

export default function TeamNameModal({ onSave }) {
  const [name, setName] = useState("");

  return (
    <div className="overlay-blur">
      <div className="modal">
        <h2>Entrez le nom de votre équipe</h2>
        <input
          type="text"
          value={name}
          placeholder="Nom de l'équipe"
          onChange={(e) => setName(e.target.value)}
        />
        <button
          onClick={() => {
            if (name.trim()) {
              onSave(name.trim());
            }
          }}
        >
          Valider
        </button>
      </div>
    </div>
  );
}
