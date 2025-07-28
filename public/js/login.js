$(document).ready(() => {
  // Utility to get a cookie value by name
  const getCookie = name => {
    const value = "; " + document.cookie;
    const parts = value.split("; " + name + "=");
    if (parts.length === 2) {
      return parts.pop().split(";").shift();
    }
  };

  // Redirect to /home if JWT is already present
  if (getCookie("jwt")) {
    window.location.href = "/home";
  }

  $("#login-btn").on("click", () => {
    const username = $("#user-entry").val().trim();
    const password = $("#password-entry").val().trim();

    if (!username || !password) {
      alert("Please enter both a username and password.");
      return;
    }

    const query = `
      mutation Login($username: String!, $password: String!) {
        login(username: $username, password: $password) {
          token
        }
      }
    `;

    fetch("/graphql", {
  method: "POST",
  credentials: "same-origin", 
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json"
  },
  body: JSON.stringify({
    query,
    variables: { username, password }
  })
})

      .then(res => res.json())
      .then(data => {
        console.log("GraphQL response:", data);

        if (data.errors) {
          alert("Login failed: " + data.errors[0].message);
          return;
        }

        const token = data.data.login.token;

        // ✅ Set JWT cookie
        document.cookie = "jwt=" + token + "; path=/";
        window.location.href = "/home";
      })
      .catch(err => {
        console.error("Network error or unexpected response:", err);
        alert("A network error occurred. Please try again later.");
      });
  });
});
