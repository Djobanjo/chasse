import React, { useEffect, useRef, useState } from 'react'
import GameMap from './components/GameMap'
import EnigmeModal from './components/EnigmeModal'
import TeamNameModal from './components/TeamNameModal';
import FelicitationPage from './components/FelicitationPage';
import { hashPBKDF2 } from './utils/hash';
import html2canvas from "html2canvas";




export default function App(){
  const [teamName, setTeamName] = useState(localStorage.getItem("teamName") || "")
  const [finished, setFinished] = useState(false)
  const [etapes, setEtapes] = useState([]) //ENEVER FUNCTION APRES TEST
  const [etapeActuelle, setEtapeActuelle] = useState(0)
  const [dernierePosition, setDernierePosition] = useState(null)
  const [enigmeIndex, setEnigmeIndex] = useState(null)
  const [etatTexte, setEtatTexte] = useState('📍 En attente de position...')
  const [geolocActive, setGeolocActive] = useState(
  localStorage.getItem('geolocActive') === 'true'
);
  const [reponseTemp, setReponseTemp] = useState('')
  const watchIdRef = useRef(null)
  const dernierePositionRef = useRef(null)


  function deg2rad(deg) {
  return deg * (Math.PI / 180);
}


function distanceEnMetres(lat1, lng1, lat2, lng2) {
  const R = 6371000; // rayon Terre en mètres
  const dLat = deg2rad(lat2 - lat1);
  const dLng = deg2rad(lng2 - lng1);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}


  function buildInitialSteps(lat, lng){ //lat, lng <== REMETTRE DANS LES PARAMS
    return [
      {
        id:'RU',
        nom: '🎯Enigme n°1 - Réstaurant Universitaire',
        lat: -20.902310,
        lng: 55.483800,
        reponses:   [
    'b8bbfebf460922fa97036bed5cf939b2c00382da420d66c7f978f137bf40a81e',
    '0331abfff99f7ade250c8f48e1bfe9643aba48b0c5dbb9e28c68a255b52b9b37',
    '98d362a5f16ccfa1c599adbfe4a970c863d39c78e6c2b69aa1befc03c85e94c4',
    '85a9e9235bc834908c8aafae2b3f813b310cadb6d15e47529bf4bcbd1822daf8',
    '6125e4c99a9afb9026ad4eaf3a9be737bef1a935389f5465cb1557e3294ca4a2',
    'a09193883915fa0b72e9d45b755e48a13be86326ef8f474a3805639e44c1f98f',
    '429bcc856af7b4b97ff983f6c12515957e711e3b1eb36bd252c03593864918c0'
  ],
        valide: false,
        image:'enigme_1.webp',
        description:'Réstaurant Universitaire'
      },

      {
        id: 'bu-sciences',
        nom: '🎯Enigme n°2 - Bibliothèque Universitaire',
        lat: -20.901450,
        lng: 55.483020,
        reponses:[
    'c2a306c4bc3a64bb913f1653118af2f0b96c41d4bf0290ff41a108a0002f898b',
    '95af4371a350df09023d12e3c969b2dde5ebc2de48e807e56c7c88971ff14811'
  ],
        valide: false,
        image:'enigme_2.webp',
        description:'Bibliothèque Universitaire'
      },

      {
        id: 'bat-s1',
        nom: '🎯Enigme n°3 - Bâtiment S1',
        lat: -20.901500,
        lng: 55.483870,
        reponses:   [
    'b8bbfebf460922fa97036bed5cf939b2c00382da420d66c7f978f137bf40a81e',
    '0331abfff99f7ade250c8f48e1bfe9643aba48b0c5dbb9e28c68a255b52b9b37'
  ],
        valide: false,
        image:'enigme_3.webp',
        description:'Bâtiment S1'
      },

      {
        id: 'bat-S4a',
        nom: '🎯Enigme n°4 - Bâtiment S4A et S4B',
        lat: -20.901010,
        lng: 55.484410,
        reponses:   [
    'ef930ddd06334b77d6833de04ca52ecaf53550e4f9d266ef45d52846be9e4263'
  ],
        valide: false,
        image:'enigme_4.webp',
        description:'Bâtiment S4A - S4B'
      },

      {
        id: 'bat-S2',
        nom: '🎯Enigme n°5 - Bâtiment S2',
        lat: -20.90137,
        lng: 55.484837,
        reponses:     [
    'acfa52c05730934290c93d46583af998dd9d3163b3e105c60223b7c7a52d6baa',
    'e53d59138972d3d7d109e50206939eca2b4451ab6b7f6d4433c740387f20ab0b'
  ],
        valide: false,
        image:'enigme_5.webp',
        description:'Bâtiment S2'
      },

      {
        id:'bat-s4',
        nom: '🎯Enigme n°6 - Amphi A et B',
        lat: -20.901010,
        lng: 55.485270,
        reponses: [
    '8386dc16d04e2796365bdc3941fb091ade9120ec3e6dd6a56f86f1caf58fff0c',
    '2a2432bc50766a51b7cbf51f56febb4f0011fe97dae524d584a000936b1116f7'
  ],
        valide: false,
        image:'enigme_6.webp',
        description: 'Amphi A et B\nsalles de TD S4D au dessus'
      },
      {
        id:'amphi-commerson',
        nom: '🎯Enigme n°7 - Amphi Commerson',
        lat: -20.901385,
        lng: 55.485310,
        reponses:   [
    'affc607f8743bf493ac3b99d98433404f2b19fee4b924ca140b1695884e5b3b1'
  ],
        valide: false,
        image:'enigme_7.webp',
        description: 'Amphi Commerson'
      },

      {
        id:'distrib',
        nom: '🎯Enigme n°8 - Distributeur',
        lat: -20.901900,
        lng: 55.485710,
        reponses:    [
    '24d3ed19ef18861ce91244f72190f28af22d37d15d071782fc175de16b826b42'
  ],
        valide: false,
        image:'enigme_8.webp',
        description: "On est content de le voir quand on a de l'argent !!"
      },

      {
        id:'amphi-550',
        nom: '🎯Enigme n°9 - Amphi 550',
        lat: -20.902390,
        lng: 55.485570,
        reponses:   [
    '7a192f027b17cc7487bf222b9ae7289479853b9718a73741ca4c7fd3a1a5aa2a'
  ],
        valide: false,
        image:'enigme_9.webp',
        description: 'Amphi 550/Bioclimatique'
      },

      {
        id:'bat-soin',
        nom: '🎯Enigme n°10 - SUMPPS',
        lat: -20.902700,
        lng: 55.484570,
        reponses:      [
    'c98947d430f9c807c524ce5f98818b7c5f3b2bb86b3eda6daab09e76978313d7'
  ],
        valide: false,
        image:'enigme_10.webp',
        description: 'SUMPPS\n Bâtiment bien soignéeee !!'
      }
    ]
  }

  // function normaliser(s){ return String(s||'').trim().toLowerCase().normalize('NFD').replace(/['\u0300-\u036f']/g,'').replace(/\s+/g,' ') }


  useEffect(() => {
    if (navigator.permissions) {
      navigator.permissions.query({ name: 'geolocation' }).then((result) => {
        setGeolocActive(result.state === 'granted');
        result.onchange= () => {
          setGeolocActive(result.state === 'granted');
          if (result.state === 'denied') {
            setEtatTexte('❌ Géolocalisation refusée, Veuillez autoriser dans les paramètres du navigateur');
          }
        };
      });
    }
  }, []);

  useEffect(()=>{
    return ()=>{
      if (watchIdRef.current !== null) navigator.geolocation.clearWatch(watchIdRef.current)
    }
  },[])

  function lancerWatchPosition(){
    if (!navigator.geolocation) { alert("La géolocalisation n'est pas supportée."); return }

    if(navigator.permissions) {
      navigator.permissions.query({ name: 'geolocation' }).then((result) => {
        if (result.state === 'denied') {
          alert("❌ Géolocalisation refusée, Veuillez changer les paramètres pour l'activer.");
          setEtatTexte('❌ Géolocalisation refusée');
          return;
        }

        const id = navigator.geolocation.watchPosition(pos => {
          const lat = pos.coords.latitude, lng = pos.coords.longitude
          setEtatTexte(`Position: ${lat.toFixed(5)}, ${lng.toFixed(5)}`)

          setDernierePosition({lat, lng})
          dernierePositionRef.current = { lat, lng } // Met à jour la ref

          if (etapes.length === 0){
            const init = buildInitialSteps(lat,lng)
            setEtapes(init)
          }

          const current = etapes[etapeActuelle]
          if (current && !current.valide){
            const dist = distanceEnMetres(lat, lng, current.lat, current.lng)
            
            if (dist < 20){  
              setEtatTexte(`🔔 Proche de: ${current.nom} (distance: ${dist.toFixed(1)}m)`)
              setEnigmeIndex(etapeActuelle)
            }
          }
        }, err => { 
          alert('Erreur de géolocalisation: '+err.message) }, { enableHighAccuracy:true, maximumAge:10000, timeout:20000 })

        watchIdRef.current = id
        localStorage.setItem('geolocActive','true')
        setGeolocActive(true)
        setEtatTexte('🟢 Géolocalisation activée')
      });
    }
  }

  function arreterWatchPosition(){
    if (watchIdRef.current !== null){ navigator.geolocation.clearWatch(watchIdRef.current); watchIdRef.current = null }
    setGeolocActive(false)
    setEtatTexte('🛑 Géolocalisation arrêtée')
    localStorage.removeItem('geolocActive');
  }

  const mapRef = useRef(null);


  const normaliser = s =>
  (s || '')
    .toString()
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f']/g, '')
    .replace(/\s+/g, ' ');

async function validerReponse() {
  if (enigmeIndex === null) return;

  const user = normaliser(reponseTemp);
  const userHash = await hashPBKDF2(user);

  const hashes = etapes[enigmeIndex].reponses;

  if (hashes.includes(userHash)) {
    // réponse correcte
    setEtapes(prev => prev.map((e, i) => i === enigmeIndex ? { ...e, valide: true } : e));
    setEtatTexte(`✔️ Étape validée : ${etapes[enigmeIndex]?.nom || ''}`);
    setEnigmeIndex(null);
    setReponseTemp('');

    /* LES TESTS */
//     if (enigmeIndex === 0) {
//       setFinished(true);
//       setEtatTexte('🎉 Félicitations ! La chasse est terminée !');
//       setEtapes(prev => prev.map(e => ({ ...e, valide: true })));
//     } else {
//       setEtapeActuelle(prev => prev + 1);
//     }
//   } else {
//     setEtatTexte('❌ Mauvaise réponse. Essaie encore !');
//     setReponseTemp('');
//   }
// }
          /*NO TEST */
    setEtapeActuelle(prev => {
      const n = prev + 1;
      if (n >= etapes.length) {
        setEtatTexte('🎉 Chasse au trésor terminée !');
        setFinished(true);
      }
      return n;
    });
  } else {
    setEtatTexte('❌ Mauvaise réponse. Essaie encore !');
    setReponseTemp('');
  }
}

  useEffect(() => {
      if (!dernierePosition) return;

      const current = etapes[etapeActuelle];
      if (current && !current.valide){
        const dist = distanceEnMetres(dernierePosition.lat, dernierePosition.lng, current.lat, current.lng);
        if (dist < 10){
          setEnigmeIndex(etapeActuelle);
        }
      }
    }, [dernierePosition, etapes, etapeActuelle]);
  
  useEffect(() => {
    if (geolocActive) {
      lancerWatchPosition();
    }
  }, [geolocActive]);



  return (
    <div>
      {/* <header className="app-header"><h1>Chasse au trésor </h1></header> */}
      <main className="container">
        <div className="topbar">
          <div id="etat"><span>{etatTexte}</span></div>
          {!geolocActive ? (
            <button className="btnActivLoc"
            onClick={lancerWatchPosition}>🟢 Activer la géolocalisation</button>
          ) : (
            <button className="btnDisacLoc
            " onClick={arreterWatchPosition}>🛑 Désactiver la géolocalisation</button>
          )}
        </div>
      <div className="map-wrapper">
        <GameMap
          etapes={etapes}
          currentIndex={etapeActuelle}
          dernierePosition={dernierePosition}
          // onCenterRequested={recentrerSurMoi}
          mapRef={mapRef}
        />
      

        {!finished && !teamName && (
          <>
            <div className="overlay-blur-map"></div>
            <div className="overlay-modal">
              <TeamNameModal
                onSave={(name) => {
                  localStorage.setItem("teamName", name);
                  setTeamName(name);
                }}
              />
            </div>
          </>
        )}
      </div>
        {!finished && enigmeIndex !== null && etapes[enigmeIndex] && (
          <>
            <div className="modal-overlay" onClick={() => setEnigmeIndex(null)}></div>
            <div className="modal-container">
              <EnigmeModal
                etape={etapes[enigmeIndex]}
                reponse={reponseTemp}
                onChangeReponse={setReponseTemp}
                onValidate={validerReponse}
                onCancel={() => { setEnigmeIndex(null); setReponseTemp('') }}
              />
            </div>
          </>
        )}
        {finished && (
          <>
            <FelicitationPage teamName={teamName} className="felicitation" />
          </>
        )}

      </main>
    </div>
  )
}
