import {
  HomeIcon,
  CalendarIcon,
  UserIcon,
  RolesIcon,
  AuthIcon,
  WizardIcon,
  ModalIcon,
  MapIcon,
  RegisterIcon,
} from "./Icons";

export const SIDEBAR_DATA = [
  {
    id: 1,
    name: "Accueil",
    path: "",
    icon: <HomeIcon />,
  },
  {
    id: 2,
    name: "Plan",
    path: "Plan",
    icon: <MapIcon />,
  },
  {
    id: 4,
    name: "roles & permissions",
    path: "roles",
    icon: <RolesIcon />,
  },

  {
    id: 5,
    name: "Login",
    path: "Login",
    icon: <AuthIcon />,
  },
  {
    id: 9,
    name: "Inscription",
    path: "Inscription",
    icon: <RegisterIcon />,
  },
  {
    id: 6,
    name: "Nos supers héros",
    path: "Superheros",
    icon: <WizardIcon />,
  },
  // {
  //   id: 7,
  //   name: "Profil",
  //   path: "Profil",
  //   icon: <UserIcon />,
  // },
  // {
  //   id: 8,
  //   name: "Déconnexion",
  //   path: "Deconnexion",
  //   icon: <ModalIcon />,
  // },
];
