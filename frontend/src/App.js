import React, { Fragment, useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom';
import ReactAudioPlayer from 'react-audio-player';
import ReactDOM from 'react-dom';
import axios from 'axios';
import './App.css';
import SimpleReactFileUpload from './react-file-upload';


const App = () => {
    return (
      <Router>
      <header>
        <h1>Let Me Jam</h1>
              <Link to="/" style={{ textDecoration: 'none' }}>
                <button type="button">
                  Home
                </button>
              </Link>
              <Link to="/add-track" style={{ textDecoration: 'none' }}>
                <button type="button">
                  Add Track
                </button>
              </Link>
      </header>
      <div>
        <nav>
          <ul>
            
          </ul>
        </nav>

        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/add-track">
            <AddTrack />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
    );
}

function Home() {
  useEffect(() => {
    const getAPI = () => {
        // Change this endpoint to whatever local or online address you have
        // Local PostgreSQL Database
        const API = 'http://data.letmejam.com';

        fetch(API)
            .then((response) => {
                console.log(response);
                return response.json();
            })
            .then((data) => {
                console.log(data);
                setLoading(false);
                setApiData(data);
            });
    };

   // const getMP3 = (id) => {
   //   axios({
   //     url: `http://localhost:5000/files/t${id}.mp3`,
   //     method: 'GET',
   //     responseType: 'blob', // important
   //   }).then((response) => {
   //     const mp3 = new Blob([response.data], { type: 'audio/mp3' })
   //     const url = window.URL.createObjectURL(mp3)
   //     setData(url)
   //   })
   //}
    getAPI();
    //getMP3(1);
  }, []);
  const [apiData, setApiData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [Data, setData] = useState("");
  const handleSearch = (event) => {
        setData(event.target.value);
        console.log(Data);
    }

  return (
  <Fragment>

    <p>
      <input
            type="text"
            id="filter"
            placeholder="Search for a Track..."
            onChange={handleSearch}
      />
    </p>
    <main>
        {loading === true ? (
            <div>
                <h1>Loading...</h1>
            </div>
        ) : (
            <section>
                {apiData.filter((track) => track[1].includes(Data)).map((track) => {
                    const trackId = track[0];
                    const trackName = track[1];
                    const trackArtist = track[7];
                    const imgFilename = track[2];
                    const trackGenre = track[3];
                    const trackFilename = track[4];
                    const trackKey = track[5];
                    const trackRating = track[6];
                    /*
                    const playAudio = async (id) => {
                      try {
                        console.log(id)
                        const response = await axios.get(`http://localhost:5000/files/t${id}.mp3`, {responseType:'blob'});
                        const mp3 = new Blob([response.data], { type: 'audio/mp3' });
                        const url = (window.URL.createObjectURL(mp3));
                        console.log(url)
                        //setData(url);
                        //return (Data);
                        //const audio = new Audio(url)
                        //return url
                        //audio.load()
                        //await audio.play()
                        return url
                      } catch (e) {
                        console.log('play audio error: ', e)
                      }
                    };
                    */
                    //axios.get(`http://localhost:5000/files/t${trackId}.mp3`, {responseType:'blob'}
                    //).then((response) => {
                    //  const mp3 = new Blob([response.data], { type: 'audio/mp3' });
                    //  const url = (window.URL.createObjectURL(mp3));
                    //});

                    //const trackURL = `http://localhost:5000/files/t${trackId}.mp3`
                    //console.log("here")
                    //console.log(trackURL)
                    //const mp3 = new Blob([response.data], { type: 'audio/mp3' })
                    //const trackURL = window.URL.createObjectURL(mp3)
                    /*
                                                <ul>
                              <button onClick={() => playAudio(trackId)}>Play Track!</button>
                            </ul
                            <ReactAudioPlayer
                              src={playAudio(trackId)}
                              controls
                            />
                    */
                    //setData(trackURL)
                    //<ReactAudioPlayer
                    //src={trackURL}
                    //controls
                  ///>
                    let metaColor = 'low';

                    return (
                        <div className="track-container" key={String(trackId)}>
                            <h1>{trackName}</h1>
                            <p>
                                <strong>Artist:</strong> {trackArtist}
                            </p>
                            <p>
                                <strong>Genre:</strong> {trackGenre}
                            </p>
                            <p>
                                <strong>Rating:</strong> <span className={metaColor}>{trackRating}</span>
                            </p>
                            <p>
                                <strong>Key:</strong> {trackKey}
                            </p>
                            <ReactAudioPlayer
                              src={trackFilename}
                              controls
                            />
                            
                            
                        </div>
                    );
                })}
            </section>
        )}
    </main>
  </Fragment>);
}

function AddTrack() {
  /*
  return (
    <div className="form-container">
    <h2>Add Track</h2>
    <form method="POST" action="http://127.0.0.1:5000/add-track">
        <div>
            <label>Track Name</label>
            <input type="text" name="trackName" required />
        </div>
        <div>
            <label>Track Artist</label>
            <input type="text" name="trackArtist" required />
        </div>
        <div>
            <label>Image</label>
            <input type="text" name="imgFilename" />
        </div>
        <div>
            <label>Track Genre</label>
            <input type="text" name="trackGenre" required />
        </div>
        <div>
            <label>Filename</label>
            <input type="text" name="trackFilename" required />
        </div>
        <div>
            <label>Track Key</label>
            <input type="text" name="trackKey" required />
        </div>
        <div>
            <SimpleReactFileUpload/>
        </div>
        <div>
            <button type="submit">Add Track</button>
        </div>
    </form>
</div>
  );
  */
  return (
    <SimpleReactFileUpload/>
  );
}

export default App;