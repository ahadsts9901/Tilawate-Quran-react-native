import { Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { playlistData } from './src/constants'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import Sound from 'react-native-sound'

export default function App() {

  const [index, setIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState<Boolean>(false)
  const [sound, setSound]: any = useState(null)
  const [currentTime, setCurrentTime]: any = useState(0)

  const previous = () => {

    setCurrentTime(0)
    setIsPlaying(true)

    if (index == 0) {
      setIndex(playlistData.length - 1)
      setIsPlaying(false)
      return
    }

    setIndex(index - 1)
    setIsPlaying(false)

  }

  const next = () => {

    setCurrentTime(0)
    setIsPlaying(true)

    if (index == playlistData.length - 1) {
      setIndex(0)
      setIsPlaying(false)
      return
    }

    setIndex(index + 1)
    setIsPlaying(false)

  }

  useEffect(() => {

    var whoosh = new Sound(playlistData[index].url, Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.log('failed to load the sound', error);
        return;
      }
      console.log('duration in seconds: ' + whoosh.getDuration() + 'number of channels: ' + whoosh.getNumberOfChannels());

      setSound(whoosh)

      if (isPlaying) {
        whoosh.play((success) => {
          if (success) {
            console.log('successfully finished playing');
          } else {
            console.log('playback failed due to audio decoding errors');
          }
        });
      }

    });

  }, [index])

  useEffect(() => {
    if (sound) {
      sound.getCurrentTime((seconds: any) => {
        setCurrentTime(seconds);
      });

      sound.setNumberOfLoops(0); // Set to play once

      const playbackFinished = (successfully: boolean) => {
        if (successfully) {
          // Playback finished successfully, play the next sound
          next();
        } else {
          console.log('playback failed due to audio decoding errors');
          // Handle playback failure if needed
        }
      };

      // Check if sound has finished playing every second
      const intervalId = setInterval(() => {
        sound.getCurrentTime((seconds: number) => {
          if (seconds >= sound.getDuration()) {
            // Playback finished
            clearInterval(intervalId); // Stop the interval
            playbackFinished(true); // Call the playbackFinished function
          }
        });
      }, 1000);

      return () => clearInterval(intervalId); // Cleanup interval on component unmount
    }
  }, [currentTime, isPlaying, index]);

  useEffect(() => {
    if (sound) {
      if (isPlaying) {
        sound.play((success: any) => {
          if (success) {
            console.log('successfully finished playing');
          } else {
            console.log('playback failed due to audio decoding errors');
          }
        });

        // Update currentTime continuously while playing
        const intervalId = setInterval(() => {
          sound.getCurrentTime((seconds: number) => {
            setCurrentTime(seconds);
          });
        }, 1000);

        return () => clearInterval(intervalId); // Cleanup interval on component unmount
      } else {
        sound.pause();
      }
    }
  }, [isPlaying]);

  const formatTime = (seconds: any) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <SafeAreaView style={{
      backgroundColor: "#18171f",
      flex: 1,
      padding: 24,
      borderLeftColor: "#f1304d",
      borderLeftWidth: 5
    }}>
      <View style={{
        width: "100%",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 12,
        marginBottom: 32
      }}>
        <Icon name="bookshelf" color="#f1304d" size={35} />
        <Text style={{
          color: "#fff",
          fontFamily: "Quicksand-Bold",
          fontSize: 28,
        }}>Tilawat-E-Quran</Text>
      </View>
      <View style={{
        width: "100%",
        alignItems: "center",
        gap: 20
      }}>
        <Image
          style={{
            width: 120,
            height: 120,
            borderRadius: 500,
          }}
          source={playlistData[index].artWork}
        />
        <View style={{
          width: "100%",
          alignItems: "center",
          gap: 8
        }}>
          <Text numberOfLines={1} style={{
            width: "100%",
            textAlign: "center",
            color: "#fff",
            fontFamily: "Quicksand-Bold",
            fontSize: 32
          }}>{playlistData[index].title}</Text>
          <Text numberOfLines={1} style={{
            width: "100%",
            textAlign: "center",
            color: "#f1304d",
            fontFamily: "Quicksand-Bold",
            fontSize: 24
          }}>{playlistData[index].artist}</Text>
          <Text numberOfLines={1} style={{
            width: "100%",
            textAlign: "center",
            color: "#fff",
            fontFamily: "Quicksand-Bold",
            fontSize: 18
          }}>{playlistData[index].album}</Text>
        </View>
        <View style={{
          width: "100%",
          alignItems: "center",
          marginTop: 24
        }}>
          <View style={{
            width: "80%",
          }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
              <Text style={{ color: '#fff' }}>{formatTime(currentTime)}</Text>
              <Text style={{ color: '#fff' }}>{formatTime(sound ? sound.getDuration() : 0)}</Text>
            </View>
            <View style={{ height: 5, backgroundColor: '#444', borderRadius: 2 }}>
              <View style={{ height: '100%', width: `${(sound ? (currentTime / sound.getDuration()) : 0) * 100}%`, backgroundColor: '#f1304d', borderRadius: 2 }}></View>
            </View>
          </View>
          <View style={{
            width: "100%",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            gap: 24,
            marginTop: 32
          }}>
            <TouchableOpacity
              onPress={previous}
            ><Icon name="skip-backward" size={48} color="#fff" /></TouchableOpacity>
            {
              isPlaying ? <TouchableOpacity
                onPress={() => setIsPlaying(false)}
              ><Icon name="pause" size={72} color="#fff" /></TouchableOpacity> :
                <TouchableOpacity
                  onPress={() => setIsPlaying(true)}
                ><Icon name="play" size={72} color="#fff" /></TouchableOpacity>
            }
            <TouchableOpacity
              onPress={next}><Icon name="skip-forward" size={48} color="#fff" /></TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({})