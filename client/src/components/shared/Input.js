import "./util.css";

const Input = props => {
    const cls = props.className ? props.className + " ctr-x" : "ctr-x";
    if (props.label) {
        return (
            <div>
                <label>{props.label}</label>
                <input id={props.id} className={cls} type={props.type} placeholder={props.placeholder} value={props.value} onChange={props.onChange} readOnly={props.readOnly}/>
            </div>
        );
    } else {
        return (
            <input id={props.id} className={cls} type={props.type} placeholder={props.placeholder} value={props.value} onChange={props.onChange} readOnly={props.readOnly}/>
        );
    }
}
export default Input;