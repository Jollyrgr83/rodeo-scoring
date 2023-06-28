import "../../shared/util.css";

import Warning from "./Warning";
import Subtitle from "../../shared/Subtitle";
import Line from "../../shared/Line";
import ViewItemRow from "./ViewItemRow";
const ViewEditContainer = props => {
    const editHandler = data => {
        data.type = props.type;
        props.updateItemHandler(data);
    }
    if (props.items && props.items.length !== 0) {
        return (
            <div className="ctr-x ctr-text">
                <Warning />
                <Subtitle text={props.type.charAt(0).toUpperCase() + props.type.slice(1)} />
                <Line type={"large"} />
                {props.items.map(item => {
                    return <ViewItemRow key={item._id} id={item._id} value={item.name} editHandler={editHandler} />
                })}
            </div>
        );
    }
    return (
        <div className={"ctr-x ctr-text"}>
            <Subtitle text={"No items"}/>
            <Line type={"large"}/>
        </div>
    );
}
export default ViewEditContainer;