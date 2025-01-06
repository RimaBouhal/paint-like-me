import * as React from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

export default function BrushSettings() {
  const [value, setValue] = React.useState([20, 37]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '60%' }}>
        <div>
            <Typography id="transition-modal-title">
                Brushstroke Length
            </Typography>
            <Typography id="non-linear-slider" gutterBottom> Min: {value[0]} , Max: {value[1]}</Typography>
        </div>
        <Slider
            step={1} marks
            getAriaLabel={() => 'Temperature range'}
            value={value}
            onChange={handleChange}
            valueLabelDisplay="auto"
            min={0}
            max={20}
        />
        <div>
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
