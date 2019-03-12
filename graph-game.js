/* In this game, alice and bob take turns removing any vertex of nonzero even
 * degree from an undirected graph, which also removes all connected edges.
 * The winner is the last player able to do so.
 */

//compactify vertex indices to improve memoization cache hit rates
function simplify(edges) {
  const mappings = edges
    .flat()
    .reduce((uniq, v) => uniq.includes(v) ? uniq : [...uniq, v], [])
    .sort();
  return edges.map(([v1, v2]) => [
    mappings.indexOf(v1),
    mappings.indexOf(v2)
  ]);
}

//creates a fully connected graph, then removes random edges until numEdges met
function genEdges(numEdges, numVerts) {
  let candidates = [];
  for (let v1 = 0; v1 < numVerts; v1++) {
    for (let v2 = v1 + 1; v2 < numVerts; v2++) {
      candidates.push([v1, v2]);
    }
  }
  while (candidates.length > numEdges) {
    const removalIndex = Math.floor(Math.random() * candidates.length);
    candidates.splice(removalIndex, 1);
  }
  return simplify(candidates);
}

//print an adjacency matrix
function drawGraph(edges, maxVerts) {
  const disp = Array(maxVerts).fill(undefined).map(() => Array(maxVerts).fill(" "));
  for (const [v1, v2] of edges) {
    disp[v1][v2] = "x";
    disp[v2][v1] = "x";
  }
  return [
    `   ┌${Array(maxVerts).fill("───").join("┬")}┐`,
    disp.map((row, i) =>
      `${`${i + 1}`.padStart(2)} │${row.map(c => ` ${c} `).join("│")}│`
    ).join(
      `\n   ├${Array(maxVerts).fill("───").join("┼")}┤\n`
    ),
    `   └${Array(maxVerts).fill("───").join("┴")}┘`
  ].join("\n");
}

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
        const initialEdges = genEdges(numEdges, numVerts);
        console.log(`v${numVerts}/${maxVerts}, e${numEdges}/${maxEdges}, g${i + 1}/${games}`);
        console.log(drawGraph(initialEdges, numVerts));
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

