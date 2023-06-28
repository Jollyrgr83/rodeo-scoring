import "../../shared/util.css";
import "./Warning.css";
const Warning = () => {
    return (
        <div className="warning ctr-x ctr-text">
            <p>WARNING!</p>
            <p>Deleting an item will also remove all records associated with that item.</p>
        </div>
    );
}
export default Warning;