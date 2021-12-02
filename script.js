const navBar = document.querySelector(".mainScreen");
navBar.innerHTML = `
<figure class="title">
    <img class="logo" src="Components/SVG/GeekLib.svg" alt="GeekLib_Logo" />
</figure>
`;

const table = document.querySelector(".data");
table.innerHTML = `
    <table class="tbl">
        <thead>
            <tr>
                <th>S.no</th>
                <th>#book_id</th>
                <th>Name</th>
                <th>Author</th>
                <th>Genre</th>
                <th>Edition</th>
                <th>Action</th>
            </tr>
        </thead>
        <tbody title="List of books"></tbody>
    </table>
`;

async function loadData() {
  try {
    const data = await fetch(`https://geeklib-101.herokuapp.com/`);
    const res = await data.json();
    if (res.length === 0) {
      const tableEmpty = document.querySelector("tbody");
      tableEmpty.innerHTML = `
    <div class="tableEmpty">
      <p>&ldquo; No books avaliable &rdquo;</p><br />
      <button class="btn_styling" onClick=addNewBook()>Add Book</button>
    </div> 
  `;
    } else {
      books(res);
    }
  } catch (err) {
    console.log("failed");
  }
}
loadData();
const addBtn = document.querySelector(".addbtn");
addBtn.innerHTML = `
<div class="add">
  <p><strong>Library Item List</strong></p>
  <input class="searchBar show" type="text" id="txtInp" onkeyup="search()" placeholder="Search using book name">
  <button onClick="addNewBook()" class="btn_styling show">Add Book</button>
</div>
`;
let flag;
function addNewBook() {
  let modal = document.querySelector(".modal");
  modal.classList.add("modal_active");
  let wordTtlAdd = "Add a new book";
  modals(wordTtlAdd);
  flag = false;
}
function books(list) {
  // console.log(list);
  const tableBody = document.querySelector("tbody");
  list.map((books, index) => {
    let row = document.createElement("tr");
    let sNo = document.createElement("td");
    let id = document.createElement("td");
    let name = document.createElement("td");
    let author = document.createElement("td");
    let genre = document.createElement("td");
    let edition = document.createElement("td");

    id.innerHTML = books.id;
    name.innerHTML = books.Name;
    author.innerHTML = books.Author;
    genre.innerHTML = books.Genre;
    edition.innerHTML = books.Edition;
    sNo.innerText = `${index + 1}`;

    row.appendChild(sNo);
    row.appendChild(id);
    row.appendChild(name);
    row.appendChild(author);
    row.appendChild(genre);
    row.appendChild(edition);

    let edit = document.createElement("button");
    edit.setAttribute("onClick", `editContent()`);
    edit.className = "edit btn_styling";
    edit.innerText = "Edit";

    let del = document.createElement("button");
    del.setAttribute("onClick", `deleteContent()`);
    del.className = "delete btn_styling";
    del.innerText = "Delete";

    row.appendChild(edit);
    row.appendChild(del);

    tableBody.appendChild(row);
    // id.className = "test";
  });
}

function editContent() {
  const editId = event.target.parentNode.innerText;
  const [, id, name, author, genre, edition] = editId.split("\t");
  window.id = id;

  let modal = document.querySelector(".modal");
  modal.classList.add("modal_active");

  // let bkName = document.querySelector("#name");
  // let bkEdition = document.querySelector("#edition");
  // let bkGenre = document.querySelector("#genre");
  // let bkAuthor = document.querySelector("#author");

  // bkName.value = name;
  // bkEdition.value = edition;
  // bkGenre.value = genre;
  // bkAuthor.value = author;
  let wordTtlED = "Edit book details";
  modals(wordTtlED, name, author, genre, edition);
  flag = true;
}

