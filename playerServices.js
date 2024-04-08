import TrackPlayer, { RepeatMode } from "react-native-track-player"
import { playlistData } from "./src/constants"

export const setupPlayer = async () => {

    let isSetup = false

    try {
        await TrackPlayer.getCurrentTrack()
        isSetup = true
    } catch (error) {
        await TrackPlayer.setupPlayer()
        isSetup = true
    } finally {
        return isSetup
    }

}

export const addTrack = async () => {
    await TrackPlayer.add(playlistData)
    await TrackPlayer.setRepeatMode(RepeatMode.Queue)
}

export const playbackService = async () => {
    TrackPlayer.addEventListener(Event.RemotePause, () => {
        TrackPlayer.pause()
    })
    TrackPlayer.addEventListener(Event.RemotePlay, () => {
        TrackPlayer.play()
    })
    TrackPlayer.addEventListener(Event.RemoteNext, () => {
        TrackPlayer.skipToNext()
    })
    TrackPlayer.addEventListener(Event.RemotePrevious, () => {
        TrackPlayer.skipToPrevious()
    })
}