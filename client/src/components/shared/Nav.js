import {Link} from "react-router-dom";
import "./util.css";
import "./Nav.css";
import NavButton from "./NavButton";
const Nav = () => {
    const navButtons = [{type: "home", link: "/"}, {type: "view", link: "/view/"}, {type: "year", link: "/year/"}, {type: "competitor", link: "/competitor/"}, {type: "score", link: "/score/"}, {type: "report", link: "/report/"}];
    return (
        <nav className="grid-six grid-ctr-x grid-ctr-y ctr-x ctr-text">{
            navButtons.map(btn => {
                return <Link key={"link-" + btn.type} to={btn.link}><NavButton key={"nav-" + btn.type} type={btn.type}/></Link>
            })
        }
        </nav>
    )
}

export default Nav;