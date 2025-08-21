import React, { useEffect, useRef, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap, ImageOverlay } from 'react-leaflet'
import { createPortal } from 'react-dom';
import L from 'leaflet'

function ImageModal({ image, title, description, onClose }) {
  if (!image) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center" 
    style={{ zIndex: 10000 }}>
      <div className="bg-white rounded-2xl shadow-xl p-4 max-w-md w-full max-h-[80vh] overflow-auto relative">
        <button
          onClick={onClose}
          className="modal-close-btn">X
        </button>
        <h2 className="titleEnigme">{title}</h2>
        <img
          src={image}
          alt={title}
          className="rounded-xl shadow-md"
          style={{ maxHeight: '45vh', width: 'auto', height: 'auto' }}
        />
        {description && (
          <p className="descriptionPop">{description}</p>
        )}
      </div>
    </div>,
    document.body
  );
}


function GetMapInstance({ setMapInstance }) {
  const map = useMap();
  useEffect(() => {
    if (map) {
      setMapInstance(map);
    }
  }, [map, setMapInstance]);
  return null;
  }
  

function RecenterOnce({ position }){
  const map = useMap()
  const hasCentered = useRef(false);

  useEffect(() => {
    if (position && !hasCentered.current){
      map.setView([position.lat, position.lng],17, {animate: false})
      hasCentered.current = true;
    }
  }, [position, map])
  return null
}
/*NO TEST */
// const bounds = [
//   [-20.9039, 55.4871], 
//   [-20.9003, 55.4810]  
// ];


/* TEST*/
const bounds =[
  [-20.9008, 55.4869],
  [-20.9033, 55.4820]
];

const userIcon = L.icon({ iconUrl: 'https://cdn-icons-png.flaticon.com/512/149/149060.png', iconSize: [32,32], iconAnchor: [16,32] })
const stepIcon = L.icon({ iconUrl: 'https://cdn-icons-png.flaticon.com/512/252/252025.png', iconSize: [30,30], iconAnchor: [15,30] })

export default function GameMap({ etapes, currentIndex, dernierePosition, onCenterRequested }) {
  // Ajoute une ref pour stocker l'instance de la carte Leaflet
  const mapRef = useRef(null)
  const [modalImage, setModalImage] = useState(null)
  const [modalTitle, setModalTitle] = useState("")
  const [modalDescription, setModalDescription] = useState("");

  useEffect(() => {
    if (mapRef.current) {
      // recalcul de la taille du conteneur Leaflet
      mapRef.current.invalidateSize();

      // ajuste la vue pour que les bounds remplissent tout le cadre
      mapRef.current.fitBounds(bounds, { padding: [-100, -100] });
    }
  }, [mapRef]);

useEffect(() => {
  if (!mapRef.current) return;

  const handleMapClick = () => {
    // Ferme la modale si ouverte
    if (modalImage) setModalImage(null);

    // Ferme tous les popups ouverts sur la carte
    mapRef.current.closePopup();
  };

  mapRef.current.on('click', handleMapClick);

  return () => {
    mapRef.current.off('click', handleMapClick);
  };
}, [modalImage]);


  useEffect(() => {
    etapes.forEach(e => {
      if (e.image) {
        const img = new Image();
        img.src = `${import.meta.env.BASE_URL}images/${e.image}`;
      }
    });
  }, [etapes]);

    
    useEffect(() => {
    if (mapRef.current) {
      mapRef.current.invalidateSize();
      
    }
  }, []);

  return (
    <div className="map-wrap">
      <MapContainer
        /*bounds={bounds}*/
        minZoom={17}
        maxZoom={18}
        style={{ height: '100%', width: '100%', borderRadius: '0' }}
        maxBounds={bounds}
        maxBoundsViscosity={1.0}
      >
        
        {/* TEST MAP PERSONALISEE*/}
        <TileLayer
          url={`${import.meta.env.BASE_URL}tiles2/{z}/{x}/{y}.png`}
          attribution="&copy; MapTiler"
        />

        {/* MAP DE BASE*/}
        {/*<TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />*/}


        {/* <ImageOverlay
          url="public/carte.png"
          bounds={bounds}
        /> */}

        <GetMapInstance setMapInstance={map =>(mapRef.current = map)} />
        {dernierePosition && (
          <Marker position={[dernierePosition.lat, dernierePosition.lng]} icon={userIcon}>
            <Popup>Vous êtes ici</Popup>
          </Marker>
        )}


        
        {etapes
          // .filter((e, idx) => {
          //   if (e.id === 'start') return true;         
          //   if (idx < currentIndex) return true;        
          //   if (idx === currentIndex) return true;      
            
          //   return false;                               
          // })
          .map((e, idx) => (
            <Marker key={e.id || idx} position={[e.lat, e.lng]} icon={stepIcon}>
              <Popup closeOnClick={false} autoClose={true}>
               <div style= {{textAlign:'center'}}>
                  <h3>{e.valide ? `✅ ${e.nom}` : e.nom}</h3>
                  {e.image && (
                    <img
                      src={`${import.meta.env.BASE_URL}images/${e.image}`}
                      alt={e.nom}
                      style={{ width: '70%', objectFit: 'contain', marginTop: '5px', cursor: 'pointer', pointerEvents: 'auto',touchAction:'none' }}
                      onClick={(ev) => {
                        ev.stopPropagation() // 🔑 bloque Leaflet de récupérer le clic
                        if (mapRef.current) {
                          mapRef.current.closePopup(); // 🔒 ferme le popup derrière
                        }
                        setModalImage(`${import.meta.env.BASE_URL}images/${e.image}`)
                        setModalTitle(e.nom);
                        setModalDescription(e.description );
                      }}
                    />
                  )}
                </div>
              </Popup>
            </Marker>
          ))}


        <RecenterOnce position={dernierePosition} />
      </MapContainer>
      <ImageModal
        image={modalImage}
        title={modalTitle}
        description={modalDescription}
        onClose={() => setModalImage(null)}
      />

    </div>
  )
}
