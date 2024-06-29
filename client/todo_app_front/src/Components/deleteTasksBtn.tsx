import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash} from '@fortawesome/free-solid-svg-icons';
import { useTask } from '../hooks/useTask';
import { useQueryClient } from 'react-query'; 
import '../styles/deleteTasksBtnStyle.css';

export const DeleteTaskBtn : React.FC = () => {
    const { deleteAllAppData } = useTask();
    const queryClient = useQueryClient();

    const handleDeleteTaskBtn = async () => {
        try {
            await deleteAllAppData();
            queryClient.setQueryData('tasks', []);
        } catch (e) {
            console.error('Error deleting tasks:', e);
        }
    };

    return (
        <button className="delete-tasks-btn" onClick={handleDeleteTaskBtn}>
            <FontAwesomeIcon className="delete-task-btn-icon" icon={faTrash} />
            <p>Clear all tasks</p>
        </button>
    );
}