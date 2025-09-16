import { Platform } from 'react-native'

/**
 * Checks if the current platform supports Foundation Models
 * @returns true if supported, false otherwise
 */
export function isPlatformSupported(): boolean {
  return Platform.OS === 'ios'
}
