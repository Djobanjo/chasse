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
  const [geolocActive, setGeolocActive] = useState(false)
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
        id: 'bat-S4a',
        nom: '🎯enigme n°1',
        lat: -20.901010,
        lng: 55.484410,
        reponses: ['b8bbfebf460922fa97036bed5cf939b2c00382da420d66c7f978f137bf40a81e','0331abfff99f7ade250c8f48e1bfe9643aba48b0c5dbb9e28c68a255b52b9b37','78dedc26de9b40a973ad2e660b7ca18c38c11df52d30728c94c0a1feb7e577e1','c7c783e65aefe47bc122f17c8cbfa0638218d4721de32cea0ac030579c2150f7'],
        valide: false,
        image:'enigme_1.jpg',
        description:'Bâtiment S4A - S4B'
      },
      {
        id: 'bat-S2',
        nom: '🎯enigme n°2',
        lat: -20.90137,
        lng: 55.484837,
        reponses: ['674cefbedf88cfb36e9b664d7d08b6b43fba8194580bafb7e9fdcaa1603a39e1','2478fbf4628341ce72a36b4b4b70db69ceb6de6b5911df25bf27a0b063300b9d','cc2a8943a206524b14da8e9386f186c584cd0022918b8e9514b992f6817160f1','3707af693bab3de604f1514f78f1c9d28d4c1a0f16a0135aca2969fab2c82c19'],
        valide: false,
        image:'enigme_2.webp',
        description:'Bâtiment S2'
      },
      {
        id: 'amphi-a',
        nom: '🎯enigme n°3',
        lat: -20.901500,
        lng: 55.483870,
        reponses: ['3','trois','Trois'],
        valide: false,
        image:'enigme_3.webp',
        description:'Batiment S1'
      },
      {
        id: 'bu-sciences',
        nom: '🎯enigme n°4',
        lat: -20.901450,
        lng: 55.483020,
        reponses: ['4','quatre','Quatre'],
        valide: false,
        image:'enigme_4.webp',
        description:'Bibliothèque Universitaire'
      },
      {
        id:'cafet',
        nom: '🎯enigme n°5',
        lat: -20.901990,
        lng: 55.483500,
        reponses: ['5','cinq','Cinq'],
        valide: false,
        image:'enigme_5.webp',
        description: 'Caféteria'

      },
      {
        id:'RU',
        nom: '🎯enigme n°6',
        lat: -20.902310,
        lng: 55.483800,
        reponses: ['6','six','Six'],
        valide: false,
        image:'enigme_6.webp',
        description:'Restaurant Universitaire'
      },
      {
        id:'amphi-cadet',
        nom: '🎯enigme n°7',
        lat: -20.902317,
        lng: 55.484320,
        reponses: ['7','sept','Sept'],
        valide: false,
        image:'enigme_7.webp',
        description: 'DOFIP'
      },
      {
        id:'bat-soin',
        nom: '🎯enigme n°8',
        lat: -20.902700,
        lng: 55.484570,
        reponses: ['8','huit','Huit'],
        valide: false,
        image:'',
        description: 'SUMPPS'
      },
      {
        id:'amphi-550',
        nom: '🎯enigme n°9',
        lat: -20.902390,
        lng: 55.485570,
        reponses: ['9','neuf','Neuf'],
        valide: false,
        image:'enigme_9.webp',
        description: 'Amphi 550/Bioclimatique'
      },
      {
        id:'distrib',
        nom: '🎯enigme n°10',
        lat: -20.901900,
        lng: 55.485710,
        reponses: ['10','dix','Dix'],
        valide: false,
        image:'enigme_10.webp',
        description: "On est content de le voir quand on a de l'argent !!"
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
  // function recentrerSurMoi(mapInstance){
  //   if (!dernierePosition) {
  //     alert("Position utilisateur non encore connue.");
  //   return;
  //   }
  //   if (mapInstance && dernierePosition) {
  //     mapInstance.setView([dernierePosition.lat, dernierePosition.lng], 17);
  //   }
  // }


async function validerReponse() {
  if (enigmeIndex === null) return;

  const user =reponseTemp;
  const userHash = await hashPBKDF2(user);

  const hashes = etapes[enigmeIndex].reponses;

  if (hashes.includes(userHash)) {
    // réponse correcte
    setEtapes(prev => prev.map((e, i) => i === enigmeIndex ? { ...e, valide: true } : e));
    setEtatTexte(`✔️ Étape validée : ${etapes[enigmeIndex]?.nom || ''}`);
    setEnigmeIndex(null);
    setReponseTemp('');
        // Vérifier si c'est la première énigme validée
    if (enigmeIndex === 0) {
      setFinished(true);
      setEtatTexte('🎉 Félicitations ! La chasse est terminée !');
      // Si tu veux, tu peux aussi marquer toutes les étapes comme validées
      setEtapes(prev => prev.map(e => ({ ...e, valide: true })));
    } else {
      setEtapeActuelle(prev => prev + 1);
    }
  } else {
    setEtatTexte('❌ Mauvaise réponse. Essaie encore !');
  }
}
//     setEtapeActuelle(prev => {
//       const n = prev + 1;
//       if (n >= etapes.length) {
//         setEtatTexte('🎉 Chasse au trésor terminée !');
//         setFinished(true);
//       }
//       return n;
//     });
//   } else {
//     setEtatTexte('❌ Mauvaise réponse. Essaie encore !');
//   }
// }

  useEffect(() => {
      if (!dernierePosition) return;

      const current = etapes[etapeActuelle];
      if (current && !current.valide){
        const dist = distanceEnMetres(dernierePosition.lat, dernierePosition.lng, current.lat, current.lng);
        if (dist < 20){
          setEnigmeIndex(etapeActuelle);
        }
      }
    }, [dernierePosition, etapes, etapeActuelle]);
  
  useEffect(() => {
  const active = localStorage.getItem('geolocActive')
  if (active === 'true') {
    lancerWatchPosition()
  }
  }, [])



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
      

        {!teamName && (
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
        {enigmeIndex !== null && etapes[enigmeIndex] && (
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
