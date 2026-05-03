# AI Interview Evaluator 🚀

An end-to-end AI-powered interview evaluation platform that automates the transcription, summarization, and evaluation of interview recordings.

## 🌟 Features

-   **User Authentication**: Secure registration and login system.
-   **Role Management**: Create custom interview roles with specific requirements and expectations.
-   **Audio Pipeline**:
    -   **Transcription**: Powered by OpenAI Whisper for high-accuracy speech-to-text.
    -   **Summarization**: Automatically extracts key points from the interview transcript.
    -   **Evaluation**: AI-driven evaluation of the candidate's performance against the selected role.
-   **Comprehensive Reports**: View detailed reports of all processed interviews, including transcripts and feedback.
-   **File Support**: Supports multiple audio and video formats (wav, mp3, m4a, mp4, mov, webm).

## 🛠️ Technology Stack

### Backend
-   **Language**: Python 3.x
-   **Framework**: Flask
-   **AI/ML**:
    -   OpenAI Whisper (Transcription)
    -   Sentence-Transformers (Semantic Analysis)
    -   Torch & Transformers
-   **Audio Handling**: Pydub

### Frontend
-   **Framework**: React 19
-   **Styling**: Tailwind CSS & Framer Motion (Animations)
-   **Icons**: Lucide React & React Icons
-   **Routing**: React Router DOM

## 🚀 Getting Started

### Prerequisites
-   Python 3.8+
-   Node.js & npm
-   FFmpeg (required for audio processing with Whisper/Pydub)

### Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/Abivarshh5/AI-Interview-evaluator.git
    cd AI-Interview-evaluator
    ```

2.  **Backend Setup**:
    ```bash
    cd backend
    python -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    pip install -r requirements.txt
    ```

3.  **Frontend Setup**:
    ```bash
    cd ../frontend
    npm install
    ```

### Running the Project

You can run both the frontend and backend simultaneously using the provided batch script (Windows only):
```bash
./run_project.bat
```

**Alternatively, run them separately:**

-   **Backend**: `cd backend && python app.py` (Runs on http://127.0.0.1:5000)
-   **Frontend**: `cd frontend && npm start` (Runs on http://127.0.0.1:3000)

## 📁 Project Structure

```
AI-Interview-evaluator/
├── backend/                # Flask API & AI Logic
│   ├── data/               # Persistent JSON storage (users, roles, reports)
│   ├── uploads/            # Temporary storage for uploaded audio/video
│   ├── app.py              # Main API entry point
│   ├── whisper_model.py    # Speech-to-text logic
│   └── ...                 # Other AI modules (evaluator, summarizer)
├── frontend/               # React Application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page views (Dashboard, Evaluate, etc.)
│   │   └── App.js          # Main React entry point
│   └── ...
└── run_project.bat         # Startup script for Windows
```

## 📝 License

This project is for educational and evaluation purposes.
