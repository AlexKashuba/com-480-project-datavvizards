defmodule SpotifyTracker.ArtistCity do
  use Ecto.Schema
  alias SpotifyTracker.{Artist, City}

  schema "artist_cities" do
    field :listeners, :integer
    belongs_to :artist, Artist
    belongs_to :city, City
  end
end
