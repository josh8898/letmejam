import React from 'react';
import axios, { post } from 'axios';

class SimpleReactFileUpload extends React.Component {

  constructor(props) {
    super(props);
    this.state ={
      file:null
      //,text:null
    }
    this.onFormSubmit = this.onFormSubmit.bind(this)
    this.onChange = this.onChange.bind(this)
    this.fileUpload = this.fileUpload.bind(this)
  }
  onFormSubmit(e){
    e.preventDefault() // Stop form submit
    this.fileUpload(e).then((response)=>{
      console.log(response.data);
    })
  }
  onChange(e) {
    this.setState({file:e.target.files[0]})
  }
  onTextChange(e) {
      this.setState({})
  }
  fileUpload(event){
    const url = 'https://data.letmejam.com/add-track';
    const formData = new FormData();
    const f = event.target.musicfile.files[0];
    formData.append('file',f);
    //formData.set("data", text);
    formData.append('trackName', event.target.trackName.value)
    formData.append('trackArtist', event.target.trackArtist.value)
    formData.append('trackGenre', event.target.trackGenre.value)
    formData.append('trackKey', event.target.trackKey.value)
    const config = {
        headers: {
            'content-type': 'multipart/form-data'
        }
    }
    return  post(url, formData,config)
  }

  render() {
    return (
    <div className="form-container">
      <form onSubmit={this.onFormSubmit}>
        <h2>Add Track</h2>
        <div>
            <label>Track Name</label>
            <input type="text" name="trackName" required />
        </div>
        <div>
            <label>Track Artist</label>
            <input type="text" name="trackArtist" required />
        </div>
        <div>
            <label>Track Genre</label>
            <input type="text" name="trackGenre" required />
        </div>
        <div>
            <label>Track Key</label>
            <input type="text" name="trackKey" required />
        </div>
        <div>
            <label>Track File Upload</label>
            <input type="file" name = "musicfile" onChange={this.onChange} />
        </div>
        <div>
            <button type="submit">Upload Track</button>
        </div>
      </form>
    </div>
   )
  }
}



export default SimpleReactFileUpload