export default {
  transform: {
    '^.+\\.(t|j)sx?$': [
      '@swc/jest',
      {
        jsc: {
          paths: {
            'src': [ 'src' ],
            'src/*': [ 'src/*' ],
            'test': [ 'test' ],
            'test/*': [ 'test/*' ],
          },
        },
      },
    ],
  },
}
