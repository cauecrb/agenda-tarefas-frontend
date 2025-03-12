import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';

const TaskList = () => {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        const response = await api.get('/tasks');
        setTasks(response.data.data);
    };

    const deleteTask = async (id) => {
        await api.delete(`/tasks/${id}`);
        fetchTasks();
    };

    return (
        <div>
            <h1>Lista de Tarefas</h1>
            <Button component={Link} to="/new" variant="contained" color="primary">
                Nova Tarefa
            </Button>
            
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Título</TableCell>
                            <TableCell>Data</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Ações</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {tasks?.length > 0 ? (
                        tasks.map((task) => (
                            <TableRow key={task.id}>
                                <TableCell>{task.title}</TableCell>
                                <TableCell>{new Date(task.due_date).toLocaleDateString()}</TableCell>
                                <TableCell>{task.completed ? 'Concluída' : 'Pendente'}</TableCell>
                                <TableCell>
                                    <Button component={Link} to={`/edit/${task.id}`} color="primary">
                                        Editar
                                    </Button>
                                    <Button onClick={() => deleteTask(task.id)} color="error">
                                        Excluir
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={4}>Nenhuma tarefa encontrada</TableCell>
                        </TableRow>
                    )}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default TaskList;