import React from "react";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';

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
  
      fetch('http://localhost:3000/upload', {
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
            <div> 
                <div>
                <Button
                    component="label"
                    role={undefined}
                    variant="contained"
                    tabIndex={-1}
                    startIcon={<DriveFolderUploadIcon/>}
                    >
                    Upload Image
                    <input
                        type="file"
                        ref={(ref) => { this.uploadInput = ref; }}
                        onChange={this.handleUploadImage}
                        style={{ display: "none" }}
                    />
                    </Button>
                </div>
                {!this.state.imageURL ? (
                    <Box component="section" sx={{ p: 2, border: '1px dashed grey' }}>
                        Upload an image to get started!
                    </Box>
                ) : (
                    <div>
                        <img
                            src={this.state.imageURL}
                            alt="Uploaded"
                            style={{ maxWidth: '500px', maxHeight: '500px', marginTop: '20px' }}
                        />
                    </div>
                )}
            </div>
      );
    }
}

export default FileUpload;