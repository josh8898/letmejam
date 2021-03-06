from flask import Flask, jsonify, request, redirect, send_from_directory
from flask_cors import CORS, cross_origin
from dotenv import load_dotenv
import psycopg2
import os
import boto3, botocore
from werkzeug.utils import secure_filename

#load_dotenv()

# PostgreSQL Database credentials loaded from the .env file

DATABASE = os.environ['DATABASE']
DATABASE_USERNAME = os.environ['DATABASE_USERNAME']
DATABASE_PASSWORD = os.environ['DATABASE_PASSWORD']
S3_KEY = os.environ['S3_KEY']
S3_SECRET = os.environ['S3_SECRET_ACCESS_KEY']
S3_LOCATION = os.environ['S3_LOCATION']
S3_BUCKET = os.environ['S3_BUCKET']


application = Flask(__name__)
CORS(application, resources={r"/*": {"origins": "*"}})
#application.config['CORS_HEADERS'] = 'Content-Type'

s3 = boto3.client(
    "s3",
    aws_access_key_id=S3_KEY,
    aws_secret_access_key=S3_SECRET,
    region_name = "ap-southeast-2"
)


# CORS implemented so that we don't get errors when trying to access the server from a different server location



con = psycopg2.connect(
    database=DATABASE,
    user=DATABASE_USERNAME,
    password=DATABASE_PASSWORD,
    host="lmjdatabase.czjjfwklkjop.ap-southeast-2.rds.amazonaws.com",
    port='5432')

cur = con.cursor()



# GET: Fetch all movies from the database
@application.route('/')
def fetch_all_tracks():
    cur.execute('SELECT * FROM tracks')
    rows = cur.fetchall()
    print(rows)

    return jsonify(rows)
    #return("HI FUCKER")
    # GET: Fetch movie by movieId from the database

@application.route('/<int:track_id>')
def fetch_by_id(track_id=None):
    cur.execute(f'SELECT * FROM tracks WHERE track_id = {track_id}')
    rows = cur.fetchall()
    print(rows)

    return jsonify(rows)

@application.route('/files/<path:filename>')
def download_file(filename):
    return send_from_directory('./files/', filename)

# POST: Create movies and add them to the database
@application.route('/add-track', methods=['GET', 'POST'])
@cross_origin()
def add_movie():
    if request.method == 'POST':
        print("hi")
        data = request.form.to_dict()
        f = request.files['file']
        print(f.filename)
        filename = secure_filename(f.filename)
        output = ""
        if filename != '':
            output = upload_file_to_s3(f, S3_BUCKET)
        else:
            print("did not save :(")
        print(data)
        cur.execute("INSERT INTO tracks (track_name, track_artist, img_filename, track_genre, track_filename, track_key, track_rating) VALUES (%s, %s, %s, %s, %s, %s, %s)",
                    (f"{data['trackName']}", f"{data['trackArtist']}", "No IMG", f"{data['trackGenre']}",
                    output, f"{data['trackKey']}", 0))
        con.commit()
        response = jsonify([200])
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response
    else:
        return 'Form submission failed'

# DELETE: Delete movie by movieId from the database
@application.route('/delete-track', methods=['GET', 'DELETE'])
def delete_by_id():
    track_id = request.form.to_dict()
    print(track_id['trackId'])
    cur.execute(
        f"DELETE FROM track WHERE track_id = {track_id['trackId']} RETURNING track_name")
    con.commit()

    return 'Track Deleted'

# PUT: Update movie by movieId from the database
@application.route('/update-track', methods=['GET', 'PUT'])
def update_by_id():
    data = request.form.to_dict()
    cur.execute(
        f"UPDATE tracks SET track_name = {data['trackName']} WHERE track_id = {data['trackId']}")
    con.commit()

    return 'Track Updated'

def upload_file_to_s3(file, bucket_name, acl="public-read"):

    #Docs: http://boto3.readthedocs.io/en/latest/guide/s3.html

    try:

        s3.upload_fileobj(file,bucket_name,file.filename,ExtraArgs={"ACL": acl, "ContentType": file.content_type})

    except Exception as e:
        print("Something Happened: ", e)
        return e

    return "{}{}".format(S3_LOCATION, file.filename)

if __name__ == '__main__':
    application.run(debug=True)