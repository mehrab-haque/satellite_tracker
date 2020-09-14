import React,{useState,useEffect} from 'react';
import { withScriptjs,withGoogleMap, GoogleMap,MarkerWithLabel, Marker, InfoWindow,Polyline } from 'react-google-maps';
import { getLatLngObj,getSatelliteInfo } from "tle.js";
import './App.css'

const tle = `ISS (ZARYA)
1 25544U 98067A   20257.48129375 -.00000593  00000-0 -26488-5 0  9997
2 25544  51.6439 271.5346 0000944  94.7477  58.4893 15.48943778245704`;

//1 43462U 18043B 20257.88542225 +.00000088 +00000-0 +17919-4 0 9994\r\n2 43462 098.2217 225.1934 0096831 143.2794 217.5105 14.80926925127134"

const tle_line1="1 43463U 18044A   20257.44108278 -.00000370  00000-0  00000+0 0  9997"
const tle_line2="2 43463   0.0096 213.6964 0001933 333.4638  83.6251  1.00271768  8649"

//const tle=[tle_line1,tle_line2]


const MarkerIcon = (props: any) => {
    const { color, name, id } = props;
    return (
      <img src={require('./assets/iss.png')}

            className='iss'

          />
    );
  };



const Map=props=>{
  var poly=[]
  var counter=0
  const initData=getLatLngObj(tle)
  const [location,setLocation]=useState(initData)
  const [path,setPath]=useState(poly)
  const [data,setData]=useState(getSatelliteInfo(tle,Date.now(),initData.lat,initData.lng,0))

  const [count,setCount]=useState(0)

  useEffect(()=>{
    const interval = setInterval(() => {
      var curr=getLatLngObj(tle)
      setLocation(curr)
      counter++
      setCount(counter)
      setData(getSatelliteInfo(tle,Date.now(),curr.lat,curr.lng,0))

    }, 100);
    const interval1 = setInterval(() => {
      var curr=getLatLngObj(tle)
      poly.push(curr)
      setPath(poly)
      //console.log(path)
    }, 1000);
    return () => {clearInterval(interval);clearInterval(interval1);}
  },[])


  useEffect(()=>{
    console.log(data)
  },[data])

  const icon = { url: require('./assets/iss.png'), scaledSize: { width: 40, height: 40 } };
  let iconMarker = new window.google.maps.MarkerImage(
                  require('./assets/iss.png'),
                    null, /* size is determined at runtime */
                    new window.google.maps.Point(0, 0), /* origin is 0,0 */
                    new window.google.maps.Point(30, 30), /* anchor is bottom center of the scaled image */
                    new window.google.maps.Size(60, 50)
                );
  return(
    <GoogleMap
        defaultZoom={5}
        defaultCenter={location}>

        {
          count<5?(
            <Marker
              className='iss'
              options={
                     {
                      icon: {

                         scaledSize: new window.google.maps.Size(100, 100),
                       },
                       position:{location}
                     }
                   }

            />
          ):(
            <Marker
              position={location}
              className='isss'
              icon={iconMarker}

            >
            <InfoWindow onCloseClick={(e)=>{}}>
            <div>
                <span>International Space Station</span><br/>
                <center><img style={{marginTop:'5px'}}  height="30px" width='40px' src={require('./assets/usa.png')}/></center>
                <center>{`Lat:${location.lat.toFixed(3)}, Lng:${location.lng.toFixed(3)}`}</center>
                <center>{`Velocity:${data.velocity.toFixed(3)} km/s`}<br/> {`Height:${data.height.toFixed(3)} km`}</center>
                </div>
              </InfoWindow>

            </Marker>
          )
        }

        <Polyline options={{
                    strokeColor: "#ff2527",
                    strokeOpacity: 1,
                    strokeWeight: 4,

                }} geodesic={true} key={Date.now()} path={path}/>

    </GoogleMap>
  )
}

const MapWrapped=withScriptjs(withGoogleMap(Map))

function App() {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <MapWrapped
        googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=AIzaSyBBtlJLnoitCT1qUBMtyMi-vA-McRbHmjM`}
        loadingElement={<div style={{ height: `100%` }} />}
        containerElement={<div style={{ height: `100%` }} />}
        mapElement={<div style={{ height: `100%` }} />}
      />
    </div>
  );
}

export default App
