import React from 'react'

export default function EnigmeModal({ etape, reponse, onChangeReponse, onValidate, onCancel }){
  return (
    <div className="enigme-modal">
      <h2>{etape.nom}</h2>
      <p>{etape.enigme}</p>
      <input type="text" value={reponse} onChange={e => onChangeReponse(e.target.value)} placeholder="Tape ta réponse ici" />
      <div className="modal-actions">
        <button className="btn" onClick={onValidate}>Valider</button>
        <button className="btn btn-cancel" onClick={onCancel}>Annuler</button>
      </div>
    </div>
  )
}
