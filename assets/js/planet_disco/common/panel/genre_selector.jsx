import React, { useState, useEffect, useContext } from 'react'
import { Typography, Chip } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
// import Genres from './_stash/genres'
import { StoreContext } from '../store'
import { schemeCategory10 as colorSet } from 'd3-scale-chromatic'
import { useApolloClient, useQuery } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'
import { max } from 'd3'

const MASTER_GENRES = gql`query {
  masterGenres {
    id
    name
  }
}`

const CITY_GENRES = gql`query CityGenres($genreIds: [ID]) {
  genrePopularityNormalized(genreIds: $genreIds) {
    cityId
    genreId
    popularity
  }
}`

const genreLimit = 10

const useStyles = makeStyles((theme) => ({
  header: {
    marginTop: theme.spacing(2)
  },
  genreButton: {
    marginRight: '3px',
    marginBottom: '3px'
  }
}))

const palette = [...colorSet]

export default () => {
  const classes = useStyles()
  const graphql = useApolloClient()
  const { data } = useQuery(MASTER_GENRES)
  const [selectedGenres, setSelectedGenres] = useState(new Set())
  const [colorMap, setColorMap] = useState({})
  const { state, dispatch } = useContext(StoreContext)

  useEffect(() => {
    const genreIds = Array.from(selectedGenres).map(g => g.id)
    graphql.query({query: CITY_GENRES, variables: { genreIds }}).then(({ data }) => {
      const cityMap = {}
      const top = max(data.genrePopularityNormalized.map(g => g.popularity))
      data.genrePopularityNormalized.forEach(({ cityId, genreId, popularity }) => {
        cityMap[cityId] = [colorMap[genreId], popularity / top]
      })
      state.genreHandler && state.genreHandler(cityMap)
    })
  }, [selectedGenres])

  const toggle = (genre) => {
    if (selectedGenres.has(genre)) {
      selectedGenres.delete(genre)
      palette.push(colorMap[genre.id])
      setColorMap({...colorMap, [genre.id]: undefined})
      setSelectedGenres(new Set(selectedGenres))
    } else if (selectedGenres.size < genreLimit) {
      setColorMap({...colorMap, [genre.id]: palette.shift()})
      setSelectedGenres(new Set(selectedGenres.add(genre)))
    }
  }

  return <>
    <Typography variant="subtitle1" className={classes.header}>
      Genre popularity
    </Typography>

    <Typography variant="caption" gutterBottom>
      Pick up to {genreLimit} genres to see their popularity worldwide
    </Typography>

    <div>
      {data && data.masterGenres.map((genre, i) => <Chip
        key={i}
        variant="outlined"
        onClick={(selectedGenres.size < genreLimit || colorMap[genre.id]) && (() => toggle(genre))}
        style={{backgroundColor: colorMap[genre.id]}}
        className={classes.genreButton}
        label={genre.name}
      />)}
    </div>
  </>
}