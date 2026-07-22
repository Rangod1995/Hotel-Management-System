document.addEventListener("DOMContentLoaded", () => {

    const grid = document.getElementById("calendarGrid");
    const monthYear = document.getElementById("currentMonthYear");

    let current = new Date();

    function renderCalendar(date){

        grid.innerHTML="";

        const year=date.getFullYear();
        const month=date.getMonth();

        monthYear.textContent=date.toLocaleDateString("en-US",{
            month:"long",
            year:"numeric"
        });

        const firstDay=new Date(year,month,1).getDay();
        const days=new Date(year,month+1,0).getDate();

        for(let i=0;i<firstDay;i++){

            const blank=document.createElement("div");
            blank.className="calendar-day other-month";

            grid.appendChild(blank);

        }

        for(let d=1;d<=days;d++){

            const cell=document.createElement("div");
            cell.className="calendar-day";

            const today=new Date();

            if(
                d===today.getDate() &&
                month===today.getMonth() &&
                year===today.getFullYear()
            ){
                cell.classList.add("today");
            }

            cell.innerHTML=`
                <div class="day-number">${d}</div>
            `;

            if(Math.random()>0.75){

                const event=document.createElement("div");

                event.className="day-event booking";

                event.textContent="Booking";

                cell.appendChild(event);

            }

            grid.appendChild(cell);

        }

    }

    document.getElementById("nextBtn").onclick=()=>{

        current.setMonth(current.getMonth()+1);

        renderCalendar(current);

    };

    document.getElementById("prevBtn").onclick=()=>{

        current.setMonth(current.getMonth()-1);

        renderCalendar(current);

    };

    document.getElementById("todayBtn").onclick=()=>{

        current=new Date();

        renderCalendar(current);

    };

    renderCalendar(current);

});