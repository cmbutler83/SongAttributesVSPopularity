#################################################
# Dependencies
#################################################
from flask import Flask, render_template
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func

#################################################
# Flask Setup
#################################################
app = Flask(__name__)

#################################################
# Database Setup
#################################################
engine = create_engine("postgresql://postgres:postgres@localhost:5432/<databaseName>")

# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(autoload_with=engine)
Base.prepare(engine, reflect=True)
print(Base.classes.keys())

# Create our session (link) from Python to the DB
session = Session(engine)

#Save reference to the tables
#artists = Base.classes.artists
#artist_genre = Base.classes.artist_genre
#chart_rank = Base.classes.chart_rank
#songs = Base.classes.songs
#song_attributes = Base.classes.song_attributes

#################################################
# Flask Routes
#################################################
@app.route('/')
def home():
   return render_template('index.html')

@app.route('/attributes')
def attributes():

@app.route('/country')
def attributes():

#Because I'm on a mac, I am setting the port to 8000 to avoid access errors
if __name__ == '__main__':
    app.run(port=8000, debug=True)