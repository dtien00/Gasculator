from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from dotenv import load_dotenv
import os
import requests

app = FastAPI()

load_dotenv()  # Load environment variables from .env file

# CORS to allow frontend to talk to backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve static files (React assets like JS, CSS)
app.mount("/static", StaticFiles(directory="../client/dist/assets"), name="static")

# Details about Google Places API
# @app.get("/place-details")
# def place_details(place_id: str = Query(...)):
#     url = (
#         f"https://maps.googleapis.com/maps/api/place/details/json"
#         f"?place_id={place_id}&key={GOOGLE_API_KEY}"
#     )
#     return requests.get(url).json()

@app.get("/forward-geocode")
def forward_geocode(input: str):
    # api_key = os.getenv("OPEN_CAGE_API_KEY")
    # print("TYPE OF API KEY: ", type(api_key))
    # url = f"https://api.opencagedata.com/geocode/v1/json?q={address}&key={api_key}"
    # response = requests.get(url)
    # return response.json()
    api_key = os.getenv("GOOGLE_API_KEY")
    print("TYPE OF GOOGLE API KEY: ", type(api_key))
    url = (
        f"https://maps.googleapis.com/maps/api/place/autocomplete/json"
        f"?input={input}&types=address&key={api_key}"
    )
    response = requests.get(url)
    print("RESPONSE STATUS CODE: ", response.json())
    return response.json()

@app.get("/reverse-geocode")
def reverse_geocode(lat: float, lon: float):
    api_key = os.getenv("OPEN_CAGE_API_KEY")
    print("TYPE OF API KEY: ", type(api_key))
    url = f"https://api.opencagedata.com/geocode/v1/json?q={lat}+{lon}&key={api_key}"
    response = requests.get(url)
    return response.json()
    

# Route for index.html
@app.get("/")
async def serve_index():
    return FileResponse("../client/dist/index.html")

@app.get("/api/hello")
async def hello():
    return {"message": "Hello from FastAPI"}

@app.post("/api/form")
async def submit_form(data: dict):
    print("Form data received:", data)
    return {"message": "Form submitted.", "data": data}

# Fallback for React Router paths (e.g. /about, /dashboard)
@app.get("/{full_path:path}")
async def serve_react_app():
    return FileResponse("../client/dist/index.html")