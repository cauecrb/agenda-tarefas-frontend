import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  CircularProgress,
  Box,
  Paper
} from '@mui/material';
import { format, parseISO } from 'date-fns';
import api from '../services/api';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await api.get('/tasks');
        setTasks(response.data.data || []);
      } catch (err) {
        setError('Erro ao carregar tarefas. Tente novamente mais tarde.');
        console.error('API Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      setTasks(prev => prev.filter(task => task.id !== id));
    } catch (err) {
      console.error('Erro ao excluir tarefa:', err);
      alert('Não foi possível excluir a tarefa');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box mt={4} textAlign="center">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <Box display="flex" justifyContent="space-between" mb={3}>
        <Typography variant="h4">Lista de Tarefas</Typography>
        <Button 
          component={Link} 
          to="/new" 
          variant="contained" 
          color="primary"
          sx={{ minWidth: '150px' }}
        >
          Nova Tarefa
        </Button>
      </Box>

      <Grid container spacing={3}>
        {tasks?.length > 0 ? (
          tasks.map((task) => (
            <Grid item xs={12} sm={6} md={4} key={task.id}>
              <Paper elevation={3} sx={{ borderRadius: 2 }}>
                <Card sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" mb={2}>
                      <Typography variant="h6" component="div">
                        {task.title}
                      </Typography>
                      <Chip 
                        label={task.completed ? 'Concluída' : 'Pendente'} 
                        color={task.completed ? 'success' : 'warning'}
                        size="small"
                      />
                    </Box>

                    <Typography variant="body2" color="text.secondary" mb={2}>
                      {task.description || 'Sem descrição'}
                    </Typography>

                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography variant="caption" color="text.secondary">
                        Prazo:
                      </Typography>
                      <Typography variant="body2" fontWeight="500">
                        {format(parseISO(task.due_date), 'dd/MM/yyyy HH:mm')}
                      </Typography>
                    </Box>
                  </CardContent>

                  <CardActions sx={{ justifyContent: 'flex-end', padding: 2 }}>
                    <Button 
                      size="small" 
                      component={Link} 
                      to={`/edit/${task.id}`}
                      variant="outlined"
                    >
                      Editar
                    </Button>
                    <Button 
                      size="small" 
                      color="error"
                      variant="outlined"
                      onClick={() => handleDelete(task.id)}
                    >
                      Excluir
                    </Button>
                  </CardActions>
                </Card>
              </Paper>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Box p={3} textAlign="center">
              <Typography variant="body1" color="textSecondary">
                Nenhuma tarefa cadastrada
              </Typography>
            </Box>
          </Grid>
        )}
      </Grid>
    </div>
  );
};

export default TaskList;