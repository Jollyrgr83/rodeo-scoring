import "../shared/util.css";
import "./LoadingAnimation.css";
const LoadingAnimation = props => {
    const cls = props.state ? "show-block" : "hide";
    return (
        <div>
            <div id={"loadingAnimationContainer"} className={cls}></div>
            <div id={"loadingAnimation"} className={cls}></div>
        </div>
    );
}
export default LoadingAnimation;