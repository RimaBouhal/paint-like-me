import './ImageUpload.css';
import * as React from 'react';
import Button from '@mui/material/Button';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import DownloadIcon from '@mui/icons-material/Download';
import Box from '@mui/material/Box';

function Paint() {
    const [painting, setPainting] = React.useState(null);

    const handlePaint = async () => {
        try {
            const brushResponse = await fetch('/select-brush', {
                method: 'GET',
            });

            if (!brushResponse.ok) {
                throw new Error('Failed to fetch brush data');
            }

            const brushData = await brushResponse.json();

            const paintResponse = await fetch('/paint', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ brushData }),
            });

            if (!paintResponse.ok) {
                throw new Error('Failed to perform painting operation');
            }

            const result = await paintResponse.json();
            setPainting(result.painting);
            painting = result.paainting;

        } catch (error) {
            console.error('Error during painting operation:', error);
        }
    };

    const downloadPainting = async() => {
        // TODO
    }

    return (
        <div>
            <div>
                <Button variant="contained" startIcon={<ColorLensIcon/>} onClick={handlePaint} sx={{borderRadius:50, my:'10px'}}>
                    Paint
                </Button>
                <Button variant="contained" startIcon={<DownloadIcon/>} onClick={downloadPainting} sx={{borderRadius:50, my:'10px', mx:1}}>
                    Download Painting
                </Button>
            </div>
            <div className="image-box">
            {!painting ? (
                        <Box component="section">
                            Your painting will be displayed here
                        </Box>
                    ) : (
                        <div>
                        <img
                            className='image'
                            src={`data:image/png;base64,${painting}`}
                            alt="Painting"
                        />
                        </div>
                    )}
            </div>
        </div>
    );
}

export default Paint;
