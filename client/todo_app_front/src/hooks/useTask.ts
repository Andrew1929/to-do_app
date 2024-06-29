import { useState, useCallback } from "react";
import { TaskType } from "../Types/taskType";


export  const useTask = () => {
    const [error, setError]  = useState<string | null>(null) ;

    const fetchAppData = useCallback(async (URL: string, method: string = 'GET', body : any= null, headers: Record<string, string> = {}) => {
        try {
            if(body){
                body = JSON.stringify(body)
                headers['Content-Type'] = 'application/json'
            };

            const appResponse = await fetch (URL, {method, body, headers});
            const contentType = appResponse.headers.get('content-type');

            if (!contentType || !contentType.includes('application/json')) {
                throw new Error('Invalid server response');
            };
            
            const data = await appResponse.json();

            if(!appResponse.ok) {
                throw new Error(data.message || 'Something go wrong');
            }

            return data;
        } catch(e) {
            setError(e instanceof Error ? e.message : String(e));
        }
    },[setError]);

    const addTask = useCallback(async (task: TaskType) => {
        try {
            await fetchAppData('http://localhost:5000/api/tasks','POST' ,task);
        } catch (e) {
            console.log(e);
            setError(e instanceof Error ? e.message : String(e));
        }
    },[ setError, fetchAppData])

    const deleteAllAppData = useCallback(async () => {
        try{
            await fetchAppData('http://localhost:5000/api/tasks','DELETE');
        } catch (e) {
            console.log(e);
            setError(e instanceof Error ? e.message : String(e));
        }
    },[fetchAppData, setError]);

    const deleteTask = useCallback(async (taskName: string) => {
        try {
            await fetchAppData(`http://localhost:5000/api/tasks/${taskName}`, 'DELETE');
        } catch (e) {
            console.log(e);
            setError(e instanceof Error ? e.message : String(e));
        }
    }, [fetchAppData, setError]);

    const updateTaskData = useCallback(async(taskName : string, taskDescription : string, taskStatus : boolean ) => {
        try{
            await fetchAppData(`http://localhost:5000/api/tasks/${taskName}`,'PATCH' , {descriptionOfGoal: taskDescription, statusOfGoal: taskStatus});
        } catch (e) {
            console.log(e);
            setError(e instanceof Error ? e.message : String(e));
        }
    },[fetchAppData, setError]);

    return {fetchAppData, addTask, deleteAllAppData, deleteTask, updateTaskData, error}
}
 