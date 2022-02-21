const dt = new Date();
const addBtn = document.getElementById("add-btn");
const uploadBtn = document.getElementById("upload-btn");
const updateBtn = document.getElementById("update-btn");
const deleteBtn = document.getElementById("delete-btn");
const listBtn = document.getElementById("list-btn");
const messages = document.querySelector(".messages");
const messageTXT = document.querySelector(".message");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");
const dateInput = document.getElementById("date");
const photoInput = document.querySelector(".photo");
const titleInput = document.getElementById("title");
const descriptionInput = document.getElementById("description");
const close = document.getElementById("close");
const closeList = document.getElementById("close-list");

var currentMonth = dt.getMonth() + 1;
var presentMonth = dt.getMonth() + 1;
var currentYear = dt.getFullYear();
var items = [];
var monthCount = 1;
var weekDay = document.querySelectorAll(".week-day");
var today = new Date();
var currentDay = String(today.getDate()).padStart(2, "0");
var photo = "";
var isEdit = false;
var updateId = "";
var title = "";
var description = "";
var startDate = "";
var endDate = "";
var fullDateAttr = "";

// Add birthdays to rendered calendar
addBirthdays = async (start, current, end) => {
  const result = await axios
    .get("/birthday/get_birthdays", {
      params: {
        start,
        current,
        end,
      },
    })
    .catch(function (error) {
      console.error(error);
    });

  const birtdhayArr = result.data.birthdays;

  birtdhayArr.forEach((birthday) => {
    let attr = birthday.birth_date.substring(5, 10);
    let attrQuery = `[fullDate='${attr}']`;
    let milisec = dt - new Date(birthday.birth_date);
    let age = Math.floor(milisec / 1000 / 60 / 60 / 24 / 365);

    if (age < 0) {
      age = 0;
    }

    const convertedDate = birthday.birth_date.substring(0, 10);
    const addDay = document.querySelector(attrQuery);
    if (addDay) {
      addDay.children[1].innerHTML += `
    <div id=${birthday.id}   class = "box schedule" onClick="update(this)">
        <span class = "count" >${age}</span>
        <img class = "img-scheduel" src="${birthday.photo}" alt="">
        <p class = "user-name">${birthday.name}</p>
        <p class = "user-email">${birthday.email}</p>
        <p class = "user-phone">${birthday.phone}</p>
        <p class = "user-date">${convertedDate}</p>
        <p class = "user-title">${birthday.title}</p>
        <p class = "user-description">${birthday.description}</p>
    </div>`;
    }
  });
};

// First render calenda with birthdays
renderCalendar();

document.querySelector(".previous").addEventListener("click", function () {
  if (currentMonth > 1) {
    currentMonth--;
    renderCalendar();
  } else {
    currentYear--;
    currentMonth = 12;
    renderCalendar();
  }
});

document.querySelector(".next").addEventListener("click", function () {
  if (currentMonth < 12 || currentMonth == 0) {
    currentMonth++;

    renderCalendar();
  } else {
    currentYear++;
    currentMonth = 1;
    renderCalendar();
  }
});

// Render birthday list
listBtn.addEventListener("click", async () => {
  const result = await axios
    .get("/birthday/get_all_birthdays")
    .then(function (result) {
      var modal = document.getElementById("list-modal");
      modal.style.display = "block";

      var span = document.getElementById("close-list");
      span.onclick = function () {
        modal.style.display = "none";
      };

      window.onclick = function (event) {
        if (event.target == modal) {
          modal.style.display = "none";
        }
      };

      createListBirthday(result.data.birthdays);
    })
    .catch(function (error) {
      console.error(error);
    });
});

