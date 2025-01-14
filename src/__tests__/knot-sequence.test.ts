import { KnotSequenceGenerator } from "../index";

describe("KnotSequenceGenerator", () => {
  test("generates uniform knot sequence correctly", () => {
    const result = KnotSequenceGenerator.generateUniform(3, 5);
    expect(result.knots).toHaveLength(9); // degree + controlPoints + 1
    expect(result.degree).toBe(3);
  });

  test("generates open knot sequence correctly", () => {
    const result = KnotSequenceGenerator.generateOpen(3, 5);
    expect(result.knots).toHaveLength(9);
    expect(result.knots[0]).toBe(0);
    expect(result.knots[8]).toBe(2);
  });
});
