import type { AnyMap, HybridObject } from 'react-native-nitro-modules'

export interface Tool extends HybridObject<{ ios: 'swift' }> {
  readonly name: string
  readonly description: string
  readonly arguments: AnyMap
}
