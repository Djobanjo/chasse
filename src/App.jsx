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

  const SEUIL_DISTANCE = 0.0000449;
  const TOLERANCE_PROX = 0.0007

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
        nom: '🎯enigme n°1',
        lat: -20.902310,
        lng: 55.483800,
        reponses: [
    'b8bbfebf460922fa97036bed5cf939b2c00382da420d66c7f978f137bf40a81e',
    '0331abfff99f7ade250c8f48e1bfe9643aba48b0c5dbb9e28c68a255b52b9b37'
        ],
        valide: false,
        image:'enigme_1.webp',
        description:'Restaurant Universitaire'
      },

      {
        id: 'bu-sciences',
        nom: '🎯enigme n°2',
        lat: -20.901450,
        lng: 55.483020,
        reponses:[
    '674cefbedf88cfb36e9b664d7d08b6b43fba8194580bafb7e9fdcaa1603a39e1',
    '2478fbf4628341ce72a36b4b4b70db69ceb6de6b5911df25bf27a0b063300b9d'
        ],
        valide: false,
        image:'enigme_2.webp',
        description:'Bibliothèque Universitaire'
      },

      {
        id: 'bat-s1',
        nom: '🎯enigme n°3',
        lat: -20.901500,
        lng: 55.483870,
        reponses:    [
    '766d40c96d82a7a92ae6a7a0fd2effcf97b71e2d84e761eeb12a6ddb392749dd',
    'a1daa8644b100a924a9fd442665ed5ecdcb4acb1a7bff62cc5c146316e658c44'
        ],
        valide: false,
        image:'enigme_3.webp',
        description:'Batiment S1'
      },

      {
        id: 'bat-S4a',
        nom: '🎯enigme n°4',
        lat: -20.901010,
        lng: 55.484410,
        reponses:   [
    '766d40c96d82a7a92ae6a7a0fd2effcf97b71e2d84e761eeb12a6ddb392749dd',
    'a1daa8644b100a924a9fd442665ed5ecdcb4acb1a7bff62cc5c146316e658c44'
        ],
        valide: false,
        image:'enigme_4.webp',
        description:'Bâtiment S4A - S4B'
      },

      {
        id: 'bat-S2',
        nom: '🎯enigme n°5',
        lat: -20.90137,
        lng: 55.484837,
        reponses:   [
    '5047313b4475cd7e5418bb5561b1e3f23250da7b7dab876bb6cac032c933aff5',
    '218829799b6810651b0bd3eeec2c355b1ba2197d0b6be348e64b64543dc26731'
        ],
        valide: false,
        image:'enigme_5.webp',
        description:'Bâtiment S2'
      },

      {
        id:'bat-s4',
        nom: '🎯enigme n°6',
        lat: -20.901010,
        lng: 55.485270,
        réponses:  [
    '1ffa1a6ed0b38533dd172e63e85b24d9fb5f39a2335ed55d14b3e5f713dbf22e',
    '7ae190ed8e137838f71ce0ecc5f7aa9f0f393ab52b4c4b433afb7654a2222797'
        ],
        valide: false,
        image:'enigme_6.webp',
        description: 'amphi A et B\nsalles de TD S4D au dessus'
      },
      {
        id:'amphi-commerson',
        nom: '🎯enigme n°7',
        lat: -20.901385,
        lng: 55.485310,
        réponses: [
    '28fe2fb79ab57c77c7123990b0421940c2e29d8b9cfabc15fb19086e143384a3',
    '5dc269d5fc94c3a2b685ffd93a3da38340aa3c15e0ec3557cd118b60595c4c16'
        ],
        valide: false,
        image:'enigme_7.webp',
        description: 'Amphi Commerson'
      },

      {
        id:'distrib',
        nom: '🎯enigme n°8',
        lat: -20.901900,
        lng: 55.485710,
        reponses:  [
    '30ee0187e886d944d47939029caa6c02eb53676d9e5bfd2230a68906a29e7cb0',
    'fa896753a3968606e0c7ef2113cf43c7dc12d2e56719a3456a1379406754cb92'
  ],
        valide: false,
        image:'enigme_8.webp',
        description: "On est content de le voir quand on a de l'argent !!"
      },

      {
        id:'amphi-550',
        nom: '🎯enigme n°9',
        lat: -20.902390,
        lng: 55.485570,
        reponses: [
    'a4f47f963ab357e8c7e697dca9cd38be3a0b25f2ad8250ab6611156f36d0061e',
    '95ef1925a7648e030de28aa8353248f221f9f96b48a051b3f126fb572aeaadc4'
        ],
        valide: false,
        image:'enigme_9.webp',
        description: 'Amphi 550/Bioclimatique'
      },

      {
        id:'bat-soin',
        nom: '🎯enigme n°10',
        lat: -20.902700,
        lng: 55.484570,
        reponses:    [
    'c61ffe0528ff8213e148485c59169146e01ba5b80008a0c88a95a573cf967472',
    'dd98d7aa9a802576a0b5409a6da4245122588100c22bdacc339d8e31e0365703'
        ],
        valide: false,
        image:'enigme_10.webp',
        description: 'SUMPPS\n Batiment bien soignéeee !!'
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

          // proximity check avec distance réelle
          const current = etapes[etapeActuelle]
          if (current && !current.valide){
            const dist = distanceEnMetres(lat, lng, current.lat, current.lng)
            // console.log(`Distance à l'étape "${current.nom}": ${dist.toFixed(2)} mètres`) //<== A SUPP
            if (dist < 20){  
              setEtatTexte(`🔔 Proche de: ${current.nom} (distance: ${dist.toFixed(1)}m)`)
              // console.log(`etape acut:${etapeActuelle}`)
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
