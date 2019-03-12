
//render an adjacency matrix
function drawAdjacency(edges, maxVerts, mirror) {
  const disp = Array(maxVerts).fill(undefined).map(() => Array(maxVerts).fill(" "));
  for (const [v1, v2] of edges) {
    disp[v1][v2] = "x";
    if (mirror) disp[v2][v1] = "x";
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

//creates a fully connected graph, then removes random edges until numEdges met
function generateUndirected(numEdges, numVerts) {
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
  return compactify(candidates);
}

//reduce vertex indices to their minimum
function compactify(edges) {
  const mappings = edges
    .flat()
    .reduce((uniq, v) => uniq.includes(v) ? uniq : [...uniq, v], [])
    .sort();
  return edges.map(([v1, v2]) => [
    mappings.indexOf(v1),
    mappings.indexOf(v2)
  ]);
}

module.exports = {
  compactify,
  generateUndirected,
  drawAdjacency
};
