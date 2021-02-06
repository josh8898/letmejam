from flask import Flask, jsonify, request, redirect, send_from_directory
from flask_cors import CORS
from dotenv import load_dotenv
import psycopg2
import os
from werkzeug.utils import secure_filename

load_dotenv()

# PostgreSQL Database credentials loaded from the .env file
DATABASE = os.getenv('DATABASE')
DATABASE_USERNAME = os.getenv('DATABASE_USERNAME')
DATABASE_PASSWORD = os.getenv('DATABASE_PASSWORD')

app = Flask(__name__)

# CORS implemented so that we don't get errors when trying to access the server from a different server location
CORS(app)


try:
    con = psycopg2.connect(
        database=DATABASE,
        user=DATABASE_USERNAME,
        password=DATABASE_PASSWORD)

    cur = con.cursor()

    # GET: Fetch all movies from the database
    @app.route('/')
    def fetch_all_tracks():
        cur.execute('SELECT * FROM tracks')
        rows = cur.fetchall()
        print(rows)

        return jsonify(rows)
        # GET: Fetch movie by movieId from the database
    @app.route('/<int:track_id>')
    def fetch_by_id(track_id=None):
        cur.execute(f'SELECT * FROM tracks WHERE track_id = {track_id}')
        rows = cur.fetchall()
        print(rows)

        return jsonify(rows)
    
    @app.route('/files/<path:filename>')
    def download_file(filename):
        return send_from_directory('./files/', filename)

    # POST: Create movies and add them to the database
    @app.route('/add-track', methods=['GET', 'POST'])
    def add_movie():
        if request.method == 'POST':
            print("hi")
            data = request.form.to_dict()
            f = request.files['file']
            print(f.filename)
            filename = secure_filename(f.filename)
            if filename != '':
                f.save(os.path.join('files', filename))
            else:
                print("did not save :(")
            print(data)
            cur.execute("INSERT INTO tracks (track_name, track_artist, img_filename, track_genre, track_filename, track_key, track_rating) VALUES (%s, %s, %s, %s, %s, %s, %s)",
                        (f"{data['trackName']}", f"{data['trackArtist']}", "No IMG", f"{data['trackGenre']}",
                         str(os.path.join('files', filename)), f"{data['trackKey']}", 0))
            con.commit()
            return redirect('http://localhost:3000/', code="200")
        else:
            return 'Form submission failed'

    # DELETE: Delete movie by movieId from the database
    @app.route('/delete-track', methods=['GET', 'DELETE'])
    def delete_by_id():
        track_id = request.form.to_dict()
        print(track_id['trackId'])
        cur.execute(
            f"DELETE FROM track WHERE track_id = {track_id['trackId']} RETURNING track_name")
        con.commit()

        return 'Track Deleted'

    # PUT: Update movie by movieId from the database
    @app.route('/update-track', methods=['GET', 'PUT'])
    def update_by_id():
        data = request.form.to_dict()
        cur.execute(
            f"UPDATE tracks SET track_name = {data['trackName']} WHERE track_id = {data['trackId']}")
        con.commit()

        return 'Track Updated'
except:
    print('Error')

