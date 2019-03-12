const {drawAdjacency, generateUndirected} = require("./lib/graphs.js");

/* In this game, alice and bob take turns removing any vertex of nonzero even
 * degree from an undirected graph, which also removes all connected edges.
 * The winner is the last player able to do so.
 */

//determines if the starting player will win if players have optimal strategy
const memory = {};
function play(initialEdges) {
  function turn(edges, player) {
    const verts = edges.flat();

    const argHash = [...verts, player ? 1 : 0].reduce((hash, v) => {
      hash = ((hash << 5) - hash) + v;
      return hash & hash;
    }, 0);

    if (memory[argHash] !== undefined) return memory[argHash];

    const odds = verts.reduce((res, v) => (res[v] = !res[v], res), {});
    const choices = verts.filter(v => !odds[v]);
    let winner = !player;

    for (const v of choices) {
      const newEdges = edges.filter(edge => !edge.includes(v));
      if (turn(newEdges, !player) == player) {
        winner = player;
        break;
      }
    }
    return memory[argHash] = winner;
  }

  const winner = turn(initialEdges, true);
  return winner;
}

const valueScale = [
  "\x1b[31m█\x1b[0m",
  "\x1b[34m \x1b[0m",
  "\x1b[34m░\x1b[0m",
  "\x1b[34m▒\x1b[0m",
  "\x1b[34m▓\x1b[0m",
  "\x1b[34m█\x1b[0m",
  "\x1b[36m█\x1b[0m",
  "\x1b[37m█\x1b[0m",
];

//runs a series of games with varying vertex and edge counts, printing win rates
async function chart(games, maxVerts) {
  const winRates = [];

  for (let numVerts = 3; numVerts <= maxVerts; numVerts++) {
    const byEdge = [];
    const maxEdges = Math.floor((numVerts * (numVerts - 1)) / 2);
    for (let numEdges = 1; numEdges <= maxEdges; numEdges++) {
      let wins = 0;
      for (let i = 0; i < games; i++) {
        const initialEdges = generateUndirected(numEdges, numVerts);
        console.log(`v${numVerts}/${maxVerts}, e${numEdges}/${maxEdges}, g${i + 1}/${games}`);
        console.log(drawAdjacency(initialEdges, numVerts, true));
        if (play(initialEdges)) wins++;
      }
      byEdge.push({numEdges, r: wins / games});
    }
    winRates.push({numVerts, byEdge});
  }

  const chart = winRates
    .map(({numVerts, byEdge}) => {
      const rateChart = byEdge.map(({numEdges, r}) =>
        valueScale[Math.floor(r * valueScale.length)] || "\x1b[32m█\x1b[0m"
      ).join("");
      return `${`${numVerts}`.padStart(2)} │${rateChart}`;
    })
    .join("\n");

  console.log();
  console.log(chart);
}

const games = 100;
const maxVerts = 11;
chart(games, maxVerts);
