const signInBtn = document.querySelector("#signIn");
const id = document.querySelector("#id");
const pw = document.querySelector("#pw");

signInBtn.addEventListener("click", e => {
  fetch("users/signIn", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ id: id.value, pw: pw.value })
  }).then(function(response) {
    if (response.status === 400) {
      console.log("wrong authentication");
      //id.value = "";
      pw.value = "";
      window.alert("Wrong authentication");
      pw.focus();
    } else {
      console.log("good authentication");
      const token = response.headers.get("x-auth-token");
      localStorage.setItem("x-auth-token", token);
      window.location.href = "/html/setting.html";
    }
  });
});

id.addEventListener("keyup", e => {
  if (event.code === "Enter" || event.code === "NumpadEnter") {
    pw.focus();
  }
});

pw.addEventListener("keyup", e => {
  if (event.code === "Enter" || event.code === "NumpadEnter") {
    signInBtn.click();
  }
});
