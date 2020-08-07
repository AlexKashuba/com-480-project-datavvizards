defmodule SpotifyTracker.Repo.Migrations.AddIndexes do
  use Ecto.Migration

  def change do
    execute("create index artist_cities_score_index on artist_cities (score, city_id);",
             "drop index artist_cities_score_index;")

    execute("create index artist_cities_listeners_index on artist_cities (listeners, city_id);",
            "drop index artist_cities_listeners_index;")

    execute("create index genre_index on artist_genres using hash (genre_id);",
            "drop index genre_index;")
  end
end
