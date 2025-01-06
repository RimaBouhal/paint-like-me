import { React, useState } from 'react';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import SettingsModal from './SettingsModal';

function PaintBrushes() {
    const [selectedValue, setSelectedValue] = useState('Pointillism');

    const handleChange = async (value) => {
        setSelectedValue(value);

        try {
            const response = await fetch('/select-brush', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ brushType: value }),
            });

            if (!response.ok) {
                console.error('Failed to update brush type.');
            }
        } catch (error) {
            console.error('Error updating brush type:', error);
        }
    };

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
            <Box
                sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: '10px',
                    boxShadow: 3,
            }}>
                <form>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Chip
                            label="Pointillism"
                            clickable
                            color={selectedValue === 'Pointillism' ? 'primary' : 'default'}
                            variant={selectedValue === 'Pointillism' ? 'filled' : 'outlined'}
                            onClick={() => handleChange('Pointillism')}
                        />
                        <Chip
                            label="Impressionism"
                            clickable
                            color={selectedValue === 'Impressionism' ? 'primary' : 'default'}
                            variant={selectedValue === 'Impressionism' ? 'filled' : 'outlined'}
                            onClick={() => handleChange('Impressionism')}
                        />
                        <Chip
                            label="Expressionism"
                            clickable
                            color={selectedValue === 'Expressionism' ? 'primary' : 'default'}
                            variant={selectedValue === 'Expressionism' ? 'filled' : 'outlined'}
                            onClick={() => handleChange('Expressionism')}
                        />
                    </Box>
                </form>
                <Divider orientation="vertical" flexItem sx={{ borderRightWidth: 2, marginX: 2}} />
                <SettingsModal></SettingsModal>
            </Box>
        </div>
    );
}

export default PaintBrushes;