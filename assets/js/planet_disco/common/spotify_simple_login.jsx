import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import React, { useRef, useState, useContext, useEffect } from 'react'
import { Paper, Box } from '@material-ui/core'
import { Redirect } from 'react-router'
import { makeStyles } from '@material-ui/core/styles'
import { StoreContext } from '../common/store'

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100%",
    width: "100%",
    paddingLeft: "5%",
    "& a": {
      textDecoration: "none",
    },
    position: "absolute",
    zIndex: 1,
    top: 0,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    align: "center",
    backgroundColor: 'rgba(71, 80, 98, 0.8)',
  },
}));

const clientId = "6371ef37c4fc48a18b52a3837f1b51a9"

function getParameterByName(name) {
  var match = RegExp('[#&]' + name + '=([^&]*)').exec(window.location.hash);
  return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

function getAccessToken() {
  let token = getParameterByName('access_token');
  return token;
}

function encodeState(location, city) {
  let state = { location: location, city: city }
  return encodeURIComponent(JSON.stringify(state))
}

function getCurrentLocation() {
  var parser = document.createElement('a');
  parser.href = window.location;
  return parser.pathname;
}

export default function SpotifySimpleLogin() {
  const { state: { city }, dispatch } = useContext(StoreContext)
  const [redirect, setRedirect] = useState(null)
  const newState = useRef(null)

  const classes = useStyles()
  let accessToken = getAccessToken()
  let location = getCurrentLocation()

  useEffect(() => {
    if (accessToken) {
      window.localStorage.setItem('access_token', accessToken)
      let state = JSON.parse(decodeURIComponent(getParameterByName("state")))
      if (state && state.city) {
        newState.current = state;
        dispatch({ type: "SET_CITY", city: state.city })
        setRedirect(newState.current.location)
      } else {
        setRedirect("/")
      }
    }
  })

  return (
    <React.Fragment>
      {accessToken ?
        redirect && < Redirect to={redirect} />
        :
        <Paper className={classes.root}>
          <div style={{ width: "auto", margin: "0 auto" }}>
            <a href={`https://accounts.spotify.com/authorize?client_id=${clientId}&redirect_uri=http:%2F%2Flocalhost:4000/login&scope=&response_type=token&state=${encodeState(location, city)}`}>
              <Button
                type="button"
                variant="contained"
                color="primary"
              >
                Log in with Spotify
              </Button>
            </a>
          </div>
        </Paper>
      }
    </React.Fragment>
  );
}