import { expect } from "chai";
import { StrictlyIncreasingOpenKnotSequenceOpenCurve } from "../src/StrictlyIncreasingOpenKnotSequenceOpenCurve";
import { NO_KNOT_OPEN_CURVE, STRICTLYINCREASINGOPENKNOTSEQUENCE, STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, UNIFORM_OPENKNOTSEQUENCE, UNIFORMLYSPREADINTERKNOTS_OPENKNOTSEQUENCE } from "../src/KnotSequenceConstructorInterface";
import { EM_ABSCISSA_AND_INDEX_ORIGIN_KNOT_SEQUENCE_INCONSISTENT, EM_ABSCISSA_TOO_CLOSE_TO_KNOT, EM_CUMULATIVE_KNOTMULTIPLICITY_ATEND, EM_CUMULATIVE_KNOTMULTIPLICITY_ATSTART, EM_INCONSISTENT_ORIGIN_NONUNIFORM_KNOT_SEQUENCE, EM_KNOT_INSERTION_OVER_UMAX, EM_KNOT_INSERTION_UNDER_SEQORIGIN, EM_KNOT_MULTIPLICITY_OUT_OF_RANGE, EM_KNOT_SIZE_MULTIPLICITY_SIZE_NOT_EQUAL, EM_KNOTINDEX_INC_SEQ_TOO_LARGE, EM_KNOTINDEX_STRICTLY_INCREASING_SEQ_OUT_RANGE, EM_MAXMULTIPLICITY_ORDER_ATKNOT, EM_MAXMULTIPLICITY_ORDER_INTERMEDIATE_KNOT, EM_MAXMULTIPLICITY_ORDER_KNOT, EM_MAXMULTIPLICITY_ORDER_SEQUENCE, EM_MULTIPLICITY_ORDER_MODIFYING_NORMALIZED_BASIS, EM_NON_STRICTLY_INCREASING_VALUES, EM_NORMALIZED_BASIS_INTERVAL_NOTSUFFICIENT, EM_NOT_NORMALIZED_BASIS, EM_NULL_KNOT_SEQUENCE, EM_NULL_MULTIPLICITY_ARRAY, EM_ORIGIN_NORMALIZEDKNOT_SEQUENCE, EM_SIZENORMALIZED_BSPLINEBASIS, EM_U_OUTOF_KNOTSEQ_RANGE } from "../src/ErrorMessages/KnotSequences";
import { COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF } from "./namedConstants/GeneralPurpose";
import { KNOT_COINCIDENCE_TOLERANCE, NormalizedBasisAtSequenceExtremity, KNOT_SEQUENCE_ORIGIN } from "../src/namedConstants/KnotSequences";
import { KnotIndexStrictlyIncreasingSequence } from "../src/KnotIndexStrictlyIncreasingSequence";
import { EM_KNOT_INDEX_VALUE } from "../src/ErrorMessages/Knots";
import { WM_ABSCISSA_NOT_FOUND_IN_SEQUENCE } from "../src/WarningMessages/KnotSequences";

