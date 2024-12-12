// date.js
let date = null;  // 전역으로 date 변수 선언

document.addEventListener("DOMContentLoaded", function() {
    const params = new URLSearchParams(window.location.search);
    date = params.get('date');  // 전역 변수로 date 값을 할당
    document.getElementById('selected-date').innerText = date
        ? `선택한 날짜: ${date}`
        : '날짜 정보가 없습니다.';

    // 서버에서 해당 날짜의 데이터를 불러오기
    async function loadData() {
        try {
            const response = await fetch(`http://localhost:5000/api/calendar/${date}`);
            const result = await response.json();
            
            if (result.success) {
                const entry = result.entry;
                document.getElementById('diary').value = entry.diary;
                document.getElementById('mood').value = entry.mood;

                const checklist = document.getElementById('checklist');
                entry.checklist.forEach(item => {
                    const newItem = document.createElement('li');

                    const checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.checked = item.checked;

                    const textInput = document.createElement('input');
                    textInput.type = 'text';
                    textInput.value = item.text;

                    newItem.appendChild(checkbox);
                    newItem.appendChild(textInput);
                    checklist.appendChild(newItem);
                });
            } else {
                console.log('해당 날짜에 저장된 데이터가 없습니다.');
            }
        } catch (error) {
            console.error('조회 오류:', error);
            alert('서버와의 연결에 문제가 발생했습니다.');
        }
    }

    if (date) {
        loadData();
    } else {
        alert('날짜 정보가 없습니다.');
    }
});

async function saveData() {
    const diary = document.getElementById('diary').value; // 한 줄 일기 내용
    const mood = document.getElementById('mood').value;   // 오늘 기분
    const checklist = document.getElementById('checklist').children; // 체크리스트

    const checklistData = Array.from(checklist).map(item => ({
        checked: item.querySelector('input[type="checkbox"]').checked,
        text: item.querySelector('input[type="text"]').value,
    }));

    const data = {
        date,
        diary,
        mood,
        checklist: checklistData
    };

    try {
        // 서버로 POST 요청 보내기
        const response = await fetch('http://localhost:5000/api/calendar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        if (result.success) {
            alert(`데이터가 저장되었습니다!\n날짜: ${date}\n일기: ${diary}\n기분: ${mood}`);
        } else {
            alert('저장에 실패했습니다.');
        }
    } catch (error) {
        console.error('저장 오류:', error);
        alert('서버와의 연결에 문제가 발생했습니다.');
    }
}

// 저장 버튼에 saveData() 연결
document.getElementById('save-button').addEventListener('click', saveData);
