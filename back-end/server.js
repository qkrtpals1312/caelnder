const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB 연결
mongoose.connect('mongodb://127.0.0.1:27017/calendarApp', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB 연결 성공'))
.catch(err => console.error('MongoDB 연결 실패:', err));

// 데이터 스키마 정의
const CalendarEntrySchema = new mongoose.Schema({
    date: { type: String, required: true, unique: true },
    diary: { type: String },
    mood: { type: String },
    checklist: [
        { text: { type: String }, checked: { type: Boolean, default: false } }
    ]
});
const CalendarEntry = mongoose.model('CalendarEntry', CalendarEntrySchema);

// API: 새 기록 저장 및 업데이트
app.post('/api/calendar', async (req, res) => {
    try {
        const { date, diary, mood, checklist } = req.body;
        let entry = await CalendarEntry.findOne({ date });

        if (entry) {
            entry.diary = diary;
            entry.mood = mood;
            entry.checklist = checklist;
            await entry.save();
        } else {
            entry = new CalendarEntry({ date, diary, mood, checklist });
            await entry.save();
        }

        res.status(201).json({ success: true, entry });
    } catch (err) {
        res.status(500).json({ success: false, message: '저장 오류', error: err.message });
    }
});

// API: 특정 날짜 기록 조회
app.get('/api/calendar/:date', async (req, res) => {
    try {
        const { date } = req.params;
        const entry = await CalendarEntry.findOne({ date });

        if (!entry) {
            return res.status(404).json({ success: false, message: '기록 없음' });
        }

        res.json({ success: true, entry });
    } catch (err) {
        res.status(500).json({ success: false, message: '조회 오류', error: err.message });
    }
});

// API: 특정 날짜 초기 저장 (빈 데이터)
app.post('/api/date', async (req, res) => {
    try {
        const { date } = req.body;
        let entry = await CalendarEntry.findOne({ date });

        if (!entry) {
            entry = new CalendarEntry({ date, diary: '', mood: '', checklist: [] });
            await entry.save();
        }

        res.status(201).json({ success: true, message: '날짜 저장 성공', entry });
    } catch (err) {
        res.status(500).json({ success: false, message: '저장 오류', error: err.message });
    }
});

// 서버 실행
app.listen(PORT, () => {
    console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});
