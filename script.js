class Person  {
  constructor(firstName,lastName,id,capsule,age,city,gender,hobby) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.id = id;
    this.capsule = capsule;
    this.age = age;
    this.city = city;
    this.gender = gender;
    this.hobby = hobby;
  }
  editPerson = (firstName,lastName,capsule,age,city,gender,hobby) => {
    this.firstName = firstName;
    this.lastName = lastName;
    this.capsule = capsule;
    this.age = age;
    this.city = city;
    this.gender = gender;
    this.hobby = hobby;
  }
}

class People {
  constructor() {
    this.peopleList = [];
    this.state = 'id';
  }

  // Fetching data and return json
  fetchData = async (url = `https://apple-seeds.herokuapp.com/api/users/`) => {
    const data = await fetch(`${url}`);
    if (!data.ok) throw new Error(`Status Code Error: ${response.status}`);
    const dataJSON = await data.json();
    return await dataJSON;
  }

  // Create new Person class and push it to peopleList Array
  createPerson = (firstName,lastName,id,capsule,age,city,gender,hobby) => {
    const person = new Person(firstName,lastName,id,capsule,age,city,gender,hobby);
    this.peopleList.push(person);
    this.peopleList.sort((a,b) => a.id - b.id);
  }

  // Update all people data from API;
  updatePeople = async () => {
    const peopleData = await this.fetchData();
    await Promise.all(peopleData.map(async (person) => {
      const id = person.id;
      const personData = await this.fetchData(`https://apple-seeds.herokuapp.com/api/users/${id}`);
      const firstName = person.firstName;
      const lastName = person.lastName;
      const capsule = person.capsule;
      const gender = personData.gender;
      const age = personData.age;
      const city = personData.city;
      const hobby = personData.hobby;
      this.createPerson(firstName,lastName,id,capsule,age,city,gender,hobby);
    }));
    this.createTable();
  }
  // Add all event listeners
  addListeners = () => {
    const theads = document.querySelectorAll('thead th');
        theads.forEach(th => {
      th.addEventListener('click', this.sortTable);
    });
    const search = document.querySelector('#search');
    search.addEventListener('input', this.search);
    const dropdown = document.querySelector('select');
    dropdown.addEventListener('change', (e) => {
      this.state = e.target.value;
    });
  }
  // Create the table
  createTable = () => {
    const container = document.querySelector('.table-container');
    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const tr = document.createElement('tr');
    const titles = ['ID', 'First Name', 'Last Name', 'Capsule', 'Age', 'City', 'Gender', 'Hobby','Control'];
    titles.forEach(title => {
      const th = document.createElement('th');
      th.setAttribute('ascending','false');
      th.textContent = title;
      tr.appendChild(th);
    });
    tr.lastElementChild.setAttribute('colspan','2');
    thead.appendChild(tr);
    table.appendChild(thead);
    const tbody = document.createElement('tbody');
    table.appendChild(tbody);
    container.appendChild(table);
    this.peopleList.forEach(person => {
      this.insertRowTable(person);
    })
    this.addListeners();
  }
  // Create row of person details
  insertRowTable = (person) => {
    const tbody = document.querySelector('tbody');
    const tr = document.createElement('tr');
    tbody.appendChild(tr);
    const data = ['id','firstName','lastName','capsule', 'age', 'city', 'gender', 'hobby','edit', 'delete'];
    data.forEach(el => {
      const td = document.createElement('td');
      if (el === 'edit' || el === 'delete') {
        const button = document.createElement('button');
        if (el === 'edit') {
          button.textContent = 'Edit';
          button.classList.add('edit-btn');
          button.addEventListener('click',this.editPerson);
        } else {
          button.textContent = 'Delete';
          button.classList.add('delete-btn');
        }
        td.appendChild(button);
      } else {
        td.textContent = person[el];
      }
      tr.appendChild(td);
    })
    tbody.appendChild(tr);
  }

  saveLocal = () => {
  }

