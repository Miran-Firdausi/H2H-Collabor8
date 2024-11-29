import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  LocalUser,
  RemoteUser,
  useJoin,
  useLocalCameraTrack,
  useLocalMicrophoneTrack,
  usePublish,
  useRemoteAudioTracks,
  useRemoteUsers,
} from "agora-rtc-react";
import { Mic, MicOff, Video, VideoOff, PhoneOff } from "lucide-react";
import "./VideoRoom.css";

export const VideoRoom = () => {
  const appId = import.meta.env.VITE_AGORA_APP_ID;
  const { channelName } = useParams();

  if (channelName == null) {
    throw new Error("Channel name is required");
  }

  const [activeConnection, setActiveConnection] = useState(true);
  const [micOn, setMic] = useState(true);
  const [cameraOn, setCamera] = useState(true);

  const { localMicrophoneTrack } = useLocalMicrophoneTrack(micOn);
  const { localCameraTrack } = useLocalCameraTrack(cameraOn);

  const navigate = useNavigate();

  useJoin(
    {
      appid: appId,
      channel: channelName,
      token: null,
    },
    activeConnection
  );

  usePublish([localMicrophoneTrack, localCameraTrack]);

  const remoteUsers = useRemoteUsers();
  const { audioTracks } = useRemoteAudioTracks(remoteUsers);

  audioTracks.forEach((track) => track.play());

  const handleDisconnect = () => {
    setActiveConnection(false);
    navigate(-1);
  };

  return (
    <div className="video-conference-container">
      <div className="video-grid">
        <div className="remote-videos">
          {remoteUsers.map((user) => (
            <div key={user.uid} className="remote-video-item">
              <RemoteUser user={user} />
            </div>
          ))}
        </div>
        <div className="local-video">
          <LocalUser
            audioTrack={localMicrophoneTrack}
            videoTrack={localCameraTrack}
            cameraOn={cameraOn}
            micOn={micOn}
            playAudio={micOn}
            playVideo={cameraOn}
            className="local-user-video"
          />
        </div>
      </div>

      <div className="video-controls">
        <div className="media-controls">
          <button
            className={`control-btn ${micOn ? "active" : "muted"}`}
            onClick={() => setMic((prev) => !prev)}
            title={micOn ? "Mute Mic" : "Unmute Mic"}
          >
            {micOn ? <Mic /> : <MicOff />}
          </button>

          <button
            className={`control-btn ${cameraOn ? "active" : "muted"}`}
            onClick={() => setCamera((prev) => !prev)}
            title={cameraOn ? "Turn Off Camera" : "Turn On Camera"}
          >
            {cameraOn ? <Video /> : <VideoOff />}
          </button>

          <button
            className="control-btn disconnect"
            onClick={handleDisconnect}
            title="Disconnect"
          >
            <PhoneOff />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoRoom;
