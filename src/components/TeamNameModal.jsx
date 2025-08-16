import React, { useState } from "react";

export default function TeamNameModal({ onSave }) {
  const [name, setName] = useState("");

  const handleSave = () => {
    if (name.trim()) {
      onSave(name.trim());
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // empêche le rechargement de page
    handleSave();
  };

  return (
    <form className="team-name-modal-content" onSubmit={handleSubmit}>
      <h2>Entrez le nom de votre équipe</h2>
      <input
        className="team-name-input"
        type="text"
        value={name}
        placeholder="Nom de l'équipe"
        onChange={(e) => setName(e.target.value)}
        inputMode="text"
        autoFocus
      />
      <button className="btnValideName" type="submit">
        Valider
      </button>
    </form>
  );
}
