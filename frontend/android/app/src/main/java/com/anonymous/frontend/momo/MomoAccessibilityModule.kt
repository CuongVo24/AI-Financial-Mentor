package com.anonymous.frontend.momo

import android.content.Intent
import android.provider.Settings
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.facebook.react.bridge.Promise
import android.content.Context
import android.text.TextUtils
import android.view.accessibility.AccessibilityManager

class MomoAccessibilityModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    init {
        // Register this module instance to receive static events from the Service
        instance = this
    }

    companion object {
        private var instance: MomoAccessibilityModule? = null

        // Static method called by the Service
        fun emitEvent(data: String) {
            instance?.sendEvent("onTransactionDetected", data)
        }
    }

    override fun getName(): String {
        return "MomoAccessibilityModule"
    }

    private fun sendEvent(eventName: String, data: String) {
        if (reactApplicationContext.hasActiveCatalystInstance()) {
            reactApplicationContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                .emit(eventName, data)
        }
    }

    @ReactMethod
    fun openAccessibilitySettings() {
        val intent = Intent(Settings.ACTION_ACCESSIBILITY_SETTINGS)
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        reactApplicationContext.startActivity(intent)
    }

    @ReactMethod
    fun isServiceEnabled(promise: Promise) {
        val context = reactApplicationContext
        val expectedServiceName = "${context.packageName}/${MomoAccessibilityService::class.java.canonicalName}"
        
        val accessibilityEnabled = Settings.Secure.getInt(
            context.contentResolver,
            Settings.Secure.ACCESSIBILITY_ENABLED, 0
        )

        if (accessibilityEnabled == 1) {
            val settingValue = Settings.Secure.getString(
                context.contentResolver,
                Settings.Secure.ENABLED_ACCESSIBILITY_SERVICES
            )
            if (settingValue != null) {
                val splitter = TextUtils.SimpleStringSplitter(':')
                splitter.setString(settingValue)
                while (splitter.hasNext()) {
                    val service = splitter.next()
                    if (service.contains(MomoAccessibilityService::class.java.simpleName)) {
                        promise.resolve(true)
                        return
                    }
                }
            }
        }
        promise.resolve(false)
    }
}