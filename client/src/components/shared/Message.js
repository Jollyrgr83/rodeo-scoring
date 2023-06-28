import "./Message.css";
const Message = props => {
    const cls = props.state ? "show-modal" : "hide-modal";
    const closeModalHandler = () => props.closeModal();
    return (
        <div>
            <div id={"message-modal-blur"} className={cls} onClick={closeModalHandler}></div>
            <div id={"message-modal"} className={cls}>
                <p id={"message-modal-text"}>{props.text}</p>
            </div>
        </div>
    );
}
export default Message;