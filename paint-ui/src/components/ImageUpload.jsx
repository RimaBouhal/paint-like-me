import './ImageUpload.css';
import React from "react";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
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
        this.setState({ error: null });

        const file = this.uploadInput.files[0];
        const maxSize = 1 * 1024 * 1024; // 1MB in bytes
        
        if (file.size > maxSize) {
            this.setState({ error: "File size exceeds the 1MB limit." });
            return;
        }
  
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
                    sx={{borderRadius:50, my:'10px'}}
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
                {this.state.error && (
                    <Alert severity="error" style={{ color: 'red', my:2}}>{this.state.error}</Alert>
                )}
                <div className="image-box">
                {!this.state.imageURL ? (
                    <Box component="section">
                        Upload an image to get started!
                    </Box>
                ) : (
                    <div>
                        <img
                            className='image'
                            src={this.state.imageURL}
                            alt="Uploaded"
                        />
                    </div>
                )}
                </div>
            </div>
      );
    }
}

export default FileUpload;