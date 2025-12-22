const { withAndroidManifest, withDangerousMod, withMod, AndroidConfig } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

const SERVICE_NAME = '.MomoAccessibilityService';

const withMomoAccessibilityService = (config) => {

    // 1. Add Service to AndroidManifest.xml (Giữ nguyên)
    config = withAndroidManifest(config, async (config) => {
        const androidManifest = config.modResults;
        const mainApplication = AndroidConfig.Manifest.getMainApplicationOrThrow(androidManifest);

        const serviceExists = mainApplication.service?.some(
            (service) => service.$['android:name'] === SERVICE_NAME
        );

        if (!serviceExists) {
            if (!mainApplication.service) mainApplication.service = [];
            mainApplication.service.push({
                $: {
                    'android:name': SERVICE_NAME,
                    'android:permission': 'android.permission.BIND_ACCESSIBILITY_SERVICE',
                    'android:exported': 'false',
                },
                'intent-filter': [
                    {
                        action: [
                            { $: { 'android:name': 'android.accessibilityservice.AccessibilityService' } },
                        ],
                    },
                ],
                'meta-data': [
                    {
                        $: {
                            'android:name': 'android.accessibilityservice',
                            'android:resource': '@xml/accessibility_service_config',
                        },
                    },
                ],
            });
        }
        return config;
    });

    // 2. Create accessibility_service_config.xml (Giữ nguyên)
    config = withDangerousMod(config, [
        'android',
        async (config) => {
            const resDir = path.join(
                config.modRequest.platformProjectRoot,
                'app/src/main/res/xml'
            );
            if (!fs.existsSync(resDir)) {
                fs.mkdirSync(resDir, { recursive: true });
            }
            const accessibilityConfig = `<?xml version="1.0" encoding="utf-8"?>
<accessibility-service xmlns:android="http://schemas.android.com/apk/res/android"
    android:description="@string/accessibility_service_description"
    android:packageNames="com.mservice.momotransaction" 
    android:accessibilityEventTypes="typeWindowStateChanged|typeWindowContentChanged"
    android:accessibilityFlags="flagDefault|flagIncludeNotImportantViews|flagReportViewIds"
    android:accessibilityFeedbackType="feedbackGeneric"
    android:notificationTimeout="100"
    android:canRetrieveWindowContent="true"
/>`;
            fs.writeFileSync(
                path.join(resDir, 'accessibility_service_config.xml'),
                accessibilityConfig
            );
            return config;
        },
    ]);

    // 3. FIX: Dùng withMod trực tiếp để inject String Resource
    config = withMod(config, {
        platform: 'android',
        mod: 'strings',
        action: (config) => {
            config.modResults = AndroidConfig.Strings.setStringItem(
                [
                    {
                        $: { name: 'accessibility_service_description' },
                        _: 'Money Locket Transaction Scanner (Layer 1)',
                    },
                ],
                config.modResults
            );
            return config;
        },
    });

    return config;
};

module.exports = withMomoAccessibilityService;