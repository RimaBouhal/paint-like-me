import React from "react";
// import Button from '@mui/material/Button';

class FileUpload extends React.Component {

    constructor(props) {
        super(props);
    
        this.state = {
          imageURL: '',
        };
    
        this.handleUploadImage = this.handleUploadImage.bind(this);
    }

    handleUploadImage(ev) {
      ev.preventDefault();
  
      const data = new FormData();
      data.append('file', this.uploadInput.files[0]);
  
      fetch('http://127.0.0.1:3000/upload', {
          method: 'POST',
          body: data,
      })
      .then((response) => response.json())
      .then((body) => {
          this.setState({ imageURL: body.image_url });
      })
      .catch((error) => {
          console.error('Error uploading image:', error);
      });
    }

    render() {
        return (
            <form onSubmit={this.handleUploadImage}>
                <div>
                    <input ref={(ref) => { this.uploadInput = ref; }} type="file" />                    
                </div>
                <div><button variant="contained">Upload</button></div>
                {this.state.imageURL && (
                    <div>
                        <h3>Uploaded Image:</h3>
                        <img src={this.state.imageURL} alt="Uploaded" style={{ maxWidth: '300px', maxHeight: '300px' }} />
                    </div>
                )}
            </form>
      );
    }
}

export default FileUpload;