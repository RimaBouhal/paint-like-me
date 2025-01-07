import * as React from 'react';
import './BrushSettings.css'
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

export default function BrushSettings() {
  const [value, setValue] = React.useState([2, 8]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box>
        <Box>
            <div className='slider-settings'>
                <div className='settings-label'>
                    <Typography id="transition-modal-title">
                        Brushstroke Length
                    </Typography>
                    {/* <Typography id="non-linear-slider" gutterBottom> Min: {value[0]} , Max: {value[1]}</Typography> */}
                </div>
                <Slider
                    step={1} marks
                    value={value}
                    onChange={handleChange}
                    valueLabelDisplay="auto"
                    min={0}
                    max={20}
                />
            </div>
            <div className='slider-settings'>
                <div>
                    <Typography id="transition-modal-title">
                        Blur Filter
                    </Typography>
                </div>
                <Slider
                    defaultValue={5}
                    valueLabelDisplay="auto"
                    step={5}
                    marks
                    min={0}
                    max={25}
                />
            </div>
        </Box>
        <div className='modal-buttons'>
            <Button variant="contained" sx={{borderRadius:50, my:'10px', mx:1}}>
                Save Changes
            </Button>
            <Button variant="outlined" sx={{borderRadius:50, my:'10px', mx:1}}>
                Delete PaintBrush
            </Button>
        </div>
    </Box>
  );
}
