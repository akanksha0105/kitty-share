import React, { useState } from "react";
import "../styles/Header.css";
import { Link } from "react-router-dom";
import { Avatar } from "@material-ui/core";

function Header() {
	const [linkClicked, setLinkClicked] = useState(false);
	console.log(linkClicked);
	return (
		<div className="header">
			<div className="header__left">
				<Link
					className={
						linkClicked ? "header__link__left clicked" : "header__link__left"
					}
					to={!linkClicked ? "/linktoanewdevice" : "/"}>
					<div
						onClick={(e) => setLinkClicked(!linkClicked)}
						className="header__left__option">
						Add Device
					</div>
				</Link>
			</div>

			<Link className="header__link" to="/">
				<div className="logo">kittyshare</div>
			</Link>

			<div className="header__right">
				<div>
					<Avatar
						alt="Remy Sharp"
						src={`https://avatars.dicebear.com/api/human/123.svg`}
					/>{" "}
				</div>{" "}
				<div> Device Name </div>
			</div>
		</div>
	);
}

export default Header;
