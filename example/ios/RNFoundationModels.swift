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

  @Guide(description: "User tags or categories")
  var tags: Any
}


@Generable
struct Product {
  @Guide(description: "Product identifier")
  var id: String

  @Guide(description: "Product title")
  var title: String

  @Guide(description: "Product price")
  var price: Double

  @Guide(description: "Product category")
  var category: String

  @Guide(description: "Product availability status")
  var inStock: Bool
}