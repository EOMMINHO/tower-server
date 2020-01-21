const signInBtn = document.querySelector("#signIn");
const id = document.querySelector("#id");
const pw = document.querySelector("#pw");

signInBtn.addEventListener("click", async e => {
  let response = await fetch(window.location.origin + "/users/signIn", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ id: id.value, pw: pw.value })
  });

  if (response.status === 400) {
    pw.value = "";
    window.alert("Wrong authentication");
    pw.focus();
  } else {
    const token = response.headers.get("x-auth-token");
    localStorage.setItem("x-auth-token", token);
    window.location.href = "/html/setting.html";
  }
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
