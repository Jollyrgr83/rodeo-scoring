import Line from "../shared/Line";
import Logo from "./Logo";
import Title from "./Title";

const Header = ({title}) => {
    return (
        <header>
            <Line type={"full"}/>
            <Logo />
            <Line type={"full"}/>
            <Title title={title}/>
            <Line type={"full"}/>
        </header>
    );
}
export default Header;