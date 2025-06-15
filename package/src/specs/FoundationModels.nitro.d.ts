import { HybridObject } from 'react-native-nitro-modules';
export interface FoundationModels extends HybridObject<{
    ios: 'swift';
    android: 'kotlin';
}> {
    hello(name: string): string;
    add(a: number, b: number): number;
}
