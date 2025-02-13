import { IncreasingKnotSequenceInterface } from "./IncreasingKnotSequenceInterface";
import { KnotIndexIncreasingSequence } from "./KnotIndexIncreasingSequence";
import { KnotIndexStrictlyIncreasingSequence } from "./KnotIndexStrictlyIncreasingSequence";

// export interface IncreasingOpenKnotSequenceInterface extends KnotSequenceInterface {
export interface IncreasingOpenKnotSequenceInterface extends IncreasingKnotSequenceInterface {

    indexKnotOrigin: KnotIndexStrictlyIncreasingSequence;
    uMax: number;
    allAbscissae: number[];
    isKnotMultiplicityNonUniform: boolean;

    // checkDegreeConsistency(): void;
    clone(): IncreasingOpenKnotSequenceInterface;
    abscissaAtIndex(index: KnotIndexIncreasingSequence): number;
    knotMultiplicityAtAbscissa(abcissa: number): number;
    toKnotIndexIncreasingSequence(index: KnotIndexStrictlyIncreasingSequence): KnotIndexIncreasingSequence;
    toKnotIndexStrictlyIncreasingSequence(index: KnotIndexIncreasingSequence): KnotIndexStrictlyIncreasingSequence;
    findSpan(u: number): KnotIndexIncreasingSequence;
    insertKnot(abscissa: number, multiplicity: number): IncreasingOpenKnotSequenceInterface;
    raiseKnotMultiplicity(index: KnotIndexStrictlyIncreasingSequence, multiplicity: number): IncreasingOpenKnotSequenceInterface;
    decrementKnotMultiplicity(index: KnotIndexStrictlyIncreasingSequence, checkSequenceConsistency: boolean): IncreasingOpenKnotSequenceInterface;
    updateKnotSequenceThroughNormalizedBasisAnalysis(): void;
    extractSubsetOfAbscissae(knotStart: KnotIndexIncreasingSequence, knotEnd: KnotIndexIncreasingSequence): number[];
    
    // raiseKnotMultiplicityKnotArrayMutSeq(arrayIndices: Array<KnotIndexStrictlyIncreasingSequence>, multiplicity: number, checkSequenceConsistency: boolean);
    // toStrictlyIncreasingKnotSequence(): StrictlyIncreasingOpenKnotSequenceInterface;
}