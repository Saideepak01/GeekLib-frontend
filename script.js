//geeklib navbar
const navBar = document.querySelector(".mainScreen");
navBar.innerHTML = `
<figure class="title">
    <img class="logo" src="Components/SVG/GeekLib.svg" alt="GeekLib_Logo" />
</figure>
`;

//main table to hold the data
const table = document.querySelector(".data");
table.innerHTML = `
    <table class="tbl">
        <thead>
            <tr>
                <th>S.No</th>
                <th>Book Name</th>
                <th>Author</th>
                <th>Genre</th>
                <th>Edition</th>
                <th>#ISBN</th>
                <th>Action</th>
            </tr>
        </thead>
        <tbody title="List of books"></tbody>
    </table>
`;

let API = "https://geeklib-101.herokuapp.com";
// let API = "http://localhost:2001";

//async operation which fetches the data
async function loadData() {
  try {
    const data = await fetch(`${API}`);
    const res = await data.json();
    window.noOfBooks = res.length;
    if(res){
      let spinner = document.querySelector(".loading");
      spinner.style.display = "none";
    }
    if (res.length === 0) {
      //checks the length of fetched data if 0 then displayes no books avaliable else send the data to the books function
      const tableEmpty = document.querySelector("tbody");
      tableEmpty.innerHTML = `
    <div class="tableEmpty">
      <p>&ldquo; No books avaliable &rdquo;</p><br />
      <button class="btn_styling" onClick=addNewBook()>Add Book</button>
    </div>
  `;
      const searchHide = document.querySelector(".group");
      searchHide.classList.add("hide");
    } else {
      booksData(res);
    }
  } catch (err) {
    const error = document.querySelector(".error");
    error.innerHTML = `
      <p>:(</p>
      <p>Technical error</p>
    `;
  }
}
loadData();

const tablettl = document.querySelector(".tablettl");
tablettl.innerHTML = `
<div class="add">
  <div>
    <p><strong>Library Item List</strong></p>
  </div>
  <div class="group">
    <input class="searchBar" type="text" id="txtInp" onkeyup="search()" placeholder="Search using ISBN">
    <button onClick="addNewBook()" class="btn_styling">Add Book</button>
  </div>
</div>
  `;

// <input class="searchBar" type="text" id="txtInp" onkeyup="search()" placeholder="Search using book name">
let flag; //flag to check route which opeartion is to be carried out at book() function if false add operation else update

//onClick of add button the addnewbook fn is called and the modal is activated and "add a new book" word is send as parameter to the modal fn and conditionally renders the modal title so that we can know that we are editing or adding
function addNewBook() {
  let modal = document.querySelector(".modal");
  modal.classList.add("modal_active");
  let wordTtlAdd = "Add a new book";
  modals(wordTtlAdd);
  flag = false;
}

//after loading the data from fetch operation it is checked and sent to this booksData fn here according to the avaliable data the rows are created and appended
function booksData(list) {
  const tableBody = document.querySelector("tbody");
  list.map((books, index) => {
    let sNo = document.createElement("td");
    let row = document.createElement("tr");
    let id = document.createElement("td");
    let name = document.createElement("td");
    let author = document.createElement("td");
    let genre = document.createElement("td");
    let edition = document.createElement("td");

    sNo.innerText = `${index + 1}`;
    id.innerText = books.id;
    name.innerHTML = books.Name;
    author.innerHTML = books.Author;
    genre.innerHTML = books.Genre;
    edition.innerHTML = books.Edition;

    row.appendChild(sNo);
    row.appendChild(name);
    row.appendChild(author);
    row.appendChild(genre);
    row.appendChild(edition);
    row.appendChild(id);

    let edit = document.createElement("button");
    edit.setAttribute("onClick", `editContent()`); //edit button
    edit.className = "edit btn_styling";
    edit.innerText = "Edit";

    let del = document.createElement("button");
    del.setAttribute("onClick", `deleteContent()`); //delete button
    del.className = "delete btn_styling";
    del.innerText = "Delete";

    row.appendChild(edit);
    row.appendChild(del);

    tableBody.appendChild(row);
  });
}

