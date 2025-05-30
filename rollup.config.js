import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';

export default [
  // ESM build
  {
    input: 'src/index.ts',
    output: {
      dir: 'dist',
      format: 'esm',
      preserveModules: true,
      preserveModulesRoot: 'src'
    },
    plugins: [
      nodeResolve(),
      typescript({
        tsconfig: './tsconfig.json',
        declaration: true,
        declarationDir: 'dist',
        rootDir: 'src',
        outDir: 'dist',  // Explicitly set outDir to match Rollup's dir
        removeComments: false  // To explicitly preserve comments
      })
    ],
    external: ['tslib'],
    onwarn(warning, warn) {
      // Ignore circular dependency warnings
      // if (warning.code === 'CIRCULAR_DEPENDENCY') return;
      warn(warning);
    }
  },
  // CommonJS build
  {
    input: 'src/index.ts',
    output: {
      dir: 'dist/cjs',
      format: 'cjs',
      preserveModules: true,
      preserveModulesRoot: 'src',
      entryFileNames: '[name].cjs',
      chunkFileNames: '[name].cjs'
    },
    plugins: [
      nodeResolve(),
      typescript({
        tsconfig: './tsconfig.json',
        declaration: false,
        declarationMap: false,    // Explicitly disable declarationMap
        rootDir: 'src',
        outDir: 'dist/cjs',  // This is the key change - match with Rollup's dir
        removeComments: false  // To explicitly preserve comments
      })
    ],
    external: ['tslib'],
    onwarn(warning, warn) {
      // Ignore circular dependency warnings
      // if (warning.code === 'CIRCULAR_DEPENDENCY') return;
      warn(warning);
    }
  }
]




