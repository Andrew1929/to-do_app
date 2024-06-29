import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPen } from '@fortawesome/free-solid-svg-icons';
import "../styles/tasksStyle.css";
import { useTask } from '../hooks/useTask';
import { useState} from 'react';
import { TaskType } from '../Types/taskType';
import { useQuery, useQueryClient } from 'react-query';

export const  Tasks : React.FC = () => {
    const {fetchAppData, updateTaskData, deleteTask} = useTask();
    const [editingTaskName, setEditingTaskName] = useState<string | null>(null);
    const [newTaskDescription, setNewTaskDescription] = useState<string>('');
    const queryClient = useQueryClient();

    const { data: tasks = []} = useQuery<TaskType[]>('tasks', () => fetchAppData('http://localhost:5000/api/tasks'));

    const handleDeleteTask = async (taskName: string) => {
        try {
            await deleteTask(taskName);
            queryClient.setQueryData<TaskType[]>('tasks', (oldTasks = []) =>
                oldTasks.filter(task => task.nameOfGoal !== taskName)
            );
        } catch (e) {
            console.error('Error deleting task:', e);
        }
    };

    const handleEditTask = async (taskName: string) => {
        const task = tasks.find(t => t.nameOfGoal === taskName);
        if (task) {
            setEditingTaskName(taskName);
            setNewTaskDescription(task.descriptionOfGoal);
        }
    };

    const handleSaveChanges = async (taskName: string) => {
        const task = tasks.find(t => t.nameOfGoal === taskName);
        if (!task) return;

        try {
            await updateTaskData(taskName, newTaskDescription, task.statusOfGoal);
            queryClient.setQueryData<TaskType[]>('tasks', (oldTasks = []) =>
                oldTasks.map((t: TaskType) =>
                    t.nameOfGoal === taskName ? { ...t, descriptionOfGoal: newTaskDescription } : t
                )
            );
            setEditingTaskName(null);
        } catch (e) {
            console.error('Error updating task:', e);
        }
    };

    const handleCheckbox = async (taskName: string) => {
        const task = tasks.find(t => t.nameOfGoal === taskName);
        if (!task) return;

        const newStatus = !task.statusOfGoal;
        try {
            await updateTaskData(taskName, task.descriptionOfGoal, newStatus);
            queryClient.setQueryData<TaskType[]>('tasks', (oldTasks = []) =>
                oldTasks.map((t: TaskType) =>
                    t.nameOfGoal === taskName ? { ...t, statusOfGoal: newStatus } : t
                )
            );
        } catch (e) {
            console.error('Error updating task status:', e);
        }
    };

    
    return (
        <div className="task-container">
            {tasks?.map((task) => (
                <div key={task.nameOfGoal} className={`task ${task.statusOfGoal ? 'completed' : ''}`}>
                    <div className="task-content">
                        <input 
                            checked = {task.statusOfGoal}
                            onChange={() => handleCheckbox(task.nameOfGoal)}
                            className="checkbox" 
                            type="checkbox" 
                            name="" 
                            id="cb"
                        />

                        {editingTaskName === task.nameOfGoal ? (
                            <input
                                type="text"
                                value={newTaskDescription}
                                onChange={(e) => setNewTaskDescription(e.target.value)}
                                onBlur={() => handleSaveChanges(task.nameOfGoal)}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') handleSaveChanges(task.nameOfGoal);
                                }}
                                className="editField"
                            />
                        ) : (
                            <p className={`task-description ${task.statusOfGoal ? 'completed' : ''}`}>
                                {task.descriptionOfGoal}
                            </p>
                        )}
                    </div>
    
                    <div className="task-btns-container">
                        <button className='task-btn' onClick={() => handleEditTask(task.nameOfGoal)}>
                            <FontAwesomeIcon className="task-icons" icon={faPen} />
                        </button>

                        <button className='task-btn' onClick={() => handleDeleteTask(task.nameOfGoal)}>
                            <FontAwesomeIcon className="task-icons" icon={faTrash} />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    )
} 