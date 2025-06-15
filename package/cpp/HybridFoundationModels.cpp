#include "HybridFoundationModels.hpp"

namespace margelo::nitro::foundationmodels {
  std::string HybridFoundationModels::hello(const std::string& name) {
    return "Hello " + name + " from FoundationModels!";
  }

  double HybridFoundationModels::add(double a, double b) {
    return a + b;
  }
} // namespace margelo::nitro::foundationmodels
