import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { HERO_KEY } from "../../App";
import axios from "axios";
import hero from "../Heros/Hero.json";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { green, red } from "@mui/material/colors";
import { AuthContext } from "./Context/AuthProvider";
import { Toaster } from "react-hot-toast";

const Copyright = (props) => {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Squad Gang
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
};

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme({
  palette: {
    primary: {
      main: "#f44336",
    },
  },
});

const Authentification = () => {
  const navigate = useNavigate();
  const { login } = React.useContext(AuthContext);
  const [image, setImage] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [errors, setErrors] = React.useState({
    nom: "",
    email: "",
    telephone: "",
    location: "",
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    console.log("valid");
    sendData(data);
  };
  const sendData = async (data) => {
    try {
      await login(data.get("nom"), data.get("password"));
    } catch (error) {
      console.log(error);
    }
  };

  const getRandomPicture = async () => {
    setLoading(true);
    try {
      const random = Math.floor(Math.random() * hero.length);
      console.log(hero[random]);
      const picture = await axios.get(
        `https://www.superheroapi.com/api.php/${HERO_KEY}/search/${hero[random].name}`
      );
      if (picture.status === 200 && picture.data.results[0] !== undefined) {
        setLoading(false);
        setImage(picture.data.results[0].image.url);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const validateForm = (data) => {
    // Cloner l'objet errors pour ne pas le modifier directement
    let newErrors = { ...errors };
    // Vérifiez si le nom est vide
    if (!data.get("nom")) {
      newErrors.nom = "Le nom est requis.";
    } else {
      newErrors.nom = "";
    }
    if (!data.get("password")) {
      newErrors.password = "Le mot de passe est requis.";
    } else {
      newErrors.password = "";
    }

    // Mettez à jour l'état des erreurs
    setErrors(newErrors);

    // Si tous les champs sont valides, retournez true, sinon false
    return !Object.values(newErrors).some((error) => error !== "");
  };
  React.useEffect(() => {
    getRandomPicture();
  }, []);
  return (
    <ThemeProvider theme={defaultTheme}>
      {!loading && (
        <Grid container component="main" sx={{ mt: 20 }}>
          <CssBaseline />
          <Grid
            item
            xs={false}
            sm={3}
            md={6}
            sx={{
              backgroundImage: `url(${image})`,
              backgroundRepeat: "no-repeat",
              backgroundColor: (t) =>
                t.palette.mode === "light"
                  ? t.palette.grey[50]
                  : t.palette.grey[900],
              width: "100%",
              backgroundPosition: "center",
              borderRadius: "8px",
              border: "1px solid #eaeaea",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          />

          <Grid
            item
            xs={13}
            sm={9}
            md={6}
            component={Paper}
            elevation={6}
            square
          >
            <Box
              sx={{
                my: 8,
                mx: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="h5">
                Se connecter
              </Typography>
              <Box
                component="form"
                noValidate
                onSubmit={handleSubmit}
                sx={{ mt: 1 }}
              >
                {/* // handle errors with material ui documentations textField */}
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="nom"
                  label="Votre SuperName"
                  name="nom"
                  autoComplete="name"
                  autoFocus
                  error={errors.nom !== ""}
                  helperText={errors.nom}
                  InputProps={{
                    endAdornment: errors.nom && (
                      <HighlightOffIcon style={{ color: red[500] }} />
                    ),
                  }}
                  FormHelperTextProps={{
                    style: {
                      color: errors.nom ? red[500] : green[500],
                    },
                  }}
                />

                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  error={errors.nom !== ""}
                  helperText={errors.password}
                  InputProps={{
                    endAdornment: errors.password && (
                      <HighlightOffIcon style={{ color: red[500] }} />
                    ),
                  }}
                  FormHelperTextProps={{
                    style: {
                      color: errors.password ? red[500] : green[500],
                    },
                  }}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Sign In
                </Button>
                <Grid container>
                  <Grid item xs>
                    <Link
                      onClick={() => navigate("/Inscription")}
                      variant="body2"
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {"Vous n'avez pas de compte ? Inscrivez-vous"}
                    </Link>
                  </Grid>
                </Grid>
                <Copyright sx={{ mt: 5 }} />
              </Box>
            </Box>
          </Grid>
        </Grid>
      )}
    </ThemeProvider>
  );
};

export default Authentification;
