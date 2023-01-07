// import { showAlert } from "./Alert";

const hideAlert = () => {
  const el = document.querySelector('.alert');
  if (el) el.parentElement.removeChild(el);
};

const showAlert = (status, msg) => {
  hideAlert();
  const markup = `<div class="alert alert--${status}">${msg}</div>`;
  document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
  window.setTimeout(hideAlert, 5000);
}

const login = async (email, password) => {
    try{ 
        const req = await fetch("http://127.0.0.1:3002/api/v1/users/auth/login", {
            method: "POST",
            headers: {
              Accept: "application/json, text/plain, */*",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email,
              password
            }),
          })

        const res = await req.json();     
        if(res.status === "Success"){
        showAlert("success", "Login successfully")
        window.setTimeout(() => {
          location.assign("/")
        }, 1500)
      }else{
        showAlert("error", "Incorrect login or password")
      }

  }catch(err){
    showAlert("error", err.response)
    // console.log(err)
  }
}

const logout = async () => {
  try{
    const req = await fetch("http://127.0.0.1:3002/api/v1/users/auth/logout", {
            method: "GET",
            headers: {
              Accept: "application/json, text/plain, */*",
              "Content-Type": "application/json",
            }
          })

    const res = await req.json()
    if(res.status === "Success") location.reload(true)

  }catch(err){
    console.log(err)
  }
}

const form = document.querySelector(".form--login")
const logOutBtn = document.querySelector(".nav__el--logout")

if(form){
  form.addEventListener("submit", e => {
    e.preventDefault()
    const email = document.querySelector("#email").value
    const password = document.querySelector("#password").value
    login(email, password)
  })
}

if(logOutBtn){
  logOutBtn.addEventListener("click", e => {
    e.preventDefault()
    logout()
  })
}
