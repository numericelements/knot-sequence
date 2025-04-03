import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';

export default {
  input: 'src/index.ts',
  output: {
    dir: 'dist',
    format: 'es',
    preserveModules: true
  },
  onwarn(warning, warn) {
    // Ignore circular dependency warnings
    if (warning.code === 'CIRCULAR_DEPENDENCY') return;
    warn(warning);
  },
  plugins: [
    typescript(),
    resolve({
        extensions: ['.ts', '.js']
    })
  ]
};


