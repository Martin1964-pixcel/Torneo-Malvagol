export const categories = [
  "Novatos Empresarial",
  "Veteranos 30 y Mayores",
  "Novatos Libre",
];

export const sampleStandings = [
  {
    category: "Novatos Empresarial",
    teams: [
      { name: "Talleres FC", pj: 3, pg: 2, pe: 1, pp: 0, gf: 12, gc: 5, pts: 7 },
      { name: "Constructora Norte", pj: 3, pg: 2, pe: 0, pp: 1, gf: 9, gc: 6, pts: 6 },
      { name: "Oficinas United", pj: 3, pg: 1, pe: 1, pp: 1, gf: 7, gc: 7, pts: 4 },
    ],
  },
  {
    category: "Veteranos 30 y Mayores",
    teams: [
      { name: "Veteranos Culiacán", pj: 3, pg: 3, pe: 0, pp: 0, gf: 10, gc: 3, pts: 9 },
      { name: "Deportivo 30+", pj: 3, pg: 2, pe: 0, pp: 1, gf: 8, gc: 5, pts: 6 },
      { name: "Real Amigos", pj: 3, pg: 1, pe: 0, pp: 2, gf: 6, gc: 9, pts: 3 },
    ],
  },
  {
    category: "Novatos Libre",
    teams: [
      { name: "Malvagol FC", pj: 3, pg: 2, pe: 1, pp: 0, gf: 11, gc: 4, pts: 7 },
      { name: "Los Cuali", pj: 3, pg: 2, pe: 0, pp: 1, gf: 8, gc: 6, pts: 6 },
      { name: "Buitres FC", pj: 3, pg: 1, pe: 1, pp: 1, gf: 6, gc: 6, pts: 4 },
    ],
  },
];

export const sampleScorers = [
  { category: "Novatos Empresarial", player: "Carlos Medina", team: "Talleres FC", goals: 6 },
  { category: "Novatos Empresarial", player: "Luis Robles", team: "Constructora Norte", goals: 5 },

  { category: "Veteranos 30 y Mayores", player: "Jorge López", team: "Veteranos Culiacán", goals: 7 },
  { category: "Veteranos 30 y Mayores", player: "Ramón Valdez", team: "Deportivo 30+", goals: 4 },

  { category: "Novatos Libre", player: "Ángel Torres", team: "Malvagol FC", goals: 8 },
  { category: "Novatos Libre", player: "Mario Sánchez", team: "Los Cuali", goals: 5 },
];

export const sampleMatches = [
  {
    category: "Novatos Empresarial",
    home: "Talleres FC",
    away: "Oficinas United",
    date: "Sábado",
    time: "7:00 PM",
    field: "Cancha 1",
  },
  {
    category: "Veteranos 30 y Mayores",
    home: "Veteranos Culiacán",
    away: "Real Amigos",
    date: "Sábado",
    time: "8:00 PM",
    field: "Cancha 2",
  },
  {
    category: "Novatos Libre",
    home: "Malvagol FC",
    away: "Buitres FC",
    date: "Domingo",
    time: "6:00 PM",
    field: "Cancha 1",
  },
];