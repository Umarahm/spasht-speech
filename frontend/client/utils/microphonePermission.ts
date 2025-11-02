/**
 * Microphone Permission Helper for Android PWA
 * Handles Android-specific microphone permission issues
 */

export interface MicrophonePermissionResult {
    success: boolean;
    stream?: MediaStream;
    error?: string;
    errorType?: 'NotAllowedError' | 'NotFoundError' | 'NotReadableError' | 'SecurityError' | 'UnknownError';
}

/**
 * Request microphone permission with Android-specific handling
 */
export async function requestMicrophonePermission(
    constraints: MediaStreamConstraints = { audio: true }
): Promise<MicrophonePermissionResult> {
    try {
        // Check if we're in a secure context
        if (!window.isSecureContext) {
            return {
                success: false,
                error: 'Microphone requires HTTPS. Please use the HTTPS version of the app or install the PWA from a secure origin.',
                errorType: 'SecurityError'
            };
        }

        // Check if getUserMedia is available
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            return {
                success: false,
                error: 'Microphone API not supported. Please use Chrome, Edge, or Firefox on Android.',
                errorType: 'UnknownError'
            };
        }

        // Check permission state (Android Chrome supports this)
        try {
            const permissionStatus = await (navigator as any).permissions?.query?.({ name: 'microphone' as PermissionName });
            if (permissionStatus) {
                console.log('Microphone permission state:', permissionStatus.state);

                if (permissionStatus.state === 'denied') {
                    return {
                        success: false,
                        error: 'Microphone permission is blocked. On Android: Settings > Apps > [App Name] > Permissions > Microphone > Allow',
                        errorType: 'NotAllowedError'
                    };
                }
            }
        } catch (permError) {
            // Permission query API not supported, continue anyway
            console.log('Permission query API not available, proceeding with getUserMedia');
        }

        // Request microphone access
        // On Android, we need to be more permissive with constraints
        const audioConstraints: MediaTrackConstraints = {
            echoCancellation: constraints.audio === true ? true : (constraints.audio as MediaTrackConstraints)?.echoCancellation ?? true,
            noiseSuppression: constraints.audio === true ? true : (constraints.audio as MediaTrackConstraints)?.noiseSuppression ?? true,
            autoGainControl: constraints.audio === true ? true : (constraints.audio as MediaTrackConstraints)?.autoGainControl ?? true,
            // Android-specific: don't specify sampleRate/channelCount initially
            ...(constraints.audio !== true && constraints.audio ? constraints.audio : {})
        };

        console.log('Requesting microphone with constraints:', audioConstraints);

        const stream = await navigator.mediaDevices.getUserMedia({
            audio: audioConstraints
        });

        // Verify stream has audio tracks
        const audioTracks = stream.getAudioTracks();
        if (audioTracks.length === 0) {
            stream.getTracks().forEach(track => track.stop());
            return {
                success: false,
                error: 'No audio tracks found in microphone stream.',
                errorType: 'NotFoundError'
            };
        }

        console.log('Microphone permission granted, audio tracks:', audioTracks.length);
        return {
            success: true,
            stream
        };

    } catch (error: any) {
        console.error('Microphone permission error:', error);

        let errorMessage = 'Microphone access failed. ';
        let errorType: MicrophonePermissionResult['errorType'] = 'UnknownError';

        switch (error.name) {
            case 'NotAllowedError':
            case 'PermissionDeniedError':
                errorMessage = 'Microphone permission denied. ';
                errorMessage += 'On Android: Go to Settings > Apps > [App Name] > Permissions > Microphone > Allow. ';
                errorMessage += 'Or tap the lock icon in the address bar and allow microphone access.';
                errorType = 'NotAllowedError';
                break;

            case 'NotFoundError':
            case 'DevicesNotFoundError':
                errorMessage = 'No microphone found. Please connect a microphone and try again.';
                errorType = 'NotFoundError';
                break;

            case 'NotReadableError':
            case 'TrackStartError':
                errorMessage = 'Microphone is already in use by another app. Please close other apps using the microphone and try again.';
                errorType = 'NotReadableError';
                break;

            case 'SecurityError':
                errorMessage = 'Microphone access blocked for security reasons. Please ensure you are using HTTPS.';
                errorType = 'SecurityError';
                break;

            case 'OverconstrainedError':
                errorMessage = 'Microphone constraints not supported. Trying with default settings...';
                // Retry with simpler constraints
                try {
                    const fallbackStream = await navigator.mediaDevices.getUserMedia({ audio: true });
                    return {
                        success: true,
                        stream: fallbackStream
                    };
                } catch (fallbackError: any) {
                    errorMessage = 'Could not access microphone with any settings. ' + (fallbackError.message || '');
                }
                break;

            default:
                errorMessage += error.message || 'Unknown error occurred.';
        }

        return {
            success: false,
            error: errorMessage,
            errorType
        };
    }
}

/**
 * Check if microphone permission is already granted
 */
export async function checkMicrophonePermission(): Promise<'granted' | 'denied' | 'prompt' | 'unknown'> {
    try {
        if ('permissions' in navigator) {
            const permissionStatus = await (navigator as any).permissions.query({ name: 'microphone' as PermissionName });
            return permissionStatus.state;
        }

        // Fallback: try to get a stream (this will prompt if needed)
        try {
            const nav = navigator as Navigator & { mediaDevices?: MediaDevices };
            if (nav.mediaDevices && nav.mediaDevices.getUserMedia) {
                const stream = await nav.mediaDevices.getUserMedia({ audio: true });
                stream.getTracks().forEach(track => track.stop());
                return 'granted';
            }
            return 'denied';
        } catch {
            return 'denied';
        }
    } catch {
        return 'unknown';
    }
}

/**
 * Get user-friendly error message for Android
 */
export function getAndroidPermissionInstructions(): string {
    return `To enable microphone on Android:
1. Tap the lock icon (🔒) in the address bar
2. Select "Site settings"
3. Find "Microphone" and set to "Allow"
4. Refresh the page

Or:
1. Go to Android Settings > Apps
2. Find this app
3. Tap Permissions > Microphone > Allow`;
}
