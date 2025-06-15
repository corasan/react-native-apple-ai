#include <jni.h>
#include "FoundationModelsOnLoad.hpp"

JNIEXPORT jint JNICALL JNI_OnLoad(JavaVM* vm, void*) {
  return margelo::nitro::foundationmodels::initialize(vm);
}
