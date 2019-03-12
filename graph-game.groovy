
enum Player {
  ALICE, BOB

  Player other() {
    this == ALICE ? BOB : ALICE
  }
}

class Graph {
  Set<Set<Integer>> edges = [].toSet()

  Graph addEdge(int v1, int v2) {
    new Graph(edges: this.edges + [[v1, v2].toSet()].toSet())
  }

  Graph removeVertex(int v) {
    new Graph(edges: this.edges.findAll {!it.contains(v)})
  }

  Set<Integer> getEvenDegree() {
    edges.collectMany {it}.countBy {it}.findAll {it.value % 2 == 0}.keySet()
  }

  Player getWinner(Player player) {
    def choices = getEvenDegree()
    if (choices.isEmpty()) {
      return player.other()
    }
    for (int choice : choices) {
      def newGraph = removeVertex(choice)
      if (newGraph.getWinner(player.other()) == player) {
        return player
      }
    }
    return player.other()
  }
}

def graph = new Graph()
graph = graph.addEdge(1, 2)
graph = graph.addEdge(2, 4)
graph = graph.addEdge(4, 3)
graph = graph.addEdge(3, 1)
graph = graph.addEdge(1, 4)

println(graph.getWinner(Player.ALICE))
