import React from 'react';
import { SketchPicker } from 'react-color';
import { Popover, Button } from '@mui/material';

const ColorPicker = ({ color, onChange }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  return (
    <div>
      <Button
        variant="contained"
        onClick={(e) => setAnchorEl(e.currentTarget)}
        sx={{
          width: 40,
          height: 40,
          minWidth: 0,
          padding: 0,
          backgroundColor: color,
          '&:hover': { backgroundColor: color }
        }}
      />
      
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
      >
        <SketchPicker
          color={color}
          onChangeComplete={(color) => onChange(color.hex)}
        />
      </Popover>
    </div>
  );
};

export default ColorPicker;