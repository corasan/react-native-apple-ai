import FoundationModels
import NitroModules

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


struct WeatherTool: Tool {
    var name = "Weather"
    var description = "A tool to get the weather details based on the city"

    @Generable
    struct Arguments {
        @Guide(description: "The city to fetch the weather from")
        var city: String
    }

    func call(arguments: Arguments) async throws -> ToolOutput {
        let toolBridge = ToolBridge.shared
        let argumentsDict: AnyMapHolder = AnyMapHolder()
        argumentsDict.setString(key: "city", value: arguments.city)
        let result = try await toolBridge.callJSFunction(functionName: "getWeatherByCity", args: argumentsDict)

        let humidity = result.getDouble(key: "humidity")
        let temperature = result.getDouble(key: "temperature")
        let precipitation = result.getDouble(key: "precipitation")

        return ToolOutput(GeneratedContent(properties: ["humidity": humidity, "temperature": temperature, "precipitation": precipitation]))
    }
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