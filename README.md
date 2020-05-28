<div style="background:#010023;" align="center">
  <p>
  <img src="./images/disco_planet.gif" width="200" />
  </p>
</div>

<div align="center">
  <p>
    <strong>Disco Planet</strong>
  </p>

  <p>
    <a href=https://go.aws/3ekQWjO>
      Website
    </a>
  </p>
</div>

# Disco Planet | Project for COM-480 Data Visualization

## Abstract
Modern means of communication and transportation have brought the world closer together. With many cities turning into melting pots, cultural, social, and personal motives [drive people's curiosity](https://comms.theculturetrip.com/wp-content/uploads/2019/05/Culture-Trip-Beyond-Borders-May-2019-Final.pdf) to explore how diverse backgrounds and experiences intertwine and blur geographical borders. Since [music plays a central role in cultural identity](https://doi.org/10.1007/s10824-018-9320-x), our project strives to provide these insights by looking into the musical preferences of people around the globe.

For the Disco Planet project we employed the dataset retrieved from [Spotify](https://developer.spotify.com/documentation/web-api/), the [most popular music streaming service](https://www.fipp.com/news/insightnews/chart-week-world-most-popular-music-streaming-services) in the year 2019. The three visualization views address the following major questions:

1. What music genres are popular in different corners of the world?
2. How various cities are similar or different in their musical preferences?
3. How do numerous genres and sub-genres of music relate to each other?

We expect that both the general audience and more inquiring music lovers will engage with our website and learn curious insights during the interaction.


## Screen Cast
<a href="https://youtu.be/eI-RlNUJV3A" target="_blank"><img src="./images/videocover_discoplanet.png"
alt="Disco Planet" width="625" height="400" border="10" /></a>

## Technical Setup
Below are the steps to run our website with a local servel.

Install [elixir](https://elixir-lang.org/install.html), [Node.js](https://nodejs.org/en/download/), [PostgreSQL](https://www.postgresql.org/download/), [PostGIS](https://postgis.net/install/).

Clone or download the project:

```
git clone https://github.com/com-480-data-visualization/com-480-project-datavvizards.git
```

Further, in the project folder:
* Set backend dependencies: `mix deps.get`
* Set frontend dependencies: `npm install —prefix assets`
* Create the database: `mix ecto.reset`
* Run the app: `iex -S mix phx.server`

The server will start on http://localhost:4000/

\* _Note that due to space limitations imposed by GitHub our data is located at the external storage and is accessible by the [link](https://datavvizards.s3.eu-west-3.amazonaws.com/seeds.zip). Yet, there is no need to download the data manually as it will be managed automatically during the described setup procedure._
