import axios from "axios";
import { Auth, createUserWithEmailAndPassword } from "firebase/auth";

// for local testing
// const API_URL = "http://localhost:5000";

// for prod
const API_URL = "https://zealthy-test-backend-41fv.vercel.app";

const createUser = async (auth: Auth, email: string, password: string) => {
  try {
    const response = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    return response.user.uid; // return the user id
  } catch (error) {
    // Handle the error if the user already exists or other errors
    throw error;
  }
};

const saveUserData = async (userId: string, userData: UserData) => {
  try {
    const response = await axios.post(`${API_URL}/users/saveUserData`, {
      userId,
      ...userData,
    });

    // Return success message after saving user data
    return response.data;
  } catch (error) {
    // Handle errors while saving user data
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error || "Error saving user data");
    } else {
      throw new Error("Network or unexpected error occurred");
    }
  }
};

const getAllUsersData = async () => {
  try {
    const response = await axios.get(`${API_URL}/users`);
    return response.data;
  } catch (error) {
    // Handle errors while saving user data
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error || "Error saving user data");
    } else {
      throw new Error("Network or unexpected error occurred");
    }
  }
};

export { createUser, saveUserData, getAllUsersData };

// Interface for user data to ensure proper type-checking
interface UserData {
  aboutMe?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  birthdate?: string;
  email: string;
}
