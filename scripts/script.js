const clock_display= document.querySelector(".clock_display");
const clock_timeZoneDiv= document.querySelector(".clock_timeZone div");
const darkModeToggle = document.getElementById('switch');
const body = document.body;
const hour = document.getElementById("hour");
const minute = document.getElementById("minute");
const second = document.getElementById("second");
const hr = document.getElementsByClassName("hr")[0];
const min = document.getElementsByClassName("min")[0];
const sec = document.getElementsByClassName("sec")[0];
const header= document.querySelector("header");
const pos= document.documentElement;
const mouseDecor= document.querySelector(".mouseDecoration");
// console.log(header.clientHeight)

if(window.innerWidth>1200){
document.documentElement.addEventListener('mousemove', _.throttle((e) => {
  let y=0;
  let x=0;
  // if(body.classList.contains("lightMode")){
  //  x= 10+ e.clientX + "px";
  // y=10;
  // }else{
   x= e.clientX+"px";
  // }
  y= (e.clientY-header.clientHeight +y)+"px";

  pos.style.setProperty('--x', x);
  pos.style.setProperty('--y', y);
  
  // mouseDecor.style.left= x;
  // mouseDecor.style.top= y;
}, 40));

}
darkModeToggle.addEventListener('click', () => {
  // console.log("clicked");
  body.classList.toggle('lightMode');
});
const clockDisplay = document.querySelector('.clock_display');
const selectTimeZone = document.querySelector('#selct_timeZone');

function removeShimmer(ele){
  ele.parentElement.classList.remove("loading");
}
let clock_load=0;

function interVal(newDate) {
  // console.log("I am called");

  async function updateClock() {
    let status= await clock(newDate.getHours(), newDate.getMinutes(), newDate.getSeconds());
    if(clock_load==0){
    // console.log(status);
    clock_display.style.display= "flex";
    clock_timeZoneDiv.style.display= "flex";
    removeShimmer(clock_display);
    removeShimmer(clock_timeZoneDiv);
    clock_load++;
  }
    newDate.setSeconds(newDate.getSeconds() + 1);
  }

  let inter = setInterval(updateClock, 1000);
  return inter;
}
let startClock = interVal(new Date());
const ampm= document.querySelector("#ampm");
function clock(currHour, currMin, currSec){
  return new Promise((resolve, reject)=>{
    try{
    let minDeg = (6 * currMin + (0.1 * currSec));
    let hourDeg = (30 * currHour + (1 / 120 * currSec));
  
    // console.log(`${currHour}: ${currMin}:${currSec}`);
    second.style.rotate = `calc(6deg *${currSec})`;
    minute.style.rotate = `calc(${minDeg}deg)`;
    hour.style.rotate = `calc(${hourDeg}deg)`;

    // console.log("currHour: ", currHour);
      // console.log("currMin: ", currMin);
    ampm.innerText = currHour>12 ? "PM":"AM";
    currHour = currHour > 12 ? currHour - 12 : currHour;
    hr.innerText = currHour < 10 ? "0" + currHour : currHour;
    currMin = currMin < 10 ? "0" + currMin : currMin;
    min.innerText = currMin;
  
    currSec = currSec < 10 ? "0" + currSec : currSec;
    sec.innerText = currSec;
    resolve("Success");
  }catch(err){
    reject(err);
  }
  })

}

//fetching request
const select = document.getElementById("time_zone");
const clock_timeZone = document.querySelector(".clock_timeZone span");

async function timeZoneLoader(){
  return new Promise(async(resolve, reject)=>{
    try {
      fetch("https://worldtimeapi.org/api/timezone").then(val => val.json()).then(val => {
  // console.log(select);
  select.innerHTML = '';
  for (let i = 0; i < val.length; i++) {
    select.innerHTML += `<option value=${val[i]}>${val[i]}</option>`
  }
  var options = { searchable: true };
  NiceSelect.bind(document.getElementById("time_zone"), options);
  resolve();
})
    } catch (error) {
      reject(error);
    }
  })
}


