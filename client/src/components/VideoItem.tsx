import React from 'react';
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
interface VideoItemProps {
    optionNumber: string,
    videoUrl: string,
}

const VideoItem: React.FC<VideoItemProps> = ({ optionNumber, videoUrl }) => {
    return (
        <div className={`video__option__${optionNumber}`}>
            <div className={`video__description__${optionNumber}`}>
                <div className="video__description">
                    Get to know how you can share URL by generating code
                </div>
            </div>
            <div className="arrow__icon__one">
                <ArrowRightAltIcon />
            </div>
            <div className={`video__display__${optionNumber}`}>
                <video width="400" className="displayVideo" controls>
                    <source src={videoUrl} type="video/mp4" />
                </video>

            </div>
        </div>
    );
};

export default VideoItem;