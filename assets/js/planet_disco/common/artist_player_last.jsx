import React, { useState, useEffect, Fragment, useRef } from 'react'

import { Paper } from '@material-ui/core'
import SpotifySimpleLogin from './spotify_simple_login';

import { makeStyles, useTheme } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import IconButton from '@material-ui/core/IconButton';

import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import PauseCircleFilledIcon from '@material-ui/icons/PauseCircleFilled';

import Skeleton from '@material-ui/lab/Skeleton';

import PlayerLink from './player_link'

const useStyles = makeStyles((theme) => ({
  container: {
    position: "relative",
  },
  root: {
    display: 'flex',
    justifyContent: 'space-between',
    pointerEvents: "auto",
    zIndex: 10,
  },
  content: {
    flex: '1 0 auto',
    padding: 0,
    margin: theme.spacing(2),
    overflow: "hidden",
   
  },
  cover: {
    width: 151
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  playIcon: {
    height: 34,
    width: 34,
  },
  placeholder: {
    backgroundColor: theme.palette.background.default,
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
    maxWidth: "60%"
  },
}));

function getAccessToken() {
  return window.localStorage.getItem('access_token')
}

// const AudioContext = window.AudioContext || window.webkitAudioContext;

function initAudio() {
  // let audioCtx = new AudioContext()
  let audio = new Audio("https://p.scdn.co/mp3-preview/33b6c8c739a224fc7f47135c9bc21f23b768bead?cid=6371ef37c4fc48a18b52a3837f1b51a9")
  audio.crossOrigin = "anonymous";
  // const track = audioCtx.createMediaElementSource(audio);
  // track.connect(audioCtx.destination);
  // audioCtx.resume();
  return audio;
}

class AudioPlayer {
  constructor(next) {
    this.audio = new Audio("https://p.scdn.co/mp3-preview/33b6c8c739a224fc7f47135c9bc21f23b768bead?cid=6371ef37c4fc48a18b52a3837f1b51a9")
    this.audio.crossOrigin = "anonymous";
    this.stopped = false;
    this.playing = false;
    this.next = next;
  }

  play = async (audioInfo) => {
    if (!this.playing && !this.stopped) {
      let audio = this.audio;
      audio.addEventListener('ended', () => this.next() );
      audio.src = audioInfo.audioUrl;
      // audio.load();
      await audio.play();
      this.playing = true
    }
  }

  pause = () => {
    if (this.playing) {
      this.audio.pause()
      this.playing = false
    }
  }

  stop = () => {
    this.pause();
    this.stopped = true
  }

}

export default function ArtistPlayer({ currentArtist, fetchNext }) {
  const classes = useStyles();
  // const audioPromiseRef = useRef(null)
  const [audioState, setAudio] = useState({playing: false, audioInfo: null})
  const audioRef = useRef(new AudioPlayer(fetchNext))
  const [accessToken, setAccessToken] = useState(getAccessToken())

  const fetchSong = (artist) => {
    const spotifyId = artist.spotifyId;
    const url = `https://api.spotify.com/v1/artists/${spotifyId}/top-tracks?country=from_token`;
    let result = fetch(url, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    })
      .then(res => res.json())
      .then(
        (result) => {
          if (result.error && result.error.status == 401) {
            setAccessToken(null)
            return null;
          }

          try {
            const track = result.tracks[0];

            let cover = null;
            try {
              cover = track.album.images[1].url;
            } catch (err) {
              console.log(err)
            }

            return {
              audioUrl: track.preview_url,
              artistName: artist.name,
              artistId: spotifyId,
              trackName: track.name,
              trackId: track.id,
              albumCover: cover,
            }
          } catch (err) {
            console.log(err)
            return null;
          }
        }
      )
    return result;
  }

  useEffect(() => {
    if (currentArtist && accessToken) {
      fetchSong(currentArtist).then((result) => {
        audioRef.current.pause();
        setAudio({playing: audioState.playing, audioInfo: result})
      })
    } else {
      setPlaying(false)
    }
  }, [currentArtist])
  
  useEffect(() => {
    return () => audioRef.current.stop()
  }, [])
      
  const controlPlayback = () => {
    if (audioState.playing) {
      audioRef.current.play(audioState.audioInfo);
    } else {
      audioRef.current.pause();
    }
  }

  const setPlaying = (p) => {
    setAudio({playing: p, audioInfo: audioState.audioInfo})
  }

  useEffect(() => controlPlayback(), [audioState]);

  const getPlayer = () => {
    return (
      <Card className={classes.root} square={true}>
        <div className={classes.details}>
          <CardContent className={classes.content}>
            {audioState.audioInfo ?
              <Fragment>
                <div onClick={() => setPlaying(false)}>
                  <PlayerLink href={`https://open.spotify.com/track/${audioState.audioInfo.trackId}`} content={audioState.audioInfo.trackName} header={true} playing={audioState.playing} />
                  <PlayerLink href={`https://open.spotify.com/artist/${audioState.audioInfo.artistId}`} content={audioState.audioInfo.artistName} header={false} playing={audioState.playing} />
                </div>
              </Fragment>
              :
              <Fragment>
                <Skeleton className={classes.placeholder} variant="text" animation={false} width={"80%"} height={"35px"} />
                <Skeleton className={classes.placeholder} variant="text" animation={false} width={"60%"} height={"20px"} />
              </Fragment>
            }
          </CardContent>
          <div className={classes.controls}>
            <IconButton aria-label="play/pause" onClick={() => { setPlaying(!audioState.playing) }}>
              {audioState.playing?
                <PauseCircleFilledIcon className={classes.playIcon} />
                : <PlayArrowIcon className={classes.playIcon} />}
            </IconButton>
            <IconButton aria-label="next" onClick={fetchNext}>
              <SkipNextIcon />
            </IconButton>
          </div>
        </div>
        <CardMedia
          className={classes.cover}
          image={audioState.audioInfo && audioState.audioInfo.albumCover ? audioState.audioInfo.albumCover : '/images/album-placeholder.png'}
          title="album cover"
        />
      </Card>
    )
  }
  return (
    <Paper className={classes.container}>
      {getPlayer()}
      {!accessToken &&
        <SpotifySimpleLogin />}
    </Paper>
  )
}
