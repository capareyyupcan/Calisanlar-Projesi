import { Request } from "./request";
import { UI } from "./ui";

/// Elementleri seçme

const form = document.getElementById("employee-form");
const nameInput = document.getElementById("name");
const departmentInput = document.getElementById("department");
const salaryInput = document.getElementById("salary");
const employeesList = document.getElementById("employees");
const updateEmployeeButton = document.getElementById("update");

const request = new Request("http://localhost:3000/employees");




// request.get()
// .then(employees => console.log(employees))
// .catch(err => console.log(err));

// request.post({name:"Ahmet Can",department : "Bilgisat", salary : 2500})
// .then(addEmployee => console.log(addEmployee))
// .catch(err => console.log(err));

// request.put(1,{name: "Serhat Aslankao", department : "Zaman", salary: 92299})
// .then(updateEmployee => console.log(updateEmployee))
// .catch(err => console.log(err));

// request.delete(6)
// .then(message => console.log(message))
// .catch(err => console.log(err));
const ui = new UI();

let updateState = null;
eventListeners();

function eventListeners() {
  document.addEventListener("DOMContentLoaded", getAllEmployees);
  form.addEventListener("submit", addEmployee);
  employeesList.addEventListener("click", UpdateOrDelete);
  updateEmployeeButton.addEventListener("click", updateEmployee);
}

function getAllEmployees() {
  request
    .get()
    .then((employees) => {
      ui.addAllEmployeeToUI(employees);
    })
    .catch((err) => console.log(err));
}

function addEmployee(e) {
  const employeeName = nameInput.value.trim();
  const employeeDepartment = departmentInput.value.trim();
  const employeeSalary = salaryInput.value.trim();

  if (
    employeeName === "" ||
    employeeDepartment === "" ||
    employeeSalary === ""
  ) {
    alert("Lütfen Tüm Alanları Doldurunuz");
  } else {
    request
      .post({
        name: employeeName,
        department: employeeDepartment,
        salary: employeeSalary,
      })
      .then((employee) => {
        ui.addEmployeeToUI(employee);
      })
      .catch((err) => console.log(err));
  }

  ui.clearInputs();
  e.preventDefault();
}

function UpdateOrDelete(e) {
  if (e.target.id === "delete-employee") {
    // silme
    deleteEmployee(e.target);
  } else if (e.target.id === "update-employee") {
    // güncelleme
    updateEmployeeController(e.target.parentElement.parentElement);
  }
}

function deleteEmployee(targetEmployee) {
  const id =
    targetEmployee.parentElement.previousElementSibling.previousElementSibling
      .textContent;
  request
    .delete(id)
    .then((message) => {
      ui.deleteEmployeeFromUI(targetEmployee.parentElement.parentElement);
    })
    .catch((err) => console.log(err));
}

function updateEmployeeController(targetEmployee) {
  ui.toggleUpdateButton(targetEmployee);

  if (updateState ===null){
    updateState={
        updateId:targetEmployee.children[3].textContent,
        updateParent : targetEmployee
    }
  }else{
    updateState =null;
  }
}

function updateEmployee() {
if(updateState){
    // Güncelleme 
    const data = {name:nameInput.value.trim(), department:departmentInput.value.trim(),salary:Number(salaryInput.value.trim())};

    request.put(updateState.updateId,data)
    .then(updatedEmployee =>{
        ui.updateEployeeOnUI(updatedEmployee,updateState.updateParent);
    })
    .catch(err => console.log(err));

}
}