  sortTable = (e) => {
    const state = e.target.getAttribute('ascending');
    const table = document.querySelector('table');
    const tBody = table.querySelector('tbody');
    const rows = table.querySelectorAll('tbody tr');
    const theads = table.querySelectorAll('thead th');
    
    const theadsArr = [].slice.call(theads);
    const rowsArr = [].slice.call(rows);
    const thIndex = theadsArr.indexOf(e.target);
    rowsArr.sort((a,b) => {
      let td1 = a.children[thIndex].textContent;
      let td2 = b.children[thIndex].textContent;
      if (state === 'true') {
        e.target.setAttribute('ascending','false');
        if (thIndex === 0 || thIndex === 3 || thIndex === 4) {
          return parseInt(td2) - parseInt(td1);
        } else {
            if (td1 < td2) {
              return 1;
            } else if (td1 > td2) {
              return -1;
            } else {
              return 0;
            }
        }
      } else if (state === 'false') {
        e.target.setAttribute('ascending','true');
        if (thIndex === 0 || thIndex === 3 || thIndex === 4) {
        return parseInt(td1) - parseInt(td2);
      }
      else {
        if (td1 > td2) {
          return 1;
        } else if (td1 < td2) {
          return -1;
        } else {
          return 0;
        }
      }
      }

      // if (thIndex === 0 || thIndex === 3 || thIndex === 4) {
      //   return parseInt(td1) - parseInt(td2);
      // }
      // else {
      //   if (td1 > td2) {
      //     return 1;
      //   } else if (td1 < td2) {
      //     return -1;
      //   } else {
      //     return 0;
      //   }
      // }
    });
    rowsArr.forEach(row => tBody.appendChild(row));
  }

  search = (e) => {
    const text = e.target.value.toLowerCase();
    const searchResults = this.peopleList.filter(person => {
      const value = person[this.state].toString().toLowerCase();
      if (value.includes(text)) {
        return person[this.state];
      }
    });
    const tbody = document.querySelector('tbody');
    tbody.innerHTML = '';
    searchResults.forEach(person => this.insertRowTable(person));
  }

  editPerson = (e) => {
    const editButton = e.target;
    const row = editButton.parentElement.parentElement.children;
    const deleteButton = row[9].querySelector('button');
    deleteButton.classList.add('hidden');
    editButton.classList.add('hidden');
    const confirmButton = document.createElement('button');
    const cancelButton = document.createElement('button');
    cancelButton.textContent = 'Cancel';
    const id = parseInt(row[0].textContent);
    cancelButton.addEventListener('click', () => {
      const currentPerson = this.peopleList.find(val => val.id === id);
      const data = ['firstName','lastName','capsule', 'age', 'city', 'gender', 'hobby'];
      for (let i = 1; i <=7;i++) {
        row[i].textContent = currentPerson[data[i-1]];
      }
      cancelButton.remove();
      confirmButton.remove();
      editButton.classList.remove('hidden');
      deleteButton.classList.remove('hidden');
    })
    editButton.parentElement.appendChild(cancelButton);
    confirmButton.textContent = 'Confirm';
    confirmButton.addEventListener('click', (e) => {
      const rowInputs = [];
      for (const element of row) {rowInputs.push(element);}
      const firstName = rowInputs[1].querySelector('input').value;
      const lastName = rowInputs[2].querySelector('input').value;
      const capsule = rowInputs[3].querySelector('input').value;
      const age = rowInputs[4].querySelector('input').value;
      const city = rowInputs[5].querySelector('input').value;
      const gender = rowInputs[6].querySelector('input').value;
      const hobby = rowInputs[7].querySelector('input').value;
      const newVal = [];
      for (let i = 1; i <=7;i++) {
        const text = rowInputs[i].querySelector('input').value;
        newVal.push(text);
        rowInputs[i].textContent = text;
      }
      const currentPerson = this.peopleList.find(person => person.id === id);
      currentPerson.editPerson(newVal[0],newVal[1],parseInt(newVal[2]),parseInt(newVal[3]),newVal[4],newVal[5],newVal[6]);
      cancelButton.remove();
      confirmButton.remove();
      editButton.classList.remove('hidden');
      deleteButton.classList.remove('hidden');
    })
    deleteButton.parentElement.appendChild(confirmButton);
    for (let i = 1; i <= 7; i++) {
      const text = row[i].textContent;
      row[i].textContent = '';
      const input = document.createElement('input');
      input.setAttribute('type','text');
      input.value = text;
      row[i].appendChild(input);
    }
    
  }
}

const list = new People();
list.updatePeople();