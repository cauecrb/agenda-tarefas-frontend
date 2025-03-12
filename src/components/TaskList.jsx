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
  Paper,
  IconButton
} from '@mui/material';
import { Star, StarBorder, Edit, Delete } from '@mui/icons-material';
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

  const toggleFavorite = async (task) => {
    try {
      const updatedTask = await api.put(`/tasks/${task.id}`, {
        ...task,
        is_favorite: !task.is_favorite
      });
      setTasks(prev => prev.map(t => 
        t.id === task.id ? updatedTask.data.data : t
      ));
    } catch (error) {
      console.error('Erro ao atualizar favorito:', error);
    }
  };

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
              <Paper elevation={3} sx={{ 
                borderRadius: 2,
                transition: 'transform 0.2s',
                '&:hover': { transform: 'scale(1.02)' }
              }}>
                <Card sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  backgroundColor: task.color || '#e3f2fd',
                  position: 'relative',
                  border: `2px solid ${task.color ? `${task.color}80` : '#64b5f6'}`
                }}>
                  <Box sx={{ 
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    zIndex: 1
                  }}>
                    <IconButton onClick={() => toggleFavorite(task)}>
                      {task.is_favorite ? (
                        <Star sx={{ color: '#ffd700' }} />
                      ) : (
                        <StarBorder sx={{ color: '#616161' }} />
                      )}
                    </IconButton>
                  </Box>

                  <CardContent>
                    <Box mb={2}>
                      <Typography variant="h6" sx={{ 
                        fontWeight: 'bold',
                        color: '#212121',
                        minHeight: '64px'
                      }}>
                        {task.title}
                      </Typography>
                    </Box>

                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: '#424242',
                        minHeight: '80px',
                        mb: 2
                      }}
                    >
                      {task.description || 'Sem descrição'}
                    </Typography>

                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Box>
                        <Typography variant="caption" sx={{ color: '#616161' }}>
                          Prazo:
                        </Typography>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            fontWeight: 500,
                            color: '#212121'
                          }}
                        >
                          {format(parseISO(task.due_date), 'dd/MM/yyyy HH:mm')}
                        </Typography>
                      </Box>
                      
                      <Chip 
                        label={task.completed ? 'Concluída' : 'Pendente'} 
                        size="small"
                        sx={{ 
                          backgroundColor: task.completed ? '#81c784' : '#ffb74d',
                          color: 'white',
                          fontWeight: 'bold'
                        }}
                      />
                    </Box>
                  </CardContent>

                  <CardActions sx={{ 
                    justifyContent: 'flex-end',
                    padding: 2,
                    borderTop: `1px solid ${task.color ? `${task.color}50` : '#64b5f650'}`
                  }}>
                    <Button
                      startIcon={<Edit />}
                      component={Link}
                      to={`/edit/${task.id}`}
                      variant="outlined"
                      sx={{ 
                        color: '#616161',
                        borderColor: '#e0e0e0',
                        '&:hover': {
                          borderColor: '#bdbdbd'
                        }
                      }}
                    >
                      Editar
                    </Button>
                    <Button
                      startIcon={<Delete />}
                      variant="outlined"
                      color="error"
                      onClick={() => handleDelete(task.id)}
                      sx={{ ml: 1 }}
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