select.addEventListener("change", (e) => {
  
  let url = `https://worldtimeapi.org/api/timezone/${e.target.value}`;
  clock_display.style.display="none";
  clock_timeZoneDiv.style.display="none";
  clock_display.parentElement.classList.add("loading");
  clock_timeZoneDiv.parentElement.classList.add("loading");
  fetch(url).then(data => data.json()).then( async(data2) => {

    clearInterval(startClock);
    let utcString= await data2["utc_datetime"];
    let utc_offset= await data2["utc_offset"];
    let newDate= new Date(utcString);
    let targetTimeZone= e.target.value;
    let targetTime = new Date(newDate.toLocaleString('en-US', {
      timeZone: targetTimeZone}));
      clock_timeZone.innerText= `${e.target.value} (UTC ${utc_offset})`
    console.log(`Time in ${e.target.value} is: `, targetTime);
    clock_load=0;
    startClock = interVal(targetTime);
  })
  // console.log(e.target.value);
})

const display_tz = document.querySelector(".display_timeZones");
const timeZone_time = document.querySelectorAll(".timeZone_time");
const timeZone_UTC = document.querySelectorAll(".timeZone_UTC");
const zone_UTC = document.querySelectorAll(".zone_UTC");
const tzCards = document.querySelectorAll(".timeZoneCard");

async function fetchAndDisplayTime(i) {

    const tzAttribute = tzCards[i].getAttribute("tz");
    // console.log(tzAttribute);
    
    try {
      const response = await fetch(`https://worldtimeapi.org/api/timezone/${tzAttribute}`);
      const data = await response.json();

      const utcString = data["utc_datetime"];
      const utcZone = data["utc_offset"];
      const newDate = new Date(utcString);
      let targetTime = new Date(newDate.toLocaleString('en-US', {
        timeZone: tzAttribute
      }));
      
      timeZone_UTC[i].innerText = `UTC ${utcZone}`;
      zone_UTC[i].innerHTML = `<h3>${tzAttribute}</h3>`;

        const hr = targetTime.getHours() < 10 ? "0" + targetTime.getHours() : targetTime.getHours();
        const min = targetTime.getMinutes() < 10 ? "0" + targetTime.getMinutes() : targetTime.getMinutes();
        timeZone_time[i].innerText = `${hr}:${min}`;

        return Promise.resolve(targetTime);
    } catch (error) {
      console.error("Error fetching data:", error);
      return Promise.reject(error); // Reject the promise if an error occurs
    }

}

function incrementOneSec(date){
  date.setSeconds(date.getSeconds()+1);
  return date;
}

async function formLoader(){
  const sub_heading= document.querySelector(".sub_heading");
  timeZoneLoader().then(()=>{
    // console.log("loaded");
  sub_heading.style.display="flex";
  removeShimmer(sub_heading);
  const nice_select = document.querySelector(".nice-select");
  nice_select.style.display="flex";
  removeShimmer(nice_select);
  })

  const timeZone_card = document.querySelectorAll(".timeZoneCard");

  for(let i =0; i<tzCards.length; i++){
    fetchAndDisplayTime(i).then((targetTime)=>{
      for(let i = 0 ; i<timeZone_card.length; i++){
        // console.log(timeZone_card[i]);
        timeZone_card[i].style.display="flex";
        removeShimmer(timeZone_card[i]);
      }

      function updatingEverySec(){
        targetTime = incrementOneSec(targetTime);
        const hr = targetTime.getHours() < 10 ? "0" + targetTime.getHours() : targetTime.getHours();
        const min = targetTime.getMinutes() < 10 ? "0" + targetTime.getMinutes() : targetTime.getMinutes();
        timeZone_time[i].innerText = `${hr}:${min}`;
      }
      setInterval(updatingEverySec, 1000);

    });
  }
}

formLoader();
