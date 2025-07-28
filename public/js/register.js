const regBtn = $("#register-button");
console.log("This is the register page!");

regBtn.on("click", event => {
  event.preventDefault();

  // Clear previous error messages
  $("#email-div p, #password-div p").remove();

  // Gather values
  const email = $("#email").val().trim();
  const firstName = $("#first-name").val().trim();
  const lastName = $("#last-name").val().trim();
  const username = $("#username").val().trim();
  const password1 = $("#password1").val().trim();
  const password2 = $("#password2").val().trim();

  console.log("email:", email);
  console.log("firstName:", firstName);
  console.log("lastName:", lastName);
  console.log("username:", username);
  console.log("password1:", password1);
  console.log("password2:", password2);

  // Frontend validation
  if (!email || !firstName || !lastName || !username || !password1 || !password2) {
    alert("All fields are required.");
    return;
  }

  if (password1 !== password2) {
    $("#password-div").append("<p>Both passwords must match</p>");
    return;
  }

  if (!email.includes("@") || !email.includes(".")) {
    $("#email-div").append("<p>You must input a valid email address.</p>");
    return;
  }

  const password = password1;

  const query = `
    mutation addUser($firstName: String!, $lastName: String!, $username: String!, $email: String!, $password: String!) {
      addUser(
        firstName: $firstName,
        lastName: $lastName,
        username: $username,
        email: $email,
        password: $password
      ) {
        id
      }
    }
  `;

  fetch("/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({
      query,
      variables: { firstName, lastName, username, email, password }
    })
  })
    .then(r => r.json())
    .then(data => {
      console.log("data returned:", data);

      if (data.errors) {
        // Display first error from server
        alert("Registration failed: " + data.errors[0].message);
        return;
      }

      alert("Registration successful!");
      window.location.href = "/login";
    })
    .catch(err => {
      console.error("Network error:", err);
      alert("Something went wrong. Please try again.");
    });
});