describe('StrictlyIncreasingOpenKnotSequenceOpenCurve', () => {

    describe('Constructor', () => {

        describe(NO_KNOT_OPEN_CURVE, () => {

            it('cannot initialize a knot sequence with a maximal multiplicity order smaller than one for a constructor type ' + NO_KNOT_OPEN_CURVE, () => {
                const maxMultiplicityOrder = 0
                expect(() => new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: NO_KNOT_OPEN_CURVE})).to.throw(EM_MAXMULTIPLICITY_ORDER_SEQUENCE)
            });

            it('cannot initialize a knot sequence with a maximal multiplicity order equal to one for a constructor type ' + NO_KNOT_OPEN_CURVE, () => {
                const maxMultiplicityOrder = 1
                expect(() => new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: NO_KNOT_OPEN_CURVE})).to.throw(EM_MAXMULTIPLICITY_ORDER_SEQUENCE)
            });

            it('can be initialized without a knot sequence with initializer ' + NO_KNOT_OPEN_CURVE, () => {
                for(let i = 2; i < 4; i++) {
                    const maxMultiplicityOrder = i
                    const seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: NO_KNOT_OPEN_CURVE})
                    const knots: number[] = [0, 1]
                    const multiplicities: number[] = []
                    for(let j = 0; j < knots.length; j++) {
                        multiplicities.push(maxMultiplicityOrder)
                    }
                    const seq1: number[] = [];
                    const seq2: number[] = [];
                    for(const knot of seq) {
                        if(knot !== undefined) {
                            seq1.push(knot.abscissa)
                            seq2.push(knot.multiplicity)
                        }
                    }
                    expect(seq1).to.eql(knots)
                    expect(seq2).to.eql(multiplicities)
                }
            });

            it('can get the knot index of the curve origin with ' + NO_KNOT_OPEN_CURVE, () => {
                const maxMultiplicityOrder = 3
                const seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: NO_KNOT_OPEN_CURVE})
                expect(seq.indexKnotOrigin.knotIndex).to.eql(0)
            });

            it('can get the properties of knot sequnence produced with the initializer ' + NO_KNOT_OPEN_CURVE, () => {
                const maxMultiplicityOrder = 3
                const seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: NO_KNOT_OPEN_CURVE})
                expect(seq.isKnotSpacingUniform).to.eql(true)
                expect(seq.isKnotMultiplicityUniform).to.eql(false)
                expect(seq.isKnotMultiplicityNonUniform).to.eql(true)
            });

            it('can get the u interval upper bound produced with the initializer ' + NO_KNOT_OPEN_CURVE, () => {
                const maxMultiplicityOrder = 3
                const seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: NO_KNOT_OPEN_CURVE})
                const lastIndex = seq.length() - 1
                expect(seq.abscissaAtIndex(new KnotIndexStrictlyIncreasingSequence(0))).to.eql(0.0)
                expect(seq.abscissaAtIndex(new KnotIndexStrictlyIncreasingSequence(lastIndex))).to.eql(1.0)
                expect(seq.uMax).to.eql(1.0)
            });
        });

        describe(UNIFORM_OPENKNOTSEQUENCE, () => {

            it('cannot initialize a knot sequence with a maximal multiplicity order smaller than two for a constructor type ' + UNIFORM_OPENKNOTSEQUENCE, () => {
                const maxMultiplicityOrder = 1
                const BsplBasisSize = 2
                expect(() => new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: UNIFORM_OPENKNOTSEQUENCE, BsplBasisSize: BsplBasisSize})).to.throw(EM_MAXMULTIPLICITY_ORDER_SEQUENCE)
            });

            it('cannot initialize a knot sequence with a size of normalized B-spline basis smaller than the maximal multiplicity with ' + UNIFORM_OPENKNOTSEQUENCE, () => {
                const maxMultiplicityOrder = 2
                const BsplBasisSize = maxMultiplicityOrder - 1
                expect(() => new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: UNIFORM_OPENKNOTSEQUENCE, BsplBasisSize: BsplBasisSize})).to.throw(EM_SIZENORMALIZED_BSPLINEBASIS)
            });

            it('can be initialized with a size of normalized B-spline basis produced by the initializer ' + UNIFORM_OPENKNOTSEQUENCE, () => {
                for(let i = 2; i < 5; i++) {
                    const maxMultiplicityOrder = i
                    const upperBound = 4
                    for(let j = maxMultiplicityOrder; j < (maxMultiplicityOrder + upperBound); j++) {
                        const seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: UNIFORM_OPENKNOTSEQUENCE, BsplBasisSize: j})
                        const knots: number[] = []
                        const multiplicities: number[] = []
                        for(let k = - (maxMultiplicityOrder - 1); k < (j + maxMultiplicityOrder - 1); k++) {
                            knots.push(k)
                            multiplicities.push(1)
                        }
                        const seq1: number[] = [];
                        const seq2: number[] = [];
                        for(const knot of seq) {
                            if(knot !== undefined) {
                                seq1.push(knot.abscissa)
                                seq2.push(knot.multiplicity)
                            }
                        }
                        expect(seq1).to.eql(knots)
                        expect(seq2).to.eql(multiplicities)
                    }
                }
            });

            it('can get the knot index of the curve origin produced by the initializer ' + UNIFORM_OPENKNOTSEQUENCE, () => {
                const maxMultiplicityOrder = 3
                const BsplBasisSize = 3
                const seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: UNIFORM_OPENKNOTSEQUENCE, BsplBasisSize: BsplBasisSize})
                expect(seq.indexKnotOrigin.knotIndex).to.eql(maxMultiplicityOrder - 1)
            });

            it('can get the u interval upper bound produced by the initializer ' + UNIFORM_OPENKNOTSEQUENCE, () => {
                const maxMultiplicityOrder = 3
                const BsplBasisSize = 3
                const seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: UNIFORM_OPENKNOTSEQUENCE, BsplBasisSize: BsplBasisSize})
                expect(seq.uMax).to.eql(BsplBasisSize - 1)
            });

            it('can get the properties of knot sequnence produced by the initializer' + UNIFORM_OPENKNOTSEQUENCE, () => {
                const maxMultiplicityOrder = 3
                const BsplBasisSize = 3
                const seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: UNIFORM_OPENKNOTSEQUENCE, BsplBasisSize: BsplBasisSize})
                expect(seq.isKnotSpacingUniform).to.eql(true)
                expect(seq.isKnotMultiplicityUniform).to.eql(true)
                expect(seq.isKnotMultiplicityNonUniform).to.eql(false)
            });
        });

        describe(UNIFORMLYSPREADINTERKNOTS_OPENKNOTSEQUENCE, () => {

            it('cannot initialize a knot sequence with a maximal multiplicity order smaller than two for a constructor type' + UNIFORMLYSPREADINTERKNOTS_OPENKNOTSEQUENCE, () => {
                const maxMultiplicityOrder = 1
                const BsplBasisSize = 2
                expect(() => new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: UNIFORMLYSPREADINTERKNOTS_OPENKNOTSEQUENCE, BsplBasisSize: BsplBasisSize})).to.throw(EM_MAXMULTIPLICITY_ORDER_SEQUENCE)
            });
        
            it('cannot initialize a knot sequence with a maximal multiplicity order of two if the size of the B-spline basis is lower than maxMultiplicityOrder using initializer ' + UNIFORMLYSPREADINTERKNOTS_OPENKNOTSEQUENCE, () => {
                const maxMultiplicityOrder = 2
                const BsplBasisSize = maxMultiplicityOrder - 1
                expect(() => new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: UNIFORMLYSPREADINTERKNOTS_OPENKNOTSEQUENCE, BsplBasisSize: BsplBasisSize})).to.throw(EM_SIZENORMALIZED_BSPLINEBASIS)
            });

            it('can be initialized with a number of control points produced by the initializer' + UNIFORMLYSPREADINTERKNOTS_OPENKNOTSEQUENCE, () => {
                for(let i = 2; i < 5; i++) {
                    const maxMultiplicityOrder = i
                    const upperBound = 3
                    for(let j = maxMultiplicityOrder; j < (maxMultiplicityOrder + upperBound); j++) {
                        const seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: UNIFORMLYSPREADINTERKNOTS_OPENKNOTSEQUENCE, BsplBasisSize: j})
                        const knots: number[] = []
                        const multiplicities: number[] = []
                        knots.push(0)
                        multiplicities.push(maxMultiplicityOrder)
                        knots.push(j - maxMultiplicityOrder + 1)
                        multiplicities.push(maxMultiplicityOrder)
                        for(let k = 0; k < (j - maxMultiplicityOrder); k++) {
                            knots.splice((1 + k), 0, (k + 1))
                            multiplicities.splice((1 + k), 0, 1)
                        }
                        const seq1: number[] = [];
                        const seq2: number[] = [];
                        for(const knot of seq) {
                            if(knot !== undefined) {
                                seq1.push(knot.abscissa)
                                seq2.push(knot.multiplicity)
                            }
                        }
                        expect(seq1).to.eql(knots)
                        expect(seq2).to.eql(multiplicities)
                    }
                }
            });

            it('can get the knot index of the curve origin produced by the initializer' + UNIFORMLYSPREADINTERKNOTS_OPENKNOTSEQUENCE, () => {
                const maxMultiplicityOrder = 3
                const BsplBasisSize = 4;
                const seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: UNIFORMLYSPREADINTERKNOTS_OPENKNOTSEQUENCE, BsplBasisSize: BsplBasisSize})
                expect(seq.indexKnotOrigin.knotIndex).to.eql(0)
            });

            it('can get the u interval upper bound produced by the initializer' +  UNIFORMLYSPREADINTERKNOTS_OPENKNOTSEQUENCE, () => {
                const maxMultiplicityOrder = 3
                const BsplBasisSize = 4;
                const seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: UNIFORMLYSPREADINTERKNOTS_OPENKNOTSEQUENCE, BsplBasisSize: BsplBasisSize})
                expect(seq.uMax).to.eql(BsplBasisSize - maxMultiplicityOrder + 1)
            });

            it('can get the properties of knot sequence produced by the initializer' + UNIFORMLYSPREADINTERKNOTS_OPENKNOTSEQUENCE, () => {
                const maxMultiplicityOrder = 3
                const BsplBasisSize = 4
                const seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: UNIFORMLYSPREADINTERKNOTS_OPENKNOTSEQUENCE, BsplBasisSize: BsplBasisSize})
                expect(seq.isKnotSpacingUniform).to.eql(true)
                expect(seq.isKnotMultiplicityUniform).to.eql(false)
                expect(seq.isKnotMultiplicityNonUniform).to.eql(true)
            });
        });

        describe(STRICTLYINCREASINGOPENKNOTSEQUENCE, () => {
            it('cannot initialize a knot sequence with a maximal multiplicity order smaller than one for a constructor type ' + STRICTLYINCREASINGOPENKNOTSEQUENCE, () => {
                const maxMultiplicityOrder = 0
                const knots: number [] = [0, 1]
                const multiplicities: number [] = [0, 0]
                expect(() => new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities})).to.throw(EM_MAXMULTIPLICITY_ORDER_SEQUENCE)
            });

            it('cannot be initialized with a null length array of knots with intializer ' + STRICTLYINCREASINGOPENKNOTSEQUENCE, () => {
                const maxMultiplicityOrder = 3
                const knots: number [] = []
                const multiplicities: number[] = [1]
                expect(() => new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities})).to.throw(EM_NULL_KNOT_SEQUENCE)
            });

            it('cannot be initialized with a null length array of multiplicities with intializer ' + STRICTLYINCREASINGOPENKNOTSEQUENCE, () => {
                const maxMultiplicityOrder = 3
                const knots: number [] = [0, 1, 2]
                const multiplicities: number[] = []
                expect(() => new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities})).to.throw(EM_NULL_MULTIPLICITY_ARRAY)
            });

            it('cannot be initialized with a knot sequence having a length differing from that of the multiplicities with ' + STRICTLYINCREASINGOPENKNOTSEQUENCE, () => {
                const knots: number [] = [0, 0.5, 0.6, 0.7, 1]
                const multiplicities: number[] = [4, 1, 1, 2]
                const maxMultiplicityOrder = 4;
                expect(() => new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities})).to.throw(EM_KNOT_SIZE_MULTIPLICITY_SIZE_NOT_EQUAL)
            });

            it('cannot initialize a knot sequence with a number of knots smaller than maxMultiplicityOrder for a constructor type ' + STRICTLYINCREASINGOPENKNOTSEQUENCE, () => {
                const maxMultiplicityOrder = 4
                const knots: number [] = [0, 1, 2]
                const multiplicities: number [] = [1, 1, 1]
                expect(() => new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities})).to.throw(EM_NOT_NORMALIZED_BASIS)
            });

            it('cannot be initialized with a knot multiplicity smaller than one using initializer ' + STRICTLYINCREASINGOPENKNOTSEQUENCE, () => {
                const knots: number [] = [0, 0.5, 0.6, 0.7, 1]
                const multiplicities: number[] = [3, 1, 1, 2, 3]
                const maxMultiplicityOrder = 3;
                for(let i = 0; i < knots.length; i++) {
                    const multiplicity = multiplicities[i];
                    multiplicities[i] = 0;
                    expect(() => new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities})).to.throw(EM_KNOT_MULTIPLICITY_OUT_OF_RANGE)
                    multiplicities[i] = multiplicity;
                }
            });

            it('cannot be initialized if the knot sequence is not strictly increasing using initializer ' + STRICTLYINCREASINGOPENKNOTSEQUENCE, () => {
                const knots: number [] = [0, 0.5, 0.6, 0.7, 1]
                const multiplicities: number[] = [3, 1, 1, 2, 3]
                const maxMultiplicityOrder = 3;
                for(let i = 1; i < knots.length; i++) {
                    const knot = knots[i];
                    knots[i] = knots[i - 1];
                    expect(() => new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities})).to.throw(EM_NON_STRICTLY_INCREASING_VALUES)
                    knots[i] = knot;
                }
            });

            it('cannot initialize a non uniform knot sequence if the first knot is not zero with initializer ' + STRICTLYINCREASINGOPENKNOTSEQUENCE, () => {
                const knots: number [] = [0.1, 0.5, 0.6, 0.7, 1]
                const multiplicities: number[] = [4, 1, 1, 2, 4]
                const maxMultiplicityOrder = 4;
                expect(() => new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities})).to.throw(EM_INCONSISTENT_ORIGIN_NONUNIFORM_KNOT_SEQUENCE)
            });

            it('cannot initialize a knot sequence with a number of knots such that there no interval of normalized basis left.', () => {
                const maxMultiplicityOrder = 4
                const knots: number [] = [-2, -1, 0, 1, 2]
                const multiplicities: number[] = [1, 1, 1, 1, 1]
                expect(() => new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities})).to.throw(EM_NORMALIZED_BASIS_INTERVAL_NOTSUFFICIENT)
            });

            it('cannot initialize a knot sequence with a number of knots such that the interval of normalized basis reduces to zero.', () => {
                const maxMultiplicityOrder = 4
                const knots: number [] = [-3, -2, -1, 0, 1, 2, 3]
                const multiplicities: number[] = [1, 1, 1, 1, 1, 1, 1]
                expect(() => new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities})).to.throw(EM_NORMALIZED_BASIS_INTERVAL_NOTSUFFICIENT)
            });

            it('cannot be initialized with a knot having a multiplicity larger than maxMultiplicityOrder with ' + STRICTLYINCREASINGOPENKNOTSEQUENCE, () => {
                const maxMultiplicityOrder = 3;
                const knots: number [] = [0, 0.5, 2, 3, 4, 5]
                const multiplicities: number[] = [3, 1, 1, 1, 1, 4]
                expect(() => new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities})).to.throw(EM_MAXMULTIPLICITY_ORDER_KNOT)
                const multiplicities1: number[] = [4, 1, 1, 1, 1, 3]
                expect(() => new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities1})).to.throw(EM_MAXMULTIPLICITY_ORDER_KNOT)
                const multiplicities2: number[] = [3, 1, 4, 1, 1, 3]
                expect(() => new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities2})).to.throw(EM_MAXMULTIPLICITY_ORDER_KNOT)
            });

            it('cannot be initialized for non-uniform B-splines with an intermediate knot having a multiplicity equal to maxMultiplicityOrder with ' + STRICTLYINCREASINGOPENKNOTSEQUENCE, () => {
                const maxMultiplicityOrder = 3;
                let knots: number [] = [0, 0.5, 2, 3, 4, 5]
                let multiplicities: number [] = [3, 1, 1, 1, 1, 3]
                const upperBound = knots.length;
                for(let i = maxMultiplicityOrder; i < upperBound - maxMultiplicityOrder; i++) {
                    const multiplicities1 = multiplicities.slice();
                    multiplicities[i] = maxMultiplicityOrder
                    expect(() => new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities})).to.throw(EM_MAXMULTIPLICITY_ORDER_INTERMEDIATE_KNOT)
                    multiplicities = multiplicities1.slice()
                }
            });

            it('cannot be initialized for uniform B-splines with an intermediate knot having a multiplicity equal to maxMultiplicityOrder with ' + STRICTLYINCREASINGOPENKNOTSEQUENCE, () => {
                const knots: number [] = [-2, -1, 0, 0.5, 1, 2, 3, 4, 5, 6, 7]
                let multiplicities: number [] = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
                const maxMultiplicityOrder = 3;
                const upperBound = knots.length;
                for(let i = maxMultiplicityOrder; i < upperBound - maxMultiplicityOrder; i++) {
                    const multiplicities1 = multiplicities.slice();
                    multiplicities[i] = maxMultiplicityOrder
                    expect(() => new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities})).to.throw(EM_MAXMULTIPLICITY_ORDER_INTERMEDIATE_KNOT)
                    multiplicities = multiplicities1.slice()
                }
            });

            it("cannot be initialized with an initializer " + STRICTLYINCREASINGOPENKNOTSEQUENCE + "when knot multiplicities from the sequence start don't define a normalized basis", () => {
                const maxMultiplicityOrder = 4
                const knots = [-1, 0, 0.5, 0.6, 0.7, 1]
                const multiplicities: number [] = [2, 3, 1, 1, 2, 4]
                expect(() => new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities})).to.throw(EM_CUMULATIVE_KNOTMULTIPLICITY_ATSTART)
            });
        
            it("cannot be initialized with an initializer " + STRICTLYINCREASINGOPENKNOTSEQUENCE + "when knot multiplicities from the sequence end don't define a normalized basis", () => {
                const maxMultiplicityOrder = 4
                const knots = [0, 0.5, 0.6, 0.7, 1, 2]
                const multiplicities: number [] = [4, 1, 1, 2, 3, 2]
                expect(() => new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities})).to.throw(EM_CUMULATIVE_KNOTMULTIPLICITY_ATEND)
            });
        });
    
        describe('Initialization of knot sequences for non uniform B-splines', () => {

            it('can be initialized with an initializer ' + STRICTLYINCREASINGOPENKNOTSEQUENCE + ' . Non uniform knot sequence of open curve without intermediate knots', () => {
                const maxMultiplicityOrder = 4
                const knots = [0, 1]
                const multiplicities: number [] = [4, 4]
                const seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities})
                expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
                const seq1: number[] = [];
                const multiplicities1: number[] = [];
                for(const knot of seq) {
                    if(knot !== undefined) {
                        seq1.push(knot.abscissa)
                        multiplicities1.push(knot.multiplicity)
                    }
                }
                expect(seq1).to.eql(knots)
                expect(multiplicities1).to.eql(multiplicities)
            });

            it('can get the properties of the knot sequence. Non uniform B-Spline without intermediate knot', () => {
                const maxMultiplicityOrder = 4
                const knots = [0, 1]
                const multiplicities: number [] = [4, 4]
                const seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities})
                expect(seq.isKnotSpacingUniform).to.eql(true)
                expect(seq.isKnotMultiplicityUniform).to.eql(false)
                expect(seq.isKnotMultiplicityNonUniform).to.eql(true)
            });

            it('can be initialized as a description of a non-uniform B-spline with ' + STRICTLYINCREASINGOPENKNOTSEQUENCE, () => {
                const knots: number [] = [0.0, 0.5, 0.6, 0.7, 1]
                const multiplicities: number[] = [4, 1, 1, 2, 4]
                const maxMultiplicityOrder = 4;
                const seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities});
                expect(seq.distinctAbscissae()).to.eql([0.0, 0.5, 0.6, 0.7, 1])
                expect(seq.multiplicities()).to.eql([4, 1, 1, 2, 4])
            });

            it('can get the knot index and the abscissa of the upper bound of the normalized basis. Non uniform B-Spline without intermediate knot', () => {
                const maxMultiplicityOrder = 4
                const knots = [0, 1]
                const multiplicities: number [] = [4, 4]
                const seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities})
                expect(seq.indexKnotOrigin).to.eql(new KnotIndexStrictlyIncreasingSequence(0))
                expect(seq.uMax).to.eql(knots[knots.length -1])
            });

            it('can be initialized with an initializer ' + STRICTLYINCREASINGOPENKNOTSEQUENCE + '. non uniform knot sequence of open curve with intermediate knots', () => {
                const maxMultiplicityOrder = 4
                const knots = [0, 0.5, 0.6, 0.7, 1]
                const multiplicities: number[] = [4, 1, 1, 2, 4]
                const seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities})
                expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
                const seq1: number[] = [];
                const multiplicities1: number[] = [];
                for(const knot of seq) {
                    if(knot !== undefined) {
                        seq1.push(knot.abscissa)
                        multiplicities1.push(knot.multiplicity)
                    }
                }
                expect(seq1).to.eql(knots)
                expect(multiplicities1).to.eql(multiplicities)
            });

            it('can get the properties of knot sequence: non uniform knot sequence of open curve with intermediate knots.', () => {
                const maxMultiplicityOrder = 4
                const knots = [0, 0.5, 0.6, 0.7, 1]
                const multiplicities: number[] = [4, 1, 1, 2, 4]
                const seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities})
                expect(seq.isKnotSpacingUniform).to.eql(false)
                expect(seq.isKnotMultiplicityUniform).to.eql(false)
                expect(seq.isKnotMultiplicityNonUniform).to.eql(true)
            });

            it('can get the knot index of the sequence origin and the abscissa upper bound of the normalized basis: non uniform knot sequence of open curve with intermediate knots', () => {
                const maxMultiplicityOrder = 4
                const knots = [0, 0.5, 0.6, 0.7, 1]
                const multiplicities: number[] = [4, 1, 1, 2, 4]
                const seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities})
                expect(seq.indexKnotOrigin).to.eql(new KnotIndexStrictlyIncreasingSequence(0))
                expect(seq.uMax).to.eql(1)
            });
        });
    
        describe('Initialization of knot sequences for uniform B-splines', () => {
            it('can be initialized with an initializer ' + STRICTLYINCREASINGOPENKNOTSEQUENCE + '. uniform knot sequence of open curve without intermediate knots', () => {
                const maxMultiplicityOrder = 2
                const knots = [-1, 0, 1, 2, 3, 5, 6, 7]
                const multiplicities: number[] = [1, 1, 1, 1, 1, 1, 1, 1]
                const seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities})
                expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
                const seq1: number[] = [];
                const multiplicities1: number[] = [];
                for(const knot of seq) {
                    if(knot !== undefined) {
                        seq1.push(knot.abscissa)
                        multiplicities1.push(knot.multiplicity)
                    }
                }
                expect(seq1).to.eql(knots)
                expect(multiplicities1).to.eql(multiplicities)
            });

            it('can get the properties of the knot sequence. uniform B-Spline with uniformly distributed knots', () => {
                const maxMultiplicityOrder = 2
                const knots = [-1, 0, 1, 2, 3, 4, 5, 6]
                const multiplicities: number[] = [1, 1, 1, 1, 1, 1, 1, 1]
                const seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities})
                expect(seq.isKnotSpacingUniform).to.eql(true)
                expect(seq.isKnotMultiplicityUniform).to.eql(true)
                expect(seq.isKnotMultiplicityNonUniform).to.eql(false)
            });

            it('can get the properties of the knot sequence. uniform B-Spline with non uniformly distributed knots', () => {
                const maxMultiplicityOrder = 2
                const knots = [-1, 0, 1, 2.5, 3, 4, 5, 6]
                const multiplicities: number[] = [1, 1, 1, 1, 1, 1, 1, 1]
                const seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities})
                expect(seq.isKnotSpacingUniform).to.eql(false)
                expect(seq.isKnotMultiplicityUniform).to.eql(true)
                expect(seq.isKnotMultiplicityNonUniform).to.eql(false)
            });

            it('can get the knot index of the sequence origin and the abscissa upper bound of the normalized basis: uniform knot sequence of open curve', () => {
                const maxMultiplicityOrder = 3
                const knots = [-2, -1, 0, 0.5, 0.6, 0.7, 1, 2.5, 3]
                const multiplicities: number[] = [1, 1, 1, 1, 1, 2, 1, 1, 1]
                const seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities})
                expect(seq.indexKnotOrigin).to.eql(new KnotIndexStrictlyIncreasingSequence(maxMultiplicityOrder - 1))
                expect(seq.uMax).to.eql(1)
            });
        });

        describe('Initialization of arbitrary knot sequences for B-splines', () => {
            it('can be initialized with uniform like knots at left and non-uniform knots at right.', () => {
                const maxMultiplicityOrder = 4
                const knots = [-2, -1, 0, 0.5, 0.6, 0.7, 1]
                const multiplicities: number[] = [1, 1, 2, 1, 1, 2, 4]
                const seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities})
                expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
                const seq1: number[] = [];
                const multiplicities1: number[] = [];
                for(const knot of seq) {
                    if(knot !== undefined) {
                        seq1.push(knot.abscissa)
                        multiplicities1.push(knot.multiplicity)
                    }
                }
                expect(seq1).to.eql(knots)
                expect(multiplicities1).to.eql(multiplicities)
            });
        
            it('can get the properties of an arbitrary knot sequence', () => {
                const maxMultiplicityOrder = 4
                const knots = [-2, -1, 0, 0.5, 0.6, 0.7, 1]
                const multiplicities: number[] = [1, 1, 2, 1, 1, 2, 4]
                const seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities})
                expect(seq.isKnotSpacingUniform).to.eql(false)
                expect(seq.isKnotMultiplicityUniform).to.eql(false)
                expect(seq.isKnotMultiplicityNonUniform).to.eql(false)
            });

            it('can get the knot index of the sequence origin and maximal abscissa of the normalized knot sequence', () => {
                const knots: number [] = [-2, -1, 0, 0.5, 0.6, 0.7, 1]
                const maxMultiplicityOrder = 4
                const multiplicities: number[] = [1, 1, 2, 1, 1, 2, 4]
                const seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities})
                expect(seq.indexKnotOrigin.knotIndex).to.eql(2)
                expect(seq.uMax).to.eql(1)
            });
        });

        describe(STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, () => {
            it('cannot initialize a knot sequence with a maximal multiplicity order smaller than one for a constructor type ' + STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, () => {
                const maxMultiplicityOrder = 0
                const knots: number [] = [0, 1]
                const multiplicities: number[] = [1, 1]
                expect(() => new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, knots: knots, multiplicities: multiplicities})).to.throw(EM_MAXMULTIPLICITY_ORDER_SEQUENCE)
            });

            it('cannot be initialized with a null knot sequence produced by the initializer ' + STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, () => {
                const maxMultiplicityOrder = 3
                const knots: number [] = []
                const multiplicities: number[] = [1, 1]
                expect(() => new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, knots: knots, multiplicities: multiplicities})).to.throw(EM_NULL_KNOT_SEQUENCE)
            });

            it('cannot be initialized with a knot having a multiplicity larger than maxMultiplicityOrder with ' + STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, () => {
                const maxMultiplicityOrder = 3;
                const knots: number [] = [0, 0.5, 2, 3, 4, 5]
                const multiplicities: number[] = [1, 1, 1, 1, 1, 4]
                expect(() => new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, knots: knots, multiplicities: multiplicities})).to.throw(EM_MAXMULTIPLICITY_ORDER_KNOT)
                const knots1: number [] = [0, 0.5, 2, 3, 4, 5]
                const multiplicities1: number[] = [4, 1, 1, 1, 1, 1]
                expect(() => new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, knots: knots1, multiplicities: multiplicities1})).to.throw(EM_MAXMULTIPLICITY_ORDER_KNOT)
                const knots2: number [] = [0, 0.5, 2, 3, 4, 5]
                const multiplicities2: number[] = [1, 1, 4, 1, 1, 1]
                expect(() => new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, knots: knots2, multiplicities: multiplicities2})).to.throw(EM_MAXMULTIPLICITY_ORDER_KNOT)
            });

            it('cannot be initialized with a knot sequence producing a non normalized basis', () => {
                const knots: number [] = [-1, 0, 1]
                const multiplicities: number[] = [1, 1, 1]
                const maxMultiplicityOrder = 4
                expect(() => new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, knots: knots, multiplicities: multiplicities})).to.throw(EM_NOT_NORMALIZED_BASIS)
            });

            it('cannot be initialized with a knot sequence able to produce normalized basis intervals that are incompatible with each other', () => {
                const knots: number [] = [-2, -1, 0, 1, 2]
                const multiplicities: number[] = [1, 1, 1, 1, 1]
                const maxMultiplicityOrder = 4
                expect(() => new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, knots: knots, multiplicities: multiplicities})).to.throw(EM_NORMALIZED_BASIS_INTERVAL_NOTSUFFICIENT)
            });

            it('cannot be initialized with a knot sequence producing a normalized basis interval with null amplitude', () => {
                const knots: number [] = [-3, -2, -1, 0, 1, 2, 3]
                const multiplicities: number[] = [1, 1, 1, 1, 1, 1, 1]
                const maxMultiplicityOrder = 4
                expect(() => new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, knots: knots, multiplicities: multiplicities})).to.throw(EM_NORMALIZED_BASIS_INTERVAL_NOTSUFFICIENT)
            });
        
            it('cannot be initialized with a non increasing knot sequence produced by the initializer ' + STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, () => {
                const maxMultiplicityOrder = 3;
                const knots: number [] = [0, -0.5, 2, 3, 4, 5]
                const multiplicities: number[] = [1, 1, 1, 1, 1, 1]
                expect(() => new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, knots: knots, multiplicities: multiplicities})).to.throw(EM_NON_STRICTLY_INCREASING_VALUES)
                const knots1: number [] = [-2, -2.5, 0, 1, 2, 3, 4]
                const multiplicities1: number[] = [1, 1, 1, 1, 1, 1, 1]
                expect(() => new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, knots: knots1, multiplicities: multiplicities1})).to.throw(EM_NON_STRICTLY_INCREASING_VALUES)
                const knots2: number [] = [0, 1, 2, 3, 4, 3.5]
                const multiplicities2: number[] = [2, 1, 1, 1, 2, 1]
                expect(() => new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, knots: knots2, multiplicities: multiplicities2})).to.throw(EM_NON_STRICTLY_INCREASING_VALUES)
            });

            it('can be initialized with an intermediate knot having a multiplicity equal to maxMultiplicityOrder with ' + STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, () => {
                const maxMultiplicityOrder = 3;
                const knots: number [] = [0, 0.5, 2, 3, 4, 5]
                const multiplicityFirstKnot = 3;
                const multiplicityLastKnot = 2;
                let multiplicities: number[] = [multiplicityFirstKnot, 1, 1, 1, 1, multiplicityLastKnot]
                const upperBound = knots.length;
                for(let i = 1; i < upperBound - 2; i++) {
                    const multiplicities1 = multiplicities.slice();
                    multiplicities1[i] = maxMultiplicityOrder
                    const seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, knots: knots, multiplicities: multiplicities1})
                    expect(seq.allAbscissae).to.eql(knots)
                    expect(seq.multiplicities()).to.eql(multiplicities1)
                }
            });
        });

    });

    describe('Accessors', () => {
        it('can get all the abscissa of the knot sequence: uniform knot sequence', () => {
            const maxMultiplicityOrder = 3
            const knots = [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7]
            const multiplicities = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
            const seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities})
            expect(seq.allAbscissae).to.eql(knots)
        });

        it('can get all the abscissa of the knot sequence: non-uniform knot sequence', () => {
            const maxMultiplicityOrder = 3
            const knots = [0, 1, 2, 3, 4, 5, 6, 7]
            const multiplicities = [3, 1, 1, 1, 1, 1, 1, 3]
            const seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities})
            expect(seq.allAbscissae).to.eql(knots)
        });

        it('can use the iterator to access the knots of the sequence', () => {
            const maxMultiplicityOrder = 4
            const knots = [0, 1, 2]
            const multiplicities = [4, 1, 4]
            const seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities})
            expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
            const seq1: number[] = [];
            for(const knot of seq) {
                if(knot !== undefined) seq1.push(knot.abscissa)
            }
            expect(seq1).to.eql(knots)
            expect(seq1).to.eql(seq.distinctAbscissae())
        });

        it('can get the status of the knot sequence about the description of C0 discontinuity', () => {
            const maxMultiplicityOrder = 3
            const knots = [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7]
            const multiplicities = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
            const seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities})
            expect(seq.isSequenceUpToC0Discontinuity).to.eql(false)
            const seq1 = new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, knots: knots, multiplicities: multiplicities})
            expect(seq1.isSequenceUpToC0Discontinuity).to.eql(true)
        });

        it('can get the maximum multiplicity order of the knot sequence', () => {
            const maxMultiplicityOrder = 3
            const knots = [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7]
            const multiplicities = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
            const seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities})
            expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
        });
    });

    describe('Methods', () => {

        it('can clone the knot sequence with constructor type ' + STRICTLYINCREASINGOPENKNOTSEQUENCE, () => {
            const maxMultiplicityOrder = 4
            const knots = [0, 1, 1.5, 2]
            const multiplicities = [4, 2, 1, 4]
            const seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities})
            expect(seq.isSequenceUpToC0Discontinuity).to.eql(false)
            const seq1 = seq.clone()
            expect(seq1.isSequenceUpToC0Discontinuity).to.eql(false)
            expect(seq1).to.eql(seq)
        });

        it('can clone the knot sequence with constructor type ' + STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, () => {
            const maxMultiplicityOrder = 4
            const knots = [0, 1, 1.5, 2]
            const multiplicities = [4, 2, 1, 4]
            const seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, knots: knots, multiplicities: multiplicities})
            expect(seq.isSequenceUpToC0Discontinuity).to.eql(true)
            const seq1 = seq.clone()
            expect(seq1.isSequenceUpToC0Discontinuity).to.eql(true)
            expect(seq1).to.eql(seq)
        });

        it('can get the length of a knot sequence', () => {
            const knots: number [] = [-1, -0.5, -0.2, 0.0, 0.5, 0.6, 0.7, 1, 1.1, 1.5, 1.7]
            const multiplicities: number[] = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
            let maxMultiplicityOrder = 4;
            const seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities});
            expect(seq.length()).to.eql(11)
            const knots1: number [] = [0.0, 1]
            const multiplicities1: number[] = [3, 3]
            maxMultiplicityOrder = 3;
            const seq1 = new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots1, multiplicities: multiplicities1});
            expect(seq1.length()).to.eql(2)
        });

        it('cannot solely update the abscissa origin of a knot sequence after some knot multiplicity increase', () => {
            const knots: number [] = [-2, -1, 0, 0.5, 0.6, 0.7, 1, 2, 3, 4]
            const multiplicities: number [] = [1, 1, 2, 1, 1, 2, 1, 1, 1, 1]
            const maxMultiplicityOrder = 4
            const seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, knots: knots, multiplicities: multiplicities})
            const checkSequenceConsistency = false
            const seq1 = seq.raiseKnotMultiplicity(new KnotIndexStrictlyIncreasingSequence(2), 1, checkSequenceConsistency)
            expect(() => seq1.updateNormalizedBasisOrigin()).to.throw(EM_ORIGIN_NORMALIZEDKNOT_SEQUENCE)
        });

        it('can get the distinct abscissae of a knot sequence', () => {
            const knots: number [] = [0, 0.5, 0.6, 0.7, 1]
            const multiplicities: number[] = [4, 1, 1, 2, 4]
            const maxMultiplicityOrder = 4
            const seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities})
            const abscissae = seq.distinctAbscissae()
            expect(abscissae).to.eql(knots)
        });

        it('can get the multiplicity of each knot of a knot sequence', () => {
            const knots: number [] = [0, 0.5, 0.6, 0.7, 1]
            const multiplicities: number[] = [4, 1, 1, 2, 4]
            const maxMultiplicityOrder = 4
            const seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities})
            expect(seq.multiplicities()).to.eql(multiplicities)
        });

        it('can check the coincidence of an abscissa with a knot', () => {
            const knots: number [] = [0, 0.5, 0.6, 0.7, 1]
            const multiplicities: number[] = [4, 1, 1, 2, 4]
            const maxMultiplicityOrder = 4
            const seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities})
            const abscissae = seq.distinctAbscissae();
            for(let i = 0; i < abscissae.length; i++) {
                expect(seq.isAbscissaCoincidingWithKnot(abscissae[i] + (COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF * KNOT_COINCIDENCE_TOLERANCE))).to.eql(false)
                expect(seq.isAbscissaCoincidingWithKnot(abscissae[i] - (COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF * KNOT_COINCIDENCE_TOLERANCE))).to.eql(false)
                expect(seq.isAbscissaCoincidingWithKnot(abscissae[i])).to.eql(true)
            }
        });

        it('can check if the knot multiplicity at a given abscissa is zero', () => {
            const knots: number [] = [0, 0.5, 0.6, 0.7, 1]
            const multiplicities: number[] = [4, 1, 1, 2, 4]
            const maxMultiplicityOrder = 4
            const seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities})
            const abscissae = seq.distinctAbscissae()
            for(let i = 0; i < abscissae.length; i++) {
                expect(seq.isKnotlMultiplicityZero(abscissae[i])).to.eql(false)
                expect(seq.isKnotlMultiplicityZero(abscissae[i] + (COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF * KNOT_COINCIDENCE_TOLERANCE))).to.eql(true)
                expect(seq.isKnotlMultiplicityZero(abscissae[i] - (COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF * KNOT_COINCIDENCE_TOLERANCE))).to.eql(true)
            }
        });

        it('can get the knot multiplicity from a sequence index', () => {
            const knots: number [] = [0.0, 0.5, 0.6, 0.7, 1]
            const multiplicities: number[] = [4, 1, 1, 2, 4]
            const maxMultiplicityOrder = 4;
            const seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities})
            for(let i = 0; i < seq.allAbscissae.length; i++) {
                const index = new KnotIndexStrictlyIncreasingSequence(i);
                const multiplicity = seq.knotMultiplicity(index)
                expect(multiplicity).to.eql(multiplicities[i]);
            }
        });
    
        it('cannot insert a new knot in the knot sequence if the new knot abscissa is too close to an existing one', () => {
            const knots: number [] = [0.0, 0.5, 0.6, 0.7, 1]
            const multiplicities: number[] = [4, 1, 1, 2, 4]
            const maxMultiplicityOrder = 4
            const seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities})
            expect(() => seq.insertKnot(0.5)).to.throw(EM_ABSCISSA_TOO_CLOSE_TO_KNOT)
            expect(() => seq.insertKnot(0.5 + (KNOT_COINCIDENCE_TOLERANCE/COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF))).to.throw(EM_ABSCISSA_TOO_CLOSE_TO_KNOT)
            expect(() => seq.insertKnot(0.5 - (KNOT_COINCIDENCE_TOLERANCE/COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF))).to.throw(EM_ABSCISSA_TOO_CLOSE_TO_KNOT)
        });

        it('cannot insert a new knot in the knot sequence if the new knot abscissa is too close to an existing one and does not issue an error message if the multiplicity is greater than maxMultiplicityOrder', () => {
            const knots: number [] = [0.0, 0.5, 0.6, 0.7, 1]
            const multiplicities: number[] = [4, 1, 1, 2, 4]
            const maxMultiplicityOrder = 4
            const seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities})
            expect(() => seq.insertKnot(0.5, maxMultiplicityOrder)).to.throw(EM_ABSCISSA_TOO_CLOSE_TO_KNOT)
            expect(() => seq.insertKnot(0.5 + (KNOT_COINCIDENCE_TOLERANCE/COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF), maxMultiplicityOrder)).to.throw(EM_ABSCISSA_TOO_CLOSE_TO_KNOT)
            expect(() => seq.insertKnot(0.5 - (KNOT_COINCIDENCE_TOLERANCE/COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF), maxMultiplicityOrder)).to.throw(EM_ABSCISSA_TOO_CLOSE_TO_KNOT)
        });

        it('cannot insert a new knot in the knot sequence if the new knot multiplicity is greater than maxMultiplicityOrder', () => {
            const knots: number [] = [0.0, 0.5, 0.6, 0.7, 1]
            const multiplicities: number[] = [4, 1, 1, 2, 4]
            const maxMultiplicityOrder = 4
            const newKnotAbscissa = 0.3;
            const seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities})
            expect(() => seq.insertKnot(newKnotAbscissa, 5)).to.throw(EM_MAXMULTIPLICITY_ORDER_KNOT)
        });

        it('cannot insert a new knot outside the knot sequence definition interval [0, uMax]: case over uMax', () => {
            const knots: number [] = [0.0, 0.5, 0.6, 0.7, 1]
            const multiplicities: number[] = [4, 1, 1, 2, 4]
            const maxMultiplicityOrder = 4
            const seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities})
            expect(() => seq.insertKnot(1.2, 1)).to.throw(EM_KNOT_INSERTION_OVER_UMAX)

            const knots1: number [] = [-3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7]
            const multiplicities1: number[] = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
            const seq1 = new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots1, multiplicities: multiplicities1})
            expect(() => seq1.insertKnot(4.2, 1)).to.throw(EM_KNOT_INSERTION_OVER_UMAX)
        });

        it('cannot insert a new knot outside the knot sequence definition interval [0, uMax]: case lower than sequence origin', () => {
            const knots: number [] = [0.0, 0.5, 0.6, 0.7, 1]
            const multiplicities: number[] = [4, 1, 1, 2, 4]
            const maxMultiplicityOrder = 4
            const seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities})
            expect(() => seq.insertKnot(-0.2, 1)).to.throw(EM_KNOT_INSERTION_UNDER_SEQORIGIN)

            const knots1: number [] = [-3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7]
            const multiplicities1: number[] = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
            const seq1 = new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots1, multiplicities: multiplicities1})
            expect(() => seq1.insertKnot(-3.2, 1)).to.throw(EM_KNOT_INSERTION_UNDER_SEQORIGIN)
        });

        it('can insert a knot into knot sequence', () => {
            const knots: number [] = [0.0, 0.5, 0.6, 0.7, 1]
            const multiplicities: number[] = [4, 1, 1, 2, 4]
            const maxMultiplicityOrder = 4;
            const seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities});
            const seq1 = seq.insertKnot(0.2, 2)
            expect(seq1.distinctAbscissae()).to.eql([0.0, 0.2, 0.5, 0.6, 0.7, 1])
            expect(seq1.multiplicities()).to.eql([4, 2, 1, 1, 2, 4])
        });

        it('check knot sequence properties after knot insertion', () => {
            const knots: number [] = [-3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7]
            const multiplicities: number[] = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
            const maxMultiplicityOrder = 4
            const seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities})
            expect(seq.isKnotSpacingUniform).to.eql(true)
            expect(seq.isKnotMultiplicityUniform).to.eql(true)
            expect(seq.isKnotMultiplicityNonUniform).to.eql(false)
            expect(seq.uMax).to.eql(4)
            expect(seq.indexKnotOrigin.knotIndex).to.eql(maxMultiplicityOrder - 1)
            
            const seq2 = seq.insertKnot(1.2, 1)
            expect(seq2.isKnotSpacingUniform).to.eql(false)
            expect(seq2.isKnotMultiplicityUniform).to.eql(true)
            expect(seq2.isKnotMultiplicityNonUniform).to.eql(false)
            expect(seq2.uMax).to.eql(4)
            expect(seq2.indexKnotOrigin.knotIndex).to.eql(maxMultiplicityOrder - 1)

            const seq1 = seq.insertKnot(1.2, 2)
            expect(seq1.isKnotSpacingUniform).to.eql(false)
            expect(seq1.isKnotMultiplicityUniform).to.eql(false)
            expect(seq1.isKnotMultiplicityNonUniform).to.eql(false)
            expect(seq1.uMax).to.eql(4)
            expect(seq1.indexKnotOrigin.knotIndex).to.eql(maxMultiplicityOrder - 1)
        });

        it('cannot get the knot abscissa from a sequence index when the index is out of range', () => {
            const maxMultiplicityOrder = 4
            const knots: number [] = [0.0, 0.5, 0.6, 0.7, 1]
            const multiplicities: number[] = [4, 1, 1, 2, 4]
            const seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities})
            expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
            expect(() => seq.abscissaAtIndex(new KnotIndexStrictlyIncreasingSequence(-1))).to.throw(EM_KNOT_INDEX_VALUE)
            expect(() => seq.abscissaAtIndex(new KnotIndexStrictlyIncreasingSequence(seq.allAbscissae.length))).to.throw(EM_KNOTINDEX_INC_SEQ_TOO_LARGE)
        });

        it('can get the knot abscissa from a knot index of the strictly increasing sequence. Case of non uniform B-Spline', () => {
            const knots: number [] = [0.0, 0.5, 0.6, 0.7, 1]
            const multiplicities: number[] = [4, 1, 1, 2, 4]
            const maxMultiplicityOrder = 4;
            const seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities})
            for(let i = 0; i < seq.length(); i++) {
                const index = new KnotIndexStrictlyIncreasingSequence(i);
                const abscissa = seq.abscissaAtIndex(index);
                expect(abscissa).to.eql(knots[i]);
            }
        });

        it('can get the knot abscissa from a sequence index. Case of uniform B-Spline', () => {
            const maxMultiplicityOrder = 4
            const knots = [-3, -2, -1, 0, 0.5, 0.6, 0.7, 1, 2, 3, 4]
            const multiplicities: number[] = [1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1]
            const seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities})
            expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
            const abscissae = seq.allAbscissae;
            for(let i = 0; i < seq.length(); i++) {
                let index = new KnotIndexStrictlyIncreasingSequence(i);
                let abscissa = seq.abscissaAtIndex(index)
                expect(abscissa).to.eql(abscissae[i])
            }
        });

        it('can get the knot multiplicity from a sequence index', () => {
            const maxMultiplicityOrder = 4
            const knots: number [] = [0.0, 0.5, 0.6, 0.7, 1]
            const multiplicities: number[] = [4, 1, 1, 2, 4]
            const seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities})
            expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
            const multiplicities1 = seq.multiplicities()
            for(let i = 0; i < multiplicities1.length; i++) {
                const index = new KnotIndexStrictlyIncreasingSequence(i);
                expect(seq.knotMultiplicity(index)).to.eql(multiplicities[i])
                expect(seq.knotMultiplicity(index)).to.eql(multiplicities1[i])
            }
        });
    
        it('cannot convert a strictly increasing knot index into an increasing knot index if the strictly increasing index is out of range', () => {
            const knots: number [] = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8]
            const multiplicities: number[] = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
            const maxMultiplicityOrder = 4
            const seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities})
            expect(seq.isKnotSpacingUniform).to.eql(true)
            expect(seq.isKnotMultiplicityUniform).to.eql(true)
            expect(seq.isKnotMultiplicityNonUniform).to.eql(false)
            expect(() => seq.toKnotIndexIncreasingSequence(new KnotIndexStrictlyIncreasingSequence(-1))).to.throw(EM_KNOT_INDEX_VALUE)
            expect(() => seq.toKnotIndexIncreasingSequence(new KnotIndexStrictlyIncreasingSequence(seq.length()))).to.throw(EM_KNOTINDEX_STRICTLY_INCREASING_SEQ_OUT_RANGE)
        
            const knots1: number [] = [0, 0.1, 0.2, 0.4, 0.5, 1]
            const multiplicities1: number[] = [4, 1, 2, 1, 3, 4]
            const seq1 = new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots1, multiplicities: multiplicities1})
            expect(seq1.isKnotSpacingUniform).to.eql(false)
            expect(seq1.isKnotMultiplicityUniform).to.eql(false)
            expect(seq1.isKnotMultiplicityNonUniform).to.eql(true)
            expect(() => seq1.toKnotIndexIncreasingSequence(new KnotIndexStrictlyIncreasingSequence(-1))).to.throw(EM_KNOT_INDEX_VALUE)
            expect(() => seq1.toKnotIndexIncreasingSequence(new KnotIndexStrictlyIncreasingSequence(seq1.length()))).to.throw(EM_KNOTINDEX_STRICTLY_INCREASING_SEQ_OUT_RANGE)
        });

        it('can convert a strictly increasing knot index into an increasing knot index for a uniform knot sequence', () => {
            const knots: number [] = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8]
            const multiplicities: number[] = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
            const maxMultiplicityOrder = 4
            const seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities})
            expect(seq.isKnotSpacingUniform).to.eql(true)
            expect(seq.isKnotMultiplicityUniform).to.eql(true)
            expect(seq.isKnotMultiplicityNonUniform).to.eql(false)
            for(let i = 0; i < seq.length(); i++) {
                const index = new KnotIndexStrictlyIncreasingSequence(i)
                const indexInc = seq.toKnotIndexIncreasingSequence(index)
                expect(indexInc.knotIndex).to.eql(i)
            }
        });

        it('can convert a strictly increasing knot index into an increasing knot index for a non-uniform knot sequence', () => {
            const knots: number [] = [0, 0.1, 0.2, 0.4, 0.5, 1]
            const multiplicities: number[] = [4, 1, 2, 1, 3, 4]
            const maxMultiplicityOrder = 4
            const seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities})
            expect(seq.isKnotSpacingUniform).to.eql(false)
            expect(seq.isKnotMultiplicityUniform).to.eql(false)
            expect(seq.isKnotMultiplicityNonUniform).to.eql(true)
            let offSet = 0
            for(let i = 0; i < seq.length(); i++) {
                const index = new KnotIndexStrictlyIncreasingSequence(i)
                const indexInc = seq.toKnotIndexIncreasingSequence(index)
                expect(indexInc.knotIndex).to.eql(i + offSet)
                offSet = offSet + seq.knotMultiplicity(index) - 1
            }
        });

        it('cannot raise the multiplicity of an intermediate knot more than (maxMultiplicityOrder - 1) whether knot sequence consistency check is active or not and with constructor type' + STRICTLYINCREASINGOPENKNOTSEQUENCE, () => {
            const knots: number [] = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8]
            const multiplicities: number[] = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
            const maxMultiplicityOrder = 4
            const seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities})
            expect(seq.length()).to.eql(knots.length)
            expect(seq.isSequenceUpToC0Discontinuity).to.eql(false)
            const mult = maxMultiplicityOrder - 1
            let sequenceConsistencyCheck = true
            for(let i = maxMultiplicityOrder; i < (knots.length - maxMultiplicityOrder); i++) {
                const seq1 = seq.clone()
                const index = seq.findSpan(knots[i])
                expect(() => seq1.raiseKnotMultiplicity(index, mult, sequenceConsistencyCheck)).to.throw(EM_MAXMULTIPLICITY_ORDER_INTERMEDIATE_KNOT)
            }
            sequenceConsistencyCheck = false
            for(let i = maxMultiplicityOrder; i < (knots.length - maxMultiplicityOrder); i++) {
                const seq1 = seq.clone()
                const index = seq.findSpan(knots[i])
                expect(() => seq1.raiseKnotMultiplicity(index, mult, sequenceConsistencyCheck)).to.throw(EM_MAXMULTIPLICITY_ORDER_INTERMEDIATE_KNOT)
            }
        });

        it('cannot raise the multiplicity of an intermediate knot to more than maxMultiplicityOrder with knot sequence consistency check and with constructor type' + STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, () => {
            const knots: number [] = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8]
            const multiplicities: number[] = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
            const maxMultiplicityOrder = 4
            const seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, knots: knots, multiplicities: multiplicities})
            expect(seq.length()).to.eql(knots.length)
            expect(seq.isSequenceUpToC0Discontinuity).to.eql(true)
            const multiplicities1 = seq.multiplicities()
            const sequenceConsistencyCheck = true
            for(let i = 0; i < multiplicities1.length; i++) {
                expect(seq.knotMultiplicity(new KnotIndexStrictlyIncreasingSequence(i))).to.eql(multiplicities[i])
            }
            for(let i = maxMultiplicityOrder; i < (knots.length - maxMultiplicityOrder); i++) {
                const seq1 = seq.clone()
                const index = seq1.findSpan(knots[i])
                expect(() => seq1.raiseKnotMultiplicity(index, maxMultiplicityOrder, sequenceConsistencyCheck)).to.throw(EM_MAXMULTIPLICITY_ORDER_ATKNOT)
            }
        });

        it('cannot raise the multiplicity of extreme knots with uniform knot sequence consistency check and with constructor type' + STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, () => {
            const knots: number [] = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8]
            const multiplicities: number[] = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
            const maxMultiplicityOrder = 4
            const seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, knots: knots, multiplicities: multiplicities})
            expect(seq.length()).to.eql(knots.length)
            expect(seq.isSequenceUpToC0Discontinuity).to.eql(true)
            const sequenceConsistencyCheck = true
            for(let i = 0; i < multiplicities.length; i++) {
                expect(seq.knotMultiplicity(new KnotIndexStrictlyIncreasingSequence(i))).to.eql(multiplicities[i])
            }
            for(let i = 0; i < maxMultiplicityOrder; i++) {
                let seq1 = seq.clone()
                let index = new KnotIndexStrictlyIncreasingSequence(i)
                expect(() => seq1.raiseKnotMultiplicity(index, maxMultiplicityOrder, sequenceConsistencyCheck)).to.throw(EM_MULTIPLICITY_ORDER_MODIFYING_NORMALIZED_BASIS)
                seq1 = seq.clone()
                index = new KnotIndexStrictlyIncreasingSequence(seq1.length() - i - 1)
                expect(() => seq1.raiseKnotMultiplicity(index, maxMultiplicityOrder, sequenceConsistencyCheck)).to.throw(EM_MULTIPLICITY_ORDER_MODIFYING_NORMALIZED_BASIS)
            }
        });

        it('cannot raise the multiplicity of extreme knots with non uniform knot sequence consistency check and with constructor type' + STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, () => {
            const knots: number [] = [0, 0.1, 0.2, 0.3, 0.4, 0.5]
            const multiplicities: number[] = [4, 1, 1, 1, 1, 4]
            const maxMultiplicityOrder = 4
            const seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, knots: knots, multiplicities: multiplicities})
            expect(seq.length()).to.eql(knots.length)
            expect(seq.isSequenceUpToC0Discontinuity).to.eql(true)
            const sequenceConsistencyCheck = true
            for(let i = 0; i < multiplicities.length; i++) {
                expect(seq.knotMultiplicity(new KnotIndexStrictlyIncreasingSequence(i))).to.eql(multiplicities[i])
            }
            let seq1 = seq.clone()
            let index = new KnotIndexStrictlyIncreasingSequence(0)
            expect(() => seq1.raiseKnotMultiplicity(index, maxMultiplicityOrder, sequenceConsistencyCheck)).to.throw(EM_MULTIPLICITY_ORDER_MODIFYING_NORMALIZED_BASIS)
            seq1 = seq.clone()
            index = new KnotIndexStrictlyIncreasingSequence(seq1.length() - 1)
            expect(() => seq1.raiseKnotMultiplicity(index, maxMultiplicityOrder, sequenceConsistencyCheck)).to.throw(EM_MULTIPLICITY_ORDER_MODIFYING_NORMALIZED_BASIS)
        });

        it('can raise the multiplicity of any knot of a uniform sequence to more than maxMultiplicityOrder without knot sequence consistency check and with constructor type' + STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, () => {
            const knots: number [] = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8]
            const multiplicities: number[] = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
            const maxMultiplicityOrder = 4
            const seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, knots: knots, multiplicities: multiplicities})
            expect(seq.length()).to.eql(knots.length)
            expect(seq.isSequenceUpToC0Discontinuity).to.eql(true)
            const sequenceConsistencyCheck = false
            for(let i = 0; i < multiplicities.length; i++) {
                expect(seq.knotMultiplicity(new KnotIndexStrictlyIncreasingSequence(i))).to.eql(multiplicities[i])
            }
            for(let i = 0; i < knots.length; i++) {
                const seq1 = seq.clone()
                const index = new KnotIndexStrictlyIncreasingSequence(i)
                const seq2 = seq1.raiseKnotMultiplicity(index, maxMultiplicityOrder, sequenceConsistencyCheck)
                expect(seq2.multiplicities()[i]).to.eql(maxMultiplicityOrder + 1)
            }
        });

        it('check the knot sequence property update after raising the multiplicity of a knot of a uniform multiplicity sequence with constructor type ' + STRICTLYINCREASINGOPENKNOTSEQUENCE, () => {
            const knots: number [] = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8]
            const multiplicities: number[] = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
            const maxMultiplicityOrder = 4
            const seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities})
            expect(seq.isKnotMultiplicityUniform).to.eql(true)
            expect(seq.isKnotMultiplicityNonUniform).to.eql(false)
            const sequenceConsistencyCheck = true
            for(let i = maxMultiplicityOrder; i < (seq.length() - maxMultiplicityOrder - 1); i++) {
                const seq1 = seq.clone()
                const index = new KnotIndexStrictlyIncreasingSequence(i)
                const seq2 = seq1.raiseKnotMultiplicity(index, 1, sequenceConsistencyCheck)
                expect(seq2.isKnotMultiplicityUniform).to.eql(false)
                expect(seq.isKnotMultiplicityNonUniform).to.eql(false)
            }
        });

        it('check the knot sequence property update after raising the multiplicity of a knot of a non uniform multiplicity sequence with constructor type ' + STRICTLYINCREASINGOPENKNOTSEQUENCE, () => {
            const knots: number [] = [0, 0.1, 0.2, 0.4, 0.5, 1]
            const multiplicities: number[] = [4, 1, 2, 1, 2, 4]
            const maxMultiplicityOrder = 4
            const seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities})
            expect(seq.isKnotMultiplicityUniform).to.eql(false)
            expect(seq.isKnotMultiplicityNonUniform).to.eql(true)
            const sequenceConsistencyCheck = true
            for(let i = 1; i < (seq.length() - 1); i++) {
                const seq1 = seq.clone()
                const index = new KnotIndexStrictlyIncreasingSequence(i)
                const seq2 = seq1.raiseKnotMultiplicity(index, 1, sequenceConsistencyCheck)
                expect(seq2.isKnotMultiplicityUniform).to.eql(false)
                expect(seq.isKnotMultiplicityNonUniform).to.eql(true)
            }
        });

        it('can raise the multiplicity of an existing knot with constructor type ' + STRICTLYINCREASINGOPENKNOTSEQUENCE, () => {
            const knots: number [] = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8]
            const multiplicities: number[] = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
            const maxMultiplicityOrder = 4
            const seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities})
            const index = seq.findSpan(0.2)
            const sequenceConsistencyCheck = true
            const seq1 = seq.raiseKnotMultiplicity(index, 1)
            expect(seq1.multiplicities()).to.eql([1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1])
            expect(() => seq1.raiseKnotMultiplicity(index, 2, sequenceConsistencyCheck)).to.throw(EM_MAXMULTIPLICITY_ORDER_INTERMEDIATE_KNOT)
        });

        it('cannot decrement the multiplicity of a knot when the knot index is out of range with constructor type ' + STRICTLYINCREASINGOPENKNOTSEQUENCE, () => {
            const knots: number [] = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8]
            const multiplicities: number[] = [1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1]
            const maxMultiplicityOrder = 4
            const seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities})
            expect(seq.isSequenceUpToC0Discontinuity).to.eql(false)
            // test with knot sequence consistency check
            expect(() => seq.decrementKnotMultiplicity(new KnotIndexStrictlyIncreasingSequence(-1))).to.throw(EM_KNOT_INDEX_VALUE)
            expect(() => seq.decrementKnotMultiplicity(new KnotIndexStrictlyIncreasingSequence(seq.length()))).to.throw(EM_KNOTINDEX_STRICTLY_INCREASING_SEQ_OUT_RANGE)
            // test without knot sequence consistency check
            expect(() => seq.decrementKnotMultiplicity(new KnotIndexStrictlyIncreasingSequence(-1), false)).to.throw(EM_KNOT_INDEX_VALUE)
            expect(() => seq.decrementKnotMultiplicity(new KnotIndexStrictlyIncreasingSequence(seq.length()), false)).to.throw(EM_KNOTINDEX_STRICTLY_INCREASING_SEQ_OUT_RANGE)
        });

        it('cannot decrement the multiplicity of a knot when the knot index is out of range with constructor type ' + STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, () => {
            const knots: number [] = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8]
            const multiplicities: number[] = [1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1]
            const maxMultiplicityOrder = 4
            const seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, knots: knots, multiplicities: multiplicities})
            expect(seq.isSequenceUpToC0Discontinuity).to.eql(true)
            // test with knot sequence consistency check
            expect(() => seq.decrementKnotMultiplicity(new KnotIndexStrictlyIncreasingSequence(-1))).to.throw(EM_KNOT_INDEX_VALUE)
            expect(() => seq.decrementKnotMultiplicity(new KnotIndexStrictlyIncreasingSequence(seq.length()))).to.throw(EM_KNOTINDEX_STRICTLY_INCREASING_SEQ_OUT_RANGE)
            // test without knot sequence consistency check
            expect(() => seq.decrementKnotMultiplicity(new KnotIndexStrictlyIncreasingSequence(-1), false)).to.throw(EM_KNOT_INDEX_VALUE)
            expect(() => seq.decrementKnotMultiplicity(new KnotIndexStrictlyIncreasingSequence(seq.length()), false)).to.throw(EM_KNOTINDEX_STRICTLY_INCREASING_SEQ_OUT_RANGE)
        });

        it('cannot decrement the multiplicity of a knot when the knot index is not an intermadiate knot (Case of non uniform B-Spline.) with constructor type: ' + STRICTLYINCREASINGOPENKNOTSEQUENCE + ' and active sequence consistency check', () => {
            const knots: number [] = [0, 0.1, 0.2, 0.4, 0.5, 1]
            const multiplicities: number[] = [4, 1, 2, 1, 2, 4]
            const maxMultiplicityOrder = 4
            const seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities})
            expect(seq.isSequenceUpToC0Discontinuity).to.eql(false)
            const basisAtEnd = seq.getKnotIndexNormalizedBasisAtSequenceEnd();
            // test with knot sequence consistency check
            expect(() => seq.decrementKnotMultiplicity(new KnotIndexStrictlyIncreasingSequence(0))).to.throw(EM_MULTIPLICITY_ORDER_MODIFYING_NORMALIZED_BASIS)
            expect(() => seq.decrementKnotMultiplicity(basisAtEnd.knot)).to.throw(EM_MULTIPLICITY_ORDER_MODIFYING_NORMALIZED_BASIS)
        });

        it('can decrement the multiplicity of an existing knot when the knot multiplicity is one whatever the knot index when the knot sequence consistency is unchecked', () => {
            const knots: number [] = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8]
            const multiplicities: number[] = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
            const maxMultiplicityOrder = 4
            const seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities})
            const sequenceConsistencyCheck = false
            for(let i = 0; i < seq.distinctAbscissae().length; i++) {
                const seq1 = seq.clone()
                const seq2 = seq1.decrementKnotMultiplicity(new KnotIndexStrictlyIncreasingSequence(i), sequenceConsistencyCheck)
                expect(seq2.length()).to.eql(seq.length() - 1)
            }
        });

        it('can decrement the multiplicity of an existing knot when its multiplicity is greater than one and the knot is strictly inside the normalized basis interval', () => {
            const knots: number [] = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8]
            const multiplicities: number[] = [1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1]
            const maxMultiplicityOrder = 4
            const sequenceConsistencyCheck = true
            const seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities})
            for(let i = maxMultiplicityOrder; i < seq.distinctAbscissae().length - maxMultiplicityOrder; i++) {
                const seq1 = seq.clone()
                const seq2 = seq1.decrementKnotMultiplicity(new KnotIndexStrictlyIncreasingSequence(i), sequenceConsistencyCheck)
                if(seq.multiplicities()[i] === 1) {
                    expect(seq2.length()).to.eql(seq.length() - 1)
                } else {
                    expect(seq2.multiplicities()[i]).to.eql(seq.multiplicities()[i] - 1)
                }
            }
            const seq3 = new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, knots: knots, multiplicities: multiplicities})
            for(let i = maxMultiplicityOrder; i < seq3.distinctAbscissae().length - maxMultiplicityOrder; i++) {
                const seq4 = seq3.clone()
                const seq5 = seq4.decrementKnotMultiplicity(new KnotIndexStrictlyIncreasingSequence(i), sequenceConsistencyCheck)
                if(seq4.multiplicities()[i] === 1) {
                    expect(seq5.length()).to.eql(seq4.length() - 1)
                } else {
                    expect(seq5.multiplicities()[i]).to.eql(seq3.multiplicities()[i] - 1)
                }
            }
        });

        it('can decrement the multiplicity of an existing knot and remove it when its multiplicity equals one', () => {
            const knots: number [] = [0, 0.1, 0.2, 0.4, 0.5, 1]
            const multiplicities: number[] = [4, 1, 2, 1, 1, 4]
            const maxMultiplicityOrder = 4
            const sequenceConsistencyCheck = true
            const seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities})
            for(let i = 1; i < seq.distinctAbscissae().length - 1; i++) {
                const seq1 = seq.decrementKnotMultiplicity(new KnotIndexStrictlyIncreasingSequence(i), sequenceConsistencyCheck)
                if(seq.multiplicities()[i] === 1) {
                    expect(seq1.length()).to.eql(seq.length() - 1)
                } else {
                    expect(seq1.multiplicities()[i]).to.eql(seq.multiplicities()[i] - 1)
                }
            }
            const seq2 = new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, knots: knots, multiplicities: multiplicities})
            for(let i = 1; i < seq2.distinctAbscissae().length - 1; i++) {
                const seq3 = seq2.decrementKnotMultiplicity(new KnotIndexStrictlyIncreasingSequence(i), sequenceConsistencyCheck)
                if(seq2.multiplicities()[i] === 1) {
                    expect(seq3.length()).to.eql(seq2.length() - 1)
                } else {
                    expect(seq3.multiplicities()[i]).to.eql(seq2.multiplicities()[i] - 1)
                }
            }
        });

        it('can decrement the multiplicity of an existing knot and get updated knot spacing property of the sequence', () => {
            const knots: number [] = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8]
            const multiplicities: number[] = [1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1]
            const maxMultiplicityOrder = 4
            const seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities})
            const abscissa = 0.3
            const index = seq.findSpan(abscissa)
            const sequenceConsistencyCheck = true
            expect(seq.multiplicities()).to.eql([1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1])
            expect(seq.isKnotSpacingUniform).to.eql(true)
            const seq1 = seq.decrementKnotMultiplicity(index, sequenceConsistencyCheck)
            expect(seq1.isKnotSpacingUniform).to.eql(false)
        });

        it('can decrement the multiplicity of an existing knot and get updated knot multiplicity uniformity property of the sequence', () => {
            const knots: number [] = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8]
            const multiplicities: number[] = [1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1]
            const maxMultiplicityOrder = 4
            const seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities})
            const sequenceConsistencyCheck = true
            const abscissa = 0.2
            const index = seq.findSpan(abscissa)
            expect(seq.multiplicities()).to.eql([1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1])
            expect(seq.isKnotMultiplicityUniform).to.eql(false)
            expect(seq.isKnotMultiplicityNonUniform).to.eql(false)
            expect(seq.isKnotSpacingUniform).to.eql(true)
            const seq1 = seq.decrementKnotMultiplicity(index, sequenceConsistencyCheck)
            expect(seq1.isKnotSpacingUniform).to.eql(true)
            expect(seq1.isKnotMultiplicityUniform).to.eql(true)
            expect(seq1.isKnotMultiplicityNonUniform).to.eql(false)
        });

        it('can decrement the multiplicity of an existing knot and get updated non uniform knot multiplicity property of the sequence when the knot sequence  consistency is not checked', () => {
            const knots: number [] = [0, 0.1, 0.2, 0.3, 0.4, 0.8]
            const multiplicities: number[] = [4, 1, 2, 1, 1, 4]
            const maxMultiplicityOrder = 4
            const seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities})
            const sequenceConsistencyCheck = false
            const indexStrictInc = new KnotIndexStrictlyIncreasingSequence(seq.length() - 1)
            expect(seq.multiplicities()).to.eql([4, 1, 2, 1, 1, 4])
            expect(seq.isKnotSpacingUniform).to.eql(false)
            expect(seq.isKnotMultiplicityUniform).to.eql(false)
            expect(seq.isKnotMultiplicityNonUniform).to.eql(true)
            const seq1 = seq.decrementKnotMultiplicity(indexStrictInc, sequenceConsistencyCheck)
            expect(seq1.isKnotSpacingUniform).to.eql(false)
            expect(seq1.isKnotMultiplicityUniform).to.eql(false)
            expect(seq1.isKnotMultiplicityNonUniform).to.eql(false)
            expect(seq1.multiplicities()).to.eql([4, 1, 2, 1, 1, 3])
        });

        it('can get a consistent knot sequence origin when a knot multiplicity is decremented and the knot at origin is removed. Knot sequence consistency is not checked during knot multiplicity decrement but the sequence origin is updated as well as some abscissae', () => {
            const knots: number [] = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8]
            const multiplicities: number[] = [1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1]
            const maxMultiplicityOrder = 4
            const seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities})
            const sequenceConsistencyCheck = false
            const indexOrigin = seq.indexKnotOrigin
            const abscissa = seq.abscissaAtIndex(indexOrigin)
            expect(abscissa).to.eql(KNOT_SEQUENCE_ORIGIN)
            const seq1 = seq.decrementKnotMultiplicity(indexOrigin, sequenceConsistencyCheck)
            const seq2 = seq1.updateKnotSequenceThroughNormalizedBasisAnalysis()
            expect(seq2.indexKnotOrigin).to.eql(indexOrigin)
            expect(seq2.abscissaAtIndex(indexOrigin)).to.eql(KNOT_SEQUENCE_ORIGIN)
            const updatedKnots: number [] = [-0.4, -0.3, -0.2, 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7]
            for(let i = 0; i < seq2.allAbscissae.length; i++) {
                expect(seq2.allAbscissae[i]).to.be.closeTo(updatedKnots[i], KNOT_COINCIDENCE_TOLERANCE)
            }
            expect(seq2.uMax).to.eql(0.4)
        });

        it('can get a consistent knot sequence origin when a knot multiplicity is decremented and the knot at uMax is removed. Knot sequence consistency is not checked during knot multiplicity decrement but the sequence uMax is updated as well as some abscissae', () => {
            const knots: number [] = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8]
            const multiplicities: number[] = [1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1]
            const maxMultiplicityOrder = 4
            const seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities})
            const sequenceConsistencyCheck = false
            const indexUMax = seq.getKnotIndicesBoundingNormalizedBasis().end.knot;
            const abscissa = seq.abscissaAtIndex(indexUMax)
            expect(abscissa).to.eql(seq.uMax)
            const seq1 = seq.decrementKnotMultiplicity(indexUMax, sequenceConsistencyCheck)
            const seq2 = seq1.updateKnotSequenceThroughNormalizedBasisAnalysis()
            expect(seq2.uMax).to.eql(0.4)
            const updatedKnots: number [] = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3, 0.4, 0.6, 0.7, 0.8]
            for(let i = 0; i < seq2.allAbscissae.length; i++) {
                expect(seq2.allAbscissae[i]).to.be.closeTo(updatedKnots[i], KNOT_COINCIDENCE_TOLERANCE)
            }
            expect(seq2.uMax).to.eql(0.4)
        });

        it('cannot get a consistent knot sequence origin when a knot multiplicity is decremented and the knot at origin is removed. Knot sequence consistency is not checked during knot multiplicity decrement and the sequence origin cannot be updated', () => {
            const knots: number [] = [-0.3, -0.2, -0.1, 0, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8]
            const multiplicities: number[] = [1, 1, 1, 1, 3, 1, 1, 1, 1, 1, 1]
            const maxMultiplicityOrder = 4
            const seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities})
            const sequenceConsistencyCheck = false
            const indexOrigin = seq.indexKnotOrigin
            const abscissa = seq.abscissaAtIndex(indexOrigin)
            expect(abscissa).to.eql(KNOT_SEQUENCE_ORIGIN)
            const seq1 = seq.decrementKnotMultiplicity(indexOrigin, sequenceConsistencyCheck)
            expect(() => seq1.updateKnotSequenceThroughNormalizedBasisAnalysis()).to.throw(EM_CUMULATIVE_KNOTMULTIPLICITY_ATSTART)
        });

        it('cannot get consistent knot sequence normalized basis when a knot multiplicity is decremented and the knot at origin is removed when the knot sequence consistency is not checked during knot multiplicity decrement', () => {
            const knots: number [] = [0, 0.1, 0.2, 0.3, 0.4, 0.5]
            const multiplicities: number[] = [4, 1, 2, 1, 1, 4]
            const maxMultiplicityOrder = 4
            const seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities})
            const sequenceConsistencyCheck = false
            const indexOrigin = seq.indexKnotOrigin
            let indexNormalizedBasisAtStart = seq.getKnotIndexNormalizedBasisAtSequenceStart()
            expect(indexNormalizedBasisAtStart.basisAtSeqExt).to.eql(NormalizedBasisAtSequenceExtremity.StrictlyNormalized)
            expect(indexNormalizedBasisAtStart.knot.knotIndex).to.eql(indexOrigin.knotIndex)
            const seq1 = seq.decrementKnotMultiplicity(indexOrigin, sequenceConsistencyCheck)
            indexNormalizedBasisAtStart = seq1.getKnotIndexNormalizedBasisAtSequenceStart()
            expect(indexNormalizedBasisAtStart.basisAtSeqExt).to.eql(NormalizedBasisAtSequenceExtremity.StrictlyNormalized)
            expect(indexNormalizedBasisAtStart.knot.knotIndex).to.not.eql(indexOrigin.knotIndex)
            expect(seq1.abscissaAtIndex(indexNormalizedBasisAtStart.knot)).to.not.eql(KNOT_SEQUENCE_ORIGIN)

            const knots1: number [] = [0, 0.1, 0.2, 0.3, 0.4, 0.5]
            const multiplicities1: number[] = [4, 2, 1, 1, 1, 4]
            const seq2 = new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots1, multiplicities: multiplicities1})
            const indexOrigin1 = seq1.indexKnotOrigin
            let indexNormalizedBasisAtStart1 = seq2.getKnotIndexNormalizedBasisAtSequenceStart()
            expect(indexNormalizedBasisAtStart1.basisAtSeqExt).to.eql(NormalizedBasisAtSequenceExtremity.StrictlyNormalized)
            expect(indexNormalizedBasisAtStart1.knot.knotIndex).to.eql(indexOrigin1.knotIndex)
            const seq3 = seq2.decrementKnotMultiplicity(indexOrigin1, sequenceConsistencyCheck)
            indexNormalizedBasisAtStart1 = seq3.getKnotIndexNormalizedBasisAtSequenceStart()
            expect(indexNormalizedBasisAtStart1.basisAtSeqExt).to.eql(NormalizedBasisAtSequenceExtremity.OverDefined)
            expect(indexNormalizedBasisAtStart1.knot.knotIndex).to.not.eql(indexOrigin1.knotIndex)
            expect(seq3.abscissaAtIndex(indexNormalizedBasisAtStart1.knot)).to.not.eql(KNOT_SEQUENCE_ORIGIN)
        });

        it('can update the origin and uMax of a knot sequence whose knot multiplicities have been increased/decreased without knot conformity checking', () => {
            const knots: number [] = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8]
            const multiplicities: number[] = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
            const maxMultiplicityOrder = 4
            const seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, knots: knots, multiplicities: multiplicities})
            const sequenceConsistencyCheck = false
            const indexOrigin = seq.indexKnotOrigin
            const abscissa = seq.abscissaAtIndex(indexOrigin)
            expect(abscissa).to.eql(KNOT_SEQUENCE_ORIGIN)
            expect(seq.uMax).to.eql(0.5)
            const seq1 = seq.decrementKnotMultiplicity(new KnotIndexStrictlyIncreasingSequence(0), sequenceConsistencyCheck)
            seq1.updateKnotSequenceThroughNormalizedBasisAnalysis()
            expect(seq1.abscissaAtIndex(seq.indexKnotOrigin)).to.eql(KNOT_SEQUENCE_ORIGIN)
            expect(seq1.uMax).to.eql(0.4)
        });

        it('can revert the knot sequence for a uniform B-spline', () => {
            const knots: number [] = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8]
            const multiplicities: number[] = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
            const maxMultiplicityOrder = 4
            const seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities})
            // const seqRef = new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities})
            const seqReversed = seq.revertKnotSequence();
            const seqReReversed = seqReversed.revertKnotSequence();
            for(let i = 0; i < seq.length(); i++) {
                const index = new KnotIndexStrictlyIncreasingSequence(i);
                expect(seqReReversed.abscissaAtIndex(index)).to.be.closeTo(seq.abscissaAtIndex(index), KNOT_COINCIDENCE_TOLERANCE)
            }
            expect(seq.multiplicities()).to.eql(seqReReversed.multiplicities())
            
            const knots1: number [] = [-0.3, -0.2, -0.1, 0, 0.05, 0.2, 0.35, 0.4, 0.5, 0.6, 0.7, 0.8]
            const multiplicities1: number[] = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
            const seq1 = new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots1, multiplicities: multiplicities1})
            // const seqRef1 = new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots1, multiplicities: multiplicities1})
            const seqReversed1 = seq1.revertKnotSequence();
            const seqReReversed1 = seqReversed1.revertKnotSequence();
            let i = 0;
            for(let i = 0; i < seq1.length(); i++) {
                const index = new KnotIndexStrictlyIncreasingSequence(i);
                expect(seqReReversed1.abscissaAtIndex(index)).to.be.closeTo(seq1.abscissaAtIndex(index), KNOT_COINCIDENCE_TOLERANCE);
            }
            expect(seq1.multiplicities()).to.eql(seqReReversed1.multiplicities())
        });

        it('can revert the knot sequence for a non uniform B-spline', () => {
            const knots: number [] = [0, 0.3, 0.4, 0.5, 0.8]
            const multiplicities: number[] = [3, 1, 1, 2, 3]
            const maxMultiplicityOrder = 3
            const seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities})
            // const seqRef = new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities})
            const seqReversed = seq.revertKnotSequence();
            const seqReReversed = seqReversed.revertKnotSequence();
            for(let i = 0; i < seq.length(); i++) {
                const index = new KnotIndexStrictlyIncreasingSequence(i);
                expect(seqReReversed.abscissaAtIndex(index)).to.be.closeTo(seq.abscissaAtIndex(index), KNOT_COINCIDENCE_TOLERANCE)
            }
            expect(seq.multiplicities()).to.eql(seqReReversed.multiplicities())
            const knots1: number [] = [0, 0.2, 0.5, 0.8]
            const multiplicities1: number[] = [3, 2, 1, 3]
            const seq1 = new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots1, multiplicities: multiplicities1})
            // const seqRef1 = new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots1, multiplicities: multiplicities1})
            const seqReversed1 = seq1.revertKnotSequence();
            const seqReReversed1 = seqReversed1.revertKnotSequence();
            for(let i = 0; i < seq1.length(); i++) {
                const index = new KnotIndexStrictlyIncreasingSequence(i);
                expect(seqReReversed1.abscissaAtIndex(index)).to.be.closeTo(seq1.abscissaAtIndex(index), KNOT_COINCIDENCE_TOLERANCE)
            }
            expect(seq1.multiplicities()).to.eql(seqReReversed1.multiplicities())
        });

        it('can get the order of multiplicity of a knot from its abscissa', () => {
            const knots: number [] = [0, 0.5, 0.6, 0.7, 1]
            const multiplicities: number[] = [4, 1, 1, 2, 4]
            const maxMultiplicityOrder = 4
            const seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities})
            const distinctKnots = seq.distinctAbscissae();
            const knotMultiplities = seq.multiplicities();
            for(let i = 0; i < distinctKnots.length; i++) {
                expect(seq.knotMultiplicityAtAbscissa(distinctKnots[i])).to.eql(knotMultiplities[i])
            }
        });

        it('get an order of multiplicity 0 and a warning message when the abscissa does not coincide with a knot', () => {
            const knots: number [] = [0, 0.5, 0.6, 0.7, 1]
            const multiplicities: number[] = [4, 1, 1, 2, 4]
            const maxMultiplicityOrder = 4
            const seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities})
            expect(seq.knotMultiplicityAtAbscissa(0.1)).to.eql(0)
            // test the warning message issued by the method
            const originalConsoleLog = console.log;
            let capturedMessage = '';
            console.log = (message: string) => {
                capturedMessage = message;
            };
            seq.knotMultiplicityAtAbscissa(0.1)
            expect(capturedMessage.includes(WM_ABSCISSA_NOT_FOUND_IN_SEQUENCE)).to.eql(true);
            console.log = originalConsoleLog;
        });
    
        it('cannot find the span index in the knot sequence when the abscissa is outside the normalized basis interval for a non uniform B-spline', () => {
            const knots: number [] = [0.0, 0.5, 0.6, 0.7, 1]
            const multiplicities: number[] = [4, 1, 1, 2, 4]
            const maxMultiplicityOrder = 4;
            const seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities})
            expect(seq.isKnotMultiplicityUniform).to.eql(false)
            expect(seq.isKnotMultiplicityNonUniform).to.eql(true)
            expect(() => seq.findSpan(KNOT_SEQUENCE_ORIGIN - 1)).to.throw(EM_U_OUTOF_KNOTSEQ_RANGE)
            expect(() => seq.findSpan(seq.uMax + 1)).to.throw(EM_U_OUTOF_KNOTSEQ_RANGE)
        });

        it('can find the span index in the knot sequence from an abscissa for a non uniform B-spline', () => {
            const knots: number [] = [0.0, 0.5, 0.6, 0.7, 1]
            const multiplicities: number[] = [4, 1, 1, 2, 4]
            const maxMultiplicityOrder = 4;
            const seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities})
            expect(seq.isKnotMultiplicityUniform).to.eql(false)
            expect(seq.isKnotMultiplicityNonUniform).to.eql(true)
            let indexOffset = -1;
            for(let i = 0; i < seq.distinctAbscissae().length; i++) {
                const abscissa = seq.distinctAbscissae()[i]
                let index = seq.findSpan(abscissa)
                if(i !== (seq.distinctAbscissae().length - 1)) indexOffset = i
                expect(index.knotIndex).to.eql(indexOffset)
                if(i < seq.distinctAbscissae().length - 1) {
                    const abscissa1 = (abscissa + seq.distinctAbscissae()[i + 1]) / 2
                    index = seq.findSpan(abscissa1)
                    expect(index.knotIndex).to.eql(indexOffset)
                }
            }
        });
    });
});