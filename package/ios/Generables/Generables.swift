import FoundationModels

@Generable
struct User {
  @Guide(description: "Unique user identifier")
  var id: String

  @Guide(description: "User email address")
  var email: String

  @Guide(description: "User display name")
  var name: String

  @Guide(description: "User age in years")
  var age: Double

  @Guide(description: "Whether the user account is active")
  var isActive: Bool
}


enum GenerableTypes: String, CaseIterable  {
  case user = "User"

  init?(fromString string: String) {
    self.init(rawValue: string)
  }

  func generate(
    session: LanguageModelSession,
    options: GenerationOptions = GenerationOptions(),
    includeSchemaInPrompt: Bool = true,
    isolation: isolated (any Actor)? = #isolation,
    @PromptBuilder prompt: () throws -> Prompt
  ) async throws -> LanguageModelSession.Response<User> {
    switch self {
    case .user:
      return try await session.respond(
        generating: User.self,
        options: options,
        includeSchemaInPrompt: includeSchemaInPrompt,
        isolation: isolation,
        prompt: prompt
      )
    }
  }
}

struct HaikuTool: Tool {
    var name = "haikuTool"
    var description = "A tool to generate haikus based on the provided search term."

    @Generable
    struct Arguments {
        var searchTerm: String
    }

    func call(arguments: Arguments) async throws -> ToolOutput {
        let toolBridge = ToolBridge.shared
        _ = try toolBridge.callJSFunction(
            functionName: "fetchFromServer",
            args: [
                "searchTerm": "Birds"
            ]
        )
        return ToolOutput(GeneratedContent(properties: ["result": ""]))
    }
}

enum ToolTypes {
    case exampleTool(HaikuTool)

//    func callFunction() throws {
//        let toolBridge = ToolBridge.shared
//        switch self {
//            case .exampleTool:
//            let result = try toolBridge.callJSFunction(
//                functionName: "fetchFromServer",
//                args: [
//                    "searchTerm": "word"
//                ]
//            )
//            break
//        }
//    }
}
