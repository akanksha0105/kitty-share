import React from "react";
import "../styles/Header.css";
import { Link } from "react-router-dom";
import { Avatar } from "@material-ui/core";

function Header() {
	return (
		<div className="header">
			<div className="header__left">
				<Link to="/text">
					<div className="header__left__option">Dashboard </div>
				</Link>

				{/* <Link to="/sendtoconnections">
					<div className="header__left__option"> Connections</div>
				</Link> */}

				<Link to="linktoanewdevice">
					<div className="header__left__option"> Add Device</div>
				</Link>
				<Link to="/code">
					<div className="header__left__option"> Input Key</div>
				</Link>
			</div>

			<div className="logo">kittyshare</div>
			<div className="header__right">
				<div>
					<Avatar
						alt="Remy Sharp"
						src={`https://avatars.dicebear.com/api/human/123.svg`}
					/>{" "}
				</div>{" "}
				<div> Device Name </div>
				<div> Notifications</div>
				{/* <div>Settings</div> */}
			</div>
		</div>
	);
}

export default Header;
