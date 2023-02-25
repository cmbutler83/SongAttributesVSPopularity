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
engine = create_engine("sqlite:///Resources/songs_complete_db.sqlite")

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

#################################################
# HOME PAGE
#################################################
@app.route('/')
def home():
   return render_template('index.html')

#################################################
# MAP
#################################################
@app.route('/map')
def map():
   return render_template('map.html')

#################################################
# ATTRIBUTE  ENDPOINT
#################################################
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

#################################################
# COUNTRY ENDPOINT
#################################################
@app.route('/countries/<country>')
def getCountry(country):
    # Create our session (link) from Python to the DB, songs_complete_db.sqlite
    session = Session(engine)
    print(country)
    
    # use the attribute selected by the user; average the values of that attribute for each country
    country_query = engine.execute(f"SELECT danceability, energy, loudness,\
                                        speechiness, acousticness, valence, \
                                        tempo, duration \
                                        FROM country_attributes \
                                        WHERE country='{country}'").fetchall()
     #Result example: [(0.6467594945040479, 0.5531940893832685, -7.848541433554926, 0.09584869347725926, 0.3262092080760877, 0.4660201540182979, 120.01254117027578, 207.08635555848088)]
    #print(len(country_results))

    if len(country_query) == 0:
        session.close()
        return jsonify([])
        

    else:
        country_results = country_query[0]

        avg_query = engine.execute(f"SELECT AVG(danceability), \
                                    AVG(energy), \
                                    AVG(loudness), \
                                    AVG(speechiness), \
                                    AVG(acousticness), \
                                    AVG(valence), \
                                    AVG(tempo), \
                                    AVG(duration) \
                                    FROM country_attributes").fetchall()
        #Result example: [(0.6793448757328516, 0.6398077829193978, -6.404888131435592, 0.1049760341207325, 0.27439794173374626, 0.5325104695279008, 122.01599088347731, 203.17904368185987)]
        session.close()
        #turn query results into a list
        avg_results = avg_query[0]
        #round the avg_results to 2 decimals
        rnd_avg_results = [str(round(result, 2)) for result in avg_results]

        
        #create keys for the final dictionary
        keys = ['danceability', 'energy', 'loudness', 'speechiness', 'acousticness', 'valence', 'tempo', 'duration' ]

        results_list = []
        i=0

        for key in keys: 
            dict = {'attribute': key, 'value':country_results[i], 'average' : rnd_avg_results[i] }
            results_list.append(dict)
            i=i+1

        print(results_list)
        return jsonify(results_list)


#Because I'm on a mac, I am setting the port to 8000 to avoid access errors
if __name__ == '__main__':
    app.run(port=8000, debug=True)