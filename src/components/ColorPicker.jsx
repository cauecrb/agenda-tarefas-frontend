import React from 'react';
import { CirclePicker } from 'react-color';
import { Popover, Button } from '@mui/material';

const ColorPicker = ({ color, onChange, compact }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const presetColors = [
    '#e3f2fd', // Azul claro
    '#fce4ec', // Rosa
    '#f0f4c3', // Verde claro
    '#ffebee', // Vermelho claro
    '#e8f5e9', // Verde
    '#fff3e0', // Laranja
    '#f3e5f5'  // Roxo
  ];

  return (
    <div>
      <Button
        variant="contained"
        onClick={(e) => setAnchorEl(e.currentTarget)}
        sx={{
          width: compact ? 30 : 40,
          height: compact ? 30 : 40,
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
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <CirclePicker
          color={color}
          colors={presetColors}
          onChangeComplete={(color) => {
            onChange(color.hex);
            setAnchorEl(null);
          }}
        />
      </Popover>
    </div>
  );
};

export default ColorPicker;