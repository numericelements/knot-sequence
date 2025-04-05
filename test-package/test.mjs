import { StrictlyIncreasingOpenKnotSequenceOpenCurve } from '@numericelements/knot-sequence';
import { NO_KNOT_OPEN_CURVE } from '@numericelements/knot-sequence';

console.log('Class imported:', typeof StrictlyIncreasingOpenKnotSequenceOpenCurve);
try {
    const instance = new StrictlyIncreasingOpenKnotSequenceOpenCurve(3, { type: NO_KNOT_OPEN_CURVE });
    console.log('Instance created successfully');
  } catch (error) {
    console.error('Error creating instance:', error.message);
  }