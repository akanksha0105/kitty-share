import React, { useState } from "react";
import "../styles/Demo.css";
import Video1 from "../videos/video1.mov";
import Video2 from "../videos/video2.mp4";

function Demo() {
	const [displayVideo1, setDisplayVideo1] = useState(true);
	const [displayVideo2, setDisplayVideo2] = useState(false);

	const onDisplayVideoOne = () => {
		setDisplayVideo1(true);
		setDisplayVideo2(false);
		console.log("clicked video 1");
	};

	const onDisplayVideoTwo = () => {
		setDisplayVideo1(false);
		setDisplayVideo2(true);
		console.log("clicked video 2");
	};
	return (
		<div className="demo__screen">
			<div className="demo">
				<div className="about">
					kittyshare allows a user to transmit
					<br />
					URL seamlessly across the devices
				</div>
				<div className="videos__display">
					<video
						className={
							displayVideo1 ? "video__option" : "video__option__display__none"
						}
						src={Video1}
						type="video/mp4"
						// poster = ""
						controls></video>
					<video
						className={
							displayVideo2 ? "video__option" : "video__option__display__none"
						}
						src={Video2}
						type="video/mp4"
						// poster = ""
						controls></video>
				</div>
				<div className="video__changing__buttons">
					<button
						className={displayVideo1 ? "display__video__one" : "display__video"}
						onClick={onDisplayVideoOne}></button>
					<button
						className={displayVideo2 ? "display__video__two" : "display__video"}
						onClick={onDisplayVideoTwo}></button>
				</div>
			</div>
		</div>
	);
}

export default Demo;
