package com.margelo.nitro.foundationmodels

import androidx.annotation.Keep
import com.facebook.proguard.annotations.DoNotStrip

@Keep
@DoNotStrip
class HybridFoundationModels: HybridFoundationModelsSpec() {

    override fun hello(name: String): String {
        return "Hello $name from FoundationModels!"
    }

    override fun add(a: Double, b: Double): Double {
        return a + b
    }
}