// Display calendar and render days with birthdays
function renderCalendar() {
  const month = currentMonth;
  const year = currentYear;
  const daysInMonth = new Date(year, month, 0).getDate();
  const firstDayOfMonth = new Date(month + " 1, " + year).getDay();
  const calendar = document.querySelector(".days-container");
  const date = new Date(year, month - 1, 1);
  const monthStr = date.toLocaleString("default", { month: "long" });

  document.querySelector(".year-heading").textContent = year;
  document.querySelector(".month-heading").textContent = monthStr + ", ";

  let allDays = "";

  var dayNumber = 1;
  var oldMonth = false;
  var oldMonthArr = [];
  var newMonth = false;
  var dayId = 0;

  if (firstDayOfMonth > 1) {
    const previusMonth = month - 1;
    var oldMonthDaysInMonth = new Date(year, previusMonth, 0).getDate();
    oldMonth = true;
    for (day = 1; day < firstDayOfMonth; day++) {
      oldMonthArr.push(oldMonthDaysInMonth);
      oldMonthDaysInMonth--;
    }
  } else if (firstDayOfMonth == 0) {
    const previusMonth = month - 1;
    oldMonthDaysInMonth = new Date(year, previusMonth, 0).getDate();
    oldMonth = true;

    for (day = 1; day < 7; day++) {
      oldMonthArr.push(oldMonthDaysInMonth);
      oldMonthDaysInMonth--;
    }
  }

  let mon = currentMonth - 1;

  if (!oldMonthArr.length > 0) {
    mon = mon + 1;
  }

  if (mon == 0) {
    mon = "12";
  }

  startDate = mon;

  for (w = 1; w <= 6; w++) {
    allDays += `<div class = "week week-${w}">`;

    for (d = 1; d <= 7; ) {
      dayId++;
      if (oldMonth) {
        const reversed = oldMonthArr.reverse();
        reversed.forEach((day) => {
          let month = currentMonth - 1;
          if (month < 10) {
            month = "0" + month;
          }

          fullDateAttr = month + "-" + day;
          if (day < 10) {
            fullDateAttr = month + "-0" + day;
          }

          allDays += `<div id = "old${d}" fullDate=${fullDateAttr} day=${day}  month = ${month} class = "old week-day week-day-old week-day-${day}" onClick = "openModal('old${d}')">
                        <div><p>${day}</p></div>
                        <div class="schedual-container"></div>
                        </div>`;
          d++;
        });
        oldMonth = false;
      } else {
        if (newMonth) {
          let month = currentMonth + 1;

          if (month == 13) {
            month = "01";
          }

          if (month < 10) {
            month = "0" + month;
          }
          fullDateAttr = month + "-" + dayNumber;

          if (dayNumber < 10) {
            fullDateAttr = month + "-0" + dayNumber;
          }

          allDays += `<div id = "${dayId}" fullDate=${fullDateAttr} day=${dayNumber}  month = ${month}  class = "old week-day week-day-${dayNumber}" onClick = "openModal('${dayId}')">
                        <div><p>${dayNumber}</p></div>
                        <div class="schedual-container"></div>
                        </div>`;
          dayNumber++;
          d++;
        } else {
          let month = currentMonth;

          if (month < 10) {
            month = "0" + month;
          }
          fullDateAttr = month + "-" + dayNumber;

          if (dayNumber < 10) {
            fullDateAttr = month + "-0" + dayNumber;
          }
          allDays += `<div id = "${dayId}" fullDate=${fullDateAttr} day=${dayNumber}  month = ${currentMonth}  class = "week-day week-day-${dayNumber}" onClick = "openModal('${dayId}')">
                        <div><p>${dayNumber}</p></div>
                        <div class="schedual-container"></div>
                        </div>`;
          dayNumber++;
          d++;
        }

        if (dayNumber > daysInMonth) {
          dayNumber = 1;
          newMonth = true;
        }
      }
    }

    allDays += "</div>";
  }

  let newMonthCoverted = currentMonth + 1;
  let currentMonthConverted = newMonthCoverted - 1;
  if (newMonthCoverted == 13) {
    newMonthCoverted = 1;
    currentMonthConverted = 12;
  }

  calendar.innerHTML = allDays;

  addBirthdays(startDate, currentMonthConverted, newMonthCoverted);
}

