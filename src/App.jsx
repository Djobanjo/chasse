import React, { useEffect, useRef, useState } from 'react'
import GameMap from './components/GameMap'
import EnigmeModal from './components/EnigmeModal'


export default function App(){
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
        nom: '🎯 Batiment S4a',
        lat: -20.901010,
        lng: 55.484410,
        enigme: 'Mon emplacement tu trouveras, le savoir tu auras',
        reponses: ['bibliotheque universitaire','bibliothèque universitaire','bibliothèque','bibliotheque','bu','BU'],
        valide: false
      },
      {
        id: 'bat-S2',
        nom: '🎯 Batiment S2',
        lat: -20.901278,
        lng: 55.484438,
        enigme: "Quel est le nom de l’université ?",
        reponses: ['universite de la reunion','université de la réunion','univ reunion','universite reunion'],
        valide: false
      },
      {
        id: 'amphi-a',
        nom: '🎯 Amphi Charpak',
        lat: -20.901500,
        lng: 55.483870,
        enigme: "Combien y a-t-il d’amphis au bâtiment A ?",
        reponses: ['3','trois'],
        valide: false
      },
      {
        id: 'bu-sciences',
        nom: '🎯 BU-Scicences',
        lat: -20.901450,
        lng: 55.483020,
        enigme: "Quel est le nom de l’amphi B ?",
        reponses: ['amphi b','amphi charpak'],
        valide: false
      },
      {
        id:'cafet',
        nom: '🎯 Cafétéria',
        lat: -20.901990,
        lng: 55.483500,
        enigme: "Quel est le plat du jour ?",
        reponses: ['poulet rôti','poulet','roti'],
        valide: false
      },
      {
        id:'RU',
        nom: '🎯 RU',
        lat: -20.902310,
        lng: 55.483800,
        enigme: "Quel est le plat du jour ?",
        reponses: ['poulet rôti','poulet','roti'],
        valide: false
      },
      {
        id:'amphi-cadet',
        nom: '🎯 Amphi Cadet',
        lat: -20.902200,
        lng: 55.484270,
        enigme: "Quel est le plat du jour ?",
        reponses: ['poulet rôti','poulet','roti'],
        valide: false
      },
      {
        id:'bat-soin',
        nom: '🎯 SUMPPS',
        lat: -20.902700,
        lng: 55.484570,
        enigme: "Quel est le plat du jour ?",
        reponses: ['poulet rôti','poulet','roti'],
        valide: false
      },
      {
        id:'amphi-550',
        nom: '🎯 Amphi 550',
        lat: -20.902500,
        lng: 55.486170,
        enigme: "Quel est le plat du jour ?",
        reponses: ['poulet rôti','poulet','roti'],
        valide: false
      },
      {
        id:'distrib',
        nom: '🎯 Distributeur',
        lat: -20.901900,
        lng: 55.485710,
        enigme: "Quel est le plat du jour ?",
        reponses: ['poulet rôti','poulet','roti'],
        valide: false
      }
    ]
  }

  function normaliser(s){ return String(s||'').trim().toLowerCase().normalize('NFD').replace(/['\u0300-\u036f']/g,'').replace(/\s+/g,' ') }


  useEffect(()=>{
    return ()=>{
      if (watchIdRef.current !== null) navigator.geolocation.clearWatch(watchIdRef.current)
    }
  },[])

  function lancerWatchPosition(){
    if (!navigator.geolocation) { alert("La géolocalisation n'est pas supportée."); return }
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
        console.log(`Distance à l'étape "${current.nom}": ${dist.toFixed(2)} mètres`) //<== A SUPP
        if (dist < 20){  
          setEtatTexte(`🔔 Proche de: ${current.nom} (distance: ${dist.toFixed(1)}m)`)
          console.log(`etape acut:${etapeActuelle}`)
          setEnigmeIndex(etapeActuelle)
        }
      }

    }, err => { alert('Erreur de géolocalisation: '+err.message) }, { enableHighAccuracy:true, maximumAge:10000, timeout:20000 })

    watchIdRef.current = id
    localStorage.setItem('geolocActive','true')
    setGeolocActive(true)
    setEtatTexte('🟢 Géolocalisation activée')
  }

  function arreterWatchPosition(){
    if (watchIdRef.current !== null){ navigator.geolocation.clearWatch(watchIdRef.current); watchIdRef.current = null }
    setGeolocActive(false)
    setEtatTexte('🛑 Géolocalisation arrêtée')
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


  function validerReponse(){
    if (enigmeIndex === null) return
    const user = normaliser(reponseTemp)
    const bonnes = etapes[enigmeIndex].reponses.map(normaliser)
    if (bonnes.includes(user)){
      // marque validé
      setEtapes(prev => prev.map((e,i) => i===enigmeIndex ? {...e, valide:true} : e))
      setEtatTexte(`✔️ Étape validée : ${etapes[enigmeIndex]?.nom || ''}`)
      setEnigmeIndex(null)
      setReponseTemp('')
      // avancer
      setEtapeActuelle(prev => {
        const n = prev + 1
        if (n >= etapes.length) { setEtatTexte('🎉 Chasse au trésor terminée !'); alert('🎉 Chasse au trésor terminée !') }
        return n
      })
    } else {
      setEtatTexte('❌ Mauvaise réponse. Essaie encore !')
    }
    

  }
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
      <header className="app-header"><h1>Chasse au trésor par Python de la fournaise</h1></header>
      <main className="container">
        <div className="topbar">
          <div id="etat">{etatTexte}</div>
          {!geolocActive ? (
            <button className="btnActivLoc"
            onClick={lancerWatchPosition}>🟢 Activer la géolocalisation</button>
          ) : (
            <button className="btnDisacLoc
            " onClick={arreterWatchPosition}>🛑 Désactiver la géolocalisation</button>
          )}
        </div>
       

        { <GameMap
          etapes={etapes}
          currentIndex={etapeActuelle}
          dernierePosition={dernierePosition}
          // onCenterRequested={recentrerSurMoi}
          mapRef={mapRef}
        />}

        {enigmeIndex !== null && etapes[enigmeIndex] && (
          <EnigmeModal
            etape={etapes[enigmeIndex]}
            reponse={reponseTemp}
            onChangeReponse={setReponseTemp}
            onValidate={validerReponse}
            onCancel={() => { setEnigmeIndex(null); setReponseTemp('') }}
          />
        )}

      </main>
    </div>
  )
}
