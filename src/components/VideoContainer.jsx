import React, { useEffect, useState } from "react";
import { youtube_video_api } from "../utils/constant";
import VideoCard from "./VideoCard";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { allVideo } from "../utils/navSlice";
import MainShimmer from "./MainShimmer";

const VideoContainer = () => {
  const dispatch = useDispatch();
  const selector = useSelector((store) => store.navBar.home);

  useEffect(() => {
    getYoutubeVideo();
  }, []);

  const getYoutubeVideo = async () => {
    const fetchData = await fetch(youtube_video_api);
    const json = await fetchData.json();
    console.log(json);
    dispatch(allVideo(json?.items));
  };

  if (selector.length === 0) {
    return <MainShimmer />;
  }

  return (
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
        {selector.map((video) => (
          <Link to={"/watch?v=" + video.id} key={video.id}>
            <VideoCard videoData={video} />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default VideoContainer;