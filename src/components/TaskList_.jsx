import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Button, 
  CircularProgress,
  Typography,
  Box
} from '@mui/material';
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

      <TableContainer component={Paper} elevation={3}>
        <Table sx={{ minWidth: 650 }} aria-label="lista de tarefas">
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Título</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Descrição</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Data Limite</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }} align="center">Ações</TableCell>
            </TableRow>
          </TableHead>
          
          <TableBody>
            {tasks?.length > 0 ? (
              tasks.map((task) => (
                <TableRow 
                  key={task.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell>{task.title}</TableCell>
                  <TableCell sx={{ maxWidth: '300px' }}>
                    {task.description || 'Sem descrição'}
                  </TableCell>
                  <TableCell>
                    {new Date(task.due_date).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </TableCell>
                  <TableCell>
                    <Typography 
                      color={task.completed ? 'success.main' : 'warning.main'}
                      sx={{ fontWeight: 500 }}
                    >
                      {task.completed ? 'Concluída' : 'Pendente'}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Button 
                      component={Link} 
                      to={`/edit/${task.id}`} 
                      variant="outlined" 
                      color="primary"
                      sx={{ mr: 1 }}
                    >
                      Editar
                    </Button>
                    <Button 
                      variant="outlined" 
                      color="error"
                      onClick={() => handleDelete(task.id)}
                    >
                      Excluir
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Typography variant="body1" color="textSecondary">
                    Nenhuma tarefa cadastrada
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default TaskList;