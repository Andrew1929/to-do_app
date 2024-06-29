import { Tasks } from "./tasks";
import '../styles/taskContainerStyle.css'

export const TaskContainer : React.FC = () => {
    return (
        <div className="tasks-container">
            <div className="tasks">
                <Tasks/>
            </div>
        </div>
    )
}