API Documentation
Endpoint: /predict
Method: POST
Request: multipart/form-data with an audio file (.wav, .mp3 etc.)

Example using fetch (React/Vite JS):

javascript
const formData = new FormData();
formData.append("audio", audioFile);

fetch("https://xxxx.ngrok.io/predict", {
  method: "POST",
  body: formData
}).then(res => res.json())
  .then(data => {
     // data.segments: [{segment, start_sec, end_sec, label, confidence}, ...]
     // data.summary: {label: count, ... }
  });
Success Response:
json
{
  "segments": [
    { "segment": 1, "start_sec": 0.0, "end_sec": 2.0, "label": "Interjection", "confidence": 0.63 },
    { "segment": 2, "start_sec": 1.0, "end_sec": 3.0, "label": "NoStutteredWords", "confidence": 0.42 },
    // ... (Its very long as it divides audio into 2sec to identify classes)
  ],
  "summary": {
    "Interjection": 4,
    "NoStutteredWords": 10,
    // ...
  }
}

Endpoint: https://7e1353b6ee4f.ngrok-free.app

Sample output:
Prediction Results:

Segment 1 (0s–2s): Block (0.49)
Segment 2 (1s–3s): NoStutteredWords (0.49)
Segment 3 (2s–4s): Prolongation (0.49)
Segment 4 (3s–5s): Prolongation (0.57)
Segment 5 (4s–6s): Block (0.45)
Segment 6 (5s–7s): Prolongation (0.33)
Segment 7 (6s–8s): NoStutteredWords (0.49)
Segment 8 (7s–9s): NoStutteredWords (0.44)
Segment 9 (8s–10s): Interjection (0.44)
Segment 10 (9s–11s): WordRep (0.5)
Segment 11 (10s–12s): Prolongation (0.49)
Segment 12 (11s–13s): Prolongation (0.76)
Segment 13 (12s–14s): Prolongation (0.49)
Segment 14 (13s–15s): Interjection (0.62)
Segment 15 (14s–16s): NoStutteredWords (0.55)
Segment 16 (15s–17s): Prolongation (0.61)
Segment 17 (16s–18s): Block (0.47)
Segment 18 (17s–19s): Block (0.65)
Segment 19 (18s–20s): NoStutteredWords (0.4)
Segment 20 (19s–21s): Block (0.37)
Segment 21 (20s–22s): Block (0.59)
Segment 22 (21s–23s): Block (0.42)
Segment 23 (22s–24s): NoStutteredWords (0.39)
Segment 24 (23s–25s): NoStutteredWords (0.34)
Segment 25 (24s–26s): Block (0.37)
Segment 26 (25s–27s): Prolongation (0.34)
Segment 27 (26s–28s): NoStutteredWords (0.36)
Segment 28 (27s–29s): SoundRep (0.43)
Segment 29 (28s–30s): Block (0.35)
Segment 30 (29s–31s): NoStutteredWords (0.35)
Segment 31 (30s–32s): Block (0.76)
Segment 32 (31s–33s): Prolongation (0.33)
Segment 33 (32s–34s): Interjection (0.61)
Segment 34 (33s–35s): Interjection (0.39)
Segment 35 (34s–36s): Prolongation (0.33)
Segment 36 (35s–37s): Prolongation (0.61)
Segment 37 (36s–38s): Interjection (0.5)
Segment 38 (37s–39s): Block (0.5)
Segment 39 (38s–40s): NoStutteredWords (0.44)
Segment 40 (39s–41s): Interjection (0.53)
Segment 41 (40s–42s): Prolongation (0.31)
Segment 42 (41s–43s): NoStutteredWords (0.46)
Segment 43 (42s–44s): Block (0.27)
Segment 44 (43s–45s): NoStutteredWords (0.51)
Segment 45 (44s–46s): Interjection (0.81)
Segment 46 (45s–47s): Interjection (0.79)
Segment 47 (46s–48s): Interjection (0.64)
Segment 48 (47s–49s): Prolongation (0.36)
Segment 49 (48s–50s): Prolongation (0.52)
Segment 50 (49s–51s): Block (0.5)
Segment 51 (50s–52s): NoStutteredWords (0.37)
Segment 52 (51s–53s): NoStutteredWords (0.73)
Segment 53 (52s–54s): NoStutteredWords (0.38)
Segment 54 (53s–55s): Block (0.61)
Segment 55 (54s–56s): NoStutteredWords (0.39)
Segment 56 (55s–57s): SoundRep (0.51)
Segment 57 (56s–58s): NoStutteredWords (0.36)
Segment 58 (57s–59s): Interjection (0.52)
Segment 59 (58s–60s): SoundRep (0.93)
Segment 60 (59s–61s): WordRep (0.49)
Segment 61 (60s–62s): WordRep (0.49)
Segment 62 (61s–63s): Prolongation (0.4)
Segment 63 (62s–64s): Block (0.31)
Segment 64 (63s–65s): NoStutteredWords (0.36)
Segment 65 (64s–66s): Prolongation (0.56)
Segment 66 (65s–67s): Prolongation (0.7)
Segment 67 (66s–68s): Block (0.35)
Segment 68 (67s–69s): Block (0.47)
Segment 69 (68s–70s): Prolongation (0.4)
Segment 70 (69s–71s): NoStutteredWords (0.41)
Segment 71 (70s–72s): Prolongation (0.35)
Segment 72 (71s–73s): Block (0.55)
Segment 73 (72s–74s): Block (0.39)
Segment 74 (73s–75s): Block (0.52)
Segment 75 (74s–76s): NoStutteredWords (0.43)
Segment 76 (75s–77s): SoundRep (0.74)
Segment 77 (76s–78s): NoStutteredWords (0.46)
Segment 78 (77s–79s): Block (0.38)
Segment 79 (78s–80s): Interjection (0.75)
Segment 80 (79s–81s): Prolongation (0.39)
Segment 81 (80s–82s): NoStutteredWords (0.48)
Segment 82 (81s–83s): NoStutteredWords (0.44)
Segment 83 (82s–84s): NoStutteredWords (0.55)
Segment 84 (83s–85s): NoStutteredWords (0.51)
Segment 85 (84s–86s): NoStutteredWords (0.47)
Segment 86 (85s–87s): Prolongation (0.45)
Segment 87 (86s–88s): Block (0.42)
Segment 88 (87s–89s): Prolongation (0.51)
Segment 89 (88s–90s): Block (0.73)
Segment 90 (89s–91s): NoStutteredWords (0.52)
Segment 91 (90s–92s): Interjection (0.62)
Segment 92 (91s–93s): SoundRep (0.33)
Segment 93 (92s–94s): Block (0.26)
Segment 94 (93s–95s): NoStutteredWords (0.35)
Segment 95 (94s–96s): NoStutteredWords (0.54)
Segment 96 (95s–97s): NoStutteredWords (0.39)
Segment 97 (96s–98s): Block (0.63)
Segment 98 (97s–99s): NoStutteredWords (0.51)
Segment 99 (98s–100s): NoStutteredWords (0.41)
Segment 100 (99s–101s): NoStutteredWords (0.56)
Segment 101 (100s–102s): Block (0.32)
Segment 102 (101s–103s): Block (0.41)
Segment 103 (102s–104s): Prolongation (0.47)
Segment 104 (103s–105s): Block (0.54)
Segment 105 (104s–106s): SoundRep (0.82)
Segment 106 (105s–107s): Block (0.68)
Segment 107 (106s–108s): NoStutteredWords (0.42)
Segment 108 (107s–109s): Interjection (0.38)
Segment 109 (108s–110s): NoStutteredWords (0.51)
Segment 110 (109s–111s): Block (0.43)
Segment 111 (110s–112s): NoStutteredWords (0.51)
Segment 112 (111s–113s): NoStutteredWords (0.58)
Segment 113 (112s–114s): NoStutteredWords (0.66)
Segment 114 (113s–115s): Interjection (0.46)
Segment 115 (114s–116s): Interjection (0.73)
Segment 116 (115s–117s): Prolongation (0.54)
Segment 117 (116s–118s): Block (0.39)
Segment 118 (117s–119s): NoStutteredWords (0.38)
Segment 119 (118s–120s): Block (0.69)
Segment 120 (119s–121s): NoStutteredWords (0.34)
Segment 121 (120s–122s): Block (0.44)
Segment 122 (121s–123s): Block (0.36)
Segment 123 (122s–124s): NoStutteredWords (0.47)
Segment 124 (123s–125s): Block (0.45)
Segment 125 (124s–126s): Block (0.62)
Segment 126 (125s–127s): Prolongation (0.4)
Segment 127 (126s–128s): SoundRep (0.55)
Segment 128 (127s–129s): SoundRep (0.42)
Segment 129 (128s–130s): Interjection (0.38)
Segment 130 (129s–131s): NoStutteredWords (0.48)
Segment 131 (130s–132s): Block (0.44)
Segment 132 (131s–133s): NoStutteredWords (0.38)

Summary:
Block: 37
NoStutteredWords: 43
Prolongation: 25
Interjection: 16
WordRep: 3
SoundRep: 8


What i want???
Take the audio from user (jam & passages same) --> store in firebase --> analyse it --> store analysis as json (same name as audio name) [will be useful for furthur analysis]
PS: I have deployed it using ngrok (link in .env)