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

import WarningPopover from './preview_error'

import Skeleton from '@material-ui/lab/Skeleton';

import PlayerLink from './player_link'

const useStyles = makeStyles((theme) => ({
  container: {
    position: "relative",
  },
  root: {
    display: 'flex',
    width: "100%",
    justifyContent: 'space-between',
    pointerEvents: "auto",
    zIndex: 10,
  },
  details: {
    flex: '2 0 auto',
    maxWidth: "60%",
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    flex: '1 0 auto',
    padding: 0,
    margin: theme.spacing(2),
    overflow: "hidden",
  },
  cover: {
    width: 151,
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
  }
}));

function getAccessToken() {
  return window.localStorage.getItem('access_token')
}

export default function ArtistPlayer({ currentArtist, fetchNext }) {
  const classes = useStyles();
  const audioPromiseRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [currentAudio, setAudioState] = useState(null)
  const [accessToken, setAccessToken] = useState(getAccessToken())

  const next = () => {
    fetchNext();
  }

  const audioPlayer = useRef(
    (() => {
      let a = new Audio("https://p.scdn.co/mp3-preview/33b6c8c739a224fc7f47135c9bc21f23b768bead?cid=6371ef37c4fc48a18b52a3837f1b51a9")
      a.crossOrigin = "anonymous";
      a.addEventListener('ended', next);
      return a;
    })()
  )

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
            let preview = null;
            try {
              cover = track.album.images[1].url;
              preview = track.preview_url;
            } catch (err) {
              console.log(err)
            }

            return {
              audio_url: preview,
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
        pause();
        setAudioState(result)
      })
    } else {
      setPlaying(false)
    }
  }, [currentArtist])

  const controlPlayback = () => {
    if (playing) {
      let [a, promise] = play();
      if (a) {
        return () => {
          promise.then(() => a.pause()).catch((error) => error)
        }
      }
    } else {
      pause()
    }
  }

  useEffect(() => {
    if (!currentAudio) {
      fetchNext()
    }
  }, [currentAudio])

  useEffect(() => controlPlayback(), [currentArtist, playing, currentAudio]);

  const getCurrentAudio = () => {
    if (currentAudio && currentAudio.audio_url) {
      let a = audioPlayer.current;
      let url = currentAudio.audio_url;
      a.src = url;
      return a;
    }
    return null;
  }

  const play = () => {
    // if (playing) {
    //   pause()
    // }
    let a = getCurrentAudio();
    if (a) {
      let promise = a.play();
      audioPromiseRef.current = promise;
      return [a, promise];
    }
    return [null, null];
  }

  const pause = () => {
    let a = getCurrentAudio();
    if (a) {
      let promise = audioPromiseRef.current;
      if (promise)
        promise.then(() => a.pause()).catch((error) => error)
    }
  }

  

  const getPlayer = () => {
    return (
      <Card className={classes.root}>
        <div className={classes.details}>
          <CardContent className={classes.content}>
            {currentAudio ?
              <Fragment>
                <div onClick={() => { setPlaying(false) }}>
                  <PlayerLink href={`https://open.spotify.com/track/${currentAudio.trackId}`} content={currentAudio.trackName} header={true} playing={playing} />
                  <PlayerLink href={`https://open.spotify.com/artist/${currentAudio.artistId}`} content={currentAudio.artistName} header={false} playing={playing} />
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
            <IconButton aria-label="play/pause" onClick={() => { setPlaying(!playing) }}>
              {playing ?
                <PauseCircleFilledIcon className={classes.playIcon} />
                : <PlayArrowIcon className={classes.playIcon} />}
            </IconButton>
            <IconButton aria-label="next" onClick={next}>
              <SkipNextIcon />
            </IconButton>
            {currentAudio && !currentAudio.audio_url && <WarningPopover/>}
          </div>
        </div>
        <CardMedia
          className={classes.cover}
          image={currentAudio && currentAudio.albumCover ? currentAudio.albumCover : '/images/album-placeholder.png'}
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
