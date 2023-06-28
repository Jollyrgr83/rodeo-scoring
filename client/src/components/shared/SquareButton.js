import "./util.css";
import "./SquareButton.css";
const SquareButton = props => {
    const lib = {
        className: props.type === "delete" ? "square-button red ctr-x" : "square-button blue ctr-x",
        xmlns: "http://www.w3.org/2000/svg",
        width: "24",
        height: "24",
        fill: "currentColor",
        viewBox: "0 0 16 16"
    };
    switch (props.type) {
        case "add":
            return (
                <div id={props.id} className={lib.className} onClick={props.onClick}>
                    <svg xmlns={lib.xmlns} width={lib.width} height={lib.height} fill={lib.fill} viewBox={lib.viewBox}>
                        <path fillRule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z"/>
                    </svg>
                </div>
            );
        case "update":
            return (
                <div id={props.id} className={lib.className} onClick={props.onClick}>
                    <svg xmlns={lib.xmlns} width={lib.width} height={lib.height} fill={lib.fill} viewBox={lib.viewBox}>
                        <path fillRule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/>
                        <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/>
                    </svg>
                </div>
            );
        case "delete":
        default:
            return (
                <div id={props.id} className={lib.className} onClick={props.onClick}>
                    <svg xmlns={lib.xmlns} width={lib.width} height={lib.height} fill={lib.fill} viewBox={lib.viewBox}>
                        <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
                    </svg>
                </div>
            );
    }
}
export default SquareButton;