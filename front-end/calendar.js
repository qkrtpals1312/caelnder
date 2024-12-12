// calendar.js

document.addEventListener("DOMContentLoaded", function() {
    const calendarBody = document.getElementById('calendar-body');
    const currentDate = new Date(2024, 11); // 기본값: 2024년 12월
    const monthNames = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];

    // 달력 생성 함수
    function renderCalendar() {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const lastDate = new Date(year, month + 1, 0).getDate();

        calendarBody.innerHTML = '';
        let row = document.createElement('tr');

        // 첫날 전 빈 칸 추가
        for (let i = 0; i < firstDay; i++) {
            row.appendChild(document.createElement('td'));
        }

        // 날짜 채우기
        for (let date = 1; date <= lastDate; date++) {
            const cell = document.createElement('td');
            cell.innerText = date;

            // 날짜 클릭 시, date.html로 이동
            cell.addEventListener('click', () => {
                window.location.href = `date.html?date=${encodeURIComponent(year + '-' + (month + 1) + '-' + date)}`;
            });

            row.appendChild(cell);

            // 주가 끝나면 새 행 추가
            if ((firstDay + date) % 7 === 0) {
                calendarBody.appendChild(row);
                row = document.createElement('tr');
            }
        }

        // 마지막 행 추가
        if (row.children.length > 0) {
            calendarBody.appendChild(row);
        }
    }

    renderCalendar();
});
