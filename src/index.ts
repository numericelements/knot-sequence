export interface KnotSequence {
  knots: number[];
  degree: number;
}

export class KnotSequenceGenerator {
  /**
   * Generates a uniform knot sequence
   * @param degree - The degree of the B-spline
   * @param controlPoints - Number of control points
   */
  static generateUniform(degree: number, controlPoints: number): KnotSequence {
    const numberOfKnots = controlPoints + degree + 1;
    const knots: number[] = [];

    for (let i = 0; i < numberOfKnots; i++) {
      knots.push(i);
    }

    return { knots, degree };
  }

  /**
   * Generates an open (clamped) knot sequence
   * @param degree - The degree of the B-spline
   * @param controlPoints - Number of control points
   */
  static generateOpen(degree: number, controlPoints: number): KnotSequence {
    const numberOfKnots = controlPoints + degree + 1;
    const knots: number[] = [];

    // Add degree + 1 zeros at the start
    for (let i = 0; i <= degree; i++) {
      knots.push(0);
    }

    // Add internal knots
    for (let i = 1; i < controlPoints - degree; i++) {
      knots.push(i);
    }

    // Add degree + 1 final values
    const maxValue = controlPoints - degree;
    for (let i = 0; i <= degree; i++) {
      knots.push(maxValue);
    }

    return { knots, degree };
  }
}
