import {FoundationModels as FoundationModelsSpec} from './specs/FoundationModels.nitro';
import { NitroModules } from 'react-native-nitro-modules';

export const FoundationModels =
	NitroModules.createHybridObject<FoundationModelsSpec>("FoundationModels");
