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
engine = create_engine("sqlite:///songs_complete_db.sqlite")

# reflect an existing database into a new model
Base = automap_base()

# reflect the tables
Base.prepare(autoload_with=engine)
Base.prepare(engine, reflect=True)

# Create our session (link) from Python to the DB
session = Session(engine)

#Save reference to the tables
coolness = Base.classes.coolness
country_attributes = Base.classes.country_attributes
fiftygenre = Base.classes.fiftygenre
#top_50_by_country = Base.classes.top_50_by_country
song_attibutes = Base.classes.song_attibutes

#################################################
# Flask Routes
#################################################
@app.route('/')
def home():
   return render_template('map.html')

@app.route('/attributes/<attribute>')
def getAttribute(attribute):
    # Create our session (link) from Python to the DB, songs_complete_db.sqlite
    session = Session(engine)
    
    #use the attribute selected by the user; average the values of that attribute for each country
    attribute_query = engine.execute('SELECT country, AVG(?) \
                                      FROM song_attibutes \
                                      GROUP BY country', attribute).fetchall()
    
    attribute_dict = {}
    for country, attribute in attribute_query:
      attribute_dict['country'] = country
      attribute_dict['attribute'] = attribute

    return(attribute_dict)

#Because I'm on a mac, I am setting the port to 8000 to avoid access errors
if __name__ == '__main__':
    app.run(port=8000, debug=True)