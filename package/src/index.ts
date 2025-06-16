import {FoundationModels as FoundationModelsSpec} from './specs/FoundationModels.nitro';
import { NitroModules } from 'react-native-nitro-modules';

export const FoundationModels =
	NitroModules.createHybridObject<FoundationModelsSpec>("FoundationModels");

export * from './types';
export * from './generator';
export * from './config';
export * from './cli';
export { default as withGenerablePlugin } from './plugin';
