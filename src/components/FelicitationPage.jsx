import React from "react";

export default function FelicitationPage({ teamName }) {
  return (
    <div className="overlay">
      <div className="modal">
        <h1>🎉 Félicitations {teamName} 🎉</h1>
        <p>Vous avez terminé la chasse au trésor !</p>
      </div>
    </div>
  );
}
