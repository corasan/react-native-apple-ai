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