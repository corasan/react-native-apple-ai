#pragma once

#include "HybridFoundationModelsSpec.hpp"
#include <string>

namespace margelo::nitro::foundationmodels {
  class HybridFoundationModels: public HybridFoundationModelsSpec {
  public:
    HybridFoundationModels(): HybridObject(TAG) {}

    std::string hello(const std::string& name);
    double add(double a, double b);
  };
} // namespace margelo::nitro::foundationmodels