//onClick of edit button the editContent() fn is called and the modal is activated and "Edit book details" word is send as parameter to the modal fn and conditionally render the modal title so that we can know that we are editing or adding
//and also the name, author, genre, edition details of the specific row is sent as parameter to the modal to edit the data
function editContent() {
  const editId = event.target.parentNode.innerText;
  const [, names, author, genre, edition, id] = editId.split("\t");

  let modal = document.querySelector(".modal");
  modal.classList.add("modal_active");
  let wordTtlED = "Edit book details";
  modals(wordTtlED, names, author, genre, edition, id);
  flag = true;
}

//after clicking edit or add button the modals function is activated it conditionally renders and checks if it has to display add or edit
function modals(wordChange, name, author, genre, edition, id) {
  const modal = document.querySelector(".modal");

  modal.innerHTML = `
      <div class="modal1_width">
        <div class="modal1">
          <p>${wordChange}</p>
          <button onClick="close_Btn()" class="close_btn"><img class="styling_close" src="Components/SVG/Close_icon.svg" alt="close_button" /></button>
        </div>
          <form class="modal1_form" autocomplete="off">
            <div class="modal1_firstPart">
                  <label for="name">Name</label><br />
                  <input type="text" id="name" placeholder="Enter book name" value='${
                    name === undefined ? "" : name
                  }'><br /><br />
                  <label for="edition">Edition</label><br />
                  <input type="text" id="edition" placeholder="Enter edition" value='${
                    edition === undefined ? "" : edition
                  }'><br />
            </div>
            <div class="modal1_secondPart">
                <label for="genre">Genre</label><br />
                <input type="text" id="genre" placeholder="Enter genre" value='${
                  genre === undefined ? "" : genre
                }'><br /><br />
                <label for="author">Author</label><br />
                <input type="text" id="author" placeholder="Enter author name" value='${
                  author === undefined ? "" : author
                }'><br />
                <div class="modal_btns">
                  <button type="button" class="grey_cancel right_btn" onClick="close_Btn()">Cancel</button>
                  <button type="button" class="btn_styling right_btn" onClick="book(${id})">Save</button>
                </div>
            </div>
          </form>
      </div>
`;
}

//onclicking the save button in the modal it calls the book() function here name is accepeted as parameter if edit operation occurs then this name parameter is used to query the DB in the backend
async function book(id) {
  let newName = document.querySelector("#name").value;
  let newEdition = document.querySelector("#edition").value;
  let newGenre = document.querySelector("#genre").value;
  let newAuthor = document.querySelector("#author").value;

  //validates the form if empty raises an alert else it send the updated data or new data to be added to the DB.
  if (
    newName === "" ||
    newEdition === "" ||
    newGenre === "" ||
    newAuthor === ""
  ) {
    alert("Form no filled fully");
  } else {
    const updatedBook = {
      Name: newName,
      Author: newAuthor,
      Genre: newGenre,
      Edition: newEdition,
    };
    // console.log(updatedBook)
    //the flag variable we previously used if checked here if true update opreation takes place or else add operation takes place
    if (flag) {
      try {
        const updatedData = await fetch(`${API}/${id}`, {
          method: "PUT",
          body: JSON.stringify(updatedBook),
          headers: {
            "Content-type": "application/json",
          },
        });
        console.log(updatedData);
        const table = document.querySelector("tbody");
        table.innerText = "";
        loadData();
        refresh();
        close_Btn();
        display();
        const notification = document.querySelector(".notification");
        notification.innerHTML = `
            <p>Changes saved!</p>
          `;
        notification.classList.remove("clr");
        notification.classList.remove("hide");
        setTimeout(function () {
          notification.classList.add("hide");
        }, 2500);
        // console.log(id)
      } catch (err) {
        const error = document.querySelector(".error");
        error.innerHTML = `
          <p>:(</p>
          <p>Technical error</p>
        `;
      }
    } else {
      try {
        const newData = await fetch(`${API}`, {
          method: "POST",
          body: JSON.stringify(updatedBook),
          headers: {
            "Content-type": "application/json",
          },
        });
        const table = document.querySelector("tbody");
        table.innerText = "";
        loadData();
        refresh();
        close_Btn();
        display();
        const notification = document.querySelector(".notification");
        notification.innerHTML = `
          <p>Book added!</p>
        `;
        notification.classList.remove("hide");
        notification.classList.remove("clr");
        setTimeout(function () {
          notification.classList.add("hide");
        }, 3000);
        const searchHide = document.querySelector(".group");
        searchHide.classList.remove("hide");
        searchHide.classList.add("show");
        setTimeout(function () {
          window.location.reload(true);
        }, 2000);
      } catch (err) {
        const error = document.querySelector(".error");
        error.innerHTML = `
          <p>:(</p>
          <p>Technical error</p>
        `;
      }
    }
  }
}

