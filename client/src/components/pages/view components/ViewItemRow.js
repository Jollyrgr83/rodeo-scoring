import {useState} from "react";

import "../../shared/util.css";

import Input from "../../shared/Input";
import SquareButton from "../../shared/SquareButton";

const ViewItemRow = props => {
    const [inputValue, setInputValue] = useState(props.value);
    const inputTextHandler = e => setInputValue(e.target.value);
    const updateBtnHandler = () => {
        props.editHandler({action: "update", value: inputValue, id: props.id});
    }
    const deleteBtnHandler = () => {
        props.editHandler({action: "delete", value: inputValue, id: props.id});
    }
    return (
        <div className={"ctr-x ctr-text row-container"}>
            <Input id={props.id} className={"half ctr-x"} type={"text"} value={inputValue} onChange={inputTextHandler}/>
            <SquareButton type={"update"} onClick={updateBtnHandler} />
            <SquareButton type={"delete"} onClick={deleteBtnHandler} />
        </div>
    );
}
export default ViewItemRow;