To run app:

# Terminal 1 (Backend)
source venv/Scripts/activate
cd server
uvicorn main:app --reload

# Terminal 2 (Frontend)
cd client
npm run dev