function modals(wordChange, name, author, genre, edition) {
  const modal = document.querySelector(".modal");
  modal.innerHTML = `
      <div class="modal1_width">
        <div class="modal1">
          <p>${wordChange}</p>
          <button onClick="close_Btn()" class="close_btn"><img class="styling_close" src="Components/SVG/Close_icon.svg" alt="close_button" /></button>
        </div>
          <form class="modal1_form">
            <div class="modal1_firstPart">
                  <label for="name">Name</label><br />
                  <input type="text" id="name" placeholder="Enter book name" value=${
                    name === undefined ? "" : name
                  }><br /><br />
                  <label for="edition">Edition</label><br />
                  <input type="text" id="edition" placeholder="Enter edition" value=${
                    edition === undefined ? "" : edition
                  }><br />
            </div>
            <div class="modal1_secondPart">
                <label for="genre">Genre</label><br />
                <input type="text" id="genre" placeholder="Enter genre" value=${
                  genre === undefined ? "" : genre
                }><br /><br />
                <label for="author">Author</label><br />
                <input type="text" id="author" placeholder="Enter author name" value=${
                  author === undefined ? "" : author
                }><br />
                <div class="modal_btns">
                  <button type="button" class="grey_cancel right_btn" onClick="close_Btn()">Cancel</button>
                  <button type="button" class="btn_styling right_btn" onClick="book()">Save</button>
                </div>
            </div>
          </form>
      </div>
`;
}

async function book() {
  let newName = document.querySelector("#name").value;
  let newEdition = document.querySelector("#edition").value;
  let newGenre = document.querySelector("#genre").value;
  let newAuthor = document.querySelector("#author").value;

  if (
    newName === "" ||
    newEdition === "" ||
    newGenre === "" ||
    newAuthor === ""
  ) {
    alert("Enter the form");
  } else {
    const updatedBook = {
      Name: newName,
      Author: newAuthor,
      Genre: newGenre,
      Edition: newEdition,
    };
    if (flag) {
      try {
        const updatedData = await fetch(
          `https://geeklib-101.herokuapp.com/${id}`,
          {
            method: "PUT",
            body: JSON.stringify(updatedBook),
            headers: {
              "Content-type": "application/json",
            },
          }
        );
        const table = document.querySelector("tbody");
        table.innerText = "";
        loadData();
        refresh();
        close_Btn();
      } catch (err) {
        console.log(err);
      }
    } else {
      try {
        // let spinner = document.querySelector(".loading");
        // spinner.innerHTML = `
        //   <img class="loadAnimation" src="Components/SVG/icon-park-outline_loading.svg" alt="loading"></img>
        // `;
        const newData = await fetch(`https://geeklib-101.herokuapp.com/`, {
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
      } catch (err) {
        console.log(err);
      }
    }
  }
}
function refresh() {
  document.querySelector("#name").value = "";
  document.querySelector("#edition").value = "";
  document.querySelector("#genre").value = "";
  document.querySelector("#author").value = "";
}
async function deleteContent() {
  const editId = event.target.parentNode.innerText;
  let [, id, name] = editId.split("\t");
  // console.log("tested", name);
  // console.log("tested", id);

  const deleteRes = document.querySelector(".del_modal");
  deleteRes.classList.add("del_modalActive");
  deleteRes.innerHTML = `
  <div class="modal1_width">
    <div class="modal1">
      <button onClick="del_closeBtn()" class="close_btn del_align"><img class="styling_close" src="Components/SVG/Close_icon.svg" alt="close_button" /></button>
    </div>
    <div class="deleteContents_align">
      <img src="Components/SVG/emojione_warning.svg" alt="warning" />
      <p><strong>Are you sure you want to delete</strong><br />&ldquo; ${name} &rdquo;</p>
      <button class="btn_styling grey_cancel" onClick="del_closeBtn()">No</button>
      <button class="btn_styling" onClick="deleteData(${id})">Yes</button>
    </div>
  </div>  
  `;
}

function del_closeBtn() {
  let delModal = document.querySelector(".del_modal");
  delModal.classList.remove("del_modalActive");
}

async function deleteData(condition) {
  try {
    const delData = await fetch(
      `https://geeklib-101.herokuapp.com/${condition}`,
      {
        method: "DELETE",
      }
    );
    del_closeBtn();
    const table = document.querySelector("tbody");
    table.innerText = "";
    loadData();
    console.log("success");
  } catch (err) {
    console.log(err);
  }
}

function close_Btn() {
  let modal = document.querySelector(".modal");
  modal.classList.remove("modal_active");
}

let spinner = document.querySelector(".loading");
window.addEventListener("load", function () {
  spinner.style.display = "none";
});

function search() {
  let input, filter, table, tr, td, i, value;
  input = document.querySelector("#txtInp");
  filter = input.value.toUpperCase();
  table = document.querySelector(".tbl");
  tr = table.getElementsByTagName("tr");
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[2];
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