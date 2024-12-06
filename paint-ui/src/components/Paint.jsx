import * as React from 'react';
import Button from '@mui/material/Button';
import ColorLensIcon from '@mui/icons-material/ColorLens';

function Paint() {
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
            console.log('Painting result:', result);

        } catch (error) {
            console.error('Error during painting operation:', error);
        }
    };

    return (
        <Button variant="contained" startIcon={<ColorLensIcon/>} onClick={handlePaint}>
            Paint
        </Button>
    );
}

export default Paint;
