import NitroModules
import FoundationModels

class HybridFoundationModels: HybridFoundationModelsSpec {
    private var session: LanguageModelSession? = nil
    private var tools: [any Tool] = []
    
    var isResponding: Bool {
        guard let session = session else { return false }
        return session.isResponding
    }
    
    func initialize(instructions: String) {
        // Check if Foundation Models are available before creating session
        do {
            session = try LanguageModelSession(tools: tools, instructions: instructions)
            print("Foundation Models session initialized successfully")
        } catch {
            print("Failed to initialize Foundation Models session: \(error)")
            print("This might be because:")
            print("1. Apple Intelligence is not enabled")
            print("2. Device doesn't support Foundation Models")
            print("3. Models haven't been downloaded yet")
            
            // Create session without tools as fallback
            session = try? LanguageModelSession(instructions: instructions)
        }
    }
    
    func addTool(_ tool: any Tool) {
        tools.append(tool)
        print("Added tool: \(tool.name)")
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
