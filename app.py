#################################################
# Dependencies
#################################################
from flask import Flask, jsonify, render_template
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
Base.prepare(engine, reflect=True)

#Save reference to the tables
coolness = Base.classes.coolness
country_attributes = Base.classes.country_attributes
fiftygenre = Base.classes.fiftygenre
top_50_by_country = Base.classes.top_50_by_country
#song_attibutes = Base.classes.song_attibutes

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
    #print(attribute)
    #use the attribute selected by the user; average the values of that attribute for each country
    attribute_query = engine.execute(f'SELECT country, AVG({attribute}) \
                                      FROM top_50_by_country \
                                      GROUP BY country').fetchall()
    session.close()
    #print(attribute_query)
    
    
    pakg = [{"country": r[0], "value": r[1]} for r in attribute_query]
    print(pakg)

    return jsonify(pakg)


#Because I'm on a mac, I am setting the port to 8000 to avoid access errors
if __name__ == '__main__':
    app.run(port=8000, debug=True)