// Open modal for add update and delete birthday
function openModal(id) {
  if (!isEdit) {
    nameInput.value = "";
    emailInput.value = "";
    phoneInput.value = "";
    titleInput.value = "";
    descriptionInput.value = "";
    photoInput.setAttribute("src", "");
    photo = "";
    updateBtn.style.display = "none";
    deleteBtn.style.display = "none";
    uploadBtn.style.display = "block";
    addBtn.style.display = "inline-block";

    const dayDom = document.getElementById(id);
    let setDay = dayDom.getAttribute("day");
    let setMonth = dayDom.getAttribute("month");

    if (setMonth.length == 1) {
      setMonth = "0" + setMonth;
    }
    if (setDay.length == 1) {
      setDay = "0" + setDay;
    }
    document.querySelector(
      "#date"
    ).value = `${currentYear}-${setMonth}-${setDay}`;
  } else {
    updateBtn.style.display = "inline-block";
    deleteBtn.style.display = "inline-block";
    uploadBtn.style.display = "none";
    addBtn.style.display = "none";
  }

  addBtn.setAttribute("data-id", id);

  var modal = document.getElementById("myModal");

  modal.style.display = "block";

  var span = document.getElementsByClassName("close")[0];

  span.onclick = function () {
    modal.style.display = "none";
  };

  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };
  isEdit = false;
}

// Upload picture
uploadBtn.addEventListener("click", async function () {
  let date = document.getElementById("date").value;

  if (new Date(date) > dt || new Date(date) < new Date("1996-02-01")) {
    date = 2021 + date.substring(4);
  }
  const API = `https://api.nasa.gov/planetary/apod?api_key=uTDBSMDyePEE2CIamVMajqWEFhktmAIS4xeFx4De&date=${date}`;

  await axios
    .get(API)
    .then(function (response) {
      if (response.data.media_type == "video") {
        photo = "./img/default.jpg";
      } else {
        photo = response.data.url;
      }
      title = response.data.title;
      description = response.data.explanation;
      photoInput.src = photo;
      titleInput.value = title;
      descriptionInput.value = description;
    })
    .catch(function (error) {
      console.error(error);
    });
});

// Add birthday
addBtn.addEventListener("click", async function () {
  const id = this.getAttribute("data-id");
  let count = document.getElementById(id).children[1].childElementCount;
  let status = "";
  let message = "";

  count += 1;
  const name = nameInput.value;
  const email = emailInput.value;
  const phone = phoneInput.value;
  const date = dateInput.value;
  title = titleInput.value;
  description = descriptionInput.value;
  const num = Math.random() * 10000;
  let dbId = "drg" + id + num;

  var regEx = /^\d{4}-\d{2}-\d{2}$/;
  let isDateValid = true;

  if (!date.match(regEx)) {
    isDateValid = false;
  } else {
    var d = new Date(date);
    var dNum = d.getTime();
    if (!dNum && dNum !== 0) isDateValid = false;
    isDateValid = d.toISOString().slice(0, 10) === date;
  }

  await axios
    .post("/birthday/add_birthday", {
      id: dbId,
      name,
      photo,
      birth_date: date,
      email,
      phone,
      title,
      description,
    })
    .then(function (response) {
      status = response.data.status;
      message = response.data.message;
      messageTXT.textContent = message;
      messages.style.display = "block";

      setTimeout(() => {
        messages.style.display = "none";
      }, 2000);
    })
    .catch(function (error) {
      console.error(error);
    });

  if (name && email && phone && isDateValid && photo && status !== "error") {
    let milisec = dt - new Date(date);
    let age = Math.floor(milisec / 1000 / 60 / 60 / 24 / 365);

    if (age < 0) {
      age = 0;
    }
    let attrQuery = `[fullDate='${date.substring(5, 10)}']`;
    const addDay = document.querySelector(attrQuery);
    if (addDay) {
      addDay.children[1].innerHTML += `
    <div id=${dbId}  class = "box schedule" onClick="update(this)">
        <span class = "count" >${age}</span>
        <img class = "img-scheduel" src="${photo}" alt="">
        <p class = "user-name">${name}</p>
        <p class = "user-email">${email}</p>
        <p class = "user-phone">${phone}</p>
        <p class = "user-date">${date}</p>
        <p class = "user-title">${title}</p>
        <p class = "user-description">${description}</p>
    </div>`;

      close.click();
    }

    //renderDay(id);

    photo = "";
  } else {
    messageTXT.textContent =
      "All input fields and photo are mandatory and phone number and email must be unique.";
    messages.style.display = "block";

    setTimeout(() => {
      messages.style.display = "none";
    }, 2000);
  }
});

