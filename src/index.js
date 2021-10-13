import "./style.css"
import "bootstrap/dist/css/bootstrap.css"
import * as bootstrap from 'bootstrap';
import '@popperjs/core';
import {SERVER_URL} from './constants'

document.getElementById("all-content").style.display = "block"

/* 
  Add your JavaScript for all exercises Below or in separate js-files, which you must the import above
*/

/* JS For person below */

let editModalElement = document.getElementById("editmodal")
let editModal = new bootstrap.Modal(editModalElement)

document.getElementById("tablerows").addEventListener('click', e => {
  e.preventDefault();
  const node = e.target
  const name = node.getAttribute("name")
  const id = node.getAttribute("id")
  switch (name){
    case"edit": editPerson(id); break;
    case"delete": deletePerson(id); break;
  }
})

function editPerson(id){
  fetch(`${SERVER_URL}/person/${id}`)
  .then(handleHttpErrors)
  .then (data => {
    document.getElementById("edit_id").value = data.id
    document.getElementById("email").value = data.email
    document.getElementById("firstName").value = data.firstName
    document.getElementById("lastName").value = data.lastName
    document.getElementById("number").value = data.phones[0].number
    document.getElementById("street").value = data.address.street
    document.getElementById("zip").value = data.address.cityInfo.zipcode
    document.getElementById("city").value = data.address.cityInfo.city
    document.getElementById("hobbies").value = data.hobbies[0].name
    editModal.toggle() 

  })
  .catch(errorHandling)
}

document.getElementById("modal-edit-save-btn").addEventListener('click', updatePerson)


function updatePerson()
{
  
  const id = document.getElementById("edit_id").value
   const email = document.getElementById("email").value
   const firstName = document.getElementById("firstName").value
   const lastName = document.getElementById("lastName").value
   const hobbyName = document.getElementById("hobbies").value
   const number = document.getElementById("number").value
   const street = document.getElementById("street").value
   const zip = document.getElementById("zip").value
   const city = document.getElementById("city").value

   const hobbies = [
    {
      "name": hobbyName,
    }
  ]
  const phones = [
    {
      "number": number,
      "description": 'This is ' + firstName + ' ' + lastName + 's phone'
    }
  ]

  const cityInfo = {
    "zipcode": zip,
    "city": city
  }

  const address = {
    "street": street,
    "additionalInfo": firstName + ' ' + lastName + ' lives here',
    "cityInfo": cityInfo
  }
  const person = {
    "email": email,
    "firstName": firstName,
    "lastName": lastName,
    "hobbies": hobbies,
    "phones": phones,
    "address": address
  }


  const options = makeOptions('PUT', person)
      
  fetch(`${SERVER_URL}/person/${id}`,options)
  .then(handleHttpErrors)
  .then(data => {
    editModal.toggle()
    getAllPersons()
  })

}


function deletePerson(id){
  alert('deleteperson' +  id)

}




function getAllPersons(){

fetch(`${SERVER_URL}/person/all`)
 .then(handleHttpErrors)
 .then(data => 
   {
//lav tabel rækker med data
console.log(data)
const allRows = data.all.map(p =>getPersonTableRow(p))
document.getElementById("tablerows").innerHTML = allRows.join(""); 
})

 .catch(errorHandling)
}




function getPersonTableRow(p)
{
 return  `<tr>
 <td>${p.id}</td>
 <td>${p.email}</td>
 <td>${p.firstName}</td>
 <td>${p.lastName}</td>
 <td>${p.phones[0].number}</td>
 <td>${p.address.street}</td>
 <td>${p.address.cityInfo.zipcode}</td>
 <td>${p.address.cityInfo.city}</td>
 <td>${p.hobbies[0].name}</td>
 <td>
    <input id="${p.id}" type="button" name="edit" value="edit"/>
    <input id="${p.id}" type="button" name="delete" value="delete"/>    
 </td>
 </tr>`
}

/* + ${p.hobbies.length-1}      +${p.hobbies.map(h => h.name +" ").join(" ")}  */

/* JS For Exercise-2 below */



/* JS For Exercise-3 below */


/*Helper function*/

function makeOptions(method, body) {
  var opts =  {
    method: method,
    headers: {
      "Content-type": "application/json",
      "Accept": "application/json"
    }
  }
  if(body){
    opts.body = JSON.stringify(body);
  }
  return opts;
 }
 

 function errorHandling(err)
 {
   console.log(err);
     if(err.status)
     {
       err.fullError.then(e=> console.log(e.message))
     }
     else{console.log("Network error")
   }
 }

 function handleHttpErrors(res){
 if(!res.ok){
   return Promise.reject({status: res.status, fullError: res.json() })
 }
 return res.json();
}


/* 
Do NOT focus on the code below, UNLESS you want to use this code for something different than
the Period2-week2-day3 Exercises
*/

function hideAllShowOne(idToShow)
{
  document.getElementById("about_html").style = "display:none"
  document.getElementById("person").style = "display:none"
  document.getElementById("Hobbies").style = "display:none"
  document.getElementById("Adresses").style = "display:none"
  document.getElementById(idToShow).style = "display:block"
}

function menuItemClicked(evt)
{
  const id = evt.target.id;
  switch (id)
  {
    case "ex1": hideAllShowOne("person"); getAllPersons(); break
    case "ex2": hideAllShowOne("Hobbies"); break
    case "ex3": hideAllShowOne("Adresses"); break
    default: hideAllShowOne("about_html"); break
  }
  evt.preventDefault();
}
document.getElementById("menu").onclick = menuItemClicked;
hideAllShowOne("about_html");


