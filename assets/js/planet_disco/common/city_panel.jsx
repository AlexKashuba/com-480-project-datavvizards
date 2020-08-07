import React, { useState, useContext } from 'react'
import { Paper, Typography, IconButton } from '@material-ui/core'
import { Close as CloseIcon } from '@material-ui/icons'
import { makeStyles } from '@material-ui/core/styles'
import TopArtists from './top_artists'
import TopGenres from './top_genres'
import { StoreContext } from './store'
// import Similar from './similar_cities'
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

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

function contract(countryName, smallScreen){
  if (smallScreen){
    switch(countryName){
      case "United States":
        return "US"
      case "United Kingdom":
        return "UK"
    }
  }
  return countryName
}

export default ({ city, similarCities }) => {
  const classes = useStyles()
  const [selector, setSelector] = useState('artists')
  const { dispatch } = useContext(StoreContext)

  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down('md'));

  return  <Paper className={classes.city}>
    <div>
      <Typography variant="h5" gutterBottom>
        {city.city}, {contract(city.humanCountry, matches)}
        <IconButton className={classes.close} onClick={() => dispatch({ type: 'SET_CITY' })}>
          <CloseIcon />
        </IconButton>
      </Typography>

      {/* {similarCities && similarCities.length > 0 && <Similar cities={similarCities} />} */}
    </div>
    {selector == 'artists' ? <TopArtists city={city} /> : <TopGenres city={city} />}
  </Paper>
}