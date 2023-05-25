import axios from "axios";
import toast from "react-hot-toast";
import { API_URL } from "../../App";
export const getAllHeros = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/heros/allHeros`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 200) {
      return response.data.heros;
    }
  } catch (error) {
    handleAxiosErrors(error);
  }
};

export const getAllInterventions = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/api/interventions/allInterventions`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data.allInterventions;
  } catch (error) {
    handleAxiosErrors(error);
  }
};

export const handleAxiosErrors = (error) => {
  console.log(error.status, error.response.data.message);
  if (error.response) {
    toast.error(
      `Erreur  : ${error.response.status} : ${error.response.data.message}`,
      {
        duration: 1000,
        position: "top-right",
        icon: "😢",
      }
    );
  } else if (error.request) {
    toast.error("Erreur de connexion");
  } else {
    toast.error("Erreur");
  }
};

export const showNotificationSuccess = (message) => {
  console.log(message);
  toast.success(message, {
    duration: 1000,
    position: "top-right",
    style: {
      border: "1px solid #713200",
      padding: "16px",
      color: "#713200",
    },
    icon: "👍",
  });
};
