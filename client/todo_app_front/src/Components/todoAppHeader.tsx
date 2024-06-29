import { useState, ChangeEvent } from 'react';
import { useTask } from '../hooks/useTask';
import { TaskType } from '../Types/taskType';
import { useQueryClient } from 'react-query';
import '../styles/appHeaderStyle.css';

export const TodoAppHeader : React.FC = () => {
    const { addTask } = useTask();
    const [inputField, setInputField] = useState<string>('');

    const queryClient = useQueryClient();

    const handleAddTask = async () => {
        if (inputField.trim() === '') {
            return;
        }

        try {
            const currentTasksData = queryClient.getQueryData<TaskType[]>('tasks') || [];
            const timestamp = Date.now();
            const newTaskName = `Task-${timestamp}`;

            await addTask({
                nameOfGoal: newTaskName,
                descriptionOfGoal: inputField,
                statusOfGoal: false,
            });

            setInputField('');

            queryClient.setQueryData('tasks', [...currentTasksData, {
                nameOfGoal: newTaskName,
                descriptionOfGoal: inputField,
                statusOfGoal: false,
            }]);

        } catch (error) {
            console.error('Add task error:', error);
        }
    };

    const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
        setInputField(e.target.value);
    };

    return (
        <header className="app-header">
            <input
                value={inputField}
                className="input-field"
                type="text"
                placeholder="Type here to add task..."
                onChange={handleInput}
            />
            <button className="input-field-btn" onClick={handleAddTask}>
                + Add
            </button>
        </header>
    );
}