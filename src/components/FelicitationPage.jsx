import React, { useRef, useState } from "react";
import html2canvas from "html2canvas";

export default function FelicitationPage({ teamName }) {
  const modalRef = useRef(null);
  const [closing, setClosing] = useState(false); // pour l'animation

  const handleDownload = () => {
    if (modalRef.current) {
      html2canvas(modalRef.current).then((canvas) => {
        const link = document.createElement("a");
        link.download = `felicitation-${teamName}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
      });
    }
  };

  const handleClose = () => {
    setClosing(true); // déclenche l'animation

    // Attendre la fin de l'animation (ici 300ms) avant de vider le localStorage
    setTimeout(() => {
      localStorage.clear();
      window.location.reload();
    }, 300);
  };

  return (
    <div className="overlay">
      {/* La modal */}
      <div
        ref={modalRef}
        className={`modal ${closing ? "modal-closing" : ""}`}
        style={{
          backgroundImage: `url(${import.meta.env.BASE_URL}congratulation.webp)`,
          position: "relative",
          transition: "transform 0.3s ease, opacity 0.3s ease",
        }}
      >
        {/* X pour fermer */}
        <button
          onClick={handleClose}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            background: "transparent",
            border: "none",
            fontSize: "1.5rem",
            cursor: "pointer",
          }}
        >
          ×
        </button>

        <h1>Félicitations</h1>
        <h2>L'équipe: {teamName}</h2>
      </div>

      {/* Bouton pour télécharger */}
    <button
      id="downloadBtn"
      className="btnValideName"
      onClick={handleDownload}
      style={{ marginTop: "20px" }}
    >
      Télécharger
    </button>
    </div>
  );
}
