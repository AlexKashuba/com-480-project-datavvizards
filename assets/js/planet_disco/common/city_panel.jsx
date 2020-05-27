import React, { useState, useContext } from 'react'
import { Paper, Typography, Button, ButtonGroup, IconButton } from '@material-ui/core'
import { Close as CloseIcon } from '@material-ui/icons'
import { makeStyles } from '@material-ui/core/styles'
import TopArtists from './top_artists'
import TopGenres from './top_genres'
import { StoreContext } from './store'
import Similar from './similar_cities'

const useStyles = makeStyles((theme) => ({
  city: {
    padding: theme.spacing(2),
    pointerEvents: "auto",
    maxHeight: "100%",
    height: "100%",
    display: "flex",
    flex: "auto",
    flexDirection: "column",
    '& h1': {
      marginBottom: theme.spacing(2)
    }
  },
  selector: {
    marginTop: theme.spacing(3)
  },
  close: {
    marginLeft: 2
  }
}))

export default ({ city, similarCities }) => {
  const classes = useStyles()
  const [selector, setSelector] = useState('artists')
  const { dispatch } = useContext(StoreContext)

  return  <Paper className={classes.city}>
    <div>
      <Typography variant="h5" gutterBottom>
        {city.city}, {city.humanCountry}
        <IconButton className={classes.close} onClick={() => dispatch({ type: 'SET_CITY' })}>
          <CloseIcon />
        </IconButton>
      </Typography>

      {similarCities && similarCities.length > 0 && <Similar cities={similarCities} />}
    </div>
    {selector == 'artists' ? <TopArtists city={city} /> : <TopGenres city={city} />}
  </Paper>
}