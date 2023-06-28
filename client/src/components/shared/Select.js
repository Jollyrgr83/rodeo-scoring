import "./util.css";
const Select = props => {
    return (
        <select id={props.id} className={props.className} onChange={props.onChange} defaultValue={props.setValue}>{props.children}</select>
    );
}
export default Select;