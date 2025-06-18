import NitroModules
import FoundationModels

class HybridFoundationModels: HybridFoundationModelsSpec {
    private var session: LanguageModelSession? = nil
    
    var isResponding: Bool {
        guard let session = session else { return false }
        return session.isResponding
    }
    
    func initialize(instructions: String) {
        session = LanguageModelSession(tools: [HaikuTool()], instructions: instructions)
    }

    func respond(prompt: String, generating: String?) throws -> Promise<String> {
        return Promise.async {
            guard let session = self.session else {
                return "Error: Session not initialized"
            }
            guard let generating = generating else {
                let response = try await session.respond(to: prompt)
                return response.content
            }
            
            guard let structType = GenerableTypes(fromString: generating) else {
                print("Error: Unknown struct \(generating)")
                return "My name is Unknown"
            }
            let response = try await structType.generate(session: session) {
                prompt
            }
            return "My name is \(response.content.name)"
        }
    }
    
    func streamResponse(prompt: String, onStream: @escaping (String) -> Void, generating: String?) throws -> Promise<String> {
        return Promise.async {
            guard let session = self.session else {
                return "Error: Session not initialized"
            }
            do {
                let stream = session.streamResponse(to: prompt)
                for try await token in stream {
                    onStream(token)
                }
                let result = try await stream.collect()
                return result.content
            } catch {
                print("Error streaming response: \(error)")
                return ""
            }
        }
    }
}
