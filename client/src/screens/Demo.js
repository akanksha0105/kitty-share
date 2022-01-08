import React, { useState } from "react";
import "../styles/Demo.css";
import Video1 from "../videos/video1.mov";
import Video2 from "../videos/video2.mp4";
import Video__one__image from "../images/Video1__image.jpg";

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
				<div className="video__option__one">
					<div className="video__description">
						Get to know how you can share URL by generating code
					</div>
					<div className="video__display">
						<video
							className="displayVideo1 "
							src={Video1}
							type="video/mp4"
							// poster={Video__one__image}
							controls
							height="240"
							width="350"></video>
					</div>
				</div>
				<div className="video__option__two">
					<div className="video__description">
						Get to know how you can share URL by connecting multiple devices
					</div>
					<div className="video__display">
						<video
							className="displayVideo1 "
							src={Video2}
							type="video/mp4"
							controls></video>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Demo;
