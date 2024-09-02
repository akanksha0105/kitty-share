import React, { useState } from "react";
import VideoItem from "../components/VideoItem";

import "../styles/Demo.css";
import Video1 from "../videos/video1.mp4";
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
				<VideoItem optionNumber="one" videoUrl={Video1} />
				<VideoItem optionNumber="two" videoUrl={Video2} />

			</div>
		</div>
	);
}

export default Demo;