// Update birthday
updateBtn.addEventListener("click", async function () {
  let name = nameInput.value;
  let email = emailInput.value;
  let phone = phoneInput.value;
  let date = dateInput.value;
  let title = titleInput.value;
  let description = descriptionInput.value;

  await axios
    .put("/birthday/update_birthday", {
      id: updateId,
      name,
      birth_date: date,
      email,
      phone,
      title,
      description,
    })
    .then(function (response) {
      let status = response.data.status;
      let message = response.data.message;
      messageTXT.textContent = message;
      messages.style.display = "block";

      const updateBirthdatUI = document.getElementById(updateId);
      //let count = updateBirthdatUI[i].children[0].innerText = name;
      updateBirthdatUI.children[2].textContent = name;
      updateBirthdatUI.children[3].textContent = email;
      updateBirthdatUI.children[4].textContent = phone;
      updateBirthdatUI.children[5].textContent = date;
      updateBirthdatUI.children[6].textContent = title;
      updateBirthdatUI.children[7].textContent = description;

      setTimeout(() => {
        messages.style.display = "none";
      }, 2000);

      close.click();
    })
    .catch(function (error) {
      console.error(error);
    });
});

// Delete birthday
deleteBtn.addEventListener("click", async function () {
  await axios
    .delete("/birthday/delete_birthday", {
      params: {
        id: updateId,
      },
    })
    .then(function (response) {
      let status = response.data.status;
      let message = response.data.message;
      messageTXT.textContent = message;

      messages.style.display = "block";

      document.getElementById(updateId).remove();

      setTimeout(() => {
        messages.style.display = "none";
      }, 2000);

      close.click();
    })
    .catch(function (error) {
      console.error(error);
    });
});

update = (birthday) => {
  isEdit = true;

  let picture = birthday.children[1].getAttribute("src");
  let name = birthday.children[2].textContent;
  let email = birthday.children[3].textContent;
  let phone = birthday.children[4].textContent;
  let date = birthday.children[5].textContent;
  let title = birthday.children[6].textContent;
  let description = birthday.children[7].textContent;

  updateId = birthday.getAttribute("id");
  nameInput.value = name;
  emailInput.value = email;
  phoneInput.value = phone;
  dateInput.value = date;
  photoInput.src = picture;
  titleInput.value = title;
  descriptionInput.value = description;
};

updateList = async (id) => {
  isEdit = true;

  const result = await axios
    .get("/birthday/get_one_birthday", {
      params: {
        id,
      },
    })
    .catch(function (error) {
      console.error(error);
    });

  updateId = id;
  nameInput.value = result.data.birthdays.name;
  emailInput.value = result.data.birthdays.email;
  phoneInput.value = result.data.birthdays.phone;
  dateInput.value = result.data.birthdays.birth_date.substring(0, 10);
  photoInput.src = result.data.birthdays.photo;
  titleInput.value = result.data.birthdays.title;
  descriptionInput.value = result.data.birthdays.description;
  openModal(id);
  closeList.click();
};

createListBirthday = (birthdays) => {
  let html = "";

  birthdays.forEach((birthday) => {
    let date = birthday.birth_date.substring(0, 10);
    var comCount = 1;
    let day = date.substring(8);
    let month = date.substring(7, 9);

    html += `
    <button day = ${day} month= ${month} class="btn-none" id= '${birthday.id}' onClick="updateList('${birthday.id}') ">
        <div class="birthday-container">
            <div class="birthday-details">
                <div class='info-1 info'>
                    <p class="name text-white"><span>Name:</span><br>${birthday.name}</p>
                    <p class="date text-white"><span>Date:</span><br>${date}</p>
                </div>
                <div class='info-2 info'>
                    <p class="email text-white"><span>Email:</span><br> ${birthday.email}</p>
                </div>
            </div>
            <div class="pictures-container">
                <img class = "img-list" src="${birthday.photo}"></img>    
            </div>
        </div>
    </button>
        `;

    var rows = 4;

    if (screen.width < 1200 && screen.width > 800) {
      rows = 3;
    } else if (screen.width < 800 && screen.width > 600) {
      rows = 2;
    } else if (screen.width < 600) {
      rows = 1;
    }

    if (comCount % rows === 0) {
      html += `<div class="break"></div>`;
    }
    comCount++;
  });

  document.querySelector(".list-container").innerHTML = html;

  isEdit = true;
};
