import "../../shared/util.css";
import Input from "../../shared/Input";
import SquareButton from "../../shared/SquareButton";
const YearItemRow = props => {
    const deleteHandler = () => {
        props.deleteItemHandler({id: props.itemId});
    }
    return (
        <div className={"ctr-x ctr-text row-container"}>
            <Input className={"large"} type={"text"} id={props.id} value={props.value} readOnly={true} />
            <SquareButton type={"delete"} onClick={deleteHandler} />
        </div>
    );
}
export default YearItemRow;