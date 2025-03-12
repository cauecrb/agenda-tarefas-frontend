import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import ColorPicker from '../components/ColorPicker';
import { 
    TextField, 
    Button, 
    Checkbox, 
    Typography, 
    FormControlLabel, 
    Container, 
    Box 
} from '@mui/material';

const TaskForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    due_date: '',
    completed: false,
    is_favorite: false,
    color: '#e3f2fd'
  });

    useEffect(() => {
        if (id) {
            fetchTask();
        }
    }, [id]);

    const fetchTask = async () => {
        const response = await api.get(`/tasks/${id}`);
        setFormData(response.data.data);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (id) {
                await api.put(`/tasks/${id}`, formData);
            } else {
                await api.post('/tasks', formData);
            }
            navigate('/');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Container maxWidth="sm">
            <h1>{id ? 'Editar Tarefa' : 'Nova Tarefa'}</h1>
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Título"
                    fullWidth
                    margin="normal"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                />
                <TextField
                    label="Descrição"
                    fullWidth
                    multiline
                    rows={4}
                    margin="normal"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
                <TextField
                    label="Data Limite"
                    type="datetime-local"
                    fullWidth
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                    value={formData.due_date}
                    onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                    required
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={formData.completed}
                            onChange={(e) => setFormData({ ...formData, completed: e.target.checked })}
                        />
                    }
                    label="Concluída"
                />

                <FormControlLabel
                control={
                    <Checkbox
                    checked={formData.is_favorite}
                    onChange={(e) => setFormData({...formData, is_favorite: e.target.checked})}
                    />
                }
                label="Favorita"
                />

                <Box mt={2}>
                <Typography variant="body2">Cor da Tarefa:</Typography>
                <ColorPicker
                    color={formData.color}
                    onChange={(newColor) => setFormData({...formData, color: newColor})}
                />
                </Box>

                <Button type="submit" variant="contained" color="primary">
                    Salvar
                </Button>
            </form>
        </Container>
    );
};

export default TaskForm;