//creating the notification div element when edit, delete and add button is clicked.
function display() {
  const notification = document.createElement("div");
  notification.classList.add("notification");
  notification.classList.add("hide");
  document.body.appendChild(notification);
}

//after the details filled in the modal and submitted successfully the form input values gets reseted
function refresh() {
  document.querySelector("#name").value = "";
  document.querySelector("#edition").value = "";
  document.querySelector("#genre").value = "";
  document.querySelector("#author").value = "";
}

//onclick of delete button, deleteContent() fn is called and a warning modal is displayed wheather to delete the specific row from the DB or not
async function deleteContent() {
  const editId = event.target.parentNode.innerText;
  let [, bkname, , , , id] = editId.split("\t");

  window.delBkname = bkname;

  const deleteRes = document.querySelector(".del_modal");
  deleteRes.classList.add("del_modalActive");
  deleteRes.innerHTML = `
  <div class="modal1_width del_modalFlex">
    <div class="modal1">
      <button onClick="del_closeBtn()" class="close_btn del_align"><img class="styling_close" src="Components/SVG/Close_icon.svg" alt="close_button" /></button>
    </div>
    <div class="deleteContents_align">
      <img src="Components/SVG/emojione_warning.svg" alt="warning" />
      <p class="deleteName"><strong>Are you sure you want to delete</strong><br /><strong>&ldquo; ${bkname} &rdquo;</strong></p>
      <button class="btn_styling grey_cancel" onClick="del_closeBtn()">No</button>
      <button class="btn_styling" onClick="deleteData(${id})">Yes</button>
    </div>
  </div>  
  `;
}

//if yes button is clicked deleteData() fn is initiated and the row is deleted from the DB
async function deleteData(id) {
  try {
    const delData = await fetch(`${API}/${id}`, {
      method: "DELETE",
    });
    del_closeBtn();
    const table = document.querySelector("tbody");
    table.innerText = "";
    loadData();
    display();
    const notification = document.querySelector(".notification");
    notification.classList.add("clr");
    notification.innerHTML = `
      <p>&ldquo;${delBkname}&rdquo; deleted!</p>
    `;
    notification.classList.remove("hide");
    notification.classList.remove("clr");
    setTimeout(function () {
      notification.classList.add("hide");
    }, 2000);
  } catch (err) {
    const error = document.querySelector(".error");
    error.innerHTML = `
      <p>:(</p>
      <p>Technical error</p>
    `;
  }
}

//on click of no button delete modal is closed.
function del_closeBtn() {
  let delModal = document.querySelector(".del_modal");
  delModal.classList.remove("del_modalActive");
}

//close button for modal
function close_Btn() {
  let modal = document.querySelector(".modal");
  modal.classList.remove("modal_active");
}

function search() {
  let input, filter, table, tr, td, i, value;
  input = document.querySelector("#txtInp");
  filter = input.value.toUpperCase();
  table = document.querySelector(".tbl");
  tr = table.getElementsByTagName("tr");
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[5];
    if (td) {
      value = td.innerText;
      if (value.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
}