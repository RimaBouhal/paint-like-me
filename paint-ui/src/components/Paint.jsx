import * as React from 'react';
import Button from '@mui/material/Button';
import ColorLensIcon from '@mui/icons-material/ColorLens';
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

        } catch (error) {
            console.error('Error during painting operation:', error);
        }
    };

    return (
        <div>
        <Button variant="contained" startIcon={<ColorLensIcon/>} onClick={handlePaint}>
            Paint
        </Button>
        {!painting ? (
                    <Box component="section" sx={{ p: 2, border: '1px dashed grey' }}>
                        Your painting will be displayed here
                    </Box>
                ) : (
                    <div>
                    <img
                        src={`data:image/png;base64,${painting}`}
                        alt="Painting"
                        style={{ maxWidth: '500px', maxHeight: '500px', marginTop: '20px' }}
                    />
                    </div>
                )}
        </div>
    );
}

export default Paint;
