import React, { useMemo, useState, useEffect, useContext } from 'react'
import { gql } from 'apollo-boost'
import { StoreContext } from './store'
// import throttle from 'lodash/throttle';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { useApolloClient } from '@apollo/react-hooks'


const CITIES = gql`query CitiesAutocomplete($term: String) {
  cities(q: $term, limit: 10) {
    entries {
      id
      city
      humanCountry
      coord
    }
  }
}`


function debounce(func, wait, immediate) {
  var timeout;
  return function () {
    var context = this, args = arguments;
    var later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};

const useStyles = makeStyles((theme) => ({
  icon: {
    color: theme.palette.text.secondary,
  },
}));

export default function GoogleMaps() {
  const classes = useStyles();
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState([]);
  const graphql = useApolloClient()
  const { state: { city }, dispatch } = useContext(StoreContext)

  const fetch = useMemo(
    (() =>
      debounce(((request, callback) => {
        graphql.query({
          query: CITIES,
          variables: { term: request }
        }).then((res) => callback(res))
      }), 200, false)),
    [],
  );

  useEffect(() => {
    let active = true;

    fetch(inputValue, (results) => {
      if (active) {
        let newOptions = [];

        if (city) {
          newOptions = [city];
        }

        if (results) {
          newOptions = [...newOptions, ...results.data.cities.entries];
        }

        setOptions(newOptions);
      }
    });

    return () => {
      active = false;
    };
  }, [inputValue, fetch]);

  return (
    <Autocomplete
      id="city-selector"
      getOptionLabel={(option) => `${option.city}, ${option.humanCountry}`} 
      getOptionSelected={(option, value) => option.id === value.id}
      filterOptions={(x) => x}
      options={options}
      autoComplete
      includeInputInList
      filterSelectedOptions
      value={city}
      onChange={(_, newValue) => {
        setOptions(newValue ? [newValue, ...options] : options);
        dispatch({ type: 'SET_CITY', city: newValue })
      }}
      onInputChange={(_, newInputValue) => {
        setInputValue(newInputValue);
      }}
      renderInput={(params) => (
        <TextField {...params} label="Pick a city to learn more..." variant="outlined" fullWidth />
      )}
      renderOption={(option) => {
        return (
          <Grid container alignItems="center">
            <Grid item>
              <LocationOnIcon className={classes.icon} />
            </Grid>
            <Grid item xs>
              {option.city}

              <Typography variant="body2" color="textSecondary">
                {option.humanCountry}
              </Typography>
            </Grid>
          </Grid>
        );
      }}
    />
  );
}
