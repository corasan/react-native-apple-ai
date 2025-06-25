import { NitroModules, type HybridObject } from 'react-native-nitro-modules'

interface NativeLanguageModelSession {
  streamResponse: () => void
}

export interface NitroLanguageModelSession extends HybridObject<{ ios: 'swift' }> {
  session: NativeLanguageModelSession
}

const HybridLanguageModelSession = NitroModules.createHybridObject<NitroLanguageModelSession>('NitroLanguageModelSession')

export class LanguageModelSession {
  session: NativeLanguageModelSession

  constructor() {
    this.session = HybridLanguageModelSession.session
  }

  streamResponse() {
    this.session.streamResponse()
  }
}

const session = new LanguageModelSession()
