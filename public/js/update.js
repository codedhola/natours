// PROFILE UPDATE FEATURES

async function updateProfile(data){
  try{
    
    const req = await fetch("http://127.0.0.1:3002/api/v1/users/auth/updateprofile", {
            method: "PATCH",
            // headers: {
            //   Accept: "application/json, text/plain, */*",
            //   "Content-Type": "application/json, text/html", 
            // },
            body: 
              data
            
          })
    const res = await req.json()
    if(res.status === "Success"){
        showAlert("success", "Updated successfully")
        window.setTimeout(() => {
          location.assign("/profile")
        }, 1500)
      }
  }catch(err){
    showAlert("error", err.message)
  }
}

async function updatePassword(oldPass, password, confirmPassword){
    try{
        const req = await fetch("http://127.0.0.1:3002/api/v1/users/auth/updatepassword", {
                method: "PATCH",
                headers: {
                  Accept: "application/json, text/plain, */*",
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    oldPass,
                    password,
                    confirmPassword
                })
              })
        const res = await req.json()
        if(res.status === "Success"){
            showAlert("success", "PASSWORD updated successfully")
            window.setTimeout(() => {
              location.assign("/profile")
            }, 1500)
          }else{
            showAlert("error", "An Error occured updating your paswword")
          }

    }catch(err){
        console.log(err)
        showAlert("error", "An Error occured updating your paswword")
    }
}

const profileBtn = document.querySelector("#save--profile")

if(profileBtn){
    profileBtn.addEventListener("click", e => {
        e.preventDefault()
        const form = new FormData()
        form.append("name", document.querySelector("#name").value )
        form.append("email", document.querySelector("#email").value )
        form.append("photo", document.querySelector("#photo").files[0])
        // const name = document.querySelector("#name").value
        // const email = document.querySelector("#email").value

        updateProfile(form)
    })
}

const passwordBtn = document.querySelector("#save--password")

if(passwordBtn){
    passwordBtn.addEventListener("click", e => {
        e.preventDefault()
        const passwordCurrent = document.querySelector("#password-current").value
        const password = document.querySelector("#password").value
        const passwordConfirm = document.querySelector("#password-confirm").value

        updatePassword(passwordCurrent, password, passwordConfirm)
    })
}


