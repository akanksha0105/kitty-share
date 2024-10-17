import React, { useState } from "react";
import "../styles/Demo.css";
import Video1 from "../videos/video1.mp4";
import Video2 from "../videos/video2.mp4";
import Video__one__image from "../images/Video1__image.jpg";
import { Player } from "video-react";
import PlayProgressBar from "video-react/lib/components/control-bar/PlayProgressBar";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
function Demo() {
	const [displayVideo1, setDisplayVideo1] = useState(true);
	const [displayVideo2, setDisplayVideo2] = useState(false);

	const onDisplayVideoOne = () => {
		setDisplayVideo1(true);
		setDisplayVideo2(false);
	};

	const onDisplayVideoTwo = () => {
		setDisplayVideo1(false);
		setDisplayVideo2(true);
	};
	return (
		<div className='demo__screen'>
			<div className='demo'>
				<div className='video__option__one'>
					<div className='video__description__one'>
						<div className='video__description'>
							Get to know how you can share URL by generating code
						</div>
					</div>
					<div className='arrow__icon__one'>
						<ArrowRightAltIcon />
					</div>
					<div className='video__display__one'>
						<video
							width='400'
							className='displayVideo1 '
							src={Video1}
							type='video/mp4'
							controls></video>
					</div>
				</div>
				<div className='video__option__two'>
					<div className='video__description__two'>
						<div className='video__description'>
							Get to know how you can share URL by connecting multiple devices
						</div>
					</div>
					<div className='arrow__icon__two'>
						<ArrowRightAltIcon />
					</div>
					<div className='video__display__two'>
						<video
							className='displayVideo1 '
							src={Video2}
							type='video/mp4'
							controls></video>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Demo;
