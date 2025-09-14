import React, { useState, useRef, useEffect } from 'react';

// --- Placeholder Video Data ---
// Replace these URLs with your own MP4 links.
const initialVideos = [
  {
    id: 1,
    url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    user: '@catlover',
    description: 'Just a sleepy kitty #catsoftiktok #fyp'
  },
  {
    id: 2,
    url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    user: '@holidayvibes',
    description: 'Getting into the holiday spirit early this year!'
  },
  {
    id: 3,
    url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    user: '@beachlife',
    description: 'Nothing beats the ocean sounds #ocean #relax #asmr'
  },
  {
    id: 4,
    url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    user: '@foodie',
    description: 'The perfect pretzel slice #food #baking'
  },
  {
    id: 5,
    url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    user: '@prettykitty',
    description: 'Those eyes though...'
  }
];

// --- Icons ---
const MuteIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
        <line x1="23" y1="9" x2="17" y2="15"></line>
        <line x1="17" y1="9" x2="23" y2="15"></line>
    </svg>
);

const UnmuteIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
    </svg>
);


// --- Video Player Component ---
const VideoPlayer = ({ video, isVisible }) => {
  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    if (isVisible) {
      // Play the video if it's in view
      videoElement.play().then(() => {
        setIsPlaying(true);
      }).catch(error => {
        // Autoplay was prevented.
        console.warn("Autoplay prevented for video:", video.id, error);
        setIsPlaying(false);
      });
    } else {
      // Pause and reset the video if it's out of view
      videoElement.pause();
      videoElement.currentTime = 0;
      setIsPlaying(false);
    }
  }, [isVisible, video.id]);

  const handleVideoClick = () => {
    const videoElement = videoRef.current;
    if (videoElement.paused) {
      videoElement.play();
      setIsPlaying(true);
    } else {
      videoElement.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div className="relative h-auto w-full snap-start bg-black flex items-center justify-center">
      <video
        ref={videoRef}
        src={video.url}
        loop
        playsInline
        muted={isMuted}
        className="h-auto w-full object-contain"
        onClick={handleVideoClick}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      <div className="absolute bottom-4 left-4 text-white z-10 drop-shadow-md">
        <p className="font-bold">{video.user}</p>
        <p className="text-sm">{video.description}</p>
      </div>

      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="text-white bg-black bg-opacity-50 p-2 rounded-full hover:bg-opacity-75 transition-colors"
        >
          {isMuted ? <MuteIcon /> : <UnmuteIcon />}
        </button>
      </div>
       {!isPlaying && isVisible && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <svg className="w-full h-full text-white opacity-70" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      )}
    </div>
  );
};


// --- Main App Component ---
export default function App() {
  const [videos] = useState(initialVideos);
  const [visibleVideoId, setVisibleVideoId] = useState(videos[0]?.id || null);
  const containerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const videoId = parseInt(entry.target.dataset.videoId, 10);
            setVisibleVideoId(videoId);
          }
        });
      },
      {
        root: containerRef.current,
        threshold: 0.5, // 50% of the video must be visible to trigger
      }
    );

    const videoElements = containerRef.current.querySelectorAll('.video-element');
    videoElements.forEach((el) => observer.observe(el));

    return () => {
      videoElements.forEach((el) => observer.unobserve(el));
    };
  }, [videos]);

  return (
    <div className="bg-gray-800 flex justify-center items-center h-screen font-sans">
        <div className="w-full max-w-[420px] max-h-screen md:max-h-[90vh] bg-black md:rounded-3xl overflow-hidden shadow-2xl">
            <header className="absolute top-0 left-0 right-0 p-4 text-center z-20">
                <h1 className="text-white text-xl font-bold drop-shadow-lg">Brainrot TV</h1>
            </header>
            <main
            ref={containerRef}
            className="w-full overflow-y-scroll snap-y snap-mandatory"
            >
            {videos.map((video) => (
                <div key={video.id} data-video-id={video.id} className="video-element w-full">
                    <VideoPlayer
                        video={video}
                        isVisible={visibleVideoId === video.id}
                    />
                </div>
            ))}
            </main>
      </div>
    </div>
  );
}

