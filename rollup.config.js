import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';

export default {
  input: 'src/index.ts',
  output: {
    dir: 'dist',
    format: 'es',
    preserveModules: true
  },
  plugins: [
    typescript(),
    resolve({
        extensions: ['.ts', '.js']
    })
  ]
};


