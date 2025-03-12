import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import { TextField, Button, Checkbox, FormControlLabel, Container } from '@mui/material';

const TaskForm = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        due_date: '',
        completed: false
    });
    const navigate = useNavigate();
    const { id } = useParams();

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
                <Button type="submit" variant="contained" color="primary">
                    Salvar
                </Button>
            </form>
        </Container>
    );
};

export default TaskForm;