import { TodoAppHeader } from "./todoAppHeader";
import { TaskContainer } from "./taskContiner";
import { DeleteTaskBtn } from "./deleteTasksBtn";
import '../styles/appContainer.css';

export const AppContainer : React.FC = () => {
    return (
        <div className="app-container">
            <TodoAppHeader/>

            <TaskContainer/>

            <div className="btn-container">
                <DeleteTaskBtn/>
            </div>
        </div>
    )
} 