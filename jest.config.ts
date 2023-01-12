import type { Config } from '@jest/types'

const config: Config.InitialOptions = {
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
    },
    verbose: true,
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
    },
}

export default config
