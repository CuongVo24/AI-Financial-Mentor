import { NativeModules, DeviceEventEmitter, NativeEventEmitter, Platform } from 'react-native';
import { analyzeTransaction } from './api';

const { MomoAccessibilityModule } = NativeModules;

// Interface for the Native Module
interface MomoAccessibilityInterface {
    openAccessibilitySettings(): void;
    isServiceEnabled(): Promise<boolean>;
}

export const AccessibilityService = {
    // Check if Accessibility Service is enabled
    isEnabled: async (): Promise<boolean> => {
        if (Platform.OS !== 'android') return false;
        try {
            return await MomoAccessibilityModule.isServiceEnabled();
        } catch (e) {
            console.error('Failed to check service status:', e);
            return false;
        }
    },

    // Open Android Accessibility Settings
    openSettings: () => {
        if (Platform.OS === 'android') {
            MomoAccessibilityModule.openAccessibilitySettings();
        }
    },

    // Start listening for transaction events
    startListening: () => {
        if (Platform.OS !== 'android') return;

        const eventEmitter = new NativeEventEmitter(MomoAccessibilityModule);

        // Subscribe to "onTransactionDetected" event from Kotlin
        const subscription = eventEmitter.addListener('onTransactionDetected', async (rawText: string) => {
            console.log('⚡️ SPY DETECTED:', rawText);

            try {
                // Send to Backend AI
                const result = await analyzeTransaction(rawText);
                console.log('🤖 AI ANALYSIS:', result);

                // TODO: Show Local Notification or Update State here
            } catch (error) {
                console.error('Failed to process transaction:', error);
            }
        });

        console.log('✅ Spy Listener Activated');
        return () => subscription.remove(); // Return cleanup function
    }
};
