import axios from "axios";

const API_URL = "http://church-api.altoservices.net/api/v1";

export async function login(email, password) {
  try {
    const response = await axios.post(
      API_URL,
      {
        email: email,
        password: password
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        }
      }
    );

    const { token, user, message } = response.data;

    // Save token to localStorage
    localStorage.setItem("token", token);

    // Optional: save user data
    localStorage.setItem("user", JSON.stringify(user));

    console.log(message);

    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Login failed");
    } else {
      throw new Error("Network error");
    }
  }
}
