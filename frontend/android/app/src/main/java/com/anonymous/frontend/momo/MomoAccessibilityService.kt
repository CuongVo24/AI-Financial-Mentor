package com.anonymous.frontend.momo

import android.accessibilityservice.AccessibilityService
import android.view.accessibility.AccessibilityEvent
import android.view.accessibility.AccessibilityNodeInfo
import android.util.Log
import android.content.Intent
import android.os.Bundle

class MomoAccessibilityService : AccessibilityService() {

    private val TARGET_PACKAGE = "com.mservice.momotransfer" // MoMo package
    private val TAG = "MomoSpy"
    
    // De-duplication Cache
    private var lastProcessedText: String = ""
    private var lastProcessedTime: Long = 0
    private val DEBOUNCE_TIME_MS = 5000 // 5 seconds

    override fun onServiceConnected() {
        super.onServiceConnected()
        Log.d(TAG, "Money Locket Spy Service Connected")
    }

    override fun onAccessibilityEvent(event: AccessibilityEvent?) {
        if (event == null) return

        // 1. Package Filter
        if (event.packageName?.toString() != TARGET_PACKAGE) return

        // 2. Event Type Filter (We usually care about content changes or state changes)
        if (event.eventType != AccessibilityEvent.TYPE_WINDOW_CONTENT_CHANGED &&
            event.eventType != AccessibilityEvent.TYPE_WINDOW_STATE_CHANGED) {
            return
        }

        val rootNode = rootInActiveWindow ?: return

        // 3. Privacy & Parsing Check
        // We traverse the tree looking for success indicators while avoiding password fields
        // 3. Privacy & Parsing Check
        // We traverse the tree looking for success indicators while avoiding password fields
        if (hasSuccessIndicator(rootNode)) {
            val fullText = getAllTextFromNode(rootNode)
            handleTransactionSuccess(fullText)
        }
        
        // Always recycle the node to prevent memory leaks
        rootNode.recycle()
    }

    private fun hasSuccessIndicator(node: AccessibilityNodeInfo?): Boolean {
        if (node == null) return false

        // --- PRIVACY BLIND SPOT CHECK ---
        // If this node is a password field, we completely ignore this branch
        if (node.isPassword) {
            return false
        }

        // Check specifically for MoMo's "Success" indicator
        // Based on bank_rules.json: Anchor is usually "Giao dịch thành công"
        val text = node.text?.toString() ?: ""
        val contentDesc = node.contentDescription?.toString() ?: ""
        
        if (text.contains("Giao dịch thành công", ignoreCase = true) || 
            contentDesc.contains("Giao dịch thành công", ignoreCase = true)) {
            return true
        }

        // Recursive traversal
        for (i in 0 until node.childCount) {
            val child = node.getChild(i)
            val found = hasSuccessIndicator(child)
            if (child != null) child.recycle()
            
            if (found) {
                return true
            }
        }

        return false
    }

    private fun getAllTextFromNode(node: AccessibilityNodeInfo?): String {
        if (node == null) return ""
        if (node.isPassword) return "" // Redundant check for safety

        val sb = StringBuilder()
        
        // Capture visible text
        if (!node.text.isNullOrEmpty()) {
            sb.append(node.text).append("\n")
        }
        
        // Traverse children
        for (i in 0 until node.childCount) {
            val child = node.getChild(i)
            sb.append(getAllTextFromNode(child))
            if (child != null) child.recycle()
        }
        return sb.toString()
    }

    private fun handleTransactionSuccess(rawText: String) {
        val currentTime = System.currentTimeMillis()

        // --- DE-DUPLICATION LOGIC ---
        // If same text appeared within 5 seconds, ignore it.
        if (rawText == lastProcessedText && (currentTime - lastProcessedTime) < DEBOUNCE_TIME_MS) {
            Log.d(TAG, "Duplicate transaction detected. Skipping.")
            return
        }

        lastProcessedText = rawText
        lastProcessedTime = currentTime

        Log.d(TAG, "Transaction Captured: $rawText")

        // --- BRIDGE TO REACT NATIVE ---
        // We broadcast an event that the Module listens to
        MomoAccessibilityModule.emitEvent(rawText)
    }

    override fun onInterrupt() {
        Log.d(TAG, "Service Interrupted")
    }
}