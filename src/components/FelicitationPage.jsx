import React, { useRef } from "react";
import html2canvas from "html2canvas";

export default function FelicitationPage({ teamName }) {
  const modalRef = useRef(null);

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

  return (
    <div className="overlay">
      {/* La partie capturée */}
      <div
        className="modal"
        ref={modalRef}
        style={{
          backgroundImage: `url(${import.meta.env.BASE_URL}congratulation.webp)`,
        }}
      >
        <h1> Félicitations </h1>
        <h2>l'équipe: {teamName}</h2>
      </div>

      {/* Bouton pour télécharger */}
      <button id="downloadBtn" className="btnValideName" onClick={handleDownload}>
        Télécharger
      </button>
    </div>
  );
}
