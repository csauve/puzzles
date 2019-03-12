/* Determines the volume of the intersection of two upright cones,
 * whose top points have been translated 'a' and 'b' units in opposite
 * colinear directions from the template cone's.
 */
def circleIntersectionArea(double r, double d) {
  def a = Math.acos(d / (2 * r))
  return 2 * (r * r * (a - Math.cos(a) * Math.sin(a)))
}

def getDistance(double currHeight, double height, double a, double b) {
  return (a + b) * (currHeight / height)
}

def integral(double height, double a, double b, double r) {
  def iterations = 1000
  def volume = 0
  def sliceHeight = height / iterations
  for (int i = 0; i < iterations; i++) {
    def currHeight = (i / iterations) * height
    def distance = getDistance(currHeight, height, a, b)
    def currRadius = ((iterations - i) / iterations) * r
    if (distance >= (2 * currRadius)) break
    def intersection = circleIntersectionArea(currRadius, distance)
    volume += sliceHeight * intersection
  }
  return volume
}


println "Result: ${integral(10, 10, 10, 10)}"
